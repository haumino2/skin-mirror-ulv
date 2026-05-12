export interface ConsentScreenProps {
  onAccept: () => void
  onCancel: () => void
}

export default function ConsentScreen({ onAccept, onCancel }: ConsentScreenProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="font-serif text-xl text-ink mb-1.5">Trước khi bắt đầu</div>

      <div className="text-xs text-muted leading-relaxed mb-4">
        Mirror sẽ scan da bạn trong 5 giây để gợi ý sản phẩm phù hợp.
      </div>

      <div className="bg-white border border-line rounded-md p-3.5 mb-4">
        <div className="text-xs font-medium text-ink mb-1.5">Privacy by design</div>
        <div className="space-y-1">
          <div className="text-xs text-muted leading-relaxed">
            · Ảnh xử lý trực tiếp trên tablet, không gửi lên cloud
          </div>
          <div className="text-xs text-muted leading-relaxed">
            · Không lưu ảnh sau khi bạn rời khỏi
          </div>
          <div className="text-xs text-muted leading-relaxed">
            · Bạn có thể chọn không show kết quả trên màn hình
          </div>
        </div>
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          className="h-11 bg-ink text-white px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 flex-shrink-0 flex items-center justify-center"
          onClick={onAccept}
        >
          Đồng ý, scan ngay
        </button>
        <button
          type="button"
          className="h-11 bg-transparent border border-tertiary text-ink px-4 py-2.5 rounded-md text-sm hover:bg-sand flex items-center justify-center"
          onClick={onCancel}
        >
          Để sau
        </button>
      </div>
    </div>
  )
}
