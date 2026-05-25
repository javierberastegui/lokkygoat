const { SYSTEM_PROMPT } = require("../constants");

async function sendMessage(message, history, config) {
  const apiKey = config.apiKey;
  const apiUrl = config.apiUrl || "https://api.anthropic.com/v1/messages";
  const model = config.model || "claude-3-5-sonnet-latest";

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01"
  };

  const body = {
    model,
    system: SYSTEM_PROMPT,
    messages: history,
    max_tokens: 1024
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (data.content && data.content[0] && data.content[0].text) {
    return data.content[0].text;
  }
  throw new Error("Invalid response format from Claude API");
}

module.exports = { sendMessage };
