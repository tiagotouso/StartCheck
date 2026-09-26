import { AgentSkillDefinition } from "../skills/startup-skills";
import { TemplateEngine } from "./template-engine";
export interface ExtensionResult {
    templateId: string;
    templateFilename: string;
    agentDefinition: AgentSkillDefinition;
    success: boolean;
    message: string;
}
export declare class ExtensionFactory {
    private engine;
    constructor(engine: TemplateEngine);
    registerNewTemplate(sourceTemplatePath: string): ExtensionResult;
}
