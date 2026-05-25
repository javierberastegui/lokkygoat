# Log backend módulo: mascota_flotante

## Uso

Este archivo registra el historial operativo y técnico del módulo lógico `mascota_flotante`.

No debe usarse como relevo principal.
Para continuidad abierta, usar el relevo del dominio correspondiente.

## Entradas

### Etapa

- Fecha: 2026-05-25
- Objetivo: Extraer y aislar el bucle de físicas de la mascota.
- Contexto breve: Se extrajo la física de movimiento, evitación de límites y teleportación (warp) de `main.js` a una clase pura `PetPhysics` en `src/pet/petPhysics.js`.

### Cambios

- Archivos nuevos:
  - `src/pet/petPhysics.js`
- Archivos modificados:
  - `main.js` (delegación de la física en cada tick)
- Dependencias: ninguna.
- Tests/validaciones: `node --check`

### Decisiones

- Mantener la física desacoplada del motor de renderizado de Electron, encapsulándola en una clase pura de JavaScript.
- Devolver acciones pendientes (como bounce, celebrate, warp-start, etc.) en lugar de llamar directamente a las ventanas de Electron desde las físicas.

### Validación

- Validación sintáctica exitosa.

### Incidencias detectadas

- Ninguna.

### Siguiente paso sugerido

- Escribir pruebas unitarias que simulen colisiones en las esquinas de la pantalla para asegurar que los rebotes vectoriales son correctos.
