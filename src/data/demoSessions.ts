import type { DemoSession } from '../types/skinMirror'

export const demoSessions: DemoSession[] = [
  {
    id: 'oily-hydration',
    label: 'Da hỗn hợp · dầu vùng chữ T · thiếu ẩm nhẹ',
    result: {
      skinType: 'Da hỗn hợp',
      concerns: ['oily_t_zone', 'low_hydration', 'visible_pores'],
      scores: {
        hydration: 42,
        oiliness: 68,
        redness: 28,
        texture: 45,
        pores: 58,
        dullness: 35,
      },
      insight:
        'Vùng chữ T dễ bóng nhưng da vẫn thiếu ẩm nhẹ — routine 2 bước nhẹ có thể giúp cân bằng hơn.',
      confidenceLabel: 'demo',
    },
    goal: 'hydrate',
    preference: 'minimal_2_step',
    audioScriptId: 'oily-hydration',
  },
  {
    id: 'sensitive-redness',
    label: 'Da nhạy cảm · hơi ửng đỏ',
    result: {
      skinType: 'Da nhạy cảm',
      concerns: ['sensitivity', 'redness', 'low_hydration'],
      scores: {
        hydration: 38,
        oiliness: 42,
        redness: 58,
        texture: 48,
        pores: 36,
        dullness: 32,
      },
      insight:
        'Da có dấu hiệu nhạy cảm và hơi ửng đỏ — nên ưu tiên làm dịu và giữ routine tối giản.',
      confidenceLabel: 'demo',
    },
    goal: 'calm',
    preference: 'minimal_2_step',
    audioScriptId: 'sensitive-redness',
  },
  {
    id: 'texture-pores',
    label: 'Bề mặt da chưa mịn · lỗ chân lông thấy rõ',
    result: {
      skinType: 'Da hỗn hợp thiên dầu',
      concerns: ['uneven_texture', 'visible_pores', 'oily_t_zone'],
      scores: {
        hydration: 48,
        oiliness: 72,
        redness: 24,
        texture: 38,
        pores: 65,
        dullness: 40,
      },
      insight:
        'Bề mặt da chưa mịn và lỗ chân lông thấy rõ ở vùng chữ T — routine 3 bước có thể hỗ trợ cải thiện texture.',
      confidenceLabel: 'demo',
    },
    goal: 'smooth_texture',
    preference: 'full_3_step',
    audioScriptId: 'texture-pores',
  },
  {
    id: 'dry-minimal',
    label: 'Da khô nhẹ · routine tối giản',
    result: {
      skinType: 'Da hơi khô',
      concerns: ['low_hydration', 'dullness', 'sensitivity'],
      scores: {
        hydration: 34,
        oiliness: 30,
        redness: 32,
        texture: 46,
        pores: 38,
        dullness: 55,
      },
      insight:
        'Da hơi khô và xỉn màu — dưỡng ẩm nhẹ, routine ngắn gọn phù hợp để thử.',
      confidenceLabel: 'demo',
    },
    goal: 'hydrate',
    preference: 'minimal_2_step',
    audioScriptId: 'dry-minimal',
  },
]
