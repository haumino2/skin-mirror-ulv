const METRICS: Array<{
  label: string
  value: number
  percent: number
  color: string
}> = [
  { label: "Dầu", value: 7.8, percent: 78, color: "#EF9F27" },
  { label: "Ẩm", value: 4.2, percent: 42, color: "#85B7EB" },
  { label: "Viêm", value: 6.2, percent: 62, color: "#E24B4A" },
  { label: "Lỗ chân lông", value: 5.5, percent: 55, color: "#a0aec0" },
  { label: "Texture", value: 4.8, percent: 48, color: "#a0aec0" },
]

export default function SkinMapDetail() {
  return (
    <div>
      <div className="grid grid-cols-[1fr_1.3fr] gap-3.5 mb-3">
        <div className="w-full aspect-square bg-sand rounded-2xl overflow-hidden relative shadow-sm">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            <ellipse cx="50" cy="50" rx="32" ry="42" fill="#E5DDD0" />
            <ellipse cx="50" cy="38" rx="22" ry="14" fill="#FAC775" opacity="0.55" />
            <circle cx="38" cy="58" r="6" fill="#F09595" opacity="0.7" />
            <circle cx="62" cy="58" r="6" fill="#F09595" opacity="0.7" />
            <ellipse cx="50" cy="76" rx="9" ry="6" fill="#F09595" opacity="0.7" />
            <circle cx="36" cy="56" r="1.2" fill="#A32D2D" />
            <circle cx="40" cy="60" r="1" fill="#A32D2D" />
            <circle cx="63" cy="55" r="1.2" fill="#A32D2D" />
            <circle cx="50" cy="74" r="1.4" fill="#A32D2D" />
            <circle cx="52" cy="78" r="1" fill="#A32D2D" />
          </svg>
        </div>

        <div className="flex flex-col gap-1.5">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-between text-[11px]"
            >
              <div className="text-muted min-w-[62px]">{m.label}</div>

              <div className="flex-1 mx-2 h-1 bg-line rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${m.percent}%`, backgroundColor: m.color }}
                />
              </div>

              <div className="font-medium text-ink min-w-[28px] text-right">
                {m.value.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-secondary leading-relaxed">
        Benchmark (da hỗn hợp): mức <span className="text-ink">dầu</span> và{" "}
        <span className="text-ink">viêm</span> cao hơn trung bình;{" "}
        <span className="text-ink">độ ẩm</span> và <span className="text-ink">texture</span>{" "}
        ở mức trung bình–thấp. Ưu tiên cân bằng dầu vùng chữ T và làm dịu vùng má/cằm.
      </div>
    </div>
  )
}

