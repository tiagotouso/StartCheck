import { TemplateEngine, TemplateGroup } from "./template-engine";
import { TrafficLightEvaluator, DocumentEvaluationResult } from "./traffic-light-evaluator";
import { AgentSkillDefinition } from "../skills/startup-skills";
export interface GenerationResult {
    templateId: string;
    templateName: string;
    filename: string;
    filePath: string;
    evaluation: DocumentEvaluationResult;
}
export declare class HarnessOrchestrator {
    private engine;
    private evaluator;
    private customSkills;
    constructor(engine: TemplateEngine, evaluator?: TrafficLightEvaluator);
    registerCustomSkill(skill: AgentSkillDefinition): void;
    getSkill(templateId: string): AgentSkillDefinition;
    generateDocument(startupDir: string, templateId: string): GenerationResult | null;
    generateGroup(startupDir: string, group: TemplateGroup, onProgress?: (current: number, total: number, name: string) => void): GenerationResult[];
    generateAll(startupDir: string, onProgress?: (current: number, total: number, name: string) => void): GenerationResult[];
    reviewDocument(startupDir: string, templateId: string, userJustification?: string): GenerationResult | null;
    private accumulateContext;
    private synthesizeContent;
    private embedTrafficLightBadge;
}
