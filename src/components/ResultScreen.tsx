import { useMemo, useState } from "react"
import SkuCard from "./SkuCard"
import SkinMapDetail from "./SkinMapDetail"
import type { SkinAnalysisResult, SkinScores, SkinType } from "../lib/claudeSkinAnalysis"

export interface ResultScreenProps {
  analysis: SkinAnalysisResult | null
  onNext: () => void
  onScanAgain: () => void
  onFeedbackNo: () => void
}

export default function ResultScreen({
  analysis,
  onNext,
  onScanAgain,
  onFeedbackNo,
}: ResultScreenProps) {
  const [showRoutine, setShowRoutine] = useState<boolean>(false)
  const [showDetails, setShowDetails] = useState<boolean>(false)

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

  const concerns = analysis?.concerns ?? []
  const scores = analysis?.scores
  const recommendations = analysis?.recommendations ?? []

  const scoreRows: Array<{ key: keyof SkinScores; label: string }> = [
    { key: "redness", label: "Đỏ/viêm" },
    { key: "oiliness", label: "Dầu" },
    { key: "texture", label: "Texture" },
    { key: "pores", label: "Lỗ chân lông" },
    { key: "hydration", label: "Thiếu ẩm" },
    { key: "pigmentation", label: "Sạm/nám" },
  ]

  const barColor = (v: number) => {
    if (v <= 33) return "bg-green-500"
    if (v <= 66) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0">
          <div className="font-serif text-lg text-ink mb-0.5">Da của bạn</div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-unilever-50 border border-unilever-100 px-2.5 py-1 text-[11px] font-medium text-unilever-900">
              {skinTypeLabel}
            </span>

            {concerns.slice(0, 2).map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full bg-white border border-line px-2.5 py-1 text-[11px] text-tertiary"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="bg-transparent border border-tertiary text-ink text-[11px] px-2.5 py-1 rounded-md shrink-0"
          onClick={onScanAgain}
        >
          Scan lại
        </button>
      </div>

      <div className="mb-3.5 bg-unilever-50 rounded-lg border-l-[3px] border-l-unilever-600 px-4 py-3">
        <div className="text-[10px] text-unilever-600 uppercase tracking-widest font-medium mb-1">
          INSIGHT CHÍNH
        </div>
        <div className="font-serif text-sm text-unilever-900 leading-snug">
          {analysis
            ? "Tổng quan: xem các scores & concerns bên dưới để tối ưu routine."
            : "Chưa có dữ liệu phân tích. Hãy scan lại để nhận kết quả."}
        </div>
      </div>

      {scores ? (
        <div className="mb-3.5 bg-white border border-line rounded-lg px-3.5 py-3">
          <div className="text-[10px] text-tertiary uppercase tracking-widest font-medium mb-2">
            Scores (0–100)
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
          <div className="text-[10px] text-tertiary uppercase tracking-widest font-medium mb-2">
            Concerns
          </div>
          <div className="flex flex-wrap gap-1.5">
            {concerns.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full bg-white border border-line px-2.5 py-1 text-[11px] text-ink"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex justify-between items-center mb-2">
        <div className="text-[10px] text-tertiary uppercase tracking-widest font-medium">
          Gợi ý sản phẩm Unilever
        </div>
        <button
          type="button"
          className="text-[11px] text-unilever-600 cursor-pointer bg-transparent"
          onClick={() => setShowRoutine((v) => !v)}
        >
          {showRoutine ? "− Ẩn routine" : "+ Xem routine"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
        {recommendations.slice(0, 4).map((r, idx) => {
          const [brandRaw, ...rest] = r.split("—")
          const brand = (brandRaw ?? "").trim() || "Unilever"
          const body = rest.join("—").trim() || r
          const [titleRaw, ...reasonParts] = body.split(/[-–•]/)
          const title = (titleRaw ?? "").trim() || body
          const reason = reasonParts.join(" ").trim()
          return (
            <SkuCard
              key={`${r}-${idx}`}
              tag={brand}
              name={title}
              description={reason || "Gợi ý từ Skin Mirror AI"}
              price=""
              reason=""
            />
          )
        })}

        {!recommendations.length ? (
          <>
            <SkuCard
              tag="Simple"
              name="Cleanser dịu nhẹ"
              description="Làm sạch không làm khô"
              price="—"
              reason="Phù hợp nhiều loại da"
            />
            <SkuCard
              tag="Vaseline"
              name="Moisturizer cấp ẩm"
              description="Giữ ẩm & phục hồi"
              price="—"
              reason="Ưu tiên khi thiếu ẩm"
            />
          </>
        ) : null}
      </div>

      <div
        className={[
          "mt-2.5 transition-all duration-200",
          showRoutine
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none h-0 overflow-hidden",
        ].join(" ")}
        aria-hidden={!showRoutine}
      >
        <SkuCard
          variant="secondary"
          tag="Routine gợi ý"
          name="1) Cleanser  2) Serum  3) Moisturizer"
          description="Simple / Pond's / Vaseline / Dove"
          price="—"
          reason="Tùy chỉnh theo concerns & scores"
        />
      </div>

      <button
        type="button"
        className="mt-3 mb-3 w-full text-[11px] text-unilever-600 bg-transparent border border-dashed border-unilever-100 rounded-md py-2 px-3 cursor-pointer"
        onClick={() => setShowDetails((v) => !v)}
      >
        {showDetails ? "Ẩn chi tiết phân tích" : "Xem chi tiết phân tích da"}
      </button>

      {showDetails ? (
        <div className="mt-3 pt-3.5 border-t border-line transition-opacity duration-200 opacity-100">
          <SkinMapDetail />
        </div>
      ) : null}

      <div className="mt-3.5 bg-white border border-line rounded-lg px-3 py-2.5 flex justify-between items-center gap-2">
        <div className="text-[11px] text-muted flex-1">
          Gợi ý này có phù hợp với bạn?
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            type="button"
            className="text-[11px] px-2.5 py-1 bg-transparent border border-green-200 text-green-700 rounded-md hover:bg-green-50"
            onClick={onNext}
          >
            Có
          </button>
          <button
            type="button"
            className="text-[11px] px-2.5 py-1 bg-transparent border border-red-200 text-red-700 rounded-md hover:bg-red-50"
            onClick={onFeedbackNo}
          >
            Không phù hợp
          </button>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="flex-1 bg-ink text-white text-sm font-medium py-2.5 rounded-md hover:opacity-90"
          onClick={onNext}
        >
          Lấy ra quầy
        </button>
      </div>
    </div>
  )
}

