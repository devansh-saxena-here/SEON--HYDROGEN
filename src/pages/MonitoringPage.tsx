import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Power, Search, Sliders, X } from 'lucide-react';
import {
  BUILDINGS,
  INITIAL_DEVICES,
  ROOMS,
  TIMER_OPTIONS,
  type BuildingFixture,
} from '../lib/demo-data';
import {
  applyDevicePowerToggle,
  applyDeviceTimerSelection,
  createInitialDeviceControlMap,
  filterBuildings,
  filterDevices,
  filterRooms,
  formatCountdown,
  getDevicesForBuilding,
  tickDeviceTimers,
  type BuildingFilter,
  type DeviceControlMap,
} from '../lib/monitoring-logic';
import { useToast } from '../components/ToastProvider';

type MonitoringTab = 'buildings' | 'rooms' | 'devices';

export function MonitoringPage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const initialBuilding = (searchParams.get('building') as BuildingFilter) || 'all';
  const initialTab = (searchParams.get('tab') as MonitoringTab) || 'buildings';
  const initialQuery = searchParams.get('q') || '';

  const [tab, setTab] = useState<MonitoringTab>(
    initialTab === 'rooms' || initialTab === 'devices' ? initialTab : 'buildings',
  );
  const [buildingFilter, setBuildingFilter] = useState<BuildingFilter>(
    initialBuilding === 'a' || initialBuilding === 'b' || initialBuilding === 'c'
      ? initialBuilding
      : 'all',
  );
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [deviceControls, setDeviceControls] = useState<DeviceControlMap>(() =>
    createInitialDeviceControlMap(INITIAL_DEVICES),
  );
  const [activeDialogBuilding, setActiveDialogBuilding] = useState<BuildingFixture | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      const current = Date.now();
      setNowMs(current);
      setDeviceControls((prev) => {
        const { nextMap, expiredDeviceIds } = tickDeviceTimers(prev, current);
        if (expiredDeviceIds.length > 0) {
          for (const id of expiredDeviceIds) {
            const dev = INITIAL_DEVICES.find((d) => d.id === id);
            toast({
              title: 'Timed shutdown complete',
              description: dev ? `${dev.name} automatically turned OFF.` : 'Device turned OFF.',
              variant: 'info',
            });
          }
        }
        return nextMap;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [toast]);

  const visibleBuildings = useMemo(
    () => filterBuildings(BUILDINGS, buildingFilter, searchQuery),
    [buildingFilter, searchQuery],
  );
  const visibleRooms = useMemo(
    () => filterRooms(ROOMS, buildingFilter, searchQuery),
    [buildingFilter, searchQuery],
  );
  const visibleDevices = useMemo(
    () => filterDevices(INITIAL_DEVICES, ROOMS, buildingFilter, searchQuery),
    [buildingFilter, searchQuery],
  );

  const dialogDevices = useMemo(() => {
    if (!activeDialogBuilding) return [];
    return getDevicesForBuilding(INITIAL_DEVICES, ROOMS, activeDialogBuilding.id);
  }, [activeDialogBuilding]);

  const handleToggleDevice = (deviceId: string, nextOn: boolean) => {
    setDeviceControls((prev) => ({
      ...prev,
      [deviceId]: applyDevicePowerToggle(prev[deviceId], nextOn),
    }));
  };

  const handleTimerChange = (deviceId: string, value: string) => {
    const minutes = value === 'none' ? null : Number(value);
    const currentNow = Date.now();
    setNowMs(currentNow);
    setDeviceControls((prev) => ({
      ...prev,
      [deviceId]: applyDeviceTimerSelection(prev[deviceId], minutes, currentNow),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Energy Monitoring
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Representative sample of 3 buildings, 6 rooms, and 12 controllable demo devices (36 rooms / 129 portfolio total).
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter buildings, rooms, or devices…"
            aria-label="Filter monitoring items"
            className="h-10 w-full rounded-lg border border-border bg-background pr-3 pl-9 text-sm text-foreground placeholder:text-muted focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Building selector */}
          <div
            role="group"
            aria-label="Filter by building"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background p-1"
          >
            {(['all', 'a', 'b', 'c'] as const).map((bKey) => (
              <button
                key={bKey}
                type="button"
                onClick={() => setBuildingFilter(bKey)}
                className={`h-8 rounded-md px-3 text-xs font-medium transition-colors ${
                  buildingFilter === bKey
                    ? 'bg-emerald-600 text-white'
                    : 'text-secondary hover:text-foreground'
                }`}
              >
                {bKey === 'all' ? 'All' : `Building ${bKey.toUpperCase()}`}
              </button>
            ))}
          </div>

          {/* View tabs */}
          <div
            role="tablist"
            aria-label="Monitoring view"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background p-1"
          >
            {(['buildings', 'rooms', 'devices'] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`h-8 rounded-md px-3 text-xs font-medium capitalize transition-colors ${
                  tab === t
                    ? 'bg-card text-foreground shadow-xs border border-border'
                    : 'text-secondary hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buildings tab */}
      {tab === 'buildings' && (
        <div className="grid gap-4 md:grid-cols-3">
          {visibleBuildings.length === 0 ? (
            <div className="col-span-full rounded-xl border border-border bg-card p-8 text-center text-sm text-muted">
              No buildings match your current filter.
            </div>
          ) : (
            visibleBuildings.map((b) => {
              const pct = Math.min(100, Math.round((b.usageKwh / b.dailyThresholdKwh) * 100));
              const buildingSampleCount = getDevicesForBuilding(
                INITIAL_DEVICES,
                ROOMS,
                b.id,
              ).length;
              return (
                <article
                  key={b.id}
                  className="seon-density-pad flex flex-col justify-between rounded-xl border border-border bg-card p-5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-display text-lg font-semibold text-foreground">
                        {b.name}
                      </h2>
                      <span
                        className={`shrink-0 text-xs font-semibold ${
                          b.status === 'High Load'
                            ? 'text-amber-500'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="text-xs text-muted">Usage today</span>
                      <span className="font-mono text-xl font-semibold tabular-nums text-foreground">
                        {b.usageKwh} kWh
                      </span>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-card-muted">
                      <div
                        className={`h-full rounded-full ${
                          b.status === 'High Load' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <p className="mt-3 text-xs text-muted">
                      {b.roomsCount} rooms · {b.devicesCount} portfolio devices ({buildingSampleCount}{' '}
                      sample controls)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveDialogBuilding(b)}
                    className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-card-muted"
                  >
                    <Sliders className="h-4 w-4 text-emerald-500" />
                    <span>Control devices</span>
                  </button>
                </article>
              );
            })
          )}
        </div>
      )}

      {/* Rooms tab */}
      {tab === 'rooms' && (
        <div className="rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-card-muted/50 text-xs text-muted">
                  <th className="px-4 py-3 font-medium">Room</th>
                  <th className="px-4 py-3 font-medium">Building</th>
                  <th className="px-4 py-3 text-right font-medium">Devices</th>
                  <th className="px-4 py-3 text-right font-medium">Usage</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleRooms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">
                      No rooms match your filter.
                    </td>
                  </tr>
                ) : (
                  visibleRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-card-muted/35">
                      <td className="px-4 py-3 font-medium text-foreground">{room.name}</td>
                      <td className="px-4 py-3 text-secondary">{room.buildingName}</td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-secondary">
                        {room.devicesCount}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                        {room.usageKwh.toFixed(1)} kWh
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium ${
                            room.status === 'Critical'
                              ? 'text-red-500'
                              : room.status === 'Idle'
                                ? 'text-muted'
                                : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Devices tab */}
      {tab === 'devices' && (
        <div className="rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-card-muted/50 text-xs text-muted">
                  <th className="px-4 py-3 font-medium">Device</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Room</th>
                  <th className="px-4 py-3 text-right font-medium">Sample Load</th>
                  <th className="px-4 py-3 font-medium">Auto-off timer</th>
                  <th className="px-4 py-3 text-right font-medium">Power</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleDevices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">
                      No devices match your filter.
                    </td>
                  </tr>
                ) : (
                  visibleDevices.map((dev) => {
                    const ctrl = deviceControls[dev.id];
                    const countdown = formatCountdown(ctrl?.timerEndsAt ?? null, nowMs);
                    return (
                      <tr key={dev.id} className="hover:bg-card-muted/35">
                        <td className="px-4 py-3 font-medium text-foreground">{dev.name}</td>
                        <td className="px-4 py-3 text-secondary">{dev.type}</td>
                        <td className="px-4 py-3 text-secondary">{dev.room}</td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                          {dev.kwh.toFixed(1)} kWh
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <select
                              aria-label={`Auto-off timer for ${dev.name}`}
                              value={ctrl?.timerMin === null ? 'none' : String(ctrl?.timerMin)}
                              onChange={(e) => handleTimerChange(dev.id, e.target.value)}
                              className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
                            >
                              {TIMER_OPTIONS.map((opt) => (
                                <option
                                  key={opt.label}
                                  value={opt.minutes === null ? 'none' : String(opt.minutes)}
                                >
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            {countdown && (
                              <span className="font-mono text-xs tabular-nums text-emerald-500">
                                {countdown}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={ctrl?.on ?? false}
                            aria-label={`Toggle ${dev.name} power`}
                            onClick={() => handleToggleDevice(dev.id, !(ctrl?.on ?? false))}
                            className={`inline-flex h-7 w-14 items-center justify-center gap-1 rounded-md text-xs font-medium transition-colors ${
                              ctrl?.on
                                ? 'bg-emerald-600 text-white'
                                : 'border border-border bg-background text-muted'
                            }`}
                          >
                            <Power className="h-3 w-3" />
                            <span>{ctrl?.on ? 'ON' : 'OFF'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Per-building Device Control Dialog */}
      {activeDialogBuilding && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="device-control-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {activeDialogBuilding.name}
                </p>
                <h2
                  id="device-control-title"
                  className="mt-0.5 font-display text-lg font-semibold text-foreground"
                >
                  Device Control
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Local session controls and countdown timers (simulated hardware).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDialogBuilding(null)}
                aria-label="Close device control dialog"
                className="rounded-lg p-1.5 text-muted hover:bg-card-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {dialogDevices.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">
                  No representative fixtures configured for this building.
                </p>
              ) : (
                dialogDevices.map((dev) => {
                  const ctrl = deviceControls[dev.id];
                  const countdown = formatCountdown(ctrl?.timerEndsAt ?? null, nowMs);
                  return (
                    <div
                      key={dev.id}
                      className="rounded-xl border border-border bg-background/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {dev.name}
                            </span>
                            <span className="text-xs text-muted">· {dev.type}</span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted">
                            {dev.room} ·{' '}
                            <span className="font-mono tabular-nums">
                              {dev.kwh.toFixed(1)} kWh
                            </span>
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={ctrl?.on ?? false}
                          aria-label={`Toggle ${dev.name}`}
                          onClick={() => handleToggleDevice(dev.id, !(ctrl?.on ?? false))}
                          className={`inline-flex h-8 min-w-[68px] items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors ${
                            ctrl?.on
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                              : 'border border-border bg-card text-muted hover:text-foreground'
                          }`}
                        >
                          <Power className="h-3.5 w-3.5" />
                          <span>{ctrl?.on ? 'ON' : 'OFF'}</span>
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-muted" />
                          <select
                            aria-label={`Timer for ${dev.name}`}
                            value={ctrl?.timerMin === null ? 'none' : String(ctrl?.timerMin)}
                            onChange={(e) => handleTimerChange(dev.id, e.target.value)}
                            className="h-8 rounded-md border border-border bg-card px-2.5 text-xs text-foreground"
                          >
                            {TIMER_OPTIONS.map((opt) => (
                              <option
                                key={opt.label}
                                value={opt.minutes === null ? 'none' : String(opt.minutes)}
                              >
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {countdown ? (
                          <span className="font-mono text-xs font-medium tabular-nums text-emerald-500">
                            Auto-off in {countdown}
                          </span>
                        ) : (
                          <span className="text-xs text-muted">No active timer</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end border-t border-border px-5 py-3.5">
              <button
                type="button"
                onClick={() => setActiveDialogBuilding(null)}
                className="h-9 rounded-lg bg-emerald-600 px-4 text-xs font-medium text-white hover:bg-emerald-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
