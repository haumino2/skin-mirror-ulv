/** Mock analytics for BU Capability Dashboard — Watson HCMC pilot demo data. */

export interface CapabilityScore {
  name: string
  score: number
  status: 'strong' | 'partial' | 'gap'
  note: string
}

export const capabilityScores: CapabilityScore[] = [
  {
    name: 'Tương tác khách hàng',
    score: 80,
    status: 'strong',
    note: 'Quét tương tác + chat + giọng TTS',
  },
  {
    name: 'Hiểu khách hàng',
    score: 65,
    status: 'partial',
    note: 'Phân tích da thu thập mối quan tâm + loại da',
  },
  {
    name: 'Cá nhân hóa',
    score: 70,
    status: 'strong',
    note: 'Đề xuất SKU + routine theo từng khách',
  },
  {
    name: 'Bán hàng',
    score: 85,
    status: 'strong',
    note: 'Chọn SKU trực tiếp + upsell projection',
  },
  {
    name: 'Khuyến mãi',
    score: 50,
    status: 'partial',
    note: 'Hiển thị SKU, chưa tích hợp khuyến mãi trực tiếp',
  },
  {
    name: 'Học hỏi',
    score: 45,
    status: 'partial',
    note: 'Phân tích phiên, chưa có vòng phản hồi model',
  },
  {
    name: 'Thu thập dữ liệu',
    score: 30,
    status: 'gap',
    note: 'Chưa lưu trữ CRM/CDP',
  },
  {
    name: 'Vận hành',
    score: 25,
    status: 'gap',
    note: 'Chưa có telemetry fleet/uptime/restock',
  },
  {
    name: 'Chi phí',
    score: 18,
    status: 'gap',
    note: 'Chi phí mỗi lượt quét chưa được tối ưu/theo dõi',
  },
]

export const OVERALL_COVERAGE = 52

export interface FunnelStage {
  stage: string
  count: number
}

export const funnelStages: FunnelStage[] = [
  { stage: 'Phiên', count: 1000 },
  { stage: 'Đồng ý', count: 620 },
  { stage: 'Danh mục', count: 540 },
  { stage: 'Quét', count: 480 },
  { stage: 'Kết quả', count: 470 },
  { stage: 'Projection', count: 310 },
  { stage: 'Chia sẻ', count: 95 },
]

export interface FunnelStageMetrics extends FunnelStage {
  retainedFromPrevious: number | null
  dropOffFromPrevious: number | null
}

export function getFunnelMetrics(): FunnelStageMetrics[] {
  return funnelStages.map((stage, index) => {
    if (index === 0) {
      return { ...stage, retainedFromPrevious: null, dropOffFromPrevious: null }
    }
    const previous = funnelStages[index - 1].count
    const retained = (stage.count / previous) * 100
    return {
      ...stage,
      retainedFromPrevious: retained,
      dropOffFromPrevious: 100 - retained,
    }
  })
}

export function getBiggestDropOff(): {
  fromStage: string
  toStage: string
  dropOffPct: number
} {
  const metrics = getFunnelMetrics()
  let maxDrop = { fromStage: '', toStage: '', dropOffPct: 0 }

  for (let i = 1; i < metrics.length; i += 1) {
    const drop = metrics[i].dropOffFromPrevious ?? 0
    if (drop > maxDrop.dropOffPct) {
      maxDrop = {
        fromStage: metrics[i - 1].stage,
        toStage: metrics[i].stage,
        dropOffPct: drop,
      }
    }
  }

  return maxDrop
}

export interface BrandStat {
  brand: string
  recommendations: number
  shareOfVoice: number
}

const brandRecommendations: Pick<BrandStat, 'brand' | 'recommendations'>[] = [
  { brand: 'Simple', recommendations: 142 },
  { brand: "Pond's", recommendations: 98 },
  { brand: 'Vaseline', recommendations: 76 },
  { brand: 'Hazeline', recommendations: 64 },
  { brand: 'AHC', recommendations: 50 },
]

function computeShareOfVoice(
  brands: Pick<BrandStat, 'brand' | 'recommendations'>[],
): BrandStat[] {
  const total = brands.reduce((sum, b) => sum + b.recommendations, 0)
  return brands
    .map((b) => ({
      ...b,
      shareOfVoice: total > 0 ? (b.recommendations / total) * 100 : 0,
    }))
    .sort((a, b) => b.recommendations - a.recommendations)
}

export const brandStats: BrandStat[] = computeShareOfVoice(brandRecommendations)

export interface SkinTypeSlice {
  type: string
  pct: number
}

export const skinTypeBreakdown: SkinTypeSlice[] = [
  { type: 'Da hỗn hợp', pct: 34 },
  { type: 'Da dầu', pct: 28 },
  { type: 'Da khô', pct: 18 },
  { type: 'Da thường', pct: 12 },
  { type: 'Da nhạy cảm', pct: 8 },
]

export interface DayScans {
  day: string
  scans: number
}

export const weeklyTrend: DayScans[] = [
  { day: 'T2', scans: 58 },
  { day: 'T3', scans: 64 },
  { day: 'T4', scans: 71 },
  { day: 'T5', scans: 69 },
  { day: 'T6', scans: 92 },
  { day: 'T7', scans: 118 },
  { day: 'CN', scans: 104 },
]

export function getTotalWeeklyScans(): number {
  return weeklyTrend.reduce((sum, d) => sum + d.scans, 0)
}

export function getPeakDay(): DayScans {
  return weeklyTrend.reduce((peak, day) => (day.scans > peak.scans ? day : peak))
}

export interface CostLine {
  label: string
  usd: number
}

export interface CostSummary {
  lines: CostLine[]
  totalPerScan: number
  monthlyScans: number
  monthlyEstimate: number
}

const costLines: CostLine[] = [
  { label: 'Claude API (phân tích + chat + SKU)', usd: 0.018 },
  { label: 'VieNeu TTS', usd: 0.006 },
  { label: 'Vercel hosting (phân bổ)', usd: 0.002 },
]

const monthlyScans = 2400

export const costSummary: CostSummary = {
  lines: costLines,
  totalPerScan: costLines.reduce((sum, line) => sum + line.usd, 0),
  monthlyScans,
  monthlyEstimate:
    costLines.reduce((sum, line) => sum + line.usd, 0) * monthlyScans,
}

export function getShareRate(): number {
  const sessions = funnelStages[0].count
  const shares = funnelStages[funnelStages.length - 1].count
  return sessions > 0 ? shares / sessions : 0
}

export interface FeedbackEntry {
  time: string
  skinType: string
  concern: string
  products: string
  feedback: 'positive' | 'negative'
  note: string
}

export interface FeedbackSummary {
  positiveRate: number
  totalFeedback: number
  topNegativeReasons: string[]
  aiInsights: string[]
}

export const feedbackLog: FeedbackEntry[] = [
  {
    time: '14:23',
    skinType: 'Da hỗn hợp',
    concern: 'Mụn',
    products: 'Simple + Hazeline',
    feedback: 'positive',
    note: '',
  },
  {
    time: '14:45',
    skinType: 'Da dầu',
    concern: 'Dưỡng ẩm',
    products: "Vaseline + Pond's",
    feedback: 'negative',
    note: 'Muốn trắng hơn',
  },
  {
    time: '15:02',
    skinType: 'Da khô',
    concern: 'Thiếu ẩm',
    products: 'Vaseline + Simple',
    feedback: 'positive',
    note: '',
  },
  {
    time: '15:18',
    skinType: 'Da nhạy cảm',
    concern: 'Mụn',
    products: 'Simple + Simple',
    feedback: 'positive',
    note: 'Hợp da nhạy cảm',
  },
  {
    time: '15:34',
    skinType: 'Da hỗn hợp',
    concern: 'Lỗ chân lông',
    products: "Hazeline + Pond's",
    feedback: 'negative',
    note: 'Giá cao hơn budget',
  },
  {
    time: '15:51',
    skinType: 'Da dầu',
    concern: 'Mụn',
    products: 'Hazeline + Simple',
    feedback: 'positive',
    note: '',
  },
  {
    time: '16:07',
    skinType: 'Da thường',
    concern: 'Lão hóa',
    products: "AHC + Pond's",
    feedback: 'positive',
    note: 'Thích kết cấu AHC',
  },
  {
    time: '16:22',
    skinType: 'Da khô',
    concern: 'Thâm nám',
    products: "Pond's + AHC",
    feedback: 'negative',
    note: 'Đã dùng rồi, muốn thử mới',
  },
  {
    time: '16:40',
    skinType: 'Da hỗn hợp',
    concern: 'Dưỡng ẩm',
    products: "Pond's + Vaseline",
    feedback: 'positive',
    note: '',
  },
  {
    time: '16:58',
    skinType: 'Da dầu',
    concern: 'Lão hóa',
    products: 'AHC + Hazeline',
    feedback: 'positive',
    note: 'Mong có size nhỏ dùng thử',
  },
]

export const feedbackSummary: FeedbackSummary = {
  positiveRate: 0.78,
  totalFeedback: 312,
  topNegativeReasons: [
    'Muốn sản phẩm trắng da hơn',
    'Giá cao hơn budget',
    'Đã dùng rồi, muốn thử mới',
  ],
  aiInsights: [
    "Khách da dầu thường mong làm sáng da — cân nhắc thêm Pond's vào combo da dầu + mụn",
    'Mối quan tâm "thiếu ẩm" có CTR thấp nhất — nội dung chưa đủ thuyết phục',
    '23% phản hồi tiêu cực từ khách 35+ — AHC chống lão hóa chưa được hiển thị đúng lúc',
  ],
}

export const STATUS_COLORS: Record<CapabilityScore['status'], string> = {
  strong: '#004d99',
  partial: '#f59e0b',
  gap: '#dc2626',
}
