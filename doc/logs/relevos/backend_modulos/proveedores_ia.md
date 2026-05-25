# Relevo dominio: proveedores_ia

## Uso

Este archivo registra la continuidad activa del dominio `proveedores_ia`.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- La lógica multiproveedor se encuentra separada por completo en la carpeta `src/providers/` y es consumida de forma uniforme mediante el `providerManager.js`.

## Qué quedó ya hecho

- Creación de adaptadores individuales independientes para Ollama, OpenAI, Claude y Hermes.
- Gestor centralizado que delega según el proveedor configurado.
- Extracción del prompt del sistema base a `src/constants.js` para fácil edición.

## Qué no quedó hecho

- No se ha implementado soporte para streaming de respuestas (las respuestas de chat se procesan y devuelven completas de golpe).

## Riesgos o trampas conocidas

- Configurar un endpoint incorrecto o sin API key para OpenAI o Claude resultará en un fallo controlado que se devuelve al chat, pero el tiempo de espera por defecto de fetch puede ser alto.

## Archivos clave a leer

- `src/providers/providerManager.js`
- `src/providers/ollamaProvider.js`
- `src/providers/openaiProvider.js`
- `src/providers/claudeProvider.js`
- `src/providers/hermesProvider.js`

## Validaciones pendientes

- Probar la conectividad real con cada uno de los proveedores configurados.

## Siguiente micro-paso recomendado

- Agregar un timeout a las llamadas de fetch para abortar peticiones colgadas tras 10 segundos.
