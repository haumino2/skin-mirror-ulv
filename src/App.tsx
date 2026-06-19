import TabletFrame from "./components/TabletFrame"
import StageBar from "./components/StageBar"
import IdleScreen from "./components/IdleScreen"
import ConsentScreen from "./components/ConsentScreen"
import CategoryScreen from "./components/CategoryScreen"
import ScanScreen from "./components/ScanScreen"
import ResultScreen from "./components/ResultScreen"
import MicroQuiz from "./components/MicroQuiz"
import ProjectionScreen from "./components/ProjectionScreen"
import ShareScreen from "./components/ShareScreen"
import RecoveryScreen from "./components/RecoveryScreen"
import DemoToolbar from "./components/DemoToolbar"
import { useCallback, useEffect, useState } from "react"
import { demoSessions } from "./data/demoSessions"
import type { SkinAnalysisResult, SkinType } from "./lib/claudeSkinAnalysis"
import {
  buildRoutineRecommendation,
  getDefaultGoalFromSkinResult,
  getDefaultPreference,
} from "./lib/routineRecommendation"
import type { DemoSession, RoutinePreference, SkinGoal } from "./types/skinMirror"

const demoMode = import.meta.env.VITE_DEMO_MODE === "true"

function mapDemoSkinType(label: string): SkinType {
  const normalized = label.toLowerCase()
  if (normalized.includes("khô") || normalized.includes("kho")) return "dry"
  if (normalized.includes("dầu") || normalized.includes("dau")) return "oily"
  if (normalized.includes("hỗn hợp") || normalized.includes("hon hop")) {
    return "combination"
  }
  return "normal"
}

function demoSessionToAnalysis(session: DemoSession): SkinAnalysisResult {
  const result = session.result
  return {
    skinType: mapDemoSkinType(result.skinType),
    concerns: [...result.concerns],
    scores: {
      redness: result.scores.redness,
      oiliness: result.scores.oiliness,
      texture: result.scores.texture,
      pores: result.scores.pores,
      hydration: result.scores.hydration,
      pigmentation: result.scores.dullness,
    },
    recommendations: [result.insight],
  }
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true
  return target.isContentEditable
}

function App() {
  const [currentStage, setCurrentStage] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("skin")
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysisResult | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<SkinGoal>("hydrate")
  const [selectedPreference, setSelectedPreference] =
    useState<RoutinePreference>("minimal_2_step")
  const [resultSubStep, setResultSubStep] = useState<"result" | "quiz">("result")
  const [demoToolbarVisible, setDemoToolbarVisible] = useState(false)
  const [activePersonaIndex, setActivePersonaIndex] = useState<number | null>(null)

  const resetSessionFlow = () => {
    setSkinAnalysis(null)
    setResultSubStep("result")
    setSelectedGoal("hydrate")
    setSelectedPreference("minimal_2_step")
  }

  const applyRoutineRecommendation = (goal: SkinGoal, preference: RoutinePreference) => {
    if (!skinAnalysis) return
    setSelectedGoal(goal)
    setSelectedPreference(preference)
    buildRoutineRecommendation(skinAnalysis, goal, preference)
    setCurrentStage(5)
  }

  const handleQuizContinue = () => {
    applyRoutineRecommendation(selectedGoal, selectedPreference)
  }

  const handleQuizSkip = () => {
    if (!skinAnalysis) return
    const goal = getDefaultGoalFromSkinResult(skinAnalysis)
    const preference = getDefaultPreference()
    applyRoutineRecommendation(goal, preference)
  }

  const loadDemoPersona = useCallback((index: number) => {
    const session = demoSessions[index]
    if (!session) return
    setSkinAnalysis(demoSessionToAnalysis(session))
    setSelectedGoal(session.goal)
    setSelectedPreference(session.preference)
    setResultSubStep("result")
    setActivePersonaIndex(index)
    setCurrentStage(4)
  }, [])

  const jumpToResult = useCallback(() => {
    if (!skinAnalysis) {
      loadDemoPersona(0)
      return
    }
    setResultSubStep("result")
    setCurrentStage(4)
  }, [skinAnalysis, loadDemoPersona])

  const jumpToShare = useCallback(() => {
    if (!skinAnalysis) {
      loadDemoPersona(0)
    }
    setCurrentStage(6)
  }, [skinAnalysis, loadDemoPersona])

  const resetDemo = useCallback(() => {
    resetSessionFlow()
    setActivePersonaIndex(null)
    setCurrentStage(0)
  }, [])

  useEffect(() => {
    if (!demoMode) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      const key = event.key.toLowerCase()

      if (key === "escape") {
        if (demoToolbarVisible) {
          event.preventDefault()
          setDemoToolbarVisible(false)
        }
        return
      }

      if (key === "d") {
        event.preventDefault()
        setDemoToolbarVisible((prev) => !prev)
        return
      }

      if (key >= "1" && key <= "4") {
        event.preventDefault()
        loadDemoPersona(Number(key) - 1)
        return
      }

      if (key === "r") {
        event.preventDefault()
        jumpToResult()
        return
      }

      if (key === "s") {
        event.preventDefault()
        jumpToShare()
        return
      }

      if (key === "a") {
        event.preventDefault()
        window.open("/admin.html", "_blank")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    demoToolbarVisible,
    jumpToResult,
    jumpToShare,
    loadDemoPersona,
  ])

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
              setSelectedGoal(getDefaultGoalFromSkinResult(result))
              setSelectedPreference(getDefaultPreference())
              setResultSubStep("result")
              setCurrentStage(4)
            }}
          />
        )
      case 4:
        if (resultSubStep === "quiz") {
          return (
            <MicroQuiz
              selectedGoal={selectedGoal}
              selectedPreference={selectedPreference}
              onChangeGoal={setSelectedGoal}
              onChangePreference={setSelectedPreference}
              onContinue={handleQuizContinue}
              onSkip={handleQuizSkip}
            />
          )
        }
        return (
          <ResultScreen
            analysis={skinAnalysis}
            routineRecommendation={
              skinAnalysis
                ? buildRoutineRecommendation(
                    skinAnalysis,
                    selectedGoal,
                    selectedPreference,
                  )
                : undefined
            }
            selectedGoal={selectedGoal}
            selectedPreference={selectedPreference}
            onNext={() => setResultSubStep("quiz")}
            onScanAgain={() => {
              resetSessionFlow()
              setCurrentStage(3)
            }}
            onFeedbackNo={() => setCurrentStage(99)}
            onSaveOffer={() => setCurrentStage(6)}
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
        return (
          <ShareScreen
            onDone={() => {
              resetSessionFlow()
              setCurrentStage(0)
            }}
          />
        )
      case 99:
        return (
          <RecoveryScreen
            onBackToIdle={() => {
              resetSessionFlow()
              setCurrentStage(0)
            }}
          />
        )
      default:
        return null
    }
  }

  const demoToolbar = demoMode ? (
    <DemoToolbar
      visible={demoToolbarVisible}
      activePersonaIndex={activePersonaIndex}
      onToggleVisible={() => setDemoToolbarVisible((prev) => !prev)}
      onSelectPersona={loadDemoPersona}
      onJumpToResult={jumpToResult}
      onJumpToShare={jumpToShare}
      onOpenAdmin={() => window.open('/admin.html', '_blank')}
      onReset={resetDemo}
    />
  ) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0fe] via-[#f7f9fc] to-[#e8f0fe] flex items-center justify-center p-4">
      <TabletFrame>
        <StageBar currentStage={stageBarCurrentStage} />
        {renderStageContent()}
      </TabletFrame>
      {demoToolbar}
    </div>
  )
}

export default App
