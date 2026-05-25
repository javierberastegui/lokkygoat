# Relevo dominio: memoria_local

## Uso

Este archivo registra la continuidad activa del dominio `memoria_local`.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- El estado de la sesión activa de chat y las métricas de actividad viven de forma aislada en `src/state/stateService.js`.

## Qué quedó ya hecho

- Encapsulación de historial de chat limitado a 20 mensajes.
- Tracking de la escena operacional activa (thinking, success, idle, error).
- Tracking de marca temporal de última actividad del usuario para pausar/activar movimiento de la mascota.

## Qué no quedó hecho

- El historial de chat es volátil y se vacía al reiniciar la aplicación.

## Riesgos o trampas conocidas

- Modificar el límite del historial de chat por encima de los 20 mensajes sin ajustar el cálculo del consumo de tokens en los proveedores de IA.

## Archivos clave a leer

- `src/state/stateService.js`

## Validaciones pendientes

- Validar que al cambiar de ventana o mandar mensajes en el chat el estado de actividad del usuario se actualice correctamente.

## Siguiente micro-paso recomendado

- Agregar un manejador para recuperar y guardar el historial de la última conversación de forma persistente.
