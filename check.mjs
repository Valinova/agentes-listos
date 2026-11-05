#!/usr/bin/env node
// Revisa la seguridad básica del proyecto. Sin dependencias. Uso: node check.mjs
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const SCHEDULE = "https://raw.githubusercontent.com/nodejs/Release/main/schedule.json";
const MIN_RELEASE_AGE = 2880;

const fails = [];
const warns = [];

const run = (cmd, args) =>
  spawnSync(cmd, args, { encoding: "utf8", shell: process.platform === "win32" });
const read = (file) => (existsSync(file) ? readFileSync(file, "utf8") : "");

function checkLockfiles() {
  for (const file of ["package-lock.json", "npm-shrinkwrap.json", "yarn.lock", "bun.lock", "bun.lockb"]) {
    if (existsSync(file)) fails.push(`Borra ${file}: este proyecto usa solo pnpm.`);
  }
  const lock = read("pnpm-lock.yaml");
  if (!lock) {
    fails.push("Falta pnpm-lock.yaml. Corre: sfw pnpm install");
    return;
  }
  const lines = lock.split("\n");
  lines.forEach((line, i) => {
    if (/resolution:.*(tarball:|type: git|gitHosted)/.test(line)) {
      fails.push(`Paquete fuera del registro de npm: ${lines[i - 1].trim().slice(0, 80)}`);
    }
  });
  if (run("pnpm", ["install", "--frozen-lockfile", "--lockfile-only"]).status !== 0) {
    fails.push("pnpm-lock.yaml no coincide con package.json. Corre: sfw pnpm install");
  }
}

function checkPolicy() {
  const yaml = read("pnpm-workspace.yaml");
  const value = (key) => yaml.match(new RegExp(`^${key}:[ \\t]*([^#\\s]*)`, "m"))?.[1];
  if (!(Number(value("minimumReleaseAge")) >= MIN_RELEASE_AGE)) {
    fails.push(`pnpm-workspace.yaml: minimumReleaseAge debe ser ${MIN_RELEASE_AGE} o más (48 horas).`);
  }
  for (const [key, expected] of [
    ["trustPolicy", "no-downgrade"],
    ["blockExoticSubdeps", "true"],
    ["strictDepBuilds", "true"],
  ]) {
    if (value(key) !== expected) fails.push(`pnpm-workspace.yaml: ${key} debe ser ${expected}.`);
  }
  if (value("dangerouslyAllowAllBuilds") === "true") {
    fails.push("pnpm-workspace.yaml: quita dangerouslyAllowAllBuilds.");
  }
  if (value("minimumReleaseAgeStrict") === "false") {
    fails.push("pnpm-workspace.yaml: quita minimumReleaseAgeStrict.");
  }
  for (const key of ["allowBuilds", "minimumReleaseAgeExclude", "trustPolicyExclude"]) {
    if (value(key) !== undefined) warns.push(`pnpm-workspace.yaml tiene excepciones en ${key}. Revisa que sigan siendo necesarias.`);
  }
}

function checkEngines(pkg) {
  const { packageManager: manager, runtime } = pkg.devEngines ?? {};
  if (manager?.name !== "pnpm" || manager?.onFail !== "error") {
    fails.push('package.json: devEngines.packageManager debe exigir pnpm con onFail "error".');
  }
  if (runtime?.name !== "node" || runtime?.onFail !== "error" || !runtime?.version) {
    fails.push('package.json: devEngines.runtime debe exigir una versión de node con onFail "error".');
  }
}

async function checkNode(pkg) {
  const declared = [
    process.version,
    pkg.devEngines?.runtime?.version,
    pkg.engines?.node,
    read(".nvmrc"),
    read(".node-version"),
  ];
  const majors = new Set(declared.map((v) => String(v ?? "").match(/\d+/)?.[0]).filter(Boolean));
  let schedule;
  try {
    const res = await fetch(SCHEDULE, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    schedule = await res.json();
  } catch (error) {
    fails.push(`No pude consultar qué versiones de Node siguen vigentes: ${error.message}`);
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  for (const major of majors) {
    const end = schedule[`v${major}`]?.end;
    if (end && end < today) {
      fails.push(`Node ${major} perdió soporte el ${end} y ya no recibe parches de seguridad. Actualiza a una versión vigente.`);
    }
  }
}

function checkFiles() {
  const tracked = run("git", ["ls-files"]);
  if (tracked.status !== 0) {
    fails.push("Esta carpeta no es un repositorio de git. Corre: git init");
  } else {
    for (const file of tracked.stdout.split("\n")) {
      if (/(^|\/)\.env(\.[^/]*)?$/.test(file)) {
        fails.push(`${file} está en git. Sácalo y cambia todas las claves que contenía; ya hay que darlas por filtradas.`);
      }
    }
  }
  if (!existsSync(".github/CODEOWNERS")) {
    fails.push("Falta .github/CODEOWNERS: alguien debe aprobar los paquetes nuevos.");
  }
}

function checkAudit() {
  const audit = run("pnpm", ["audit", "--audit-level", "high"]);
  if (audit.status !== 0) {
    fails.push("pnpm audit encontró vulnerabilidades altas o no pudo correr. Revísalo con: pnpm audit");
  }
}

function checkOutdated() {
  const outdated = run("pnpm", ["outdated", "--format", "json"]);
  let packages;
  try {
    packages = JSON.parse(outdated.stdout);
  } catch {
    warns.push("No pude revisar paquetes desactualizados con pnpm outdated.");
    return;
  }
  for (const [name, { current, latest, isDeprecated }] of Object.entries(packages)) {
    if (isDeprecated) warns.push(`${name} está abandonado por su autor (deprecated).`);
    if (parseInt(latest) > parseInt(current)) warns.push(`${name} ${current} está atrasado: la última versión es ${latest}.`);
  }
}

let pkg = {};
try {
  pkg = JSON.parse(readFileSync("package.json", "utf8"));
} catch (error) {
  fails.push(`No pude leer package.json: ${error.message}`);
}

checkLockfiles();
checkPolicy();
checkEngines(pkg);
await checkNode(pkg);
checkFiles();
checkAudit();
checkOutdated();

for (const warning of warns) console.log(`🟡 ${warning}`);
for (const failure of fails) console.log(`🔴 ${failure}`);
if (fails.length > 0) process.exit(1);
console.log("🟢 Todo bien.");
