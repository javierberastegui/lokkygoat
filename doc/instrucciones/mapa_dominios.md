# mapa_dominios.md

## Propósito

Este archivo traduce nombres naturales usados por el usuario a dominios documentales y operativos de Lokkygoat.

Permite continuidad con órdenes breves como:

- “sigue con mascota”
- “sigue con chat”
- “sigue con ajustes”
- “sigue con providers”
- “sigue con eventos”
- “sigue con seguridad”

## Regla de uso

Cuando el usuario use un nombre natural, el agente debe resolver aquí el dominio antes de seguir.

Después debe leer:

1. relevo del dominio;
2. log del dominio si existe;
3. incidencias relacionadas.

## Alias actuales

### mascota flotante

- alias: `mascota`, `cabra`, `pet`, `tamagotchi`, `flotante`, `animación`, `animaciones`
- frontend principal: `doc/logs/relevos/frontend/mascota_flotante.md`
- logs esperados: `doc/logs/frontend/mascota_flotante.md`
- archivos probables: `pet.html`, `main.js`, `preload.js`, `src/pet/petPhysics.js`

### chat

- alias: `chat`, `conversación`, `ventana chat`, `panel chat`
- frontend principal: `doc/logs/relevos/frontend/chat.md`
- backend/apoyo: `doc/logs/relevos/backend_modulos/chat_runtime.md`
- logs esperados: `doc/logs/frontend/chat.md`, `doc/logs/backend_modulos/chat_runtime.md`
- archivos probables: `chat.html`, `preload.js`, `src/ipc/ipcHandlers.js`, `src/state/stateService.js`

### ajustes

- alias: `ajustes`, `settings`, `configuración`, `config`, `panel ajustes`
- frontend principal: `doc/logs/relevos/frontend/ajustes.md`
- backend/apoyo: `doc/logs/relevos/backend_modulos/configuracion.md`
- logs esperados: `doc/logs/frontend/ajustes.md`, `doc/logs/backend_modulos/configuracion.md`
- archivos probables: `settings.html`, `CONFIG.example.json`, `src/config/configService.js`

### proveedores IA

- alias: `providers`, `proveedores`, `ollama`, `openai`, `hermes`, `openclaw`, `codex`, `custom api`, `ia`, `llm`
- backend principal: `doc/logs/relevos/backend_modulos/proveedores_ia.md`
- logs esperados: `doc/logs/backend_modulos/proveedores_ia.md`
- archivos probables: `src/providers/` (providerManager.js, adapters)

### eventos internos

- alias: `eventos`, `events`, `event bus`, `bus eventos`, `sistema vivo`, `notificaciones`
- compartido principal: `doc/logs/relevos/compartidos/eventos_internos.md`
- logs esperados: `doc/logs/backend_modulos/eventos_internos.md`, `doc/logs/frontend/eventos_visuales.md`
- archivos probables: `src/events/eventBus.js`

### memoria local

- alias: `memoria`, `memory`, `recuerdos`, `habilidades`, `stats`, `estado local`
- backend principal: `doc/logs/relevos/backend_modulos/memoria_local.md`
- logs esperados: `doc/logs/backend_modulos/memoria_local.md`
- archivos probables: `src/state/stateService.js`

### seguridad

- alias: `seguridad`, `secrets`, `secretos`, `api key`, `tokens`, `ipc`, `sandbox`, `csp`
- compartido principal: `doc/logs/relevos/compartidos/seguridad.md`
- logs esperados: `doc/logs/backend_modulos/seguridad.md`, `doc/logs/frontend/seguridad_ui.md`
- archivos probables: `preload.js`, `chat.html`, `settings.html`, `pet.html`, `src/config/configService.js`

### empaquetado y arranque

- alias: `arranque`, `startup`, `build`, `electron`, `npm`, `package`, `empaquetado`
- compartido principal: `doc/logs/relevos/compartidos/empaquetado_arranque.md`
- logs esperados: `doc/logs/backend_modulos/empaquetado_arranque.md`
- archivos probables: `package.json`, `package-lock.json`, `README.md`

### documentación

- alias: `documentación`, `docs`, `agents`, `logs`, `relevos`, `instrucciones`
- compartido principal: `doc/logs/relevos/compartidos/documentacion.md`
- logs esperados: `doc/logs/backend_modulos/documentacion_operativa.md`

## Regla para dominios nuevos

Si aparece un módulo, superficie o dominio nuevo que el usuario pueda invocar por nombre natural, el agente debe añadir aquí su alias y sus rutas documentales mínimas.

## Regla de nomenclatura

- usar slugs simples y estables;
- evitar renombrados de dominios ya asentados sin motivo fuerte;
- preferir nombres cortos, claros y reutilizables.
