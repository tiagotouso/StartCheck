# StartCheck 🚀

> Esteira Inteligente de IA para Validação, Modelagem e Aceleração de Startups em múltiplos harnesses (Antigravity, Claude Code, Gemini CLI).

O **StartCheck** equipa seu ambiente de desenvolvimento com uma diretoria completa de **25 agentes especialistas** e um **CEO de IA**, prontos para guiar você desde a primeira ideia bruta até a entrega de um **Dossiê Executivo homologado** e uma bateria de **pitches para investidores e bancas de aceleração**.

---

## ⚡ Instalação Instantânea

Abra o terminal na pasta onde você deseja iniciar ou documentar a sua startup e execute:

```bash
npx startcheck install
```

Ou se preferir instalar diretamente do repositório no GitHub:

```bash
npx github https://github.com/tiagotouso/StartCheck
```

O instalador irá:
1. Copiar todos os 25 agentes especialistas e seus respectivos templates para `.agents/agents/`.
2. Configurar as regras de integridade e qualidade em `.agents/rules/`.
3. Registrar o slash command `/startcheck` e as diretrizes em `AGENTS.md`, `CLAUDE.md` e `GEMINI.md`.

---

## 🎯 Como Usar no Harness

Abra seu harness de IA favorito (**Antigravity**, **Claude Code**, **Gemini CLI** ou similar) e digite no chat:

```bash
/startcheck
```

---

## 🔄 A Esteira de 4 Fases

```
/startcheck (Ponto de Entrada)
       │
       ▼
startcheck-startup-new (Intake & 6 Informações Base)
       │
       ▼ despacha briefing executivo
startcheck-startup-ceo (CEO Orquestrador & Guardião de Qualidade)
       │
       ├── Fase 1: Fundação, Problema e Hipóteses Críticas
       │   ├── startcheck-startup-registrar           → Registro_Startup.md
       │   ├── startcheck-problem-solution-analyst    → Problema_x_Solucao.md
       │   ├── startcheck-hypothesis-validator        → Validacao_de_Hipoteses.md
       │   └── startcheck-learning-action-analyst     → Matriz_de_Aprendizados_e_Acoes.md
       │
       ├── Fase 2: Cliente, Persona e Dimensionamento de Mercado
       │   ├── startcheck-value-proposition-mapper    → Mapeamento_Dores_Ganhos_e_Trabalhos.md
       │   ├── startcheck-persona-profiler            → Mapeamento_de_Personas.md
       │   └── startcheck-market-sizing-specialist    → Analise_TAM_SAM_SOM.md
       │
       ├── Fase 3: Operação, Viabilidade Econômica e Riscos
       │   ├── startcheck-risk-assessor               → Mapeamento_de_Riscos.md
       │   ├── startcheck-prototype-planner           → Plano_de_Prototipacao.md
       │   ├── startcheck-business-canvas-architect   → Business_Model_Canvas.md
       │   ├── startcheck-operations-ecosystem        → Mapeamento_do_Ecossistema_Operacional.md
       │   └── startcheck-esg-specialist              → Quadro_ESG.md
       │
       ├── Fase 4: Metas, Execução e Narrativa de Vendas (Pitches)
       │   ├── startcheck-startup-goals-specialist    → Metas_da_Startup.md
       │   ├── startcheck-action-plan-specialist      → Plano_de_Acao.md
       │   └── Bateria de Pitches (60s, 5m, 15m) + Refinamento Copywriting + Simulado Q&A
       │
       └── Fase 5: Publicação e Emissão do Dossiê Executivo
           └── startcheck-executive-publisher         → Dossie_Executivo_{Startup}.docx / .pdf
```

---

## 🛡️ Regras e Padrões de Qualidade

- **Preservação de Templates**: Estruturas de tabelas, seções e placeholders são rigidamente preservadas.
- **Zero HTML Cru**: Proibição de tags como `<br>`, mantendo Markdown limpo.
- **Padrão Sem Dois Pontos**: Títulos de campos não terminam com `:`, com valores recuados em 2 espaços na linha seguinte.
- **Marcadores de Status (🟢, 🟡, 🔴)**: Sempre posicionados no início da linha de valor ou célula.
- **Limite de 5 Iterações**: O CEO audita rigorosamente cada documento e encerra o ciclo de revisão na 5ª iteração para manter a agilidade.

---

## 📄 Licença

MIT © Tiago
