#!/usr/bin/env node

const path = require("path");

// Carregar o CLI compilado ou registrar ts-node se em desenvolvimento
try {
  const { runCli } = require("../dist/cli/index.js");
  runCli().catch((err) => {
    console.error("Erro fatal na execução do StartCheck:", err);
    process.exit(1);
  });
} catch (e) {
  // Fallback para execução direta em TypeScript se ts-node estiver disponível
  try {
    require("ts-node/register");
    const { runCli } = require("../src/cli/index.ts");
    runCli().catch((err) => {
      console.error("Erro fatal na execução do StartCheck:", err);
      process.exit(1);
    });
  } catch (tsErr) {
    console.error("Execute 'npm run build' antes de iniciar o StartCheck.");
    process.exit(1);
  }
}
