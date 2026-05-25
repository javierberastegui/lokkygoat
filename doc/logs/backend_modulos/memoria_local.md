# Log backend módulo: memoria_local

## Uso

Este archivo registra el historial operativo y técnico del módulo lógico `memoria_local`.

No debe usarse como relevo principal.
Para continuidad abierta, usar el relevo del dominio correspondiente.

## Entradas

### Etapa

- Fecha: 2026-05-25
- Objetivo: Encapsular el estado en memoria y el historial de chat.
- Contexto breve: Se extrajeron las variables de estado global de `main.js` a `src/state/stateService.js` para mantener un estado limpio, predecible y aislar la memoria de chat.

### Cambios

- Archivos nuevos:
  - `src/state/stateService.js`
- Archivos modificados:
  - `main.js` (delegación)
- Dependencias: ninguna.
- Tests/validaciones: `node --check`

### Decisiones

- Separar el estado de persistencia (configuración) del estado mutable en ejecución (historial de chat, última actividad, escena operacional actual).

### Validación

- Verificación de consistencia de sintaxis mediante NodeJS.

### Incidencias detectadas

- Ninguna.

### Siguiente paso sugerido

- Añadir soporte para persistir el historial de chat localmente de forma opcional (conversaciones históricas).
