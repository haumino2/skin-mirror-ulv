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
    "All scores 0-100. recommendations should mention Unilever brands: Simple, Pond's, Vaseline, Dove."

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

  const data = (await res.json()) as any
  const text: string = String(data?.content?.[0]?.text ?? "").trim()
  if (!text) throw new Error("Claude API returned empty text.")

  const parsed = extractJson(text)
  return normalizeResult(parsed)
}

