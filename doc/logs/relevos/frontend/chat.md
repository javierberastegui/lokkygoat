# Relevo dominio: chat

## Uso

Este archivo registra la continuidad activa del dominio `chat` en el frontend.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- La interfaz del panel de chat (`chat.html`) permite elegir dinámicamente el proveedor de IA y abrir los ajustes de configuración de forma interactiva.

## Qué quedó ya hecho

- Botón de ajustes en la barra de herramientas del header de la ventana de chat.
- Sección "Conexión IA" en la barra lateral con selector de proveedor (`#sb-provider-select`) y botón "Configurar Conexión".
- Guardado y refresco automático de la configuración seleccionada al cambiar el dropdown.
- Mensajes informativos tipo sistema en la ventana de chat al realizar cambios o encontrar fallos.
- Detección de errores y renderizado de un asistente interactivo con botón directo a Ajustes si el envío del chat falla o devuelve una respuesta de error.

## Qué no quedó hecho

- Comprobación en segundo plano del estado de salud (ping) de los proveedores antes de que el usuario interactúe con el chat.

## Riesgos o trampas conocidas

- Si se altera el listado de proveedores en `settings.html`, se debe actualizar en la misma medida en `chat.html` para evitar desincronizaciones en el dropdown.

## Archivos clave a leer

- `chat.html`
- `preload.js`
- `src/ipc/ipcHandlers.js`

## Validaciones pendientes

- Validar funcionamiento en tiempo real al cambiar entre un proveedor local offline y uno online.

## Siguiente micro-paso recomendado

- Agregar un icono dinámico junto al proveedor en la barra lateral que cambie a color verde/rojo según el estado de la conexión mediante un ping asíncrono.
