const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { installStartCheck } = require('../lib/installer');

async function runTest() {
  console.log('🧪 Iniciando teste do instalador StartCheck...');

  const sandboxDir = path.resolve(__dirname, 'sandbox');
  if (fs.existsSync(sandboxDir)) {
    fs.rmSync(sandboxDir, { recursive: true, force: true });
  }
  fs.mkdirSync(sandboxDir, { recursive: true });

  console.log(`📁 Diretório de teste: ${sandboxDir}`);

  // Executa a instalação no diretório de teste
  const manifest = await installStartCheck(sandboxDir);

  // 1. Validar contagem e presença de agentes
  const agentsDir = path.join(sandboxDir, '.agents', 'agents');
  assert.ok(fs.existsSync(agentsDir), 'Diretório .agents/agents deve existir');
  const agentFolders = fs.readdirSync(agentsDir).filter(name => {
    return fs.statSync(path.join(agentsDir, name)).isDirectory();
  });
  console.log(`✔ Agentes instalados: ${agentFolders.length}`);
  assert.strictEqual(agentFolders.length, 25, 'Devem existir exatamente 25 agentes instalados');

  // 2. Validar presença dos principais agentes
  assert.ok(agentFolders.includes('startcheck-startup-new'), 'startcheck-startup-new deve estar presente');
  assert.ok(agentFolders.includes('startcheck-startup-ceo'), 'startcheck-startup-ceo deve estar presente');
  assert.ok(agentFolders.includes('startcheck-executive-publisher'), 'startcheck-executive-publisher deve estar presente');

  // 3. Validar arquivos de harness
  const agentsMd = path.join(sandboxDir, 'AGENTS.md');
  const claudeMd = path.join(sandboxDir, 'CLAUDE.md');
  const geminiMd = path.join(sandboxDir, 'GEMINI.md');
  assert.ok(fs.existsSync(agentsMd), 'AGENTS.md deve existir');
  assert.ok(fs.existsSync(claudeMd), 'CLAUDE.md deve existir');
  assert.ok(fs.existsSync(geminiMd), 'GEMINI.md deve existir');

  const content = fs.readFileSync(agentsMd, 'utf8');
  assert.ok(content.includes('/startcheck'), 'AGENTS.md deve conter o comando /startcheck');

  // 4. Validar skill
  const skillFile = path.join(sandboxDir, '.agents', 'skills', 'startcheck', 'SKILL.md');
  assert.ok(fs.existsSync(skillFile), 'SKILL.md deve estar presente em .agents/skills/startcheck/');

  // 5. Validar manifesto
  assert.strictEqual(manifest.agents_count, 25, 'Manifesto deve registrar 25 agentes');

  console.log('\n🎉 TODOS OS TESTES PASSARAM COM SUCESSO!\n');

  // Limpeza
  fs.rmSync(sandboxDir, { recursive: true, force: true });
}

runTest().catch((err) => {
  console.error('\n❌ Falha no teste:', err);
  process.exit(1);
});
