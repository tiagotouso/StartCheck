export type TemplateGroup = "idea" | "validation" | "strategy" | "execution" | "pitch";
export interface TemplateDescriptor {
    id: string;
    name: string;
    filename: string;
    group: TemplateGroup;
    title: string;
}
export interface StartupConfig {
    startupName: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    documents: Record<string, {
        status: "pending" | "completed";
        trafficLight: "green" | "yellow" | "red";
        updatedAt: string;
        justifications?: Array<{
            section: string;
            justification: string;
            resolvedTo: string;
            timestamp: string;
        }>;
    }>;
}
export declare class TemplateEngine {
    private templatesDir;
    constructor(templatesDir?: string);
    getTemplatesDir(): string;
    listTemplates(): TemplateDescriptor[];
    getTemplate(id: string): {
        descriptor: TemplateDescriptor;
        content: string;
    } | null;
    getTemplatesByGroup(group: TemplateGroup): TemplateDescriptor[];
    initStartupDir(basePath: string, startupName: string, description: string): string;
    getStartupConfig(startupDir: string): StartupConfig | null;
    updateStartupConfig(startupDir: string, config: StartupConfig): void;
    saveDocument(startupDir: string, filename: string, content: string): string;
    readDocument(startupDir: string, filename: string): string | null;
    private saveAtomicJson;
}
