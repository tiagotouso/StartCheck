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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateEngine = void 0;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
class TemplateEngine {
    templatesDir;
    constructor(templatesDir) {
        this.templatesDir = templatesDir || path.resolve(__dirname, "../../templates");
    }
    getTemplatesDir() {
        return this.templatesDir;
    }
    listTemplates() {
        if (!fs.existsSync(this.templatesDir)) {
            return [];
        }
        const files = fs.readdirSync(this.templatesDir).filter(f => f.endsWith(".md"));
        return files.map(filename => {
            const match = filename.match(/^(\d{3})\s*(.*?)\.md$/i);
            const id = match ? match[1] : filename.replace(".md", "");
            const rawName = match ? match[2] : filename.replace(".md", "");
            const num = parseInt(id, 10);
            let group = "strategy";
            if (num <= 2)
                group = "idea";
            else if (num <= 5)
                group = "validation";
            else if (num <= 10)
                group = "strategy";
            else if (num <= 12)
                group = "execution";
            else
                group = "pitch";
            return {
                id,
                name: rawName,
                filename,
                group,
                title: rawName.replace(/_/g, " ")
            };
        }).sort((a, b) => a.id.localeCompare(b.id));
    }
    getTemplate(id) {
        const templates = this.listTemplates();
        const descriptor = templates.find(t => t.id === id);
        if (!descriptor)
            return null;
        const fullPath = path.join(this.templatesDir, descriptor.filename);
        const content = fs.readFileSync(fullPath, "utf-8");
        return { descriptor, content };
    }
    getTemplatesByGroup(group) {
        return this.listTemplates().filter(t => t.group === group);
    }
    initStartupDir(basePath, startupName, description) {
        const sanitizedName = startupName.replace(/[<>:"/\\|?*]/g, "_").trim();
        const startupDir = path.resolve(basePath, sanitizedName);
        if (!fs.existsSync(startupDir)) {
            fs.mkdirSync(startupDir, { recursive: true });
        }
        const configPath = path.join(startupDir, "startup.config.json");
        if (!fs.existsSync(configPath)) {
            const initialConfig = {
                startupName,
                description,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                documents: {}
            };
            this.saveAtomicJson(configPath, initialConfig);
        }
        return startupDir;
    }
    getStartupConfig(startupDir) {
        const configPath = path.join(startupDir, "startup.config.json");
        if (!fs.existsSync(configPath))
            return null;
        try {
            const raw = fs.readFileSync(configPath, "utf-8");
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    updateStartupConfig(startupDir, config) {
        const configPath = path.join(startupDir, "startup.config.json");
        config.updatedAt = new Date().toISOString();
        this.saveAtomicJson(configPath, config);
    }
    saveDocument(startupDir, filename, content) {
        const targetFile = path.join(startupDir, filename);
        const tempFile = path.join(startupDir, `${filename}.tmp.${Date.now()}`);
        fs.writeFileSync(tempFile, content, "utf-8");
        fs.renameSync(tempFile, targetFile);
        return targetFile;
    }
    readDocument(startupDir, filename) {
        const targetFile = path.join(startupDir, filename);
        if (!fs.existsSync(targetFile))
            return null;
        return fs.readFileSync(targetFile, "utf-8");
    }
    saveAtomicJson(filePath, data) {
        const tempPath = `${filePath}.tmp.${Date.now()}`;
        fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
        fs.renameSync(tempPath, filePath);
    }
}
exports.TemplateEngine = TemplateEngine;
