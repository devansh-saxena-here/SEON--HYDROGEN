import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { SeonLogo } from '../SeonLogo';
import { useTheme } from '../ThemeProvider';

export function LandingNavbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 rounded-full border border-border/80 bg-card/75 px-4 shadow-sm backdrop-blur-xl sm:px-5">
        <Link
          to="/"
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <SeonLogo size={30} />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-secondary"
        >
          <a
            href="#features"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#how"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <Link
            to="/app/assistant"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-foreground"
          >
            AI Assistant
          </Link>
          <Link
            to="/app/esg"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-foreground"
          >
            ESG
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-secondary transition-colors hover:bg-card-muted hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/login"
            className="whitespace-nowrap shrink-0 px-2.5 py-1.5 text-sm font-medium text-secondary transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/app"
            className="whitespace-nowrap shrink-0 rounded-full bg-emerald-400 px-4 py-1.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
          >
            Launch app
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-secondary hover:bg-card-muted"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-xl md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:bg-card-muted hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:bg-card-muted hover:text-foreground"
            >
              How it works
            </a>
            <Link
              to="/app/assistant"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:bg-card-muted hover:text-foreground"
            >
              AI Assistant
            </Link>
            <Link
              to="/app/esg"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:bg-card-muted hover:text-foreground"
            >
              ESG
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 items-center justify-center rounded-full border border-border bg-background text-sm font-medium text-foreground"
              >
                Sign in
              </Link>
              <Link
                to="/app"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-slate-950"
              >
                Launch app
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
