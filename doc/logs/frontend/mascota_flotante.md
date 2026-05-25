# Log frontend superficie: mascota_flotante

## Uso

Este archivo registra el historial operativo y técnico de la superficie visual `mascota_flotante`.

No debe usarse como relevo principal.
Para continuidad abierta, usar el relevo del dominio correspondiente.

## Entradas

### Etapa

- Fecha: 2026-05-25
- Objetivo: Rediseñar visualmente la mascota flotante para adoptar la identidad de Goatky, el droid cabra de Red Team.
- Contexto breve: Se reescribió `pet.html` por completo para reemplazar el núcleo abstracto anterior por un diseño de robot blanco en SVG con visor brillante, ojos expresivos cian, cuernos cibernéticos y detalles de terminal, manteniendo compatibilidad total de eventos e IPC.

### Cambios

- Archivos nuevos: ninguno.
- Archivos modificados:
  - `pet.html` (completo)
- Superficies afectadas:
  - Ventana flotante de la mascota (`petWindow`).
- Tests/validaciones: `node --check`, arranque manual de la interfaz.

### Decisiones

- Reemplazar el SVG antiguo por un diseño modular de robot/cabra con un visor central.
- Conservar los IDs y clases HTML (`.eyes-open`, `.eyes-closed`, `#mouth-open`, `#mouth-closed`) y la lógica de Javascript para garantizar la compatibilidad con las animaciones de sueño y salto.
- Adaptar las frases flotantes (chatter) para alinearlas a la temática de Red Team y laboratorios de ciberseguridad autorizados.

### Validación

- Se verificó la sintaxis del código HTML/JS.

### Incidencias detectadas

- Ninguna.

### Siguiente paso sugerido

- Añadir animaciones personalizadas en el visor cuando el usuario pase el cursor (hover), como barras de escaneo horizontales adicionales.

### Etapa

- Fecha: 2026-05-25
- Objetivo: Evolucionar visualmente a Goatky a una cabra-bot demoníaca Red Team y enlazar animaciones físicas.
- Contexto breve: Se rediseñó el SVG en `pet.html` para incorporar cuernos cibernéticos curvos y largos, una cola en forma de diablo, visor negro profundo, sonrisa traviesa y patitas móviles. Se vincularon animaciones CSS al estado de física (`behaviorState`) transmitido por IPC.

### Cambios

- Archivos nuevos: ninguno.
- Archivos modificados:
  - `pet.html`
- Superficies afectadas:
  - Ventana flotante de la mascota (`petWindow`).
- Tests/validaciones: `node --check`, análisis sintáctico.

### Decisiones

- Utilizar animaciones sobre el nodo del grupo interno del SVG (`#goatky-character`) para evitar interferir con los giros y transformaciones 2D aplicados por JavaScript desde las coordenadas físicas.
- Cambiar la paleta por defecto a tonos violeta y rojo para la estética demoníaca cibernética.
- Mapear clases de CSS (`physics-grounded_walk`, `physics-hop`, `physics-fly`, `physics-idle_grounded`) a partir de la propiedad `behaviorState` del evento `pet:step`.

### Validación

- Validación sintáctica del HTML y scripts internos completada.

### Incidencias detectadas

- Ninguna.

### Siguiente paso sugerido

- Añadir un efecto de glitch o ruido en el visor cuando se reciban errores de los proveedores de IA.
