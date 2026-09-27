---
description: Diretrizes e padrões obrigatórios para criação de novos agentes no projeto StartCheck.
trigger: always_on
---

# Regras para Criação de Agentes no StartCheck

Sempre que um novo agente for criado ou modificado no projeto, as seguintes regras e convenções devem ser rigorosamente seguidas:

## 1. Localização e Estrutura de Diretórios
- Cada agente deve ter seu próprio diretório dentro de `.agents/agents/`.
- O caminho padrão absoluto do arquivo de configuração do agente é:
  `D:/_Sistema_Operacional_/Área de Trabalho/StartCheck/.agents/agents/{agent_name}/agent.md`

## 2. Nomenclatura e Idioma dos Agentes
- **Nome do Agente (Identificador)**:
  - **Prefixo Obrigatório**: O nome deve sempre iniciar com `startcheck-` (formato `startcheck-xxxxxx`).
  - **Idioma do Nome**: Usar **sempre em inglês** para o nome do agente (ex: `startcheck-web-researcher`, `startcheck-directory-creator`, `startcheck-startup-registrar`, `startcheck-hypothesis-validator`, `startcheck-context-synthesizer`).
  - **Formatação**: Utilizar `kebab-case` minúsculo.
  - **Semântica**: O sufixo deve refletir de forma clara o papel ou especialidade do agente.
- **Idioma dos Textos e Instruções do Agente**:
  - **Exclusivamente em Português (pt-BR)**: Todos os textos do arquivo `agent.md` (campo `description` no frontmatter YAML, títulos das seções, instruções do sistema, diretrizes e regras) devem ser redigidos em português do Brasil. Somente o campo `name` é mantido em inglês.

## 3. Preservação Estrita de Templates (Regra Imutável de Preenchimento)
- **NUNCA alterar a estrutura do template**: Quando o agente for responsável por preencher templates de documentos (como relatórios, registros, telas ou formulários), ele **não pode**:
  - Adicionar novas colunas em tabelas existentes (ex.: não inventar coluna de Status).
  - Adicionar campos, títulos, subtítulos ou metadados que não estejam no template original (ex.: não inventar `- **Status Geral:**`).
  - Modificar a disposição original das seções.
- **Apenas preencher os placeholders**: A função do agente é exclusivamente substituir `[Preencha aqui]` ou `[Ex.: ...]` pelas informações apuradas, preservando 100% da diagramação e estrutura do modelo.
- **Padrão Sem Dois Pontos e Resposta na Linha Seguinte**: Em campos de perguntas ou tópicos, nunca utilizar dois pontos (`:`) no final do título e sempre posicionar o conteúdo ou placeholder na linha de baixo com indentação adequada.

## 4. Posicionamento de Marcadores e Sinalizadores
- Sempre que houver sinalização de status (🟢 OK, 🟡 Atenção, 🔴 Revisão), os marcadores **devem ser inseridos impreterivelmente no começo da linha ou no início do valor preenchido**:
  - **Campos de lista/chave-valor**:
    ```markdown
    - **Nome da Startup** 
      
      🟢 Valor Preenchido
    ```
  - **Células de tabelas**:
    Inserir no início do texto da própria célula: `| **Sócio** | 🟢 Função | 🟡 Dedicação | Competência |`
  - **Parágrafos / Blocos de texto de resumo**:
    Inserir no início do parágrafo da resposta:
    ```markdown
    - **Qual oportunidade foi identificada no mercado** 
      
      🟢 Texto detalhado da resposta...
    ```

## 5. Proibição de Tags HTML e Uso Exclusivo de Quebras de Linha Nativas do Markdown
- **PROIBIDO O USO DE `<br>` OU QUALQUER TAG HTML**: É terminantemente proibido utilizar `<br>`, `<br/>`, `<br />` ou qualquer outra tag HTML nos documentos, templates e respostas dos agentes. Essas tags aparecem como texto cru/literal em diversos visualizadores de markdown, degradando a leitura.
- **Uso de Quebra de Linha Nativa do Markdown**:
  - Em textos, blocos e seções: utilize quebras de linha nativas do markdown (uma linha em branco entre parágrafos ou itens de lista `- `).
  - Em células de tabelas: nunca utilize `<br>`. Para separar títulos de descrições ou subtítulos dentro de células, utilize travessões, parênteses ou dois pontos no mesmo fluxo de texto (ex.: `**Produto ou Serviço** - (O Quê / Para Quem): Descrição...` ou `• Item 1; • Item 2`).


## 6. Uso de Agentes Especialistas e Governança de Validação
Os agentes do ecossistema StartCheck podem e devem colaborar entre si, operando como ferramentas de apoio recíprocas e sob governança executiva:
- **`startcheck-startup-ceo` (Governança e Orquestração)**: Atua como o diretor executivo responsável por gerenciar a esteira completa da startup em 4 fases, auditar critérios de qualidade e solicitar até 5 iterações de melhoria para os agentes especialistas antes de homologar cada documento.
- **`startcheck-context-synthesizer` (Memória e Síntese)**: Todo agente encarregado de criar um novo documento deve consultar o agente sintetizador para obter o histórico consolidado de aprendizados, decisões e dados já validados da startup, garantindo continuidade e coerência entre os arquivos.
- **`startcheck-business-copywriter` (Copywriting e Redação Empresarial)**: Todo agente responsável por redação de discursos, propostas de valor, pitches (60s, 5m, 15m), chamadas para ação (CTAs) e comunicação institucional pode acionar o copywriter empresarial para calibrar a persuasão, eliminar jargões técnicos e garantir clareza para clientes e investidores.
- **`startcheck-executive-publisher` (Editoria Final e Publicação)**: Responsável pela compilação e emissão do Dossiê Executivo Final da startup nos formatos DOCX e PDF, com capa personalizada, sumário executivo e quebra de página por documento, atuando sob comando do CEO.
- **`startcheck-web-researcher` (Pesquisa de Mercado)**: Agentes analíticos podem acionar o pesquisador web para investigar benchmarks, concorrentes e referências técnicas na internet.
- **`startcheck-directory-creator` (Gestão de Diretórios)**: Agentes de onboarding podem delegar a criação ou verificação de pastas complexas para o criador de diretórios.
- **Habilitação de Ferramentas**: Todo agente que interage com outros agentes deve declarar obrigatoriamente a ferramenta `send_message` em seu frontmatter.

## 7. Fronteiras Rígidas de Competência e Não Invasão de Papéis
Cada agente especialista possui autoridade exclusiva sobre um domínio técnico e seu respectivo documento oficial. É terminantemente proibido a qualquer agente inventar, arbitrar ou criar do zero informações cuja competência primária pertença a outro especialista já existente:
- **Compilação e Publicação do Dossiê Final (DOCX / PDF)**: Prerrogativa exclusiva do `startcheck-executive-publisher` (`Dossie_Executivo_Startup.md`), compilando os 14 marcos de validação e modelagem. Os pitches (60s, 5m, 15m) são ferramentas orais autônomas e **não entram no documento final .docx e .pdf**.
- **Tamanho de Mercado (TAM / SAM / SOM)**: Prerrogativa exclusiva do `startcheck-market-sizing-specialist` (`Analise_TAM_SAM_SOM.md`). Nenhum outro agente (como pitches ou canvas) pode estimar volumes ou valores de mercado por conta própria; deve consumir os dados homologados.
- **Modelagem de Negócios, Monetização e Ticket Médio**: Prerrogativa exclusiva do `startcheck-business-canvas-architect` (`Business_Model_Canvas.md`).
- **Ecossistema Operacional e Recursos (Produto, Equipe, Parceiros, Meios)**: Prerrogativa exclusiva do `startcheck-operations-ecosystem-specialist` (`Mapeamento_do_Ecossistema_Operacional.md`).
- **Personas e Hábitos Etnográficos**: Prerrogativa exclusiva do `startcheck-persona-profiler` (`Mapeamento_de_Personas.md`), modelando uma ou múltiplas personas (usuário final, decisor B2B, etc.) dependendo da dinâmica do problema. Nenhum agente pode inventar personas alternativas.
- **Proposta de Valor, Dores e Tarefas**: Prerrogativa exclusiva do `startcheck-value-proposition-mapper` (`Mapeamento_Dores_Ganhos_e_Trabalhos.md`).
- **Problema de Mercado e Alternativas**: Prerrogativa exclusiva do `startcheck-problem-solution-analyst` (`Problema_x_Solucao.md`).
- **Hipóteses e Experimentação Crítica**: Prerrogativa exclusiva do `startcheck-hypothesis-validator` (`Validacao_de_Hipoteses.md`).
- **Evidências de Teste e Ações Decisórias**: Prerrogativa exclusiva do `startcheck-learning-action-analyst` (`Matriz_de_Aprendizados_e_Acoes.md`).
- **Mapeamento e Mitigação de Riscos**: Prerrogativa exclusiva do `startcheck-risk-assessor` (`Mapeamento_de_Riscos.md`).
- **Plano e Usabilidade de Protótipo**: Prerrogativa exclusiva do `startcheck-prototype-planner` (`Plano_de_Prototipacao.md`).
- **Métricas e Metas de Crescimento**: Prerrogativa exclusiva do `startcheck-startup-goals-specialist` (`Metas_da_Startup.md`).
- **Execução Tática 5W2H e Orçamento de Testes**: Prerrogativa exclusiva do `startcheck-action-plan-specialist` (`Plano_de_Acao.md`).
- **Práticas e Governança ESG**: Prerrogativa exclusiva do `startcheck-esg-specialist` (`Quadro_ESG.md`).
- **Narrativa e Discursos (Pitches 60s, 5m, 15m)**: Responsabilidade de `startcheck-elevator-pitch-specialist`, `startcheck-demo-day-pitch-specialist` e `startcheck-investor-pitch-specialist`, com lapidação mandatória do `startcheck-business-copywriter`.
- **Análise de Pitch e Preparação de Banca (Q&A)**: Prerrogativa exclusiva do `startcheck-pitch-qa-analyst` (`Analise_de_Pitch_e_QA.md`), estruturando as perguntas afiadas da banca e respostas de alto encantamento executivo no papel de vendedor experiente. Documento de treino e oratória (não entra no DOCX/PDF final).

**Regra de Consumo Obrigatório (Fonte Única da Verdade)**:
Quando um documento exigir informações originadas em etapas anteriores (ex.: pitches citando mercado, ticket médio ou riscos; planos de ação citando metas), o agente é terminantemente proibido de deduzir ou inventar novos valores. Ele deve obrigatoriamente consumir a informação já gerada pelo agente competente via `startcheck-context-synthesizer` ou consultando o arquivo correspondente na pasta da startup. Se o dado ainda não existir, o agente deve apontar a dependência com o sinalizador 🟡 (Atenção) ou 🔴 (Revisão).

## 8. Estrutura do Arquivo `agent.md`

Todo arquivo `agent.md` deve conter um cabeçalho YAML frontmatter e a seção de instruções do sistema em português:

### Frontmatter YAML Obrigatório
```yaml
---
name: startcheck-xxxxxx
description: Breve descrição em português do propósito, papel e escopo do agente.
tools:
  - send_message
  - search_web         # Adicionar conforme a necessidade do agente
  - read_url_content   # Adicionar conforme a necessidade do agente
  - view_file
  - list_dir
  - write_to_file
  - replace_file_content
hidden: false
inheritCustomizations: true
inheritMcp: true
---
```

### Corpo de Instruções (`# Instruções do Sistema do Agente: startcheck-xxxxxx`)
O corpo deve conter, em português:
1. **Identidade e Papel**: Apresentação clara do agente (`Você é o startcheck-xxxxxx...`).
2. **Capacidades e Escopo**: Lista explícita do que o agente faz e limites de responsabilidade.
3. **Uso de Agentes de Apoio**: Indicação explícita de quais agentes parceiros (como `startcheck-context-synthesizer`) ele pode acionar como ferramenta para obter contexto ou pesquisas.
4. **Regra de Templates e Marcadores**: Se o agente manipula templates, explicitar a proibição de alterações estruturais e a regra de marcadores no início de cada linha/célula.
5. **Protocolos de Ferramentas**: Como e quando utilizar cada ferramenta declarada.
6. **Metodologia de Execução**: Passo a passo do fluxo de trabalho do agente.
7. **Comunicação e Idioma**: Respostas voltadas ao usuário sempre em português (pt-BR) com links markdown no formato `file:///`.
