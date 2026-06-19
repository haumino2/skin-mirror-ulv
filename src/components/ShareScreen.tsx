import { useMemo, useState } from 'react'
import { mockWatsonPromo } from '../data/promoConfig'
import type { WatsonPromo } from '../data/promoConfig'
import { demoSessions } from '../data/demoSessions'
import { getConcernLabel } from '../data/vietnameseSkinGlossary'
import type { SkinAnalysisResult } from '../lib/claudeSkinAnalysis'
import { trackEvent } from '../lib/eventTracker'
import {
  buildRoutineRecommendation,
  getDefaultGoalFromSkinResult,
  getDefaultPreference,
} from '../lib/routineRecommendation'
import type {
  RoutinePreference,
  RoutineRecommendation,
  SkinGoal,
} from '../types/skinMirror'

type ShareAnalysisInput = SkinAnalysisResult & { insight?: string }

export interface ShareScreenProps {
  onDone: () => void
  onOpenAdmin?: () => void
  analysis?: ShareAnalysisInput | null
  routineRecommendation?: RoutineRecommendation
  watsonPromo?: WatsonPromo
  goal?: SkinGoal
  preference?: RoutinePreference
}

const demoFallback = demoSessions[0].result

const FALLBACK_ANALYSIS: ShareAnalysisInput = {
  skinType: 'combination',
  concerns: demoFallback.concerns,
  scores: {
    redness: demoFallback.scores.redness,
    oiliness: demoFallback.scores.oiliness,
    texture: demoFallback.scores.texture,
    pores: demoFallback.scores.pores,
    hydration: demoFallback.scores.hydration,
    pigmentation: demoFallback.scores.dullness,
  },
  recommendations: [],
  insight: demoFallback.insight,
}

const SKIN_TYPE_LABELS: Record<string, string> = {
  oily: 'Da dầu',
  dry: 'Da khô',
  combination: 'Da hỗn hợp',
  normal: 'Da thường',
}

function formatSkinTypeLabel(skinType: string): string {
  return SKIN_TYPE_LABELS[skinType] ?? skinType
}

const QR_MODULE_PATTERN =
  '11111110010' +
  '10000010010' +
  '10111010010' +
  '10111011111' +
  '10111010000' +
  '11111110101' +
  '00000010101' +
  '10101110111' +
  '10001010001' +
  '10001011101' +
  '11111110001'

function QrCodeMock() {
  return (
    <div
      className="grid h-[66px] w-[66px] shrink-0 grid-cols-11 grid-rows-11 gap-px rounded-lg bg-line p-1"
      aria-hidden
    >
      {QR_MODULE_PATTERN.split('').map((cell, index) => (
        <div
          key={index}
          className={cell === '1' ? 'bg-ink' : 'bg-white'}
        />
      ))}
    </div>
  )
}

type MockAction = 'zalo' | 'watson' | 'screenshot' | null

export default function ShareScreen({
  onDone,
  onOpenAdmin,
  analysis,
  routineRecommendation,
  watsonPromo = mockWatsonPromo,
  goal,
  preference,
}: ShareScreenProps) {
  const [mockAction, setMockAction] = useState<MockAction>(null)

  const resolvedAnalysis = analysis ?? FALLBACK_ANALYSIS

  const resolvedRoutine = useMemo(() => {
    if (routineRecommendation) return routineRecommendation
    const resolvedGoal = goal ?? getDefaultGoalFromSkinResult(resolvedAnalysis)
    const resolvedPreference = preference ?? getDefaultPreference()
    return buildRoutineRecommendation(resolvedAnalysis, resolvedGoal, resolvedPreference)
  }, [routineRecommendation, goal, preference, resolvedAnalysis])

  const skinTypeLabel = formatSkinTypeLabel(resolvedAnalysis.skinType)
  const topConcerns = resolvedAnalysis.concerns.slice(0, 3)

  const savedDate = useMemo(
    () =>
      new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    [],
  )

  const handleMockAction = (action: Exclude<MockAction, null>) => {
    setMockAction(action)
    if (action === 'zalo') {
      trackEvent('zalo_qr_clicked')
    } else {
      trackEvent('save_clicked', { action })
    }
    console.log(`[ShareScreen] mock action: ${action}`)
  }

  const mockFeedback =
    mockAction === 'zalo'
      ? 'Routine đã sẵn sàng lưu qua Zalo (demo).'
      : mockAction === 'watson'
        ? 'Ưu đãi Watson đã ghi nhận — hỏi BA tại quầy (demo).'
        : mockAction === 'screenshot'
          ? 'Bạn có thể chụp màn hình để lưu kết quả.'
          : null

  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 py-4 pb-5 text-center">
      <h2 className="mb-1 text-2xl font-bold text-ink">Lưu routine của bạn</h2>
      <p className="mb-4 text-sm leading-relaxed text-secondary">
        Lưu routine, nhận ưu đãi Watson — chỉ khi bạn chủ động đồng ý
      </p>

      <div className="relative mx-auto mb-3 max-w-[300px] rounded-2xl bg-white p-5 text-left shadow-sm">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-unilever-600">
          Simple Skin Mirror · Watson HCMC
        </p>

        <div className="mb-2.5">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-unilever-600">
            Hồ sơ da
          </p>
          <p className="font-semibold text-base leading-snug text-ink">{skinTypeLabel}</p>
          {resolvedAnalysis.insight ? (
            <p className="mt-1 text-sm leading-relaxed text-secondary">
              {resolvedAnalysis.insight}
            </p>
          ) : null}
        </div>

        <div className="mb-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-unilever-600">
            Mối quan tâm chính
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topConcerns.map((concern) => (
              <span
                key={concern}
                className="rounded-full bg-unilever-50 px-2.5 py-0.5 text-xs font-medium text-unilever-600"
              >
                {getConcernLabel(concern)}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-2 text-sm leading-relaxed text-secondary">
          <span className="mb-1 block font-medium text-ink">
            {resolvedRoutine.title}
          </span>
          <span className="mb-1.5 block text-xs text-muted">
            {resolvedRoutine.summary}
          </span>
          {resolvedRoutine.products.map((product) => (
            <span key={product.id} className="block">
              {product.name}
            </span>
          ))}
        </div>

        <div className="mb-2 rounded-2xl bg-unilever-50 px-3 py-2.5">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-unilever-600">
            {watsonPromo.title}
          </p>
          <p className="text-sm font-medium text-ink">{watsonPromo.comboName}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">
            {watsonPromo.description}
          </p>
        </div>

        <p className="mt-3 pt-3 text-center text-xs italic text-muted">
          Kết quả phân tích bởi AI · {savedDate}
        </p>
      </div>

      <div className="mx-auto mb-3 flex max-w-[300px] items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <QrCodeMock />
        <div className="min-w-0 flex-1 text-left">
          <p className="mb-0.5 text-sm font-medium text-ink">Quét để lưu routine</p>
          <p className="text-xs leading-relaxed text-muted">
            Mở Zalo hoặc camera — không cần app riêng
          </p>
        </div>
      </div>

      <div className="mx-auto mb-3 flex w-full max-w-[300px] flex-col gap-3">
        <button
          type="button"
          onClick={() => handleMockAction('zalo')}
          className="bg-unilever-600 text-white rounded-xl h-14 text-base font-semibold w-full hover:bg-unilever-700 active:scale-[0.98] transition-all"
        >
          Lưu routine qua Zalo
        </button>
        <button
          type="button"
          onClick={() => handleMockAction('watson')}
          className="bg-white text-ink rounded-xl h-14 text-base border border-line w-full"
        >
          Nhận ưu đãi tại Watson
        </button>
        <button
          type="button"
          onClick={() => handleMockAction('screenshot')}
          className="text-unilever-600 underline-offset-2 text-sm hover:underline"
        >
          Chụp màn hình kết quả
        </button>
      </div>

      {mockFeedback ? (
        <p className="mx-auto mb-2 max-w-[300px] text-xs leading-relaxed text-muted">
          {mockFeedback}
        </p>
      ) : null}

      <p className="mx-auto mb-3 max-w-[300px] text-xs leading-relaxed text-muted">
        Chỉ lưu thông tin khi bạn chủ động đồng ý. Ảnh gốc không được lưu mặc định.
      </p>

      <div className="mt-auto pt-2">
        <button
          type="button"
          onClick={onDone}
          className="bg-unilever-600 text-white rounded-xl h-14 text-base font-semibold w-full hover:bg-unilever-700 active:scale-[0.98] transition-all"
        >
          Xong, ra quầy
        </button>
        {onOpenAdmin ? (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="mt-3 w-full py-2 text-unilever-600 underline-offset-2 text-sm hover:underline"
          >
            Mở dashboard demo
          </button>
        ) : null}
      </div>
    </div>
  )
}
