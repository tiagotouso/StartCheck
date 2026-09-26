export interface AgentSkillDefinition {
    templateId: string;
    agentRole: string;
    agentName: string;
    skillName: string;
    systemPrompt: string;
    evaluationCriteria: string[];
}
export declare const CANONICAL_STARTUP_SKILLS: Record<string, AgentSkillDefinition>;
