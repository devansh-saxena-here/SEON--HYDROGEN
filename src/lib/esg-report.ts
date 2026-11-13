import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  ESG_IMPACT,
  ESG_MONTHLY_DATA,
  ESG_RECOMMENDATIONS,
  ESG_SCORES,
  REPORT_BUILDING_ROWS,
  type EsgMonthlyPoint,
  type EsgScoreItem,
  type ReportBuildingSummary,
} from './demo-data';
import { sanitizeReportFilename } from './csv-report';

export type EsgReportScope = 'full-year' | 'h2' | 'q4';

export interface EsgReportSections {
  includeScores: boolean;
  includeMonthlyCarbon: boolean;
  includeBuildings: boolean;
  includeRecommendations: boolean;
}

export interface EsgReportOptions {
  title: string;
  scope: EsgReportScope;
  sections: EsgReportSections;
}

export interface CompiledEsgSummary {
  title: string;
  scope: EsgReportScope;
  scopeLabel: string;
  generatedDate: string;
  preparedFor: string;
  compositeScore: number;
  scores: EsgScoreItem[];
  monthlySeries: EsgMonthlyPoint[];
  totalEnergyKwh: number;
  totalCo2Tons: number;
  avgMonthlyCo2Tons: number;
  peakMonth: EsgMonthlyPoint;
  lowestMonth: EsgMonthlyPoint;
  impact: typeof ESG_IMPACT;
  buildings: ReportBuildingSummary[];
  recommendations: typeof ESG_RECOMMENDATIONS;
}

const SCOPE_LABELS: Record<EsgReportScope, string> = {
  'full-year': 'Full Year (Jan - Dec)',
  h2: 'H2 Performance (Jul - Dec)',
  q4: 'Q4 Snapshot (Oct - Dec)',
};

function toPdfAscii(value: string): string {
  return value
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .replace(/CO₂/g, 'CO2')
    .replace(/→/g, '->')
    .replace(/·/g, '|');
}

export function sliceMonthlyDataByScope(
  scope: EsgReportScope,
  series: EsgMonthlyPoint[] = ESG_MONTHLY_DATA,
): EsgMonthlyPoint[] {
  if (scope === 'q4') {
    return series.slice(-3);
  }
  if (scope === 'h2') {
    return series.slice(-6);
  }
  return [...series];
}

export function compileEsgReportSummary(
  options: Pick<EsgReportOptions, 'title' | 'scope'>,
  preparedForName?: string,
  generatedDate: string = new Date().toISOString().slice(0, 10),
): CompiledEsgSummary {
  const monthlySeries = sliceMonthlyDataByScope(options.scope, ESG_MONTHLY_DATA);
  const totalEnergyKwh = monthlySeries.reduce((sum, item) => sum + item.energyKwh, 0);
  const totalCo2Tons = Number(
    monthlySeries.reduce((sum, item) => sum + item.co2Tons, 0).toFixed(1),
  );
  const avgMonthlyCo2Tons = Number((totalCo2Tons / monthlySeries.length).toFixed(2));

  const peakMonth = monthlySeries.reduce((max, item) =>
    item.co2Tons > max.co2Tons ? item : max,
  );
  const lowestMonth = monthlySeries.reduce((min, item) =>
    item.co2Tons < min.co2Tons ? item : min,
  );

  const compositeScore = Math.round(
    ESG_SCORES.reduce((sum, item) => sum + item.score, 0) / ESG_SCORES.length,
  );

  return {
    title: options.title.trim() || 'SEON Environmental & ESG Performance Summary',
    scope: options.scope,
    scopeLabel: SCOPE_LABELS[options.scope],
    generatedDate,
    preparedFor: (preparedForName && preparedForName.trim()) || 'Devansh Saxena',
    compositeScore,
    scores: ESG_SCORES,
    monthlySeries,
    totalEnergyKwh,
    totalCo2Tons,
    avgMonthlyCo2Tons,
    peakMonth,
    lowestMonth,
    impact: ESG_IMPACT,
    buildings: REPORT_BUILDING_ROWS,
    recommendations: ESG_RECOMMENDATIONS,
  };
}

export function createEsgPdfDocument(
  options: EsgReportOptions,
  preparedForName?: string,
  generatedDate?: string,
): { doc: jsPDF; filename: string; summary: CompiledEsgSummary } {
  const summary = compileEsgReportSummary(options, preparedForName, generatedDate);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const ensureSpace = (neededHeight: number, currentY: number): number => {
    if (currentY + neededHeight > pageHeight - 54) {
      doc.addPage();
      return 48;
    }
    return currentY;
  };

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

  // Header brand text
  doc.setTextColor(248, 250, 252);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SEON', margin + 46, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Smart Energy Optimization Network | ESG Report', margin + 46, 57);

  // Header metadata
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Scope: ${summary.scopeLabel}`, pageWidth - margin, 36, { align: 'right' });
  doc.text(`Generated: ${summary.generatedDate}`, pageWidth - margin, 50, { align: 'right' });
  doc.text(`Composite ESG: ${summary.compositeScore} / 100`, pageWidth - margin, 64, {
    align: 'right',
  });

  // Report heading
  let y = 124;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(toPdfAscii(summary.title), margin, y);

  y += 17;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    toPdfAscii(
      `Prepared for ${summary.preparedFor} | Simulated Environmental Performance Indicators (Not a Certified Audit)`,
    ),
    margin,
    y,
  );

  // 4 Environmental KPI cards
  y += 18;
  const kpiGap = 10;
  const kpiWidth = (contentWidth - kpiGap * 3) / 4;
  const kpis = [
    {
      label: 'Composite ESG Score',
      value: `${summary.compositeScore} / 100`,
      rgb: [16, 185, 129] as [number, number, number],
    },
    {
      label: 'CO2 Saved YTD',
      value: `${summary.impact.co2SavedYtd} / ${summary.impact.annualTarget} t`,
      rgb: [14, 165, 233] as [number, number, number],
    },
    {
      label: 'Period Carbon Total',
      value: `${summary.totalCo2Tons} t CO2`,
      rgb: [99, 102, 241] as [number, number, number],
    },
    {
      label: 'Equivalent Trees',
      value: `${summary.impact.equivalentTrees} trees`,
      rgb: [20, 184, 166] as [number, number, number],
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
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.value, x + 10, y + 40);
  });

  // Executive Narrative & Annual Target Bar
  y += 78;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Environmental Performance Executive Summary', margin, y);

  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const narrative = toPdfAscii(
    `During ${summary.scopeLabel}, modeled portfolio energy demand totaled ${summary.totalEnergyKwh.toLocaleString()} kWh (${summary.totalCo2Tons} t CO2 across ${summary.monthlySeries.length} months, averaging ${summary.avgMonthlyCo2Tons} t CO2/month). Carbon intensity peaked in ${summary.peakMonth.month} (${summary.peakMonth.co2Tons} t CO2) and reached its lowest point in ${summary.lowestMonth.month} (${summary.lowestMonth.co2Tons} t CO2). Year-to-date reductions stand at ${summary.impact.co2SavedYtd} t CO2 (${summary.impact.targetProgressPercent}% of the ${summary.impact.annualTarget} t annual goal) with ${summary.impact.momImprovement} MoM carbon improvement.`,
  );
  const splitNarrative = doc.splitTextToSize(narrative, contentWidth);
  doc.text(splitNarrative, margin, y);
  y += splitNarrative.length * 12.5 + 10;

  // Annual CO2 reduction progress bar box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 38, 5, 5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Annual CO2 Reduction Target Progress', margin + 12, y + 14);
  doc.setTextColor(5, 150, 105);
  doc.text(
    `${summary.impact.co2SavedYtd} / ${summary.impact.annualTarget} t (${summary.impact.targetProgressPercent}%)`,
    pageWidth - margin - 12,
    y + 14,
    { align: 'right' },
  );
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(margin + 12, y + 22, contentWidth - 24, 7, 3.5, 3.5, 'F');
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(
    margin + 12,
    y + 22,
    ((contentWidth - 24) * summary.impact.targetProgressPercent) / 100,
    7,
    3.5,
    3.5,
    'F',
  );
  y += 56;

  // Section 1: ESG Category Scores
  if (options.sections.includeScores) {
    y = ensureSpace(135, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    doc.text('ESG Pillar Breakdown', margin, y);
    y += 15;

    const barColors: Record<string, [number, number, number]> = {
      env: [16, 185, 129],
      eff: [14, 165, 233],
      soc: [99, 102, 241],
      gov: [20, 184, 166],
    };

    for (const item of summary.scores) {
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
      y += 19;
    }
    y += 6;
  }

  // Section 2: Monthly Carbon Estimation Table
  if (options.sections.includeMonthlyCarbon) {
    y = ensureSpace(140, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Monthly Energy & Carbon Estimation (${summary.scopeLabel})`, margin, y);

    autoTable(doc, {
      startY: y + 8,
      margin: { left: margin, right: margin },
      head: [['Month', 'Modeled Energy (kWh)', 'Estimated Carbon (t CO2)', 'Intensity (kg CO2/MWh)']],
      body: summary.monthlySeries.map((pt) => {
        const intensity = Math.round((pt.co2Tons * 1000) / (pt.energyKwh / 1000));
        return [pt.month, pt.energyKwh.toLocaleString(), pt.co2Tons.toFixed(1), `${intensity}`];
      }),
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 5,
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

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  }

  // Section 3: Building Consumption Breakdown
  if (options.sections.includeBuildings) {
    y = ensureSpace(130, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Portfolio Building Footprint', margin, y);

    autoTable(doc, {
      startY: y + 8,
      margin: { left: margin, right: margin },
      head: [['Building', 'Weekly Energy (kWh)', 'Devices', 'Rooms', 'Load Status']],
      body: summary.buildings.map((row) => [
        toPdfAscii(row.name),
        row.kwh.toLocaleString(),
        String(row.devices),
        String(row.rooms),
        row.status,
      ]),
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 5.5,
        textColor: [30, 41, 59],
      },
      headStyles: {
        fillColor: [14, 165, 233],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  }

  // Section 4: ESG Optimization Recommendations
  if (options.sections.includeRecommendations) {
    y = ensureSpace(140, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    doc.text('ESG Optimization Action Plan', margin, y);

    autoTable(doc, {
      startY: y + 8,
      margin: { left: margin, right: margin },
      head: [['Initiative', 'Implementation Action', 'Est. Saving']],
      body: summary.recommendations.map((rec) => [
        toPdfAscii(rec.title),
        toPdfAscii(rec.detail),
        rec.saving,
      ]),
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 5.5,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { cellWidth: 145, fontStyle: 'bold' },
        2: { cellWidth: 68, halign: 'right' },
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
    doc.text(
      toPdfAscii('SEON - Smart Energy Optimization Network | Developer - Devansh Saxena'),
      margin,
      pageHeight - 22,
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 22, {
      align: 'right',
    });
  }

  const filename = sanitizeReportFilename(`${summary.title}-${summary.scope}`, 'pdf');
  return { doc, filename, summary };
}

export function downloadEsgPdfReport(
  options: EsgReportOptions,
  preparedForName?: string,
): { filename: string; summary: CompiledEsgSummary } {
  const { doc, filename, summary } = createEsgPdfDocument(options, preparedForName);
  doc.save(filename);
  return { filename, summary };
}
