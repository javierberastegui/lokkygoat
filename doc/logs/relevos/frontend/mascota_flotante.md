# Relevo dominio: mascota_flotante

## Uso

Este archivo registra la continuidad activa del dominio `mascota_flotante` en el frontend.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- La interfaz visual de la mascota Goatky es un cyber-goat bot demoníaco asentado en el suelo con gravedad y peso.
- Camina a velocidad visible (0.8-2.2 px por tick), salta y vuela en periodos cortos, regresando al suelo de forma natural.
- El warp se ha reducido enormemente para mantener la fidelidad de una mascota física y viva.

## Qué quedó ya hecho

- Eliminación del aspecto Pikachu (antenas reducidas a pequeños puertos laterales).
- Cuernos curvos y oscuros con silueta de cabra.
- Silueta de cabeza octogonal/cyber y visor hexagonal agresivo con ojos rasgados de LED.
- Cascos robóticos claros y definidos.
- Sombra en el suelo (`#pet-shadow`) dinámica controlada por CSS según el estado de la física.
- Eliminación de la flotación por defecto del contenedor para permitir un caminar realista.
- Velocidades de caminata perceptibles (entre 0.8 y 2.2 px por tick).
- Probabilidades de comportamiento y cooldown para warp (1% probabilidad, min 60s cooldown).

## Qué no quedó hecho

- El badge de estado (`status-badge`) sigue flotando externamente en la esquina superior; se mantiene como deuda integrarlo en el visor.

## Riesgos o trampas conocidas

- Si se altera la posición de la sombra en el SVG (`#pet-shadow`), debe cuidarse la sincronización con el punto de contacto de los cascos al final del recorrido vertical.

## Archivos clave a leer

- `pet.html`
- `src/pet/petPhysics.js`

## Validaciones pendientes

- Verificar comportamiento de caída en resoluciones de pantalla extremadamente pequeñas.

## Siguiente micro-paso recomendado

- Agregar un sutil efecto de rebote elástico en el cuerpo completo de Goatky cuando aterriza después de un vuelo o un salto.
