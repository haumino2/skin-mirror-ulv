import type { ReactNode } from "react"

export interface TabletFrameProps {
  children: ReactNode
}

export default function TabletFrame({ children }: TabletFrameProps) {
  return (
    <div className="w-full max-w-[480px] mx-auto bg-[#1a1a2e] rounded-[2.5rem] p-3 shadow-2xl">
      <div className="bg-[#0d0d1a] rounded-[2rem] p-1">
        <div className="bg-white rounded-[1.75rem] overflow-hidden min-h-[640px]">
          <div
            className="w-16 h-1.5 bg-[#2d2d3a] rounded-full mx-auto mb-2 mt-1"
            aria-hidden="true"
          />
          {children}
        </div>
      </div>
    </div>
  )
}
