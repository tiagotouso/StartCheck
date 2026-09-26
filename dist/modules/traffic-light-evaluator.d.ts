export type TrafficColor = "green" | "yellow" | "red";
export interface TrafficItemAssessment {
    id: string;
    topic: string;
    color: TrafficColor;
    feedback: string;
    recommendation: string;
    justification?: string;
    isResolved?: boolean;
}
export interface DocumentEvaluationResult {
    overall: TrafficColor;
    summary: string;
    items: TrafficItemAssessment[];
}
export declare class TrafficLightEvaluator {
    static getEmoji(color: TrafficColor): string;
    static getColorLabel(color: TrafficColor): string;
    evaluateContent(templateId: string, content: string, contextSummary?: string): DocumentEvaluationResult;
    applyJustification(item: TrafficItemAssessment, userJustification: string): TrafficItemAssessment;
    private evaluateSection;
}
