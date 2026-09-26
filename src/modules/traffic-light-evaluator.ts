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

export class TrafficLightEvaluator {
  public static getEmoji(color: TrafficColor): string {
    switch (color) {
      case "green": return "🟢";
      case "yellow": return "🟡";
      case "red": return "🔴";
    }
  }

  public static getColorLabel(color: TrafficColor): string {
    switch (color) {
      case "green": return "Verde (Validado / Robusto)";
      case "yellow": return "Amarela (Atenção / Incompleto)";
      case "red": return "Vermelha (Crítico / Inconsistente)";
    }
  }

  public evaluateContent(
    templateId: string,
    content: string,
    contextSummary?: string
  ): DocumentEvaluationResult {
    const items: TrafficItemAssessment[] = [];

    // Verificações heurísticas estruturadas por tipo de documento
    const lines = content.split("\n");
    let currentHeading = "Geral";
    let sectionText = "";

    for (const line of lines) {
      if (line.startsWith("## ") || line.startsWith("### ")) {
        if (sectionText.length > 0) {
          const itemEval = this.evaluateSection(templateId, currentHeading, sectionText);
          if (itemEval) items.push(itemEval);
        }
        currentHeading = line.replace(/^#+\s*/, "").trim();
        sectionText = "";
      } else {
        sectionText += line + "\n";
      }
    }

    if (sectionText.length > 0) {
      const itemEval = this.evaluateSection(templateId, currentHeading, sectionText);
      if (itemEval) items.push(itemEval);
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

    let overall: TrafficColor = "green";
    if (items.some(i => i.color === "red")) {
      overall = "red";
    } else if (items.some(i => i.color === "yellow")) {
      overall = "yellow";
    }

    const summary = overall === "green"
      ? "Documento em excelente maturidade estratégica e metodológica."
      : overall === "yellow"
        ? "Existem pontos de atenção que necessitam de dados de validação ou detalhamento."
        : "Gargalos críticos identificados que requerem intervenção prioritária.";

    return { overall, summary, items };
  }

  public applyJustification(
    item: TrafficItemAssessment,
    userJustification: string
  ): TrafficItemAssessment {
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

    const newColor: TrafficColor = hasEvidence || item.color === "yellow" ? "green" : "yellow";

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

  private evaluateSection(
    templateId: string,
    heading: string,
    text: string
  ): TrafficItemAssessment | null {
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
