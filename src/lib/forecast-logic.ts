import type { SevenDayTrendPoint } from './demo-data';

export type ForecastHorizonDays = 7 | 14;
export type ForecastScenario = 'baseline' | 'hvac-optimized' | 'high-occupancy';

export interface ForecastDayPoint {
  date: string;
  projectedKwh: number;
  lowerBoundKwh: number;
  upperBoundKwh: number;
  driver: string;
}

export interface ForecastDriver {
  factor: string;
  impact: string;
}

export interface EnergyForecastResponse {
  horizonDays: ForecastHorizonDays;
  scenario: ForecastScenario;
  generatedAt: string;
  summary: string;
  projectedTotalKwh: number;
  deltaVsBaselinePercent: number;
  confidenceScore: number;
  peakProjectedDay: {
    date: string;
    kwh: number;
    driver: string;
  };
  points: ForecastDayPoint[];
  drivers: ForecastDriver[];
}

export interface ForecastChartDatum {
  date: string;
  actualKwh?: number;
  baselineKwh?: number;
  projectedKwh?: number;
  confidenceBand?: [number, number];
  driver?: string;
  isForecast: boolean;
}

export const FORECAST_SCENARIO_LABELS: Record<ForecastScenario, string> = {
  baseline: 'Business as usual',
  'hvac-optimized': 'HVAC off-peak optimization',
  'high-occupancy': 'High-occupancy surge',
};

export function getScenarioLabel(scenario: ForecastScenario): string {
  return FORECAST_SCENARIO_LABELS[scenario];
}

export function validateAndNormalizeForecast(
  raw: unknown,
  horizonDays: ForecastHorizonDays,
  scenario: ForecastScenario,
): EnergyForecastResponse {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid forecast payload returned by Gemini.');
  }

  const obj = raw as Record<string, unknown>;
  const rawPoints = Array.isArray(obj.points) ? obj.points : [];
  if (rawPoints.length === 0) {
    throw new Error('Gemini forecast did not return any projected days.');
  }

  const points: ForecastDayPoint[] = rawPoints.slice(0, horizonDays).map((item, idx) => {
    const rec = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const projectedKwh = Math.max(500, Math.round(Number(rec.projectedKwh) || 4200));
    const rawLower = Number(rec.lowerBoundKwh);
    const rawUpper = Number(rec.upperBoundKwh);
    const lowerBoundKwh = Math.min(
      projectedKwh,
      Math.max(400, Math.round(Number.isFinite(rawLower) ? rawLower : projectedKwh * 0.94)),
    );
    const upperBoundKwh = Math.max(
      projectedKwh,
      Math.round(Number.isFinite(rawUpper) ? rawUpper : projectedKwh * 1.06),
    );

    return {
      date: typeof rec.date === 'string' && rec.date.trim() ? rec.date.trim() : `Day +${idx + 1}`,
      projectedKwh,
      lowerBoundKwh,
      upperBoundKwh,
      driver:
        typeof rec.driver === 'string' && rec.driver.trim()
          ? rec.driver.trim()
          : 'Normal facility load',
    };
  });

  const computedTotal = points.reduce((sum, pt) => sum + pt.projectedKwh, 0);
  const rawTotal = Number(obj.projectedTotalKwh);
  const projectedTotalKwh =
    Number.isFinite(rawTotal) && rawTotal > 0 ? Math.round(rawTotal) : computedTotal;

  const peakFromPoints = points.reduce((best, pt) =>
    pt.projectedKwh > best.projectedKwh ? pt : best,
  );

  const rawDelta = Number(obj.deltaVsBaselinePercent);
  const deltaVsBaselinePercent = Number.isFinite(rawDelta)
    ? Number(rawDelta.toFixed(1))
    : 0;

  const rawConfidence = Number(obj.confidenceScore);
  const confidenceScore = Number.isFinite(rawConfidence)
    ? Math.min(99, Math.max(50, Math.round(rawConfidence)))
    : 86;

  const rawDrivers = Array.isArray(obj.drivers) ? obj.drivers : [];
  const drivers: ForecastDriver[] = rawDrivers
    .slice(0, 3)
    .map((d) => {
      const rec = (d && typeof d === 'object' ? d : {}) as Record<string, unknown>;
      return {
        factor: typeof rec.factor === 'string' && rec.factor.trim() ? rec.factor.trim() : 'Load profile',
        impact: typeof rec.impact === 'string' && rec.impact.trim() ? rec.impact.trim() : 'Moderate effect',
      };
    });

  const summary =
    typeof obj.summary === 'string' && obj.summary.trim()
      ? obj.summary.trim()
      : `Projected ${projectedTotalKwh.toLocaleString()} kWh over the next ${points.length} days under ${getScenarioLabel(scenario)}.`;

  return {
    horizonDays,
    scenario,
    generatedAt: new Date().toISOString(),
    summary,
    projectedTotalKwh,
    deltaVsBaselinePercent,
    confidenceScore,
    peakProjectedDay: {
      date: peakFromPoints.date,
      kwh: peakFromPoints.projectedKwh,
      driver: peakFromPoints.driver,
    },
    points,
    drivers:
      drivers.length > 0
        ? drivers
        : [
            { factor: 'HVAC base load', impact: 'Primary afternoon thermal driver' },
            { factor: 'Weekday occupancy', impact: 'Higher Mon–Fri demand vs weekend dip' },
          ],
  };
}

export function buildForecastChartSeries(
  historical: SevenDayTrendPoint[],
  forecast: EnergyForecastResponse | null,
): ForecastChartDatum[] {
  const baseSeries: ForecastChartDatum[] = historical.map((pt, index) => {
    const isAnchor = forecast !== null && index === historical.length - 1;
    return {
      date: pt.date,
      actualKwh: pt.kwh,
      baselineKwh: pt.baseline,
      projectedKwh: isAnchor ? pt.kwh : undefined,
      confidenceBand: isAnchor ? [pt.kwh, pt.kwh] : undefined,
      isForecast: false,
    };
  });

  if (!forecast) {
    return baseSeries;
  }

  const futureSeries: ForecastChartDatum[] = forecast.points.map((pt) => ({
    date: pt.date,
    projectedKwh: pt.projectedKwh,
    confidenceBand: [pt.lowerBoundKwh, pt.upperBoundKwh],
    driver: pt.driver,
    isForecast: true,
  }));

  return [...baseSeries, ...futureSeries];
}
