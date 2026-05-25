const ollamaProvider = require("./ollamaProvider");
const openaiProvider = require("./openaiProvider");
const claudeProvider = require("./claudeProvider");
const hermesProvider = require("./hermesProvider");

async function callProvider(message, history, config) {
  const provider = (config.provider || "ollama").toLowerCase();
  
  // Overlay provider specific config on top of root config
  const providerConfig = config.providers?.[provider] || {};
  const activeConfig = {
    ...config,
    ...providerConfig
  };

  switch (provider) {
    case "ollama":
      return await ollamaProvider.sendMessage(message, history, activeConfig);
    case "openai":
    case "openclaw":
    case "codex":
    case "custom":
      return await openaiProvider.sendMessage(message, history, activeConfig);
    case "claude":
      return await claudeProvider.sendMessage(message, history, activeConfig);
    case "hermes":
      return await hermesProvider.sendMessage(message, history, activeConfig);
    default:
      throw new Error(`Proveedor no soportado: ${provider}`);
  }
}

module.exports = {
  callProvider,
  hermesProvider
};
