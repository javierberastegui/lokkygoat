const { BrowserWindow, screen } = require("electron");
const path = require("path");
const { log } = require("../config/configService");

const safeMode = process.env.COMPANION_SAFE_WINDOW === "1";

let petWindow = null;
let chatWindow = null;
let settingsWindow = null;

function getArea() {
  return screen.getPrimaryDisplay().workArea;
}

function clamp(x, y, w, h) {
  const a = getArea();
  return {
    x: Math.max(a.x, Math.min(x, a.x + a.width - w)),
    y: Math.max(a.y, Math.min(y, a.y + a.height - h)),
  };
}

function getPetWindow() {
  return petWindow && !petWindow.isDestroyed() ? petWindow : null;
}

function getChatWindow() {
  return chatWindow && !chatWindow.isDestroyed() ? chatWindow : null;
}

function getSettingsWindow() {
  return settingsWindow && !settingsWindow.isDestroyed() ? settingsWindow : null;
}

function createPetWindow(onFinishedLoad) {
  if (getPetWindow()) {
    petWindow.show();
    return petWindow;
  }

  try {
    const a = getArea();
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
        preload: path.join(__dirname, "..", "..", "preload.js"),
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
      if (onFinishedLoad) onFinishedLoad();
    });

    petWindow.on("closed", () => {
      petWindow = null;
    });

    petWindow.loadFile(path.join(__dirname, "..", "..", "pet.html")).catch(err => {
      log(`Failed to load pet.html: ${err.message}`);
    });
  
  } catch (err) {
    log(`createPetWindow failed: ${err.message}\n${err.stack}`);
  }

  return petWindow;
}

function createChatWindow() {
  if (getChatWindow()) {
    chatWindow.show();
    chatWindow.focus();
    chatWindow.moveTop();
    const petWin = getPetWindow();
    if (petWin) {
      petWin.webContents.send("pet:set-state", { state: "idle" });
    }
    return chatWindow;
  }

  const a = getArea();
  chatWindow = new BrowserWindow({
    width: a.width,
    height: a.height,
    x: a.x,
    y: a.y,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    skipTaskbar: false,
    resizable: false,
    hasShadow: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "..", "..", "preload.js"),
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
    log(`chat ready bounds=${JSON.stringify(chatWindow.getBounds())}`);
  });

  chatWindow.on("closed", () => {
    chatWindow = null;
  });

  chatWindow.loadFile(path.join(__dirname, "..", "..", "chat.html"));
  return chatWindow;
}

function createSettingsWindow() {
  if (getSettingsWindow()) {
    settingsWindow.focus();
    return settingsWindow;
  }

  const a = getArea();
  const width = 340;
  const height = 570;

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
      preload: path.join(__dirname, "..", "..", "preload.js"),
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
  });

  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });

  settingsWindow.loadFile(path.join(__dirname, "..", "..", "settings.html"));
  return settingsWindow;
}

module.exports = {
  createPetWindow,
  createChatWindow,
  createSettingsWindow,
  getPetWindow,
  getChatWindow,
  getSettingsWindow,
  getArea,
  safeMode
};
