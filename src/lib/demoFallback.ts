import { demoSessions } from '../data/demoSessions'
import type {
  DemoSession,
  SkinAnalysisResult,
  SkinConcern,
  SkinScore,
} from '../types/skinMirror'

const VALID_CONCERNS: readonly SkinConcern[] = [
  'low_hydration',
  'oily_t_zone',
  'redness',
  'uneven_texture',
  'visible_pores',
  'sensitivity',
  'dullness',
]

const DEFAULT_INSIGHT =
  'Kết quả mang tính tham khảo — có thể cân nhắc routine phù hợp với nhu cầu da hiện tại.'

function clampScore(value: unknown, fallback = 50): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(0, Math.min(100, Math.round(n)))
}

function normalizeConcerns(raw: unknown): SkinConcern[] {
  if (!Array.isArray(raw)) return []
  const seen = new Set<SkinConcern>()
  const concerns: SkinConcern[] = []

  for (const item of raw) {
    const concern = String(item)
    if (VALID_CONCERNS.includes(concern as SkinConcern) && !seen.has(concern as SkinConcern)) {
      seen.add(concern as SkinConcern)
      concerns.push(concern as SkinConcern)
    }
  }

  return concerns
}

function normalizeScores(raw: unknown, fallback: SkinScore): SkinScore {
  const scoresRaw =
    raw !== null && typeof raw === 'object' ? (raw as Partial<SkinScore>) : {}

  return {
    hydration: clampScore(scoresRaw.hydration, fallback.hydration),
    oiliness: clampScore(scoresRaw.oiliness, fallback.oiliness),
    redness: clampScore(scoresRaw.redness, fallback.redness),
    texture: clampScore(scoresRaw.texture, fallback.texture),
    pores: clampScore(scoresRaw.pores, fallback.pores),
    dullness: clampScore(scoresRaw.dullness, fallback.dullness),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

export function getDefaultDemoSession(): DemoSession {
  return demoSessions[0]
}

export function getDemoSessionById(id: string): DemoSession | undefined {
  return demoSessions.find((session) => session.id === id)
}

export function normalizeAnalysisToSkinResult(raw: unknown): SkinAnalysisResult {
  const fallback = getDefaultDemoSession().result

  if (!isRecord(raw)) {
    return {
      ...fallback,
      confidenceLabel: 'fallback',
    }
  }

  const skinType =
    typeof raw.skinType === 'string' && raw.skinType.trim()
      ? raw.skinType.trim()
      : fallback.skinType

  const concerns = normalizeConcerns(raw.concerns)
  const resolvedConcerns = concerns.length > 0 ? concerns : fallback.concerns

  const scores = normalizeScores(raw.scores, fallback.scores)

  const insight =
    typeof raw.insight === 'string' && raw.insight.trim()
      ? raw.insight.trim()
      : DEFAULT_INSIGHT

  const confidenceRaw = raw.confidenceLabel
  const confidenceLabel: SkinAnalysisResult['confidenceLabel'] =
    confidenceRaw === 'demo' ||
    confidenceRaw === 'ai_generated' ||
    confidenceRaw === 'fallback'
      ? confidenceRaw
      : 'fallback'

  return {
    skinType,
    concerns: resolvedConcerns,
    scores,
    insight,
    confidenceLabel,
  }
}
