# Log frontend superficie: chat

## Uso

Este archivo registra el historial operativo y técnico de la superficie visual `chat`.

No debe usarse como relevo principal.
Para continuidad abierta, usar el relevo del dominio correspondiente.

## Entradas

### Etapa

- Fecha: 2026-05-25
- Objetivo: Permitir al usuario elegir y configurar el proveedor y modelo de conexión IA de forma sencilla desde el chat, y dar herramientas de recuperación rápida ante fallos.
- Contexto breve: Se modificó la interfaz `chat.html` para incorporar un botón directo de Ajustes en el header, un menú desplegable de Proveedor y botón de Configurar Conexión en la barra lateral, y un asistente emergente inteligente con botón de "Configurar Conexión" cuando ocurre un error de la API (por ejemplo, error 404 al no estar descargado un modelo local en Ollama).

### Cambios

- Archivos nuevos: Ninguno.
- Archivos modificados:
  - `chat.html`
- Superficies afectadas:
  - Ventana de chat de la mascota (`chatWindow`).
- Tests/validaciones: Verificación sintáctica de HTML y JavaScript.

### Decisiones

- Añadir un botón `ajustes` a la derecha en la sección `.ch-actions` del header para abrir de forma directa la ventana `settingsWindow`.
- Incorporar un selector desplegable `#sb-provider-select` en la barra lateral para permitir al usuario cambiar dinámicamente entre Ollama, OpenAI, Claude, Hermes, OpenClaw, Codex y Custom.
- Automatizar la pre-configuración de URLs y modelos por defecto al cambiar de proveedor desde el desplegable del chat (similar a como lo hace `settings.html`), guardando la configuración mediante IPC e informando al usuario en el historial mediante un mensaje del sistema.
- Cargar automáticamente la ventana de ajustes si el nuevo proveedor requiere de una API Key y esta se encuentra vacía.
- Capturar los errores devueltos por los proveedores de IA o las excepciones de red y añadir un cuadro de diálogo descriptivo en el chat con sugerencias de diagnóstico y un botón directo para acceder a la configuración.

### Validación

- Validación sintáctica completada con éxito.

### Incidencias detectadas

- Ninguna.

### Siguiente paso sugerido

- Añadir un diálogo de validación rápida de conectividad al cambiar de proveedor para asegurar que la API seleccionada responde correctamente antes de que el usuario envíe su primer mensaje.
