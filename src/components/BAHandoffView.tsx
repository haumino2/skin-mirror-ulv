import type { ReactNode } from 'react'
import { mockWatsonPromo, type WatsonPromo } from '../data/promoConfig'
import { formatConcernList, getConcernLabel } from '../data/vietnameseSkinGlossary'
import type {
  RoutineRecommendation,
  SkinAnalysisResult,
  SkinGoal,
} from '../types/skinMirror'

export type BAHandoffViewProps = {
  skinResult?: SkinAnalysisResult
  recommendation?: RoutineRecommendation
  promo?: WatsonPromo
  onBack?: () => void
}

const SKIN_TYPE_LABELS: Record<string, string> = {
  oily: 'da dầu',
  dry: 'da khô',
  combination: 'da hỗn hợp',
  normal: 'da thường',
}

const GOAL_LABELS: Record<SkinGoal, string> = {
  hydrate: 'cấp ẩm',
  reduce_oil: 'giảm dầu',
  calm: 'làm dịu',
  smooth_texture: 'cải thiện texture',
}

function formatSkinType(skinType: string): string {
  const key = skinType.trim().toLowerCase()
  return SKIN_TYPE_LABELS[key] ?? skinType
}

function buildBaPitch(
  skinResult: SkinAnalysisResult,
  recommendation?: RoutineRecommendation,
): string {
  const skinType = formatSkinType(skinResult.skinType)
  const primaryConcern = skinResult.concerns[0]
    ? getConcernLabel(skinResult.concerns[0])
    : 'chưa rõ'
  const goal = recommendation?.goal
    ? GOAL_LABELS[recommendation.goal]
    : 'cân bằng da'
  const firstProduct =
    recommendation?.products[0]?.name ?? 'sản phẩm Simple phù hợp'

  return `Khách có xu hướng ${skinType}, concern chính là ${primaryConcern}. Nên tư vấn routine Simple theo hướng ${goal}, ưu tiên ${firstProduct}.`
}

function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-unilever-600">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function BAHandoffView({
  skinResult,
  recommendation,
  promo = mockWatsonPromo,
  onBack,
}: BAHandoffViewProps) {
  if (!skinResult) {
    return (
      <div className="flex flex-col px-5 pb-5">
        <p className="mb-4 text-sm text-muted">
          Chưa có kết quả scan để tóm tắt cho BA.
        </p>
        {onBack ? (
          <button
            type="button"
            className="bg-white text-ink rounded-xl h-14 text-base border border-line w-full"
            onClick={onBack}
          >
            Quay lại kết quả
          </button>
        ) : null}
      </div>
    )
  }

  const baPitch = buildBaPitch(skinResult, recommendation)
  const concernLabels = formatConcernList(skinResult.concerns)

  return (
    <div className="flex flex-col px-5 pb-5">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-ink">Gợi ý cho BA</h1>
        <p className="mt-1 text-sm leading-snug text-secondary">
          Tóm tắt nhanh để BA tư vấn tại quầy — dựa trên kết quả scan.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <Section title="Skin profile">
          <p className="mb-1.5 font-semibold text-sm text-ink">
            {formatSkinType(skinResult.skinType)}
          </p>
          {skinResult.insight ? (
            <p className="text-sm leading-snug text-secondary">{skinResult.insight}</p>
          ) : null}
        </Section>

        <Section title="Concern chính">
          {skinResult.concerns.length ? (
            <p className="text-sm text-ink">{concernLabels}</p>
          ) : (
            <p className="text-xs text-muted">Chưa có concern nổi bật.</p>
          )}
        </Section>

        <Section title="Routine Simple gợi ý">
          {recommendation ? (
            <>
              <p className="mb-2 font-semibold text-sm text-ink">{recommendation.title}</p>
              <p className="mb-2.5 text-sm leading-snug text-secondary">
                {recommendation.summary}
              </p>
              <ul className="flex flex-col gap-1.5">
                {recommendation.products.map((product) => (
                  <li
                    key={product.id}
                    className="text-sm text-ink before:mr-1.5 before:text-muted before:content-['•']"
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-xs text-muted">Chưa có gợi ý routine.</p>
          )}
        </Section>

        <Section title="Câu tư vấn nhanh">
          <p className="rounded-2xl bg-unilever-50 px-4 py-3 text-sm leading-relaxed text-unilever-900">
            {baPitch}
          </p>
        </Section>

        <Section title="Promo / combo cần kiểm tra">
          <p className="mb-1 font-semibold text-sm text-ink">{promo.comboName}</p>
          <p className="mb-1 text-sm leading-snug text-secondary">{promo.description}</p>
          <p className="text-xs leading-snug text-muted">{promo.disclaimer}</p>
        </Section>
      </div>

      {onBack ? (
        <button
          type="button"
          className="mt-4 bg-white text-ink rounded-xl h-14 text-base border border-line w-full"
          onClick={onBack}
        >
          Quay lại kết quả
        </button>
      ) : null}
    </div>
  )
}
