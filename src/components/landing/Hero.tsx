import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Activity, ArrowRight, Leaf, Sparkles } from 'lucide-react';

const HERO_BARS = [
  { day: 'Mon', pct: 32 },
  { day: 'Tue', pct: 48 },
  { day: 'Wed', pct: 68 },
  { day: 'Thu', pct: 52 },
  { day: 'Fri', pct: 82 },
  { day: 'Sat', pct: 94 },
  { day: 'Sun', pct: 44 },
];

export function Hero() {
  return (
    <section className="relative -mt-18 overflow-hidden border-b border-border pt-32 pb-16 sm:pt-36 sm:pb-24">
      {/* Atmospheric teal-emerald hero backdrop matching reference */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 dark:bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(16,120,115,0.42),rgba(11,55,75,0.22)_45%,transparent_78%)] bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(16,185,129,0.14),rgba(56,189,248,0.08)_45%,transparent_78%)]"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-card/65 px-3.5 py-1 text-xs font-medium text-secondary backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>Gemini-powered energy intelligence</span>
        </div>

        <h1 className="mt-7 font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-[4rem] lg:leading-[1.06] [text-wrap:balance]">
          The operating system for{' '}
          <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            smart energy.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
          SEON unifies real-time monitoring, AI recommendations, and ESG reporting into one calm,
          elegant workspace — so your buildings run leaner every hour.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            to="/app"
            className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-emerald-400 px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
          >
            <span>Open dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex h-11 items-center whitespace-nowrap rounded-full border border-border bg-card/70 px-6 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-card-muted"
          >
            Explore features
          </a>
        </div>

        {/* Centered Live Overview preview card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-14 w-full max-w-4xl rounded-2xl border border-border/90 bg-card/85 p-5 text-left shadow-2xl backdrop-blur-xl sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-medium tracking-wider uppercase text-muted">
                Live overview
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold text-foreground sm:text-xl">
                Today&apos;s consumption
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-secondary">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              <span>Demo</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3.5 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-background/55 p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Activity className="h-3.5 w-3.5 text-muted" />
                <span>Total kWh</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                  4,218
                </span>
                <span className="font-mono text-xs tabular-nums text-muted">-6.4%</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/55 p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                <span>CO₂ avoided</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                  1.82 t
                </span>
                <span className="font-mono text-xs font-medium tabular-nums text-emerald-500 dark:text-emerald-400">
                  +12.1%
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/55 p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>AI optimizations</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                  14
                </span>
                <span className="text-xs font-medium text-emerald-500 dark:text-emerald-400">
                  active
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid h-40 grid-cols-7 items-end gap-2.5 sm:h-48 sm:gap-3.5">
            {HERO_BARS.map((bar, idx) => (
              <div key={bar.day} className="flex h-full flex-col items-center justify-end gap-2">
                <div className="flex w-full flex-1 items-end">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    style={{ height: `${bar.pct}%`, transformOrigin: 'bottom' }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-emerald-700/80 via-emerald-500 to-teal-300"
                  />
                </div>
                <span className="font-mono text-[11px] text-muted">{bar.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
