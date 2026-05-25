# Relevo dominio: arquitectura

## Uso

Continuidad activa de decisiones transversales de arquitectura.

## Estado actual

Lokkygoat se mantiene como aplicación Electron + Node.js.

## Qué quedó ya hecho

- Se fija que el repo activo es `lokkygoat`.
- Se fija que el repo viejo `cabra-tamagotchi-companion` queda en cuarentena.
- Se fija que Hermes/OpenClaw/Ollama deben ser proveedores o integraciones, no el núcleo del proyecto.

## Qué no quedó hecho

- No existe todavía separación formal de providers.
- No existe todavía bus central de eventos.
- No existe todavía capa central de reglas de notificación.

## Riesgos o trampas conocidas

- Contaminar el repo copiando código de Hermes.
- Mezclar lógica de provider, UI, eventos y memoria dentro de `main.js`.
- Crecer con archivos monolíticos.

## Archivos clave a leer

- `main.js`
- `preload.js`
- `pet.html`
- `chat.html`
- `settings.html`
- `AGENTS.md`
- `doc/instrucciones/mapa_dominios.md`

## Validaciones pendientes

- Validar arranque con `npm start`.
- Validar estado git antes de cambios de código.

## Siguiente micro-paso recomendado

- Saneamiento base de seguridad y nombres antes de añadir funciones nuevas.
