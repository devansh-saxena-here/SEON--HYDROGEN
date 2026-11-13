import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  ESG_SCORES,
  REPORT_BUILDING_ROWS,
  REPORT_RECOMMENDATIONS,
  REPORT_SUMMARY_METRICS,
  type ReportCatalogItem,
} from './demo-data';
import { sanitizeReportFilename } from './csv-report';

function toPdfAscii(value: string): string {
  return value
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .replace(/CO₂/g, 'CO2')
    .replace(/→/g, '->');
}

export function downloadPdfReport(
  report: ReportCatalogItem,
  preparedForName?: string,
): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // Dark header band
  doc.setFillColor(11, 18, 32);
  doc.rect(0, 0, pageWidth, 94, 'F');

  // Emerald, Sky, Indigo accent stripes
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 94, pageWidth / 3, 4, 'F');
  doc.setFillColor(14, 165, 233);
  doc.rect(pageWidth / 3, 94, pageWidth / 3, 4, 'F');
  doc.setFillColor(99, 102, 241);
  doc.rect((pageWidth / 3) * 2, 94, pageWidth / 3 + 1, 4, 'F');

  // Circular SEON brand emblem
  doc.setFillColor(17, 24, 39);
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1.8);
  doc.circle(margin + 18, 45, 18, 'FD');
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(1.2);
  doc.circle(margin + 18, 45, 10, 'S');
  doc.setFillColor(16, 185, 129);
  doc.circle(margin + 18, 45, 3.2, 'F');

  // Title & expansion
  doc.setTextColor(248, 250, 252);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SEON', margin + 46, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Smart Energy Optimization Network', margin + 46, 57);

  // Header metadata on right
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Report ID: ${report.id}`, pageWidth - margin, 36, { align: 'right' });
  doc.text(`Period: ${report.period}`, pageWidth - margin, 50, { align: 'right' });
  doc.text(`Generated: ${report.date}`, pageWidth - margin, 64, { align: 'right' });

  // Report title & prepared-for line
  let y = 124;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(toPdfAscii(report.title), margin, y);

  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const recipient = (preparedForName && preparedForName.trim()) || 'Devansh Saxena';
  doc.text(
    toPdfAscii(`Prepared for ${recipient} | Sample Portfolio Summary (Simulated Data)`),
    margin,
    y,
  );

  // 4 colored KPI blocks
  y += 20;
  const kpiGap = 10;
  const kpiWidth = (contentWidth - kpiGap * 3) / 4;
  const kpis = [
    {
      label: 'Total Consumption',
      value: `${REPORT_SUMMARY_METRICS.totalConsumptionKwh.toLocaleString()} kWh`,
      rgb: [16, 185, 129] as [number, number, number],
    },
    {
      label: 'CO2 Avoided',
      value: `${REPORT_SUMMARY_METRICS.co2AvoidedTons} tons`,
      rgb: [14, 165, 233] as [number, number, number],
    },
    {
      label: 'ESG Improvement',
      value: `${REPORT_SUMMARY_METRICS.esgImprovementPoints} points`,
      rgb: [99, 102, 241] as [number, number, number],
    },
    {
      label: 'Peak Alerts Resolved',
      value: `${REPORT_SUMMARY_METRICS.peakAlertsResolved} events`,
      rgb: [245, 158, 11] as [number, number, number],
    },
  ];

  kpis.forEach((kpi, idx) => {
    const x = margin + idx * (kpiWidth + kpiGap);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.roundedRect(x, y, kpiWidth, 56, 5, 5, 'FD');

    doc.setFillColor(...kpi.rgb);
    doc.rect(x, y, kpiWidth, 3.5, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 10, y + 20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.value, x + 10, y + 40);
  });

  // Executive Summary
  y += 80;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Executive Summary', margin, y);

  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const summaryText = toPdfAscii(
    `Portfolio electricity consumption totaled 30,021 kWh (${REPORT_SUMMARY_METRICS.periodDelta} vs previous period) following HVAC optimization in Buildings A and B and ${REPORT_SUMMARY_METRICS.acceptedRecommendations} accepted AI recommendations. Key follow-up opportunities include off-peak HVAC pre-cooling and idle-workstation consolidation.`,
  );
  const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(splitSummary, margin, y);
  y += splitSummary.length * 13 + 10;

  // Building Consumption Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Building Consumption Breakdown', margin, y);

  autoTable(doc, {
    startY: y + 8,
    margin: { left: margin, right: margin },
    head: [['Building', 'Consumption (kWh)', 'Devices', 'Rooms', 'Status']],
    body: REPORT_BUILDING_ROWS.map((row) => [
      toPdfAscii(row.name),
      row.kwh.toLocaleString(),
      String(row.devices),
      String(row.rooms),
      row.status,
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 6,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [248, 250, 252],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 22;

  // AI Recommendations Table
  if (y > pageHeight - 190) {
    doc.addPage();
    y = 50;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text('AI Optimization Recommendations', margin, y);

  autoTable(doc, {
    startY: y + 8,
    margin: { left: margin, right: margin },
    head: [['Recommendation', 'Category', 'Estimated Saving']],
    body: REPORT_RECOMMENDATIONS.map((rec) => [
      toPdfAscii(rec.title),
      rec.category,
      rec.saving,
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 6,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [5, 150, 105],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24;

  // ESG Breakdown with colored progress bars
  if (y > pageHeight - 160) {
    doc.addPage();
    y = 50;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ESG Performance Breakdown', margin, y);
  y += 16;

  const barColors: Record<string, [number, number, number]> = {
    env: [16, 185, 129],
    eff: [14, 165, 233],
    soc: [99, 102, 241],
    gov: [20, 184, 166],
  };

  for (const item of ESG_SCORES) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(item.label, margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.score} / 100`, pageWidth - margin, y, { align: 'right' });

    y += 6;
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 7, 3.5, 3.5, 'F');

    const rgb = barColors[item.id] ?? [16, 185, 129];
    doc.setFillColor(...rgb);
    doc.roundedRect(margin, y, (contentWidth * item.score) / 100, 7, 3.5, 3.5, 'F');

    y += 20;
  }

  // Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 38, pageWidth - margin, pageHeight - 38);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('SEON — Smart Energy Optimization Network | Developer - Devansh Saxena', margin, pageHeight - 22);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 22, {
      align: 'right',
    });
  }

  const filename = sanitizeReportFilename(report.title, 'pdf');
  doc.save(filename);
  return filename;
}
