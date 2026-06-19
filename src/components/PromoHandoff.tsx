import { mockWatsonPromo, type WatsonPromo } from '../data/promoConfig'
import { trackEvent } from '../lib/eventTracker'

export type PromoHandoffProps = {
  promo?: WatsonPromo
  onSaveOffer: () => void
  onShowBA: () => void
  onAskBA: () => void
}

export default function PromoHandoff({
  promo = mockWatsonPromo,
  onSaveOffer,
  onShowBA,
  onAskBA,
}: PromoHandoffProps) {
  return (
    <section className="rounded-2xl bg-white shadow-sm p-4">
      <header className="mb-3">
        <h2 className="mb-1 text-base font-semibold leading-snug text-ink">
          {promo.title}
        </h2>
        <p className="mb-1.5 text-sm font-medium text-ink">{promo.comboName}</p>
        <p className="text-sm leading-relaxed text-secondary">
          {promo.description}
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="bg-unilever-600 text-white rounded-xl h-14 text-base font-semibold w-full hover:bg-unilever-700 active:scale-[0.98] transition-all"
          onClick={() => {
            trackEvent('promo_clicked', { comboName: promo.comboName })
            onSaveOffer()
          }}
        >
          {promo.ctaPrimary}
        </button>

        <button
          type="button"
          className="bg-white text-ink rounded-xl h-14 text-base border border-line w-full"
          onClick={() => {
            trackEvent('ba_handoff_clicked')
            onShowBA()
          }}
        >
          {promo.ctaSecondary}
        </button>

        <button
          type="button"
          className="text-unilever-600 underline-offset-2 text-sm hover:underline"
          onClick={onAskBA}
        >
          {promo.ctaTertiary}
        </button>
      </div>

      <p className="mt-3 text-xs text-muted leading-relaxed">
        {promo.disclaimer}
      </p>
    </section>
  )
}
