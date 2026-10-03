"""Render the editable Markdown proposal as a styled, paginated PDF."""
from pathlib import Path
import re
from html import escape
import pymupdf
from PIL import Image, ImageOps, ImageDraw
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf'
QA = ROOT / 'tmp/pdfs'
OUT.mkdir(parents=True, exist_ok=True)
QA.mkdir(parents=True, exist_ok=True)
styles = getSampleStyleSheet()
green = colors.HexColor('#236641')
styles.add(ParagraphStyle(name='BodyPet', fontName='Helvetica', fontSize=9, leading=12.3, spaceAfter=5))
styles.add(ParagraphStyle(name='TitlePet', fontName='Helvetica-Bold', fontSize=31, leading=35, textColor=green, spaceAfter=7))
styles.add(ParagraphStyle(name='SubPet', fontName='Helvetica', fontSize=14, leading=18, textColor=green, spaceAfter=12))
styles.add(ParagraphStyle(name='HeadPet', fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=green, spaceBefore=10, spaceAfter=6, keepWithNext=True))
styles.add(ParagraphStyle(name='CellPet', fontName='Helvetica', fontSize=8.3, leading=11, spaceAfter=0))
styles.add(ParagraphStyle(name='BulletPet', parent=styles['BodyPet'], leftIndent=10, firstLineIndent=-7, spaceAfter=4))

def inline(s):
    s = escape(s).replace('→', ' &gt; ').replace('–','-').replace('—','-').replace('“','&quot;').replace('”','&quot;').replace('’',"'")
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'`([^`]+)`', r'<font face="Courier" size="8">\1</font>', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<link href="\2" color="#236641"><u>\1</u></link>', s)
    return s

def footer(canvas, doc):
    canvas.saveState()
    w,h = doc.pagesize
    canvas.setStrokeColor(colors.HexColor('#cee2d5'))
    canvas.line(40, h-30, w-40, h-30)
    canvas.setFont('Helvetica',8)
    canvas.setFillColor(green)
    canvas.drawString(40,h-23,'PETCARE  /  PROJECT PROPOSAL')
    canvas.drawString(40,23,'Next.js + MongoDB  |  Course proposal draft')
    canvas.drawRightString(w-40,23,str(doc.page))
    canvas.restoreState()

lines = (ROOT/'docs/PetCare-Project-Proposal.md').read_text().splitlines()
story=[]
i=0
while i<len(lines):
    line=lines[i].strip()
    if not line:
        i+=1
        continue
    if line=='<!-- pagebreak -->':
        story.append(PageBreak())
    elif line.startswith('|'):
        rows=[]
        while i<len(lines) and lines[i].strip().startswith('|'):
            cells=[c.strip() for c in lines[i].strip().strip('|').split('|')]
            if not all(re.fullmatch(r'[-: ]+',c) for c in cells):
                rows.append([Paragraph(inline(c),styles['CellPet']) for c in cells])
            i+=1
        n=len(rows[0]); width=515.28
        ratios={3:[.23,.59,.18],4:[.17,.27,.30,.26],5:[.15,.21,.22,.23,.19]}.get(n,[1/n]*n)
        # Keep narrative columns broad; only numeric marks/hours need a narrow final column.
        header=rows[0][-1].getPlainText()
        if n==3 and header not in ('Marks','Hours'):
            ratios=[.23,.37,.40]
        table=Table(rows,colWidths=[width*r for r in ratios],repeatRows=1,hAlign='LEFT')
        table.setStyle(TableStyle([
            ('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e0eee5')),
            ('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f5f8f6')]),
            ('VALIGN',(0,0),(-1,-1),'TOP'),
            ('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),
            ('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),
            ('LINEBELOW',(0,0),(-1,0),.7,colors.HexColor('#a5c7b1')),
        ]))
        story.extend([table,Spacer(1,8)])
        continue
    elif line.startswith('### '):
        story.append(Paragraph(inline(line[4:]),styles['HeadPet']))
    elif line.startswith('## '):
        story.append(Paragraph(inline(line[3:]),styles['SubPet']))
    elif line.startswith('# '):
        story.append(Paragraph(inline(line[2:]),styles['TitlePet']))
    elif line.startswith('- '):
        story.append(Paragraph('- '+inline(line[2:]),styles['BulletPet']))
    else:
        story.append(Paragraph(inline(line),styles['BodyPet']))
    i+=1

target=OUT/'PetCare-Project-Proposal.pdf'
doc=SimpleDocTemplate(str(target),pagesize=(595.28,841.89),rightMargin=40,leftMargin=40,topMargin=43,bottomMargin=40,title='PetCare - Full-Stack CRUD Project Proposal',author='Nyein Chan Htet Naing; Myat Phone Paye; Lin Myat Thu')
doc.build(story,onFirstPage=footer,onLaterPages=footer)

def render_contact(path,stem,thumb_width):
    source=pymupdf.open(path)
    thumbs=[]
    for idx,page in enumerate(source):
        pix=page.get_pixmap(matrix=pymupdf.Matrix(1.15,1.15),alpha=False)
        pix.save(QA/f'{stem}-{idx+1}.png')
        im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
        im.thumbnail((thumb_width,1000))
        panel=Image.new('RGB',(thumb_width,im.height+24),'white')
        panel.paste(im,(0,24))
        ImageDraw.Draw(panel).text((5,5),f'Page {idx+1}',fill='black')
        thumbs.append(panel)
    cols=3; cellh=max(x.height for x in thumbs)
    sheet=Image.new('RGB',(cols*thumb_width,((len(thumbs)+cols-1)//cols)*cellh),'#dddddd')
    for idx,im in enumerate(thumbs): sheet.paste(im,((idx%cols)*thumb_width,(idx//cols)*cellh))
    sheet.save(QA/f'{stem}-contact.png')
    print(f'{stem}: {len(source)} pages')
    for idx,p in enumerate(source):
        if stem=='proposal': print(idx+1,len(p.get_text()),p.get_text().splitlines()[-4:])

render_contact('/Users/lil_katibby/Downloads/Petcare Presentation.pdf','source',550)
render_contact(target,'proposal',430)
print(target)
