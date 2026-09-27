# Especificação Técnica: Criação de Agent Skills

> **Referência Canônica**: Baseado na arquitetura e anatomia do skill [`reversa-arbiter`](file:///D:/_Sistema_Operacional_/Área%20de%20Trabalho/Nova%20pasta/.agents/skills/reversa-arbiter/SKILL.md) e nos padrões modernos de Agent Skills (Antigravity, Claude Code, Cursor, Codex, Gemini CLI).

---

## 1. Visão Geral e Princípios Fundamentais

Uma **Agent Skill** é um módulo declarativo e auto-contido de instruções, metadados, templates e recursos auxiliares que capacita agentes de IA a executar fluxos de trabalho especializados, previsíveis e com forte controle de qualidade.

### Princípios Extraídos do `reversa-arbiter`:
1. **Identidade Estrita e Foco Único (Single Responsibility)**: Cada skill tem um papel bem delimitado dentro de uma equipe ou pipeline.
2. **Human-in-the-Loop (HITL) Obrigatório**: O agente recomenda e estrutura; a decisão final é humana. O agente nunca toma decisões irreversíveis sozinho.
3. **Guardrails de Entrada Determinísticos**: Se as pré-condições (arquivos de estado, artefatos anteriores) não existirem, o agente encerra imediatamente com instruções claras de recuperação.
4. **Templates com Schemas Rigorosos**: O conteúdo gerado deve seguir layouts exatos com placeholders semânticos e selos de estado (ex.: `🟡 PLANEJADO`).
5. **Delimitação Absoluta de Escopo (Sandboxing)**: O skill possui uma "Regra Absoluta" que impede o agente de tocar em arquivos não autorizados ou gerar código fora do escopo.
6. **Progressive Disclosure**: Instruções principais concisas no `SKILL.md`, delegando documentações extensas para `references/` e automações para `scripts/`.

---

## 2. Estrutura Canônica de Diretórios

Um skill deve residir em um diretório com seu nome kebab-case dentro de `.agents/skills/` (no projeto) ou no diretório global de skills:

```text
.agents/skills/<skill-name>/
├── SKILL.md                 # [OBRIGATÓRIO] Arquivo principal de instruções com frontmatter YAML
├── agents/
│   └── openai.yaml          # [RECOMENDADO] Configurações de interface e políticas de invocação
├── references/              # [OPCIONAL] Documentos técnicos de apoio carregados sob demanda
├── scripts/                 # [OPCIONAL] Scripts utilitários executáveis (.ps1, .sh, .py, etc.)
└── assets/                  # [OPCIONAL] Diagramas, esquemas ou templates adicionais
```

---

## 3. Especificação do `SKILL.md`

O `SKILL.md` é o coração do skill e divide-se em duas partes: **Frontmatter YAML** e **Corpo de Instruções**.

### 3.1. Frontmatter YAML

O arquivo **deve** começar com o delimitador `---` e conter os seguintes campos:

```yaml
---
name: <skill-name>
description: <Descrição concisa em 3ª pessoa indicando o que faz, para quem serve, quando usar e quais artefatos produz.>
disable-model-invocation: true | false
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI e demais agentes compatíveis com Agent Skills.
metadata:
  author: <autor-ou-organizacao>
  version: "1.0.0"
  framework: <nome-do-framework>    # Ex.: reversa
  team: <subequipe-ou-dominio>       # Ex.: ideation, forward, quality, migration
  stage: <etapa-do-pipeline>         # Ex.: arbiter, explorer, requirements
---
```

#### Definição dos Campos:
* **`name`** *(string, obrigatório)*: Identificador único em minúsculas e hífen (ex.: `reversa-arbiter`).
* **`description`** *(string, obrigatório)*: Usado pelo orquestrador para roteamento por *progressive disclosure*. Deve conter:
  - Papel do agente.
  - O que avalia/processa.
  - Artefato final que gera.
  - Quando deve ser acionado.
* **`disable-model-invocation`** *(boolean, obrigatório)*: Defina `true` se o skill só deve rodar por comando direto do usuário/orquestrador, evitando acionamentos acidentais.
* **`compatibility`** *(string, opcional)*: Ferramentas e CLI suportadas.
* **`metadata`** *(map, recomendado)*: Controle de versão, autoria e posição dentro de pipelines maiores.

---

### 3.2. Anatomia do Corpo de Instruções (As 9 Seções Críticas)

Seguindo o padrão do `reversa-arbiter`, o corpo do arquivo deve conter as seguintes seções estruturadas:

#### Seção I: Declaração de Identidade e Missão
- **Objetivo**: Fixar persona, propósito e fronteira ética/operacional.
- **Padrão**:
  > *"Você é o [Nome do Agente], [número/etapa] agente do [Time]. Sua missão é [verbo de ação]. Você recomenda, o usuário decide. A recomendação nunca vira decisão sozinha."*

#### Seção II: Antes de Começar (Pré-condições e Guardrails)
- **Objetivo**: Garantir que todas as entradas existam antes de qualquer processamento.
- **Regras**:
  1. Leitura de arquivos de estado global (ex.: `.reversa/state.json`, `.reversa/active-ideation.json`).
  2. Validação da presença dos artefatos das etapas anteriores.
  3. Mensagem de saída orientada à ação se faltar dependência (ex.: *"Não encontrei `risks.md`. Rode `/reversa-challenger` primeiro."*).

#### Seção III: Critérios e Regras Normativas
- **Objetivo**: Remover a arbitrariedade da IA, estabelecendo métricas transparentes.
- **Estrutura**:
  - Tabela com critérios objetivos e escalas bem definidas (ex.: escala 1 a 5, onde 5 = melhor/mais barato).
  - Regra de não negociação: *"Os pesos são fixos, não negocie com o usuário."*
  - Regra de cálculo e empates: como somar e como tratar empates de forma neutra.

#### Seção IV: Protocolo de Recomendação
- **Objetivo**: Expor o raciocínio e os trade-offs de forma explícita e corajosa.
- **Itens obrigatórios**:
  1. Opção vencedora e pontuação.
  2. Trade-off explícito: *"O que você está trocando ao escolher ela."*
  3. Condição de contorno: *"Em que condição a recomendação muda."*
  4. Teste barato de validação antes do comprometimento.
  5. Validação de opções nulas (ex.: *"Se a opção 'não construir' vencer, declare isso claramente"*).

#### Seção V: Protocolo de Interação Humana (HITL)
- **Objetivo**: Dar controle determinístico ao operador humano.
- **Elementos**:
  - Menu numérico padronizado com opções claras de aceite, rejeição, desvio e retorno ao estágio anterior.
  - Opção aberta de texto (`[Outro / Descreva]`).
  - Bloqueio estrito de execução: **"Aguarde. Nunca escreva o artefato antes da resposta explícita do usuário."**
  - Registro transparente de divergências humanas (não forçar concordância).

#### Seção VI: Template do Artefato (Markdown Schema)
- **Objetivo**: Padronizar a saída física com marcadores semânticos de auditoria.
- **Elementos do Template**:
  - Cabeçalho padronizado com selo de estado (ex.: `> Selo 🟡 PLANEJADO`).
  - Blocos com placeholders claros (`🟡 <dado copiado do arquivo X>`).
  - Seções condicionais (ex.: `Divergência Registrada` presente apenas quando o usuário diverge do agente).
  - Rodapé com trilha de auditoria: data ISO 8601, agente gerador e ID da sessão.

#### Seção VII: Persistência e Transição de Estado
- **Objetivo**: Garantir integridade no disco e sincronia do pipeline.
- **Regras**:
  - Especificação de charset: UTF-8 sem BOM.
  - Escrita atômica.
  - Verificação de sobrescrita: perguntar confirmação caso o arquivo já exista.
  - Atualização do estágio no arquivo de controle (ex.: alterar `current-stage` para a próxima etapa).

#### Seção VIII: Relatório Final e Handoff
- **Objetivo**: Fechar o ciclo com sumário no chat e instrução do próximo passo.
- **Estrutura**:
  1. Caminho absoluto do arquivo criado.
  2. Resumo da decisão tomada e divergências.
  3. Teste prioritário a ser executado.
  4. Call-to-Action com palavra-chave de controle:
     > *"Digite **CONTINUAR** para prosseguir com `/<proximo-agente>`..."*
  5. Regra anti-autonomia não autorizada: *"Nunca prossiga automaticamente."*

#### Seção IX: Regra Absoluta (Sandboxing)
- **Objetivo**: Evitar efeitos colaterais catastróficos no repositório.
- **Exemplo**:
  > *"Escreva apenas em `<session-dir>/<arquivo.md>` e no `current-stage` do arquivo de estado. Nunca toque em outro arquivo do projeto. Nunca produza código."*

---

## 4. Especificação do `agents/openai.yaml`

O arquivo [`openai.yaml`](file:///D:/_Sistema_Operacional_/Área%20de%20Trabalho/Nova%20pasta/.agents/skills/reversa-arbiter/agents/openai.yaml) define o comportamento do skill em plataformas compatíveis com o padrão OpenAI Assistant / CLI Tools:

```yaml
interface:
  display_name: "<Nome de Exibição Amigável>"
  short_description: "<Resumo de uma linha para visualização rápida no menu>"
policy:
  allow_implicit_invocation: false | true
```

* **`allow_implicit_invocation: false`**: Impede que modelos chamem o skill silenciosamente sem comando ou intenção explícita.

---

## 5. Diretórios Opcionais (`references/`, `scripts/`, `assets/`)

| Diretório | Finalidade | Boas Práticas |
|---|---|---|
| `references/` | Manuais de conformidade, dicionários de dados, RFCs e regras longas. | Referenciar via links relativos (`[manual](references/regras.md)`). Não despejar no `SKILL.md`. |
| `scripts/` | Utilitários de verificação, scripts de build, migração de esquema, testes de fumaça. | Criar scripts parametrizados e idempotentes com verificação de erros. |
| `assets/` | Templates de relatório, mockups SVG, esquemas JSON Schema. | Manter arquivos desacoplados e fáceis de versionar. |

---

## 6. Matriz de Qualidade para Criação de Skills

| Dimensão | O que verificar | Falha Comum (Anti-Pattern) |
|---|---|---|
| **Determinismo de Entrada** | O skill checa arquivos de entrada antes de começar? | O agente tenta adivinhar o contexto sem os arquivos necessários. |
| **Soberania Humana** | O skill pede confirmação explícita antes de persistir? | O agente escreve o artefato antes do usuário validar. |
| **Isolamento de Efeitos** | O skill tem sua "Regra Absoluta" limitando onde pode gravar? | O agente altera arquivos alheios ou cria código indevido. |
| **Transparência de Divergência** | Se o usuário discordar, o agente acata sem adulterar métricas? | O agente altera o placar técnico para agradar o usuário. |
| **Continuidade de Pipeline** | O skill orienta claramente como chamar o próximo estágio? | O agente encerra com "concluído" sem apontar para onde ir. |

---

## 7. Boilerplate de Referência para Novo Skill

```markdown
---
name: meu-novo-skill
description: Agente de [especialidade] responsável por [ação principal]. Produz [artefato.md] a partir de [entradas].
disable-model-invocation: true
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI e demais agentes compatíveis com Agent Skills.
metadata:
  author: seu-nome
  version: "1.0.0"
  framework: meu-framework
  team: operacoes
  stage: triagem
---

Você é o [Nome], agente responsável por [Missão clara em 1-2 linhas].

## Antes de começar

1. Verifique a existência de `.estado/config.json`. Se ausente, aborte e instrua a executar `/inicializar`.
2. Verifique a existência de `<contexto>/entrada.md`. Se ausente, aborte:
   > "Artefato `entrada.md` não encontrado. Execute `/etapa-anterior` primeiro."

## Regras e Critérios

| Item | Critério | Escala / Definição |
|---|---|---|
| Critério 1 | Mede X | 1 a 5 |
| Critério 2 | Mede Y | 1 a 5 |

## Interação com o Usuário

Apresente as opções estruturadas:

```
[1] Aprovar recomendação
[2] Ajustar parâmetros
[3] Cancelar e voltar para /etapa-anterior
[4] Outro (descreva)
```

Aguarde a resposta. **Nunca prossiga sem a escolha do usuário.**

## Template de Saída em `<contexto>/saida.md`

```markdown
# Relatório de Execução: <nome>

> Selo 🟡 PLANEJADO

## Dados Processados
🟡 <resumo das entradas>

## Avaliação Técnica
🟡 <resultado dos critérios>

## Decisão Registrada
🟡 Decidido por <user_name> em <ISO 8601>

---
Gerado por meu-novo-skill em <ISO 8601>
```

## Persistência

1. Escrita atômica em UTF-8 sem BOM em `<contexto>/saida.md`.
2. Se o arquivo já existir, peça autorização para sobrescrever.
3. Atualize o status no arquivo de estado para `proxima-fase`.

## Relatório Final

Informe:
1. Caminho absoluto do artefato gerado.
2. Resumo da decisão.
3. Próximo passo recomendado.

Finalize com:
> Digite **CONTINUAR** para prosseguir com `/proximo-skill`.

## Regra Absoluta

Escreva única e exclusivamente em `<contexto>/saida.md` e no status de `.estado/config.json`. Nunca modifique outros arquivos do projeto.
```
