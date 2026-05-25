const { ipcMain, app } = require("electron");
const { getConfig, saveConfig, log } = require("../config/configService");
const {
  getLastActivity,
  updateLastActivity,
  getMovementMode,
  setMovementMode,
  getLastEvent,
  setLastEvent,
  getCurrentOperationalScene,
  setCurrentOperationalScene,
  getChatHistory,
  pushChatMessage
} = require("../state/stateService");
const {
  createChatWindow,
  createSettingsWindow,
  getPetWindow,
  getChatWindow,
  getSettingsWindow
} = require("../windows/windowManager");
const eventBus = require("../events/eventBus");
const { callProvider, hermesProvider } = require("../providers/providerManager");

function setupIpcHandlers() {
  ipcMain.handle("pet:user-activity", () => {
    updateLastActivity();
    return true;
  });

  ipcMain.handle("pet:open-chat", () => {
    updateLastActivity();
    createChatWindow();
    const petWin = getPetWindow();
    if (petWin) {
      petWin.webContents.send("pet:set-state", { state: "idle" });
    }
    return true;
  });

  ipcMain.handle("pet:open-settings", () => {
    updateLastActivity();
    createSettingsWindow();
    return true;
  });

  ipcMain.handle("app:get-base-url", () => {
    const config = getConfig();
    return config.apiUrl || "http://127.0.0.1:9119";
  });

  ipcMain.handle("chat:close", () => {
    const chatWin = getChatWindow();
    if (chatWin) {
      chatWin.close();
    }
    return true;
  });

  ipcMain.handle("chat:hide", () => {
    const chatWin = getChatWindow();
    if (chatWin) {
      chatWin.hide();
    }
    return true;
  });

  ipcMain.handle("chat:sent-message", () => {
    const chatWin = getChatWindow();
    if (chatWin) {
      chatWin.hide();
    }
    const petWin = getPetWindow();
    if (petWin) {
      petWin.webContents.send("pet:set-state", { state: "thinking" });
    }
    setMovementMode("vivo");
    updateLastActivity();
    
    eventBus.emitEvent("chat.message_sent");
    return true;
  });

  ipcMain.handle("chat:response-ready", () => {
    const petWin = getPetWindow();
    if (petWin) {
      petWin.webContents.send("pet:set-state", { state: "response-ready" });
    }
    updateLastActivity();
    return true;
  });

  ipcMain.handle("pet:update-learning-stats", (event, stats) => {
    if (stats) {
      const config = getConfig();
      const updatedStats = {};
      updatedStats.memory_count = typeof stats.memoryCount === "number" ? stats.memoryCount : config.memory_count;
      updatedStats.skill_count = typeof stats.skillCount === "number" ? stats.skillCount : config.skill_count;
      saveConfig(updatedStats);
      eventBus.emitEvent("memory.updated", { stats: updatedStats });
    }
    return true;
  });

  ipcMain.handle("settings:close", () => {
    const settingsWin = getSettingsWindow();
    if (settingsWin) {
      settingsWin.close();
    }
    return true;
  });

  ipcMain.handle("app:close", () => {
    app.quit();
    return true;
  });

  ipcMain.handle("pet:update-movement-mode", (event, mode) => {
    setMovementMode(mode);
    return true;
  });

  ipcMain.handle("app:get-companion-state", async () => {
    const config = getConfig();
    if (config.provider === "hermes") {
      try {
        const providerConfig = config.providers?.hermes || {};
        const activeConfig = { ...config, ...providerConfig };
        const state = await hermesProvider.getCompanionState(activeConfig);
        return state;
      } catch (err) {
        return {
          ok: false,
          error: "Hermes is offline",
          config: config,
          mood: "activo",
          memory_count: config.memory_count || 0,
          skill_count: config.skill_count || 0,
          operational_scene: {
            state: "error",
            summary: "Conexión perdida con Hermes...",
            event_id: "offline"
          }
        };
      }
    }

    const lastEventObj = getLastEvent();
    return {
      ok: true,
      config: config,
      mood: config.quiet_mode ? "tranquilo" : "activo",
      memory_count: config.memory_count || 0,
      skill_count: config.skill_count || 0,
      last_event_id: lastEventObj.lastEventId,
      last_event_type: lastEventObj.lastEventType,
      operational_scene: getCurrentOperationalScene()
    };
  });

  ipcMain.handle("app:save-companion-config", async (event, configPayload) => {
    const updatedConfig = saveConfig(configPayload);
    
    const petWin = getPetWindow();
    if (petWin) {
      petWin.webContents.send("pet:config-changed", updatedConfig);
    }
    eventBus.emitEvent("config.updated", { config: updatedConfig });
    return true;
  });

  ipcMain.handle("app:send-chat-message", async (event, message) => {
    try {
      const config = getConfig();
      pushChatMessage("user", message);
      
      setCurrentOperationalScene("thinking", "Pensando respuesta... 👾");
      const petWin = getPetWindow();
      if (petWin) {
        petWin.webContents.send("pet:set-state", { state: "thinking" });
      }

      eventBus.emitEvent("provider.request_started", { provider: config.provider });

      const reply = await callProvider(message, getChatHistory(), config);

      pushChatMessage("assistant", reply);
      setCurrentOperationalScene("success", "¡Tengo una respuesta! ✉️");
      
      eventBus.emitEvent("provider.request_succeeded", { provider: config.provider });

      // Trigger random pet events (memory or skill increments)
      const rand = Math.random();
      const updatedConfig = {};
      if (rand < 0.10) {
        updatedConfig.skill_count = (config.skill_count || 0) + 1;
        saveConfig(updatedConfig);
        setLastEvent(Math.random().toString(36).substring(2, 9), "skill_learned");
        
        if (petWin) {
          petWin.webContents.send("pet:celebrate");
        }
        eventBus.emitEvent("pet.animation_requested", { animation: "celebrate" });
      } else if (rand < 0.25) {
        updatedConfig.memory_count = (config.memory_count || 0) + 1;
        saveConfig(updatedConfig);
        setLastEvent(Math.random().toString(36).substring(2, 9), "memory_learned");
        
        if (petWin) {
          petWin.webContents.send("pet:glow");
        }
        eventBus.emitEvent("pet.animation_requested", { animation: "glow" });
      } else if (rand < 0.30) {
        setLastEvent(Math.random().toString(36).substring(2, 9), "dream_cycle");
        
        if (petWin) {
          petWin.webContents.send("pet:sleep");
        }
        eventBus.emitEvent("pet.animation_requested", { animation: "sleep" });
      }

      setTimeout(() => {
        const scene = getCurrentOperationalScene();
        if (scene.state === "success") {
          setCurrentOperationalScene("idle", "Esperando orden.");
        }
      }, 4000);

      eventBus.emitEvent("chat.response_received");
      return reply;

    } catch (err) {
      log(`LLM call failed: ${err.message}`);
      setCurrentOperationalScene("error", `Error: ${err.message}`);
      
      eventBus.emitEvent("provider.request_failed", { error: err.message });

      setTimeout(() => {
        const scene = getCurrentOperationalScene();
        if (scene.state === "error") {
          setCurrentOperationalScene("idle", "Esperando orden.");
        }
      }, 4000);

      return `Error: ${err.message}`;
    }
  });

  ipcMain.handle("app:test-provider-connection", async (event, testPayload) => {
    const { provider, apiKey, apiUrl, model } = testPayload;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      let res;
      if (provider === "ollama") {
        const checkUrl = apiUrl || "http://127.0.0.1:11434";
        res = await fetch(`${checkUrl}/`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok || res.status === 200 || res.status === 404) {
          return { ok: true };
        }
        throw new Error(`Servidor Ollama respondió con código ${res.status}`);
      } else if (provider === "hermes") {
        const checkUrl = apiUrl || "http://127.0.0.1:9119";
        res = await fetch(`${checkUrl}/api/companion/state`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data.ok) return { ok: true };
        }
        throw new Error(`Servidor Hermes respondió con error`);
      } else if (provider === "openai" || provider === "openclaw" || provider === "codex" || provider === "custom") {
        let checkUrl = "https://api.openai.com/v1/models";
        if (apiUrl) {
          checkUrl = apiUrl.endsWith("/chat/completions") 
            ? apiUrl.replace("/chat/completions", "/models") 
            : apiUrl;
          if (!checkUrl.includes("/models")) {
            checkUrl = checkUrl.endsWith("/") ? `${checkUrl}models` : `${checkUrl}/models`;
          }
        }
        const headers = {};
        if (apiKey) {
          headers["Authorization"] = `Bearer ${apiKey}`;
        }
        res = await fetch(checkUrl, { headers, signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          return { ok: true };
        }
        const text = await res.text();
        let errMsg = `Error ${res.status}`;
        try {
          const parsedErr = JSON.parse(text);
          if (parsedErr.error && parsedErr.error.message) {
            errMsg = parsedErr.error.message;
          }
        } catch (_) {}
        throw new Error(errMsg);
      } else if (provider === "claude") {
        const checkUrl = apiUrl || "https://api.anthropic.com/v1/messages";
        const headers = {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        };
        const body = {
          model: model || "claude-3-5-sonnet-latest",
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 1
        };
        res = await fetch(checkUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          return { ok: true };
        }
        const text = await res.text();
        let errMsg = `Error ${res.status}`;
        try {
          const parsedErr = JSON.parse(text);
          if (parsedErr.error && parsedErr.error.message) {
            errMsg = parsedErr.error.message;
          }
        } catch (_) {}
        throw new Error(errMsg);
      } else {
        clearTimeout(timeoutId);
        throw new Error(`Proveedor ${provider} no soportado para test`);
      }
    } catch (err) {
      return { ok: false, error: err.message || String(err) };
    }
  });
}

module.exports = {
  setupIpcHandlers
};
