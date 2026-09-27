#!/usr/bin/env node

/**
 * StartCheck CLI - Entrypoint
 * Executável via `npx startcheck install` ou `startcheck install`
 */

const { installStartCheck } = require('../lib/installer');

const args = process.argv.slice(2);
const command = args[0] || 'help';

async function main() {
  const targetDir = process.cwd();

  switch (command.toLowerCase()) {
    case 'install':
    case 'init':
    case 'setup':
      await installStartCheck(targetDir);
      break;

    case 'version':
    case '-v':
    case '--version':
      const pkg = require('../package.json');
      console.log(`StartCheck v${pkg.version}`);
      break;

    case 'help':
    case '-h':
    case '--help':
    default:
      console.log(`
============================================================
                    🚀 StartCheck CLI
============================================================

Uso:
  npx startcheck install                                    Instala os agentes e regras no projeto atual
  npx github https://github.com/tiagotouso/StartCheck       Instala direto via repositório GitHub
  npx startcheck version                                    Exibe a versão instalada
  npx startcheck help                                       Exibe esta ajuda

Após a instalação, abra o seu harness de IA favorito:
  - Antigravity: digite /startcheck
  - Claude Code: digite /startcheck
  - Gemini CLI:  digite /startcheck
============================================================
      `);
      break;
  }
}

main().catch((err) => {
  console.error('\n❌ Erro durante a execução do StartCheck:', err.message);
  process.exit(1);
});
