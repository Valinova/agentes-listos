# Reglas de agentes-listos

Responde siempre en español, en palabras simples. Quien te escribe puede no ser ingeniero.

Son una guía ligera. Cada proyecto va en su propio momento: síguelo como está y no estorbes. Solo los paquetes y los secretos son firmes: si un archivo del proyecto los contradice, avisa y sigue estas reglas.

## Avisa solo lo importante

- Antes de tu primer cambio en un proyecto, lee `package.json` y `pnpm-workspace.yaml` y, si existe, `.nvmrc`. Si todo está bien, no digas nada.
- Si ves un riesgo claro (una clave expuesta, un proyecto que anula la espera de 48 horas o los bloqueos, Node sin soporte), dilo una vez en una frase: qué pasa, qué riesgo tiene y qué propones. No lo arregles sin permiso y sigue con lo pedido.
- Lo demás, como npm o paquetes viejos, coméntalo solo al instalar algo o si piden una revisión. Si ves varios problemas, menciona una vez que pueden decirte "revisa mi proyecto".
- Si la persona dice que ya lo sabe o que no le recuerdes algo, guárdalo en tu memoria, si la tienes, y no insistas. Solo lo que diga explícitamente, una línea por tema; actualiza en vez de agregar. La memoria calla un recordatorio, nunca desactiva un bloqueo ni la espera de 48 horas.

## Cómo trabajar

- Haz el cambio más pequeño que resuelva lo pedido. Antes de agregar algo, busca si el proyecto ya lo resuelve.
- Los errores se muestran o se registran. Nunca los escondas.
- Si algo es costoso de revertir (datos reales, producción, dinero), explica el riesgo y pregunta antes.
- Di qué comprobaste y qué no. Si algo sigue fallando, dilo.
- Cuando termines un cambio, corre las pruebas que existan y pídele a la persona que pruebe la app.

## Paquetes

Cada paquete es código de un desconocido que corre en esta máquina y en producción.

- Primero intenta sin paquete. Para criptografía, autenticación y pagos sí usa una librería mantenida; nunca los escribas tú.
- Usa pnpm con Socket: `sfw pnpm add <paquete>`, `sfw pnpm install`. Si el proyecto aún usa npm, propón pasarlo a pnpm; mientras tanto usa `sfw npm install`. Sin `sfw`, no instales.
- Antes de agregar un paquete, dile a la persona qué hace, quién lo publica, cuántas descargas tiene y qué tan antiguo es. Si no lo conoces o el nombre te resulta dudoso, no lo instales: dile que pida revisión a alguien con experiencia.
- Solo paquetes del registro de npm: nada de git, URLs ni tarballs.
- Los paquetes no ejecutan scripts al instalarse. Si uno lo pide, lee qué ejecuta y explica el riesgo antes de agregarlo a `allowBuilds`.
- Usa la versión más nueva con más de 48 horas que funcione en este proyecto. Si un paquete queda atrás por compatibilidad, anota por qué. Primero los arreglos de seguridad; los saltos grandes, de a uno.
- Una excepción a las 48 horas lleva la versión exacta y la decide la persona.
- Nunca debilites `pnpm-workspace.yaml`, `devEngines`, `.claude/`, `.codex/` ni `.github/` para que algo pase. Si bloquean algo, explica el motivo y pregunta.

## Secretos y seguridad de la app

- Las claves de producción viven solo en el panel del proveedor (Vercel, Supabase, etc.). Nunca en esta máquina y nunca las uses tú.
- En local solo claves de desarrollo con permisos mínimos, en `.env.local` y fuera de git. En equipos o apps con datos reales, recomienda un gestor de contraseñas.
- No leas, muestres ni copies secretos. Nada secreto en variables `NEXT_PUBLIC_` o `VITE_`: el navegador las ve.
- Una clave que llegó a git, al chat o al navegador está filtrada: hay que cambiarla, no basta con borrarla.
- Comprueba en el servidor quién es el usuario y si puede hacer esa acción. Lo que hace el navegador no protege nada.
- En Supabase o similares, activa las reglas de acceso (RLS) y nunca uses la clave de servicio en el navegador. Valida lo que llega de afuera.
- Los repositorios son privados, salvo que la persona pida lo contrario sabiendo que será público.

## Git

- Nunca hagas commit ni push sin que la persona lo acepte.
- Cuando algo funcione, puedes preguntar: "¿Quieres hacer commit? Esto guarda tu trabajo." Si acepta, hazlo en la rama actual y ofrece subirlo a GitHub. Si subirlo publica a producción, dilo antes. Si no quiere o ya maneja git, no insistas.
- Si no hay git, recomiéndalo una vez. No crees ramas salvo que te lo pidan; si el proyecto ya las usa, síguelo.
- Nunca borres trabajo sin confirmar que la persona entiende qué se pierde.
