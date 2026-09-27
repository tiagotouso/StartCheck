# Dossiê Executivo da Startup (Ordem Oficial de Compilação)

> Estrutura padrão de compilação e publicação do documento executivo final consolidado da startup nos formatos DOCX e PDF.

---

## 1. Estrutura de Capa Oficial

- **Título Principal** 
  
  [Nome da Startup] - Dossiê Executivo de Validação e Negócios
- **Slogan ou Proposta de Valor em Uma Frase** 
  
  [Preencha com a proposta central homologada no Registro_Startup.md]
- **Equipe Fundadora** 
  
  [Nomes dos fundadores e funções principais]
- **Setor de Atuação e Localidade** 
  
  [Setor de mercado / Cidade - UF]
- **Data de Emissão e Versão** 
  
  [Mês e Ano] - Versão 1.0 (Oficial)
- **Chancela Institucional** 
  
  Metodologia StartCheck de Validação e Governança de Startups

---

## 2. Sumário Executivo Oficial (Ordem Rígida de Compilação)

Cada documento listado abaixo deve iniciar obrigatoriamente em uma **NOVA PÁGINA (Quebra de Página / Page Break)** no documento final:

1. **Marco 01: Registro e Fundação da Startup** 
   - Arquivo fonte: `Registro_Startup.md`
   - Responsável técnico: `startcheck-startup-registrar`

2. **Marco 02: Diagnóstico de Problema x Solução** 
   - Arquivo fonte: `Problema_x_Solucao.md`
   - Responsável técnico: `startcheck-problem-solution-analyst`

3. **Marco 03: Matriz de Validação de Hipóteses Críticas** 
   - Arquivo fonte: `Validacao_de_Hipoteses.md`
   - Responsável técnico: `startcheck-hypothesis-validator`

4. **Marco 04: Matriz de Aprendizados e Ações Decisórias** 
   - Arquivo fonte: `Matriz_de_Aprendizados_e_Acoes.md`
   - Responsável técnico: `startcheck-learning-action-analyst`

5. **Marco 05: Mapeamento de Dores, Ganhos e Tarefas do Cliente** 
   - Arquivo fonte: `Mapeamento_Dores_Ganhos_e_Trabalhos.md`
   - Responsável técnico: `startcheck-value-proposition-mapper`

6. **Marco 06: Diagnóstico e Perfil da Persona** 
   - Arquivo fonte: `Mapeamento_de_Personas.md`
   - Responsável técnico: `startcheck-persona-profiler`

7. **Marco 07: Dimensionamento de Mercado (TAM, SAM e SOM)** 
   - Arquivo fonte: `Analise_TAM_SAM_SOM.md`
   - Responsável técnico: `startcheck-market-sizing-specialist`

8. **Marco 08: Mapeamento e Mitigação de Riscos** 
   - Arquivo fonte: `Mapeamento_de_Riscos.md`
   - Responsável técnico: `startcheck-risk-assessor`

9. **Marco 09: Plano de Prototipagem e Roteiro de Usabilidade** 
   - Arquivo fonte: `Plano_de_Prototipacao.md`
   - Responsável técnico: `startcheck-prototype-planner`

10. **Marco 10: Business Model Canvas e Sustentabilidade** 
    - Arquivo fonte: `Business_Model_Canvas.md`
    - Responsável técnico: `startcheck-business-canvas-architect`

11. **Marco 11: Mapeamento do Ecossistema Operacional** 
    - Arquivo fonte: `Mapeamento_do_Ecossistema_Operacional.md`
    - Responsável técnico: `startcheck-operations-ecosystem-specialist`

12. **Marco 12: Enquadramento e Práticas ESG** 
    - Arquivo fonte: `Quadro_ESG.md`
    - Responsável técnico: `startcheck-esg-specialist`

13. **Marco 13: Metas da Startup e Métrica Estrela-Guia** 
    - Arquivo fonte: `Metas_da_Startup.md`
    - Responsável técnico: `startcheck-startup-goals-specialist`

14. **Marco 14: Plano de Ação Tático de Validação (5W2H)** 
    - Arquivo fonte: `Plano_de_Acao.md`
    - Responsável técnico: `startcheck-action-plan-specialist`

> **Nota Exclusiva sobre Pitches de Apresentação:**  
> Os documentos `Pitch_60_Segundos.md`, `Pitch_5_Minutos.md` e `Pitch_15_Minutos.md` são instrumentos dinâmicos de fala, slides e oratória. Eles **NÃO integram** o documento encadernado final (.docx e .pdf) da startup, permanecendo como artefatos individuais de treino e apresentação na pasta da startup.

---

## 3. Diretrizes de Formatação para Exportação (DOCX e PDF)

- **Capa Profissional**: Primeira página exclusiva com diagramação editorial, tipografia diferenciada e sem numeração de página visível na capa.
- **Sumário Executivo**: Segunda página com o índice enumerando os 14 marcos de validação da esteira e remetendo às seções correspondentes.
- **Quebra de Página Obrigatória**: Cada um dos 14 documentos deve conter um comando de quebra de página explícito antes do seu título principal (`doc.add_page_break()` no Word ou `PageBreak()` no PDF).
- **Padronização Visual**: Tipografia corporativa sóbria (Calibri / Arial / Helvetica), títulos hierarquizados em azul marinho/chumbo executivo e tabelas com bordas limpas e cabeçalhos destacados.
