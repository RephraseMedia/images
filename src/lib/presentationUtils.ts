import type { PresentationData, PresentationStyle, StyleTheme, SlideData } from '@/types/presentation';
import { STYLE_THEMES } from '@/types/presentation';

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_').substring(0, 100) || 'presentation';
}

export async function generatePPTX(presentation: PresentationData, style: PresentationStyle): Promise<void> {
  const pptxgenjs = await import('pptxgenjs');
  const PptxGenJS = pptxgenjs.default;
  const pptx = new PptxGenJS();
  const theme = STYLE_THEMES[style];

  pptx.layout = 'LAYOUT_WIDE'; // 16:9

  for (const slide of presentation.slides) {
    const pptxSlide = pptx.addSlide();

    switch (slide.layout) {
      case 'title':
        renderTitleSlidePPTX(pptxSlide, slide, theme);
        break;
      case 'section':
        renderSectionSlidePPTX(pptxSlide, slide, theme);
        break;
      case 'conclusion':
        renderConclusionSlidePPTX(pptxSlide, slide, theme);
        break;
      default:
        renderContentSlidePPTX(pptxSlide, slide, theme);
    }

    if (slide.speakerNotes) {
      pptxSlide.addNotes(slide.speakerNotes);
    }
  }

  const filename = sanitizeFilename(presentation.title);
  await pptx.writeFile({ fileName: `${filename}.pptx` });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderTitleSlidePPTX(slide: any, data: SlideData, theme: StyleTheme) {
  slide.background = { color: theme.primaryColor.replace('#', '') };
  slide.addText(data.title, {
    x: 0.5,
    y: 1.5,
    w: '90%',
    h: 2,
    fontSize: theme.titleFontSize,
    fontFace: theme.fontFamily,
    color: 'FFFFFF',
    align: 'center',
    bold: true,
  });
  if (data.bullets.length > 0) {
    slide.addText(data.bullets[0], {
      x: 0.5,
      y: 3.8,
      w: '90%',
      h: 1,
      fontSize: theme.bodyFontSize,
      fontFace: theme.fontFamily,
      color: 'FFFFFF',
      align: 'center',
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderContentSlidePPTX(slide: any, data: SlideData, theme: StyleTheme) {
  slide.background = { color: theme.backgroundColor.replace('#', '') };
  slide.addText(data.title, {
    x: 0.5,
    y: 0.3,
    w: '90%',
    h: 0.8,
    fontSize: theme.titleFontSize * 0.7,
    fontFace: theme.fontFamily,
    color: theme.primaryColor.replace('#', ''),
    bold: true,
  });
  const bullets = data.bullets.map((b) => ({
    text: b,
    options: {
      bullet: true,
      fontSize: theme.bulletFontSize,
      fontFace: theme.fontFamily,
      color: theme.textColor.replace('#', ''),
      paraSpaceAfter: 8,
    },
  }));
  slide.addText(bullets, {
    x: 0.8,
    y: 1.3,
    w: '85%',
    h: 4,
    valign: 'top',
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderSectionSlidePPTX(slide: any, data: SlideData, theme: StyleTheme) {
  slide.background = { color: theme.secondaryColor.replace('#', '') };
  slide.addText(data.title, {
    x: 0.5,
    y: 2,
    w: '90%',
    h: 1.5,
    fontSize: theme.titleFontSize * 0.85,
    fontFace: theme.fontFamily,
    color: 'FFFFFF',
    align: 'center',
    bold: true,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderConclusionSlidePPTX(slide: any, data: SlideData, theme: StyleTheme) {
  slide.background = { color: theme.primaryColor.replace('#', '') };
  slide.addText(data.title, {
    x: 0.5,
    y: 1,
    w: '90%',
    h: 1,
    fontSize: theme.titleFontSize * 0.8,
    fontFace: theme.fontFamily,
    color: 'FFFFFF',
    align: 'center',
    bold: true,
  });
  const bullets = data.bullets.map((b) => ({
    text: b,
    options: {
      bullet: true,
      fontSize: theme.bulletFontSize,
      fontFace: theme.fontFamily,
      color: 'FFFFFF',
      paraSpaceAfter: 8,
    },
  }));
  if (bullets.length > 0) {
    slide.addText(bullets, {
      x: 0.8,
      y: 2.3,
      w: '85%',
      h: 3,
      valign: 'top',
    });
  }
}

export async function generatePDF(presentation: PresentationData, style: PresentationStyle): Promise<void> {
  const jspdfModule = await import('jspdf');
  const jsPDF = jspdfModule.default;
  const theme = STYLE_THEMES[style];
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [960, 540] });

  presentation.slides.forEach((slide, index) => {
    if (index > 0) doc.addPage();

    switch (slide.layout) {
      case 'title':
        renderTitleSlidePDF(doc, slide, theme);
        break;
      case 'section':
        renderSectionSlidePDF(doc, slide, theme);
        break;
      case 'conclusion':
        renderConclusionSlidePDF(doc, slide, theme);
        break;
      default:
        renderContentSlidePDF(doc, slide, theme);
    }
  });

  const filename = sanitizeFilename(presentation.title);
  doc.save(`${filename}.pdf`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderTitleSlidePDF(doc: any, slide: SlideData, theme: StyleTheme) {
  doc.setFillColor(theme.primaryColor);
  doc.rect(0, 0, 960, 540, 'F');
  doc.setFont(theme.fontFamily, 'bold');
  doc.setFontSize(theme.titleFontSize);
  doc.setTextColor('#FFFFFF');
  doc.text(slide.title, 480, 220, { align: 'center', maxWidth: 800 });
  if (slide.bullets.length > 0) {
    doc.setFont(theme.fontFamily, 'normal');
    doc.setFontSize(theme.bodyFontSize);
    doc.text(slide.bullets[0], 480, 310, { align: 'center', maxWidth: 800 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderContentSlidePDF(doc: any, slide: SlideData, theme: StyleTheme) {
  doc.setFillColor(theme.backgroundColor);
  doc.rect(0, 0, 960, 540, 'F');
  doc.setFont(theme.fontFamily, 'bold');
  doc.setFontSize(Math.round(theme.titleFontSize * 0.7));
  doc.setTextColor(theme.primaryColor);
  doc.text(slide.title, 60, 60);
  doc.setFont(theme.fontFamily, 'normal');
  doc.setFontSize(theme.bulletFontSize);
  doc.setTextColor(theme.textColor);
  let y = 120;
  for (const bullet of slide.bullets) {
    doc.text(`\u2022  ${bullet}`, 80, y, { maxWidth: 800 });
    y += 40;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderSectionSlidePDF(doc: any, slide: SlideData, theme: StyleTheme) {
  doc.setFillColor(theme.secondaryColor);
  doc.rect(0, 0, 960, 540, 'F');
  doc.setFont(theme.fontFamily, 'bold');
  doc.setFontSize(Math.round(theme.titleFontSize * 0.85));
  doc.setTextColor('#FFFFFF');
  doc.text(slide.title, 480, 270, { align: 'center', maxWidth: 800 });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderConclusionSlidePDF(doc: any, slide: SlideData, theme: StyleTheme) {
  doc.setFillColor(theme.primaryColor);
  doc.rect(0, 0, 960, 540, 'F');
  doc.setFont(theme.fontFamily, 'bold');
  doc.setFontSize(Math.round(theme.titleFontSize * 0.8));
  doc.setTextColor('#FFFFFF');
  doc.text(slide.title, 480, 140, { align: 'center', maxWidth: 800 });
  doc.setFont(theme.fontFamily, 'normal');
  doc.setFontSize(theme.bulletFontSize);
  let y = 240;
  for (const bullet of slide.bullets) {
    doc.text(`\u2022  ${bullet}`, 80, y, { maxWidth: 800 });
    y += 40;
  }
}
