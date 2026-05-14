import { Sparkles, Check, Lock } from "lucide-react"

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
    subtitle: "Skincare",
    brands: "Simple · Pond's · Hazeline",
    status: "available",
  },
  {
    id: "makeup",
    icon: "lipstick",
    label: "Trang điểm",
    subtitle: "Makeup",
    brands: "Đang phát triển",
    status: "coming-soon",
  },
  {
    id: "hair",
    icon: "hair",
    label: "Tóc",
    subtitle: "Haircare",
    brands: "Tresemmé · Sunsilk · Clear",
    status: "coming-soon",
  },
  {
    id: "body",
    icon: "body",
    label: "Cơ thể",
    subtitle: "Personal Care",
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
  return (
    <div className="flex flex-col h-full">
      <header className="shrink-0">
        <p className="text-[10px] text-unilever-600 uppercase tracking-widest font-medium mb-1.5 text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 shrink-0" aria-hidden />
          <span>BẠN MUỐN SCAN GÌ HÔM NAY?</span>
          <Check className="w-3 h-3 shrink-0" strokeWidth={2.25} aria-hidden />
        </p>
        <h1 className="font-serif text-lg text-ink mb-1 text-center">Chọn loại scan</h1>
        <p className="text-[11px] text-tertiary leading-relaxed text-center mb-5">
          Mirror sẽ phân tích và gợi ý sản phẩm phù hợp cho bạn
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {CATEGORIES.map((category) => {
          const isAvailable = category.status === "available"

          return (
            <button
              key={category.id}
              type="button"
              disabled={!isAvailable}
              onClick={() => {
                if (isAvailable) onSelect(category.id)
              }}
              className={[
                "relative bg-white border rounded-lg p-3.5 text-left transition-all min-h-[5.75rem]",
                isAvailable
                  ? "border-unilever-600 border-[1.5px] cursor-pointer hover:border-unilever-400 hover:bg-unilever-50/30"
                  : "border-line opacity-50 cursor-not-allowed",
              ].join(" ")}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-unilever-50 flex items-center justify-center shrink-0">
                  <CategoryGlyph icon={category.icon} />
                </div>

                {isAvailable ? (
                  <div className="flex items-center gap-1 text-[10px] text-green-700 font-medium shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" aria-hidden />
                    <span>Có sẵn</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] text-tertiary shrink-0">
                    <Lock className="w-[11px] h-[11px] shrink-0 text-[#888780]" aria-hidden />
                    <span>Sắp ra mắt</span>
                  </div>
                )}
              </div>

              <div className="font-serif text-base text-ink mb-0.5 leading-tight">{category.label}</div>
              <div className="text-[10px] text-tertiary uppercase tracking-wider mb-1.5">
                {category.subtitle}
              </div>
              <div className="text-[11px] text-muted leading-snug">{category.brands}</div>
            </button>
          )
        })}
      </div>

      <div className="mt-4 text-center shrink-0">
        <button
          type="button"
          className="bg-transparent border border-tertiary text-[11px] text-ink px-3.5 py-1.5 rounded-md hover:bg-sand min-h-[2.25rem]"
          onClick={onCancel}
        >
          Quay lại
        </button>
      </div>
    </div>
  )
}
