import { useState } from "react"
import { Sparkles, Lock } from "lucide-react"

export type CategoryStatus = "available" | "coming-soon"

export type CategoryIconId = "face" | "lipstick" | "hair" | "body"

export interface Category {
  id: string
  icon: CategoryIconId
  label: string
  subtitle: string
  brands: string
  status: CategoryStatus
}

export interface CategoryScreenProps {
  onSelect: (category: string) => void
  onCancel: () => void
}

const CATEGORIES: Category[] = [
  {
    id: "skin",
    icon: "face",
    label: "Da mặt",
    subtitle: "Chăm sóc da",
    brands: "Simple · Pond's · Hazeline",
    status: "available",
  },
  {
    id: "makeup",
    icon: "lipstick",
    label: "Trang điểm",
    subtitle: "Trang điểm",
    brands: "Đang phát triển",
    status: "coming-soon",
  },
  {
    id: "hair",
    icon: "hair",
    label: "Tóc",
    subtitle: "Chăm sóc tóc",
    brands: "Tresemmé · Sunsilk · Clear",
    status: "coming-soon",
  },
  {
    id: "body",
    icon: "body",
    label: "Cơ thể",
    subtitle: "Chăm sóc cơ thể",
    brands: "Vaseline · Dove · AXE",
    status: "coming-soon",
  },
]

function CategoryGlyph({ icon }: { icon: CategoryIconId }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "text-unilever-600",
  }

  switch (icon) {
    case "face":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="12" rx="7" ry="9" />
          <circle cx="9" cy="11" r="0.5" fill="currentColor" />
          <circle cx="15" cy="11" r="0.5" fill="currentColor" />
          <path d="M10 15 Q12 16.5 14 15" />
        </svg>
      )
    case "lipstick":
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="8" rx="1" />
          <rect x="8" y="11" width="8" height="9" rx="1" />
          <path d="M9 11 L9 20" />
          <path d="M15 11 L15 20" />
        </svg>
      )
    case "hair":
      return (
        <svg {...common}>
          <path d="M6 10 Q6 5 12 5 Q18 5 18 10" />
          <path d="M6 10 Q5 14 7 18" />
          <path d="M18 10 Q19 14 17 18" />
          <path d="M9 10 Q9 14 10 18" />
          <path d="M15 10 Q15 14 14 18" />
          <path d="M12 10 L12 18" />
        </svg>
      )
    case "body":
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7 L12 14" />
          <path d="M8 10 L16 10" />
          <path d="M10 14 L9 20" />
          <path d="M14 14 L15 20" />
        </svg>
      )
    default:
      return null
  }
}

export default function CategoryScreen({ onSelect, onCancel }: CategoryScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>("skin")

  return (
    <div className="flex flex-col h-full px-5 pb-5">
      <header className="shrink-0 mb-5">
        <p className="text-[11px] font-semibold tracking-widest text-unilever-600 uppercase mb-1.5 text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 shrink-0" aria-hidden />
          <span>Bạn muốn scan gì hôm nay?</span>
        </p>
        <h1 className="text-2xl font-bold text-ink mb-1 text-center">Chọn loại scan</h1>
        <p className="text-sm text-secondary leading-relaxed text-center">
          Mirror sẽ phân tích và gợi ý sản phẩm phù hợp cho bạn
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {CATEGORIES.map((category) => {
          const isAvailable = category.status === "available"
          const isSelected = selectedId === category.id

          return (
            <button
              key={category.id}
              type="button"
              disabled={!isAvailable}
              onClick={() => {
                if (!isAvailable) return
                setSelectedId(category.id)
                onSelect(category.id)
              }}
              className={[
                "relative bg-white rounded-2xl shadow-sm p-4 text-left transition-all min-h-[5.75rem]",
                isAvailable ? "cursor-pointer" : "opacity-40 pointer-events-none",
                isSelected && isAvailable
                  ? "ring-2 ring-unilever-600 ring-offset-2"
                  : "",
              ].join(" ")}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-unilever-50 flex items-center justify-center shrink-0">
                  <CategoryGlyph icon={category.icon} />
                </div>

                {isAvailable ? (
                  <span className="shrink-0 rounded-full bg-unilever-600 px-2 py-0.5 text-[10px] font-medium text-white">
                    Có sẵn
                  </span>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] text-tertiary shrink-0">
                    <Lock className="w-[11px] h-[11px] shrink-0 text-tertiary" aria-hidden />
                    <span>Sắp ra mắt</span>
                  </div>
                )}
              </div>

              <div className="font-semibold text-base text-ink mb-0.5 leading-tight">{category.label}</div>
              <div className="text-[10px] text-tertiary uppercase tracking-wider mb-1.5">
                {category.subtitle}
              </div>
              <div className="text-xs text-muted leading-snug">{category.brands}</div>
            </button>
          )
        })}
      </div>

      <div className="mt-auto text-center shrink-0">
        <button
          type="button"
          className="text-unilever-600 underline-offset-2 text-sm hover:underline"
          onClick={onCancel}
        >
          Quay lại
        </button>
      </div>
    </div>
  )
}
