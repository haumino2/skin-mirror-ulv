import { trackEvent } from '../lib/eventTracker'
import type { Product, RoutineRecommendation as RoutineRecommendationData } from '../types/skinMirror'

export type RoutineRecommendationProps = {
  recommendation?: RoutineRecommendationData
  onProductClick?: (productId: string) => void
  onShowBA?: () => void
}

const ROUTINE_STEP_ORDER: Product['routineStep'][] = [
  'cleanse',
  'hydrate',
  'calm_repair',
  'protect',
]

const STEP_LABELS: Record<Product['routineStep'], string> = {
  cleanse: 'Làm sạch',
  hydrate: 'Cấp ẩm',
  calm_repair: 'Làm dịu & phục hồi',
  protect: 'Bảo vệ',
}

function stepOrderIndex(step: Product['routineStep']): number {
  const index = ROUTINE_STEP_ORDER.indexOf(step)
  return index === -1 ? ROUTINE_STEP_ORDER.length : index
}

function sortProductsByRoutineStep(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => stepOrderIndex(a.routineStep) - stepOrderIndex(b.routineStep),
  )
}

function ProductRoutineCard({
  product,
  onProductClick,
  onShowBA,
}: {
  product: Product
  onProductClick?: (productId: string) => void
  onShowBA?: () => void
}) {
  const stepLabel = STEP_LABELS[product.routineStep]

  return (
    <article className="relative rounded-2xl bg-white p-4 shadow-sm min-w-0">
      <span className="absolute left-4 top-[-7px] rounded-full bg-unilever-600 px-2 py-0.5 text-[9px] font-medium tracking-wide text-white">
        {stepLabel}
      </span>

      <div className="mb-1 font-semibold text-sm leading-tight text-ink break-words">
        {product.name}
      </div>

      <p className="mb-2 text-sm leading-snug text-secondary break-words">
        {product.whyRecommended}
      </p>

      <p className="mb-2.5 text-xs leading-snug text-muted break-words">
        <span className="font-medium text-ink">Cách dùng: </span>
        {product.usage}
      </p>

      {product.claims.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {product.claims.map((claim) => (
            <span
              key={claim}
              className="rounded-full bg-unilever-50 px-2 py-0.5 text-[10px] font-medium text-unilever-600"
            >
              {claim}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          className="bg-unilever-600 text-white rounded-xl h-14 text-base font-semibold flex-1 hover:bg-unilever-700 active:scale-[0.98] transition-all"
          onClick={() => {
            trackEvent('product_card_clicked', { productId: product.id })
            onProductClick?.(product.id)
          }}
        >
          Thêm vào routine
        </button>

        {onShowBA ? (
          <button
            type="button"
            className="bg-white text-ink rounded-xl h-14 text-base border border-line shrink-0 px-4 sm:min-w-[7.5rem]"
            onClick={onShowBA}
          >
            Show to BA
          </button>
        ) : null}
      </div>
    </article>
  )
}

export default function RoutineRecommendation({
  recommendation,
  onProductClick,
  onShowBA,
}: RoutineRecommendationProps) {
  if (!recommendation) {
    return (
      <p className="rounded-2xl bg-white shadow-sm px-4 py-3 text-xs text-muted">
        Chưa có gợi ý routine Simple. Hãy scan lại để nhận gợi ý phù hợp.
      </p>
    )
  }

  const simpleProducts = sortProductsByRoutineStep(
    recommendation.products.filter((product) => product.brand === 'Simple'),
  )

  return (
    <section className="flex flex-col">
      <header className="mb-3">
        <h2 className="mb-1 text-2xl font-bold text-ink">
          Routine Simple gợi ý cho bạn
        </h2>
        <p className="text-sm leading-relaxed text-secondary">
          {recommendation.summary}
        </p>
      </header>

      {simpleProducts.length > 0 ? (
        <div className="flex flex-col gap-3">
          {simpleProducts.map((product) => (
            <ProductRoutineCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              onShowBA={onShowBA}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-white shadow-sm px-4 py-3 text-xs text-muted">
          Chưa có sản phẩm Simple phù hợp cho routine này.
        </p>
      )}
    </section>
  )
}
