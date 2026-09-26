import { TemplateEngine } from "./template-engine";
export interface ExportReport {
    individualDocx: string[];
    consolidatedDocx: string;
    pitchesDocx: string[];
    actionPlanXlsx: string;
}
export declare class ExportService {
    private engine;
    constructor(engine: TemplateEngine);
    exportAll(startupDir: string): Promise<ExportReport>;
    private generateDocxFromMarkdown;
    private generateConsolidatedDocx;
    private generateActionPlanXlsx;
    private markdownToParagraphs;
}
