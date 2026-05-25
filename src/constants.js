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
  apiKey: "",
  apiUrl: "http://127.0.0.1:11434",
  model: "llama3",
  memory_count: 0,
  skill_count: 0
};

module.exports = {
  LOG_FILE,
  SYSTEM_PROMPT,
  DEFAULT_CONFIG
};
