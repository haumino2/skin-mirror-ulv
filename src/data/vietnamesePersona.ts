export interface VietnamesePersona {
  tone: string
  brandTone: string
  answerRules: string[]
  bannedTerms: string[]
  preferredTerms: string[]
}

export const simpleVietnamesePersona: VietnamesePersona = {
  tone: 'dịu, ngắn gọn, thực tế, không clinical, phù hợp shopper Việt',
  brandTone: 'dịu, sạch, nhẹ, thân thiện với da nhạy cảm',
  answerRules: [
    'Trả lời trực tiếp trước',
    'Giải thích lý do ngắn',
    'Đưa hành động tiếp theo rõ ràng',
    'Mặc định 2-4 câu',
    'Không phán xét tình trạng da',
  ],
  bannedTerms: [
    'chữa',
    'điều trị',
    'cam kết hết mụn',
    'hết nám',
    'chẩn đoán',
    'bệnh da',
    '100% hiệu quả',
  ],
  preferredTerms: [
    'hỗ trợ',
    'có thể cân nhắc',
    'phù hợp để thử',
    'nên patch test nếu da nhạy cảm',
    'kết quả mang tính tham khảo',
  ],
}

/** Longer phrases first so partial matches do not run before full phrases. */
const BANNED_REPLACEMENTS: ReadonlyArray<[string, string]> = [
  ['cam kết hết mụn', 'có thể cân nhắc'],
  ['100% hiệu quả', 'kết quả mang tính tham khảo'],
  ['hết nám', 'có thể cân nhắc'],
  ['điều trị', 'hỗ trợ'],
  ['chẩn đoán', 'đánh giá'],
  ['bệnh da', 'tình trạng da'],
  ['chữa', 'hỗ trợ'],
]

export function sanitizeBeautyCopy(text: string): string {
  let result = text

  for (const [banned, preferred] of BANNED_REPLACEMENTS) {
    const pattern = new RegExp(banned, 'gi')
    result = result.replace(pattern, preferred)
  }

  return result
}
