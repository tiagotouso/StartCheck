import { describe, it, expect } from "vitest";
import { TemplateEngine } from "../src/modules/template-engine";
import * as path from "node:path";
import * as fs from "node:fs";

describe("TemplateEngine", () => {
  const templatesDir = path.resolve(__dirname, "../templates");
  const engine = new TemplateEngine(templatesDir);

  it("deve carregar com sucesso os 15 templates essenciais", () => {
    const list = engine.listTemplates();
    expect(list.length).toBeGreaterThanOrEqual(15);
    
    const ids = list.map(t => t.id);
    expect(ids).toContain("001");
    expect(ids).toContain("009");
    expect(ids).toContain("012");
    expect(ids).toContain("015");
  });

  it("deve categorizar templates por grupos temáticos corretamente", () => {
    const ideaGroup = engine.getTemplatesByGroup("idea");
    expect(ideaGroup.length).toBe(2);

    const validationGroup = engine.getTemplatesByGroup("validation");
    expect(validationGroup.length).toBe(3);

    const strategyGroup = engine.getTemplatesByGroup("strategy");
    expect(strategyGroup.length).toBe(5);

    const executionGroup = engine.getTemplatesByGroup("execution");
    expect(executionGroup.length).toBe(2);

    const pitchGroup = engine.getTemplatesByGroup("pitch");
    expect(pitchGroup.length).toBe(3);
  });

  it("deve obter o conteúdo completo de um template pelo ID", () => {
    const res = engine.getTemplate("001");
    expect(res).not.toBeNull();
    expect(res?.descriptor.id).toBe("001");
    expect(res?.content).toContain("# Registro da Startup");
  });
});
