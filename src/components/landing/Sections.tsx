import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SeonLogo } from '../SeonLogo';

const FEATURES = [
  {
    index: '01',
    title: 'Real-time monitoring',
    scope: 'Implemented Demo',
    description:
      'Track building, room, and device load profiles across three commercial buildings with clear quota progress.',
    span: 'lg:col-span-2',
  },
  {
    index: '02',
    title: 'AI recommendations',
    scope: 'Gemini Streaming',
    description:
      'Chat with SEON Assistant for concise energy diagnostics, HVAC load strategies, and structured Markdown tables.',
    span: 'lg:col-span-1',
  },
  {
    index: '03',
    title: 'ESG intelligence',
    scope: 'Simulated Analytics',
    description:
      'Inspect Environmental, Energy Efficiency, Social Impact, and Governance scores alongside monthly carbon estimates.',
    span: 'lg:col-span-1',
  },
  {
    index: '04',
    title: 'Device intelligence',
    scope: 'Local Controls',
    description:
      'Open per-building control dialogs for Buildings A, B, and C with individual switches and auto-off countdown timers.',
    span: 'lg:col-span-2',
  },
  {
    index: '05',
    title: 'Predictive analytics',
    scope: 'Concept Positioning',
    description:
      'Designed to highlight off-peak pre-cooling windows and afternoon load spikes before monthly tariffs escalate.',
    span: 'lg:col-span-1',
  },
  {
    index: '06',
    title: 'Enterprise-grade',
    scope: 'Concept Positioning',
    description:
      'Owner-isolated account profiles, real PDF and CSV report exports, and persistent light/dark workspace themes.',
    span: 'lg:col-span-2',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Connect',
    description:
      'Conceptually ingest building smart meters, BMS telemetry, or historical facility energy logs into a unified portfolio model.',
  },
  {
    num: '02',
    title: 'Understand',
    description:
      'Surface category breakdowns, peak quota alerts, and concise Gemini explanations without digging through raw spreadsheets.',
  },
  {
    num: '03',
    title: 'Optimize',
    description:
      'Resolve high-load alerts, schedule timed device shutdowns in Monitoring, and export executive PDF or CSV reports.',
  },
];

const TECH_STACK = [
  'React 19',
  'TypeScript',
  'Express',
  'Tailwind v4',
  'Recharts',
  'Motion',
  'Google Gemini',
  'Firebase',
];

const TESTIMONIALS = [
  {
    name: 'Aisha Rahman',
    role: 'Head of Sustainability',
    org: 'Northwind',
    quote:
      'Having HVAC load, building alerts, and export-ready ESG summaries in one workspace cuts our weekly ops review in half.',
  },
  {
    name: 'Marco Silva',
    role: 'Operations Director',
    org: 'Kestrel Group',
    quote:
      'Per-building device controls and timed shutoffs make it straightforward to spot and stop after-hours lab waste.',
  },
  {
    name: 'Priya Menon',
    role: 'CFO',
    org: 'Orbital Labs',
    quote:
      'Clean executive PDFs and CSV exports give finance and sustainability teams the exact numbers they need without clutter.',
  },
];

export function LandingSections() {
  return (
    <>
      <section id="features" className="border-b border-border bg-card-muted/35 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Platform Capabilities
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl [text-wrap:balance]">
              Built for facility clarity, not dashboard noise.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-secondary sm:text-base">
              Every module pairs deterministic demonstration telemetry with real authentication,
              streaming Gemini chat, and downloadable reporting.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feat) => (
              <article
                key={feat.title}
                className={`flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-transform duration-200 hover:-translate-y-0.5 ${feat.span}`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {feat.index}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{feat.scope}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">
                    {feat.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-sky-600 dark:text-sky-400">
              Workflow Architecture
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              From raw facility readings to decisive action.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-xl border border-border bg-card p-6"
              >
                <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {step.num}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-xl border border-border bg-card p-6">
            <p className="text-xs font-medium text-muted">
              Core Technology Stack
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-foreground">
              {TECH_STACK.map((tech, idx) => (
                <React.Fragment key={tech}>
                  <span>{tech}</span>
                  {idx < TECH_STACK.length - 1 && (
                    <span aria-hidden="true" className="text-border">
                      /
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card-muted/35 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium text-muted">
                Illustrative Demonstration Scenarios
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Designed for operations, finance, and sustainability teams.
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <blockquote
                key={item.name}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-6"
              >
                <p className="text-sm leading-relaxed text-secondary">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted">
                    {item.role} · {item.org}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="flex justify-center">
            <SeonLogo size={44} showWordmark={false} />
          </div>
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl [text-wrap:balance]">
            Every kilowatt, accounted for.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-secondary sm:text-base">
            Sign in with email or Google to inspect the live SEON demonstration workspace, test
            per-building timers, query Gemini AI, and download formatted PDF or CSV reports.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/app"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-400 px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
            >
              Open the dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex h-11 items-center rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-card-muted"
            >
              Sign in or create account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
