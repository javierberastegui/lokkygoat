# Relevo dominio: mascota_flotante

## Uso

Este archivo registra la continuidad activa del dominio `mascota_flotante` en el frontend.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- La interfaz visual de la mascota ha sido completamente rediseñada en `pet.html`. Se muestra como Goatky, el droid cabra de Red Team.
- Se mantiene flotando, respondiendo al click e interactuando con los eventos de backend del sistema.

## Qué quedó ya hecho

- Diseño de chasis robótico blanco en SVG (cabeza, cuerpo, cuernos cibernéticos y antenas).
- Visor negro brillante con reflejos y ojos LED cyan animados.
- Integración y compatibilidad total con eventos IPC (`pet:set-state`, `pet:celebrate`, `pet:glow`, `pet:sleep`, `pet:warp-start`, `pet:warp-end`, `pet:step`).
- Frases de chatter personalizadas orientadas a Red Team según el nivel de habilidades del compañero.

## Qué no quedó hecho

- El badge de estado (`status-badge` que muestra "?" o "!") se superpone actualmente en una posición fija (esquina superior derecha). Podría integrarse de forma interna dentro del propio visor de la cabra o como un elemento holográfico flotante en el SVG.

## Riesgos o trampas conocidas

- Modificar la escala del SVG o el contenedor `#wrap` puede provocar recortes en la sombra difuminada (`drop-shadow` de `--glow-color`) si supera las dimensiones de la ventana de Electron (260x260).

## Archivos clave a leer

- `pet.html`
- `main.js` (temporizador `stepPet` y llamadas a IPC)

## Validaciones pendientes

- Confirmar que los destellos en la animación `success` se visualizan correctamente en todas las configuraciones de escala de la mascota.

## Siguiente micro-paso recomendado

- Mover el badge de estado (`status-badge`) para integrarlo de forma más orgánica como un indicador de estado integrado en el lateral de la cabeza de Goatky.
