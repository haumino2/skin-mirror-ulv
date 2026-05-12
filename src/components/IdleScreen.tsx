export interface IdleScreenProps {
  onStart: () => void
}

export default function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <div className="h-full min-h-full flex flex-col items-center justify-center text-center gap-4">
      <div className="w-15 h-15 rounded-full bg-unilever-600 opacity-15 animate-pulse mb-2" />

      <div>
        <div className="font-serif text-xl text-ink mb-1">Simple Skin Mirror</div>
        <div className="text-xs text-tertiary">Chạm để biết da bạn cần gì</div>
      </div>

      <button
        type="button"
        className="mt-6 bg-ink text-white px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition"
        onClick={onStart}
      >
        Bắt đầu
      </button>
    </div>
  )
}

