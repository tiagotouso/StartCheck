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
exports.runCli = runCli;
const path = __importStar(require("node:path"));
const p = __importStar(require("@clack/prompts"));
const picocolors_1 = __importDefault(require("picocolors"));
const template_engine_1 = require("../modules/template-engine");
const harness_orchestrator_1 = require("../modules/harness-orchestrator");
const traffic_light_evaluator_1 = require("../modules/traffic-light-evaluator");
const extension_factory_1 = require("../modules/extension-factory");
const export_service_1 = require("../modules/export-service");
async function runCli() {
    console.clear();
    p.intro(picocolors_1.default.bgCyan(picocolors_1.default.black(" StartCheck — Modelador Inteligente de Startups ")));
    const baseDir = process.cwd();
    const engine = new template_engine_1.TemplateEngine();
    const evaluator = new traffic_light_evaluator_1.TrafficLightEvaluator();
    const orchestrator = new harness_orchestrator_1.HarnessOrchestrator(engine, evaluator);
    const factory = new extension_factory_1.ExtensionFactory(engine);
    const exporter = new export_service_1.ExportService(engine);
    // 1. Identificar ou inicializar a Startup
    let startupDir = "";
    const existingConfig = engine.getStartupConfig(baseDir);
    if (existingConfig) {
        p.note(`Startup ativa detectada: ${picocolors_1.default.bold(existingConfig.startupName)}`, "Contexto");
        startupDir = baseDir;
    }
    else {
        const startupName = await p.text({
            message: "Qual o nome da sua Startup?",
            placeholder: "Ex: NeuralFlow",
            validate: (value) => {
                if (!value.trim())
                    return "O nome da startup não pode ser vazio.";
            }
        });
        if (p.isCancel(startupName)) {
            p.cancel("Operação cancelada pelo usuário.");
            process.exit(0);
        }
        const description = await p.text({
            message: "Descreva a proposta da startup em uma ou duas frases:",
            placeholder: "Ex: Plataforma de otimização de frotas com IA preditiva."
        });
        if (p.isCancel(description)) {
            p.cancel("Operação cancelada pelo usuário.");
            process.exit(0);
        }
        startupDir = engine.initStartupDir(baseDir, String(startupName), String(description || ""));
        p.log.success(`Pasta criada com sucesso: ${picocolors_1.default.green(path.basename(startupDir))}`);
    }
    // Loop de Menus Interativos
    while (true) {
        const action = await p.select({
            message: "O que você deseja fazer agora?",
            options: [
                { value: "create", label: "📄 Criar Documentos", hint: "um a um, grupo ou todos" },
                { value: "review", label: "🔍 Revisar Documentos", hint: "inspecionar semáforo e justificar" },
                { value: "extend", label: "🧩 Adicionar Novo Template", hint: "cria agente e skill dinâmicos" },
                { value: "export", label: "📦 Exportar Documentos", hint: "DOCX individual, Consolidado e XLSX" },
                { value: "exit", label: "🚪 Sair", hint: "encerrar sessão" }
            ]
        });
        if (p.isCancel(action) || action === "exit") {
            p.outro(picocolors_1.default.cyan("Sessão finalizada. Bons negócios com sua Startup!"));
            process.exit(0);
        }
        if (action === "create") {
            await handleCreateFlow(startupDir, orchestrator, engine);
        }
        else if (action === "review") {
            await handleReviewFlow(startupDir, orchestrator, engine);
        }
        else if (action === "extend") {
            await handleExtendFlow(factory);
        }
        else if (action === "export") {
            await handleExportFlow(startupDir, exporter);
        }
    }
}
async function handleCreateFlow(startupDir, orchestrator, engine) {
    const mode = await p.select({
        message: "Como deseja gerar os documentos?",
        options: [
            { value: "all", label: "Todos os Documentos (001 a 015)", hint: "Recomendado para modelagem completa" },
            { value: "group", label: "Por Grupo Temático", hint: "Idea, Validation, Strategy, Execution ou Pitch" },
            { value: "single", label: "Um a Um (Documento Específico)" }
        ]
    });
    if (p.isCancel(mode))
        return;
    const s = p.spinner();
    if (mode === "all") {
        s.start("Gerando e avaliando todos os 15 documentos com agentes especialistas...");
        const results = orchestrator.generateAll(startupDir, (curr, tot, name) => {
            s.message(`[${curr}/${tot}] Processando ${name}...`);
        });
        s.stop("Todos os 15 documentos foram gerados e salvos com sucesso!");
        printSummaryTable(results);
    }
    else if (mode === "group") {
        const group = await p.select({
            message: "Selecione o grupo de documentos:",
            options: [
                { value: "idea", label: "Idea (001 Registro, 002 Problema x Solução)" },
                { value: "validation", label: "Validation (003 Hipóteses, 004 Aprendizados, 005 Dores/Ganhos)" },
                { value: "strategy", label: "Strategy (006 Personas, 007 Riscos, 008 MVP, 009 Canvas, 010 ESG)" },
                { value: "execution", label: "Execution (011 Metas, 012 Plano de Ação)" },
                { value: "pitch", label: "Pitch (013 Pitch 60s, 014 Pitch 5m, 015 Pitch 15m)" }
            ]
        });
        if (p.isCancel(group))
            return;
        s.start(`Gerando grupo '${group}'...`);
        const results = orchestrator.generateGroup(startupDir, group, (curr, tot, name) => {
            s.message(`[${curr}/${tot}] Processando ${name}...`);
        });
        s.stop(`Grupo '${group}' concluído!`);
        printSummaryTable(results);
    }
    else if (mode === "single") {
        const templates = engine.listTemplates();
        const docId = await p.select({
            message: "Escolha o documento a ser gerado:",
            options: templates.map(t => ({
                value: t.id,
                label: `${t.id} ${t.name}`,
                hint: t.group
            }))
        });
        if (p.isCancel(docId))
            return;
        s.start(`Gerando documento ${docId}...`);
        const result = orchestrator.generateDocument(startupDir, String(docId));
        s.stop(`Documento ${docId} gerado!`);
        if (result)
            printSummaryTable([result]);
    }
}
async function handleReviewFlow(startupDir, orchestrator, engine) {
    const templates = engine.listTemplates();
    const config = engine.getStartupConfig(startupDir);
    const docId = await p.select({
        message: "Qual documento você deseja inspecionar / revisar?",
        options: templates.map(t => {
            const status = config?.documents[t.id];
            const light = status ? (status.trafficLight === "green" ? "🟢" : status.trafficLight === "yellow" ? "🟡" : "🔴") : "⚪";
            return {
                value: t.id,
                label: `${light} ${t.id} ${t.name}`
            };
        })
    });
    if (p.isCancel(docId))
        return;
    const currentResult = orchestrator.reviewDocument(startupDir, String(docId));
    if (!currentResult) {
        p.log.error("Não foi possível carregar o documento selecionado.");
        return;
    }
    p.note(`Status Atual: ${traffic_light_evaluator_1.TrafficLightEvaluator.getEmoji(currentResult.evaluation.overall)} ${traffic_light_evaluator_1.TrafficLightEvaluator.getColorLabel(currentResult.evaluation.overall)}\n${currentResult.evaluation.summary}`, `Diagnóstico do ${currentResult.templateName}`);
    const wantJustify = await p.confirm({
        message: "Deseja fornecer uma justificativa ou novos dados para que o agente faça alterações?"
    });
    if (p.isCancel(wantJustify) || !wantJustify)
        return;
    const justification = await p.text({
        message: "Digite sua justificativa, novos números ou fatos de mercado:",
        placeholder: "Ex: Já fechamos 3 cartas de intenção (LOIs) com hospitais locais."
    });
    if (p.isCancel(justification) || !justification)
        return;
    const s = p.spinner();
    s.start("Reavaliando documento e aplicando auto-correção com a justificativa...");
    const updatedResult = orchestrator.reviewDocument(startupDir, String(docId), String(justification));
    s.stop("Documento reprocessado!");
    if (updatedResult) {
        p.log.success(`Novo Status: ${traffic_light_evaluator_1.TrafficLightEvaluator.getEmoji(updatedResult.evaluation.overall)} ${traffic_light_evaluator_1.TrafficLightEvaluator.getColorLabel(updatedResult.evaluation.overall)}`);
    }
}
async function handleExtendFlow(factory) {
    const filePath = await p.text({
        message: "Informe o caminho do novo arquivo de template (.md):",
        placeholder: "Ex: ./novos_modelos/016 Matriz_Captacao.md"
    });
    if (p.isCancel(filePath) || !filePath)
        return;
    const s = p.spinner();
    s.start("Compilando novo template e sintetizando agente/skill especialista...");
    const res = factory.registerNewTemplate(String(filePath));
    s.stop("Fábrica de extensão concluída!");
    if (res.success) {
        p.log.success(res.message);
        p.note(`Agente: ${res.agentDefinition.agentName}\nSkill: ${res.agentDefinition.skillName}\nPapel: ${res.agentDefinition.agentRole}`, "Extensão Criada");
    }
    else {
        p.log.error(res.message);
    }
}
async function handleExportFlow(startupDir, exporter) {
    const s = p.spinner();
    s.start("Exportando DOCX individuais, DOCX consolidado (sem pitches), DOCX de pitches e XLSX do plano de ação...");
    try {
        const report = await exporter.exportAll(startupDir);
        s.stop("Exportação multiformato concluída com sucesso!");
        p.note(`📁 Pasta de Saída: ${path.join(startupDir, "exports")}\n\n` +
            `📄 DOCX Individuais: ${report.individualDocx.length} arquivos\n` +
            `📑 Consolidado Geral: ${path.basename(report.consolidatedDocx)} (SEM pitches)\n` +
            `🎤 Pitches Isolados: ${report.pitchesDocx.length} arquivos DOCX\n` +
            `📊 Plano de Ação: ${path.basename(report.actionPlanXlsx)} (Planilha XLSX)`, "Artefatos Executivos Gerados");
    }
    catch (err) {
        s.stop("Falha na exportação.");
        p.log.error(`Erro: ${err?.message || err}`);
    }
}
function printSummaryTable(results) {
    const lines = results.map(r => {
        const emoji = traffic_light_evaluator_1.TrafficLightEvaluator.getEmoji(r.evaluation.overall);
        return `${emoji} [${r.templateId}] ${r.templateName}`;
    });
    p.note(lines.join("\n"), "Resultado das Avaliações");
}
