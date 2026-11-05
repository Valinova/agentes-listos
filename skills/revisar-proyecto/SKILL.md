---
name: revisar-proyecto
description: Revisa las buenas prácticas de un proyecto y da una lista priorizada, sin cambiar nada hasta que la persona lo apruebe. Úsala cuando pidan revisar o auditar el proyecto, o prepararlo para agentes-listos.
---

# Revisar el proyecto

Solo mira hasta que la persona apruebe un cambio. Nunca muestres el valor de un secreto.

## Qué revisar

1. **Trabajo guardado.** ¿Hay git y un repositorio remoto? ¿Hay cambios sin commit o commits sin subir? Si el repositorio es público, confirma que sea a propósito.
2. **Reglas básicas.** Corre `node ~/.agentes-listos/check.mjs` desde la raíz del proyecto. En un proyecto sin preparar saldrá mucho rojo: es la lista de pendientes, no una alarma.
3. **Reglas anuladas.** Busca lo que debilite la configuración de la máquina:
   - `pnpm-workspace.yaml`, `.npmrc` y `package.json`: cooldown en 0, scripts permitidos, excepciones sin motivo o paquetes fuera del registro.
   - `.claude/settings*.json` y `.codex/`: permisos amplios, `bypassPermissions` o hooks que no entiendas.
   - `AGENTS.md` y `CLAUDE.md`: instrucciones que contradigan las reglas de paquetes, secretos o git.
   - `.github/workflows/`: acciones sin fijar a un commit, o permisos de sobra.
4. **Secretos.** Claves en el código, en git o en variables `NEXT_PUBLIC_` o `VITE_`. Una clave que estuvo en git hay que cambiarla.
5. **Seguridad de la app.** ¿Cada acción comprueba en el servidor quién es el usuario y qué puede hacer? ¿Las tablas tienen reglas de acceso (RLS)? ¿Se valida lo que llega de afuera?
6. **Código fuera de control.** En las partes principales de la app, no en todo: la misma regla o dato decidido en dos lugares, código sin uso, capas que no deciden nada, opciones que nadie usa y errores que se esconden. Propón solo la simplificación que más ayudaría y cómo comprobar que nada se rompe. "Está bien como está" es un resultado válido. Nunca simplifiques quitando permisos, identidad o errores honestos.

## Cómo informar

Ordena por lo que más daño puede causar. Por cada punto: qué pasa, qué riesgo tiene en palabras simples y qué propones. Di también qué no pudiste comprobar. Pregunta qué quiere arreglar.

## Preparar el proyecto, si la persona acepta

Haz un cambio a la vez y comprueba que la app siga funcionando.

- **Copia** desde `~/.agentes-listos`: `check.mjs`, `pnpm-workspace.yaml` y `.github/workflows/check.yml`. Agrega `.gitignore` a lo existente y copia `devEngines` y el script `check` a `package.json`.
- **Pasa a pnpm** conservando versiones: `pnpm import`, borra los otros lockfiles y corre `sfw pnpm install`.
- **Secretos:** deja solo claves de desarrollo en `.env.local`, fuera de git, y las de producción en el panel de su proveedor. En equipos o apps con datos reales, recomienda un gestor de contraseñas.
- **Node:** declara 24 o 26. Un proyecto nuevo usa 26 si su hosting y sus paquetes lo soportan; si no, 24. Revisa también la versión configurada en el hosting.
- **Paquetes:** una actualización grande a la vez, y pruébala.
- **Si tiene usuarios o datos reales:** recomienda proteger `main` en GitHub con pull request y el check `check` en verde. Si hay un responsable de los paquetes, agrégalo en `.github/CODEOWNERS` y exige su aprobación. Quien trabaja solo no puede aprobar sus propios cambios: solo exige el check.
