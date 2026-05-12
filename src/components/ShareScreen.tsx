import { QrCode } from 'lucide-react'

export interface ShareScreenProps {
  onDone: () => void
}

export default function ShareScreen({ onDone }: ShareScreenProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-4 text-center">
      <h2 className="mb-1 font-serif text-lg text-ink">Lưu kết quả của bạn</h2>
      <p className="mb-4 text-center text-[11px] leading-relaxed text-tertiary">
        Quét QR để lưu vào điện thoại — chia sẻ với bạn bè nếu muốn
      </p>

      <div className="relative mx-auto mb-3.5 max-w-[300px] rounded-xl border border-line bg-white p-4 text-left">
        <p className="mb-3 font-serif text-[10px] uppercase tracking-widest text-tertiary">
          Simple Skin Mirror · Watson HCMC
        </p>
        <p className="mb-2.5 font-serif text-base leading-snug text-ink">
          Da hỗn hợp · Cần niacinamide + ẩm nhẹ
        </p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="rounded-sm bg-unilever-50 px-2 py-0.5 text-[10px] font-medium text-unilever-600">
            Dầu cao
          </span>
          <span className="rounded-sm bg-unilever-50 px-2 py-0.5 text-[10px] font-medium text-unilever-600">
            Ẩm thấp
          </span>
          <span className="rounded-sm bg-unilever-50 px-2 py-0.5 text-[10px] font-medium text-unilever-600">
            Viêm nhẹ
          </span>
        </div>
        <div className="mb-2 text-[11px] leading-relaxed text-muted">
          <span className="mb-1 block font-medium text-ink">Recommended routine:</span>
          <span className="block">Supernova Toner · 95.000đ</span>
          <span className="block">Hydrating Light · 75.000đ</span>
        </div>
        <p className="mt-2 border-t border-line pt-2 text-center text-[9px] italic text-tertiary">
          Kết quả phân tích bởi AI · 12/05/2026
        </p>
      </div>

      <div className="mx-auto mb-3.5 flex max-w-[300px] items-center gap-3 rounded-md border border-line bg-white p-3">
        <div className="relative flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-sm border border-ink bg-white">
          <QrCode className="h-12 w-12 text-ink" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="mb-0.5 text-xs font-medium text-ink">Quét để lưu kết quả</p>
          <p className="text-[10px] leading-relaxed text-tertiary">
            Không cần app · không cần email
          </p>
        </div>
      </div>

      <div className="mt-auto pt-2">
        <button
          type="button"
          onClick={onDone}
          className="h-11 w-full rounded-md bg-ink text-sm font-medium text-white hover:opacity-90"
        >
          Xong, ra quầy
        </button>
      </div>
    </div>
  )
}
