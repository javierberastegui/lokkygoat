# Relevo dominio: mascota_flotante

## Uso

Este archivo registra la continuidad activa del dominio `mascota_flotante` en el frontend.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- La interfaz visual de Goatky ahora es una entidad de nebulosa oscura con humo negro, brillos violeta/rosa, retícula orbital, ojos rasgados y sonrisa pícara inspirada en la referencia aportada por el usuario.
- Se conservan los contratos del SVG y del JS de `pet.html` para que sueño, estados operativos, respuesta lista, warp y física sigan funcionando.
- Camina, salta, vuela y cambia de estado mediante las clases físicas ya existentes, sin cambiar `src/pet/petPhysics.js`.

## Qué quedó ya hecho

- Sustitución del cuerpo de cabra-bot por una masa abstracta de humo/nebulosa en SVG.
- Conservación de los selectores críticos: `#goatky-character`, `.eyes-open`, `.eyes-closed`, `#mouth-open`, `#mouth-closed`, `#left-arm`, `#right-arm`, `#left-leg`, `#right-leg`, `#goat-tail`, `#thruster-flame` y `#pet-shadow`.
- Integración de filtros SVG de blur/glow, gradientes radiales, órbitas HUD y líneas de retícula para acercarse a la estética de la imagen de referencia.
- Paleta por estados mantenida: `idle`, `thinking`, `executing`, `success`, `error`, `sleep`.
- Log de frontend actualizado en `doc/logs/frontend/mascota_flotante.md`.

## Qué no quedó hecho

- Validación visual runtime en Electron local.
- El badge de estado (`status-badge`) sigue flotando externamente en la esquina superior; se mantiene como deuda integrarlo dentro de la composición visual.
- No se generó ni incorporó un asset raster basado en la referencia; el avatar quedó como SVG propio editable.

## Riesgos o trampas conocidas

- La nueva composición nebular usa filtros SVG intensivos; si se detecta consumo alto en equipos modestos, reducir `stdDeviation` en `smokeBlur`, `voidBlur` y `nebulaGlow`.
- Si las animaciones físicas deforman demasiado ojos o sonrisa, ajustar `transform-origin` de `#pet` y `#goatky-character` antes de tocar `petPhysics.js`.
- Si se altera `#pet-shadow`, cuidar que siga funcionando con los estados `physics-hop`, `physics-fly` y `physics-dash`.

## Archivos clave a leer

- `pet.html`
- `src/pet/petPhysics.js`
- `doc/logs/frontend/mascota_flotante.md`

## Validaciones pendientes

- Ejecutar `npm start` en entorno local y validar visualmente la mascota flotante.
- Comprobar click para abrir chat, botón de ajustes, botón de cierre, `thinking`, `response-ready`, sueño, warp y movimiento físico.
- Verificar comportamiento en resoluciones pequeñas.

## Siguiente micro-paso recomendado

- Arrancar Lokkygoat localmente y ajustar proporciones/blur si la nebulosa se ve demasiado compacta o si la ventana flotante recorta los lóbulos externos.
