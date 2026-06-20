import { NextResponse } from "next/server";

import { buildDashboardData, roleLabels } from "../../../../lib/demo-data";
import { forecastSales } from "../../../../lib/analytics";
import { getCurrentUser } from "../../../../lib/auth";

export const runtime = "nodejs";

function escapePdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdfDocument(lines: Array<{ text: string; size?: number }>) {
  const contentParts: string[] = [];
  let cursorY = 780;

  for (const line of lines) {
    const size = line.size ?? 12;
    const safeText = escapePdfText(line.text);
    contentParts.push(`BT /F1 ${size} Tf 50 ${cursorY} Td (${safeText}) Tj ET`);
    cursorY -= size + 10;
  }

  const contentStream = contentParts.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`
  ];

  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [0];
  let position = header.length;

  objects.forEach((object, index) => {
    offsets[index + 1] = position;
    const serialized = `${index + 1} 0 obj\n${object}\nendobj\n`;
    body += serialized;
    position += serialized.length;
  });

  const xrefStart = position;
  const xrefEntries = ["0000000000 65535 f "];
  for (let index = 1; index <= objects.length; index += 1) {
    xrefEntries.push(`${String(offsets[index]).padStart(10, "0")} 00000 n `);
  }

  const trailer = [
    "xref",
    `0 ${objects.length + 1}`,
    ...xrefEntries,
    "trailer",
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    String(xrefStart),
    "%%EOF"
  ].join("\n");

  return Buffer.from(`${header}${body}${trailer}`, "utf8");
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dashboard = buildDashboardData(user.role);
  const forecast = forecastSales(dashboard.revenueSeries, user.role);
  const churnLines = dashboard.risks.slice(0, 4).map((customer, index) => {
    const score = 100 - (customer.nps + customer.engagement) / 2 + customer.daysInactive + customer.tickets * 5;
    return `${index + 1}. ${customer.company} - owner ${customer.owner} - estimated risk ${Math.round(score)}%`;
  });

  const pdf = buildPdfDocument([
    { text: "Northstar CRM Analytics Report", size: 20 },
    { text: `Prepared for ${user.name} - ${roleLabels[user.role]} view`, size: 11 },
    { text: " " },
    { text: "Key Metrics", size: 14 },
    ...dashboard.metrics.flatMap((metric) => [
      { text: `${metric.label}: ${metric.value} (${metric.change})`, size: 11 },
      { text: " ", size: 8 }
    ]),
    { text: "Forecast", size: 14 },
    { text: forecast.headline, size: 11 },
    { text: `Next month: $${forecast.nextMonth.toLocaleString()}`, size: 11 },
    { text: `Next quarter: $${forecast.nextQuarter.toLocaleString()}`, size: 11 },
    { text: `Model confidence: ${forecast.confidence}%`, size: 11 },
    { text: " ", size: 8 },
    { text: "Churn Watchlist", size: 14 },
    ...churnLines.map((line) => ({ text: line, size: 11 }))
  ]);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="crm-analytics-report.pdf"'
    }
  });
}