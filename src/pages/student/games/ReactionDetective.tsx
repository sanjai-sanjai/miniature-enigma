import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ConceptIntroPopup } from "@/components/ui/concept-intro-popup";
import { GameCompletionPopup } from "@/components/ui/game-completion-popup";
import { Maximize2, Minimize2, RotateCcw, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Reaction {
  id: string;
  substance1: string;
  substance2: string;
  result: string;
  emoji1: string;
  emoji2: string;
  effects: string[];
  effectEmojis: string[];
  correctTags: string[];
  reactionColor: string;
  visualEffects: string[];
}

const REACTIONS: Reaction[] = [
  {
    id: "iron-acid",
    substance1: "Iron",
    substance2: "Acid",
    result: "Iron reacts",
    emoji1: "⬛",
    emoji2: "🟡",
    effects: ["Bubbling", "Heat"],
    effectEmojis: ["💨", "🔥"],
    correctTags: ["gas", "heat"],
    reactionColor: "from-gray-400 to-orange-400",
    visualEffects: ["bubbles", "heat"],
  },
  {
    id: "milk-vinegar",
    substance1: "Milk",
    substance2: "Vinegar",
    result: "Milk curdles",
    emoji1: "🥛",
    emoji2: "🍶",
    effects: ["Color change", "Bubbling"],
    effectEmojis: ["🎨", "💨"],
    correctTags: ["color_change", "gas"],
    reactionColor: "from-white to-yellow-100",
    visualEffects: ["color_change", "bubbles"],
  },
  {
    id: "water-copper",
    substance1: "Water",
    substance2: "Copper Salt",
    result: "Blue solution",
    emoji1: "💧",
    emoji2: "🔮",
    effects: ["Color change"],
    effectEmojis: ["🎨"],
    correctTags: ["color_change"],
    reactionColor: "from-blue-200 to-blue-500",
    visualEffects: ["color_change"],
  },
  {
    id: "bread-yeast",
    substance1: "Flour & Yeast",
    substance2: "Water",
    result: "Bread rises",
    emoji1: "🍞",
    emoji2: "💧",
    effects: ["Bubbling", "Growth"],
    effectEmojis: ["💨", "📈"],
    correctTags: ["gas", "physical_change"],
    reactionColor: "from-yellow-100 to-orange-200",
    visualEffects: ["bubbles", "growth"],
  },
  {
    id: "burning-candle",
    substance1: "Candle",
    substance2: "Oxygen",
    result: "Light & Heat",
    emoji1: "🕯️",
    emoji2: "💨",
    effects: ["Heat", "Light"],
    effectEmojis: ["🔥", "💡"],
    correctTags: ["heat", "light"],
    reactionColor: "from-yellow-300 to-red-400",
    visualEffects: ["heat", "light"],
  },
];

const EFFECT_OPTIONS = [
  { id: "color_change", label: "Color Change", emoji: "🎨" },
  { id: "gas", label: "Gas Bubbles", emoji: "💨" },
  { id: "heat", label: "Heat Released", emoji: "🔥" },
  { id: "light", label: "Light Produced", emoji: "💡" },
  { id: "physical_change", label: "Physical Change", emoji: "📈" },
  { id: "temperature", label: "Temperature Drop", emoji: "❄️" },
];

interface GameState {
  currentReactionIndex: number;
  score: number;
  selectedEffects: string[];
  hasReacted: boolean;
  feedback: string;
  isReacting: boolean;
  showObservationPanel: boolean;
}

export default function ReactionDetective() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentReactionIndex: 0,
    score: 0,
    selectedEffects: [],
    hasReacted: false,
    feedback: "",
    isReacting: false,
    showObservationPanel: false,
  });

  const currentReaction = REACTIONS[gameState.currentReactionIndex];

  const handleMix = () => {
    if (gameState.hasReacted) return;

    setGameState((prev) => ({
      ...prev,
      isReacting: true,
    }));

    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        hasReacted: true,
        isReacting: false,
        showObservationPanel: true,
      }));
    }, 2500);
  };

  const handleEffectTag = (effectId: string) => {
    if (!gameState.hasReacted) return;

    const isCorrect = currentReaction.correctTags.includes(effectId);
    const isAlreadySelected = gameState.selectedEffects.includes(effectId);

    if (isAlreadySelected) {
      setGameState((prev) => ({
        ...prev,
        selectedEffects: prev.selectedEffects.filter((e) => e !== effectId),
      }));
    } else {
      if (isCorrect) {
        const newSelected = [...gameState.selectedEffects, effectId];
        setGameState((prev) => ({
          ...prev,
          selectedEffects: newSelected,
        }));

        // Check if all correct effects are selected
        const allCorrectSelected = currentReaction.correctTags.every((tag) =>
          newSelected.includes(tag)
        );

        if (allCorrectSelected) {
          setGameState((prev) => ({
            ...prev,
            score: prev.score + 1,
            feedback: "Perfect observation! ✨",
          }));

          setTimeout(() => {
            if (gameState.currentReactionIndex < REACTIONS.length - 1) {
              setGameState((prev) => ({
                ...prev,
                currentReactionIndex: prev.currentReactionIndex + 1,
                selectedEffects: [],
                hasReacted: false,
                showObservationPanel: false,
                feedback: "",
                isReacting: false,
              }));
            } else {
              setShowCompletion(true);
            }
          }, 1200);
        }
      } else {
        setGameState((prev) => ({
          ...prev,
          feedback: "That doesn't seem right... 🤔",
        }));

        setTimeout(() => {
          setGameState((prev) => ({ ...prev, feedback: "" }));
        }, 1000);
      }
    }
  };

  const handleRetry = () => {
    setGameState({
      currentReactionIndex: 0,
      score: 0,
      selectedEffects: [],
      hasReacted: false,
      feedback: "",
      isReacting: false,
      showObservationPanel: false,
    });
    setShowCompletion(false);
  };

  const gameView = (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""} flex flex-col`}>
      <style>{`
        @keyframes bubble-rise {
          0% { transform: translateY(0) translateX(0); opacity: 1; }
          100% { transform: translateY(-80px) translateX(var(--tx, 0)); opacity: 0; }
        }
        @keyframes heat-pulse {
          0% { transform: scale(1) translateY(0); opacity: 0.7; }
          100% { transform: scale(1.3) translateY(-40px); opacity: 0; }
        }
        @keyframes light-flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes smoke-rise {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          100% { transform: translateY(-100px) scale(1.2); opacity: 0; }
        }
        @keyframes color-shift {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes observation-slide-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .bubble {
          animation: bubble-rise 1.5s ease-out forwards;
        }
        .heat-wave {
          animation: heat-pulse 1.2s ease-out forwards;
        }
        .light-effect {
          animation: light-flash 0.8s ease-in-out;
        }
        .smoke-particle {
          animation: smoke-rise 2s ease-out forwards;
        }
        .observation-panel {
          animation: observation-slide-up 0.5s ease-out forwards;
        }
      `}</style>

      <div className={`${isFullscreen ? "h-screen" : "h-[650px]"} flex flex-col overflow-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔬</span>
            <div>
              <h2 className="font-bold text-lg text-foreground">Reaction Detective</h2>
              <p className="text-sm text-muted-foreground">Reaction {gameState.currentReactionIndex + 1}/{REACTIONS.length}</p>
            </div>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex-1 p-6 overflow-auto flex flex-col">
          {/* Lab Setup */}
          <div className="mb-6 space-y-4">
            <p className="text-sm font-semibold text-muted-foreground text-center">Mix these substances and observe what happens</p>

            {/* Substances */}
            <div className="flex items-center justify-center gap-4">
              {/* Substance 1 */}
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-2">{currentReaction.emoji1}</div>
                <p className="text-sm font-semibold">{currentReaction.substance1}</p>
              </div>

              {/* Plus Sign */}
              <div className="text-3xl text-muted-foreground">+</div>

              {/* Substance 2 */}
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-2">{currentReaction.emoji2}</div>
                <p className="text-sm font-semibold">{currentReaction.substance2}</p>
              </div>
            </div>

            {/* Mix Button */}
            <button
              onClick={handleMix}
              disabled={gameState.hasReacted}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                gameState.hasReacted
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground hover:scale-105 active:scale-95"
              }`}
            >
              🧪 Mix Substances
            </button>
          </div>

          {/* Reaction Effects */}
          {gameState.hasReacted && (
            <div className="mb-6 space-y-4 animate-pulse">
              <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-xl p-6 border-2 border-secondary/40">
                <p className="text-center font-bold text-lg mb-4">Reaction happening! What do you observe? 👀</p>

                <div className="grid grid-cols-2 gap-3">
                  {currentReaction.effectEmojis.map((emoji, index) => (
                    <div key={index} className="text-3xl text-center animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>

              {gameState.feedback && (
                <div className="p-4 text-center rounded-lg bg-muted/50">
                  <p className="font-semibold text-secondary">{gameState.feedback}</p>
                </div>
              )}

              {/* Effect Tags */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Tag the observable changes:</p>
                <div className="grid grid-cols-2 gap-2">
                  {EFFECT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleEffectTag(option.id)}
                      disabled={!gameState.hasReacted}
                      className={`p-3 rounded-lg transition-all flex flex-col items-center gap-2 ${
                        gameState.selectedEffects.includes(option.id)
                          ? "bg-secondary/30 border-2 border-secondary ring-2 ring-secondary/30 scale-105"
                          : currentReaction.correctTags.includes(option.id)
                            ? "bg-muted/50 border-2 border-border hover:border-secondary/50 cursor-pointer"
                            : "bg-muted/30 border-2 border-border/30 cursor-default opacity-60"
                      }`}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-xs font-semibold">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="p-4 border-t border-border/50">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold">Reactions Identified</span>
            <span className="text-sm text-muted-foreground">{gameState.score}/{REACTIONS.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-secondary to-secondary/80 h-full transition-all duration-300"
              style={{ width: `${(gameState.score / REACTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {isFullscreen && (
          <div className="fixed bottom-6 right-6 z-40 flex gap-2">
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="glass-card"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button
              onClick={() => setIsFullscreen(false)}
              size="sm"
              className="bg-secondary hover:bg-secondary/90"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <ConceptIntroPopup
        isOpen={showIntro && !gameStarted}
        onStart={() => {
          setShowIntro(false);
          setGameStarted(true);
        }}
        onGoBack={() => navigate("/student/chemistry")}
        conceptName="Reaction Detective"
        whatYouWillUnderstand="Chemical reactions aren't just about formulas - they're about what you can see! Color changes, bubbles, heat, and light are all signs that a chemical reaction is happening. Scientists identify reactions by observing these changes."
        gameSteps={[
          "Mix two substances together by tapping the Mix button",
          "Observe the reaction happening (you'll see visual effects)",
          "Tag what you see: color changes, bubbles, heat, light, etc.",
        ]}
        successMeaning="You learned to identify chemical reactions by their observable properties!"
        icon="🔬"
      />

      <GameCompletionPopup
        isOpen={showCompletion}
        isFullscreen={isFullscreen}
        onPlayAgain={handleRetry}
        onExitFullscreen={() => setIsFullscreen(false)}
        onBackToGames={() => navigate("/student/chemistry")}
        learningOutcome={`You correctly identified ${gameState.score} chemical reactions! You learned to identify chemical reactions by observable changes!`}
      />

      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4">
        {gameStarted ? (
          <>
            {gameView}
            {!isFullscreen && (
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => navigate("/student/chemistry")}
                  variant="outline"
                  className="flex-1"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
