# Log backend módulo: configuracion

## Uso

Este archivo registra el historial operativo y técnico del módulo lógico `configuracion`.

No debe usarse como relevo principal.
Para continuidad abierta, usar el relevo del dominio correspondiente.

## Entradas

### Etapa

- Fecha: 2026-05-25
- Objetivo: Modularizar la gestión de configuración y mejorar la seguridad de logs.
- Contexto breve: Se extrajo la carga, guardado y validación de configuración local desde `main.js` a `src/config/configService.js`, agregando ofuscación automática de `apiKey` en los logs.

### Cambios

- Archivos nuevos:
  - `src/config/configService.js`
- Archivos modificados:
  - `main.js` (delegación)
- Dependencias: ninguna externa.
- Tests/validaciones: `node --check`

### Decisiones

- Las claves de API nunca se imprimen en logs; se sustituyen por `[REDACTED]` de forma proactiva.

### Validación

- Verificado mediante pruebas de arranque de Electron que la configuración carga adecuadamente sin lanzar excepciones de sintaxis.

### Incidencias detectadas

- Ninguna.

### Siguiente paso sugerido

- Añadir validaciones de formato en el guardado de configuración para evitar archivos JSON corruptos.
