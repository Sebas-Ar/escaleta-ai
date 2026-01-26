import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { NewsItem } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const exportToDocx = async (items: NewsItem[]) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: "Escaleta de Noticias",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    text: format(new Date(), "EEEE d 'de' MMMM yyyy", { locale: es }),
                    spacing: { after: 400 },
                }),
                ...items.flatMap((item, index) => [
                     new Paragraph({
                        children: [
                            new TextRun({ text: `${index + 1}. ${item.title}`, bold: true, size: 24 })
                        ],
                        spacing: { before: 200 },
                     }),
                     new Paragraph({
                        children: [
                            new TextRun({ text: `Duración: ${item.estimated_duration || 'N/A'}`, italics: true, size: 20 })
                        ],
                     }),
                     new Paragraph({
                        children: [new TextRun({ text: item.content, size: 22 })],
                        spacing: { after: 200 },
                     }),
                     new Paragraph({ text: "" }) // Spacer
                ])
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Escaleta_${format(new Date(), 'yyyy-MM-dd')}.docx`);
}
