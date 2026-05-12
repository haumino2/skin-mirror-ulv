import { useState } from 'react'
import SkuCard from './SkuCard'
import SkinMapDetail from './SkinMapDetail'

export interface ResultScreenProps {
  onNext: () => void
  onScanAgain: () => void
  onFeedbackNo: () => void
}

export default function ResultScreen({
  onNext,
  onScanAgain,
  onFeedbackNo,
}: ResultScreenProps) {
  const [showRoutine, setShowRoutine] = useState<boolean>(false)
  const [showDetails, setShowDetails] = useState<boolean>(false)

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0">
          <div className="font-serif text-lg text-ink mb-0.5">Da của bạn</div>
          <div className="text-[11px] text-tertiary">
            Da hỗn hợp · Break out cằm + 2 bên má
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
          Da bạn đang thiếu ẩm + viêm nhẹ. Cần niacinamide kiểm soát dầu, kết hợp
          moisturizer nhẹ.
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="text-[10px] text-tertiary uppercase tracking-widest font-medium">
          Simple phù hợp cho bạn
        </div>
        <button
          type="button"
          className="text-[11px] text-unilever-600 cursor-pointer bg-transparent"
          onClick={() => setShowRoutine((v) => !v)}
        >
          {showRoutine ? '− Ẩn routine' : '+ Xem routine 3 bước'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <SkuCard
          tag="Cho vùng cằm"
          name="Supernova Toner"
          description="Niacinamide 5% · 200ml"
          price="95.000đ"
          reason="Giải dầu + viêm nhẹ"
        />
        <SkuCard
          tag="Cấp ẩm"
          name="Hydrating Light"
          description="Moisturizer · 125ml"
          price="75.000đ"
          reason="Bù ẩm không tắc lỗ chân lông"
        />
      </div>

      <div
        className={[
          'mt-2.5 transition-all duration-200',
          showRoutine ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none h-0 overflow-hidden',
        ].join(' ')}
        aria-hidden={!showRoutine}
      >
        <SkuCard
          variant="secondary"
          tag="Step 1 — Làm sạch"
          name="Kind to Skin Refreshing Wash"
          description="Cleanser · 150ml"
          price="65.000đ"
          reason="Bổ sung trước toner để mở lỗ chân lông sạch"
        />
      </div>

      <button
        type="button"
        className="mt-3 mb-3 w-full text-[11px] text-unilever-600 bg-transparent border border-dashed border-unilever-100 rounded-md py-2 px-3 cursor-pointer"
        onClick={() => setShowDetails((v) => !v)}
      >
        {showDetails ? 'Ẩn chi tiết phân tích' : 'Xem chi tiết phân tích da'}
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

