const { EventEmitter } = require("events");
const { log } = require("../config/configService");

class LokkygoatEventBus extends EventEmitter {
  constructor() {
    super();
    this.on("event", (eventObj) => {
      this.processRules(eventObj);
    });
  }

  emitEvent(type, payload = {}) {
    const eventObj = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      timestamp: new Date().toISOString(),
      payload
    };

    // Safe logging without secrets in payload
    const safePayload = { ...payload };
    if (safePayload.apiKey) safePayload.apiKey = "[REDACTED]";
    if (safePayload.config && safePayload.config.apiKey) {
      safePayload.config = { ...safePayload.config, apiKey: "[REDACTED]" };
    }

    log(`[EVENT] ${type} (${eventObj.id}): ${JSON.stringify(safePayload)}`);
    this.emit("event", eventObj);
    this.emit(type, eventObj);
  }

  processRules(eventObj) {
    const { type, payload } = eventObj;
    
    switch (type) {
      case "app.started":
        log("Lokkygoat event bus rule triggered: app.started");
        break;
      case "app.error":
        log(`Lokkygoat event bus rule triggered: app.error -> ${payload.error}`);
        break;
      case "config.updated":
        log("Lokkygoat event bus rule triggered: config.updated");
        break;
      case "chat.message_sent":
        log("Lokkygoat event bus rule triggered: chat.message_sent");
        break;
      case "chat.response_received":
        log("Lokkygoat event bus rule triggered: chat.response_received");
        break;
      case "provider.request_started":
        log("Lokkygoat event bus rule triggered: provider.request_started");
        break;
      case "provider.request_failed":
        log(`Lokkygoat event bus rule triggered: provider.request_failed -> ${payload.error}`);
        break;
      case "provider.request_succeeded":
        log("Lokkygoat event bus rule triggered: provider.request_succeeded");
        break;
      case "pet.state_changed":
        log(`Lokkygoat event bus rule triggered: pet.state_changed -> ${payload.state}`);
        break;
      default:
        break;
    }
  }
}

const eventBus = new LokkygoatEventBus();

module.exports = eventBus;
