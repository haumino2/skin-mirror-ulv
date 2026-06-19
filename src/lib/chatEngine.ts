import { sanitizeBeautyCopy } from '../data/vietnamesePersona'
import type {
  RoutinePreference,
  RoutineRecommendation,
  SkinAnalysisResult,
  SkinGoal,
} from '../types/skinMirror'

export type AnswerVietnameseQuestionParams = {
  question: string
  skinResult: SkinAnalysisResult
  recommendation?: RoutineRecommendation
  selectedGoal?: SkinGoal
  selectedPreference?: RoutinePreference
}

const SYSTEM_PROMPT =
  'Bạn là chuyên gia tư vấn da của Simple Skin Mirror tại Watson. Chỉ tư vấn về sản phẩm Simple. Trả lời ngắn gọn bằng tiếng Việt, tối đa 3 câu. Không dùng thuật ngữ khoa học phức tạp.'

function buildUserMessage(params: AnswerVietnameseQuestionParams): string {
  const { question, skinResult, recommendation, selectedGoal } = params
  const productNames =
    recommendation?.products.map((p) => p.name).join(', ') || 'chưa có gợi ý'
  const scores = skinResult.scores
  const scoresText = [
    `đỏ: ${scores.redness}`,
    `dầu: ${scores.oiliness}`,
    `texture: ${scores.texture}`,
    `lỗ chân lông: ${scores.pores}`,
    `cấp ẩm: ${scores.hydration}`,
    `xỉn màu: ${scores.dullness}`,
  ].join(', ')

  return [
    'Thông tin khách hàng:',
    `- Loại da: ${skinResult.skinType}`,
    `- Điểm số: ${scoresText}`,
    `- Nhận xét: ${skinResult.insight.trim() || 'không có'}`,
    `- Sản phẩm gợi ý: ${productNames}`,
    selectedGoal ? `- Mục tiêu đã chọn: ${selectedGoal}` : null,
    '',
    'Câu hỏi:',
    question.trim(),
  ]
    .filter((line) => line !== null)
    .join('\n')
}

function extractAssistantText(data: {
  content?: Array<{ type?: string; text?: string }>
}): string {
  const text = data.content
    ?.filter((block) => block.type === 'text' && block.text)
    .map((block) => block.text)
    .join('')
    .trim()

  if (!text) {
    throw new Error('Claude API returned empty text.')
  }

  return text
}

export async function answerVietnameseQuestion(
  params: AnswerVietnameseQuestionParams,
): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
  if (!apiKey) {
    throw new Error('Missing VITE_ANTHROPIC_API_KEY in environment.')
  }

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
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserMessage(params),
        },
      ],
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Claude API error (${res.status}): ${errText || res.statusText}`)
  }

  const data = (await res.json()) as {
    content?: Array<{ type?: string; text?: string }>
  }

  return sanitizeBeautyCopy(extractAssistantText(data))
}
