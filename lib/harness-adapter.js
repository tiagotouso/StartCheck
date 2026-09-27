const fs = require('fs');
const path = require('path');

const STARTCHECK_SECTION_MARKER = '<!-- STARTCHECK_FRAMEWORK_SECTION -->';

const STARTCHECK_HARNESS_DOC = `
${STARTCHECK_SECTION_MARKER}
# StartCheck

> Framework de IA para documentação, validação e aceleração de startups instalado neste workspace.

## Como usar

No chat com a IA, utilize:
- \`/startcheck\` — iniciar a documentação e esteira de aceleração de uma nova startup
- \`startcheck\` — mesmo efeito do slash command

## Comportamento ao ativar

Quando o usuário digitar \`/startcheck\` ou a palavra \`startcheck\` no chat:
1. Ative a skill \`startcheck\` disponível em \`.agents/skills/startcheck/SKILL.md\`.
2. O agente de acolhimento \`startcheck-startup-new\` conduzirá o intake das 6 informações base e despachará o briefing ao CEO (\`startcheck-startup-ceo\`).
3. O CEO assumirá a orquestração dos 25 agentes especialistas nas 4 fases da esteira até o Dossiê Executivo final.

## Regras Críticas de Qualidade
- **Preservação Rigorosa de Templates**: Proibido alterar colunas, tabelas ou placeholders originais.
- **Proibição de Tags HTML**: Zero tags cruas (<br>, <br/>, etc.).
- **Padrão Sem Dois Pontos**: Títulos de campos não terminam com dois pontos; resposta na linha seguinte.
- **Marcadores de Status no Início**: 🟢 OK, 🟡 Atenção e 🔴 Revisão sempre no início absoluto da linha/célula.
`;

function injectHarnessDoc(filePath) {
  let content = '';
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(STARTCHECK_SECTION_MARKER)) {
      // Já contém a seção, substitui para manter atualizado
      const parts = content.split(STARTCHECK_SECTION_MARKER);
      content = parts[0].trim() + '\n\n' + STARTCHECK_HARNESS_DOC.trim() + '\n';
      fs.writeFileSync(filePath, content, 'utf8');
      return;
    }
    // Anexa de forma não destrutiva
    content = content.trim() + '\n\n' + STARTCHECK_HARNESS_DOC.trim() + '\n';
  } else {
    content = STARTCHECK_HARNESS_DOC.trim() + '\n';
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

function configureHarnesses(targetDir, packageAssetsDir) {
  // 1. Injeta em AGENTS.md, CLAUDE.md e GEMINI.md na raiz do targetDir
  const harnessFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'];
  for (const fileName of harnessFiles) {
    const fullPath = path.join(targetDir, fileName);
    injectHarnessDoc(fullPath);
  }

  // 2. Registra skill em .agents/skills/startcheck/ e .claude/skills/startcheck/
  const skillSource = path.join(packageAssetsDir, 'skills', 'startcheck', 'SKILL.md');
  const destinations = [
    path.join(targetDir, '.agents', 'skills', 'startcheck'),
    path.join(targetDir, '.claude', 'skills', 'startcheck')
  ];

  for (const destDir of destinations) {
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(skillSource, path.join(destDir, 'SKILL.md'));
  }
}

module.exports = {
  configureHarnesses,
  STARTCHECK_SECTION_MARKER,
  STARTCHECK_HARNESS_DOC
};
