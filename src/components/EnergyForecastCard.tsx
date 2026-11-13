import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertCircle, Loader2, RefreshCw, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { LAST_7_DAYS_TREND } from '../lib/demo-data';
import {
  buildForecastChartSeries,
  type EnergyForecastResponse,
  type ForecastChartDatum,
  type ForecastHorizonDays,
  type ForecastScenario,
} from '../lib/forecast-logic';

function ForecastTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: ForecastChartDatum }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const datum = payload[0].payload;
  const band = datum.confidenceBand;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5 text-xs shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {datum.isForecast ? 'AI Projection' : 'Historical'}
        </span>
      </div>
      <div className="mt-1.5 space-y-1 font-mono tabular-nums">
        {typeof datum.actualKwh === 'number' && (
          <p className="text-emerald-500">
            Actual: {datum.actualKwh.toLocaleString()} kWh
          </p>
        )}
        {typeof datum.baselineKwh === 'number' && (
          <p className="text-secondary">
            Baseline: {datum.baselineKwh.toLocaleString()} kWh
          </p>
        )}
        {typeof datum.projectedKwh === 'number' && (
          <p className="text-sky-400">
            Projected: {datum.projectedKwh.toLocaleString()} kWh
          </p>
        )}
        {datum.isForecast && band && (
          <p className="text-[11px] text-muted">
            Range: {band[0].toLocaleString()} – {band[1].toLocaleString()} kWh
          </p>
        )}
      </div>
      {datum.driver && (
        <p className="mt-1.5 max-w-[220px] border-t border-border pt-1.5 text-[11px] text-secondary">
          {datum.driver}
        </p>
      )}
    </div>
  );
}

export function EnergyForecastCard() {
  const [horizonDays, setHorizonDays] = useState<ForecastHorizonDays>(7);
  const [scenario, setScenario] = useState<ForecastScenario>('baseline');
  const [forecast, setForecast] = useState<EnergyForecastResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const runForecast = useCallback(
    async (targetHorizon: ForecastHorizonDays, targetScenario: ForecastScenario) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/forecast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            horizonDays: targetHorizon,
            scenario: targetScenario,
            historicalTrend: LAST_7_DAYS_TREND,
          }),
        });

        const data = (await res.json()) as EnergyForecastResponse & { error?: string };
        if (!res.ok) {
          throw new Error(data.error || `Forecast request failed (${res.status}).`);
        }

        setForecast(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const message =
          err instanceof Error ? err.message : 'Unable to reach AI forecasting service.';
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void runForecast(horizonDays, scenario);
    return () => {
      abortRef.current?.abort();
    };
  }, [horizonDays, runForecast, scenario]);

  const chartData = useMemo(
    () => buildForecastChartSeries(LAST_7_DAYS_TREND, forecast),
    [forecast],
  );

  return (
    <section
      aria-label="AI energy consumption forecast"
      data-testid="energy-forecast-card"
      className="seon-density-pad rounded-xl border border-border bg-card p-5"
    >
      {/* Header & Controls */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-base font-semibold text-foreground">
              AI consumption forecast
            </h2>
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3 w-3" />
              <span>Gemini projection</span>
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            Forward daily portfolio load (kWh) projected from the 7-day trend under selected operating assumptions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Horizon toggle */}
          <div
            role="group"
            aria-label="Forecast horizon"
            className="inline-flex rounded-lg border border-border bg-background p-0.5"
          >
            {([7, 14] as const).map((days) => {
              const active = horizonDays === days;
              return (
                <button
                  key={days}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setHorizonDays(days)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-emerald-600 text-white'
                      : 'text-secondary hover:text-foreground'
                  }`}
                >
                  {days} days
                </button>
              );
            })}
          </div>

          {/* Scenario selector */}
          <label htmlFor="forecast-scenario-select" className="sr-only">
            Operating scenario
          </label>
          <select
            id="forecast-scenario-select"
            value={scenario}
            onChange={(e) => setScenario(e.target.value as ForecastScenario)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground focus:border-emerald-500 focus:outline-none"
          >
            <option value="baseline">Business as usual</option>
            <option value="hvac-optimized">HVAC off-peak optimization</option>
            <option value="high-occupancy">High-occupancy surge</option>
          </select>

          {/* Refresh action */}
          <button
            type="button"
            disabled={loading}
            onClick={() => void runForecast(horizonDays, scenario)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-card-muted disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            <span>{loading ? 'Forecasting…' : 'Refresh forecast'}</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 sm:flex-row sm:items-center"
        >
          <div className="flex items-start gap-2.5 text-xs text-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <div>
              <p className="font-medium">Could not load Gemini forecast</p>
              <p className="mt-0.5 text-secondary">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void runForecast(horizonDays, scenario)}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 self-start rounded-lg bg-red-600 px-3 text-xs font-medium text-white hover:bg-red-500 sm:self-auto"
          >
            Retry forecast
          </button>
        </div>
      )}

      {/* Forecast KPI Summary Strip */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-background/60 p-3.5">
          <p className="text-[11px] font-medium text-muted">
            Projected {horizonDays}-day total
          </p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">
            {forecast ? `${forecast.projectedTotalKwh.toLocaleString()} kWh` : loading ? '…' : '—'}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-3.5">
          <p className="text-[11px] font-medium text-muted">Delta vs baseline</p>
          <p
            className={`mt-1 inline-flex items-center gap-1 font-mono text-lg font-semibold tabular-nums ${
              forecast && forecast.deltaVsBaselinePercent <= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {forecast ? (
              <>
                {forecast.deltaVsBaselinePercent <= 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                <span>
                  {forecast.deltaVsBaselinePercent > 0 ? '+' : ''}
                  {forecast.deltaVsBaselinePercent}%
                </span>
              </>
            ) : loading ? (
              '…'
            ) : (
              '—'
            )}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-3.5">
          <p className="text-[11px] font-medium text-muted">Peak projected day</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">
            {forecast
              ? `${forecast.peakProjectedDay.date} · ${forecast.peakProjectedDay.kwh.toLocaleString()}`
              : loading
                ? '…'
                : '—'}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-3.5">
          <p className="text-[11px] font-medium text-muted">Model confidence</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-sky-500">
            {forecast ? `${forecast.confidenceScore}%` : loading ? '…' : '—'}
          </p>
        </div>
      </div>

      {/* Historical + Gemini Projection Composed Chart */}
      <div className="relative mt-5 h-72 w-full min-w-0">
        {loading && (
          <div
            aria-live="polite"
            className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/50 backdrop-blur-[1px]"
          >
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
              <span>Projecting {horizonDays}-day load with Gemini…</span>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 12, left: -8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="seonForecastFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={18}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ForecastTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <ReferenceLine
              x="Nov 12"
              stroke="var(--chart-axis)"
              strokeDasharray="3 3"
              label={{
                value: 'Today',
                position: 'top',
                fill: 'var(--chart-axis)',
                fontSize: 10,
              }}
            />
            <Area
              type="monotone"
              dataKey="projectedKwh"
              fill="url(#seonForecastFill)"
              stroke="none"
              legendType="none"
              tooltipType="none"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="actualKwh"
              name="Historical Actual (kWh)"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="baselineKwh"
              name="Rolling Baseline (kWh)"
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="2 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="projectedKwh"
              name="Gemini AI Forecast (kWh)"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }}
              activeDot={{ r: 5.5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Gemini Summary & Key Drivers */}
      {forecast && (
        <div className="mt-4 grid gap-4 border-t border-border pt-4 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold text-foreground">AI Forecast Summary</p>
            <p className="mt-1 text-xs leading-relaxed text-secondary">{forecast.summary}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:col-span-6">
            {forecast.drivers.map((drv) => (
              <div
                key={drv.factor}
                className="rounded-lg border border-border bg-background/60 p-2.5"
              >
                <p className="text-[11px] font-semibold text-foreground">{drv.factor}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted">{drv.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
