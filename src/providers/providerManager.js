const ollamaProvider = require("./ollamaProvider");
const openaiProvider = require("./openaiProvider");
const claudeProvider = require("./claudeProvider");
const hermesProvider = require("./hermesProvider");

async function callProvider(message, history, config) {
  const provider = (config.provider || "ollama").toLowerCase();

  switch (provider) {
    case "ollama":
      return await ollamaProvider.sendMessage(message, history, config);
    case "openai":
    case "openclaw":
    case "codex":
    case "custom":
      return await openaiProvider.sendMessage(message, history, config);
    case "claude":
      return await claudeProvider.sendMessage(message, history, config);
    case "hermes":
      return await hermesProvider.sendMessage(message, history, config);
    default:
      throw new Error(`Proveedor no soportado: ${provider}`);
  }
}

module.exports = {
  callProvider,
  hermesProvider
};
