import { TemplateEngine, TemplateGroup, TemplateDescriptor } from "./template-engine";
import { TrafficLightEvaluator, DocumentEvaluationResult } from "./traffic-light-evaluator";
import { CANONICAL_STARTUP_SKILLS, AgentSkillDefinition } from "../skills/startup-skills";

export interface GenerationResult {
  templateId: string;
  templateName: string;
  filename: string;
  filePath: string;
  evaluation: DocumentEvaluationResult;
}

export class HarnessOrchestrator {
  private engine: TemplateEngine;
  private evaluator: TrafficLightEvaluator;
  private customSkills: Map<string, AgentSkillDefinition> = new Map();

  constructor(engine: TemplateEngine, evaluator?: TrafficLightEvaluator) {
    this.engine = engine;
    this.evaluator = evaluator || new TrafficLightEvaluator();
  }

  public registerCustomSkill(skill: AgentSkillDefinition): void {
    this.customSkills.set(skill.templateId, skill);
  }

  public getSkill(templateId: string): AgentSkillDefinition {
    if (this.customSkills.has(templateId)) {
      return this.customSkills.get(templateId)!;
    }
    if (CANONICAL_STARTUP_SKILLS[templateId]) {
      return CANONICAL_STARTUP_SKILLS[templateId];
    }
    return {
      templateId,
      agentName: `reversa-agent-${templateId}`,
      agentRole: `Especialista no Template ${templateId}`,
      skillName: `skill-${templateId}`,
      systemPrompt: `Você é o agente especialista responsável por preencher o documento ${templateId}. Analise com rigor e profundidade.`,
      evaluationCriteria: ["Clareza", "Consistência", "Metodologia"]
    };
  }

  public generateDocument(
    startupDir: string,
    templateId: string
  ): GenerationResult | null {
    const tpl = this.engine.getTemplate(templateId);
    if (!tpl) return null;

    const startupConfig = this.engine.getStartupConfig(startupDir);
    const startupName = startupConfig?.startupName || "Startup";
    const description = startupConfig?.description || "";

    // Coletar contexto cumulativo de documentos já gerados
    const context = this.accumulateContext(startupDir);

    const skill = this.getSkill(templateId);

    // Sintetizar conteúdo preenchido estruturado
    const filledContent = this.synthesizeContent(
      tpl.descriptor,
      tpl.content,
      startupName,
      description,
      context,
      skill
    );

    // Avaliação de maturidade pelo semáforo
    const evaluation = this.evaluator.evaluateContent(templateId, filledContent);

    // Inserir selo de semáforo no cabeçalho do documento
    const emoji = TrafficLightEvaluator.getEmoji(evaluation.overall);
    const finalContent = this.embedTrafficLightBadge(filledContent, emoji, evaluation);

    // Salvar documento de forma atômica
    const filePath = this.engine.saveDocument(startupDir, tpl.descriptor.filename, finalContent);

    // Atualizar estado no startup.config.json
    if (startupConfig) {
      startupConfig.documents[templateId] = {
        status: "completed",
        trafficLight: evaluation.overall,
        updatedAt: new Date().toISOString()
      };
      this.engine.updateStartupConfig(startupDir, startupConfig);
    }

    return {
      templateId,
      templateName: tpl.descriptor.name,
      filename: tpl.descriptor.filename,
      filePath,
      evaluation
    };
  }

  public generateGroup(
    startupDir: string,
    group: TemplateGroup,
    onProgress?: (current: number, total: number, name: string) => void
  ): GenerationResult[] {
    const templates = this.engine.getTemplatesByGroup(group);
    const results: GenerationResult[] = [];

    for (let i = 0; i < templates.length; i++) {
      const t = templates[i];
      if (onProgress) onProgress(i + 1, templates.length, t.name);
      const res = this.generateDocument(startupDir, t.id);
      if (res) results.push(res);
    }

    return results;
  }

  public generateAll(
    startupDir: string,
    onProgress?: (current: number, total: number, name: string) => void
  ): GenerationResult[] {
    const templates = this.engine.listTemplates();
    const results: GenerationResult[] = [];

    for (let i = 0; i < templates.length; i++) {
      const t = templates[i];
      if (onProgress) onProgress(i + 1, templates.length, t.name);
      const res = this.generateDocument(startupDir, t.id);
      if (res) results.push(res);
    }

    return results;
  }

  public reviewDocument(
    startupDir: string,
    templateId: string,
    userJustification?: string
  ): GenerationResult | null {
    const tpl = this.engine.getTemplate(templateId);
    if (!tpl) return null;

    let existingContent = this.engine.readDocument(startupDir, tpl.descriptor.filename);
    if (!existingContent) {
      return this.generateDocument(startupDir, templateId);
    }

    // Se houve justificativa, reavaliar e aplicar auto-correção
    let evaluation = this.evaluator.evaluateContent(templateId, existingContent);
    if (userJustification) {
      if (evaluation.items.length > 0) {
        evaluation.items[0] = this.evaluator.applyJustification(evaluation.items[0], userJustification);
        if (evaluation.items.every(i => i.color === "green")) {
          evaluation.overall = "green";
        }
      }
    }

    const emoji = TrafficLightEvaluator.getEmoji(evaluation.overall);
    const updatedContent = this.embedTrafficLightBadge(existingContent, emoji, evaluation, userJustification);

    const filePath = this.engine.saveDocument(startupDir, tpl.descriptor.filename, updatedContent);

    const startupConfig = this.engine.getStartupConfig(startupDir);
    if (startupConfig) {
      if (!startupConfig.documents[templateId]) {
        startupConfig.documents[templateId] = {
          status: "completed",
          trafficLight: evaluation.overall,
          updatedAt: new Date().toISOString()
        };
      } else {
        startupConfig.documents[templateId].trafficLight = evaluation.overall;
        startupConfig.documents[templateId].updatedAt = new Date().toISOString();
        if (userJustification) {
          startupConfig.documents[templateId].justifications = startupConfig.documents[templateId].justifications || [];
          startupConfig.documents[templateId].justifications?.push({
            section: evaluation.items[0]?.topic || "Geral",
            justification: userJustification,
            resolvedTo: evaluation.overall,
            timestamp: new Date().toISOString()
          });
        }
      }
      this.engine.updateStartupConfig(startupDir, startupConfig);
    }

    return {
      templateId,
      templateName: tpl.descriptor.name,
      filename: tpl.descriptor.filename,
      filePath,
      evaluation
    };
  }

  private accumulateContext(startupDir: string): Record<string, string> {
    const context: Record<string, string> = {};
    const templates = this.engine.listTemplates();

    for (const t of templates) {
      const content = this.engine.readDocument(startupDir, t.filename);
      if (content) {
        context[t.id] = content.slice(0, 800); // Amostra de contexto
      }
    }

    return context;
  }

  private synthesizeContent(
    descriptor: TemplateDescriptor,
    rawTemplate: string,
    startupName: string,
    description: string,
    context: Record<string, string>,
    skill: AgentSkillDefinition
  ): string {
    let populated = rawTemplate;

    // Injeção de metadados e DNA da startup
    populated = populated.replace(/\[Nome da Startup\]/g, startupName);
    populated = populated.replace(/\[Data\]/g, new Date().toLocaleDateString("pt-BR"));
    populated = populated.replace(/\[Versão\]/g, "1.0");

    // Enriquecimento contextual dependendo do template
    if (descriptor.id === "001") {
      populated = populated.replace(
        /## 1\. Identificação Básica[\s\S]*?(?=## 2|$)/,
        `## 1. Identificação Básica\n\n- **Nome:** ${startupName}\n- **Proposta de Valor:** ${description}\n- **Data de Registro:** ${new Date().toLocaleDateString("pt-BR")}\n- **Agente Responsável:** ${skill.agentName}\n\n`
      );
    } else if (descriptor.id === "002") {
      populated = populated.replace(
        /## 1\. O Problema[\s\S]*?(?=## 2|$)/,
        `## 1. O Problema\n\n- **Dor Central:** Empreendedores e clientes sofrem com a falta de automatização e precisão.\n- **Quem sente:** Clientes do segmento-alvo da ${startupName}.\n- **Severidade:** Alta recorrência e impacto financeiro.\n\n`
      );
    }

    return populated;
  }

  private embedTrafficLightBadge(
    content: string,
    emoji: string,
    evaluation: DocumentEvaluationResult,
    justification?: string
  ): string {
    // Remover badge prévia se houver
    let clean = content.replace(/^> \*\*Status de Maturidade:\*\*.*?\n\n/m, "");

    const justificationNote = justification
      ? `\n> *Última justificativa:* "${justification}" (Status atualizado)`
      : "";

    const badge = `> **Status de Maturidade:** ${emoji} ${TrafficLightEvaluator.getColorLabel(evaluation.overall)} — ${evaluation.summary}${justificationNote}\n\n`;

    // Inserir logo após o primeiro título H1
    if (clean.startsWith("# ")) {
      const idx = clean.indexOf("\n");
      if (idx !== -1) {
        return clean.slice(0, idx + 1) + "\n" + badge + clean.slice(idx + 1);
      }
    }

    return badge + clean;
  }
}
