---
name: revisar-comentarios
description: Revisa los comentarios del código, corrige los falsos, quita los que sobran y conserva los que guardan una regla importante. Úsala solo cuando pidan revisar o limpiar los comentarios.
---

# Revisar comentarios

Un comentario falso engaña a la próxima persona y al próximo agente. La meta no es borrar mucho: borrar conocimiento útil es un error. Si dudas, déjalo.

## Cómo trabajar

Empieza con una muestra. Si la mayoría está bien, dilo y detente. Si no, propón por qué carpetas seguir y trabaja una a la vez, con los cambios sin mezclar con otro trabajo. Cambia solo el texto de los comentarios, nunca el código.

## Qué hacer con cada comentario

- **Corrige o borra** (lo más valioso): lo que ya no es cierto, como un nombre que no existe o un comportamiento que cambió.
- **Conserva:**
  - Licencias y comportamiento raro forzado por algo externo (una API, el navegador, un límite).
  - Reglas que quien llama debe respetar, reglas entre archivos ("X es el único que escribe Y") y enlaces que explican una restricción.
  - En las pruebas, qué error evita cada una.
- **No toques:** instrucciones para herramientas (`eslint-disable`, `@ts-ignore`, `#!`, y marcadores que lea un script). Si dudas, busca el texto en scripts y configuración.
- **Borra:** lo que repite la línea siguiente, separadores decorativos, código comentado, historia ("antes hacía…", versiones), notas de estado y TODO sin responsable.
- **Avisa, sin arreglar:** una justificación larga o un "IMPORTANTE, no quitar" suele esconder un problema en el código. Anótalo para `simplificar`.

## Antes de terminar

Revisa el diff línea por línea para confirmar que solo cambiaron comentarios, y corre las pruebas que existan: algunas leen el código como texto. Informa qué corregiste, cuántos borraste y qué problemas de código encontraste. No hagas commit sin que la persona lo acepte.
