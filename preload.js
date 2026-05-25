const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  userActivity: () => ipcRenderer.invoke("pet:user-activity"),
  openChat: () => ipcRenderer.invoke("pet:open-chat"),
  openSettings: () => ipcRenderer.invoke("pet:open-settings"),
  closeChat: () => ipcRenderer.invoke("chat:close"),
  hideChat: () => ipcRenderer.invoke("chat:hide"),
  settingsClose: () => ipcRenderer.invoke("settings:close"),
  closeApp: () => ipcRenderer.invoke("app:close"),
  updateMovementMode: (mode) => ipcRenderer.invoke("pet:update-movement-mode", mode),
  getBaseUrl: () => ipcRenderer.invoke("app:get-base-url"),
  notifySentMessage: () => ipcRenderer.invoke("chat:sent-message"),
  notifyResponseReady: () => ipcRenderer.invoke("chat:response-ready"),
  onSetState: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on("pet:set-state", subscription);
    return () => ipcRenderer.removeListener("pet:set-state", subscription);
  },
  onEvent: (channel, callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on(channel, subscription);
    return () => ipcRenderer.removeListener(channel, subscription);
  },
  updateLearningStats: (stats) => ipcRenderer.invoke("pet:update-learning-stats", stats),
  getCompanionState: () => ipcRenderer.invoke("app:get-companion-state"),
  saveCompanionConfig: (config) => ipcRenderer.invoke("app:save-companion-config", config),
  sendChatMessage: (message) => ipcRenderer.invoke("app:send-chat-message", message)
});

