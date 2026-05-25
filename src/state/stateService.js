let lastActivity = Date.now();
let movementMode = "normal";
let lastEventId = null;
let lastEventType = null;

let currentOperationalScene = {
  state: "idle",
  summary: "Esperando orden.",
  event_id: null
};

let chatHistory = [];

function getLastActivity() {
  return lastActivity;
}

function updateLastActivity() {
  lastActivity = Date.now();
}

function getMovementMode() {
  return movementMode;
}

function setMovementMode(mode) {
  movementMode = mode;
}

function getLastEvent() {
  return { lastEventId, lastEventType };
}

function setLastEvent(id, type) {
  lastEventId = id;
  lastEventType = type;
}

function getCurrentOperationalScene() {
  return currentOperationalScene;
}

function setCurrentOperationalScene(state, summary, eventId) {
  currentOperationalScene = {
    state,
    summary,
    event_id: eventId || Math.random().toString(36).substring(2, 9)
  };
}

function getChatHistory() {
  return chatHistory;
}

function pushChatMessage(role, content) {
  chatHistory.push({ role, content });
  if (chatHistory.length > 20) {
    chatHistory.shift();
  }
}

module.exports = {
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
};
