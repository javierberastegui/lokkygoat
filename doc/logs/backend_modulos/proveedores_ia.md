# Log backend módulo: proveedores_ia

## Uso

Este archivo registra el historial operativo y técnico del módulo lógico `proveedores_ia`.

No debe usarse como relevo principal.
Para continuidad abierta, usar el relevo del dominio correspondiente.

## Entradas

### Etapa

- Fecha: 2026-05-25
- Objetivo: Modularizar y desacoplar los proveedores de IA del núcleo de la aplicación.
- Contexto breve: Se extrajo la lógica de llamadas HTTP a Ollama, OpenAI, Claude y Hermes de `main.js` hacia adaptadores específicos bajo `src/providers/`, dirigidos por un `providerManager.js`.

### Cambios

- Archivos nuevos:
  - `src/providers/providerManager.js`
  - `src/providers/ollamaProvider.js`
  - `src/providers/openaiProvider.js`
  - `src/providers/claudeProvider.js`
  - `src/providers/hermesProvider.js`
- Archivos modificados:
  - `main.js` (delegación)
- Dependencias: ninguna externa (usa `fetch` nativo).
- Tests/validaciones: `node --check`

### Decisiones

- Aislar cada API en su propio adaptador con una firma unificada `sendMessage(message, history, config)` para simplificar el crecimiento multiproveedor futuro.
- El adaptador de Hermes expone además el método `getCompanionState(config)` para acoplar la sincronización de estado local.

### Validación

- Validación sintáctica exitosa.

### Incidencias detectadas

- Ninguna.

### Siguiente paso sugerido

- Escribir mocks de prueba para simular fallos de API de red y respuestas tardías.

### Etapa

- Fecha: 2026-05-25
- Objetivo: Simplificar la conexión y añadir comprobación dinámica de salud (ping).
- Contexto breve: Se implementó un endpoint de prueba IPC en main para verificar la conectividad con Ollama, OpenAI, Claude y Hermes con un timeout de 5 segundos. Se habilitó un indicador visual asíncrono periódico en el panel de chat y un botón de prueba directa en los ajustes.
- Archivos nuevos: ninguno.
- Archivos modificados:
  - `src/providers/providerManager.js`
  - `src/ipc/ipcHandlers.js`
  - `preload.js`
  - `chat.html`
  - `settings.html`
  - `src/windows/windowManager.js`
- Dependencias: ninguna.
- Tests/validaciones: `node --check`
- Decisiones:
  - El test de conectividad se ejecuta enteramente en el proceso principal (`ipcMain`) para evitar problemas de CORS y CSP en el renderizador.
  - La barra lateral del chat realiza el ping al cargar y luego cada 15 segundos.
- Validación:
  - Verificado sintácticamente con `node --check`.
- Incidencias detectadas: ninguna.
- Siguiente paso sugerido: comprobar en runtime con los proveedores activos.
