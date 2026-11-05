---
name: simplificar
description: Busca qué se puede borrar, unificar o simplificar en el código sin cambiar lo que hace, y aplica solo lo que la persona apruebe. Úsala cuando pidan simplificar, limpiar o reducir código, o digan que el proyecto se salió de control.
---

# Simplificar

La pregunta: ¿cuál es el diseño más pequeño y claro que hace lo que esta parte necesita hoy, y cuánto se aleja de eso?

## Cómo revisar

Trabaja sobre lo que pidan. Si no dicen qué, empieza por la parte más importante de la app, no por todo. Lee el código real y quién lo usa antes de opinar. Busca, en este orden:

1. **Qué borrar:** código sin uso, archivos huérfanos, paquetes que ya nadie necesita.
2. **Qué unificar:** la misma regla o dato decidido en dos lugares. Deja uno y que el resto lo use.
3. **Qué sobra:** opciones que nadie usa, capas que solo pasan datos, código para casos que no pueden ocurrir.
4. **Errores escondidos:** `catch` vacíos o valores por defecto que tapan un fallo. Deben verse o registrarse.
5. **Qué ya existe:** código propio o un paquete para algo que la plataforma ya trae.

Prueba cada idea: si lo quitas, ¿qué se rompe? Si algo complejo protege permisos, datos o dinero, déjalo y di por qué.

## Cómo informar

Por cada punto: dónde está, qué pasa en palabras simples, qué propones y cómo comprobar que nada se rompe. Ordena por lo que más reduce el trabajo futuro y no inventes hallazgos: "está bien como está" es un buen resultado. Pregunta qué quiere aplicar.

## Cómo aplicar

Solo lo aprobado y de a un cambio. Antes de mover algo importante, asegúrate de poder comprobar que sigue funcionando. Corre las pruebas, pídele a la persona que pruebe la app y di cuánto código se quitó. Nunca simplifiques quitando permisos, comprobaciones de identidad o errores honestos. Si un cambio no deja el código más fácil de entender, deshazlo.
