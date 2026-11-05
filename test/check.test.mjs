// Corre check.mjs de verdad (pnpm, git y red reales) contra proyectos desechables:
// cada fila es un problema visto en proyectos reales que debe poner el check en rojo.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function project(mutate = () => {}) {
  const dir = mkdtempSync(join(tmpdir(), "base-segura-"));
  for (const file of ["package.json", "pnpm-workspace.yaml", "pnpm-lock.yaml"]) {
    copyFileSync(join(root, file), join(dir, file));
  }
  mkdirSync(join(dir, ".github"));
  writeFileSync(join(dir, ".github/CODEOWNERS"), "* @alguien\n");
  const sh = (cmd, ...args) => {
    const out = spawnSync(cmd, args, { cwd: dir, encoding: "utf8" });
    assert.equal(out.status, 0, `${cmd} ${args.join(" ")}: ${out.stdout}${out.stderr}`);
  };
  const pkg = (change) => {
    const file = join(dir, "package.json");
    const json = JSON.parse(readFileSync(file, "utf8"));
    change(json);
    writeFileSync(file, JSON.stringify(json));
  };
  sh("git", "init", "-q");
  mutate({ dir, sh, pkg, write: (name, text) => writeFileSync(join(dir, name), text) });
  const out = spawnSync("node", [join(root, "check.mjs")], { cwd: dir, encoding: "utf8" });
  rmSync(dir, { recursive: true, force: true });
  return out;
}

const weaken = (from, to) => ({ dir, write }) =>
  write("pnpm-workspace.yaml", readFileSync(join(dir, "pnpm-workspace.yaml"), "utf8").replace(from, to));

test("un proyecto limpio pasa", () => {
  const out = project();
  assert.equal(out.status, 0, out.stdout);
  assert.match(out.stdout, /Todo bien/);
});

const red = [
  ["package-lock.json de npm", /Borra package-lock/, ({ write }) => write("package-lock.json", "{}")],
  ["bun.lock", /Borra bun.lock/, ({ write }) => write("bun.lock", "{}")],
  ["sin lockfile", /Falta pnpm-lock/, ({ dir }) => rmSync(join(dir, "pnpm-lock.yaml"))],
  ["lockfile desactualizado", /no coincide/, ({ pkg }) => pkg((p) => { p.dependencies = { "is-number": "7.0.0" }; })],
  ["dependencia directa de git", /fuera del registro/, ({ sh }) => sh("pnpm", "add", "--lockfile-only", "github:jonschlinkert/is-number")],
  ["cooldown desactivado", /minimumReleaseAge debe/, weaken(/minimumReleaseAge: \d+/, "minimumReleaseAge: 0")],
  ["todos los scripts permitidos", /dangerouslyAllowAllBuilds/, weaken("strictDepBuilds: true", "strictDepBuilds: true\ndangerouslyAllowAllBuilds: true")],
  ["sin candado de pnpm", /devEngines.packageManager/, ({ pkg }) => pkg((p) => { delete p.devEngines.packageManager; })],
  ["Node 20 declarado", /Node 20 perdió soporte/, ({ pkg }) => pkg((p) => { p.engines = { node: ">=20" }; })],
  ["Node viejo en .nvmrc", /Node 18 perdió soporte/, ({ write }) => write(".nvmrc", "18.19.0\n")],
  [".env dentro de git", /\.env está en git/, ({ write, sh }) => { write(".env", "CLAVE=x\n"); sh("git", "add", ".env"); }],
  ["vulnerabilidad alta", /pnpm audit/, ({ sh }) => sh("pnpm", "add", "--lockfile-only", "lodash@4.17.15")],
];

for (const [name, message, mutate] of red) {
  test(`rojo: ${name}`, () => {
    const out = project(mutate);
    assert.equal(out.status, 1, out.stdout);
    assert.match(out.stdout, message);
  });
}

// Lo que no pone en riesgo a nadie todavía avisa, pero no debe estorbar.
const yellow = [
  ["TypeScript atrasado", /typescript 5\.4\.5 está atrasado/, ({ sh }) => sh("pnpm", "add", "-D", "--ignore-scripts", "typescript@5.4.5")],
  ["sin git", /Sin git puedes perder/, ({ dir }) => rmSync(join(dir, ".git"), { recursive: true, force: true })],
  ["sin CODEOWNERS", /Sin .github\/CODEOWNERS/, ({ dir }) => rmSync(join(dir, ".github/CODEOWNERS"))],
  ["Node sin parches de seguridad", /Node 24\.1\.0 no tiene/, ({ write }) => write(".nvmrc", "24.1.0\n")],
];

for (const [name, message, mutate] of yellow) {
  test(`amarillo: ${name}`, () => {
    const out = project(mutate);
    assert.equal(out.status, 0, out.stdout);
    assert.match(out.stdout, message);
  });
}
