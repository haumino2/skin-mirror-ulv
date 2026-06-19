import { MapPin } from 'lucide-react'

export interface SkuCardProps {
  tag: string
  name: string
  description: string
  price: string
  reason: string
  variant?: 'primary' | 'secondary'
  brand?: string
  imageUrl?: string
  shelf?: string
}

export default function SkuCard({
  tag,
  name,
  description,
  price,
  reason,
  variant = 'primary',
  brand,
  imageUrl,
  shelf,
}: SkuCardProps) {
  const isPrimary = variant === 'primary'
  const hasPrice = price.trim().length > 0
  const hasReason = reason.trim().length > 0
  const hasShelf = shelf != null && shelf.trim().length > 0

  return (
    <div
      className={[
        'relative flex min-h-min min-w-0 flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-sm',
        isPrimary ? 'ring-2 ring-unilever-600 ring-offset-2' : '',
      ].join(' ')}
    >
      <span
        className={[
          'absolute left-3 top-[-7px] rounded-full px-2 py-0.5 text-[9px] font-medium tracking-wide text-white',
          isPrimary ? 'bg-unilever-600' : 'bg-tertiary',
        ].join(' ')}
      >
        {tag}
      </span>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="mx-auto mb-2 h-24 object-contain"
        />
      ) : null}

      {brand ? (
        <span className="inline-flex bg-unilever-50 text-unilever-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-unilever-100 mb-1 w-fit">
          {brand}
        </span>
      ) : null}

      <div className="mb-0.5 break-words font-semibold text-sm leading-tight text-ink">
        {name}
      </div>

      <p className="mb-1.5 break-words text-xs leading-snug text-muted">
        {description}
      </p>

      {hasPrice ? (
        <div className="mb-1.5 break-words text-sm font-medium text-ink">{price}</div>
      ) : null}

      {hasReason ? (
        <p className="mb-1.5 line-clamp-2 text-[10px] leading-snug text-muted">
          {reason}
        </p>
      ) : null}

      {hasShelf ? (
        <div className="mt-auto flex items-center gap-1 pt-1">
          <MapPin size={10} className="shrink-0 text-muted" aria-hidden />
          <span className="text-xs text-muted">{shelf}</span>
        </div>
      ) : null}
    </div>
  )
}
