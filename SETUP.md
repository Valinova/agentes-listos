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
   pnpm config set --global saveExact true
   npm config set min-release-age 2 --location=user
   ```

4. **Claude Code**, si está instalado.
   - En `~/.claude/CLAUDE.md`, agrega la línea `@~/.agentes-listos/AGENTS.md`.
   - En `~/.claude/settings.json`, agrega a `permissions.deny` cada regla de `~/.agentes-listos/.claude/settings.json`.
   - Enlaza cada carpeta de `~/.agentes-listos/skills/` en `~/.claude/skills/`.
   - Activa los extras visuales (necesitan Claude Code 2.1.287 o más reciente): en `env` de `~/.claude/settings.json`, agrega a `CLAUDE_CODE_PLUGIN_DIRS` el valor `~/.agentes-listos/mods/diagrams:~/.agentes-listos/mods/usage-meters`, separado con `:` de lo que ya tenga.

5. **Codex**, si está instalado.
   - En `~/.codex/AGENTS.md`, deja el contenido de `~/.agentes-listos/AGENTS.md` entre `<!-- agentes-listos -->` y `<!-- /agentes-listos -->`, reemplazando lo que ya haya entre esas marcas.
   - Copia `~/.agentes-listos/.codex/rules/agentes-listos.rules` en `~/.codex/rules/`.
   - Enlaza cada carpeta de `~/.agentes-listos/skills/` en `~/.codex/skills/`.

   Si no se pueden crear enlaces en este sistema, copia la carpeta.

6. **Comprobar.** Confirma con `pnpm config get minimumReleaseAge` y leyendo cada archivo que cambiaste. Avisa, sin cambiarlo, si `defaultMode` es `bypassPermissions`: el agente actuará sin preguntar.

7. **Secretos.** Explica la regla en una frase: las claves de producción se quedan solo en el panel de su proveedor, y en local van claves de desarrollo en `.env.local`, fuera de git. Si trabaja en equipo o con datos reales, recomienda un gestor de contraseñas (1Password con `op run`, o el que ya use).

8. **Limpiar lo acumulado.** Revisa lo que ya había en `~/.claude` (instrucciones, permisos, hooks, habilidades, plugins), los servidores MCP de `~/.claude.json` y lo mismo en `~/.codex`. Busca solo lo que contradiga estas reglas, esté duplicado o parezca abandonado. Nunca muestres el valor de una clave.
   - Si no hay nada, no digas nada. Si hay algo, muestra una lista corta: qué es, por qué estorba y qué propones, en palabras simples.
   - No quites nada sin que la persona lo apruebe, punto por punto: algo que parece inútil puede estar en uso. Antes de quitarlo, guarda una copia en `~/.agentes-listos-respaldo/<fecha>/` y dile dónde quedó.

9. **Cerrar.** Dile a la persona, en pocas palabras, qué quedó listo y qué falta, y pídele que reinicie el agente para que las reglas apliquen. Luego preséntale sus habilidades con un ejemplo de cada una; si es una actualización, solo las nuevas:
   - "Revisa mi proyecto": ve el estado general y qué arreglar primero.
   - "Simplifica esto": quita lo que sobra sin cambiar lo que hace.
   - "Revisa lo que acabo de hacer": corrige errores en los cambios recientes.
   - "Revisa los comentarios": corrige los falsos y quita los que sobran.
   - En React, `evitar-use-effect` se aplica sola.
