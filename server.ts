import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  getScenarioLabel,
  validateAndNormalizeForecast,
  type ForecastHorizonDays,
  type ForecastScenario,
} from './src/lib/forecast-logic.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface ChatMessageInput {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

const SEON_SYSTEM_INSTRUCTION = `You are the SEON Assistant for SEON (Smart Energy Optimization Network), a demonstration energy intelligence platform created by Devansh Saxena.

STRICT RESPONSE POLICY:
1. Answer ONLY what the user asks. Skip preambles, recaps, generic offers, and unrequested next steps.
2. Match requested scope:
   - Use one concise line for a simple factual question.
   - Use yes/no plus at most a short clause for a yes/no question.
   - Return just the relevant number/fact when that is all requested.
   - Expand into lists, tables, reports, or detailed paragraphs ONLY when the user asks for them (e.g., "super detailed", "table", "summarize", "top 3").
3. Formatting rules:
   - Clean GitHub-Flavored Markdown only.
   - Bold ONLY key terms—never complete sentences.
   - No decorative standalone asterisks and no headings for short replies.
   - When the user asks for tabular data or comparisons, output a valid header-row GFM table (at most 5 columns).
   - Use fenced code blocks only for actual code or formulas.
4. Truthfulness & portfolio context (all readings are simulated demo data):
   - Today's consumption: 4,218 kWh (-6.4% vs prior day). Weekly total: 30,021 kWh (-3.1%). Monthly total: 128,420 kWh (+1.8%).
   - Portfolio: 3 buildings, 36 rooms, 129 devices (Building A — HQ: 245 kWh/day, 42 devices, 12 rooms, Optimal; Building B — R&D: 198 kWh/day, 36 devices, 9 rooms, Optimal; Building C — Ops: 276 kWh/day, 51 devices, 15 rooms, High Load).
   - Category distribution: HVAC 42%, Computing 24%, Lighting 18%, Appliances 10%, Other 6%.
   - ESG scores: Environmental 82/100, Energy Efficiency 76/100, Social Impact 71/100, Governance 88/100. CO2 saved YTD: 12.4 t (annual target: 20 t, 512 equivalent trees).
   - Top optimization opportunities: Shift HVAC pre-cooling to off-peak (~8.2% saving), Building C south facade solar shading (~4.0%), Auto-dim corridor lights after 20:00 (~3.1%), Consolidate idle workstations (~2.4%), Schedule server backup at 03:00 (~1.6%).
   - Be transparent if asked: you cannot directly toggle physical building hardware or generate downloadable files from chat; device controls are in Monitoring and PDF/CSV exports are in Reports.`;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req, res) => {
    const body = req.body as { messages?: unknown; tone?: unknown } | undefined;

    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      res.status(400).json({ error: 'Invalid request: messages must be a non-empty array.' });
      return;
    }

    const sanitizedMessages: ChatMessageInput[] = [];
    for (const msg of body.messages) {
      if (
        typeof msg === 'object' &&
        msg !== null &&
        'role' in msg &&
        'content' in msg &&
        typeof (msg as { content: unknown }).content === 'string' &&
        (msg as { content: string }).content.trim().length > 0
      ) {
        const rawRole = (msg as { role: unknown }).role;
        const role = rawRole === 'assistant' || rawRole === 'model' ? 'model' : 'user';
        sanitizedMessages.push({
          role,
          content: (msg as { content: string }).content.slice(0, 8000),
        });
      }
    }

    if (sanitizedMessages.length === 0) {
      res.status(400).json({ error: 'No valid message content provided.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured. Add it in Settings > Secrets to enable SEON Assistant.',
      });
      return;
    }

    const tone =
      body.tone === 'Friendly' || body.tone === 'Concise' || body.tone === 'Professional'
        ? body.tone
        : 'Concise';

    const toneInstruction =
      tone === 'Friendly'
        ? '\nPreferred tone: warm and approachable while still obeying the strict brevity and scope policy.'
        : tone === 'Professional'
          ? '\nPreferred tone: crisp, executive, and analytical while obeying the strict brevity and scope policy.'
          : '\nPreferred tone: ultra-concise and direct.';

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const contents = sanitizedMessages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const streamResult = await ai.models.generateContentStream({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction: SEON_SYSTEM_INSTRUCTION + toneInstruction,
        },
      });

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      for await (const chunk of streamResult) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate SEON Assistant response.';
      if (!res.headersSent) {
        res.status(500).json({ error: message });
      } else {
        res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
        res.end();
      }
    }
  });

  app.post('/api/forecast', async (req, res) => {
    const body = req.body as
      | {
          horizonDays?: unknown;
          scenario?: unknown;
          historicalTrend?: unknown;
        }
      | undefined;

    const horizonDays: ForecastHorizonDays = body?.horizonDays === 14 ? 14 : 7;
    const scenario: ForecastScenario =
      body?.scenario === 'hvac-optimized' || body?.scenario === 'high-occupancy'
        ? body.scenario
        : 'baseline';

    const historical = Array.isArray(body?.historicalTrend) ? body.historicalTrend : [];
    if (historical.length === 0) {
      res.status(400).json({ error: 'historicalTrend array is required to generate a forecast.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured. Add it in Settings > Secrets to enable AI forecasting.',
      });
      return;
    }

    const scenarioContext =
      scenario === 'hvac-optimized'
        ? 'Assume HVAC off-peak pre-cooling (05:30-07:30) and corridor dimming after 20:00 are active, cutting daily demand roughly 5% to 9% below baseline.'
        : scenario === 'high-occupancy'
          ? 'Assume a high-occupancy conference & R&D sprint week lifting weekday HVAC and compute loads roughly 5% to 10% above baseline.'
          : 'Assume business-as-usual facility schedules with weekday peaks and mild weekend dips (~3,800-4,050 kWh on Sat/Sun).';

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = [
        `Analyze the past 7 days of SEON portfolio consumption (kWh) and rolling baseline:`,
        JSON.stringify(historical),
        `Portfolio context: Building A (HQ, 245 kWh/day), Building B (R&D, 198 kWh/day), Building C (Ops, 276 kWh/day High Load). Load split: HVAC 42%, Computing 24%, Lighting 18%, Appliances 10%, Other 6%.`,
        `Generate a realistic ${horizonDays}-day forward daily forecast starting on Nov 13 (sequential dates: Nov 13, Nov 14, ...).`,
        `Scenario (${getScenarioLabel(scenario)}): ${scenarioContext}`,
        `Return exact structured JSON matching the schema. Keep lowerBoundKwh < projectedKwh < upperBoundKwh with realistic +/- 4% to 7% uncertainty bands, concise 1-2 sentence summary, and 3 crisp load drivers.`,
      ].join('\n\n');

      const callForecastModel = async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: 'Concise 1-2 sentence executive forecast summary.',
                },
                projectedTotalKwh: {
                  type: Type.NUMBER,
                  description: 'Sum of projectedKwh across all forecasted days.',
                },
                deltaVsBaselinePercent: {
                  type: Type.NUMBER,
                  description: 'Percentage difference vs rolling historical baseline (negative means savings).',
                },
                confidenceScore: {
                  type: Type.INTEGER,
                  description: 'Confidence score from 50 to 99.',
                },
                points: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      date: { type: Type.STRING, description: 'Short date label e.g. Nov 13' },
                      projectedKwh: { type: Type.NUMBER },
                      lowerBoundKwh: { type: Type.NUMBER },
                      upperBoundKwh: { type: Type.NUMBER },
                      driver: { type: Type.STRING, description: 'Short primary load driver for this day.' },
                    },
                    required: ['date', 'projectedKwh', 'lowerBoundKwh', 'upperBoundKwh', 'driver'],
                  },
                },
                drivers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      factor: { type: Type.STRING },
                      impact: { type: Type.STRING },
                    },
                    required: ['factor', 'impact'],
                  },
                },
              },
              required: [
                'summary',
                'projectedTotalKwh',
                'deltaVsBaselinePercent',
                'confidenceScore',
                'points',
                'drivers',
              ],
            },
          },
        });
        return response;
      };

      let response;
      const retryDelays = [500, 1200];
      for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
        try {
          response = await callForecastModel();
          break;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          const isTransient = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429');
          if (!isTransient || attempt === retryDelays.length) {
            throw err;
          }
          await new Promise((r) => setTimeout(r, retryDelays[attempt]));
        }
      }

      const rawText = (response?.text ?? '').trim();
      if (!rawText) {
        throw new Error('Empty forecast response from Gemini.');
      }

      const parsed = JSON.parse(rawText);
      const normalized = validateAndNormalizeForecast(parsed, horizonDays, scenario);
      res.json(normalized);
    } catch (err) {
      let message = err instanceof Error ? err.message : 'Failed to generate AI energy forecast.';
      try {
        const parsedErr = JSON.parse(message) as { error?: { message?: string } };
        if (parsedErr?.error?.message) {
          message = parsedErr.error.message;
        }
      } catch {
        // Keep original message if not JSON
      }
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SEON server running at http://localhost:${PORT}`);
  });
}

startServer();
