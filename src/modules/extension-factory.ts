import * as fs from "node:fs";
import * as path from "node:path";
import { AgentSkillDefinition } from "../skills/startup-skills";
import { TemplateEngine } from "./template-engine";

export interface ExtensionResult {
  templateId: string;
  templateFilename: string;
  agentDefinition: AgentSkillDefinition;
  success: boolean;
  message: string;
}

export class ExtensionFactory {
  private engine: TemplateEngine;

  constructor(engine: TemplateEngine) {
    this.engine = engine;
  }

  public registerNewTemplate(
    sourceTemplatePath: string
  ): ExtensionResult {
    if (!fs.existsSync(sourceTemplatePath)) {
      return {
        templateId: "",
        templateFilename: "",
        agentDefinition: {} as any,
        success: false,
        message: `Arquivo fonte não encontrado: ${sourceTemplatePath}`
      };
    }

    const filename = path.basename(sourceTemplatePath);
    const content = fs.readFileSync(sourceTemplatePath, "utf-8");

    // Extrair ID ou calcular o próximo ID
    const match = filename.match(/^(\d{3})\s*(.*?)\.md$/i);
    let templateId = match ? match[1] : "";
    let rawName = match ? match[2] : filename.replace(".md", "");

    if (!templateId) {
      const existing = this.engine.listTemplates();
      const lastNum = existing.length > 0 
        ? Math.max(...existing.map(t => parseInt(t.id, 10)).filter(n => !isNaN(n)))
        : 15;
      templateId = String(lastNum + 1).padStart(3, "0");
      rawName = filename.replace(".md", "").replace(/^\d+\s*/, "");
    }

    const destFilename = `${templateId} ${rawName}.md`;
    const destPath = path.join(this.engine.getTemplatesDir(), destFilename);

    // Copiar para a pasta de templates
    fs.writeFileSync(destPath, content, "utf-8");

    // Inferir agente e skill a partir do conteúdo do markdown
    const sections: string[] = [];
    const lines = content.split("\n");
    let title = rawName;

    for (const line of lines) {
      if (line.startsWith("# ") && title === rawName) {
        title = line.replace("# ", "").trim();
      } else if (line.startsWith("## ")) {
        sections.push(line.replace("## ", "").trim());
      }
    }

    const kebabName = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const agentDefinition: AgentSkillDefinition = {
      templateId,
      agentName: `reversa-agent-${kebabName}`,
      agentRole: `Especialista em ${title}`,
      skillName: `skill-${kebabName}`,
      systemPrompt: `Você é o agente especialista responsável pelo documento ${title}. Conduza a análise de ${sections.join(", ")} com metodologia executiva rigorosa.`,
      evaluationCriteria: sections.length > 0 ? sections.slice(0, 3) : ["Clareza", "Consistência"]
    };

    return {
      templateId,
      templateFilename: destFilename,
      agentDefinition,
      success: true,
      message: `Novo template '${destFilename}' adicionado com sucesso e agente '${agentDefinition.agentName}' gerado.`
    };
  }
}
