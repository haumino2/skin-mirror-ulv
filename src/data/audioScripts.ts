export type AudioScriptId =
  | 'oily-hydration'
  | 'sensitive-redness'
  | 'texture-pores'
  | 'dry-minimal'

export interface AudioScript {
  id: AudioScriptId
  title: string
  text: string
  audioUrl?: string
}

export const audioScripts: Record<AudioScriptId, AudioScript> = {
  'oily-hydration': {
    id: 'oily-hydration',
    title: 'Da hỗn hợp · dầu vùng chữ T · thiếu ẩm nhẹ',
    text:
      'Da bạn có xu hướng hỗn hợp, hơi dầu vùng chữ T và thiếu ẩm nhẹ. Skin Mirror gợi ý routine Simple tối giản gồm làm sạch dịu và dưỡng ẩm nhẹ. Bạn có thể lưu routine này hoặc hỏi BA để kiểm tra combo phù hợp hôm nay.',
    audioUrl: undefined,
  },
  'sensitive-redness': {
    id: 'sensitive-redness',
    title: 'Da nhạy cảm · hơi ửng đỏ',
    text:
      'Da bạn có xu hướng nhạy cảm, hơi ửng đỏ và cần routine nhẹ. Skin Mirror gợi ý làm sạch dịu và dưỡng ẩm Simple để giữ routine tối giản. Bạn có thể lưu routine này hoặc hỏi BA để kiểm tra combo phù hợp hôm nay.',
    audioUrl: undefined,
  },
  'texture-pores': {
    id: 'texture-pores',
    title: 'Texture chưa mịn · lỗ chân lông thấy rõ',
    text:
      'Da bạn có xu hướng hỗn hợp thiên dầu, texture chưa mịn và lỗ chân lông thấy rõ. Skin Mirror gợi ý routine Simple ba bước: làm sạch, dưỡng ẩm nhẹ và bước hỗ trợ texture. Bạn có thể lưu routine này hoặc hỏi BA để kiểm tra combo phù hợp hôm nay.',
    audioUrl: undefined,
  },
  'dry-minimal': {
    id: 'dry-minimal',
    title: 'Da khô nhẹ · routine tối giản',
    text:
      'Da bạn hơi khô, thiếu ẩm nhẹ và có thể xỉn màu. Skin Mirror gợi ý routine Simple tối giản gồm làm sạch dịu và dưỡng ẩm nhẹ. Bạn có thể lưu routine này hoặc hỏi BA để kiểm tra combo phù hợp hôm nay.',
    audioUrl: undefined,
  },
}
