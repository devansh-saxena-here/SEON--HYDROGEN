import React, { useState } from 'react';
import { Download, Eye, FileSpreadsheet, FileText, Loader2, Plus, X } from 'lucide-react';
import {
  REPORT_BUILDING_ROWS,
  REPORT_SUMMARY_METRICS,
  REPORTS_CATALOG,
  type ReportCatalogItem,
} from '../lib/demo-data';
import { downloadCsvReport } from '../lib/csv-report';
import { downloadPdfReport } from '../lib/pdf-report';
import { useUser } from '../hooks/useUser';
import { useToast } from '../components/ToastProvider';

export function ReportsPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const [reports, setReports] = useState<ReportCatalogItem[]>(REPORTS_CATALOG);
  const [previewReport, setPreviewReport] = useState<ReportCatalogItem | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [newPeriod, setNewPeriod] = useState<ReportCatalogItem['period']>('Monthly');
  const [generating, setGenerating] = useState(false);

  const handleExportPdf = (report: ReportCatalogItem) => {
    const filename = downloadPdfReport(report, user?.displayName);
    toast({
      title: 'PDF downloaded',
      description: `Saved ${filename}`,
      variant: 'success',
    });
  };

  const handleExportCsv = (report: ReportCatalogItem) => {
    const filename = downloadCsvReport(report);
    toast({
      title: 'CSV downloaded',
      description: `Saved ${filename}`,
      variant: 'success',
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    const today = new Date().toISOString().slice(0, 10);
    const created: ReportCatalogItem = {
      id: `r-sim-${Date.now().toString().slice(-4)}`,
      title: `${newPeriod} Energy Brief — ${today}`,
      period: newPeriod,
      date: today,
      sampleSize: newPeriod === 'Annual' ? '6.4 MB' : newPeriod === 'Quarterly' ? '3.9 MB' : '1.8 MB',
    };

    setReports((prev) => [created, ...prev]);
    setGenerating(false);
    setGenerateOpen(false);
    setPreviewReport(created);
    toast({
      title: 'Report ready (simulated)',
      description: `${created.title} added to session list for preview and export.`,
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Energy &amp; ESG Reports
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Preview sample summaries and download real formatted PDF and CSV files.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setGenerateOpen(true)}
          className="inline-flex h-10 items-center gap-2 self-start whitespace-nowrap rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-500 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Generate report</span>
        </button>
      </div>

      {/* Report catalog */}
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <article
            key={report.id}
            className="seon-density-pad flex flex-col justify-between rounded-xl border border-border bg-card p-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-muted">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {report.period}
                </span>
                <span className="font-mono tabular-nums">
                  {report.date} · {report.sampleSize}
                </span>
              </div>
              <h2 className="mt-2 font-display text-lg font-semibold text-foreground">
                {report.title}
              </h2>
              <p className="mt-1 text-xs text-muted">
                Report ID: <span className="font-mono">{report.id}</span> · Sample portfolio summary
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewReport(report)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-card-muted"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportPdf(report)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-medium text-white hover:bg-emerald-500"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Export PDF</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportCsv(report)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-card-muted"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Preview Dialog */}
      {previewReport && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-preview-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  SEON Energy Report · Sample Data
                </p>
                <h2
                  id="report-preview-title"
                  className="mt-0.5 font-display text-lg font-semibold text-foreground"
                >
                  {previewReport.title}
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  {previewReport.period} · {previewReport.date} · ID {previewReport.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewReport(null)}
                aria-label="Close report preview"
                className="rounded-lg p-1.5 text-muted hover:bg-card-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5 text-sm">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <p className="text-xs text-muted">Total consumption</p>
                  <p className="mt-1 font-mono text-base font-semibold tabular-nums text-foreground">
                    {REPORT_SUMMARY_METRICS.totalConsumptionKwh.toLocaleString()} kWh
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <p className="text-xs text-muted">CO₂ avoided</p>
                  <p className="mt-1 font-mono text-base font-semibold tabular-nums text-foreground">
                    {REPORT_SUMMARY_METRICS.co2AvoidedTons} t
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <p className="text-xs text-muted">Peak alerts resolved</p>
                  <p className="mt-1 font-mono text-base font-semibold tabular-nums text-foreground">
                    {REPORT_SUMMARY_METRICS.peakAlertsResolved}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <p className="text-xs text-muted">ESG improvement</p>
                  <p className="mt-1 font-mono text-base font-semibold tabular-nums text-emerald-500">
                    {REPORT_SUMMARY_METRICS.esgImprovementPoints} pts
                  </p>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-secondary">
                Sample executive summary: Portfolio consumption showed a 6.4% decrease versus the
                previous period following HVAC optimization in Buildings A and B and 14 accepted
                AI recommendations. Next priorities include off-peak pre-cooling and
                idle-workstation consolidation.
              </p>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-card-muted/50 text-muted">
                      <th className="px-3 py-2.5 font-medium">Building</th>
                      <th className="px-3 py-2.5 text-right font-medium">Consumption</th>
                      <th className="px-3 py-2.5 text-right font-medium">Devices</th>
                      <th className="px-3 py-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {REPORT_BUILDING_ROWS.map((row) => (
                      <tr key={row.name}>
                        <td className="px-3 py-2.5 font-medium text-foreground">{row.name}</td>
                        <td className="px-3 py-2.5 text-right font-mono tabular-nums text-foreground">
                          {row.kwh.toLocaleString()} kWh
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono tabular-nums text-secondary">
                          {row.devices}
                        </td>
                        <td className="px-3 py-2.5 text-secondary">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3.5">
              <button
                type="button"
                onClick={() => handleExportCsv(previewReport)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 text-xs font-medium text-foreground hover:bg-card-muted"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportPdf(previewReport)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-medium text-white hover:bg-emerald-500"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Dialog */}
      {generateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="generate-report-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <form
            onSubmit={handleGenerate}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="generate-report-title"
                  className="font-display text-lg font-semibold text-foreground"
                >
                  Generate report
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Creates a simulated summary entry using the demonstration portfolio dataset.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGenerateOpen(false)}
                aria-label="Close generate report dialog"
                className="rounded-lg p-1 text-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              <label
                htmlFor="report-period-select"
                className="block text-xs font-medium text-secondary"
              >
                Report period
              </label>
              <select
                id="report-period-select"
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value as ReportCatalogItem['period'])}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setGenerateOpen(false)}
                className="h-9 rounded-lg border border-border bg-background px-4 text-xs font-medium text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={generating}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {generating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{generating ? 'Preparing…' : 'Generate'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
