# Configuración de la máquina

Instrucciones para el agente. Deja esta máquina configurada para todos los proyectos. Puedes correrlas varias veces: el resultado debe ser el mismo.

Explica cada paso en una frase simple. Conserva toda la configuración que ya exista: combina, nunca reemplaces. Si necesitas a la persona, detente y dile exactamente qué hacer.

1. **Versión.** En `~/.agentes-listos`, trae las etiquetas y cámbiate a la más reciente: `git fetch --tags`, `git tag --sort=-v:refname | head -1`. Si es una actualización, resume qué cambió.

2. **Herramientas.**
   - Node 24 o 26. Si hay otra versión, ayuda a actualizarla; los proyectos que dependan de una versión vieja se revisan aparte.
   - Si falta pnpm: `npm install -g pnpm@12`, luego `pnpm setup`. Déjalo al día: `pnpm self-update`.
   - Socket: `pnpm add -g sfw@2.0.6`.

3. **Paquetes en toda la máquina.**
   ```sh
   pnpm config set --global minimumReleaseAge 2880
   pnpm config set --global trustPolicy no-downgrade
   pnpm config set --global blockExoticSubdeps true
   pnpm config set --global strictDepBuilds true
   npm config set min-release-age 2 --location=user
   ```

4. **Claude Code**, si está instalado.
   - En `~/.claude/CLAUDE.md`, agrega la línea `@~/.agentes-listos/AGENTS.md`.
   - En `~/.claude/settings.json`, agrega a `permissions.deny` cada regla de `~/.agentes-listos/.claude/settings.json`.
   - Enlaza `~/.agentes-listos/skills/revisar-proyecto` en `~/.claude/skills/revisar-proyecto`.
   - Instala los extras visuales. Necesitan Claude Code 2.1.287 o más reciente; si es una actualización, corre también `claude plugin marketplace update agentes-listos`.
     ```sh
     claude plugin marketplace add ~/.agentes-listos
     claude plugin install diagrams@agentes-listos
     claude plugin install usage-meters@agentes-listos
     ```

5. **Codex**, si está instalado.
   - En `~/.codex/AGENTS.md`, deja el contenido de `~/.agentes-listos/AGENTS.md` entre `<!-- agentes-listos -->` y `<!-- /agentes-listos -->`, reemplazando lo que ya haya entre esas marcas.
   - Copia `~/.agentes-listos/.codex/rules/agentes-listos.rules` en `~/.codex/rules/`.
   - Enlaza la misma habilidad en `~/.codex/skills/revisar-proyecto`.

   Si no se pueden crear enlaces en este sistema, copia la carpeta.

6. **Comprobar.** Confirma con `pnpm config get minimumReleaseAge` y leyendo cada archivo que cambiaste. Avisa, sin cambiarlo, si `defaultMode` es `bypassPermissions`: el agente actuará sin preguntar.

7. **Secretos.** Explica la regla en una frase: las claves de producción se quedan solo en el panel de su proveedor, y en local van claves de desarrollo en `.env.local`, fuera de git. Si trabaja en equipo o con datos reales, recomienda un gestor de contraseñas (1Password con `op run`, o el que ya use).

8. **Cerrar.** Dile a la persona, en pocas palabras, qué quedó listo y qué falta. Pídele que reinicie el agente para que las reglas apliquen, y que dentro de un proyecto diga "revisa mi proyecto".
