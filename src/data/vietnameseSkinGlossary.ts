import type { SkinConcern } from '../types/skinMirror'

export const vietnameseSkinGlossary: Record<SkinConcern, string> = {
  low_hydration: 'thiếu ẩm',
  oily_t_zone: 'dầu vùng chữ T',
  redness: 'hơi ửng đỏ',
  uneven_texture: 'bề mặt da chưa mịn',
  visible_pores: 'lỗ chân lông thấy rõ',
  sensitivity: 'da nhạy cảm',
  dullness: 'da hơi xỉn màu',
}

export function getConcernLabel(concern: SkinConcern | string): string {
  if (concern in vietnameseSkinGlossary) {
    return vietnameseSkinGlossary[concern as SkinConcern]
  }
  return concern
}

export function formatConcernList(concerns: (SkinConcern | string)[]): string {
  return concerns.map(getConcernLabel).join(', ')
}
