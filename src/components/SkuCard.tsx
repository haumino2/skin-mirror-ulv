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

  return (
    <div
      className={[
        'relative min-h-min rounded-lg border bg-white p-3',
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

      <div className="font-serif text-sm leading-tight text-ink mb-0.5">{name}</div>

      <p className="mb-1.5 text-[10px] leading-snug text-tertiary">{description}</p>

      <div className="mb-1.5 text-sm font-medium text-ink">{price}</div>

      <p className="text-[10px] leading-snug text-muted">{reason}</p>
    </div>
  )
}
