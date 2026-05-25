const path = require("path");

const LOG_FILE = "/tmp/hermes-companion-desktop.log";

const SYSTEM_PROMPT = `Eres una Cabra Tamagotchi compañera (Lokkygoat), una mascota de escritorio sabia, divertida y tecnológica. Tus respuestas deben ser breves, directas y con personalidad, usando emojis relacionados con cabras (🐐), tecnología (👾, 🧠, ⚡) y el espacio (🌌). Mantén las respuestas cortas porque se muestran en una pequeña ventana de chat de escritorio.`;

const DEFAULT_CONFIG = {
  name: "Cabra",
  size: "normal",
  movement_speed: "normal",
  theme: "violeta",
  quiet_mode: false,
  provider: "ollama",
  providers: {
    ollama: {
      apiUrl: "http://127.0.0.1:11434",
      model: "llama3"
    },
    openai: {
      apiKey: "",
      model: "gpt-4o-mini"
    },
    claude: {
      apiKey: "",
      model: "claude-3-5-sonnet-latest"
    },
    hermes: {
      apiUrl: "http://127.0.0.1:9119"
    },
    openclaw: {
      apiKey: "",
      apiUrl: "http://127.0.0.1:8000/v1/chat/completions",
      model: "default"
    },
    codex: {
      apiKey: "",
      apiUrl: "http://127.0.0.1:8000/v1/chat/completions",
      model: "default"
    },
    custom: {
      apiKey: "",
      apiUrl: "http://127.0.0.1:8000/v1/chat/completions",
      model: "default"
    }
  },
  memory_count: 0,
  skill_count: 0
};

module.exports = {
  LOG_FILE,
  SYSTEM_PROMPT,
  DEFAULT_CONFIG
};
