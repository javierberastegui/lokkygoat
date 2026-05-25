const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const LOG_FILE = "/tmp/hermes-companion-desktop.log";
const safeMode = process.env.COMPANION_SAFE_WINDOW === "1";
const debugMode = process.env.COMPANION_DEBUG_WINDOW === "1";

let petWindow = null;
let chatWindow = null;
let settingsWindow = null;
let moveTimer = null;
let lastActivity = Date.now();
let movementMode = "normal";

let vx = 0.25;
let vy = 0.20;
let targetVx = 0.25;
let targetVy = 0.20;

let behaviorState = "walk";
let behaviorTicks = 0;
let lastWarpTime = Date.now();
let wanderAngle = Math.random() * Math.PI * 2;
let speedBase = 0.25;

// Configuration & Local State
const CONFIG_DIR = path.join(app.getPath("home"), ".config", "lokkygoat");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

let currentConfig = {
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

let lastEventId = null;
let lastEventType = null;
let currentOperationalScene = {
  state: "idle",
  summary: "Esperando orden.",
  event_id: null
};

let chatHistory = [];
const SYSTEM_PROMPT = `Eres una Cabra Tamagotchi compañera (Lokkygoat), una mascota de escritorio sabia, divertida y tecnológica. Tus respuestas deben ser breves, directas y con personalidad, usando emojis relacionados con cabras (🐐), tecnología (👾, 🧠, ⚡) y el espacio (🌌). Mantén las respuestas cortas porque se muestran en una pequeña ventana de chat de escritorio.`;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { fs.appendFileSync(LOG_FILE, line); } catch (_) {}
}

function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, "utf8");
      const parsed = JSON.parse(data);
      currentConfig = { ...currentConfig, ...parsed };
      log(`Config loaded: ${JSON.stringify(currentConfig)}`);
    } else {
      saveConfig(currentConfig);
      log("Default config initialized.");
    }
  } catch (err) {
    log(`Error loading config: ${err.message}`);
  }
}

function saveConfig(cfg) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), "utf8");
    log("Config saved successfully.");
  } catch (err) {
    log(`Error saving config: ${err.message}`);
  }
}

// Load config at startup
loadConfig();

function area() {
  return screen.getPrimaryDisplay().workArea;
}

function clamp(x, y, w, h) {
  const a = area();
  return {
    x: Math.max(a.x, Math.min(x, a.x + a.width - w)),
    y: Math.max(a.y, Math.min(y, a.y + a.height - h)),
  };
}

function stepPet() {
  if (!petWindow || petWindow.isDestroyed()) return;
  if (safeMode) return;
  if (chatWindow && !chatWindow.isDestroyed() && chatWindow.isVisible()) return;
  if (movementMode === "pause") return;
  if (Date.now() - lastActivity < 1000) return;

  const a = area();
  const b = petWindow.getBounds();
  const skillCount = currentConfig.skill_count || 0;

  // Erratic behavior logic
  if (movementMode !== "suave") {
    if (behaviorTicks <= 0) {
      const rand = Math.random();
      
      // Determine thresholds based on learning status (prioritizing Walk and Halt, reducing Dash)
      let walkThreshold = 0.70;
      let dashThreshold = 0.75;
      let haltThreshold = 0.95;
      
      if (skillCount <= 2) {
        // Level 1: Newborn. Walk 75%, Dash 5%, Halt 20%, Warp 0%
        walkThreshold = 0.75;
        dashThreshold = 0.80;
        haltThreshold = 1.0;
      } else if (skillCount <= 5) {
        // Level 2: Explorer. Walk 70%, Dash 5%, Halt 20%, Warp 5%
        walkThreshold = 0.70;
        dashThreshold = 0.75;
        haltThreshold = 0.95;
      } else {
        // Level 3: Wise. Walk 50%, Dash 5%, Halt 40%, Warp 5%
        walkThreshold = 0.50;
        dashThreshold = 0.55;
        haltThreshold = 0.95;
      }
      
      if (rand < walkThreshold) {
        behaviorState = "walk";
        behaviorTicks = Math.floor(Math.random() * 400) + 300; // 7.5s to 17.5s (longer walk periods)
        const speedScale = skillCount <= 2 ? 0.95 : (skillCount <= 5 ? 1.3 : 1.7);
        speedBase = (0.045 + Math.random() * 0.05) * speedScale; // 4x slower than before
        wanderAngle = Math.random() * Math.PI * 2;
      } else if (rand < dashThreshold) {
        behaviorState = "dash";
        behaviorTicks = Math.floor(Math.random() * 150) + 100; // 2.5s to 6.25s
        const speedScale = skillCount <= 2 ? 1.0 : (skillCount <= 5 ? 1.3 : 1.6);
        speedBase = (0.13 + Math.random() * 0.09) * speedScale; // Slower dash
        wanderAngle = Math.random() * Math.PI * 2;
      } else if (rand < haltThreshold) {
        behaviorState = "halt";
        // Halt lasts much longer (10s to 30s) so it spends most of its time resting
        const haltDuration = skillCount >= 6 ? (Math.floor(Math.random() * 800) + 400) : (Math.floor(Math.random() * 500) + 300);
        behaviorTicks = haltDuration;
        speedBase = 0;
        targetVx = 0;
        targetVy = 0;
        if (Math.random() > 0.4 && petWindow && !petWindow.isDestroyed()) {
          petWindow.webContents.send("pet:celebrate");
        }
      } else {
        if (Date.now() - lastWarpTime > 12000) {
          behaviorState = "warp";
          lastWarpTime = Date.now();
        } else {
          behaviorState = "walk";
          behaviorTicks = 160; // 4s
        }
      }
    }
    
    // Smooth wandering logic (random walk on target velocity angle)
    if (behaviorState === "walk" || behaviorState === "dash") {
      wanderAngle += (Math.random() - 0.5) * 0.08;
      targetVx = Math.cos(wanderAngle) * speedBase;
      targetVy = Math.sin(wanderAngle) * speedBase;
    }
    
    behaviorTicks--;
  } else {
    behaviorState = "walk";
    wanderAngle += (Math.random() - 0.5) * 0.08;
    speedBase = 0.045; // Gentle float speed
    targetVx = Math.cos(wanderAngle) * speedBase;
    targetVy = Math.sin(wanderAngle) * speedBase;
  }

  // Handle warp behavior immediately (two-phase portal teleportation)
  if (behaviorState === "warp") {
    petWindow.webContents.send("pet:warp-start");
    
    behaviorState = "warping-transition";
    behaviorTicks = 999;
    
    vx = 0;
    vy = 0;
    targetVx = 0;
    targetVy = 0;
    
    setTimeout(() => {
      if (!petWindow || petWindow.isDestroyed()) return;
      
      const nx = a.x + Math.random() * (a.width - b.width);
      const ny = a.y + Math.random() * (a.height - b.height);
      const safe = clamp(nx, ny, b.width, b.height);
      
      petWindow.setBounds({
        x: Math.round(safe.x),
        y: Math.round(safe.y),
        width: b.width,
        height: b.height,
      }, true);
      
      petWindow.webContents.send("pet:warp-end");
      
      behaviorState = "walk";
      behaviorTicks = 160; // 4s
    }, 500);
    
    return;
  }

  if (behaviorState === "warping-transition") {
    return;
  }

  // Obstacle Avoidance (Gently steer away from screen boundaries)
  if (behaviorState === "walk" || behaviorState === "dash") {
    const margin = 120;
    let avoidForceX = 0;
    let avoidForceY = 0;

    if (b.x < a.x + margin) {
      const force = (a.x + margin - b.x) / margin;
      avoidForceX += force * 0.15; // Soft avoidance turn
    } else if (b.x + b.width > a.x + a.width - margin) {
      const force = (b.x + b.width - (a.x + a.width - margin)) / margin;
      avoidForceX -= force * 0.15;
    }

    if (b.y < a.y + margin) {
      const force = (a.y + margin - b.y) / margin;
      avoidForceY += force * 0.15;
    } else if (b.y + b.height > a.y + a.height - margin) {
      const force = (b.y + b.height - (a.y + a.height - margin)) / margin;
      avoidForceY -= force * 0.15;
    }

    if (avoidForceX !== 0 || avoidForceY !== 0) {
      targetVx += avoidForceX;
      targetVy += avoidForceY;
      // Cap targets to not exceed max speedBase
      const currentSpeedBase = speedBase;
      const actSpeed = Math.sqrt(targetVx * targetVx + targetVy * targetVy);
      if (actSpeed > currentSpeedBase) {
        targetVx = (targetVx / actSpeed) * currentSpeedBase;
        targetVy = (targetVy / actSpeed) * currentSpeedBase;
      }
      wanderAngle = Math.atan2(targetVy, targetVx);
    }
  }

  // Linear Interpolation (Lerp) for smooth, gentle acceleration/deceleration
  vx = vx + (targetVx - vx) * 0.03;
  vy = vy + (targetVy - vy) * 0.03;

  let speedMultiplier = 1.0;
  if (movementMode === "suave") {
    speedMultiplier = 0.35;
  } else if (movementMode === "vivo") {
    speedMultiplier = 1.6;
  }

  let nx = b.x + vx * speedMultiplier;
  let ny = b.y + vy * speedMultiplier;
  let bounced = false;

  if (nx <= a.x || nx >= a.x + a.width - b.width) {
    targetVx = -targetVx;
    vx = -vx;
    wanderAngle = Math.atan2(targetVy, targetVx);
    nx = b.x + vx * speedMultiplier;
    bounced = true;
  }

  if (ny <= a.y || ny >= a.y + a.height - b.height) {
    targetVy = -targetVy;
    vy = -vy;
    wanderAngle = Math.atan2(targetVy, targetVx);
    ny = b.y + vy * speedMultiplier;
    bounced = true;
  }

  if (bounced) {
    vx += (Math.random() - 0.5) * 0.04;
    vy += (Math.random() - 0.5) * 0.03;
    petWindow.webContents.send("pet:bounce");
    log(`pet bounce vx=${vx.toFixed(2)} vy=${vy.toFixed(2)}`);
  }

  // Send real vector steps for wind tilt / squash deformation
  petWindow.webContents.send("pet:step", { vx, vy, behaviorState });

  const safe = clamp(nx, ny, b.width, b.height);
  petWindow.setBounds({
    x: Math.round(safe.x),
    y: Math.round(safe.y),
    width: b.width,
    height: b.height,
  }, true);
}

function createPetWindow() {
  try {
    const a = area();
    const width = safeMode ? 300 : 260;
    const height = safeMode ? 300 : 260;

    petWindow = new BrowserWindow({
      width,
      height,
      x: a.x + a.width - width - 40,
      y: a.y + a.height - height - 70,
      frame: safeMode,
      transparent: !safeMode,
      backgroundColor: safeMode ? "#111827" : "#00000000",
      alwaysOnTop: true,
      skipTaskbar: !safeMode,
      resizable: safeMode,
      hasShadow: false,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
      },
    });

    petWindow.setAlwaysOnTop(true, "screen-saver");
    petWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    petWindow.once("ready-to-show", () => {
      petWindow.show();
      petWindow.moveTop();
      log(`pet ready bounds=${JSON.stringify(petWindow.getBounds())}`);
    });

    petWindow.webContents.on("did-finish-load", () => {
      log("pet loaded");
      if (!safeMode) {
        moveTimer = setInterval(stepPet, 25);
      }
    });

    petWindow.on("closed", () => {
      petWindow = null;
      if (moveTimer) clearInterval(moveTimer);
    });

    petWindow.loadFile(path.join(__dirname, "pet.html")).catch(err => {
      log(`Failed to load pet.html: ${err.message}`);
    });
  
  } catch (err) {
    log(`createPetWindow failed: ${err.message}\n${err.stack}`);
  }
}

function createChatWindow() {
  if (chatWindow && !chatWindow.isDestroyed()) {
    chatWindow.show();
    chatWindow.focus();
    chatWindow.moveTop();
    if (petWindow && !petWindow.isDestroyed()) {
      petWindow.webContents.send("pet:set-state", { state: "idle" });
    }
    return;
  }

  const a = area();
  const width = a.width;
  const height = a.height;
  const x = a.x;
  const y = a.y;

  chatWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    skipTaskbar: false,
    resizable: false,
    hasShadow: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  chatWindow.setAlwaysOnTop(true, "floating");
  chatWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  chatWindow.once("ready-to-show", () => {
    chatWindow.show();
    chatWindow.focus();
    chatWindow.moveTop();
    lastActivity = Date.now();
    log(`chat ready bounds=${JSON.stringify(chatWindow.getBounds())}`);
  });

  chatWindow.on("closed", () => {
    chatWindow = null;
  });

  chatWindow.loadFile(path.join(__dirname, "chat.html"));
}

function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }

  const { screen } = require("electron");
  const a = screen.getPrimaryDisplay().workArea;

  const width = 340;
  const height = 480;

  settingsWindow = new BrowserWindow({
    width,
    height,
    x: Math.floor(a.x + a.width / 2 - width / 2),
    y: Math.floor(a.y + a.height / 2 - height / 2),
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    skipTaskbar: false,
    resizable: false,
    hasShadow: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  settingsWindow.setAlwaysOnTop(true, "floating");
  settingsWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  settingsWindow.once("ready-to-show", () => {
    settingsWindow.show();
    settingsWindow.focus();
    settingsWindow.moveTop();
    lastActivity = Date.now();
  });

  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });

  settingsWindow.loadFile(path.join(__dirname, "settings.html"));
}

// State managers & Event triggers
function setOperationalScene(state, summary) {
  currentOperationalScene = {
    state: state,
    summary: summary,
    event_id: Math.random().toString(36).substring(2, 9)
  };
  
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.webContents.send("pet:set-state", { state });
  }
}

function triggerRandomPetEvent() {
  const rand = Math.random();
  if (rand < 0.10) {
    currentConfig.skill_count = (currentConfig.skill_count || 0) + 1;
    saveConfig(currentConfig);
    lastEventId = Math.random().toString(36).substring(2, 9);
    lastEventType = "skill_learned";
    if (petWindow && !petWindow.isDestroyed()) {
      petWindow.webContents.send("pet:celebrate");
    }
  } else if (rand < 0.25) {
    currentConfig.memory_count = (currentConfig.memory_count || 0) + 1;
    saveConfig(currentConfig);
    lastEventId = Math.random().toString(36).substring(2, 9);
    lastEventType = "memory_learned";
    if (petWindow && !petWindow.isDestroyed()) {
      petWindow.webContents.send("pet:glow");
    }
  } else if (rand < 0.30) {
    lastEventId = Math.random().toString(36).substring(2, 9);
    lastEventType = "dream_cycle";
    if (petWindow && !petWindow.isDestroyed()) {
      petWindow.webContents.send("pet:sleep");
    }
  }
}

async function getConsolidatedState() {
  if (currentConfig.provider === "hermes") {
    try {
      const baseUrl = currentConfig.apiUrl || "http://127.0.0.1:9119";
      const res = await fetch(`${baseUrl}/api/companion/state`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          return {
            ok: true,
            config: { ...currentConfig, ...data.config },
            mood: data.mood,
            memory_count: data.memory_count,
            skill_count: data.skill_count,
            last_event_id: data.last_event_id,
            last_event_type: data.last_event_type,
            operational_scene: data.operational_scene
          };
        }
      }
    } catch (err) {
      return {
        ok: false,
        error: "Hermes is offline",
        config: currentConfig,
        mood: "activo",
        memory_count: currentConfig.memory_count || 0,
        skill_count: currentConfig.skill_count || 0,
        operational_scene: {
          state: "error",
          summary: "Conexión perdida con Hermes...",
          event_id: "offline"
        }
      };
    }
  }

  return {
    ok: true,
    config: currentConfig,
    mood: currentConfig.quiet_mode ? "tranquilo" : "activo",
    memory_count: currentConfig.memory_count || 0,
    skill_count: currentConfig.skill_count || 0,
    last_event_id: lastEventId,
    last_event_type: lastEventType,
    operational_scene: currentOperationalScene
  };
}

async function callLLM(userMessage) {
  const provider = (currentConfig.provider || "ollama").toLowerCase();
  const apiKey = currentConfig.apiKey;
  const apiUrl = currentConfig.apiUrl;
  const model = currentConfig.model;

  chatHistory.push({ role: "user", content: userMessage });
  if (chatHistory.length > 20) {
    chatHistory.shift();
  }

  setOperationalScene("thinking", "Pensando respuesta... 👾");

  try {
    let reply = "";

    if (provider === "hermes") {
      const baseUrl = apiUrl || "http://127.0.0.1:9119";
      const res = await fetch(`${baseUrl}/api/companion/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, source: "desktop-pet" })
      });
      if (!res.ok) throw new Error(`Hermes API error: ${res.status}`);
      const data = await res.json();
      reply = data.response || data.reply || data.message || data.text || "No response";

    } else if (provider === "openai" || provider === "openclaw" || provider === "codex" || provider === "custom" || provider === "ollama") {
      let url = "https://api.openai.com/v1/chat/completions";
      if (provider === "ollama") {
        url = apiUrl ? `${apiUrl}/v1/chat/completions` : "http://127.0.0.1:11434/v1/chat/completions";
      } else if (apiUrl) {
        url = apiUrl;
      }

      const headers = {
        "Content-Type": "application/json"
      };
      if (apiKey && provider !== "ollama") {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const messagesPayload = [
        { role: "system", content: SYSTEM_PROMPT },
        ...chatHistory
      ];

      const body = {
        model: model || (provider === "openai" ? "gpt-4o-mini" : "llama3"),
        messages: messagesPayload
      };

      const res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API Error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        reply = data.choices[0].message.content;
      } else {
        throw new Error("Invalid response format from API");
      }

    } else if (provider === "claude") {
      const url = apiUrl || "https://api.anthropic.com/v1/messages";
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      };

      const body = {
        model: model || "claude-3-5-sonnet-latest",
        system: SYSTEM_PROMPT,
        messages: chatHistory,
        max_tokens: 1024
      };

      const res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Claude API Error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      if (data.content && data.content[0] && data.content[0].text) {
        reply = data.content[0].text;
      } else {
        throw new Error("Invalid response format from Claude");
      }

    } else {
      throw new Error(`Proveedor no soportado: ${provider}`);
    }

    chatHistory.push({ role: "assistant", content: reply });
    if (chatHistory.length > 20) {
      chatHistory.shift();
    }

    setOperationalScene("success", "¡Tengo una respuesta! ✉️");
    triggerRandomPetEvent();

    // Revert to idle after success announcement
    setTimeout(() => {
      if (currentOperationalScene.state === "success") {
        setOperationalScene("idle", "Esperando orden.");
      }
    }, 4000);

    return reply;

  } catch (err) {
    log(`LLM call failed: ${err.message}`);
    setOperationalScene("error", `Error: ${err.message}`);
    
    // Revert to idle after error announcement
    setTimeout(() => {
      if (currentOperationalScene.state === "error") {
        setOperationalScene("idle", "Esperando orden.");
      }
    }, 4000);
    
    throw err;
  }
}

// IPC Handlers
ipcMain.handle("pet:user-activity", () => {
  lastActivity = Date.now();
  return true;
});

ipcMain.handle("pet:open-chat", () => {
  lastActivity = Date.now();
  createChatWindow();
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.webContents.send("pet:set-state", { state: "idle" });
  }
  return true;
});

ipcMain.handle("pet:open-settings", () => {
  lastActivity = Date.now();
  createSettingsWindow();
  return true;
});

ipcMain.handle("app:get-base-url", () => {
  return currentConfig.apiUrl || "http://127.0.0.1:9119";
});

ipcMain.handle("chat:close", () => {
  if (chatWindow && !chatWindow.isDestroyed()) {
    chatWindow.close();
  }
  return true;
});

ipcMain.handle("chat:hide", () => {
  if (chatWindow && !chatWindow.isDestroyed()) {
    chatWindow.hide();
  }
  return true;
});

ipcMain.handle("chat:sent-message", () => {
  if (chatWindow && !chatWindow.isDestroyed()) {
    chatWindow.hide();
  }
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.webContents.send("pet:set-state", { state: "thinking" });
  }
  movementMode = "vivo";
  lastActivity = Date.now();
  return true;
});

ipcMain.handle("chat:response-ready", () => {
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.webContents.send("pet:set-state", { state: "response-ready" });
  }
  lastActivity = Date.now();
  return true;
});

ipcMain.handle("pet:update-learning-stats", (event, stats) => {
  if (stats) {
    currentConfig.memory_count = typeof stats.memoryCount === "number" ? stats.memoryCount : currentConfig.memory_count;
    currentConfig.skill_count = typeof stats.skillCount === "number" ? stats.skillCount : currentConfig.skill_count;
    saveConfig(currentConfig);
  }
  return true;
});

ipcMain.handle("settings:close", () => {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.close();
  }
  return true;
});

ipcMain.handle("app:close", () => {
  app.quit();
  return true;
});

ipcMain.handle("pet:update-movement-mode", (event, mode) => {
  movementMode = mode;
  return true;
});

// Decoupled API bridges
ipcMain.handle("app:get-companion-state", async () => {
  return await getConsolidatedState();
});

ipcMain.handle("app:save-companion-config", async (event, config) => {
  currentConfig = { ...currentConfig, ...config };
  saveConfig(currentConfig);
  
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.webContents.send("pet:config-changed", currentConfig);
  }
  return true;
});

ipcMain.handle("app:send-chat-message", async (event, message) => {
  try {
    const reply = await callLLM(message);
    return reply;
  } catch (err) {
    return `Error: ${err.message}`;
  }
});

// App Lifecycle
app.whenReady().then(() => {
  log("app ready companion pet + chat (lokkygoat decoupled mode)");
  createPetWindow();
}).catch(err => {
  log(`app ready error: ${err.message}`);
});

process.on("uncaughtException", (err) => {
  log(`Uncaught Exception: ${err.message}`);
});

process.on("unhandledRejection", (reason) => {
  log(`Unhandled Rejection: ${reason}`);
});

app.on("window-all-closed", () => {
  if (moveTimer) clearInterval(moveTimer);
  app.quit();
});
