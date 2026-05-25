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

### Etapa

- Fecha: 2026-05-25
- Objetivo: Implementar gravedad, suelo virtual, caminata terrestre, saltos y comportamiento de vuelo alterno.
- Contexto breve: Se modificó `src/pet/petPhysics.js` para añadir el cálculo de gravedad y colisión con el suelo (groundY = parte inferior de workArea). Se introdujeron los estados `grounded_walk`, `idle_grounded`, `hop` y `fly`.

### Cambios

- Archivos nuevos: ninguno.
- Archivos modificados:
  - `src/pet/petPhysics.js`
- Dependencias: ninguna.
- Tests/validaciones: `node --check`

### Decisiones

- Utilizar el borde inferior del área de trabajo de la pantalla principal de Electron como suelo virtual (`groundY`).
- La gravedad solo se aplica cuando el droid no está volando (`fly`) y su posición vertical es menor que `groundY`.
- Devolver el estado físico (`behaviorState`) en la respuesta de paso para que el frontend pueda coordinar los estilos de animación.

### Validación

- Verificado sintácticamente con NodeJS.

### Incidencias detectadas

- Ninguna.

### Siguiente paso sugerido

- Añadir un detector de cambio de resolución de pantalla para reajustar la posición de la mascota si el suelo virtual cambia.
