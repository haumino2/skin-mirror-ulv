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
    <div className="h-full min-h-full flex flex-col items-center justify-center w-full px-5 pb-5">
      <div className="mb-4 text-center w-full">
        <div className="w-14 h-14 rounded-full bg-unilever-50 text-unilever-600 flex items-center justify-center mx-auto mb-3">
          <MessageCircleQuestion size={28} aria-hidden />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-ink mb-1 text-center w-full">
        Cảm ơn bạn đã phản hồi
      </h1>
      <p className="text-sm text-secondary mb-5 text-center leading-relaxed w-full">
        Để Mirror cải thiện, cho mình biết vấn đề là gì:
      </p>

      <div className="flex flex-col gap-2.5 max-w-[300px] w-full mx-auto mb-4">
        <button
          type="button"
          className="bg-white rounded-2xl shadow-sm py-3.5 px-4 text-sm text-ink text-left flex items-center justify-between hover:bg-sand/50 transition cursor-pointer"
          onClick={() => handleOptionFeedback('wrong_skin_type')}
        >
          <span>Mirror nhận sai loại da của tôi</span>
          <ChevronRight size={14} className="text-muted shrink-0" aria-hidden />
        </button>
        <button
          type="button"
          className="bg-white rounded-2xl shadow-sm py-3.5 px-4 text-sm text-ink text-left flex items-center justify-between hover:bg-sand/50 transition cursor-pointer"
          onClick={() => handleOptionFeedback('products_not_fit')}
        >
          <span>Sản phẩm gợi ý tôi đã dùng không hợp</span>
          <ChevronRight size={14} className="text-muted shrink-0" aria-hidden />
        </button>
        <button
          type="button"
          className="bg-white rounded-2xl shadow-sm py-3.5 px-4 text-sm text-ink text-left flex items-center justify-between hover:bg-sand/50 transition cursor-pointer"
          onClick={() => handleOptionFeedback('other_issue')}
        >
          <span>Tôi cần tư vấn về vấn đề khác</span>
          <ChevronRight size={14} className="text-muted shrink-0" aria-hidden />
        </button>
        <button
          type="button"
          className="bg-unilever-50 rounded-2xl shadow-sm py-3.5 px-4 text-sm text-unilever-900 text-left flex items-center justify-between hover:bg-unilever-100 transition cursor-pointer"
          onClick={() => onBackToIdle()}
        >
          <span>Gặp Beauty Advisor ngay</span>
          <User size={14} className="text-unilever-600 shrink-0" aria-hidden />
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="text-unilever-600 underline-offset-2 text-sm hover:underline"
          onClick={onBackToIdle}
        >
          Để sau, cảm ơn
        </button>
      </div>
    </div>
  )
}
