window.RV_DATA = {
  projectName: "StartCheck",
  version: "1.0.0",
  generatedAt: "2026-09-26T17:52:00-03:00",
  modules: [
    { "id": "cli-installer", "name": "CLI Installer & UI", "path": "src/cli/index.ts", "loc": 280, "complexity": 8, "group": "presentation", "description": "Interface interativa de terminal via @clack/prompts e despacho de comandos npx" },
    { "id": "template-engine", "name": "Template Engine", "path": "src/modules/template-engine.ts", "loc": 160, "complexity": 6, "group": "core", "description": "Carga dos 15 templates canônicos, gestão do manifesto startup.config.json e I/O seguro" },
    { "id": "harness-orchestrator", "name": "Harness Orchestrator", "path": "src/modules/harness-orchestrator.ts", "loc": 240, "complexity": 10, "group": "core", "description": "Orquestrador de agentes cognitivos com retenção e injeção progressiva de contexto" },
    { "id": "traffic-light-evaluator", "name": "Traffic Light Evaluator", "path": "src/modules/traffic-light-evaluator.ts", "loc": 140, "complexity": 7, "group": "analysis", "description": "Avaliador de semáforo (🟢/🟡/🔴) e recálculo dinâmico sob justificativas do usuário" },
    { "id": "extension-factory", "name": "Extension Factory", "path": "src/modules/extension-factory.ts", "loc": 95, "complexity": 5, "group": "extension", "description": "Meta-fábrica para parsing de novos modelos e autogeração de agentes especialistas" },
    { "id": "export-service", "name": "Export Service", "path": "src/modules/export-service.ts", "loc": 260, "complexity": 9, "group": "export", "description": "Exportador multiformato DOCX individual, DOCX consolidado (sem pitches) e XLSX" },
    { "id": "startup-skills", "name": "Startup Skills Catalog", "path": "src/skills/startup-skills.ts", "loc": 125, "complexity": 3, "group": "ai-skills", "description": "Prompts de domínio e diretrizes analíticas para os 15 templates essenciais" }
  ],
  deps: {
    nodes: [
      { id: "cli-installer", label: "CLI & UI" },
      { id: "template-engine", label: "Template Engine" },
      { id: "harness-orchestrator", label: "Harness Orchestrator" },
      { id: "traffic-light-evaluator", label: "Traffic Light Evaluator" },
      { id: "extension-factory", label: "Extension Factory" },
      { id: "export-service", label: "Export Service" },
      { id: "startup-skills", label: "Startup Skills" }
    ],
    links: [
      { source: "cli-installer", target: "harness-orchestrator" },
      { source: "cli-installer", target: "template-engine" },
      { source: "cli-installer", target: "extension-factory" },
      { source: "cli-installer", target: "export-service" },
      { source: "harness-orchestrator", target: "template-engine" },
      { source: "harness-orchestrator", target: "traffic-light-evaluator" },
      { source: "harness-orchestrator", target: "startup-skills" },
      { source: "extension-factory", target: "template-engine" },
      { source: "export-service", target: "template-engine" }
    ],
    cycles: []
  },
  metrics: {
    totalLoc: 1300,
    totalModules: 7,
    totalTemplates: 15,
    avgComplexity: 6.8,
    sddCoverage: 100,
    testCoverage: 92
  },
  glossary: [
    { "term": "Harness", "slug": "harness", "definition": "Orquestrador central de agentes cognitivos que preserva o contexto cumulativo e a consistência cruzada entre múltiplos documentos." },
    { "term": "Semáforo de Validação", "slug": "semaforo", "definition": "Mecanismo visual de confiabilidade que classifica seções em Verde (validado), Amarela (atenção) e Vermelha (crítico)." },
    { "term": "Auto-Correção por Justificativa", "slug": "justificativa", "definition": "Ciclo colaborativo onde o usuário insere dados ou evidências reais de mercado para pontos 🟡/🔴 e a IA refina e atualiza a nota." },
    { "term": "Extension Factory", "slug": "extension-factory", "definition": "Meta-fábrica dinâmica que detecta novos templates Markdown e autogera o agente e a skill correspondentes." },
    { "term": "Dossiê Consolidado", "slug": "dossie-consolidado", "definition": "Documento DOCX executivo que reúne os modelos 001 a 012 de modelagem estratégica, excluindo estritamente os pitches." },
    { "term": "15 Templates Canônicos", "slug": "templates-canonicos", "definition": "Coleção essencial de modelos de modelagem cobrindo da fundação ao pitch de investimento (001 a 015)." },
    { "term": "Plano de Ação XLSX", "slug": "plano-acao-xlsx", "definition": "Planilha Excel estruturada gerada a partir do documento 012 com colunas de Ação, Responsável, Prazo, Métrica e Status." }
  ]
};
