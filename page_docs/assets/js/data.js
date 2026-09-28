window.RV_DATA = {
  projectName: "StartCheck",
  version: "1.0.0",
  tagline: "Esteira de IA para Validação, Modelagem e Aceleração de Startups em múltiplos harnesses",
  nav: [
    { id: "index", href: "index.html", label: "Visão Geral" },
    { id: "guia", href: "guia-passo-a-passo.html", label: "Passo a Passo" },
    { id: "arquitetura", href: "arquitetura.html", label: "Arquitetura" },
    { id: "modulos", href: "modulos.html", label: "Módulos & Agentes" },
    { id: "metricas", href: "metricas.html", label: "Métricas" },
    { id: "glossario", href: "glossario.html", label: "Glossário" }
  ],
  modules: [
    { name: "startcheck-cli-installer", type: "CLI / Node.js", desc: "Instalador NPX e empacotamento offline de agentes", status: "Implementado", score: 94 },
    { name: "startcheck-harness-adapter", type: "Adaptador", desc: "Integração multi-harness (Antigravity, Claude Code, Gemini CLI)", status: "Implementado", score: 94 },
    { name: "startcheck-agent-orchestrator", type: "Cognitivo / Orquestrador", desc: "Esteira em 4 fases liderada pelo CEO e 25 especialistas", status: "Implementado", score: 94 }
  ],
  agents: [
    { phase: "Intake", name: "startcheck-startup-new", role: "Recepção, acolhimento e coleta das 6 informações base" },
    { phase: "Orquestrador", name: "startcheck-startup-ceo", role: "CEO executivo, guardião de templates e auditor de até 5 iterações" },
    { phase: "Fase 1", name: "startcheck-startup-registrar", role: "Registro formal da startup e estrutura de diretórios" },
    { phase: "Fase 1", name: "startcheck-problem-solution-analyst", role: "Mapeamento rigoroso de Problema x Solução" },
    { phase: "Fase 1", name: "startcheck-hypothesis-validator", role: "Validação estruturada de hipóteses de negócio" },
    { phase: "Fase 1", name: "startcheck-learning-action-analyst", role: "Matriz de aprendizados de campo e plano de ação" },
    { phase: "Fase 2", name: "startcheck-value-proposition-mapper", role: "Mapeamento de dores, ganhos e tarefas do cliente" },
    { phase: "Fase 2", name: "startcheck-persona-profiler", role: "Diagnóstico aprofundado e perfil de personas" },
    { phase: "Fase 2", name: "startcheck-market-sizing-specialist", role: "Dimensionamento de mercado (TAM, SAM e SOM)" },
    { phase: "Fase 3", name: "startcheck-risk-assessor", role: "Matriz de riscos e planos de contingência" },
    { phase: "Fase 3", name: "startcheck-prototype-planner", role: "Planejamento de protótipos e escopo de MVP" },
    { phase: "Fase 3", name: "startcheck-business-canvas-architect", role: "Arquitetura do Business Model Canvas oficial" },
    { phase: "Fase 3", name: "startcheck-operations-ecosystem", role: "Mapeamento do ecossistema e operações" },
    { phase: "Fase 3", name: "startcheck-esg-specialist", role: "Quadro de governança e práticas ESG" },
    { phase: "Fase 4", name: "startcheck-startup-goals-specialist", role: "Definição de metas estratégicas e OKRs" },
    { phase: "Fase 4", name: "startcheck-action-plan-specialist", role: "Plano tático 5W2H de execução" },
    { phase: "Fase 4", name: "startcheck-elevator-pitch-specialist", role: "Elaboração de Pitch de 60 segundos" },
    { phase: "Fase 4", name: "startcheck-demo-day-pitch-specialist", role: "Elaboração de Pitch de 5 minutos (Demo Day)" },
    { phase: "Fase 4", name: "startcheck-investor-pitch-specialist", role: "Elaboração de Pitch de 15 minutos para investidores" },
    { phase: "Fase 4", name: "startcheck-business-copywriter", role: "Refinamento textual de alto impacto para narrativas" },
    { phase: "Fase 4", name: "startcheck-pitch-qa-analyst", role: "Simulação de sabatina de bancas de aceleração" },
    { phase: "Fase 5", name: "startcheck-executive-publisher", role: "Emissão e compilação do Dossiê Executivo final (DOCX/PDF)" }
  ],
  metrics: {
    specsAverageScore: 94.0,
    totalAgents: 25,
    phasesCount: 4,
    testCoverage: "100%",
    actionsDone: 7,
    actionsTotal: 7
  }
};
