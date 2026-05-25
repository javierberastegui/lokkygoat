# Lokkygoat (Cabra Tamagotchi Independiente)

Una mascota de escritorio y asistente virtual flotante de tipo Tamagotchi (Cabra) desacoplada e independiente, diseñada con una arquitectura moderna de Electron y Node.js. 

Esta versión es completamente autónoma: ya no requiere que tengas el panel de Hermes ejecutándose en segundo plano (a menos que desees usar ese proveedor), y puede conectarse de forma nativa a múltiples proveedores de Modelos de Lenguaje (LLM).

---

## Características Principales

- **Mascota flotante y animada**: Un ser cibernético con animaciones fluidas basados en canvas y SVG que reacciona a tus interacciones.
- **Configuración multiproveedor**: Configurable directamente desde la ventana de Ajustes (⚙) para interactuar usando:
  - **Ollama**: Totalmente local (por defecto usa `http://127.0.0.1:11434` y el modelo `llama3`).
  - **OpenAI (ChatGPT)**: Usando tu clave API oficial (`gpt-4o-mini`, `gpt-4o`, etc.).
  - **Anthropic Claude**: Conexión nativa a la API de Claude (`claude-3-5-sonnet-latest`).
  - **Hermes Dashboard**: Si deseas seguir acoplándola a tu panel clásico de Hermes en el puerto `9119`.
  - **OpenClaw, Codex o Servidores Personalizados**: Mediante URLs personalizadas compatibles con OpenAI.
- **Persistencia local**: Guarda el estado del Tamagotchi (habilidades aprendidas, recuerdos guardados, nombre y personalizaciones) en `~/.config/lokkygoat/config.json`.
- **Interacciones Gamificadas**: A medida que chateas con Lokkygoat, tiene posibilidades de aprender habilidades (animación de celebración ⚡), recordar datos sobre ti (animación de brillo 👾) o irse a dormir (Zzz...).
- **Chat flotante integrado**: Una ventana translúcida con diseño moderno inspirada en interfaces chat donde puedes conversar directamente con tu mascota.

---

## Instalación y Ejecución

### Requisitos

- **Node.js** (versión 18 o superior).
- **npm** (gestor de paquetes de Node).

### Instrucciones

1. **Instalar Dependencias**:
   Instala las dependencias del proyecto (principalmente Electron) ejecutando:
   ```bash
   npm install
   ```

2. **Iniciar Lokkygoat**:
   Para iniciar la mascota flotante, ejecuta:
   ```bash
   npm start
   ```

3. **Configuración Inicial**:
   - Pasa el cursor sobre la cabra y haz clic en el botón de engranaje (**⚙**) para abrir la ventana de ajustes.
   - Elige tu proveedor de IA de preferencia (por ejemplo, Ollama si lo tienes corriendo localmente, o introduce tu clave API de OpenAI/Claude).
   - Guarda los cambios. Tu mascota se actualizará instantáneamente sin necesidad de reiniciar la aplicación.

---

## Archivo de Configuración

La configuración y estadísticas de Lokkygoat se guardan de forma local en:
`~/.config/lokkygoat/config.json`

Ejemplo del contenido del archivo:
```json
{
  "name": "Lokkygoat",
  "size": "normal",
  "movement_speed": "normal",
  "theme": "violeta",
  "quiet_mode": false,
  "provider": "ollama",
  "apiKey": "",
  "apiUrl": "http://127.0.0.1:11434",
  "model": "llama3",
  "memory_count": 5,
  "skill_count": 2
}
```

---

## Solución de Problemas

- **Mascota en estado OFFLINE**: Si has configurado la cabra para conectarse a **Hermes** y este no está activo, la cabra se volverá de color rojo e indicará `OFFLINE` en el bubble chat. Inicia tu panel de Hermes o cambia el proveedor de IA en la pantalla de ajustes para volverla a la vida.
- **La ventana de la cabra es transparente o no recibe clics**: En ciertos entornos Linux con Wayland, las ventanas transparentes de Electron pueden tener dificultades para capturar eventos de ratón. Si es tu caso, puedes iniciarla en modo ventana segura:
  ```bash
  COMPANION_SAFE_WINDOW=1 npm start
  ```
- **¿Cómo cerrar Lokkygoat?**: Pasa el cursor por encima de la cabra y haz clic en la pequeña cruz roja (**×**) situada en la esquina superior derecha de la mascota.
