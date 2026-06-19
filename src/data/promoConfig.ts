export type WatsonPromo = {
  title: string
  comboName: string
  description: string
  disclaimer: string
  ctaPrimary: string
  ctaSecondary: string
  ctaTertiary: string
}

export const mockWatsonPromo: WatsonPromo = {
  title: 'Watson offer hôm nay',
  comboName: 'Simple routine combo',
  description:
    'Lưu routine và hỏi BA để kiểm tra ưu đãi phù hợp tại quầy.',
  disclaimer:
    'Ưu đãi minh họa cho demo. Có thể cấu hình theo chiến dịch hoặc từng cửa hàng.',
  ctaPrimary: 'Lưu ưu đãi',
  ctaSecondary: 'Show to BA',
  ctaTertiary: 'Hỏi BA về combo',
}
