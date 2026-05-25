const { app } = require("electron");
const { loadConfig, getConfig, log } = require("./src/config/configService");
const { setupIpcHandlers } = require("./src/ipc/ipcHandlers");
const { createPetWindow, getPetWindow, getChatWindow, getArea, safeMode } = require("./src/windows/windowManager");
const PetPhysics = require("./src/pet/petPhysics");
const { getMovementMode, getLastActivity } = require("./src/state/stateService");
const eventBus = require("./src/events/eventBus");

let moveTimer = null;
const physics = new PetPhysics();

function stepPet() {
  const petWindow = getPetWindow();
  if (!petWindow) return;
  if (safeMode) return;

  const chatWindow = getChatWindow();
  if (chatWindow && chatWindow.isVisible()) return;

  const config = getConfig();
  const skillCount = config.skill_count || 0;
  const movementMode = getMovementMode();
  const lastActivity = getLastActivity();

  const area = getArea();
  const bounds = petWindow.getBounds();

  const result = physics.update(bounds, area, skillCount, movementMode, lastActivity);

  if (result.actions.includes("celebrate")) {
    petWindow.webContents.send("pet:celebrate");
  }
  if (result.actions.includes("bounce")) {
    petWindow.webContents.send("pet:bounce");
  }
  
  if (result.actions.includes("warp-start")) {
    petWindow.webContents.send("pet:warp-start");
  }

  if (result.actions.includes("warp-teleport")) {
    setTimeout(() => {
      const petWin = getPetWindow();
      if (!petWin) return;

      const finalBounds = physics.finishWarp(petWin.getBounds(), getArea());
      
      petWin.setBounds(finalBounds, true);
      petWin.webContents.send("pet:warp-end");
    }, 500);
  }

  if (result.stepPayload.behaviorState !== "warp" && result.stepPayload.behaviorState !== "warping-transition") {
    petWindow.webContents.send("pet:step", result.stepPayload);
    petWindow.setBounds(result.newBounds, true);
  }
}

// Load configuration
loadConfig();

// Setup Electron IPC handlers
setupIpcHandlers();

// App Lifecycle
app.whenReady().then(() => {
  log("app ready companion pet + chat (lokkygoat decoupled mode)");
  
  createPetWindow(() => {
    if (!safeMode) {
      if (moveTimer) clearInterval(moveTimer);
      moveTimer = setInterval(stepPet, 25);
    }
  });

  eventBus.emitEvent("app.started");
}).catch(err => {
  log(`app ready error: ${err.message}`);
  eventBus.emitEvent("app.error", { error: err.message });
});

process.on("uncaughtException", (err) => {
  log(`Uncaught Exception: ${err.message}`);
  eventBus.emitEvent("app.error", { error: err.message });
});

process.on("unhandledRejection", (reason) => {
  log(`Unhandled Rejection: ${reason}`);
  eventBus.emitEvent("app.error", { error: String(reason) });
});

app.on("window-all-closed", () => {
  if (moveTimer) clearInterval(moveTimer);
  app.quit();
});
