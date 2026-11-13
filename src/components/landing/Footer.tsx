import React from 'react';
import { Link } from 'react-router-dom';
import { SeonLogo } from '../SeonLogo';

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card-muted/40 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center">
              <SeonLogo size={36} />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-secondary">
              Smart Energy Optimization Network — an AI-powered MVP demonstrating building energy
              analytics, device scheduling, ESG scoring, and executive reporting.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-foreground">Product</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-secondary">
                <li>
                  <Link to="/app" className="hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/app/monitoring" className="hover:text-foreground">
                    Monitoring
                  </Link>
                </li>
                <li>
                  <Link to="/app/assistant" className="hover:text-foreground">
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link to="/app/esg" className="hover:text-foreground">
                    ESG
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wide text-foreground">Workspace</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-secondary">
                <li>
                  <Link to="/app/reports" className="hover:text-foreground">
                    Reports
                  </Link>
                </li>
                <li>
                  <Link to="/app/settings" className="hover:text-foreground">
                    Settings
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-foreground">
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wide text-foreground">Overview</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-secondary">
                <li>
                  <a href="#features" className="hover:text-foreground">
                    Capabilities
                  </a>
                </li>
                <li>
                  <a href="#how" className="hover:text-foreground">
                    How it works
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {year} SEON — Smart Energy Optimization Network. Simulated MVP data.</p>
          <Link to="/app" className="font-medium text-foreground hover:text-emerald-500">
            Developer - Devansh Saxena
          </Link>
        </div>
      </div>
    </footer>
  );
}
