import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Bell,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Sun,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useTheme } from './ThemeProvider';
import { useToast } from './ToastProvider';
import { SeonLogo } from './SeonLogo';
import {
  BUILDINGS,
  INITIAL_ALERTS,
  INITIAL_DEVICES,
  REPORTS_CATALOG,
  ROOMS,
} from '../lib/demo-data';

const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/monitoring', label: 'Monitoring', icon: Activity, end: false },
  { to: '/app/assistant', label: 'AI Assistant', icon: MessageSquare, end: false },
  { to: '/app/esg', label: 'ESG', icon: Leaf, end: false },
  { to: '/app/reports', label: 'Reports', icon: FileText, end: false },
  { to: '/app/settings', label: 'Settings', icon: Settings, end: false },
];

const ROUTE_TITLES: Record<string, string> = {
  '/app': 'Dashboard',
  '/app/monitoring': 'Monitoring',
  '/app/assistant': 'AI Assistant',
  '/app/esg': 'ESG Intelligence',
  '/app/reports': 'Reports',
  '/app/settings': 'Settings',
};

interface QuickResult {
  id: string;
  label: string;
  sublabel: string;
  to: string;
}

export function AppShell() {
  const { user, loading, signOutAccount } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    setMobileNavOpen(false);
    setProfileMenuOpen(false);
    setNotifOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const searchResults = useMemo<QuickResult[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: QuickResult[] = [];
    for (const b of BUILDINGS) {
      if (b.name.toLowerCase().includes(q)) {
        results.push({
          id: `b-${b.id}`,
          label: b.name,
          sublabel: `Building · ${b.usageKwh} kWh today`,
          to: `/app/monitoring?building=${b.id}`,
        });
      }
    }
    for (const r of ROOMS) {
      if (r.name.toLowerCase().includes(q) || r.buildingName.toLowerCase().includes(q)) {
        results.push({
          id: `r-${r.id}`,
          label: r.name,
          sublabel: `Room · ${r.buildingName}`,
          to: `/app/monitoring?tab=rooms&q=${encodeURIComponent(r.name)}`,
        });
      }
    }
    for (const d of INITIAL_DEVICES) {
      if (d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)) {
        results.push({
          id: `d-${d.id}`,
          label: d.name,
          sublabel: `Device · ${d.room}`,
          to: `/app/monitoring?tab=devices&q=${encodeURIComponent(d.name)}`,
        });
      }
    }
    for (const rep of REPORTS_CATALOG) {
      if (rep.title.toLowerCase().includes(q) || rep.period.toLowerCase().includes(q)) {
        results.push({
          id: `rep-${rep.id}`,
          label: rep.title,
          sublabel: `Report · ${rep.date}`,
          to: '/app/reports',
        });
      }
    }
    return results.slice(0, 6);
  }, [searchQuery]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <SeonLogo size={40} showWordmark={false} />
          <p className="text-sm text-muted">Loading SEON workspace…</p>
        </div>
      </div>
    );
  }

  const pageTitle = ROUTE_TITLES[location.pathname] ?? 'Workspace';

  const handleSignOut = async () => {
    try {
      await signOutAccount();
      toast({
        title: 'Signed out',
        description: 'Your SEON session has ended.',
        variant: 'info',
      });
      navigate('/login', { replace: true });
    } catch {
      toast({
        title: 'Sign out failed',
        description: 'Please try signing out again.',
        variant: 'error',
      });
    }
  };

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col justify-between p-4">
      <div>
        <div className="flex items-center justify-between px-2 py-2">
          <Link
            to="/"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            title="Return to SEON public home"
          >
            <SeonLogo size={34} />
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-muted hover:bg-card-muted hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Workspace" className="mt-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
                      : 'text-secondary hover:bg-card-muted hover:text-foreground'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="rounded-xl border border-border bg-card p-3.5 text-xs">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <BarChart3 className="h-3.5 w-3.5 text-emerald-500" />
          <span>Prototype workspace</span>
        </div>
        <p className="mt-1 leading-relaxed text-muted">
          All energy readings, alerts, and equipment states are simulated for demonstration.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 border-r border-border bg-sidebar">
        {renderSidebarContent()}
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-64 max-w-[82vw] border-r border-border bg-sidebar">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation sidebar"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm min-w-0">
              <span className="text-muted">SEON</span>
              <span className="text-border">/</span>
              <span className="truncate font-medium text-foreground">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search bar */}
            <div ref={searchRef} className="relative hidden md:block w-64 lg:w-72">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search buildings, devices, reports…"
                aria-label="Search buildings, devices, and reports"
                className="h-9 w-full rounded-lg border border-border bg-card pr-3 pl-9 text-xs text-foreground placeholder:text-muted focus:border-emerald-500 focus:outline-none"
              />
              {searchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute right-0 left-0 top-11 z-40 rounded-xl border border-border bg-card p-1.5 shadow-lg">
                  {searchResults.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-muted">No matching items found.</p>
                  ) : (
                    searchResults.map((res) => (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchOpen(false);
                          navigate(res.to);
                        }}
                        className="flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-card-muted"
                      >
                        <span className="text-xs font-medium text-foreground">{res.label}</span>
                        <span className="text-[11px] text-muted">{res.sublabel}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-secondary hover:bg-card-muted hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notifications popover */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-label="View alerts notifications"
                aria-expanded={notifOpen}
                className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-secondary hover:bg-card-muted hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                <span className="sr-only">4 demo alerts</span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 z-40 w-80 max-w-[90vw] rounded-xl border border-border bg-card p-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-semibold text-foreground">
                      Recent Demo Alerts
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        navigate('/app');
                      }}
                      className="text-xs font-medium text-emerald-500 hover:underline"
                    >
                      Open Dashboard
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {INITIAL_ALERTS.map((a) => (
                      <div
                        key={a.id}
                        className="rounded-lg border border-border bg-background/60 p-2.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span
                            className={`font-medium ${
                              a.severity === 'High'
                                ? 'text-red-500'
                                : a.severity === 'Medium'
                                  ? 'text-amber-500'
                                  : 'text-sky-500'
                            }`}
                          >
                            {a.severity}
                          </span>
                          <span className="text-muted">{a.timeAgo}</span>
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-foreground">{a.title}</p>
                        <p className="mt-0.5 text-[11px] text-muted">{a.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User profile dropdown */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-expanded={profileMenuOpen}
                aria-label="Open account menu"
                className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card pr-2.5 pl-1.5 text-sm hover:bg-card-muted"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    referrerPolicy="no-referrer"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-semibold text-white">
                    {user.initials}
                  </span>
                )}
                <span className="hidden sm:inline max-w-[110px] truncate text-xs font-medium text-foreground">
                  {user.firstName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-11 z-40 w-64 rounded-xl border border-border bg-card p-2 shadow-lg">
                  <div className="border-b border-border px-2.5 py-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.displayName}
                    </p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                    <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                      Signed in via {user.provider}
                    </p>
                  </div>
                  <div className="mt-1.5 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate('/app/settings');
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-secondary hover:bg-card-muted hover:text-foreground"
                    >
                      <UserIcon className="h-3.5 w-3.5" />
                      <span>Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate('/app/settings?tab=appearance');
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-secondary hover:bg-card-muted hover:text-foreground"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span>Settings</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-500/10"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
