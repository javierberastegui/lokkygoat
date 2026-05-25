# estado_actual.md

## Foto operativa actual

Proyecto: Lokkygoat  
Tipo: mascota de escritorio inteligente y configurable  
Stack base: Electron + Node.js + HTML/CSS/JS  
Rama activa esperada: `main`  
Repo activo: `javierberastegui/lokkygoat`

## Estado funcional conocido

El proyecto se encuentra modularizado bajo la siguiente arquitectura estable:

- **Estructura Modular (`src/`):** La lógica de configuración, estado, eventos, proveedores de IA, física de mascota y manejadores de IPC está desacoplada de `main.js`.
- **Física de Mascota Aislada:** Encapsulada en `src/pet/petPhysics.js` y calculada en tiempo real.
- **Múltiples Proveedores de IA:** Adaptadores separados para Ollama, OpenAI, Claude y Hermes coordinados por `providerManager.js`.
- **Configuración por Proveedor:** Gestión modularizada de parámetros de conexión en `config.json` de manera que cambiar de proveedor no borra las credenciales de otros.
- **Comprobación de Salud y Conectividad:** Comprobación asíncrona en segundo plano del estado de salud de los proveedores, visible en la barra lateral del chat y testeable desde ajustes.
- **Bus de Eventos Estructurados:** Implementado en `src/events/eventBus.js` con procesamiento de reglas.
- **Seguridad en Logs:** Sanitización de `apiKey` activa al cargar/guardar configuración y emitir eventos (incluyendo las nuevas claves estructuradas).
- **Superficies Visuales:** Ventanas de chat, mascota y ajustes conectadas vía IPC.

## Decisión importante

`cabra-tamagotchi-companion` queda como referencia histórica/cuarentena.

Lokkygoat debe avanzar limpio sobre su propio repo.

## Dirección del producto

Lokkygoat debe crecer como:

- mascota local de escritorio;
- bridge visual hacia Hermes, OpenClaw, Ollama y otros proveedores;
- interfaz pequeña, viva y configurable;
- sistema con eventos estructurados;
- proyecto documentado por dominios.

## Restricciones vivas

- No copiar el repo viejo como base.
- No volver a mezclar Hermes dentro del núcleo de Lokkygoat.
- No guardar secretos en repo.
- No loguear claves API.
- Documentar cada etapa.
- Mantener trazabilidad por dominios.

## Próxima prioridad recomendada

Saneamiento base y pulido:

1. normalizar nombres remanentes de Hermes a Lokkygoat;
2. revisar y restringir canales de `preload.js` (privilegios mínimos);
3. añadir comprobación dinámica de salud (ping) en background para los proveedores seleccionados.
