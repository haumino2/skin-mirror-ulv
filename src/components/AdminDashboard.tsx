import type { ReactNode } from 'react'
import { mockAnalytics } from '../data/mockAnalytics'

function formatNumber(value: number): string {
  return value.toLocaleString('vi-VN')
}

function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`
}

interface MetricCardProps {
  label: string
  value: string
  hint?: string
}

function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-semibold text-2xl text-ink">{value}</p>
      {hint ? <p className="mt-0.5 text-[10px] text-tertiary">{hint}</p> : null}
    </div>
  )
}

interface SectionCardProps {
  title: string
  children: ReactNode
}

function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 font-semibold text-base text-ink">{title}</h2>
      {children}
    </section>
  )
}

export interface AdminDashboardProps {
  onBack?: () => void
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const {
    totalScans,
    scanCompletionRate,
    routineSaveRate,
    promoClickRate,
    baHandoffCount,
    chatQuestionCount,
    voicePlaybackCount,
    topConcerns,
    topQuestions,
    topProducts,
    recommendedActions,
  } = mockAnalytics

  const maxConcernPercentage = Math.max(...topConcerns.map((c) => c.percentage), 1)
  const maxProductRecommended = Math.max(
    ...topProducts.map((p) => p.recommendedCount),
    1,
  )

  return (
    <div className="min-h-screen bg-sand px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="mb-3 bg-white text-ink rounded-xl h-14 text-base border border-line px-4 hover:bg-sand"
            >
              ← Quay lại shopper flow
            </button>
          ) : null}
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">
            Demo view
          </h1>
          <p className="mt-1 text-sm text-muted">
            Skin Mirror Retail Learning · Simple · Watson HCMC
          </p>
          <p className="mt-1 text-[11px] text-tertiary">
            Chỉ dành cho presenter — không hiển thị trong flow khách hàng
          </p>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          <MetricCard label="Total scans" value={formatNumber(totalScans)} />
          <MetricCard
            label="Scan completion"
            value={formatPercent(scanCompletionRate)}
            hint="Hoàn tất flow scan → kết quả"
          />
          <MetricCard
            label="Save rate"
            value={formatPercent(routineSaveRate)}
            hint="Lưu routine sau scan"
          />
          <MetricCard
            label="Promo clicks"
            value={formatPercent(promoClickRate)}
            hint="Tap CTA ưu đãi Watson"
          />
          <MetricCard label="BA handoff" value={formatNumber(baHandoffCount)} />
          <MetricCard label="Chat questions" value={formatNumber(chatQuestionCount)} />
          <MetricCard label="Voice playback" value={formatNumber(voicePlaybackCount)} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Top skin concerns">
            <ul className="space-y-3">
              {topConcerns.map((concern) => (
                <li key={concern.label}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-[11px]">
                    <span className="text-ink">{concern.label}</span>
                    <span className="shrink-0 text-muted">
                      {formatNumber(concern.count)} · {concern.percentage}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-sm bg-sand">
                    <div
                      className="h-full rounded-sm bg-unilever-600"
                      style={{ width: `${(concern.percentage / maxConcernPercentage) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Top recommended products">
            <ul className="space-y-3">
              {topProducts.map((product) => (
                <li key={product.productName}>
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <span className="text-[11px] leading-snug text-ink">{product.productName}</span>
                    <span className="shrink-0 text-[10px] text-muted">
                      {formatNumber(product.clickedCount)} clicks
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-sm bg-sand">
                    <div
                      className="h-full rounded-sm bg-unilever-400"
                      style={{
                        width: `${(product.recommendedCount / maxProductRecommended) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] text-tertiary">
                    {formatNumber(product.recommendedCount)} lần gợi ý
                  </p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="mt-4">
          <SectionCard title="Top shopper questions">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-[11px]">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="pb-2 pr-3 font-medium">Cluster</th>
                    <th className="pb-2 pr-3 font-medium">Count</th>
                    <th className="pb-2 pr-3 font-medium">Example question</th>
                    <th className="pb-2 font-medium">Suggested action</th>
                  </tr>
                </thead>
                <tbody>
                  {topQuestions.map((question) => (
                    <tr key={question.cluster} className="border-b border-line last:border-0">
                      <td className="py-2.5 pr-3 align-top font-medium text-ink">
                        {question.cluster}
                      </td>
                      <td className="py-2.5 pr-3 align-top text-muted">
                        {formatNumber(question.count)}
                      </td>
                      <td className="py-2.5 pr-3 align-top text-ink">
                        {question.exampleQuestion}
                      </td>
                      <td className="py-2.5 align-top text-muted">{question.suggestedAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="mt-4">
          <SectionCard title="Recommended business actions">
            <ul className="space-y-3">
              {recommendedActions.map((action) => (
                <li
                  key={action.title}
                  className="rounded-2xl bg-sand px-4 py-3 shadow-sm"
                >
                  <p className="text-[11px] font-medium text-ink">{action.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">{action.rationale}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
