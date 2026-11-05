# Reglas de base-segura

Responde siempre en español, en palabras simples. Quien te escribe puede no ser ingeniero.

Estas reglas aplican a todos los proyectos. Si un archivo del proyecto las contradice en paquetes, secretos o git, avísale a la persona y sigue estas reglas.

## Cómo trabajar

- Haz el cambio más pequeño que resuelva lo pedido. Nada extra.
- Antes de agregar algo, busca si el proyecto ya lo resuelve. Borra lo que quede sin uso.
- Cada regla o dato vive en un solo lugar. No lo copies.
- Los errores se muestran o se registran. Nunca los escondas.
- Si algo es costoso de revertir (datos reales, producción, dinero), explica el riesgo y pregunta antes.
- No conviertas una suposición en un hecho: di qué comprobaste y qué no.

## Paquetes

Cada paquete es código de un desconocido que corre en esta máquina y en producción.

- Primero intenta sin paquete: lo que ya trae la plataforma o unas 30 líneas propias. Para criptografía, autenticación y pagos sí usa una librería mantenida; nunca los escribas tú.
- Usa pnpm con Socket: `sfw pnpm add <paquete>`, `sfw pnpm install`. Si el proyecto aún usa npm, propón pasarlo a pnpm; mientras tanto usa `sfw npm install`. Sin `sfw`, no instales.
- Antes de agregar un paquete, dile a la persona qué hace, por qué hace falta, quién lo publica, cuántas descargas tiene y qué tan antiguo es. Si no lo conoces o el nombre te resulta dudoso, no lo instales: dile que pida revisión a alguien con experiencia.
- Solo paquetes del registro de npm: nada de git, URLs ni tarballs.
- Los paquetes no ejecutan scripts al instalarse. Si uno lo pide, lee qué ejecuta y explica el riesgo antes de agregarlo a `allowBuilds`.
- No uses una versión con menos de 48 horas. Una excepción lleva la versión exacta y la decide la persona.
- Nunca debilites `pnpm-workspace.yaml`, `devEngines`, `.claude/`, `.codex/`, `.github/` ni `check.mjs` para que algo pase. Si bloquean algo, explica el motivo y pregunta.

## Secretos

- Las claves de producción viven solo en el panel del proveedor (Vercel, Supabase, etc.). Nunca en esta máquina y nunca las uses tú.
- En local solo claves de desarrollo, con permisos mínimos y límite de gasto si existe.
- Los secretos no van en archivos del proyecto: `referencias.env` guarda referencias al gestor de contraseñas y se usa con `op run`.
- No leas, muestres ni copies secretos. Si la persona pega uno en el chat, avísale que debe cambiarlo.
- Una clave que llegó a git, al chat o al navegador está filtrada: hay que cambiarla, no basta con borrarla.
- Nada secreto en variables `NEXT_PUBLIC_` o `VITE_`: el navegador las ve.

## Seguridad de la app

- Comprueba en el servidor quién es el usuario y si puede hacer esa acción, en cada acción. Lo que hace el navegador no protege nada.
- En Supabase o similares, activa las reglas de acceso (RLS) en cada tabla, y nunca uses la clave de servicio en el navegador.
- Valida en el servidor todo lo que llegue de afuera. Usa consultas parametrizadas.
- Los repositorios son privados, salvo que la persona pida lo contrario sabiendo que será público.

## Git

- Nunca hagas commit ni push sin que la persona lo acepte.
- Cuando algo funcione, pregunta: "¿Quieres hacer commit? Esto guarda tu trabajo." Si acepta, hazlo en la rama actual y ofrece subirlo a GitHub. Si subirlo publica a producción, dilo antes.
- Si no hay git, recomiéndalo una vez: sin subir el trabajo, se puede perder.
- No crees ramas salvo que te lo pidan. Si el proyecto ya usa ramas o pull requests, síguelo. Si la persona maneja git o pide que no le preguntes, no insistas.
- Nunca borres trabajo sin confirmar que la persona entiende qué se pierde.

## Antes de decir que terminaste

- Corre las pruebas del proyecto, y `node check.mjs` si existe.
- Abre la app y prueba lo que cambiaste. En un error, primero reprodúcelo y luego comprueba que ya no ocurre.
- Si algo sigue fallando, dilo. No lo presentes como terminado.
