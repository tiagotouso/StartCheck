const fs = require('fs');
const path = require('path');
const { configureHarnesses } = require('./harness-adapter');

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function installStartCheck(targetDir = process.cwd()) {
  console.log(`
  ==============================================================
     🚀 STARTCHECK: INSTALAÇÃO DO ECOSSISTEMA DE AGENTES
  ==============================================================
  `);

  console.log(`📍 Diretório alvo: ${targetDir}`);

  // 1. Validação de Node.js
  const nodeVersionMajor = parseInt(process.versions.node.split('.')[0], 10);
  if (nodeVersionMajor < 18) {
    throw new Error(`O StartCheck requer Node.js >= 18.0.0. Versão atual: ${process.version}`);
  }

  const assetsDir = path.resolve(__dirname, '..', 'assets');
  const agentsSrc = path.join(assetsDir, 'agents');
  const rulesSrc = path.join(assetsDir, 'rules');

  if (!fs.existsSync(agentsSrc)) {
    throw new Error(`Pasta de assets de agentes não encontrada em: ${agentsSrc}`);
  }

  // 2. Destinos
  const agentsDest = path.join(targetDir, '.agents', 'agents');
  const rulesDest = path.join(targetDir, '.agents', 'rules');
  const startCheckConfigDir = path.join(targetDir, '.startcheck');

  console.log('📦 [1/4] Instalando 25 agentes especialistas em .agents/agents/...');
  copyDirRecursive(agentsSrc, agentsDest);

  console.log('📋 [2/4] Instalando regras de criação e templates em .agents/rules/...');
  if (fs.existsSync(rulesSrc)) {
    copyDirRecursive(rulesSrc, rulesDest);
  }

  console.log('⚙️  [3/4] Configurando integrações multi-harness (Antigravity, Claude, Gemini)...');
  configureHarnesses(targetDir, assetsDir);

  console.log('📝 [4/4] Gravando manifesto de instalação...');
  fs.mkdirSync(startCheckConfigDir, { recursive: true });
  const manifest = {
    name: 'startcheck',
    version: require('../package.json').version,
    installed_at: new Date().toISOString(),
    target_dir: targetDir,
    agents_count: 25,
    supported_harnesses: ['antigravity', 'claude-code', 'gemini-cli']
  };
  fs.writeFileSync(
    path.join(startCheckConfigDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  console.log(`
  ==============================================================
     ✅ SUCESSO: StartCheck instalado com êxito!
  ==============================================================
  
  O que foi instalado:
    ✔ 25 agentes especialistas e templates em: .agents/agents/
    ✔ Regras de governança em: .agents/rules/
    ✔ Skill e slash command configurados para o seu harness
    ✔ Documentos de integração em AGENTS.md, CLAUDE.md e GEMINI.md

  🚀 Próximo Passo:
    Abra seu harness de IA (Antigravity, Claude Code, Gemini CLI) e digite:
    
    /startcheck
    
    O agente de acolhimento conduzirá o briefing da sua startup!
  ==============================================================
  `);

  return manifest;
}

module.exports = {
  installStartCheck,
  copyDirRecursive
};
