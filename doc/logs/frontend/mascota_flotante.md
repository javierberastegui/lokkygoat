# Log frontend superficie: mascota_flotante

## Uso

Este archivo registra el historial operativo y técnico de la superficie visual `mascota_flotante`.

No debe usarse como relevo principal.
Para continuidad abierta, usar el relevo del dominio correspondiente.

## Entradas

### Etapa

- Fecha: 2026-05-25
- Objetivo: Rediseñar visualmente la mascota flotante para adoptar la identidad de Goatky, el droid cabra de Red Team.
- Contexto breve: Se reescribió `pet.html` por completo para reemplazar el núcleo abstracto anterior por un diseño de robot blanco en SVG con visor brillante, ojos expresivos cian, cuernos cibernéticos y detalles de terminal, manteniendo compatibilidad total de eventos e IPC.

### Cambios

- Archivos nuevos: ninguno.
- Archivos modificados:
  - `pet.html` (completo)
- Superficies afectadas:
  - Ventana flotante de la mascota (`petWindow`).
- Tests/validaciones: `node --check`, arranque manual de la interfaz.

### Decisiones

- Reemplazar el SVG antiguo por un diseño modular de robot/cabra con un visor central.
- Conservar los IDs y clases HTML (`.eyes-open`, `.eyes-closed`, `#mouth-open`, `#mouth-closed`) y la lógica de Javascript para garantizar la compatibilidad con las animaciones de sueño y salto.
- Adaptar las frases flotantes (chatter) para alinearlas a la temática de Red Team y laboratorios de ciberseguridad autorizados.

### Validación

- Se verificó la sintaxis del código HTML/JS.

### Incidencias detectadas

- Ninguna.

### Siguiente paso sugerido

- Añadir animaciones personalizadas en el visor cuando el usuario pase el cursor (hover), como barras de escaneo horizontales adicionales.
