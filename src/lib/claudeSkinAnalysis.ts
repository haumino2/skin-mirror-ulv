import { SKU_CATALOGUE } from '../data/skuCatalogue'
import type { Sku, SkuConcern } from '../data/skuCatalogue'

export type SkinType = "oily" | "dry" | "combination" | "normal"

export type SkinScores = {
  redness: number
  oiliness: number
  texture: number
  pores: number
  hydration: number
  pigmentation: number
}

export type SkinAnalysisResult = {
  skinType: SkinType
  concerns: string[]
  scores: SkinScores
  recommendations: string[]
}

function clampScore(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

function normalizeResult(raw: unknown): SkinAnalysisResult {
  const obj = (raw ?? {}) as Partial<SkinAnalysisResult>
  const skinTypeRaw = obj.skinType
  const skinType: SkinType =
    skinTypeRaw === "oily" ||
    skinTypeRaw === "dry" ||
    skinTypeRaw === "combination" ||
    skinTypeRaw === "normal"
      ? skinTypeRaw
      : "normal"

  const scoresRaw = (obj.scores ?? {}) as Partial<SkinScores>
  const scores: SkinScores = {
    redness: clampScore(scoresRaw.redness),
    oiliness: clampScore(scoresRaw.oiliness),
    texture: clampScore(scoresRaw.texture),
    pores: clampScore(scoresRaw.pores),
    hydration: clampScore(scoresRaw.hydration),
    pigmentation: clampScore(scoresRaw.pigmentation),
  }

  const concerns = Array.isArray(obj.concerns)
    ? obj.concerns.map(String).filter(Boolean)
    : []
  const recommendations = Array.isArray(obj.recommendations)
    ? obj.recommendations.map(String).filter(Boolean)
    : []

  return { skinType, concerns, scores, recommendations }
}

function extractJson(text: string): unknown {
  const cleaned = text.trim()
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  const candidate = fenceMatch?.[1]?.trim() ?? cleaned

  const start = candidate.indexOf("{")
  const end = candidate.lastIndexOf("}")
  if (start < 0 || end < 0 || end <= start) {
    throw new Error("Claude response does not contain JSON object.")
  }

  const jsonText = candidate.slice(start, end + 1)
  return JSON.parse(jsonText)
}

export async function analyzeSkin(imageBase64: string): Promise<SkinAnalysisResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
  if (!apiKey) throw new Error("Missing VITE_ANTHROPIC_API_KEY in environment.")

  const normalizedBase64 = imageBase64.includes(",")
    ? imageBase64.split(",").pop() ?? ""
    : imageBase64

  const prompt =
    "Analyze this face image for skin condition. " +
    "Return ONLY valid JSON (no markdown, no explanation) with exactly this structure: " +
    "{ skinType: 'oily'|'dry'|'combination'|'normal', concerns: string[], scores: { redness: number, oiliness: number, texture: number, pores: number, hydration: number, pigmentation: number }, recommendations: string[] } " +
    "All scores 0-100. recommendations: write exactly 1 string in Vietnamese (tiếng Việt), 2-3 sentences max, " +
    "describing the skin condition and what the customer should prioritize. " +
    "Example: 'Da bạn đang có dầu cao vùng chữ T và hơi mất nước. Ưu tiên làm sạch nhẹ và dưỡng ẩm cân bằng.' " +
    "Only mention Simple brand products. Do not use English."

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: normalizedBase64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Claude API error (${res.status}): ${errText || res.statusText}`)
  }

  const data = (await res.json()) as {
    content?: Array<{ type?: string; text?: string }>
  }
  const text: string = String(data.content?.[0]?.text ?? "").trim()
  if (!text) throw new Error("Claude API returned empty text.")

  const parsed = extractJson(text)
  return normalizeResult(parsed)
}

export async function selectSkusForCustomer(
  analysis: SkinAnalysisResult,
  concern: SkuConcern
): Promise<Sku[]> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
  if (!apiKey) return getFallbackSkus(concern)

  const catalogueText = JSON.stringify(SKU_CATALOGUE.map(s => ({
    id: s.id, brand: s.brand, name: s.name,
    concerns: s.concerns, bestForSkinType: s.bestForSkinType,
    keyBenefit: s.keyBenefit
  })))

  const prompt = `Bạn là chuyên gia gợi ý sản phẩm skincare.
Thông tin da khách hàng:
- Loại da: ${analysis.skinType}
- Dầu: ${analysis.scores.oiliness}/100
- Độ ẩm: ${analysis.scores.hydration}/100
- Đỏ/viêm: ${analysis.scores.redness}/100
- Mối quan tâm chính: ${concern}

Danh sách sản phẩm: ${catalogueText}

Chọn đúng 2 sản phẩm phù hợp nhất. Trả về ONLY valid JSON array, không markdown:
[
  {"id": "SKU00X", "matchReason": "lý do ngắn bằng tiếng Việt tối đa 10 từ"},
  {"id": "SKU00X", "matchReason": "lý do ngắn bằng tiếng Việt tối đa 10 từ"}
]`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await res.json()
    const text = String(data.content?.[0]?.text ?? '').trim()
    const cleaned = text.replace(/```json|```/g, '').trim()
    const picks = JSON.parse(cleaned) as Array<{ id: string; matchReason: string }>

    return picks
      .map((pick): Sku | null => {
        const sku = SKU_CATALOGUE.find(s => s.id === pick.id)
        if (!sku) return null
        return { ...sku, matchReason: pick.matchReason }
      })
      .filter((s): s is Sku => s !== null)
      .slice(0, 2)
  } catch {
    return getFallbackSkus(concern)
  }
}

function getFallbackSkus(concern: SkuConcern): Sku[] {
  return SKU_CATALOGUE
    .filter(s => s.concerns.includes(concern))
    .slice(0, 2)
}
