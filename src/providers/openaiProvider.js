const { SYSTEM_PROMPT } = require("../constants");

async function sendMessage(message, history, config) {
  const provider = (config.provider || "openai").toLowerCase();
  const apiKey = config.apiKey;
  const model = config.model || "gpt-4o-mini";
  
  let url = "https://api.openai.com/v1/chat/completions";
  if (config.apiUrl) {
    url = config.apiUrl;
  }

  const headers = {
    "Content-Type": "application/json"
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const messagesPayload = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history
  ];

  const body = {
    model,
    messages: messagesPayload
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${provider.toUpperCase()} API Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  throw new Error(`Invalid response format from ${provider} API`);
}

module.exports = { sendMessage };
