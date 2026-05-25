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
