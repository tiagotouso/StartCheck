import * as fs from "node:fs";
import * as path from "node:path";

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

export class TemplateEngine {
  private templatesDir: string;

  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || path.resolve(__dirname, "../../templates");
  }

  public getTemplatesDir(): string {
    return this.templatesDir;
  }

  public listTemplates(): TemplateDescriptor[] {
    if (!fs.existsSync(this.templatesDir)) {
      return [];
    }

    const files = fs.readdirSync(this.templatesDir).filter(f => f.endsWith(".md"));
    return files.map(filename => {
      const match = filename.match(/^(\d{3})\s*(.*?)\.md$/i);
      const id = match ? match[1] : filename.replace(".md", "");
      const rawName = match ? match[2] : filename.replace(".md", "");
      
      const num = parseInt(id, 10);
      let group: TemplateGroup = "strategy";
      if (num <= 2) group = "idea";
      else if (num <= 5) group = "validation";
      else if (num <= 10) group = "strategy";
      else if (num <= 12) group = "execution";
      else group = "pitch";

      return {
        id,
        name: rawName,
        filename,
        group,
        title: rawName.replace(/_/g, " ")
      };
    }).sort((a, b) => a.id.localeCompare(b.id));
  }

  public getTemplate(id: string): { descriptor: TemplateDescriptor; content: string } | null {
    const templates = this.listTemplates();
    const descriptor = templates.find(t => t.id === id);
    if (!descriptor) return null;

    const fullPath = path.join(this.templatesDir, descriptor.filename);
    const content = fs.readFileSync(fullPath, "utf-8");
    return { descriptor, content };
  }

  public getTemplatesByGroup(group: TemplateGroup): TemplateDescriptor[] {
    return this.listTemplates().filter(t => t.group === group);
  }

  public initStartupDir(basePath: string, startupName: string, description: string): string {
    const sanitizedName = startupName.replace(/[<>:"/\\|?*]/g, "_").trim();
    const startupDir = path.resolve(basePath, sanitizedName);

    if (!fs.existsSync(startupDir)) {
      fs.mkdirSync(startupDir, { recursive: true });
    }

    const configPath = path.join(startupDir, "startup.config.json");
    if (!fs.existsSync(configPath)) {
      const initialConfig: StartupConfig = {
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

  public getStartupConfig(startupDir: string): StartupConfig | null {
    const configPath = path.join(startupDir, "startup.config.json");
    if (!fs.existsSync(configPath)) return null;
    try {
      const raw = fs.readFileSync(configPath, "utf-8");
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public updateStartupConfig(startupDir: string, config: StartupConfig): void {
    const configPath = path.join(startupDir, "startup.config.json");
    config.updatedAt = new Date().toISOString();
    this.saveAtomicJson(configPath, config);
  }

  public saveDocument(startupDir: string, filename: string, content: string): string {
    const targetFile = path.join(startupDir, filename);
    const tempFile = path.join(startupDir, `${filename}.tmp.${Date.now()}`);

    fs.writeFileSync(tempFile, content, "utf-8");
    fs.renameSync(tempFile, targetFile);

    return targetFile;
  }

  public readDocument(startupDir: string, filename: string): string | null {
    const targetFile = path.join(startupDir, filename);
    if (!fs.existsSync(targetFile)) return null;
    return fs.readFileSync(targetFile, "utf-8");
  }

  private saveAtomicJson(filePath: string, data: any): void {
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, filePath);
  }
}
