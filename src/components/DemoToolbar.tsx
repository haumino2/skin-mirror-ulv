import { demoSessions } from '../data/demoSessions'

export interface DemoToolbarProps {
  visible: boolean
  activePersonaIndex: number | null
  onToggleVisible: () => void
  onSelectPersona: (index: number) => void
  onJumpToResult: () => void
  onJumpToShare: () => void
  onJumpToDashboard: () => void
  onReset: () => void
}

const btnBase =
  'h-8 px-2.5 rounded-md text-[11px] leading-none border transition-colors disabled:opacity-40 disabled:cursor-not-allowed'

export default function DemoToolbar({
  visible,
  activePersonaIndex,
  onToggleVisible,
  onSelectPersona,
  onJumpToResult,
  onJumpToShare,
  onJumpToDashboard,
  onReset,
}: DemoToolbarProps) {
  if (!visible) {
    return (
      <button
        type="button"
        onClick={onToggleVisible}
        className="fixed bottom-3 right-3 z-50 h-8 px-2.5 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm text-[10px] text-muted hover:text-ink hover:bg-white"
        aria-label="Mở demo toolbar (D)"
        title="Demo toolbar (D)"
      >
        Demo
      </button>
    )
  }

  return (
    <div
      className="fixed bottom-3 right-3 z-50 flex flex-col gap-2 max-w-[220px] p-3 rounded-2xl bg-white/95 backdrop-blur-sm shadow-sm"
      role="toolbar"
      aria-label="Demo presenter toolbar"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wide text-tertiary">
          Presenter
        </span>
        <button
          type="button"
          onClick={onToggleVisible}
          className={`${btnBase} border-line text-tertiary hover:text-muted hover:bg-sand`}
          title="Ẩn toolbar (D)"
        >
          Ẩn
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {demoSessions.map((session, index) => (
          <button
            key={session.id}
            type="button"
            onClick={() => onSelectPersona(index)}
            className={`${btnBase} ${
              activePersonaIndex === index
                ? 'border-unilever-600 bg-unilever-50 text-unilever-600'
                : 'border-line text-muted hover:bg-sand'
            }`}
            title={session.label}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={onJumpToResult}
          className={`${btnBase} border-line text-muted hover:bg-sand`}
          title="Kết quả (R)"
        >
          Kết quả
        </button>
        <button
          type="button"
          onClick={onJumpToShare}
          className={`${btnBase} border-line text-muted hover:bg-sand`}
          title="Lưu / chia sẻ (S)"
        >
          Lưu
        </button>
        <button
          type="button"
          onClick={onJumpToDashboard}
          className={`${btnBase} border-line text-muted hover:bg-sand`}
          title="Dashboard (A)"
        >
          Admin
        </button>
        <button
          type="button"
          onClick={onReset}
          className={`${btnBase} border-line text-muted hover:bg-sand`}
        >
          Reset
        </button>
      </div>

      <p className="text-[9px] leading-snug text-tertiary">
        D ẩn/hiện · 1–4 persona · R kết quả · S lưu · A admin · Esc đóng
      </p>
    </div>
  )
}
