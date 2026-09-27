# Regras do Diretório: Criação e Manutenção de Agentes

Este diretório contém as definições de agentes do projeto StartCheck. Toda adição ou modificação neste diretório deve seguir os seguintes critérios:

## 1. Localização
- Cada agente deve residir em sua própria subpasta com o arquivo `agent.md`:
  `.agents/agents/{agent_name}/agent.md`

## 2. Nomenclatura e Idioma
- O **nome** do agente deve ser **sempre em inglês** e iniciar com `startcheck-` em `kebab-case` minúsculo (ex.: `startcheck-web-researcher`).
- Todos os **textos do arquivo `agent.md`** (campo `description` no frontmatter e todo o corpo de instruções do sistema) devem ser redigidos **obrigatoriamente em português (pt-BR)**.

## 3. Preservação Rigorosa de Templates (Não Modificar Estrutura)
- O agente que trabalha com templates **nunca deve alterar a estrutura do template**:
  - Proibido criar novas colunas em tabelas (ex: não criar coluna "Status").
  - Proibido adicionar campos novos, títulos ou seções inexistentes no modelo original.
  - Apenas substituir os placeholders existentes pelos dados levantados.
- **Padrão Sem Dois Pontos e Resposta na Linha Abaixo**: Nunca colocar `:` no final de títulos/perguntas; colocar a resposta/placeholder na linha seguinte.

## 4. Marcadores Sempre no Começo da Linha / Valor
- Marcadores de status (🟢 OK, 🟡 Atenção, 🔴 Revisão) devem ser posicionados **sempre no início da linha preenchida ou do valor**:
  - Em listas: `- **Campo** \n  \n  🟢 Valor`
  - Em tabelas: diretamente no início do texto da célula (`| **Sócio** | 🟢 Função | 🟡 Dedicação |`)
  - Em parágrafos: no início do bloco de resposta (`🟢 Texto da resposta...`)

## 5. Uso de Agentes Especialistas como Ferramentas
- Os agentes podem e devem utilizar agentes especialistas existentes como ferramentas de suporte:
  - **`startcheck-context-synthesizer`**: Consultar para obter o resumo/briefing de documentos já criados antes de produzir novos documentos.
  - **`startcheck-web-researcher`**: Acionar para pesquisas na internet e validações externas.
  - **`startcheck-directory-creator`**: Acionar para criar pastas e estruturas de arquivos.

## 6. Padrão do `agent.md`
- Conter frontmatter YAML com `name` (em inglês), `description` (em português), lista de `tools` (incluindo `send_message`), `hidden`, `inheritCustomizations` e `inheritMcp`.
- Conter instruções detalhadas em português (`# Instruções do Sistema do Agente: startcheck-xxxxxx`), cobrindo papel, escopo, uso de agentes parceiros, regras estritas de templates e marcadores, regras de ferramentas, metodologia e comunicação.
