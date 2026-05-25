const { SYSTEM_PROMPT } = require("../constants");

async function sendMessage(message, history, config) {
  const apiUrl = config.apiUrl ? `${config.apiUrl}/v1/chat/completions` : "http://127.0.0.1:11434/v1/chat/completions";
  const model = config.model || "llama3";

  const messagesPayload = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history
  ];

  const body = {
    model,
    messages: messagesPayload
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Ollama API Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  throw new Error("Invalid response format from Ollama API");
}

module.exports = { sendMessage };
