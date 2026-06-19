import type { Product } from '../types/skinMirror'

export const simpleProducts: Product[] = [
  {
    id: 'simple-gentle-cleanser',
    brand: 'Simple',
    name: 'Simple Gentle Cleanser',
    routineStep: 'cleanse',
    targetConcerns: ['low_hydration', 'sensitivity', 'redness'],
    claims: [
      'Làm sạch nhẹ, không gây cảm giác khô căng',
      'Không chứa hương liệu và xà phòng',
      'Phù hợp cho da nhạy cảm',
    ],
    usage: 'Dùng sáng/tối để làm sạch nhẹ trước bước dưỡng.',
    whyRecommended:
      'Bước làm sạch nhẹ giúp hỗ trợ da nhạy cảm hoặc đang hơi đỏ mà không làm mất cảm giác thoải mái.',
    priority: 1,
  },
  {
    id: 'simple-hydrating-light-moisturizer',
    brand: 'Simple',
    name: 'Simple Hydrating Light Moisturizer',
    routineStep: 'hydrate',
    targetConcerns: ['low_hydration', 'oily_t_zone', 'sensitivity'],
    claims: [
      'Kết cấu nhẹ, thấm nhanh',
      'Hỗ trợ cân bằng độ ẩm',
      'Không gây bết dính',
    ],
    usage: 'Dùng sau bước làm sạch, lấy lượng nhỏ ở vùng chữ T nếu da dễ dầu.',
    whyRecommended:
      'Dưỡng ẩm nhẹ phù hợp khi da thiếu ẩm nhưng vùng chữ T vẫn dễ bóng hoặc da dễ nhạy cảm.',
    priority: 3,
  },
  {
    id: 'simple-soothing-moisturizer',
    brand: 'Simple',
    name: 'Simple Soothing Moisturizer',
    routineStep: 'calm_repair',
    targetConcerns: ['redness', 'sensitivity', 'low_hydration'],
    claims: [
      'Công thức dịu, hỗ trợ cảm giác thoải mái cho da',
      'Giúp nuôi dưỡng hàng rào da',
      'Không chứa hương liệu',
    ],
    usage: 'Dùng khi da có cảm giác khô căng hoặc hơi nhạy cảm.',
    whyRecommended:
      'Có thể cân nhắc khi da hơi đỏ, nhạy cảm hoặc cần thêm lớp dưỡng dịu sau làm sạch.',
    priority: 4,
  },
  {
    id: 'simple-refreshing-toner',
    brand: 'Simple',
    name: 'Simple Refreshing Toner',
    routineStep: 'hydrate',
    targetConcerns: ['uneven_texture', 'visible_pores', 'low_hydration'],
    claims: [
      'Hỗ trợ làm sạch nhẹ sau rửa mặt',
      'Chuẩn bị da cho bước dưỡng tiếp theo',
      'Công thức không cồn',
    ],
    usage: 'Dùng sau làm sạch để chuẩn bị cho bước dưỡng.',
    whyRecommended:
      'Bước toner nhẹ có thể hỗ trợ da thiếu ẩm và cảm giác bề mặt không đều trước khi dưỡng.',
    priority: 2,
  },
  {
    id: 'simple-daily-sunscreen',
    brand: 'Simple',
    name: 'Simple Daily Sunscreen SPF 50',
    routineStep: 'protect',
    targetConcerns: ['dullness', 'sensitivity'],
    claims: [
      'Hỗ trợ bảo vệ da khỏi tác động của tia UV',
      'Kết cấu nhẹ, dễ tán',
      'Phù hợp dùng hằng ngày',
    ],
    usage: 'Dùng vào buổi sáng, thoa lại khi cần.',
    whyRecommended:
      'Bảo vệ khỏi nắng hằng ngày có thể hỗ trợ duy trì làn da trông tươi hơn, đặc biệt với da nhạy cảm.',
    priority: 5,
  },
]
