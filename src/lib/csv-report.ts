import {
  REPORT_BUILDING_ROWS,
  REPORT_SUMMARY_METRICS,
  type ReportCatalogItem,
} from './demo-data';

export function escapeCsvCell(value: string | number): string {
  const str = String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export function sanitizeReportFilename(title: string, ext: 'csv' | 'pdf'): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'seon-report'}.${ext}`;
}

export function buildReportCsv(report: ReportCatalogItem): string {
  const rows: (string | number)[][] = [
    ['SEON Energy Report', report.title],
    ['Report ID', report.id],
    ['Period', report.period],
    ['Date', report.date],
    [],
    ['Metric', 'Value', 'Unit'],
    ['Total Consumption', REPORT_SUMMARY_METRICS.totalConsumptionKwh, 'kWh'],
    ['CO2 Avoided', REPORT_SUMMARY_METRICS.co2AvoidedTons, 'tons'],
    ['ESG Improvement', REPORT_SUMMARY_METRICS.esgImprovementPoints, 'points'],
    ['Peak Alerts Resolved', REPORT_SUMMARY_METRICS.peakAlertsResolved, 'events'],
    [],
    ['Building', 'Consumption (kWh)', 'Devices', 'Rooms', 'Status'],
    ...REPORT_BUILDING_ROWS.map((b) => [b.name, b.kwh, b.devices, b.rooms, b.status]),
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}

export function downloadCsvReport(report: ReportCatalogItem): string {
  const csv = buildReportCsv(report);
  const filename = sanitizeReportFilename(report.title, 'csv');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return filename;
}
