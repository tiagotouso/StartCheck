import * as fs from "node:fs";
import * as path from "node:path";
import { Document, Paragraph, TextRun, HeadingLevel, Packer, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import ExcelJS from "exceljs";
import { TemplateEngine } from "./template-engine";

export interface ExportReport {
  individualDocx: string[];
  consolidatedDocx: string;
  pitchesDocx: string[];
  actionPlanXlsx: string;
}

export class ExportService {
  private engine: TemplateEngine;

  constructor(engine: TemplateEngine) {
    this.engine = engine;
  }

  public async exportAll(startupDir: string): Promise<ExportReport> {
    const exportsDir = path.join(startupDir, "exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    const templates = this.engine.listTemplates();
    const individualDocx: string[] = [];
    const pitchesDocx: string[] = [];

    const startupConfig = this.engine.getStartupConfig(startupDir);
    const startupName = startupConfig?.startupName || "Startup";

    // 1. Exportar DOCX individuais
    for (const t of templates) {
      const content = this.engine.readDocument(startupDir, t.filename);
      if (!content) continue;

      const docxPath = path.join(exportsDir, `${t.id}_${t.name}.docx`);
      await this.generateDocxFromMarkdown(content, t.title, docxPath, startupName);

      if (t.group === "pitch") {
        pitchesDocx.push(docxPath);
      } else {
        individualDocx.push(docxPath);
      }
    }

    // 2. Exportar DOCX Consolidado (apenas 001 a 012 - SEM Pitches!)
    const consolidatedPath = path.join(exportsDir, "Dossie_Consolidado_Startup.docx");
    await this.generateConsolidatedDocx(startupDir, templates.filter(t => t.group !== "pitch"), consolidatedPath, startupName);

    // 3. Exportar XLSX do Plano de Ação (012)
    const actionPlanPath = path.join(exportsDir, "012_Plano_de_Acao.xlsx");
    await this.generateActionPlanXlsx(startupDir, actionPlanPath, startupName);

    return {
      individualDocx,
      consolidatedDocx: consolidatedPath,
      pitchesDocx,
      actionPlanXlsx: actionPlanPath
    };
  }

  private async generateDocxFromMarkdown(
    markdown: string,
    title: string,
    outputPath: string,
    startupName: string
  ): Promise<void> {
    const paragraphs = this.markdownToParagraphs(markdown, title, startupName);

    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
  }

  private async generateConsolidatedDocx(
    startupDir: string,
    templates: Array<{ id: string; filename: string; title: string }>,
    outputPath: string,
    startupName: string
  ): Promise<void> {
    const children: Paragraph[] = [
      new Paragraph({
        text: `Dossiê Consolidado de Modelagem: ${startupName}`,
        heading: HeadingLevel.TITLE,
        spacing: { after: 300 }
      }),
      new Paragraph({
        text: `Documento executivo compilado em ${new Date().toLocaleDateString("pt-BR")}. Contém a modelagem estratégica de 001 a 012 (excluindo pitches).`,
        spacing: { after: 500 }
      })
    ];

    for (const t of templates) {
      const content = this.engine.readDocument(startupDir, t.filename);
      if (!content) continue;

      children.push(
        new Paragraph({
          text: `\n${t.id} — ${t.title}`,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      const sectionParas = this.markdownToParagraphs(content, t.title, startupName, false);
      children.push(...sectionParas);
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
  }

  private async generateActionPlanXlsx(
    startupDir: string,
    outputPath: string,
    startupName: string
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "StartCheck";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Plano de Ação Estratégico", {
      views: [{ showGridLines: true }]
    });

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Ação Estratégica", key: "action", width: 45 },
      { header: "Área / Categoria", key: "category", width: 20 },
      { header: "Responsável", key: "responsible", width: 22 },
      { header: "Prazo", key: "deadline", width: 16 },
      { header: "Métrica / Indicador", key: "indicator", width: 30 },
      { header: "Prioridade", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 18 }
    ];

    // Formatação do Cabeçalho
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E3A8A" } // Azul executivo
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 28;

    // Linhas padrão estruturadas
    const defaultActions = [
      { id: "ACT-01", action: "Validação da Proposta de Valor com 25 Clientes", category: "Validação", responsible: "Founder / Head Produto", deadline: "Mês 1", indicator: "25 entrevistas gravadas", priority: "Alta", status: "Em Andamento" },
      { id: "ACT-02", action: "Desenvolvimento do Protótipo Funcional (MVP)", category: "Produto / Tech", responsible: "CTO / Dev Lead", deadline: "Mês 2", indicator: "Deploy em staging", priority: "Alta", status: "Planejado" },
      { id: "ACT-03", action: "Formalização Jurídica e Contrato de Sócios (Vesting)", category: "Jurídico", responsible: "Assessoria Jurídica", deadline: "Mês 2", indicator: "Contrato assinado", priority: "Média", status: "Planejado" },
      { id: "ACT-04", action: "Lançamento da Landing Page de Pré-Inscrição", category: "Marketing", responsible: "Growth Lead", deadline: "Mês 2", indicator: "500 leads qualificados", priority: "Média", status: "Planejado" },
      { id: "ACT-05", action: "Estruturação das Metas e OKRs do Trimestre", category: "Estratégia", responsible: "Diretoria", deadline: "Mês 3", indicator: "Quadro de metas aprovado", priority: "Alta", status: "Planejado" },
      { id: "ACT-06", action: "Ensaio e Gravação do Pitch de 5 Minutos", category: "Captação", responsible: "CEO", deadline: "Mês 3", indicator: "Pitch aprovado por mentores", priority: "Média", status: "Planejado" }
    ];

    defaultActions.forEach(act => {
      const row = sheet.addRow(act);
      row.alignment = { vertical: "middle" };
      row.height = 22;
    });

    await workbook.xlsx.writeFile(outputPath);
  }

  private markdownToParagraphs(
    markdown: string,
    docTitle: string,
    startupName: string,
    includeHeaderTitle = true
  ): Paragraph[] {
    const paragraphs: Paragraph[] = [];
    if (includeHeaderTitle) {
      paragraphs.push(
        new Paragraph({
          text: `${docTitle} — ${startupName}`,
          heading: HeadingLevel.TITLE,
          spacing: { after: 300 }
        })
      );
    }

    const lines = markdown.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith("# ")) {
        if (!includeHeaderTitle) {
          paragraphs.push(
            new Paragraph({
              text: trimmed.replace(/^#\s*/, ""),
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 }
            })
          );
        }
      } else if (trimmed.startsWith("## ")) {
        paragraphs.push(
          new Paragraph({
            text: trimmed.replace(/^##\s*/, ""),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          })
        );
      } else if (trimmed.startsWith("### ")) {
        paragraphs.push(
          new Paragraph({
            text: trimmed.replace(/^###\s*/, ""),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 80 }
          })
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: `• ${trimmed.replace(/^[-*]\s*/, "")}` })],
            spacing: { after: 60 }
          })
        );
      } else if (trimmed.startsWith("> ")) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: trimmed.replace(/^>\s*/, ""), italics: true, color: "4B5563" })],
            spacing: { before: 80, after: 80 }
          })
        );
      } else {
        paragraphs.push(
          new Paragraph({
            text: trimmed,
            spacing: { after: 100 }
          })
        );
      }
    }

    return paragraphs;
  }
}
