# deuda_tecnica.md

## Uso

Registrar deuda técnica no urgente.

## Entradas

### 2026-05-25 - Deuda inicial conocida

- `[x]` Revisar logs para asegurar que no imprimen secretos. (Resuelto: configService y eventBus ofuscan la apiKey)
- `[ ]` Revisar `preload.js` para evitar canales IPC demasiado abiertos (revisar privilegios mínimos).
- `[x]` Revisar separación futura de providers fuera de `main.js`. (Resuelto: encapsulados en src/providers/)

### 2026-05-25 - Nueva deuda técnica detectada

- `[ ]` Añadir timeouts a las peticiones de fetch de los adaptadores de IA en `src/providers/`.
- `[ ]` Validar esquemas de configuración JSON en `src/config/configService.js` al guardar para evitar ficheros corruptos.
