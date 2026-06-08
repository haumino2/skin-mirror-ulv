import TabletFrame from "./components/TabletFrame"
import StageBar from "./components/StageBar"
import IdleScreen from "./components/IdleScreen"
import ConsentScreen from "./components/ConsentScreen"
import CategoryScreen from "./components/CategoryScreen"
import ScanScreen from "./components/ScanScreen"
import ResultScreen from "./components/ResultScreen"
import ProjectionScreen from "./components/ProjectionScreen"
import ShareScreen from "./components/ShareScreen"
import RecoveryScreen from "./components/RecoveryScreen"
import { useState } from "react"
import type { SkinAnalysisResult } from "./lib/claudeSkinAnalysis"

function App() {
  const [currentStage, setCurrentStage] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("skin")
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysisResult | null>(null)

  const stageBarCurrentStage = currentStage === 99 ? 4 : currentStage

  const renderStageContent = () => {
    switch (currentStage) {
      case 0:
        return <IdleScreen onStart={() => setCurrentStage(1)} />
      case 1:
        return (
          <ConsentScreen
            onAccept={() => setCurrentStage(2)}
            onCancel={() => setCurrentStage(0)}
          />
        )
      case 2:
        return (
          <CategoryScreen
            onSelect={(cat) => {
              setSelectedCategory(cat)
              setCurrentStage(3)
            }}
            onCancel={() => setCurrentStage(1)}
          />
        )
      case 3:
        return (
          <ScanScreen
            key={selectedCategory}
            onComplete={(result) => {
              setSkinAnalysis(result)
              setCurrentStage(4)
            }}
          />
        )
      case 4:
        return (
          <ResultScreen
            analysis={skinAnalysis}
            onNext={() => setCurrentStage(5)}
            onScanAgain={() => {
              setSkinAnalysis(null)
              setCurrentStage(3)
            }}
            onFeedbackNo={() => setCurrentStage(99)}
          />
        )
      case 5:
        return (
          <ProjectionScreen
            onNext={() => setCurrentStage(6)}
            onSaveQR={() => setCurrentStage(6)}
          />
        )
      case 6:
        return <ShareScreen onDone={() => setCurrentStage(0)} />
      case 99:
        return <RecoveryScreen onBackToIdle={() => setCurrentStage(0)} />
      default:
        return null
    }
  }

  const prevDisabled = currentStage === 0
  const nextDisabled = currentStage === 6 || currentStage === 99

  const handlePrev = () => {
    if (currentStage === 99) {
      setCurrentStage(4)
      return
    }
    setCurrentStage((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentStage((prev) => Math.min(6, prev + 1))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TabletFrame>
        <StageBar
          currentStage={stageBarCurrentStage}
          onStageClick={setCurrentStage}
        />
        {renderStageContent()}
      </TabletFrame>
      <div className="flex justify-between max-w-[480px] mx-auto mt-4 px-2">
        <button
          type="button"
          className="bg-white border border-line rounded-md px-3.5 py-2 text-xs text-ink disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={prevDisabled}
          onClick={handlePrev}
        >
          ← Trước
        </button>

        <span className="text-xs text-muted self-center">
          {currentStage === 99
            ? "Recovery flow"
            : `Stage ${currentStage + 1} / 7`}
        </span>

        <button
          type="button"
          className="bg-white border border-line rounded-md px-3.5 py-2 text-xs text-ink disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={nextDisabled}
          onClick={handleNext}
        >
          Tiếp →
        </button>
      </div>
    </div>
  )
}

export default App
