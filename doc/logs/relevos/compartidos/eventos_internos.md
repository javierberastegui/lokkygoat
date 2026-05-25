# Relevo dominio: eventos_internos

## Uso

Este archivo registra la continuidad activa del dominio `eventos_internos`.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- Bus de eventos funcional en `src/events/eventBus.js`.
- Los manejadores de IPC y el arranque emiten eventos estructurados correctamente.

## Qué quedó ya hecho

- Implementación del bus basado en `EventEmitter`.
- Integración de eventos mínimos obligatorios: `app.started`, `app.error`, `config.updated`, `chat.message_sent`, `chat.response_received`, `provider.request_started`, `provider.request_failed`, `provider.request_succeeded`, `pet.state_changed`, `memory.updated`, `pet.animation_requested`.
- Filtrado y ofuscación de secretos en el payload antes de realizar logs de depuración del evento.

## Qué no quedó hecho

- Aún no se conectan las animaciones de la mascota en el frontend directamente como suscriptores del bus (actualmente la comunicación se hace vía IPC Main a IPC Renderer normal).

## Riesgos o trampas conocidas

- Disparar bucles infinitos de eventos si una regla en `processRules` emite un evento que activa la misma regla de nuevo.

## Archivos clave a leer

- `src/events/eventBus.js`
- `src/ipc/ipcHandlers.js`

## Validaciones pendientes

- Validar el flujo de reglas de negocio cuando ocurren errores en las llamadas a proveedores de IA.

## Siguiente micro-paso recomendado

- Crear un sistema de subscripción genérico en IPC para que el frontend pueda escuchar eventos del bus del backend dinámicamente.
