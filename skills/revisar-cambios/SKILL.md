---
name: revisar-cambios
description: Revisa cambios recientes, corrige los problemas claros y avisa de lo que necesita una decisión. Úsala cuando pidan revisar lo que acaban de hacer, los últimos cambios o una rama antes de guardar o publicar. No hace commit ni push.
---

# Revisar cambios

1. **Qué revisar.** Lo que pidan. Si no dicen nada: los cambios sin commit y, si estás en una rama, lo que tiene de más frente a la principal. Si piden "los últimos días", usa los commits de ese periodo. No cambies de rama.
2. **Qué buscar.** Errores de lógica, cosas que dejaron de funcionar, permisos que faltan en el servidor, claves expuestas, código sin uso, lógica duplicada y pruebas importantes que faltan. Lee también quién usa lo que cambió.
3. **Corrige lo claro.** Solo lo que tiene una única respuesta correcta, es pequeño y corrige o mantiene el comportamiento. Ignora preferencias de estilo, detalles menores y problemas hipotéticos.
4. **Pregunta lo demás.** Si depende de una decisión de negocio o de diseño, explica las opciones en palabras simples, recomienda una y no la apliques.
5. **Comprueba.** Corre las pruebas que existan y pídele a la persona que pruebe lo que cambió.

Informa solo qué corregiste, qué comprobaste, qué decisiones faltan y qué impide publicar. Si está bien, dilo. No hagas commit ni push: ofrécelo al terminar.
