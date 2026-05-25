# Relevo dominio: mascota_flotante

## Uso

Este archivo registra la continuidad activa del dominio `mascota_flotante`.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- La lógica de físicas está desacoplada de la interfaz gráfica y reside en `src/pet/petPhysics.js`.
- El tick del temporizador sigue ejecutándose en `main.js` llamando a esta física cada 25ms.

## Qué quedó ya hecho

- Encapsulación de estados de comportamiento (walk, dash, halt, warp, warping-transition).
- Lógica de evitación de bordes y cálculo de colisiones.
- Lógica de warp de dos fases separada en `update` y `finishWarp`.

## Qué no quedó hecho

- Los multiplicadores de velocidad y duraciones de estados siguen definidos estáticamente dentro de la física; no son editables de forma dinámica por el usuario más allá del movimiento normal/suave/vivo.

## Riesgos o trampas conocidas

- Modificar la tasa de refresco del loop (25ms) en `main.js` acelerará o ralentizará linealmente la física de la mascota, ya que esta asume una tasa constante de ticks.

## Archivos clave a leer

- `src/pet/petPhysics.js`
- `main.js` (función `stepPet`)

## Validaciones pendientes

- Validar el comportamiento de colisión en sistemas multipantalla.

## Siguiente micro-paso recomendado

- Parametrizar la clase `PetPhysics` para que acepte la tasa de refresco (delta time) dinámicamente y escale las velocidades de forma correspondiente.
