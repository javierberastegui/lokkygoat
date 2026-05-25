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
  const copy = JSON.parse(JSON.stringify(cfg));
  if (copy.apiKey) {
    copy.apiKey = "[REDACTED]";
  }
  if (copy.providers) {
    for (const p of Object.keys(copy.providers)) {
      if (copy.providers[p] && copy.providers[p].apiKey) {
        copy.providers[p].apiKey = "[REDACTED]";
      }
    }
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
      
      // Deep merge with DEFAULT_CONFIG
      currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
      
      // Copy root settings except providers
      for (const key of Object.keys(parsed)) {
        if (key !== "providers") {
          currentConfig[key] = parsed[key];
        }
      }
      
      // Copy or merge providers
      if (parsed.providers) {
        for (const p of Object.keys(parsed.providers)) {
          currentConfig.providers[p] = {
            ...currentConfig.providers[p],
            ...parsed.providers[p]
          };
        }
      } else {
        // Migration: Old flat config to structured config
        const activeProv = parsed.provider || DEFAULT_CONFIG.provider;
        if (currentConfig.providers[activeProv]) {
          if (parsed.apiKey !== undefined) currentConfig.providers[activeProv].apiKey = parsed.apiKey;
          if (parsed.apiUrl !== undefined) currentConfig.providers[activeProv].apiUrl = parsed.apiUrl;
          if (parsed.model !== undefined) currentConfig.providers[activeProv].model = parsed.model;
        }
      }
      
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
