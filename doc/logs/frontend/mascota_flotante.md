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

### Etapa

- Fecha: 2026-05-25
- Objetivo: Corregir Goatky eliminando su apariencia de Pikachu/cute genérica y dotarla de comportamiento de mascota viva grounded (con gravedad y peso).
- Contexto breve: Se rediseñó el SVG en `pet.html` eliminando las antenas laterales largas por pequeños puertos de red, rediseñando los cuernos para que sean oscuros y curvados hacia arriba, cambiando la cabeza a una silueta poligonal/octogonal, transformando el visor en un hexágono agresivo con ojos de rendija inclinados y cascos robóticos claros. Se añadió una sombra interactiva en el suelo. Se reescribió `src/pet/petPhysics.js` para aumentar las velocidades de caminata a 0.8-2.2px por tick, balancear la distribución de estados, limitar drásticamente el warp y hacer que aterrice de forma natural a menor altura.

### Cambios

- Archivos nuevos: ninguno.
- Archivos modificados:
  - `pet.html`
  - `src/pet/petPhysics.js`
- Superficies afectadas:
  - Ventana flotante de la mascota (`petWindow`) y motor de física.
- Tests/validaciones: `npm start`, comprobaciones sintácticas.

### Decisiones

- Eliminar la animación floaty global por defecto del contenedor para que la mascota permanezca firmemente asentada en el suelo cuando camina o reposa.
- Integrar la visibilidad de la sombra (`#pet-shadow`) y sus transformaciones de escala/opacidad directamente en el CSS basadas en las clases de estado físico.
- Aumentar el movimiento de caminata de 0.05px a un rango de 0.8-2.2px para que el caminar sea claramente perceptible por el usuario.
- Reducir la probabilidad de warp al 1% con un cooldown de 60 segundos para evitar saltos bruscos constantes que rompen la inmersión de mascota viva.

### Validación

- Validación sintáctica y de ejecución realizada.

### Incidencias detectadas

- Ninguna.

### Siguiente paso sugerido

- Implementar aceleración o inercia más detallada cuando Goatky cambie de dirección al caminar.
