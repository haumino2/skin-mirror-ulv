import { Check } from 'lucide-react'
import { trackEvent } from '../lib/eventTracker'

export interface ConsentScreenProps {
  onAccept: () => void
  onCancel: () => void
}

const PRIVACY_POINTS = [
  'Ảnh chỉ được dùng để phân tích da trong phiên này.',
  'Skin Mirror không lưu ảnh gốc nếu bạn không đồng ý.',
  'Kết quả chỉ mang tính tham khảo chăm sóc da, không thay thế tư vấn chuyên môn.',
]

export default function ConsentScreen({ onAccept, onCancel }: ConsentScreenProps) {
  const handleAccept = () => {
    trackEvent('consent_accepted')
    onAccept()
  }

  return (
    <div className="flex flex-col justify-between min-h-full px-5 pb-5">
      <div>
        <h1 className="text-2xl font-bold text-ink mb-4">Trước khi scan da</h1>

        <div className="bg-unilever-50 rounded-2xl p-4">
          <div className="space-y-2.5">
            {PRIVACY_POINTS.map((point) => (
              <div key={point} className="flex items-start gap-2 text-xs text-muted leading-relaxed">
                <Check className="w-4 h-4 shrink-0 text-unilever-600 mt-0.5" strokeWidth={2.5} aria-hidden />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-6">
        <button
          type="button"
          className="bg-unilever-600 text-white rounded-xl h-14 text-base font-semibold w-full hover:bg-unilever-700 active:scale-[0.98] transition-all"
          onClick={handleAccept}
        >
          Tôi đồng ý và bắt đầu
        </button>
        <button
          type="button"
          className="bg-white text-ink rounded-xl h-14 text-base border border-line w-full"
          onClick={onCancel}
        >
          Quay lại
        </button>
      </div>
    </div>
  )
}
