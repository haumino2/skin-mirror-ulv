/** Mock analytics for admin dashboard — demo pilot Watson HCMC, không phải dữ liệu thật. */

export type TopConcern = {
  label: string
  count: number
  percentage: number
}

export type TopQuestion = {
  cluster: string
  count: number
  exampleQuestion: string
  suggestedAction: string
}

export type TopProduct = {
  productName: string
  recommendedCount: number
  clickedCount: number
}

export type RecommendedAction = {
  title: string
  rationale: string
}

export type MockAnalytics = {
  totalScans: number
  scanCompletionRate: number
  routineSaveRate: number
  promoClickRate: number
  baHandoffCount: number
  chatQuestionCount: number
  voicePlaybackCount: number
  voiceQuestionCount: number
  voiceToTextSuccessRate: number
  topConcerns: TopConcern[]
  topQuestions: TopQuestion[]
  topProducts: TopProduct[]
  recommendedActions: RecommendedAction[]
}

export const mockAnalytics: MockAnalytics = {
  totalScans: 1_284,
  scanCompletionRate: 0.82,
  routineSaveRate: 0.47,
  promoClickRate: 0.31,
  baHandoffCount: 186,
  chatQuestionCount: 512,
  voicePlaybackCount: 743,
  voiceQuestionCount: 94,
  voiceToTextSuccessRate: 0.88,
  topConcerns: [
    { label: 'Thiếu ẩm', count: 412, percentage: 32.1 },
    { label: 'Dầu vùng chữ T', count: 358, percentage: 27.9 },
    { label: 'Da nhạy cảm', count: 241, percentage: 18.8 },
    { label: 'Lỗ chân lông thấy rõ', count: 156, percentage: 12.2 },
    { label: 'Da hơi xỉn màu', count: 117, percentage: 9.1 },
  ],
  topQuestions: [
    {
      cluster: 'Routine tối giản',
      count: 148,
      exampleQuestion: 'Routine 2 bước có đủ cho da hỗn hợp không?',
      suggestedAction:
        'Thêm quick reply giải thích thứ tự làm sạch → dưỡng và khi nào cần thêm toner.',
    },
    {
      cluster: 'Ưu đãi & combo Watson',
      count: 121,
      exampleQuestion: 'Combo Simple hôm nay giảm bao nhiêu phần trăm?',
      suggestedAction:
        'Làm rõ disclaimer ưu đãi demo và CTA chuyển sang BA khi shopper hỏi giá cụ thể.',
    },
    {
      cluster: 'Da nhạy cảm / hơi đỏ',
      count: 97,
      exampleQuestion: 'Da mình hơi đỏ sau khi rửa mặt, dùng sản phẩm nào?',
      suggestedAction:
        'Ưu tiên script dịu cho Soothing Moisturizer và nhắc patch test khi da đang kích ứng.',
    },
    {
      cluster: 'Chống nắng hằng ngày',
      count: 76,
      exampleQuestion: 'Có cần chống nắng trong nhà không?',
      suggestedAction:
        'Bổ sung micro-quiz 1 câu về thói quen SPF để cá nhân hóa gợi ý Daily Sunscreen.',
    },
    {
      cluster: 'So sánh sản phẩm',
      count: 70,
      exampleQuestion: 'Hydrating Light và Soothing khác nhau thế nào?',
      suggestedAction:
        'Thêm bảng so sánh ngắn trong chat khi shopper hỏi giữa 2 dòng dưỡng ẩm.',
    },
  ],
  topProducts: [
    {
      productName: 'Simple Hydrating Light Moisturizer',
      recommendedCount: 892,
      clickedCount: 318,
    },
    {
      productName: 'Simple Gentle Cleanser',
      recommendedCount: 856,
      clickedCount: 274,
    },
    {
      productName: 'Simple Soothing Moisturizer',
      recommendedCount: 534,
      clickedCount: 198,
    },
    {
      productName: 'Simple Refreshing Toner',
      recommendedCount: 421,
      clickedCount: 142,
    },
    {
      productName: 'Simple Daily Sunscreen SPF 50',
      recommendedCount: 287,
      clickedCount: 96,
    },
  ],
  recommendedActions: [
    {
      title: 'Tăng tỷ lệ lưu routine sau scan',
      rationale:
        '47% shopper hoàn tất scan nhưng chỉ ~nửa lưu routine — thử nhắc lưu ngay sau projection 4 tuần.',
    },
    {
      title: 'Tối ưu handoff sang BA tại giờ cao điểm',
      rationale:
        '186 lượt show-to-BA tập trung 17h–20h; cân nhắc badge “BA sẵn sàng” khi promo click tăng.',
    },
    {
      title: 'Cải thiện voice-to-text cho câu hỏi dài',
      rationale:
        'Tỷ lệ nhận dạng giọng nói 88% — shopper thường hỏi combo/ưu đãi bằng câu dài, nên gợi ý chip câu hỏi mẫu.',
    },
    {
      title: 'Đẩy mạnh nội dung thiếu ẩm + da dầu chữ T',
      rationale:
        'Hai concern chiếm ~60% scan — cập nhật hero copy và demo session mặc định theo persona này.',
    },
  ],
}
