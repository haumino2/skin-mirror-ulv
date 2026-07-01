import { useEffect, useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"
import SkinMapDetail from "./SkinMapDetail"
import BAHandoffView from "./BAHandoffView"
import PromoHandoff from "./PromoHandoff"
import ChatPanel from "./ChatPanel"
import AudioAdviceButton from "./AudioAdviceButton"
import SkuCard from "./SkuCard"
import { audioScripts, type AudioScriptId } from "../data/audioScripts"
import { mockWatsonPromo } from "../data/promoConfig"
import { normalizeAnalysisToSkinResult } from "../lib/demoFallback"
import { selectSkusForCustomer, type SkinAnalysisResult, type SkinScores, type SkinType } from "../lib/claudeSkinAnalysis"
import type { Sku, SkuConcern } from "../data/skuCatalogue"
import type {
  RoutinePreference,
  RoutineRecommendation as RoutineRecommendationData,
  SkinGoal,
} from "../types/skinMirror"

function isAudioScriptId(id: string): id is AudioScriptId {
  return id in audioScripts
}

function skinTypeToVietnamese(skinType: SkinType): string {
  switch (skinType) {
    case 'oily':
      return 'da dầu'
    case 'dry':
      return 'da khô'
    case 'combination':
      return 'da hỗn hợp'
    case 'normal':
    default:
      return 'da thường'
  }
}

function mapGoalToConcern(goal?: SkinGoal): SkuConcern {
  switch (goal) {
    case 'reduce_oil':
      return 'acne'
    case 'calm':
      return 'acne'
    case 'smooth_texture':
      return 'pores'
    case 'hydrate':
      return 'hydration'
    default:
      return 'hydration'
  }
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(". ")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, index, parts) =>
      index < parts.length - 1 && !part.endsWith(".") ? `${part}.` : part,
    )
}

function buildFallbackAudioScript(analysis: SkinAnalysisResult): string {
  const primaryRecommendation = analysis.recommendations[0]?.trim()
  if (primaryRecommendation) {
    return primaryRecommendation
  }

  const skinType = skinTypeToVietnamese(analysis.skinType)
  const topConcern = analysis.concerns[0]?.trim()

  if (topConcern) {
    return `Theo kết quả scan, da bạn là ${skinType}, mối quan tâm chính là ${topConcern}. Skin Mirror gợi ý routine Simple tối giản phù hợp với tình trạng da hiện tại.`
  }

  return `Theo kết quả scan, da bạn là ${skinType}. Skin Mirror gợi ý routine Simple tối giản phù hợp với tình trạng da hiện tại.`
}

export interface ResultScreenProps {
  analysis: SkinAnalysisResult | null
  routineRecommendation?: RoutineRecommendationData
  selectedGoal?: SkinGoal
  selectedPreference?: RoutinePreference
  onNext: () => void
  onScanAgain: () => void
  onFeedbackNo: () => void
  onSaveOffer?: () => void
  onShowBA?: () => void
  onAskBA?: () => void
  audioScriptId?: string
  onAudioPlayed?: () => void
}

export default function ResultScreen({
  analysis,
  routineRecommendation,
  selectedGoal,
  selectedPreference,
  onNext,
  onScanAgain,
  onFeedbackNo,
  onSaveOffer,
  onShowBA,
  onAskBA,
  audioScriptId,
  onAudioPlayed,
}: ResultScreenProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [chatExpanded, setChatExpanded] = useState(false)
  const [showBAHandoff, setShowBAHandoff] = useState(false)
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [visibleSentenceCount, setVisibleSentenceCount] = useState(0)
  const [recommendedSkus, setRecommendedSkus] = useState<Sku[]>([])

  const chatSkinResult = useMemo(() => {
    if (!analysis) return null
    return normalizeAnalysisToSkinResult({
      skinType: analysis.skinType,
      concerns: analysis.concerns,
      scores: {
        hydration: analysis.scores.hydration,
        oiliness: analysis.scores.oiliness,
        redness: analysis.scores.redness,
        texture: analysis.scores.texture,
        pores: analysis.scores.pores,
        dullness: analysis.scores.pigmentation,
      },
      insight: analysis.recommendations[0],
      confidenceLabel: "ai_generated",
    })
  }, [analysis])

  const audioAdvice = useMemo(() => {
    if (!chatSkinResult || !analysis) return null

    if (audioScriptId && isAudioScriptId(audioScriptId)) {
      const script = audioScripts[audioScriptId]
      return { text: script.text, audioUrl: script.audioUrl }
    }

    return {
      text: buildFallbackAudioScript(analysis),
      audioUrl: undefined,
    }
  }, [audioScriptId, chatSkinResult, analysis])

  const presentationSentences = useMemo(() => {
    if (!audioAdvice?.text) return []
    return splitIntoSentences(audioAdvice.text)
  }, [audioAdvice?.text])

  useEffect(() => {
    if (!isPresentationMode || presentationSentences.length === 0) {
      setVisibleSentenceCount(0)
      return
    }

    setVisibleSentenceCount(1)

    const intervalId = window.setInterval(() => {
      setVisibleSentenceCount((count) => {
        if (count >= presentationSentences.length) {
          return count
        }
        return count + 1
      })
    }, 4000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isPresentationMode, presentationSentences])

  const skinTypeLabel = useMemo(() => {
    const t: SkinType | undefined = analysis?.skinType
    switch (t) {
      case "oily":
        return "Da dầu"
      case "dry":
        return "Da khô"
      case "combination":
        return "Da hỗn hợp"
      case "normal":
      default:
        return "Da thường"
    }
  }, [analysis?.skinType])

  useEffect(() => {
    if (!analysis) return
    const concern = mapGoalToConcern(selectedGoal)
    selectSkusForCustomer(analysis, concern).then(setRecommendedSkus)
  }, [analysis, selectedGoal])

  const concerns = analysis?.concerns ?? []
  const scores = analysis?.scores

  const scoreRows: Array<{ key: keyof SkinScores; label: string }> = [
    { key: "redness", label: "Đỏ/viêm" },
    { key: "oiliness", label: "Dầu" },
    { key: "texture", label: "Bề mặt da" },
    { key: "pores", label: "Lỗ chân lông" },
    { key: "hydration", label: "Thiếu ẩm" },
    { key: "pigmentation", label: "Sạm/nám" },
  ]

  const barColor = (v: number) => {
    if (v <= 33) return "bg-green-500"
    if (v <= 66) return "bg-yellow-500"
    return "bg-red-500"
  }

  const handleSaveOffer = () => {
    if (onSaveOffer) {
      onSaveOffer()
      return
    }
    console.log("[PromoHandoff] onSaveOffer — save/share step not wired")
  }

  const handleShowBA = () => {
    if (onShowBA) {
      onShowBA()
      return
    }
    setShowBAHandoff(true)
  }

  const handleAskBA = () => {
    setChatExpanded(true)
    onAskBA?.()
  }

  const handleAudioPlayStart = () => {
    setIsPresentationMode(true)
  }

  const handleAudioPlayStop = () => {
    setIsPresentationMode(false)
  }

  if (showBAHandoff && chatSkinResult) {
    return (
      <BAHandoffView
        skinResult={chatSkinResult}
        recommendation={routineRecommendation}
        promo={mockWatsonPromo}
        onBack={() => setShowBAHandoff(false)}
      />
    )
  }

  return (
    <div className="flex flex-col px-5 pb-5">
      <div className="flex justify-between items-start mb-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-ink mb-1">Da của bạn</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-unilever-50 px-2.5 py-1 text-xs font-medium text-unilever-600">
              {skinTypeLabel}
            </span>

            {concerns.slice(0, 2).map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full bg-white shadow-sm px-2.5 py-1 text-xs text-muted"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="text-unilever-600 underline-offset-2 text-sm shrink-0 hover:underline"
          onClick={onScanAgain}
        >
          Scan lại
        </button>
      </div>

      <div className="mb-4 bg-unilever-50 rounded-2xl px-4 py-4">
        {!isPresentationMode ? (
          <>
            <div className="text-[11px] font-semibold tracking-widest text-unilever-600 uppercase mb-1">
              NHẬN XÉT CHÍNH
            </div>
            <div className="font-semibold text-sm text-unilever-900 leading-snug">
              {analysis
                ? "Tổng quan: xem chỉ số da và mối quan tâm bên dưới để tối ưu routine."
                : "Chưa có dữ liệu phân tích. Hãy scan lại để nhận kết quả."}
            </div>
          </>
        ) : null}

        {audioAdvice ? (
          <div
            className={[
              isPresentationMode ? "" : "mt-3 pt-3 border-t border-unilever-100",
            ].join(" ")}
          >
            {!isPresentationMode ? (
              <p className="mb-2 text-xs leading-snug text-muted">
                Tùy chọn nghe tư vấn bằng tiếng Việt.
              </p>
            ) : null}
            <AudioAdviceButton
              script={audioAdvice.text}
              audioUrl={audioAdvice.audioUrl}
              label="Nghe tư vấn"
              onPlayStart={handleAudioPlayStart}
              onPlayStop={handleAudioPlayStop}
              onPlayed={onAudioPlayed}
              showVoiceSelector={true}
              compact
            />
          </div>
        ) : null}
      </div>

      {isPresentationMode ? (
        <div className="mb-3.5 flex gap-4">
          <div className="w-[40%] shrink-0">
            <SkinMapDetail />
          </div>
          <div className="flex w-[60%] flex-col gap-3 pt-1">
            {presentationSentences.slice(0, visibleSentenceCount).map((sentence, index) => {
              const isCurrent = index === visibleSentenceCount - 1
              return (
                <p
                  key={`${index}-${sentence.slice(0, 24)}`}
                  className={[
                    "animate-fade-in font-semibold text-sm leading-relaxed",
                    isCurrent ? "text-unilever-600" : "text-muted",
                  ].join(" ")}
                >
                  {sentence}
                </p>
              )
            })}
          </div>
        </div>
      ) : null}

      {!isPresentationMode ? (
        <>
          {scores ? (
            <div className="mb-4 bg-white rounded-2xl shadow-sm p-4">
              <div className="text-[11px] font-semibold tracking-widest text-unilever-600 uppercase mb-2">
                CHỈ SỐ DA (0–100)
              </div>
              <div className="flex flex-col gap-2.5">
                {scoreRows.map((row) => {
                  const v = scores[row.key]
                  return (
                    <div key={row.key} className="flex items-center gap-2">
                      <div className="text-[11px] text-muted min-w-[86px]">{row.label}</div>
                      <div className="flex-1 h-2 bg-line rounded-full overflow-hidden">
                        <div
                          className={["h-full rounded-full", barColor(v)].join(" ")}
                          style={{ width: `${v}%` }}
                        />
                      </div>
                      <div className="text-[11px] font-medium text-ink min-w-[28px] text-right">
                        {v}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}

          {concerns.length ? (
            <div className="mb-3">
              <div className="text-[11px] font-semibold tracking-widest text-unilever-600 uppercase mb-2">
                MỐI QUAN TÂM
              </div>
              <div className="flex flex-wrap gap-1.5">
                {concerns.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full bg-white shadow-sm px-2.5 py-1 text-xs text-ink"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {recommendedSkus.length > 0 && (
            <div className="mb-3.5">
              <div className="text-[11px] font-semibold tracking-widest text-unilever-600 uppercase mb-2">
                GỢI Ý SẢN PHẨM
              </div>
              <div className="grid grid-cols-2 gap-2">
                {recommendedSkus.map((sku, i) => (
                  <SkuCard
                    key={sku.id}
                    tag={sku.brand}
                    name={sku.name}
                    description={sku.keyBenefit}
                    price={sku.price}
                    reason={sku.matchReason ?? ''}
                    brand={sku.brand}
                    imageUrl={sku.imageUrl}
                    shelf={sku.shelf}
                    variant={i === 0 ? 'primary' : 'secondary'}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-3.5">
            <PromoHandoff
              promo={mockWatsonPromo}
              onSaveOffer={handleSaveOffer}
              onShowBA={handleShowBA}
              onAskBA={handleAskBA}
            />
          </div>

          {chatSkinResult ? (
            <div className="mb-3.5">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 rounded-2xl bg-white shadow-sm px-4 py-3 text-left"
                onClick={() => setChatExpanded((open) => !open)}
                aria-expanded={chatExpanded}
              >
                <span className="min-w-0">
                  <span className="block font-semibold text-sm text-ink">Hỏi thêm về routine</span>
                  <span className="mt-0.5 block text-[10px] leading-snug text-tertiary">
                    Gợi ý ngắn dựa trên kết quả scan — không thay tư vấn chuyên môn
                  </span>
                </span>
                <ChevronDown
                  className={[
                    "h-4 w-4 shrink-0 text-muted transition-transform",
                    chatExpanded ? "rotate-180" : "",
                  ].join(" ")}
                  aria-hidden
                />
              </button>

              {chatExpanded ? (
                <div className="mt-2">
                  <ChatPanel
                    skinResult={chatSkinResult}
                    recommendation={routineRecommendation}
                    selectedGoal={selectedGoal}
                    selectedPreference={selectedPreference}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            className="mt-3 mb-3 w-full text-unilever-600 underline-offset-2 text-sm hover:underline"
            onClick={() => setShowDetails((v) => !v)}
          >
            {showDetails ? "Ẩn chi tiết phân tích" : "Xem chi tiết phân tích da"}
          </button>

          {showDetails ? (
            <div className="mt-3 pt-4 transition-opacity duration-200 opacity-100">
              <SkinMapDetail />
            </div>
          ) : null}
        </>
      ) : null}

      <div className="mt-4 bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center gap-2">
        <div className="text-sm text-secondary flex-1">
          Gợi ý này có phù hợp với bạn?
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            className="text-xs px-3 py-1.5 bg-unilever-50 text-unilever-600 rounded-xl font-medium hover:bg-unilever-100"
            onClick={onNext}
          >
            Có
          </button>
          <button
            type="button"
            className="text-xs px-3 py-1.5 bg-white text-muted rounded-xl font-medium shadow-sm hover:bg-sand"
            onClick={onFeedbackNo}
          >
            Không phù hợp
          </button>
        </div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          className="bg-unilever-600 text-white rounded-xl h-14 text-base font-semibold w-full hover:bg-unilever-700 active:scale-[0.98] transition-all"
          onClick={onNext}
        >
          Lấy ra quầy
        </button>
      </div>
    </div>
  )
}

