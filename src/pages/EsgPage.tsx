import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckCircle2, Download, FileText, Leaf, Trees, TrendingDown, X } from 'lucide-react';
import {
  ESG_IMPACT,
  ESG_MONTHLY_DATA,
  ESG_RECOMMENDATIONS,
  ESG_SCORES,
} from '../lib/demo-data';
import {
  compileEsgReportSummary,
  downloadEsgPdfReport,
  type EsgReportScope,
  type EsgReportSections,
} from '../lib/esg-report';
import { useUser } from '../hooks/useUser';
import { useToast } from '../components/ToastProvider';

function ScoreRing({ score, color }: { score: number; color: string }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 84 84" aria-hidden="true">
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="var(--border-hairline)"
          strokeWidth="7"
        />
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="absolute font-mono text-lg font-semibold tabular-nums text-foreground">
        {score}
      </span>
    </div>
  );
}

const DEFAULT_REPORT_TITLE = 'SEON Environmental & ESG Performance Summary';

export function EsgPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState(DEFAULT_REPORT_TITLE);
  const [reportScope, setReportScope] = useState<EsgReportScope>('full-year');
  const [sections, setSections] = useState<EsgReportSections>({
    includeScores: true,
    includeMonthlyCarbon: true,
    includeBuildings: true,
    includeRecommendations: true,
  });
  const [titleError, setTitleError] = useState<string | null>(null);
  const [lastExport, setLastExport] = useState<{
    filename: string;
    scopeLabel: string;
    exportedAt: string;
  } | null>(null);

  const compiledPreview = useMemo(
    () =>
      compileEsgReportSummary(
        { title: reportTitle, scope: reportScope },
        user?.displayName,
      ),
    [reportScope, reportTitle, user?.displayName],
  );

  const selectedSectionCount = Object.values(sections).filter(Boolean).length;

  const toggleSection = (key: keyof EsgReportSections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportEsgPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      setTitleError('Please enter a report title before exporting.');
      return;
    }
    setTitleError(null);

    const { filename, summary } = downloadEsgPdfReport(
      {
        title: reportTitle.trim(),
        scope: reportScope,
        sections,
      },
      user?.displayName,
    );

    const exportedAt = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setLastExport({
      filename,
      scopeLabel: summary.scopeLabel,
      exportedAt,
    });
    setReportDialogOpen(false);
    toast({
      title: 'ESG PDF report exported',
      description: `Downloaded ${filename} (${summary.scopeLabel})`,
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            ESG Dashboard
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Simulated environmental, efficiency, social, and governance indicators.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
            MoM carbon delta: {ESG_IMPACT.momImprovement}
          </span>
          <button
            type="button"
            onClick={() => {
              setTitleError(null);
              setReportDialogOpen(true);
            }}
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            <FileText className="h-4 w-4" />
            <span>Generate ESG report</span>
          </button>
        </div>
      </div>

      {lastExport && (
        <div
          role="status"
          className="flex flex-col justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-2.5 text-xs text-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>
              Last compiled PDF: <strong className="font-mono">{lastExport.filename}</strong> ({lastExport.scopeLabel}, exported at {lastExport.exportedAt})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setReportDialogOpen(true)}
            className="inline-flex h-8 items-center gap-1.5 self-start rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-card-muted sm:self-auto"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Configure &amp; re-export</span>
          </button>
        </div>
      )}

      {/* 4 score rings */}
      <section aria-label="ESG category scores" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ESG_SCORES.map((item) => (
          <div
            key={item.id}
            className="seon-density-pad flex flex-col items-center rounded-xl border border-border bg-card p-5 text-center"
          >
            <ScoreRing score={item.score} color={item.color} />
            <h2 className="mt-3 font-display text-sm font-semibold text-foreground">
              {item.label}
            </h2>
            <p className="mt-0.5 font-mono text-xs text-muted">{item.score} / 100</p>
          </div>
        ))}
      </section>

      {/* Chart + Green footprint */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="seon-density-pad rounded-xl border border-border bg-card p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Monthly carbon estimation
              </h2>
              <p className="text-xs text-muted">Estimated monthly footprint (tons CO₂, demo)</p>
            </div>
            <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>{ESG_IMPACT.momImprovement} MoM</span>
            </span>
          </div>

          <div className="mt-4 h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ESG_MONTHLY_DATA}
                margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  unit=" t"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-hairline)',
                    borderRadius: '0.625rem',
                    fontSize: '12px',
                    color: 'var(--fg-primary)',
                  }}
                  formatter={(value: unknown) => [`${value} t CO₂`, 'Estimated']}
                />
                <Line
                  type="monotone"
                  dataKey="co2Tons"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10b981' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Green footprint panel */}
        <div className="seon-density-pad flex flex-col justify-between rounded-xl border border-border bg-card p-5 lg:col-span-5">
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">
              Green-footprint impact
            </h2>
            <p className="text-xs text-muted">
              Illustrative sustainability progress against annual demonstration target
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-background/60 p-3">
                <Leaf className="h-4 w-4 text-emerald-500" />
                <p className="mt-2 font-mono text-lg font-semibold tabular-nums text-foreground">
                  {ESG_IMPACT.co2SavedYtd} t
                </p>
                <p className="text-[11px] text-muted">CO₂ saved YTD</p>
              </div>
              <div className="rounded-xl border border-border bg-background/60 p-3">
                <Trees className="h-4 w-4 text-sky-500" />
                <p className="mt-2 font-mono text-lg font-semibold tabular-nums text-foreground">
                  {ESG_IMPACT.equivalentTrees}
                </p>
                <p className="text-[11px] text-muted">Equivalent trees</p>
              </div>
              <div className="rounded-xl border border-border bg-background/60 p-3">
                <TrendingDown className="h-4 w-4 text-indigo-400" />
                <p className="mt-2 font-mono text-lg font-semibold tabular-nums text-foreground">
                  {ESG_IMPACT.greenImprovement}
                </p>
                <p className="text-[11px] text-muted">Green improvement</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-background/60 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Annual CO₂ reduction target</span>
              <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                {ESG_IMPACT.co2SavedYtd} / {ESG_IMPACT.annualTarget} t ({ESG_IMPACT.targetProgressPercent}%)
              </span>
            </div>
            <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-card-muted">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${ESG_IMPACT.targetProgressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-muted">
              Simulated MVP indicators; not a certified emissions audit.
            </p>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="seon-density-pad rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-base font-semibold text-foreground">
          ESG Optimization Recommendations
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {ESG_RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.id}
              className="rounded-xl border border-border bg-background/60 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{rec.title}</h3>
                <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {rec.saving}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-secondary">{rec.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ESG Branded PDF Report Builder Dialog */}
      {reportDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="esg-report-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <form
            onSubmit={handleExportEsgPdf}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  SEON Environmental Report Compiler · Simulated Portfolio Data
                </p>
                <h2
                  id="esg-report-dialog-title"
                  className="mt-0.5 font-display text-lg font-semibold text-foreground"
                >
                  Generate branded ESG PDF summary
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setReportDialogOpen(false)}
                aria-label="Close ESG report dialog"
                className="rounded-lg p-1.5 text-muted hover:bg-card-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="esg-report-title"
                    className="block text-xs font-medium text-secondary"
                  >
                    Report title
                  </label>
                  <input
                    id="esg-report-title"
                    type="text"
                    value={reportTitle}
                    onChange={(e) => {
                      setReportTitle(e.target.value);
                      if (titleError) setTitleError(null);
                    }}
                    placeholder={DEFAULT_REPORT_TITLE}
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none"
                  />
                  {titleError && (
                    <p className="mt-1 text-xs text-red-500">{titleError}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="esg-report-scope"
                    className="block text-xs font-medium text-secondary"
                  >
                    Reporting horizon
                  </label>
                  <select
                    id="esg-report-scope"
                    value={reportScope}
                    onChange={(e) => setReportScope(e.target.value as EsgReportScope)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="full-year">Full Year (Jan – Dec)</option>
                    <option value="h2">H2 Performance (Jul – Dec)</option>
                    <option value="q4">Q4 Snapshot (Oct – Dec)</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-secondary">
                  Sections included ({selectedSectionCount}/4 optional tables &amp; breakdowns)
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background/70 px-3 py-2.5 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={sections.includeScores}
                      onChange={() => toggleSection('includeScores')}
                      className="h-4 w-4 accent-emerald-600"
                    />
                    <span>ESG pillar scores (82 / 76 / 71 / 88)</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background/70 px-3 py-2.5 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={sections.includeMonthlyCarbon}
                      onChange={() => toggleSection('includeMonthlyCarbon')}
                      className="h-4 w-4 accent-emerald-600"
                    />
                    <span>Monthly energy &amp; carbon table</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background/70 px-3 py-2.5 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={sections.includeBuildings}
                      onChange={() => toggleSection('includeBuildings')}
                      className="h-4 w-4 accent-emerald-600"
                    />
                    <span>Portfolio building footprint</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background/70 px-3 py-2.5 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={sections.includeRecommendations}
                      onChange={() => toggleSection('includeRecommendations')}
                      className="h-4 w-4 accent-emerald-600"
                    />
                    <span>ESG optimization action plan</span>
                  </label>
                </div>
              </div>

              {/* Compiled environmental preview */}
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">
                    Compiled metrics preview ({compiledPreview.scopeLabel})
                  </p>
                  <span className="font-mono text-[11px] text-muted">
                    Prepared for {compiledPreview.preparedFor}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-border bg-card p-2.5">
                    <p className="text-[11px] text-muted">Composite ESG</p>
                    <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-emerald-500">
                      {compiledPreview.compositeScore} / 100
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-2.5">
                    <p className="text-[11px] text-muted">Period CO₂</p>
                    <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">
                      {compiledPreview.totalCo2Tons} t
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-2.5">
                    <p className="text-[11px] text-muted">Period energy</p>
                    <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">
                      {compiledPreview.totalEnergyKwh.toLocaleString()} kWh
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-2.5">
                    <p className="text-[11px] text-muted">CO₂ saved YTD</p>
                    <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">
                      {compiledPreview.impact.co2SavedYtd} / {compiledPreview.impact.annualTarget} t
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-secondary">
                  Peak carbon month in selection: <strong className="text-foreground">{compiledPreview.peakMonth.month}</strong> ({compiledPreview.peakMonth.co2Tons} t CO₂) · Lowest: <strong className="text-foreground">{compiledPreview.lowestMonth.month}</strong> ({compiledPreview.lowestMonth.co2Tons} t CO₂). Includes SEON header emblem, target progress bar ({compiledPreview.impact.targetProgressPercent}%), and formatted tables.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3.5">
              <button
                type="button"
                onClick={() => setReportDialogOpen(false)}
                className="h-9 rounded-lg border border-border bg-background px-4 text-xs font-medium text-foreground hover:bg-card-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-medium text-white hover:bg-emerald-500"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export branded PDF</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
