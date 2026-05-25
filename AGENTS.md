# AGENTS.md

# 🐐 Lokkygoat

## Propósito del proyecto

Lokkygoat es una mascota de escritorio inteligente, configurable y extensible, estilo Tamagotchi, construida como aplicación Electron + Node.js.

Debe actuar como puente visual e interactivo entre el usuario y distintos proveedores de IA o sistemas locales, manteniendo una base limpia, trazable y progresiva.

El sistema debe evolucionar priorizando:

- mascota flotante estable;
- chat local integrado;
- configuración local clara;
- conectores IA separados por proveedor;
- eventos estructurados;
- documentación viva por dominio;
- seguridad básica con secretos;
- crecimiento por capas sin contaminar el repo con otros proyectos.

## Arquitectura base obligatoria

Este proyecto debe mantenerse sobre esta base:

- Electron para aplicación de escritorio.
- Node.js para proceso principal y lógica local.
- HTML/CSS/JS para superficies visuales actuales.
- IPC controlado mediante `preload.js`.
- Configuración local en `~/.config/lokkygoat/config.json`.
- Proveedores IA integrados mediante adaptadores o módulos separados cuando crezcan.
- Sin dependencia obligatoria de Hermes.
- Sin dependencia obligatoria de OpenClaw.
- Sin backend web externo obligatorio para arrancar.

## Restricciones obligatorias

El agente debe respetar siempre estas reglas:

- no empezar desde cero;
- no sustituir el proyecto por código de Hermes;
- no copiar bloques grandes desde `cabra-tamagotchi-companion` sin revisión explícita;
- no convertir Lokkygoat en un clon del repo viejo;
- no cambiar la arquitectura base Electron + Node.js sin instrucción expresa;
- no cambiar rutas base existentes sin necesidad real;
- no cambiar nomenclatura base ya asentada sin motivo fuerte;
- no guardar secretos en el repositorio;
- no mostrar claves API en logs, consola, documentación o respuestas;
- no entregar pseudocódigo;
- no dar teoría cuando se han pedido cambios aplicables;
- entregar siempre archivos completos cuando se proporcionen cambios de código o documentación;
- documentar cada etapa en el dominio correspondiente;
- no usar `doc/logs/historico.md` como bitácora principal;
- no dar por cerrada una etapa sin validación proporcional.

## Regla de repos contaminados

El repo `cabra-tamagotchi-companion` queda como referencia histórica/cuarentena.

No debe usarse como base directa porque durante su evolución se mezcló con estructura o lógica de Hermes.

Reglas:

- el repo activo es `lokkygoat`;
- si se recupera una idea del repo viejo, debe documentarse como recuperación puntual;
- no se deben copiar árboles completos;
- no se deben copiar dependencias, rutas, servicios o nombres de Hermes sin justificación;
- cualquier recuperación debe quedar registrada en `doc/logs/relevos/compartidos/arquitectura.md` o en el log del dominio afectado.

## Separación obligatoria de dominios

Debe mantenerse esta separación de dominio salvo orden explícita en contra:

- mascota flotante;
- chat;
- ajustes/configuración;
- proveedores IA;
- eventos internos;
- memoria/local state;
- empaquetado/arranque;
- seguridad;
- documentación operativa.

No se deben mezclar responsabilidades sin justificación explícita.

## Capa estratégica obligatoria de eventos

Lokkygoat debe evolucionar con una capa central de eventos internos.

Principios obligatorios:

- los módulos relevantes deben poder emitir eventos estructurados;
- las notificaciones o reacciones deben decidirse por una capa central de reglas;
- no se deben disparar avisos sueltos acoplados módulo a módulo;
- primero se emite un evento estructurado y luego se decide si se registra, muestra, resume o notifica;
- las animaciones de la mascota deben poder reaccionar a eventos, pero no ser la única fuente de verdad;
- los eventos deben ser compatibles con logs, UI, futuras notificaciones y posibles integraciones con Hermes/OpenClaw.

Tipos mínimos esperados:

- `app.started`;
- `app.error`;
- `pet.state_changed`;
- `pet.animation_requested`;
- `chat.message_sent`;
- `chat.response_received`;
- `provider.request_started`;
- `provider.request_failed`;
- `provider.request_succeeded`;
- `config.updated`;
- `memory.updated`;
- `security.secret_redacted`.

## Seguridad obligatoria

Reglas:

- nunca loguear `apiKey`, tokens o secretos;
- si se documenta configuración, usar placeholders;
- `CONFIG.example.json` no debe contener secretos reales;
- el archivo local de configuración debe tratarse como sensible;
- si se modifica gestión de configuración, evaluar permisos de archivo;
- `preload.js` debe exponer una API mínima y controlada;
- no abrir canales IPC arbitrarios sin whitelist;
- no activar integraciones externas sin que estén configuradas explícitamente.

## Guardarraíles de modularidad

El proyecto debe evitar archivos monstruo.

Preferencia:

- muchos archivos pequeños, coherentes y bien nombrados;
- separación por responsabilidad;
- proveedores IA separados cuando el bloque crezca;
- UI separada de lógica de proveedores;
- eventos separados de animaciones;
- configuración separada de llamadas IA.

Umbrales prácticos:

- por encima de 300-400 líneas, revisar división;
- por encima de 600 líneas, división obligatoria si el archivo sigue creciendo;
- más de 3 responsabilidades claras en un archivo obliga a proponer extracción.

Orden preferente de extracción:

1. constantes;
2. helpers puros;
3. servicios de configuración;
4. bus de eventos;
5. providers;
6. componentes/superficies visuales;
7. lógica de animación compleja.

## Instrucciones normativas del proyecto

Además de este archivo, el agente debe obedecer los documentos de `doc/instrucciones/`.

Jerarquía operativa:

1. `AGENTS.md`;
2. `doc/instrucciones/README.md`;
3. instrucciones específicas aplicables;
4. `doc/estado_actual.md`;
5. `doc/protocolo_relevo.md`;
6. relevo del dominio afectado;
7. logs del dominio afectado;
8. incidencias abiertas relacionadas;
9. prompt activo si existe en `doc/prompts/`.

Si hay conflicto:

- prevalece `AGENTS.md`;
- después prevalece la instrucción más específica;
- si sigue habiendo conflicto, elegir la opción más conservadora y documentarlo.

## Lectura obligatoria antes de tocar nada

Antes de empezar una etapa, el agente debe leer:

1. `AGENTS.md`;
2. `doc/instrucciones/README.md`;
3. `doc/instrucciones/mapa_dominios.md`;
4. `doc/estado_actual.md`;
5. `doc/protocolo_relevo.md`;
6. relevo del dominio afectado;
7. log del dominio afectado si existe;
8. incidencias abiertas relacionadas.

## Forma de trabajo obligatoria

Para cada etapa:

1. entender el estado real actual;
2. identificar el dominio afectado;
3. revisar instrucciones aplicables;
4. tocar solo lo necesario;
5. mantener arquitectura, naming y rutas;
6. aplicar cambios completos;
7. validar según impacto;
8. documentar resultado y decisiones;
9. actualizar relevo si quedan pasos abiertos;
10. dejar siguiente paso claro.

## Alta obligatoria de trazabilidad documental

Si una etapa introduce un módulo, superficie o dominio nuevo y no existe trazabilidad documental específica, el agente debe crearla.

Reglas:

- lógica principal o providers: `doc/logs/backend_modulos/<slug>.md`;
- superficies visuales: `doc/logs/frontend/<slug>.md`;
- continuidad abierta backend: `doc/logs/relevos/backend_modulos/<slug>.md`;
- continuidad abierta frontend: `doc/logs/relevos/frontend/<slug>.md`;
- piezas transversales: `doc/logs/relevos/compartidos/<slug>.md`;
- incidencias: `doc/logs/incidencias/`;
- si el dominio puede invocarse por nombre natural, actualizar `doc/instrucciones/mapa_dominios.md`.

## Documentación obligatoria al cerrar etapa

Al cerrar una etapa, actualizar lo que aplique:

- `doc/estado_actual.md` si cambia el estado vivo del proyecto;
- log del dominio correspondiente;
- relevo del dominio correspondiente si quedan pasos abiertos;
- `doc/logs/incidencias/errores_detectados.md` si hay defectos relevantes;
- `doc/logs/incidencias/deuda_tecnica.md` si hay deuda no urgente;
- `doc/logs/incidencias/bloqueos_actuales.md` si hay bloqueo real.

## Validación obligatoria

Toda etapa debe terminar con validación proporcional:

- `npm install` si se alteran dependencias;
- `npm start` o arranque equivalente si se toca Electron;
- revisión de consola/logs si se toca runtime;
- prueba manual si se toca UI;
- comprobación de no secretos si se toca configuración;
- `git status --short` antes de cerrar.

Si algo no se pudo validar, debe quedar dicho con claridad.

## Formato de entrega esperado

Cuando el agente entregue cambios, debe indicar:

- archivos nuevos;
- archivos modificados;
- dominio afectado;
- validaciones ejecutadas;
- decisiones tomadas;
- incidencias detectadas;
- relevo actualizado;
- siguiente paso recomendado.

## Regla final

La prioridad no es avanzar rápido.

La prioridad es avanzar limpio, trazable, acumulable y sin volver a contaminar Lokkygoat con otros proyectos.
