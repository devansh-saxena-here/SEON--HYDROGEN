import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowUpRight, Check, CheckCircle2, Sparkles } from 'lucide-react';
import {
  AI_INSIGHTS,
  BUILDINGS,
  CATEGORY_DATA,
  HOURLY_DATA,
  INITIAL_ALERTS,
  KPI_CARDS,
  LAST_7_DAYS_TREND,
  RECENT_ACTIVITY,
  WEEKLY_DATA,
  type EnergyAlert,
} from '../lib/demo-data';
import { useUser } from '../hooks/useUser';
import { useCountUp } from '../hooks/useCountUp';
import { useToast } from '../components/ToastProvider';
import { EnergyForecastCard } from '../components/EnergyForecastCard';

function AnimatedKpiValue({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const animated = useCountUp(value);
  return (
    <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-foreground sm:text-[1.65rem]">
      {prefix}
      {animated.toLocaleString()}
      {suffix}
    </span>
  );
}

export function DashboardPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const [alerts, setAlerts] = useState<EnergyAlert[]>(INITIAL_ALERTS);
  const [appliedInsights, setAppliedInsights] = useState<Record<string, boolean>>({});

  const openAlertsCount = alerts.filter((a) => a.status === 'open').length;

  const handleAlertAction = (id: string, nextStatus: 'resolved' | 'optimized') => {
    setAlerts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)),
    );
    const target = alerts.find((a) => a.id === id);
    toast({
      title: nextStatus === 'resolved' ? 'Alert resolved' : 'Auto-optimization simulated',
      description: target
        ? `${target.title} marked as ${nextStatus === 'resolved' ? 'Resolved' : 'Optimized by AI'}.`
        : undefined,
      variant: 'success',
    });
  };

  const handleApplyInsight = (id: string, title: string) => {
    setAppliedInsights((prev) => ({ ...prev, [id]: true }));
    toast({
      title: 'Recommendation queued (simulated)',
      description: title,
      variant: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Good afternoon, {user?.firstName || 'there'}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Here&apos;s your energy overview.
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/app/reports"
            className="inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-card-muted"
          >
            <span>Generate report</span>
            <ArrowUpRight className="h-4 w-4 text-muted" />
          </Link>
          <Link
            to="/app/assistant"
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            <Sparkles className="h-4 w-4" />
            <span>Ask SEON</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI tiles */}
      <section aria-label="Key energy metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <div
            key={card.id}
            className="seon-density-pad rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted">{card.label}</span>
              <span
                className={`font-mono text-xs font-medium tabular-nums ${
                  card.positive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {card.delta}
              </span>
            </div>
            <div className="mt-2">
              <AnimatedKpiValue
                value={card.value}
                prefix={card.prefix}
                suffix={card.suffix}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted">{card.note}</p>
          </div>
        ))}
      </section>

      {/* Charts row */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* Hourly consumption area chart */}
        <div className="seon-density-pad rounded-xl border border-border bg-card p-5 lg:col-span-7">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Hourly consumption
              </h2>
              <p className="text-xs text-muted">24-hour deterministic load curve (kWh)</p>
            </div>
            <span className="font-mono text-xs text-muted">00:00 – 23:00</span>
          </div>
          <div className="mt-4 h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="seonHourlyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis
                  tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  unit=" kWh"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-hairline)',
                    borderRadius: '0.625rem',
                    fontSize: '12px',
                    color: 'var(--fg-primary)',
                  }}
                  formatter={(value: unknown) => [`${value} kWh`, 'Usage']}
                />
                <Area
                  type="monotone"
                  dataKey="kwh"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#seonHourlyFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution donut */}
        <div className="seon-density-pad rounded-xl border border-border bg-card p-5 lg:col-span-5">
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">
              Category distribution
            </h2>
            <p className="text-xs text-muted">Share of total facility load (%)</p>
          </div>
          <div className="mt-4 grid items-center gap-4 sm:grid-cols-2">
            <div className="h-52 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={2}
                  >
                    {CATEGORY_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-hairline)',
                      borderRadius: '0.625rem',
                      fontSize: '12px',
                      color: 'var(--fg-primary)',
                    }}
                    formatter={(value: unknown) => [`${value}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2.5 text-xs">
              {CATEGORY_DATA.map((slice) => (
                <li key={slice.name} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-secondary">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-xs"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span>{slice.name}</span>
                  </span>
                  <span className="font-mono font-medium tabular-nums text-foreground">
                    {slice.value}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7-day trend LineChart & Weekly usage vs target */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div
          data-testid="seven-day-trend-card"
          className="seon-density-pad rounded-xl border border-border bg-card p-5 lg:col-span-6"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Last 7 days consumption trend
              </h2>
              <p className="text-xs text-muted">
                Daily portfolio consumption vs rolling baseline (kWh)
              </p>
            </div>
            <span className="font-mono text-xs font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
              30,021 kWh total
            </span>
          </div>
          <div className="mt-4 h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={LAST_7_DAYS_TREND}
                margin={{ top: 8, right: 12, left: -8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[3600, 4800]}
                  tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-hairline)',
                    borderRadius: '0.625rem',
                    fontSize: '12px',
                    color: 'var(--fg-primary)',
                  }}
                  formatter={(value: unknown, name: unknown) => [
                    `${Number(value).toLocaleString()} kWh`,
                    String(name),
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="kwh"
                  name="Daily Consumption"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#10b981', strokeWidth: 0 }}
                  activeDot={{ r: 5.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  name="7-Day Baseline"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="seon-density-pad rounded-xl border border-border bg-card p-5 lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Weekly usage vs target
              </h2>
              <p className="text-xs text-muted">Daily kWh compared against target envelope</p>
            </div>
            <span className="font-mono text-xs text-muted">4,004 kWh sample</span>
          </div>
          <div className="mt-4 h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-hairline)',
                    borderRadius: '0.625rem',
                    fontSize: '12px',
                    color: 'var(--fg-primary)',
                  }}
                />
                <Bar dataKey="kwh" name="Actual (kWh)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target (kWh)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* AI-driven energy consumption forecast */}
      <EnergyForecastCard />

      {/* Alerts panel & Buildings overview */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="seon-density-pad rounded-xl border border-border bg-card p-5 lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Active alerts
              </h2>
              <p className="text-xs text-muted">
                Simulated anomaly actions update local workspace state
              </p>
            </div>
            <span className="font-mono text-xs font-medium tabular-nums text-foreground">
              {openAlertsCount} open
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border border-border bg-background/60 p-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`font-semibold ${
                        alert.severity === 'High'
                          ? 'text-red-500'
                          : alert.severity === 'Medium'
                            ? 'text-amber-500'
                            : 'text-sky-500'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span aria-hidden="true" className="text-border">
                      ·
                    </span>
                    <span className="text-muted">{alert.timeAgo}</span>
                  </div>

                  {alert.status !== 'open' && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>
                        {alert.status === 'resolved' ? 'Resolved' : 'Optimized by AI'}
                      </span>
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-sm font-medium text-foreground">{alert.title}</p>
                <p className="mt-0.5 text-xs text-secondary">{alert.description}</p>

                {alert.status === 'open' && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAlertAction(alert.id, 'resolved')}
                      className="inline-flex h-8 flex-1 sm:flex-none items-center justify-center whitespace-nowrap rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-card-muted"
                    >
                      Resolve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAlertAction(alert.id, 'optimized')}
                      className="inline-flex h-8 flex-1 sm:flex-none items-center justify-center whitespace-nowrap rounded-lg bg-emerald-600 px-3 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
                    >
                      Auto-Optimize
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buildings overview */}
        <div className="seon-density-pad rounded-xl border border-border bg-card p-5 lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-semibold text-foreground">
              Buildings overview
            </h2>
            <Link
              to="/app/monitoring"
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {BUILDINGS.map((b) => {
              const pct = Math.min(100, Math.round((b.usageKwh / b.dailyThresholdKwh) * 100));
              return (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-foreground truncate">{b.name}</span>
                    <span
                      className={`shrink-0 text-xs font-medium ${
                        b.status === 'High Load'
                          ? 'text-amber-500'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>
                      {b.roomsCount} rooms · {b.devicesCount} devices
                    </span>
                    <span className="font-mono tabular-nums text-foreground">
                      {b.usageKwh} / {b.dailyThresholdKwh} kWh
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-card-muted">
                    <div
                      className={`h-full rounded-full ${
                        b.status === 'High Load' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI insights & Recent activity */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* AI insights */}
        <div className="seon-density-pad rounded-xl border border-border bg-card p-5 lg:col-span-6">
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">AI insights</h2>
            <p className="text-xs text-muted">Estimated savings opportunities (demo)</p>
          </div>
          <div className="mt-4 space-y-3">
            {AI_INSIGHTS.map((ins) => {
              const isApplied = Boolean(appliedInsights[ins.id]);
              return (
                <div
                  key={ins.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background/60 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {ins.category} · {ins.saving}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">{ins.title}</p>
                  </div>
                  <button
                    type="button"
                    disabled={isApplied}
                    onClick={() => handleApplyInsight(ins.id, ins.title)}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      isApplied
                        ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                        : 'border border-border bg-card text-foreground hover:bg-card-muted'
                    }`}
                  >
                    {isApplied ? (
                      <span className="inline-flex items-center gap-1">
                        <Check className="h-3 w-3" /> Queued
                      </span>
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div className="seon-density-pad rounded-xl border border-border bg-card p-5 lg:col-span-6">
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">
              Recent activity
            </h2>
            <p className="text-xs text-muted">Demo event timeline</p>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {RECENT_ACTIVITY.map((act) => (
              <li key={act.id} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-medium text-foreground">{act.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {act.type} · {act.time}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
