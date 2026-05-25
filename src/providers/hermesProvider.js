async function sendMessage(message, history, config) {
  const baseUrl = config.apiUrl || "http://127.0.0.1:9119";
  const res = await fetch(`${baseUrl}/api/companion/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message, source: "desktop-pet" })
  });
  
  if (!res.ok) {
    throw new Error(`Hermes API error: ${res.status}`);
  }
  
  const data = await res.json();
  const reply = data.response || data.reply || data.message || data.text || "No response";
  return reply;
}

async function getCompanionState(config) {
  const baseUrl = config.apiUrl || "http://127.0.0.1:9119";
  const res = await fetch(`${baseUrl}/api/companion/state`);
  if (!res.ok) {
    throw new Error(`Hermes state API error: ${res.status}`);
  }
  const data = await res.json();
  if (data.ok) {
    return {
      ok: true,
      config: { ...config, ...data.config },
      mood: data.mood,
      memory_count: data.memory_count,
      skill_count: data.skill_count,
      last_event_id: data.last_event_id,
      last_event_type: data.last_event_type,
      operational_scene: data.operational_scene
    };
  }
  throw new Error("Invalid response status from Hermes state API");
}

module.exports = {
  sendMessage,
  getCompanionState
};
