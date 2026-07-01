import { demoSessions } from '../data/demoSessions'
import { getConcernLabel } from '../data/vietnameseSkinGlossary'
import type { SkinAnalysisResult, SkinType } from './claudeSkinAnalysis'
type MockChatParams = {
  question: string
  recommendation?: {
    products: Array<{ name: string }>
  }
}

/** Tạm bỏ qua Claude API (key hết hạn / demo offline). Đặt false để bật lại. */
export function shouldBypassClaudeApi(): boolean {
  return import.meta.env.VITE_SKIP_CLAUDE_API === 'true'
}

function mapDemoSkinType(label: string): SkinType {
  const normalized = label.toLowerCase()
  if (normalized.includes('khô') || normalized.includes('kho')) return 'dry'
  if (normalized.includes('dầu') || normalized.includes('dau')) return 'oily'
  if (normalized.includes('hỗn hợp') || normalized.includes('hon hop')) {
    return 'combination'
  }
  return 'normal'
}

export function getMockSkinAnalysisResult(): SkinAnalysisResult {
  const session = demoSessions[0]
  const result = session.result

  return {
    skinType: mapDemoSkinType(result.skinType),
    concerns: result.concerns.map((concern) => getConcernLabel(concern)),
    scores: {
      redness: result.scores.redness,
      oiliness: result.scores.oiliness,
      texture: result.scores.texture,
      pores: result.scores.pores,
      hydration: result.scores.hydration,
      pigmentation: result.scores.dullness,
    },
    recommendations: [result.insight],
  }
}

export function getMockChatAnswer(params: MockChatParams): string {
  const question = params.question.toLowerCase()
  const products =
    params.recommendation?.products.map((p) => p.name).join(' và ') ||
    'sản phẩm Simple gợi ý'
  const firstProduct = params.recommendation?.products[0]?.name || 'sản phẩm làm sạch Simple'

  if (question.includes('dầu') || question.includes('dau')) {
    return `Da dầu vẫn có thể dùng kem dưỡng Simple nhẹ, không bít tắc. Routine gợi ý: ${products}. Dùng lượng mỏng vùng chữ T trước.`
  }
  if (question.includes('1 sản phẩm') || question.includes('một sản phẩm')) {
    return `Nếu chỉ chọn một, ưu tiên ${firstProduct} — nền tảng quan trọng nhất cho routine.`
  }
  if (question.includes('sáng') || question.includes('tối')) {
    return 'Routine gợi ý dùng sáng và tối đều được; tối có thể rút gọn nếu da đang nhạy cảm.'
  }
  if (question.includes('nhạy cảm')) {
    return 'Da nhạy cảm nên patch test 24h, tránh chà xát mạnh và giữ routine tối giản với Simple.'
  }
  if (question.includes('combo')) {
    return `Có combo phù hợp tại Watson — hỏi BA để kiểm tra ưu đãi. Gợi ý hiện tại: ${products}.`
  }

  return `Dựa trên kết quả scan, ${products} phù hợp với routine Simple. Bạn có thể hỏi thêm BA tại quầy Watson.`
}
