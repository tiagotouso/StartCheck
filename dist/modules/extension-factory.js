"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionFactory = void 0;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
class ExtensionFactory {
    engine;
    constructor(engine) {
        this.engine = engine;
    }
    registerNewTemplate(sourceTemplatePath) {
        if (!fs.existsSync(sourceTemplatePath)) {
            return {
                templateId: "",
                templateFilename: "",
                agentDefinition: {},
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
        const sections = [];
        const lines = content.split("\n");
        let title = rawName;
        for (const line of lines) {
            if (line.startsWith("# ") && title === rawName) {
                title = line.replace("# ", "").trim();
            }
            else if (line.startsWith("## ")) {
                sections.push(line.replace("## ", "").trim());
            }
        }
        const kebabName = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const agentDefinition = {
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
exports.ExtensionFactory = ExtensionFactory;
