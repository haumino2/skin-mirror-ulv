import { MessageCircleQuestion, ChevronRight, User } from 'lucide-react'

export interface RecoveryScreenProps {
  onBackToIdle: () => void
}

export default function RecoveryScreen({ onBackToIdle }: RecoveryScreenProps) {
  const handleOptionFeedback = (reason: string) => {
    console.log('[RecoveryScreen] feedback:', reason)
    onBackToIdle()
  }

  return (
    <div className="h-full min-h-full flex flex-col items-center justify-center w-full">
      <div className="mb-3.5 text-center w-full">
        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
          <MessageCircleQuestion size={28} aria-hidden />
        </div>
      </div>

      <div className="font-serif text-lg text-ink mb-1 text-center w-full">
        Cảm ơn bạn đã phản hồi
      </div>
      <div className="text-[11px] text-muted mb-4 text-center leading-relaxed w-full">
        Để Mirror cải thiện, cho mình biết vấn đề là gì:
      </div>

      <div className="flex flex-col gap-2 max-w-[300px] w-full mx-auto mb-3.5">
        <button
          type="button"
          className="bg-white border border-line rounded-md py-2.5 px-3.5 text-[12px] text-ink text-left flex items-center justify-between hover:bg-sand transition cursor-pointer"
          onClick={() => handleOptionFeedback('wrong_skin_type')}
        >
          <span>Mirror nhận sai loại da của tôi</span>
          <ChevronRight size={14} color="#888780" aria-hidden />
        </button>
        <button
          type="button"
          className="bg-white border border-line rounded-md py-2.5 px-3.5 text-[12px] text-ink text-left flex items-center justify-between hover:bg-sand transition cursor-pointer"
          onClick={() => handleOptionFeedback('products_not_fit')}
        >
          <span>Sản phẩm gợi ý tôi đã dùng không hợp</span>
          <ChevronRight size={14} color="#888780" aria-hidden />
        </button>
        <button
          type="button"
          className="bg-white border border-line rounded-md py-2.5 px-3.5 text-[12px] text-ink text-left flex items-center justify-between hover:bg-sand transition cursor-pointer"
          onClick={() => handleOptionFeedback('other_issue')}
        >
          <span>Tôi cần tư vấn về vấn đề khác</span>
          <ChevronRight size={14} color="#888780" aria-hidden />
        </button>
        <button
          type="button"
          className="bg-unilever-50 border border-unilever-100 rounded-md py-2.5 px-3.5 text-[12px] text-unilever-900 text-left flex items-center justify-between hover:bg-sand transition cursor-pointer"
          onClick={() => onBackToIdle()}
        >
          <span>Gặp Beauty Advisor (human) ngay</span>
          <User size={14} color="#534AB7" aria-hidden />
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="bg-transparent border border-tertiary text-[11px] text-ink px-3.5 py-1.5 rounded-md hover:bg-sand transition cursor-pointer"
          onClick={onBackToIdle}
        >
          Để sau, cảm ơn
        </button>
      </div>
    </div>
  )
}
