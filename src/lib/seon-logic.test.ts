import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BUILDINGS,
  HOURLY_DATA,
  INITIAL_DEVICES,
  LAST_7_DAYS_TREND,
  REPORT_BUILDING_ROWS,
  REPORTS_CATALOG,
  ROOMS,
} from './demo-data';
import {
  applyDevicePowerToggle,
  applyDeviceTimerSelection,
  createInitialDeviceControlMap,
  filterDevices,
  filterRooms,
  formatCountdown,
  getDevicesForBuilding,
  tickDeviceTimers,
} from './monitoring-logic';
import { computeInitials, normalizeUserIdentity } from './user-identity';
import { buildReportCsv, escapeCsvCell, sanitizeReportFilename } from './csv-report';
import {
  compileEsgReportSummary,
  createEsgPdfDocument,
  sliceMonthlyDataByScope,
} from './esg-report';
import {
  buildForecastChartSeries,
  validateAndNormalizeForecast,
} from './forecast-logic';
import { signInSchema, signUpSchema } from './validation';

test('deterministic hourly data produces 24 exact points', () => {
  assert.equal(HOURLY_DATA.length, 24);
  assert.equal(HOURLY_DATA[0].hour, '00:00');
  assert.equal(HOURLY_DATA[23].hour, '23:00');
  assert.equal(HOURLY_DATA[0].kwh, 8);
});

test('building device mapping returns 5 for A, 3 for B, and 4 for C', () => {
  const devicesA = getDevicesForBuilding(INITIAL_DEVICES, ROOMS, 'a');
  const devicesB = getDevicesForBuilding(INITIAL_DEVICES, ROOMS, 'b');
  const devicesC = getDevicesForBuilding(INITIAL_DEVICES, ROOMS, 'c');

  assert.equal(devicesA.length, 5);
  assert.equal(devicesB.length, 3);
  assert.equal(devicesC.length, 4);
  assert.deepEqual(
    devicesC.map((d) => d.name),
    ['Library Lights', 'Library AC', 'Reading Desk Lamps', 'Ops Workstation 03'],
  );
});

test('room filtering strictly respects building ID without substring collision on "b"', () => {
  const buildingBRooms = filterRooms(ROOMS, 'b', '');
  assert.equal(buildingBRooms.length, 2);
  assert.ok(buildingBRooms.every((r) => r.buildingId === 'b'));

  const buildingCRooms = filterRooms(ROOMS, 'c', '');
  assert.equal(buildingCRooms.length, 1);
  assert.equal(buildingCRooms[0].name, 'Library');
});

test('device filtering filters by building and search query across name/room/type', () => {
  const cAcDevices = filterDevices(INITIAL_DEVICES, ROOMS, 'c', 'ac');
  assert.equal(cAcDevices.length, 1);
  assert.equal(cAcDevices[0].name, 'Library AC');
});

test('device timer state turns ON when timer selected, expires to OFF, and cancels on manual OFF', () => {
  const initialMap = createInitialDeviceControlMap(INITIAL_DEVICES);
  const projectorId = '3'; // initially OFF
  assert.equal(initialMap[projectorId].on, false);

  const now = 1_000_000;
  const timed = applyDeviceTimerSelection(initialMap[projectorId], 5, now);
  assert.equal(timed.on, true);
  assert.equal(timed.timerMin, 5);
  assert.equal(timed.timerEndsAt, now + 300_000);
  assert.equal(formatCountdown(timed.timerEndsAt, now + 59_000), '04:01');

  const tickResult = tickDeviceTimers({ ...initialMap, [projectorId]: timed }, now + 300_000);
  assert.deepEqual(tickResult.expiredDeviceIds, [projectorId]);
  assert.equal(tickResult.nextMap[projectorId].on, false);
  assert.equal(tickResult.nextMap[projectorId].timerEndsAt, null);

  const manuallyOff = applyDevicePowerToggle(timed, false);
  assert.equal(manuallyOff.on, false);
  assert.equal(manuallyOff.timerMin, null);
  assert.equal(manuallyOff.timerEndsAt, null);

  const clearTimerOnly = applyDeviceTimerSelection(timed, null, now);
  assert.equal(clearTimerOnly.on, true);
  assert.equal(clearTimerOnly.timerEndsAt, null);
});

test('user identity normalization handles metadata fallback, initials, and provider', () => {
  assert.equal(computeInitials('Devansh Saxena'), 'DS');
  assert.equal(computeInitials('Aisha'), 'AI');

  const normalized = normalizeUserIdentity({
    uid: 'u123',
    email: 'alex.chen@example.com',
    displayName: 'Alex Chen',
    providerId: 'google.com',
  });
  assert.equal(normalized.firstName, 'Alex');
  assert.equal(normalized.initials, 'AC');
  assert.equal(normalized.provider, 'Google');

  const fallbackEmail = normalizeUserIdentity({
    uid: 'u456',
    email: 'ops.lead@seon.io',
    providerId: 'password',
  });
  assert.equal(fallbackEmail.displayName, 'ops.lead');
  assert.equal(fallbackEmail.provider, 'Email');
});

test('CSV report builder escapes quotes, includes all building rows totaling 30021 kWh, and sanitizes filenames', () => {
  assert.equal(escapeCsvCell('Hello "World"'), '"Hello ""World"""');
  assert.equal(
    sanitizeReportFilename('November 2026 — Monthly Report', 'csv'),
    'november-2026-monthly-report.csv',
  );
  const sum = REPORT_BUILDING_ROWS.reduce((acc, b) => acc + b.kwh, 0);
  assert.equal(sum, 30021);
  assert.equal(BUILDINGS.length, 3);

  const csv = buildReportCsv(REPORTS_CATALOG[0]);
  assert.ok(csv.includes('"Total Consumption","30021","kWh"'));
  assert.ok(csv.includes('"Building C — Ops","12056","51","15","High Load"'));
});

test('auth validation rejects invalid email, short password, and blank display name', () => {
  assert.equal(signInSchema.safeParse({ email: 'bad', password: 'password1' }).success, false);
  assert.equal(signInSchema.safeParse({ email: 'a@b.com', password: '12345' }).success, false);
  assert.equal(
    signUpSchema.safeParse({ displayName: '   ', email: 'a@b.com', password: 'password1' }).success,
    false,
  );
  assert.equal(
    signUpSchema.safeParse({ displayName: 'Devansh', email: 'a@b.com', password: 'password1' }).success,
    true,
  );
});

test('last 7 days trend fixture has 7 days reconciling to 30,021 kWh and ending at today 4,218 kWh', () => {
  assert.equal(LAST_7_DAYS_TREND.length, 7);
  const sum = LAST_7_DAYS_TREND.reduce((acc, p) => acc + p.kwh, 0);
  assert.equal(sum, 30021);
  assert.equal(LAST_7_DAYS_TREND[LAST_7_DAYS_TREND.length - 1].kwh, 4218);
});

test('ESG report compiler aggregates existing application data across full-year, H2, and Q4 scopes', () => {
  assert.equal(sliceMonthlyDataByScope('full-year').length, 12);
  assert.equal(sliceMonthlyDataByScope('h2').length, 6);
  assert.equal(sliceMonthlyDataByScope('q4').length, 3);

  const fullYear = compileEsgReportSummary(
    { title: 'Annual ESG Summary', scope: 'full-year' },
    'Devansh Saxena',
    '2026-11-12',
  );
  assert.equal(fullYear.compositeScore, 79);
  assert.equal(fullYear.totalEnergyKwh, 244670);
  assert.equal(fullYear.totalCo2Tons, 114);
  assert.equal(fullYear.peakMonth.month, 'Jul');
  assert.equal(fullYear.lowestMonth.month, 'Feb');
  assert.equal(fullYear.impact.targetProgressPercent, 62);

  const q4 = compileEsgReportSummary({ title: 'Q4 ESG', scope: 'q4' });
  assert.equal(q4.totalEnergyKwh, 19430 + 18120 + 17640);
  assert.equal(q4.totalCo2Tons, 25.7);
});

test('ESG branded PDF generator produces a valid multi-section PDF document', () => {
  const { doc, filename } = createEsgPdfDocument(
    {
      title: 'SEON Environmental & ESG Performance Summary',
      scope: 'full-year',
      sections: {
        includeScores: true,
        includeMonthlyCarbon: true,
        includeBuildings: true,
        includeRecommendations: true,
      },
    },
    'Devansh Saxena',
    '2026-11-12',
  );

  assert.equal(filename, 'seon-environmental-esg-performance-summary-full-year.pdf');
  assert.ok(doc.getNumberOfPages() >= 2);
  const bytes = doc.output('arraybuffer').byteLength;
  assert.ok(bytes > 2500);
});

test('forecast validator normalizes bounds and rejects empty point payloads', () => {
  assert.throws(
    () => validateAndNormalizeForecast({ points: [] }, 7, 'baseline'),
    /did not return any projected days/,
  );

  const normalized = validateAndNormalizeForecast(
    {
      summary: 'Mild weekday load reduction with HVAC pre-cooling.',
      deltaVsBaselinePercent: -6.24,
      confidenceScore: 104,
      points: [
        { date: 'Nov 13', projectedKwh: 4100, lowerBoundKwh: 4200, upperBoundKwh: 3900, driver: 'HVAC shift' },
        { date: 'Nov 14', projectedKwh: 4320, lowerBoundKwh: 4100, upperBoundKwh: 4550, driver: 'R&D sprint' },
      ],
      drivers: [{ factor: 'HVAC', impact: '-6% peak shift' }],
    },
    7,
    'hvac-optimized',
  );

  assert.equal(normalized.projectedTotalKwh, 8420);
  assert.equal(normalized.confidenceScore, 99);
  assert.equal(normalized.deltaVsBaselinePercent, -6.2);
  assert.equal(normalized.peakProjectedDay.date, 'Nov 14');
  assert.equal(normalized.points[0].lowerBoundKwh, 4100);
  assert.equal(normalized.points[0].upperBoundKwh, 4100);

  const chart = buildForecastChartSeries(LAST_7_DAYS_TREND, normalized);
  assert.equal(chart.length, LAST_7_DAYS_TREND.length + normalized.points.length);
  const anchor = chart[LAST_7_DAYS_TREND.length - 1];
  assert.equal(anchor.date, 'Nov 12');
  assert.equal(anchor.actualKwh, 4218);
  assert.equal(anchor.projectedKwh, 4218);
  assert.equal(anchor.isForecast, false);
  assert.equal(chart[LAST_7_DAYS_TREND.length].isForecast, true);
});
