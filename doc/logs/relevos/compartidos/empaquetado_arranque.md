# Relevo dominio: empaquetado_arranque

## Uso

Este archivo registra la continuidad activa del dominio `empaquetado_arranque`.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- Script de toggle funcional y robusto disponible en el raíz: `toggle_lokkygoat.sh`.
- Atajo de teclado KDE mapeado a la tecla F7 mediante `/home/lokky/.local/share/applications/net.local.toggle_companion_desktop.sh.desktop`.

## Qué quedó ya hecho

- Creación de `toggle_lokkygoat.sh` con detección dinámica del entorno gráfico del usuario.
- Configuración de la entrada `.desktop` y actualización del comando de ejecución (`Exec`) al nuevo script del proyecto.
- Regeneración de la base de datos de servicios de KDE (`kbuildsycoca6`).

## Qué no quedó hecho

- Integración de opciones avanzadas de arranque en segundo plano directamente configurables desde la interfaz de ajustes de la aplicación.

## Riesgos o trampas conocidas

- En ejecuciones remotas o entornos sin proceso de escritorio KDE activo, `pgrep` podría no detectar `plasmashell` o `kwin`, en cuyo caso el script usará `DISPLAY=:0` por defecto.
- Al reiniciar el sistema, si la base de datos de atajos globales de KDE se corrompe, podría ser necesario volver a validar la configuración en `kglobalshortcutsrc`.

## Archivos clave a leer

- `toggle_lokkygoat.sh`
- `/home/lokky/.local/share/applications/net.local.toggle_companion_desktop.sh.desktop`
- `~/.config/kglobalshortcutsrc`

## Validaciones pendientes

- Confirmar que la tecla F7 física realiza el encendido/apagado cíclico del Tamagotchi de forma correcta.

## Siguiente micro-paso recomendado

- Agregar una validación inicial en la interfaz de ajustes que permita verificar si el atajo global F7 se encuentra correctamente configurado.
