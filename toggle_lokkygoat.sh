#!/bin/bash
# Script para encender y apagar Lokkygoat (Toggle)

# Detectar dinámicamente DISPLAY y XAUTHORITY del proceso plasmashell/kwin/krunner del usuario actual
DESKTOP_PID=$(pgrep -u "$USER" plasmashell || pgrep -u "$USER" kwin || pgrep -u "$USER" krunner | head -n 1)
if [ -n "$DESKTOP_PID" ]; then
    DETECTED_DISPLAY=$(tr '\0' '\n' < "/proc/$DESKTOP_PID/environ" | grep "^DISPLAY=" | cut -d= -f2-)
    DETECTED_XAUTHORITY=$(tr '\0' '\n' < "/proc/$DESKTOP_PID/environ" | grep "^XAUTHORITY=" | cut -d= -f2-)
    
    if [ -n "$DETECTED_DISPLAY" ]; then
        export DISPLAY="$DETECTED_DISPLAY"
    fi
    if [ -n "$DETECTED_XAUTHORITY" ]; then
        export XAUTHORITY="$DETECTED_XAUTHORITY"
    fi
fi

# Fallback por seguridad
export DISPLAY="${DISPLAY:-:0}"

# Buscar los PIDs principales de Electron para Lokkygoat (excluyendo procesos hijo --type=)
PIDS=""
for pid in $(pgrep -f "electron"); do
    if [ -f "/proc/$pid/cmdline" ]; then
        CMDLINE=$(tr '\0' ' ' < "/proc/$pid/cmdline")
        if [[ "$CMDLINE" == *"lokkygoat"* ]] && [[ "$CMDLINE" != *"--type="* ]]; then
            PIDS="$PIDS $pid"
        fi
    fi
done

# Eliminar espacios extras
PIDS=$(echo "$PIDS" | xargs)

if [ -n "$PIDS" ]; then
    echo "Lokkygoat está en ejecución (PIDs principales: $PIDS). Deteniendo..."
    # Matar los procesos principales de forma controlada
    kill $PIDS
    sleep 1.5
    
    # Comprobar si siguen vivos y forzar
    STILL_ALIVE=""
    for pid in $PIDS; do
        if kill -0 "$pid" 2>/dev/null; then
            STILL_ALIVE="$STILL_ALIVE $pid"
        fi
    done
    STILL_ALIVE=$(echo "$STILL_ALIVE" | xargs)
    
    if [ -n "$STILL_ALIVE" ]; then
        echo "Forzando cierre de procesos principales restantes (PIDs: $STILL_ALIVE)..."
        kill -9 $STILL_ALIVE
    fi
    echo "Lokkygoat se ha apagado."
else
    echo "Lokkygoat no está en ejecución. Iniciando..."
    cd /home/lokky/lokkygoat || exit 1
    # Iniciar con nohup para desvincular el proceso
    nohup npm start > /dev/null 2>&1 &
    echo "Lokkygoat se ha encendido."
fi
