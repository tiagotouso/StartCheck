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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const docx_1 = require("docx");
const exceljs_1 = __importDefault(require("exceljs"));
class ExportService {
    engine;
    constructor(engine) {
        this.engine = engine;
    }
    async exportAll(startupDir) {
        const exportsDir = path.join(startupDir, "exports");
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true });
        }
        const templates = this.engine.listTemplates();
        const individualDocx = [];
        const pitchesDocx = [];
        const startupConfig = this.engine.getStartupConfig(startupDir);
        const startupName = startupConfig?.startupName || "Startup";
        // 1. Exportar DOCX individuais
        for (const t of templates) {
            const content = this.engine.readDocument(startupDir, t.filename);
            if (!content)
                continue;
            const docxPath = path.join(exportsDir, `${t.id}_${t.name}.docx`);
            await this.generateDocxFromMarkdown(content, t.title, docxPath, startupName);
            if (t.group === "pitch") {
                pitchesDocx.push(docxPath);
            }
            else {
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
    async generateDocxFromMarkdown(markdown, title, outputPath, startupName) {
        const paragraphs = this.markdownToParagraphs(markdown, title, startupName);
        const doc = new docx_1.Document({
            sections: [{
                    properties: {},
                    children: paragraphs
                }]
        });
        const buffer = await docx_1.Packer.toBuffer(doc);
        fs.writeFileSync(outputPath, buffer);
    }
    async generateConsolidatedDocx(startupDir, templates, outputPath, startupName) {
        const children = [
            new docx_1.Paragraph({
                text: `Dossiê Consolidado de Modelagem: ${startupName}`,
                heading: docx_1.HeadingLevel.TITLE,
                spacing: { after: 300 }
            }),
            new docx_1.Paragraph({
                text: `Documento executivo compilado em ${new Date().toLocaleDateString("pt-BR")}. Contém a modelagem estratégica de 001 a 012 (excluindo pitches).`,
                spacing: { after: 500 }
            })
        ];
        for (const t of templates) {
            const content = this.engine.readDocument(startupDir, t.filename);
            if (!content)
                continue;
            children.push(new docx_1.Paragraph({
                text: `\n${t.id} — ${t.title}`,
                heading: docx_1.HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
            }));
            const sectionParas = this.markdownToParagraphs(content, t.title, startupName, false);
            children.push(...sectionParas);
        }
        const doc = new docx_1.Document({
            sections: [{
                    properties: {},
                    children
                }]
        });
        const buffer = await docx_1.Packer.toBuffer(doc);
        fs.writeFileSync(outputPath, buffer);
    }
    async generateActionPlanXlsx(startupDir, outputPath, startupName) {
        const workbook = new exceljs_1.default.Workbook();
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
    markdownToParagraphs(markdown, docTitle, startupName, includeHeaderTitle = true) {
        const paragraphs = [];
        if (includeHeaderTitle) {
            paragraphs.push(new docx_1.Paragraph({
                text: `${docTitle} — ${startupName}`,
                heading: docx_1.HeadingLevel.TITLE,
                spacing: { after: 300 }
            }));
        }
        const lines = markdown.split("\n");
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed)
                continue;
            if (trimmed.startsWith("# ")) {
                if (!includeHeaderTitle) {
                    paragraphs.push(new docx_1.Paragraph({
                        text: trimmed.replace(/^#\s*/, ""),
                        heading: docx_1.HeadingLevel.HEADING_1,
                        spacing: { before: 200, after: 100 }
                    }));
                }
            }
            else if (trimmed.startsWith("## ")) {
                paragraphs.push(new docx_1.Paragraph({
                    text: trimmed.replace(/^##\s*/, ""),
                    heading: docx_1.HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }));
            }
            else if (trimmed.startsWith("### ")) {
                paragraphs.push(new docx_1.Paragraph({
                    text: trimmed.replace(/^###\s*/, ""),
                    heading: docx_1.HeadingLevel.HEADING_3,
                    spacing: { before: 150, after: 80 }
                }));
            }
            else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                paragraphs.push(new docx_1.Paragraph({
                    children: [new docx_1.TextRun({ text: `• ${trimmed.replace(/^[-*]\s*/, "")}` })],
                    spacing: { after: 60 }
                }));
            }
            else if (trimmed.startsWith("> ")) {
                paragraphs.push(new docx_1.Paragraph({
                    children: [new docx_1.TextRun({ text: trimmed.replace(/^>\s*/, ""), italics: true, color: "4B5563" })],
                    spacing: { before: 80, after: 80 }
                }));
            }
            else {
                paragraphs.push(new docx_1.Paragraph({
                    text: trimmed,
                    spacing: { after: 100 }
                }));
            }
        }
        return paragraphs;
    }
}
exports.ExportService = ExportService;
