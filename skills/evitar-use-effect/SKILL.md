---
name: evitar-use-effect
description: Evita useEffect innecesarios al escribir, cambiar o revisar código de React, sobre todo cuando un efecto calcula estado, trae datos, responde a una acción del usuario o reinicia estado. Úsala en cambios de React que tocan useEffect o cuando la pidan.
---

# Evitar useEffect

Antes de usar `useEffect`, intenta esto. Si el proyecto tiene una regla más estricta, síguela.

| En vez de `useEffect` para... | Usa |
|---|---|
| Calcular un valor a partir de estado o props | Calcúlalo directo, o con `useMemo` si es costoso |
| Traer datos | Lo que ya use el proyecto: loaders, acciones de servidor, `useQuery` |
| Responder a una acción del usuario | El manejador del evento |
| Reiniciar estado cuando cambia el elemento | Una `key` en el padre |

Si nada aplica, puede ser un efecto real: sincronizar con algo externo a React, como una suscripción o una API del navegador. Déjalo con un comentario que diga por qué.

```tsx
// Evita
useEffect(() => setActive(items[0]?.id), [items])

// Prefiere
const active = items.some((item) => item.id === selectedId) ? selectedId : items[0]?.id
```
