"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficLightEvaluator = void 0;
class TrafficLightEvaluator {
    static getEmoji(color) {
        switch (color) {
            case "green": return "🟢";
            case "yellow": return "🟡";
            case "red": return "🔴";
        }
    }
    static getColorLabel(color) {
        switch (color) {
            case "green": return "Verde (Validado / Robusto)";
            case "yellow": return "Amarela (Atenção / Incompleto)";
            case "red": return "Vermelha (Crítico / Inconsistente)";
        }
    }
    evaluateContent(templateId, content, contextSummary) {
        const items = [];
        // Verificações heurísticas estruturadas por tipo de documento
        const lines = content.split("\n");
        let currentHeading = "Geral";
        let sectionText = "";
        for (const line of lines) {
            if (line.startsWith("## ") || line.startsWith("### ")) {
                if (sectionText.length > 0) {
                    const itemEval = this.evaluateSection(templateId, currentHeading, sectionText);
                    if (itemEval)
                        items.push(itemEval);
                }
                currentHeading = line.replace(/^#+\s*/, "").trim();
                sectionText = "";
            }
            else {
                sectionText += line + "\n";
            }
        }
        if (sectionText.length > 0) {
            const itemEval = this.evaluateSection(templateId, currentHeading, sectionText);
            if (itemEval)
                items.push(itemEval);
        }
        if (items.length === 0) {
            items.push({
                id: "sec-01",
                topic: "Conteúdo Geral",
                color: "yellow",
                feedback: "Documento preenchido de forma superficial.",
                recommendation: "Detalhar tópicos com evidências e métricas concretas."
            });
        }
        let overall = "green";
        if (items.some(i => i.color === "red")) {
            overall = "red";
        }
        else if (items.some(i => i.color === "yellow")) {
            overall = "yellow";
        }
        const summary = overall === "green"
            ? "Documento em excelente maturidade estratégica e metodológica."
            : overall === "yellow"
                ? "Existem pontos de atenção que necessitam de dados de validação ou detalhamento."
                : "Gargalos críticos identificados que requerem intervenção prioritária.";
        return { overall, summary, items };
    }
    applyJustification(item, userJustification) {
        const trimmed = userJustification.trim();
        if (trimmed.length < 5) {
            return {
                ...item,
                justification: userJustification,
                feedback: "Justificativa muito vaga ou insuficiente para elevar o status.",
                isResolved: false
            };
        }
        // Se o usuário forneceu justificativa substancial com números, dados ou fatos
        const hasEvidence = /\d+|pesquisa|entrevista|cliente|teste|validado|piloto/i.test(trimmed);
        const newColor = hasEvidence || item.color === "yellow" ? "green" : "yellow";
        return {
            ...item,
            color: newColor,
            justification: userJustification,
            feedback: newColor === "green"
                ? `Aprovado sob justificativa do fundador: "${trimmed}"`
                : `Justificativa acolhida parcialmente. Recomendado monitorar: "${trimmed}"`,
            isResolved: newColor === "green"
        };
    }
    evaluateSection(templateId, heading, text) {
        const clean = text.trim();
        if (clean.length < 10) {
            return {
                id: `sec-${heading.toLowerCase().replace(/\s+/g, "-")}`,
                topic: heading,
                color: "red",
                feedback: "Seção praticamente vazia ou sem preenchimento adequado.",
                recommendation: "Preencher com dados objetivos e alinhados à proposta de valor."
            };
        }
        if (clean.includes("[INDEFINIDO]") || clean.includes("A definir") || clean.includes("TBD")) {
            return {
                id: `sec-${heading.toLowerCase().replace(/\s+/g, "-")}`,
                topic: heading,
                color: "yellow",
                feedback: "Contém termos indefinidos ou premissas abertas.",
                recommendation: "Substituir indefinições por metas e estimativas fundamentadas."
            };
        }
        return {
            id: `sec-${heading.toLowerCase().replace(/\s+/g, "-")}`,
            topic: heading,
            color: "green",
            feedback: "Seção consistente e bem articulada.",
            recommendation: "Manter acompanhamento periódico."
        };
    }
}
exports.TrafficLightEvaluator = TrafficLightEvaluator;
