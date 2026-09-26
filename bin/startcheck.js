#!/usr/bin/env node

const fs = require("fs");

const distCliPath = path.join(__dirname, "../dist/cli/index.js");

if (fs.existsSync(distCliPath)) {
  const { runCli } = require(distCliPath);
  runCli().catch((err) => {
    console.error("Erro fatal na execução do StartCheck:", err);
    process.exit(1);
  });
} else {
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
