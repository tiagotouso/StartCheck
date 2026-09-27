"""
Script de Compilação do Dossiê Executivo da Startup (StartCheck)
Gera os arquivos finais .docx e .pdf com capa, sumário e quebras de página por documento.
"""

import os
import sys
import re
from pathlib import Path

# DOCX
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

# REPORTLAB (PDF)
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# ORDEM OFICIAL DOS 14 DOCUMENTOS (Pitches não entram no dossiê final)
ORDERED_DOCUMENTS = [
    ("Marco 01: Registro e Fundação da Startup", "Registro_Startup.md"),
    ("Marco 02: Diagnóstico de Problema x Solução", "Problema_x_Solucao.md"),
    ("Marco 03: Matriz de Validação de Hipóteses Críticas", "Validacao_de_Hipoteses.md"),
    ("Marco 04: Matriz de Aprendizados e Ações Decisórias", "Matriz_de_Aprendizados_e_Acoes.md"),
    ("Marco 05: Mapeamento de Dores, Ganhos e Tarefas", "Mapeamento_Dores_Ganhos_e_Trabalhos.md"),
    ("Marco 06: Diagnóstico e Perfil da Persona", "Mapeamento_de_Personas.md"),
    ("Marco 07: Dimensionamento de Mercado (TAM, SAM e SOM)", "Analise_TAM_SAM_SOM.md"),
    ("Marco 08: Mapeamento e Mitigação de Riscos", "Mapeamento_de_Riscos.md"),
    ("Marco 09: Plano de Prototipagem e Testes", "Plano_de_Prototipacao.md"),
    ("Marco 10: Business Model Canvas e Sustentabilidade", "Business_Model_Canvas.md"),
    ("Marco 11: Mapeamento do Ecossistema Operacional", "Mapeamento_do_Ecossistema_Operacional.md"),
    ("Marco 12: Enquadramento e Práticas ESG", "Quadro_ESG.md"),
    ("Marco 13: Metas da Startup e North Star Metric", "Metas_da_Startup.md"),
    ("Marco 14: Plano de Ação Tático de Validação (5W2H)", "Plano_de_Acao.md"),
]

def clean_markdown_text(text):
    """Remove marcadores extras de markdown preservando o texto limpo."""
    if not text:
        return ""
    # Remove tags HTML se houver
    text = re.sub(r'<[^>]+>', ' ', text)
    return text.strip()

def parse_markdown_blocks(content):
    """Converte markdown em blocos estruturados: headings, paragraphs, lists, blockquotes, tables."""
    lines = content.split('\n')
    blocks = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Ignorar frontmatter
        if stripped == '---' and i == 0:
            i += 1
            while i < len(lines) and lines[i].strip() != '---':
                i += 1
            i += 1
            continue

        if not stripped:
            i += 1
            continue

        # Divisor horizontal
        if stripped in ['---', '***', '___']:
            blocks.append(('hr', ''))
            i += 1
            continue

        # Headings
        if stripped.startswith('# '):
            blocks.append(('h1', stripped[2:].strip()))
            i += 1
            continue
        elif stripped.startswith('## '):
            blocks.append(('h2', stripped[3:].strip()))
            i += 1
            continue
        elif stripped.startswith('### '):
            blocks.append(('h3', stripped[4:].strip()))
            i += 1
            continue
        elif stripped.startswith('#### '):
            blocks.append(('h4', stripped[5:].strip()))
            i += 1
            continue

        # Blockquote
        if stripped.startswith('> '):
            blocks.append(('quote', stripped[2:].strip()))
            i += 1
            continue

        # Tabela
        if stripped.startswith('|') and stripped.endswith('|'):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith('|') and lines[i].strip().endswith('|'):
                table_lines.append(lines[i].strip())
                i += 1
            # Parse table
            if len(table_lines) >= 2:
                rows = []
                for idx, tline in enumerate(table_lines):
                    # Ignorar linha divisória de cabeçalho (| :--- | :--- |)
                    if idx == 1 and re.match(r'^\|[\s\:\-\|]+$', tline):
                        continue
                    cells = [c.strip() for c in tline.strip('|').split('|')]
                    rows.append(cells)
                if rows:
                    blocks.append(('table', rows))
            continue

        # Lista
        if stripped.startswith('- ') or stripped.startswith('* ') or stripped.startswith('• '):
            blocks.append(('bullet', stripped[2:].strip()))
            i += 1
            continue

        # Parágrafo normal
        para_lines = [stripped]
        i += 1
        while i < len(lines):
            next_line = lines[i].strip()
            if not next_line or next_line.startswith('#') or next_line.startswith('|') or next_line.startswith('- ') or next_line.startswith('> ') or next_line in ['---', '***']:
                break
            para_lines.append(next_line)
            i += 1
        blocks.append(('p', ' '.join(para_lines)))

    return blocks

def generate_docx(startup_name, startup_dir, output_file, doc_data_list):
    """Gera o arquivo DOCX executivo profissional com Capa, Sumário e Quebras de Página."""
    doc = docx.Document()

    # Configuração de Margens (2,5 cm)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # 1. CAPA PROFISSIONAL
    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_before = Pt(80)
    run_pre = p_pre.add_run("STARTCHECK • DOSSIÊ EXECUTIVO OFICIAL")
    run_pre.font.size = Pt(11)
    run_pre.font.bold = True
    run_pre.font.color.rgb = RGBColor(30, 64, 175) # Azul institucional

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(10)
    p_title.paragraph_format.space_after = Pt(15)
    run_title = p_title.add_run(startup_name)
    run_title.font.size = Pt(36)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(15, 23, 42) # Grafite executivo

    # Identificar lema oficial se disponível
    slogan_text = "Compilação Estratégica dos 14 Marcos de Modelagem e Validação da Startup"
    for _, fname, exists, blocks in doc_data_list:
        if exists:
            for _, bcontent in blocks:
                if "Liberdade não é apenas ir e vir" in bcontent:
                    slogan_text = "“Liberdade não é apenas ir e vir, é poder ler e escrever o seu próprio caminho”"
                    break

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(200)
    run_sub = p_sub.add_run(slogan_text)
    run_sub.font.size = Pt(13)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(71, 85, 105)

    p_meta = doc.add_paragraph()
    run_meta1 = p_meta.add_run("Governança e Metodologia: ")
    run_meta1.font.bold = True
    run_meta1.font.size = Pt(10)
    p_meta.add_run("StartCheck Ecosystem\n")
    run_meta2 = p_meta.add_run("Status: ")
    run_meta2.font.bold = True
    run_meta2.font.size = Pt(10)
    p_meta.add_run("🟢 Dossiê Validado e Homologado pelo CEO\n")
    run_meta3 = p_meta.add_run("Versão: ")
    run_meta3.font.bold = True
    run_meta3.font.size = Pt(10)
    p_meta.add_run("1.0 (Oficial)")

    # Quebra de página após a Capa
    doc.add_page_break()

    # 2. SUMÁRIO EXECUTIVO
    h_sum = doc.add_heading("Sumário Executivo dos Documentos", level=1)
    h_sum.paragraph_format.space_before = Pt(20)
    h_sum.paragraph_format.space_after = Pt(15)
    
    p_sum_desc = doc.add_paragraph("Este dossiê consolida os 14 marcos de validação produzidos pela equipe de especialistas StartCheck (pitches preservados como arquivos independentes):")
    p_sum_desc.paragraph_format.space_after = Pt(15)

    table_sum = doc.add_table(rows=1, cols=3)
    table_sum.style = 'Light Shading Accent 1' if 'Light Shading Accent 1' in [s.name for s in doc.styles] else 'Table Grid'
    hdr_cells = table_sum.rows[0].cells
    hdr_cells[0].text = "Marco"
    hdr_cells[1].text = "Documento Oficial"
    hdr_cells[2].text = "Status da Validação"

    for idx, (title, filename, exists, blocks) in enumerate(doc_data_list, 1):
        row_cells = table_sum.add_row().cells
        row_cells[0].text = f"Marco {idx:02d}"
        row_cells[1].text = filename.replace('.md', '').replace('_', ' ')
        row_cells[2].text = "🟢 Homologado" if exists else "🟡 Pendente"

    # Quebra de página após o Sumário
    doc.add_page_break()

    # 3. COMPILAÇÃO DOS 14 DOCUMENTOS
    for idx, (title, filename, exists, blocks) in enumerate(doc_data_list):
        if idx > 0:
            doc.add_page_break()

        # Cabeçalho do Documento
        p_marco = doc.add_paragraph()
        p_marco.paragraph_format.space_before = Pt(10)
        p_marco.paragraph_format.space_after = Pt(5)
        run_m = p_marco.add_run(f"STARTCHECK • {title.upper()}")
        run_m.font.size = Pt(9)
        run_m.font.bold = True
        run_m.font.color.rgb = RGBColor(30, 64, 175)

        if not exists:
            h_doc = doc.add_heading(filename.replace('.md', '').replace('_', ' '), level=1)
            p_missing = doc.add_paragraph("🟡 Documento em fase de elaboração ou não localizado na pasta da startup.")
            p_missing.paragraph_format.space_after = Pt(20)
            continue

        for btype, bcontent in blocks:
            if btype == 'h1':
                h = doc.add_heading(bcontent, level=1)
                h.paragraph_format.space_before = Pt(12)
                h.paragraph_format.space_after = Pt(6)
            elif btype == 'h2':
                h = doc.add_heading(bcontent, level=2)
                h.paragraph_format.space_before = Pt(10)
                h.paragraph_format.space_after = Pt(4)
            elif btype == 'h3':
                h = doc.add_heading(bcontent, level=3)
                h.paragraph_format.space_before = Pt(8)
                h.paragraph_format.space_after = Pt(3)
            elif btype == 'h4':
                h = doc.add_heading(bcontent, level=4)
                h.paragraph_format.space_before = Pt(6)
                h.paragraph_format.space_after = Pt(2)
            elif btype == 'quote':
                p = doc.add_paragraph(bcontent)
                p.paragraph_format.left_indent = Inches(0.4)
                p.paragraph_format.space_before = Pt(4)
                p.paragraph_format.space_after = Pt(8)
                for run in p.runs:
                    run.font.italic = True
                    run.font.color.rgb = RGBColor(71, 85, 105)
            elif btype == 'bullet':
                p = doc.add_paragraph(style='List Bullet')
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(4)
                # Formatar negritos básicos **texto**
                parts = re.split(r'(\*\*.*?\*\*)', bcontent)
                for part in parts:
                    if part.startswith('**') and part.endswith('**'):
                        r = p.add_run(part[2:-2])
                        r.bold = True
                    else:
                        p.add_run(part)
            elif btype == 'p':
                p = doc.add_paragraph()
                p.paragraph_format.space_before = Pt(3)
                p.paragraph_format.space_after = Pt(6)
                parts = re.split(r'(\*\*.*?\*\*)', bcontent)
                for part in parts:
                    if part.startswith('**') and part.endswith('**'):
                        r = p.add_run(part[2:-2])
                        r.bold = True
                    else:
                        p.add_run(part)
            elif btype == 'table':
                # bcontent é lista de listas de células
                rows = bcontent
                if not rows:
                    continue
                num_cols = max(len(r) for r in rows)
                tbl = doc.add_table(rows=len(rows), cols=num_cols)
                tbl.style = 'Table Grid'
                tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                for r_idx, row in enumerate(rows):
                    for c_idx in range(num_cols):
                        cell_text = row[c_idx] if c_idx < len(row) else ""
                        cell = tbl.cell(r_idx, c_idx)
                        cell.text = ""
                        p_cell = cell.paragraphs[0]
                        p_cell.paragraph_format.space_before = Pt(2)
                        p_cell.paragraph_format.space_after = Pt(2)
                        
                        # Formatar cabeçalho
                        if r_idx == 0:
                            r = p_cell.add_run(cell_text.replace('**', ''))
                            r.bold = True
                            # Fundo sombreado para cabeçalho
                            tcPr = cell._element.get_or_add_tcPr()
                            shd = parse_xml(r'<w:shd {} w:fill="E2E8F0"/>'.format(nsdecls('w')))
                            tcPr.append(shd)
                        else:
                            parts = re.split(r'(\*\*.*?\*\*)', cell_text)
                            for part in parts:
                                if part.startswith('**') and part.endswith('**'):
                                    r = p_cell.add_run(part[2:-2])
                                    r.bold = True
                                else:
                                    p_cell.add_run(part)

    doc.save(str(output_file))
    print(f"DOCX gerado com sucesso: {output_file}")


class NumberedCanvas(canvas.Canvas):
    """Adiciona numeração de página profissional X de Y no rodapé do PDF."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        if self._pageNumber == 1:
            return # Sem número na capa
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        # Linha de rodapé
        self.line(54, 45, 595 - 54, 45)
        text_footer = f"StartCheck • Dossiê Executivo da Startup — Página {self._pageNumber} de {page_count}"
        self.drawRightString(595 - 54, 32, text_footer)
        self.drawString(54, 32, "Confidencial • Uso Exclusivo da Startup e Investidores")
        self.restoreState()


def generate_pdf(startup_name, startup_dir, output_file, doc_data_list):
    """Gera o arquivo PDF executivo profissional com Capa, Sumário e Quebras de Página."""
    pdf_doc = SimpleDocTemplate(
        str(output_file),
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Estilos customizados
    style_cover_pre = ParagraphStyle(
        'CoverPre',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=colors.HexColor('#1d4ed8'),
        spaceAfter=15,
        textTransform='uppercase'
    )

    style_cover_title = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=34,
        leading=40,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=15
    )

    style_cover_sub = ParagraphStyle(
        'CoverSub',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=13,
        leading=18,
        textColor=colors.HexColor('#475569'),
        spaceAfter=260
    )

    style_cover_meta = ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=16,
        textColor=colors.HexColor('#334155')
    )

    style_h1 = ParagraphStyle(
        'CustomH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    style_h2 = ParagraphStyle(
        'CustomH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1e3a8a'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    style_h3 = ParagraphStyle(
        'CustomH3',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    style_p = ParagraphStyle(
        'CustomP',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=6
    )

    style_quote = ParagraphStyle(
        'CustomQuote',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#475569'),
        leftIndent=15,
        spaceAfter=8
    )

    style_bullet = ParagraphStyle(
        'CustomBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        leftIndent=15,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=4
    )

    style_header_tag = ParagraphStyle(
        'HeaderTag',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        textColor=colors.HexColor('#1d4ed8'),
        spaceBefore=5,
        spaceAfter=5
    )

    story = []

    # 1. CAPA
    slogan_text = "Compilação Estratégica dos 14 Marcos de Modelagem e Validação da Startup"
    for _, fname, exists, blocks in doc_data_list:
        if exists:
            for _, bcontent in blocks:
                if "Liberdade não é apenas ir e vir" in bcontent:
                    slogan_text = "“Liberdade não é apenas ir e vir, é poder ler e escrever o seu próprio caminho”"
                    break

    story.append(Spacer(1, 40))
    story.append(Paragraph("STARTCHECK • DOSSIÊ EXECUTIVO OFICIAL", style_cover_pre))
    story.append(Paragraph(startup_name, style_cover_title))
    story.append(Paragraph(slogan_text, style_cover_sub))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceBefore=10, spaceAfter=20))
    story.append(Paragraph("<b>Metodologia:</b> StartCheck Ecosystem de Validação e Governança", style_cover_meta))
    story.append(Paragraph("<b>Status Geral:</b> 🟢 Dossiê Homologado pelo CEO", style_cover_meta))
    story.append(Paragraph("<b>Versão:</b> 1.0 (Oficial)", style_cover_meta))
    story.append(PageBreak())

    # 2. SUMÁRIO EXECUTIVO
    story.append(Paragraph("Sumário Executivo dos Documentos", style_h1))
    story.append(Paragraph("Este dossiê consolida os 14 marcos de validação produzidos pela equipe de especialistas StartCheck (pitches preservados como arquivos independentes):", style_p))
    story.append(Spacer(1, 10))

    table_data = [["Marco", "Documento Oficial", "Status"]]
    for idx, (title, filename, exists, blocks) in enumerate(doc_data_list, 1):
        table_data.append([
            f"Marco {idx:02d}",
            filename.replace('.md', '').replace('_', ' '),
            "🟢 Homologado" if exists else "🟡 Pendente"
        ])

    col_widths = [70, 310, 100]
    t_summary = Table(table_data, colWidths=col_widths)
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(t_summary)
    story.append(PageBreak())

    # 3. DOCUMENTOS COMPILADOS COM QUEBRA DE PÁGINA
    for idx, (title, filename, exists, blocks) in enumerate(doc_data_list):
        if idx > 0:
            story.append(PageBreak())

        story.append(Paragraph(f"STARTCHECK • {title.upper()}", style_header_tag))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#93c5fd'), spaceBefore=2, spaceAfter=8))

        if not exists:
            story.append(Paragraph(filename.replace('.md', '').replace('_', ' '), style_h1))
            story.append(Paragraph("🟡 Documento em fase de elaboração ou não localizado na pasta da startup.", style_p))
            continue

        for btype, bcontent in blocks:
            if btype == 'h1':
                story.append(Paragraph(bcontent, style_h1))
            elif btype == 'h2':
                story.append(Paragraph(bcontent, style_h2))
            elif btype == 'h3':
                story.append(Paragraph(bcontent, style_h3))
            elif btype == 'quote':
                story.append(Paragraph(f"<i>“{bcontent}”</i>", style_quote))
            elif btype == 'bullet':
                # Formatar **negrito** para <b>
                formatted = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', bcontent)
                story.append(Paragraph(f"• {formatted}", style_bullet))
            elif btype == 'p':
                formatted = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', bcontent)
                story.append(Paragraph(formatted, style_p))
            elif btype == 'hr':
                story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#e2e8f0'), spaceBefore=6, spaceAfter=6))
            elif btype == 'table':
                rows = bcontent
                if not rows:
                    continue
                num_cols = max(len(r) for r in rows)
                t_data = []
                for r_idx, r in enumerate(rows):
                    row_cells = []
                    for c_idx in range(num_cols):
                        c_text = r[c_idx] if c_idx < len(r) else ""
                        c_fmt = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', c_text)
                        cell_style = ParagraphStyle(
                            f'Cell_{r_idx}_{c_idx}',
                            parent=styles['Normal'],
                            fontName='Helvetica-Bold' if r_idx == 0 else 'Helvetica',
                            fontSize=8,
                            leading=11,
                            textColor=colors.HexColor('#0f172a') if r_idx == 0 else colors.HexColor('#1e293b')
                        )
                        row_cells.append(Paragraph(c_fmt, cell_style))
                    t_data.append(row_cells)

                # Calcular larguras
                total_w = 487
                col_w = total_w / num_cols
                col_ws = [col_w] * num_cols

                t_table = Table(t_data, colWidths=col_ws)
                t_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
                    ('TOPPADDING', (0, 0), (-1, -1), 3),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ]))
                story.append(t_table)
                story.append(Spacer(1, 8))

    pdf_doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF gerado com sucesso: {output_file}")


def main():
    if len(sys.argv) < 2:
        print("Uso: python compile_dossier.py <caminho_da_pasta_da_startup>")
        sys.exit(1)

    startup_dir = Path(sys.argv[1]).resolve()
    if not startup_dir.exists() or not startup_dir.is_dir():
        print(f"Erro: O diretório '{startup_dir}' não existe.")
        sys.exit(1)

    startup_name = startup_dir.name
    print(f"Compilando Dossiê Executivo para a startup: {startup_name}")

    # Carregar os 14 documentos na ordem oficial (sem pitches)
    doc_data_list = []
    for title, filename in ORDERED_DOCUMENTS:
        file_path = startup_dir / filename
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            blocks = parse_markdown_blocks(content)
            doc_data_list.append((title, filename, True, blocks))
        else:
            doc_data_list.append((title, filename, False, []))

    # Arquivos de saída
    output_docx = startup_dir / f"Dossie_Executivo_{startup_name}.docx"
    output_pdf = startup_dir / f"Dossie_Executivo_{startup_name}.pdf"

    # Gerar DOCX
    generate_docx(startup_name, startup_dir, output_docx, doc_data_list)

    # Gerar PDF
    generate_pdf(startup_name, startup_dir, output_pdf, doc_data_list)

    print("Compilação executiva concluída com 100% de sucesso!")

if __name__ == '__main__':
    main()
