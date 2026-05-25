# Relevo dominio: mascota_flotante

## Uso

Este archivo registra la continuidad activa del dominio `mascota_flotante` en el frontend.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- La interfaz visual de la mascota ha evolucionado a una cabra-bot demoníaca Red Team en `pet.html`.
- Se anima dinámicamente según el estado de la física (grounded_walk, fly, hop, idle_grounded).

## Qué quedó ya hecho

- Diseño de cuernos más marcados y curvos, visor negro oscuro, cola de diablo tipo cable y patitas de cascos visibles.
- Mapeo de `behaviorState` a clases de CSS (`physics-grounded_walk`, `physics-hop`, `physics-fly`, `physics-idle_grounded`).
- Animaciones de piernas oscilantes para caminar en tierra, compresión/estiramiento para saltos, parpadeo de thruster para vuelo y respiración quieta en reposo.
- Transiciones suaves de color de ojos y aura (violeta y roja por defecto).

## Qué no quedó hecho

- El badge de estado (`status-badge`) sigue flotando externamente en la esquina de la ventana; se mantiene como deuda estética integrarlo en el visor.

## Riesgos o trampas conocidas

- Modificar la escala del SVG o del grupo principal `#goatky-character` puede alterar la rotación y distorsión de paso calculada en JavaScript, provocando animaciones desfasadas.

## Archivos clave a leer

- `pet.html`
- `src/pet/petPhysics.js`

## Validaciones pendientes

- Validar la consistencia de las animaciones en sistemas con bajas tasas de refresco (bajos FPS).

## Siguiente micro-paso recomendado

- Agregar un efecto de glitch sutil al visor de Goatky cuando pase a estado `thinking` o `executing`.
