/** Mock analytics for BU Capability Dashboard — Watson HCMC pilot demo data. */

export interface CapabilityScore {
  name: string
  score: number
  status: 'strong' | 'partial' | 'gap'
  note: string
}

export const capabilityScores: CapabilityScore[] = [
  {
    name: 'Customer Engagement',
    score: 80,
    status: 'strong',
    note: 'Interactive scan + chat + TTS voice',
  },
  {
    name: 'Shopper Understanding',
    score: 65,
    status: 'partial',
    note: 'Skin analysis captures concern + skin type',
  },
  {
    name: 'Personalization',
    score: 70,
    status: 'strong',
    note: 'Per-user SKU + routine recommendation',
  },
  {
    name: 'Sales',
    score: 85,
    status: 'strong',
    note: 'Direct SKU selection + projection upsell',
  },
  {
    name: 'Promotion',
    score: 50,
    status: 'partial',
    note: 'SKU surfacing, no live promo integration',
  },
  {
    name: 'Learning',
    score: 45,
    status: 'partial',
    note: 'Session analytics, no model feedback loop',
  },
  {
    name: 'Data Capture',
    score: 30,
    status: 'gap',
    note: 'No CRM/CDP persistence yet',
  },
  {
    name: 'Operational',
    score: 25,
    status: 'gap',
    note: 'No fleet/uptime/restock telemetry',
  },
  {
    name: 'Cost',
    score: 18,
    status: 'gap',
    note: 'Per-scan cost not yet optimized/tracked',
  },
]

export const OVERALL_COVERAGE = 52

export interface FunnelStage {
  stage: string
  count: number
}

export const funnelStages: FunnelStage[] = [
  { stage: 'Sessions', count: 1000 },
  { stage: 'Consent', count: 620 },
  { stage: 'Category', count: 540 },
  { stage: 'Scan', count: 480 },
  { stage: 'Result', count: 470 },
  { stage: 'Projection', count: 310 },
  { stage: 'Share', count: 95 },
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
  { type: 'Combination', pct: 34 },
  { type: 'Oily', pct: 28 },
  { type: 'Dry', pct: 18 },
  { type: 'Normal', pct: 12 },
  { type: 'Sensitive', pct: 8 },
]

export interface DayScans {
  day: string
  scans: number
}

export const weeklyTrend: DayScans[] = [
  { day: 'Mon', scans: 58 },
  { day: 'Tue', scans: 64 },
  { day: 'Wed', scans: 71 },
  { day: 'Thu', scans: 69 },
  { day: 'Fri', scans: 92 },
  { day: 'Sat', scans: 118 },
  { day: 'Sun', scans: 104 },
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
  { label: 'Claude API (analysis+chat+SKU)', usd: 0.018 },
  { label: 'VieNeu TTS', usd: 0.006 },
  { label: 'Vercel hosting (amortized)', usd: 0.002 },
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
    "Khách da dầu thường expect brightening — cân nhắc add Pond's vào combo oily+acne",
    'Concern "thiếu ẩm" có CTR thấp nhất — copy chưa đủ compelling',
    '23% negative feedback từ khách 35+ — AHC anti-aging chưa được surface đúng lúc',
  ],
}

export const STATUS_COLORS: Record<CapabilityScore['status'], string> = {
  strong: '#004d99',
  partial: '#f59e0b',
  gap: '#dc2626',
}
