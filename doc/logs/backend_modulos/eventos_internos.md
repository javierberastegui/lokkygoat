# Log backend módulo: eventos_internos

## Uso

Este archivo registra el historial operativo y técnico del módulo lógico `eventos_internos`.

No debe usarse como relevo principal.
Para continuidad abierta, usar el relevo del dominio correspondiente.

## Entradas

### Etapa

- Fecha: 2026-05-25
- Objetivo: Diseñar e implementar el bus central de eventos internos estructurados.
- Contexto breve: Cumpliendo el requisito de `AGENTS.md` ("Capa estratégica obligatoria de eventos"), se creó `src/events/eventBus.js` y se integraron notificaciones estructuradas a lo largo del flujo del chat, config e inicio de la app.

### Cambios

- Archivos nuevos:
  - `src/events/eventBus.js`
- Archivos modificados:
  - `main.js` (emisión de eventos de ciclo de vida)
  - `src/ipc/ipcHandlers.js` (emisión de eventos de chat, providers y cambios de configuración)
- Dependencias: ninguna externa (usa `events` nativo de NodeJS).
- Tests/validaciones: `node --check`

### Decisiones

- Toda emisión de evento pasa por un filtro de seguridad que ofusca datos sensibles (como la `apiKey`) antes de escribirse en logs.
- Procesar las consecuencias de eventos en un único switch centralizado dentro del bus (`processRules`).

### Validación

- Sintaxis de JS validada con node.

### Incidencias detectadas

- Ninguna.

### Siguiente paso sugerido

- Añadir un cargador dinámico de reglas para que las reacciones a eventos puedan definirse mediante ficheros JSON externos.
