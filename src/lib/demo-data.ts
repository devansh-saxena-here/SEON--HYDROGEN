export interface HourlyPoint {
  hour: string;
  kwh: number;
}

export interface CategorySlice {
  name: string;
  value: number;
  color: string;
}

export interface WeeklyPoint {
  day: string;
  kwh: number;
  target: number;
}

export interface SevenDayTrendPoint {
  date: string;
  kwh: number;
  baseline: number;
}

export type AlertSeverity = 'High' | 'Medium' | 'Low';
export type AlertStatus = 'open' | 'resolved' | 'optimized';

export interface EnergyAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timeAgo: string;
  buildingId: 'a' | 'b' | 'c';
  status: AlertStatus;
}

export interface AiInsight {
  id: string;
  title: string;
  saving: string;
  category: string;
  impactDetail: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: string;
}

export interface BuildingFixture {
  id: 'a' | 'b' | 'c';
  code: 'A' | 'B' | 'C';
  shortName: string;
  name: string;
  usageKwh: number;
  dailyThresholdKwh: number;
  devicesCount: number;
  roomsCount: number;
  status: 'Optimal' | 'High Load';
}

export interface RoomFixture {
  id: string;
  name: string;
  buildingId: 'a' | 'b' | 'c';
  buildingName: string;
  devicesCount: number;
  usageKwh: number;
  status: 'Active' | 'Idle' | 'Critical';
}

export interface DeviceFixture {
  id: string;
  name: string;
  type: 'AC' | 'Lights' | 'Projector' | 'Computer' | 'Printer' | 'Fan';
  room: string;
  kwh: number;
  initialOn: boolean;
}

export interface EsgScoreItem {
  id: string;
  label: string;
  score: number;
  color: string;
}

export interface EsgMonthlyPoint {
  month: string;
  energyKwh: number;
  co2Tons: number;
}

export interface ReportCatalogItem {
  id: string;
  title: string;
  period: 'Monthly' | 'Weekly' | 'Quarterly' | 'Annual';
  date: string;
  sampleSize: string;
}

export interface ReportBuildingSummary {
  name: string;
  kwh: number;
  devices: number;
  rooms: number;
  status: 'Optimal' | 'High Load';
}

export function buildDeterministicHourlyData(): HourlyPoint[] {
  return Array.from({ length: 24 }, (_, h) => {
    const hour = String(h).padStart(2, '0') + ':00';
    const kwh = Math.round(
      30 + Math.sin(((h - 6) / 24) * 2 * Math.PI) * 22 + ((h * 37) % 8),
    );
    return { hour, kwh };
  });
}

export const HOURLY_DATA: HourlyPoint[] = buildDeterministicHourlyData();

export const KPI_CARDS = [
  {
    id: 'today',
    label: 'Today',
    value: 4218,
    suffix: ' kWh',
    delta: '-6.4%',
    positive: true,
    note: 'vs yesterday (demo)',
  },
  {
    id: 'week',
    label: 'This week',
    value: 30021,
    suffix: ' kWh',
    delta: '-3.1%',
    positive: true,
    note: 'vs prior week (demo)',
  },
  {
    id: 'month',
    label: 'This month',
    value: 128420,
    suffix: ' kWh',
    delta: '+1.8%',
    positive: false,
    note: 'vs prior month (demo)',
  },
  {
    id: 'portfolio',
    label: 'Buildings · Devices',
    value: 129,
    prefix: '3 · ',
    suffix: '',
    delta: 'Simulated',
    positive: true,
    note: '36 portfolio rooms',
  },
];

export const CATEGORY_DATA: CategorySlice[] = [
  { name: 'HVAC', value: 42, color: '#10b981' },
  { name: 'Computing', value: 24, color: '#0ea5e9' },
  { name: 'Lighting', value: 18, color: '#6366f1' },
  { name: 'Appliances', value: 10, color: '#f59e0b' },
  { name: 'Other', value: 6, color: '#64748b' },
];

export const WEEKLY_DATA: WeeklyPoint[] = [
  { day: 'Mon', kwh: 612, target: 700 },
  { day: 'Tue', kwh: 588, target: 700 },
  { day: 'Wed', kwh: 704, target: 700 },
  { day: 'Thu', kwh: 649, target: 700 },
  { day: 'Fri', kwh: 731, target: 700 },
  { day: 'Sat', kwh: 402, target: 500 },
  { day: 'Sun', kwh: 318, target: 500 },
];

export const LAST_7_DAYS_TREND: SevenDayTrendPoint[] = [
  { date: 'Nov 6', kwh: 4380, baseline: 4450 },
  { date: 'Nov 7', kwh: 4195, baseline: 4300 },
  { date: 'Nov 8', kwh: 4490, baseline: 4350 },
  { date: 'Nov 9', kwh: 4310, baseline: 4480 },
  { date: 'Nov 10', kwh: 4512, baseline: 4500 },
  { date: 'Nov 11', kwh: 3916, baseline: 4390 },
  { date: 'Nov 12', kwh: 4218, baseline: 4506 },
];

export const INITIAL_ALERTS: EnergyAlert[] = [
  {
    id: 'alt-1',
    severity: 'High',
    title: 'Peak consumption detected',
    description: 'Building C exceeded 95% of daily quota at 14:20',
    timeAgo: '2m ago',
    buildingId: 'c',
    status: 'open',
  },
  {
    id: 'alt-2',
    severity: 'Medium',
    title: 'AC running after office hours',
    description: 'R&D Lab AC Unit 07 active past 21:00 for three nights',
    timeAgo: '1h ago',
    buildingId: 'b',
    status: 'open',
  },
  {
    id: 'alt-3',
    severity: 'Low',
    title: 'Lights left ON',
    description: 'Reception lighting active in an unoccupied period',
    timeAgo: '3h ago',
    buildingId: 'a',
    status: 'open',
  },
  {
    id: 'alt-4',
    severity: 'Medium',
    title: 'High usage spike',
    description: 'Server Room load 18% above baseline',
    timeAgo: '6h ago',
    buildingId: 'b',
    status: 'open',
  },
];

export const AI_INSIGHTS: AiInsight[] = [
  {
    id: 'ins-1',
    title: 'Shift HVAC pre-cooling to off-peak',
    saving: '~8.2% saving',
    category: 'HVAC',
    impactDetail: 'Pre-cool Building A & C between 05:30 and 07:30 before tariff peak.',
  },
  {
    id: 'ins-2',
    title: 'Auto-dim corridor lights after 20:00',
    saving: '~3.1% saving',
    category: 'Lighting',
    impactDetail: 'Reduce evening standby illumination to 35% outside active bookings.',
  },
  {
    id: 'ins-3',
    title: 'Consolidate idle workstations',
    saving: '~2.4% saving',
    category: 'Computing',
    impactDetail: 'Hibernate inactive desktop nodes in R&D Lab and Library after 25m.',
  },
  {
    id: 'ins-4',
    title: 'Schedule server backup at 03:00',
    saving: '~1.6% saving',
    category: 'Computing',
    impactDetail: 'Move heavy compute snapshots out of afternoon thermal load window.',
  },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Monthly ESG report generated',
    time: 'Today, 09:12',
    type: 'Report',
  },
  {
    id: 'act-2',
    title: 'AI optimization plan accepted',
    time: 'Yesterday, 17:44',
    type: 'AI',
  },
  {
    id: 'act-3',
    title: 'Building C threshold updated to 300 kWh',
    time: 'Mon, 11:20',
    type: 'Config',
  },
  {
    id: 'act-4',
    title: 'Three devices auto-scheduled to standby',
    time: 'Sun, 22:05',
    type: 'Automation',
  },
];

export const BUILDINGS: BuildingFixture[] = [
  {
    id: 'a',
    code: 'A',
    shortName: 'Building A',
    name: 'Building A — HQ',
    usageKwh: 245,
    dailyThresholdKwh: 300,
    devicesCount: 42,
    roomsCount: 12,
    status: 'Optimal',
  },
  {
    id: 'b',
    code: 'B',
    shortName: 'Building B',
    name: 'Building B — R&D',
    usageKwh: 198,
    dailyThresholdKwh: 300,
    devicesCount: 36,
    roomsCount: 9,
    status: 'Optimal',
  },
  {
    id: 'c',
    code: 'C',
    shortName: 'Building C',
    name: 'Building C — Ops',
    usageKwh: 276,
    dailyThresholdKwh: 300,
    devicesCount: 51,
    roomsCount: 15,
    status: 'High Load',
  },
];

export const ROOMS: RoomFixture[] = [
  {
    id: '1',
    name: 'Conference Room 3F',
    buildingId: 'a',
    buildingName: 'Building A',
    devicesCount: 6,
    usageKwh: 32.4,
    status: 'Active',
  },
  {
    id: '2',
    name: 'R&D Lab',
    buildingId: 'b',
    buildingName: 'Building B',
    devicesCount: 14,
    usageKwh: 68.1,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Executive Office',
    buildingId: 'a',
    buildingName: 'Building A',
    devicesCount: 4,
    usageKwh: 12.9,
    status: 'Idle',
  },
  {
    id: '4',
    name: 'Reception',
    buildingId: 'a',
    buildingName: 'Building A',
    devicesCount: 3,
    usageKwh: 4.2,
    status: 'Active',
  },
  {
    id: '5',
    name: 'Library',
    buildingId: 'c',
    buildingName: 'Building C',
    devicesCount: 8,
    usageKwh: 18.7,
    status: 'Active',
  },
  {
    id: '6',
    name: 'Server Room',
    buildingId: 'b',
    buildingName: 'Building B',
    devicesCount: 12,
    usageKwh: 92.3,
    status: 'Critical',
  },
];

export const INITIAL_DEVICES: DeviceFixture[] = [
  {
    id: '1',
    name: 'AC Unit 01',
    type: 'AC',
    room: 'Conference Room 3F',
    kwh: 14.2,
    initialOn: true,
  },
  {
    id: '2',
    name: 'Ceiling Lights',
    type: 'Lights',
    room: 'Conference Room 3F',
    kwh: 3.1,
    initialOn: true,
  },
  {
    id: '3',
    name: 'Projector',
    type: 'Projector',
    room: 'Conference Room 3F',
    kwh: 1.4,
    initialOn: false,
  },
  {
    id: '4',
    name: 'Server Rack A',
    type: 'Computer',
    room: 'Server Room',
    kwh: 42.6,
    initialOn: true,
  },
  {
    id: '5',
    name: 'Workstation 12',
    type: 'Computer',
    room: 'R&D Lab',
    kwh: 2.8,
    initialOn: true,
  },
  {
    id: '6',
    name: 'Office Printer',
    type: 'Printer',
    room: 'Executive Office',
    kwh: 0.6,
    initialOn: false,
  },
  {
    id: '7',
    name: 'Ceiling Fan',
    type: 'Fan',
    room: 'Reception',
    kwh: 0.4,
    initialOn: true,
  },
  {
    id: '8',
    name: 'AC Unit 07',
    type: 'AC',
    room: 'R&D Lab',
    kwh: 16.9,
    initialOn: true,
  },
  {
    id: '9',
    name: 'Library Lights',
    type: 'Lights',
    room: 'Library',
    kwh: 4.8,
    initialOn: true,
  },
  {
    id: '10',
    name: 'Library AC',
    type: 'AC',
    room: 'Library',
    kwh: 12.3,
    initialOn: true,
  },
  {
    id: '11',
    name: 'Reading Desk Lamps',
    type: 'Lights',
    room: 'Library',
    kwh: 1.6,
    initialOn: true,
  },
  {
    id: '12',
    name: 'Ops Workstation 03',
    type: 'Computer',
    room: 'Library',
    kwh: 2.1,
    initialOn: false,
  },
];

export const ESG_SCORES: EsgScoreItem[] = [
  { id: 'env', label: 'Environmental', score: 82, color: '#10b981' },
  { id: 'eff', label: 'Energy Efficiency', score: 76, color: '#0ea5e9' },
  { id: 'soc', label: 'Social Impact', score: 71, color: '#6366f1' },
  { id: 'gov', label: 'Governance', score: 88, color: '#14b8a6' },
];

export const ESG_MONTHLY_DATA: EsgMonthlyPoint[] = [
  { month: 'Jan', energyKwh: 18420, co2Tons: 8.6 },
  { month: 'Feb', energyKwh: 17210, co2Tons: 8.0 },
  { month: 'Mar', energyKwh: 19110, co2Tons: 8.9 },
  { month: 'Apr', energyKwh: 20340, co2Tons: 9.5 },
  { month: 'May', energyKwh: 21980, co2Tons: 10.3 },
  { month: 'Jun', energyKwh: 23120, co2Tons: 10.8 },
  { month: 'Jul', energyKwh: 24500, co2Tons: 11.4 },
  { month: 'Aug', energyKwh: 23860, co2Tons: 11.1 },
  { month: 'Sep', energyKwh: 20940, co2Tons: 9.7 },
  { month: 'Oct', energyKwh: 19430, co2Tons: 9.1 },
  { month: 'Nov', energyKwh: 18120, co2Tons: 8.4 },
  { month: 'Dec', energyKwh: 17640, co2Tons: 8.2 },
];

export const ESG_IMPACT = {
  co2SavedYtd: 12.4,
  annualTarget: 20,
  targetProgressPercent: 62, // 12.4 / 20 = 62%
  equivalentTrees: 512,
  greenImprovement: '+14%',
  momImprovement: '-14%',
};

export const ESG_RECOMMENDATIONS = [
  {
    id: 'esg-r1',
    title: 'Off-peak HVAC pre-cooling',
    detail: 'Shift pre-cooling window to reduce peak-load CO2 by approximately 8%.',
    saving: '~8.2%',
  },
  {
    id: 'esg-r2',
    title: 'Occupancy-based corridor-light dimming',
    detail: 'Dim low-traffic circulation corridors after 20:00 across Buildings A and B.',
    saving: '~3.1%',
  },
  {
    id: 'esg-r3',
    title: 'Power-saving consolidation for idle workstations',
    detail: 'Enforce automated sleep policies on unoccupied R&D and Library workstations.',
    saving: '~2.4%',
  },
  {
    id: 'esg-r4',
    title: "Solar shading for Building C's south-facing facade",
    detail: 'Automated facade louvers reduce afternoon solar heat gain and chiller load.',
    saving: '~4.0%',
  },
];

export const REPORTS_CATALOG: ReportCatalogItem[] = [
  {
    id: 'r-2026-11',
    title: 'November 2026 — Monthly Report',
    period: 'Monthly',
    date: '2026-11-30',
    sampleSize: '2.3 MB',
  },
  {
    id: 'r-2026-w46',
    title: 'Week 46 — Weekly Summary',
    period: 'Weekly',
    date: '2026-11-15',
    sampleSize: '1.1 MB',
  },
  {
    id: 'r-2026-q3',
    title: 'Q3 2026 — Sustainability Report',
    period: 'Quarterly',
    date: '2026-09-30',
    sampleSize: '4.8 MB',
  },
  {
    id: 'r-2025',
    title: 'Annual Energy Review 2025',
    period: 'Annual',
    date: '2025-12-31',
    sampleSize: '8.2 MB',
  },
];

export const REPORT_SUMMARY_METRICS = {
  totalConsumptionKwh: 30021,
  co2AvoidedTons: 1.82,
  esgImprovementPoints: '+3.1',
  peakAlertsResolved: 7,
  acceptedRecommendations: 14,
  periodDelta: '-6.4%',
};

export const REPORT_BUILDING_ROWS: ReportBuildingSummary[] = [
  { name: 'Building A — HQ', kwh: 9845, devices: 42, rooms: 12, status: 'Optimal' },
  { name: 'Building B — R&D', kwh: 8120, devices: 36, rooms: 9, status: 'Optimal' },
  { name: 'Building C — Ops', kwh: 12056, devices: 51, rooms: 15, status: 'High Load' },
];

export const REPORT_RECOMMENDATIONS = [
  { title: 'Shift HVAC pre-cooling to off-peak', category: 'HVAC', saving: '~8.2%' },
  { title: "Solar shading for Building C's south facade", category: 'Envelope', saving: '~4.0%' },
  { title: 'Auto-dim corridor lights after 20:00', category: 'Lighting', saving: '~3.1%' },
  { title: 'Consolidate idle workstations', category: 'Computing', saving: '~2.4%' },
  { title: 'Schedule server backup at 03:00', category: 'Computing', saving: '~1.6%' },
];

export const AI_PRESET_PROMPTS = [
  'Summarize Building A usage',
  'How to reduce HVAC load by 10%?',
  'Generate ESG summary',
  'Top 3 cost-saving actions this week',
] as const;

export const TIMER_OPTIONS = [
  { label: 'No timer', minutes: null },
  { label: '5 minutes', minutes: 5 },
  { label: '15 minutes', minutes: 15 },
  { label: '30 minutes', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '2 hours', minutes: 120 },
  { label: '8 hours', minutes: 480 },
] as const;
