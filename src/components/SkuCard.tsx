export interface SkuCardProps {
  tag: string
  name: string
  description: string
  price: string
  reason: string
  variant?: 'primary' | 'secondary'
}

export default function SkuCard({
  tag,
  name,
  description,
  price,
  reason,
  variant = 'primary',
}: SkuCardProps) {
  const isPrimary = variant === 'primary'
  const hasPrice = price.trim().length > 0
  const hasReason = reason.trim().length > 0

  return (
    <div
      className={[
        'relative min-h-min rounded-lg border bg-white p-3 min-w-0 overflow-hidden',
        isPrimary ? 'border-unilever-600' : 'border-tertiary',
      ].join(' ')}
    >
      <span
        className={[
          'absolute left-2.5 top-[-7px] rounded-sm px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-white',
          isPrimary ? 'bg-unilever-600' : 'bg-tertiary',
        ].join(' ')}
      >
        {tag}
      </span>

      <div className="font-serif text-sm leading-tight text-ink mb-0.5 break-words">
        {name}
      </div>

      <p className="mb-1.5 text-[10px] leading-snug text-tertiary break-words">
        {description}
      </p>

      {hasPrice ? (
        <div className="mb-1.5 text-sm font-medium text-ink break-words">{price}</div>
      ) : null}

      {hasReason ? (
        <p className="text-[10px] leading-snug text-muted break-words">{reason}</p>
      ) : null}
    </div>
  )
}
