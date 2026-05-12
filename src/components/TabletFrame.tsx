import type { ReactNode } from "react"

export interface TabletFrameProps {
  children: ReactNode
}

export default function TabletFrame({ children }: TabletFrameProps) {
  return (
    <div className="w-full flex justify-center py-4">
      <div className="w-full max-w-[480px] mx-auto bg-ink rounded-[18px] p-3.5">
        <div className="bg-cream rounded-md min-h-[600px] p-6">{children}</div>
      </div>
    </div>
  )
}
