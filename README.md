# StartCheck 🚀
> Sistema Inteligente de Modelagem de Startups baseado em Agentes, Skills e Harness

O **StartCheck** é uma ferramenta de linha de comando (CLI) executável diretamente via `npx` que automatiza a modelagem de novos negócios através de agentes de IA especialistas por template de documento, auditoria contínua por semáforo de validação (🟢/🟡/🔴) e exportação multiformato (Markdown, DOCX e XLSX).

---

## ⚡ Como Usar via NPX

Não é necessário clonar o repositório ou instalar dependências globais. Basta rodar:

```bash
npx startcheck install
```

Ou, dentro de uma pasta de startup já criada:

```bash
npx startcheck
```

---

## 🎯 Principais Recursos

1. **15 Modelos Canônicos de Documentação:**
   - **Idea:** `001 Registro da Startup`, `002 Problema x Solução`
   - **Validation:** `003 Validação de Hipóteses`, `004 Matriz de Aprendizados e Ações`, `005 Mapeamento de Dores, Ganhos e Trabalhos`
   - **Strategy:** `006 Mapeamento de Personas`, `007 Mapeamento de Riscos`, `008 Plano de Prototipação`, `009 Business Model Canvas`, `010 Quadro ESG`
   - **Execution:** `011 Metas da Startup (OKRs)`, `012 Plano de Ação`
   - **Pitch:** `013 Pitch 60 Segundos`, `014 Pitch 5 Minutos`, `015 Pitch 15 Minutos`

2. **Agentes Especialistas e Skills:**
   - Cada template possui um agente dedicado com sua respectiva skill de domínio analítico.
   - O **Harness** acumula o contexto gerado em memória, garantindo coerência cruzada (ex: as personas do documento 006 alimentam diretamente o Canvas no 009).

3. **Auditoria por Semáforo (🟢/🟡/🔴) e Auto-Correção:**
   - 🟢 **Verde:** Validado, consistente e fundamentado.
   - 🟡 **Amarela:** Atenção, dados parciais ou premissa aberta.
   - 🔴 **Vermelha:** Inconsistência crítica ou contradição com outros documentos.
   - **Auto-Correção:** O usuário pode justificar qualquer item 🟡 ou 🔴 com dados reais e o agente reavalia e atualiza o documento automaticamente.

4. **Modos Flexíveis de Operação:**
   - **Criação:** um a um, grupo temático ou todos de uma vez.
   - **Revisão:** um a um, grupo temático ou todos de uma vez.

5. **Extensibilidade Dinâmica (Extension Factory):**
   - Usuários e mentores podem adicionar novos arquivos Markdown na pasta de modelos (ex: `016 Matriz_Captacao.md`).
   - O sistema autogera o novo agente e skill correspondentes sem necessidade de codificação manual.

6. **Exportação Executiva Multiformato:**
   - **15 DOCX Individuais:** Um para cada documento da startup.
   - **DOCX Consolidado:** Reúne os documentos de 001 a 012 em um dossiê executivo completo (**os pitches são estritamente excluídos** deste consolidado).
   - **Pitches Isolados em DOCX:** Arquivos específicos para 60s, 5m e 15m.
   - **Plano de Ação em XLSX:** Planilha Excel formatada baseada em modelo, com colunas de Ação, Responsável, Prazo, Indicador, Prioridade e Status.

---

## 🛠️ Arquitetura do Código

```text
code/
├── bin/
│   └── startcheck.js             # Entrypoint executável via npx
├── src/
│   ├── cli/
│   │   └── index.ts              # Interface interativa com @clack/prompts
│   ├── modules/
│   │   ├── template-engine.ts    # Gerenciador dos 15 templates e I/O de Markdown
│   │   ├── traffic-light-evaluator.ts # Semáforo de maturidade e auto-correção
│   │   ├── harness-orchestrator.ts    # Orquestrador de agentes e contexto cumulativo
│   │   ├── extension-factory.ts  # Fábrica dinâmica de novos modelos e agentes
│   │   └── export-service.ts     # Gerador de DOCX, Consolidado e XLSX
│   └── skills/
│       └── startup-skills.ts     # Catálogo de prompts e regras por template
├── templates/                    # Os 15 templates essenciais em Markdown
└── tests/
    └── template-engine.test.ts   # Testes unitários do engine
```

---

## 🧪 Rodando os Testes

```bash
npm install
npm test
```

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido para transformar ideias em negócios de alto impacto.
