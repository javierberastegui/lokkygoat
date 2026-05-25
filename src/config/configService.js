const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const { LOG_FILE, DEFAULT_CONFIG } = require("../constants");

const CONFIG_DIR = path.join(app.getPath("home"), ".config", "lokkygoat");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

let currentConfig = { ...DEFAULT_CONFIG };

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { fs.appendFileSync(LOG_FILE, line); } catch (_) {}
}

function redactConfig(cfg) {
  if (!cfg) return "";
  const copy = { ...cfg };
  if (copy.apiKey) {
    copy.apiKey = "[REDACTED]";
  }
  return JSON.stringify(copy);
}

function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, "utf8");
      const parsed = JSON.parse(data);
      currentConfig = { ...DEFAULT_CONFIG, ...parsed };
      log(`Config loaded: ${redactConfig(currentConfig)}`);
    } else {
      saveConfig(currentConfig);
      log("Default config initialized.");
    }
  } catch (err) {
    log(`Error loading config: ${err.message}`);
  }
  return currentConfig;
}

function saveConfig(cfg) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    currentConfig = { ...currentConfig, ...cfg };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(currentConfig, null, 2), "utf8");
    log("Config saved successfully.");
  } catch (err) {
    log(`Error saving config: ${err.message}`);
  }
  return currentConfig;
}

function getConfig() {
  return currentConfig;
}

module.exports = {
  loadConfig,
  saveConfig,
  getConfig,
  log,
  redactConfig
};
