import { ScanFace } from 'lucide-react'

export interface IdleScreenProps {
  onStart: () => void
}

export default function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <div className="h-full min-h-full flex flex-col justify-between px-5 py-6">
      <div className="text-center">
        <p className="text-[11px] font-semibold tracking-widest text-unilever-600 uppercase">
          SIMPLE · POND&apos;S · VASELINE · HAZELINE · AHC
        </p>
        <h1 className="text-2xl font-bold text-ink leading-tight mt-4">
          Khám phá làn da
          <br />
          của bạn trong
          <br />
          30 giây
        </h1>
        <p className="text-sm text-secondary leading-relaxed mt-2">
          AI phân tích da miễn phí · Gợi ý sản phẩm phù hợp
        </p>
      </div>

      <div className="relative mx-auto my-6 flex h-44 w-44 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border border-dashed border-unilever-200 animate-spin"
          style={{ animationDuration: '8s' }}
          aria-hidden
        />
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-unilever-50 shadow-[0_0_40px_rgba(0,77,153,0.15)]">
          <ScanFace size={56} className="text-unilever-600" strokeWidth={1.5} />
        </div>
      </div>

      <div>
        <button
          type="button"
          className="bg-unilever-600 text-white rounded-xl h-14 text-base font-semibold w-full hover:bg-unilever-700 active:scale-[0.98] transition-all"
          onClick={onStart}
        >
          Bắt đầu scan da
        </button>
        <p className="text-xs text-muted text-center mt-3">
          Watson HCMC · Powered by Simple Skin Mirror AI
        </p>
      </div>
    </div>
  )
}
