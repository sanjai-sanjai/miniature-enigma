import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  Maximize2,
  Minimize2,
  RotateCw,
  Zap,
  Volume2,
  VolumeX,
} from "lucide-react";

interface Circuit {
  id: number;
  connections: number; // 0-4 connections (top, right, bottom, left)
  rotation: number; // 0, 90, 180, 270
  x: number;
  y: number;
  isConnected: boolean;
}

export default function TechnologyVillageLightUp() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [selectedCircuit, setSelectedCircuit] = useState<number | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [level, setLevel] = useState(1);

  // Initialize circuits
  useEffect(() => {
    if (!showIntro) {
      initializeCircuits();
    }
  }, [showIntro, level]);

  const initializeCircuits = () => {
    const newCircuits: Circuit[] = [];
    const gridSize = level === 1 ? 3 : level === 2 ? 4 : 5;
    const circuitsPerRow = gridSize;
    const circuitsPerCol = gridSize;

    for (let i = 0; i < circuitsPerRow * circuitsPerCol; i++) {
      const randomRotation = Math.random() > 0.5 ? 90 : 0;
      const randomConnections = Math.floor(Math.random() * 4) + 1;

      newCircuits.push({
        id: i,
        connections: randomConnections,
        rotation: randomRotation,
        x: (i % circuitsPerRow) * 80,
        y: Math.floor(i / circuitsPerRow) * 80,
        isConnected: false,
      });
    }

    setCircuits(newCircuits);
    setSelectedCircuit(null);
    setGameWon(false);
  };

  const rotateCircuit = (id: number) => {
    setCircuits((prevCircuits) =>
      prevCircuits.map((circuit) =>
        circuit.id === id
          ? { ...circuit, rotation: (circuit.rotation + 90) % 360 }
          : circuit
      )
    );
    checkWin();
  };

  const checkWin = () => {
    // Simple win condition: all tiles have proper rotation
    const allConnected = circuits.length > 0 && circuits.every((c) => c.rotation === 180);
    if (allConnected && circuits.length > 0) {
      setGameWon(true);
    }
  };

  const handleGameStart = () => {
    setShowIntro(false);
  };

  const handleNextLevel = () => {
    setLevel(level + 1);
    setGameWon(false);
  };

  const handleComplete = () => {
    navigate("/student/technology");
  };

  const renderCircuitTile = (circuit: Circuit, index: number) => {
    const tileSize = 70;
    const connections =
      circuit.connections === 1
        ? "⚡"
        : circuit.connections === 2
          ? "━━"
          : circuit.connections === 3
            ? "┳"
            : "┬";

    return (
      <div
        key={circuit.id}
        onClick={() => rotateCircuit(circuit.id)}
        className="cursor-pointer relative inline-block mx-1 mb-2"
      >
        <div
          className="w-[70px] h-[70px] bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg border-2 border-yellow-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
          style={{
            transform: `rotate(${circuit.rotation}deg)`,
            backgroundColor: circuit.rotation === 180 ? "#10b981" : "#f59e0b",
          }}
        >
          {connections}
        </div>
        <div className="absolute top-1 right-1 text-xs bg-black/50 text-white px-2 py-1 rounded">
          {circuit.rotation}°
        </div>
      </div>
    );
  };

  // Game intro modal
  if (showIntro) {
    return (
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">⚡ Village Light-Up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">📘 What You Will Learn</h3>
              <p className="text-sm text-muted-foreground">
                Understand how electrical circuits work and how electricity flows through
                complete connections. Learn that electricity only flows when the circuit
                is complete!
              </p>
            </div>

            <div className="bg-secondary/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🎮 How to Play</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Tap on wire tiles to rotate them</li>
                <li>• Complete the circuit by connecting all tiles properly</li>
                <li>• Each green tile means a correct connection</li>
                <li>• Light up the entire village to win!</li>
              </ul>
            </div>

            <div className="bg-accent/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🏆 What Success Looks Like</h3>
              <p className="text-sm text-muted-foreground">
                All tiles turn green when properly rotated. The festival lights up, and
                the village celebrates!
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/student/technology")}
                className="flex-1"
              >
                ❌ Go Back
              </Button>
              <Button onClick={handleGameStart} className="flex-1 bg-primary">
                ▶ Start Game
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Game completion modal
  if (gameWon) {
    return (
      <Dialog open={gameWon} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎉 Level Complete!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-6xl mb-4">✨</p>
              <p className="text-lg font-semibold text-primary">Village is lit up!</p>
              <p className="text-sm text-muted-foreground mt-2">
                You successfully completed all circuits. Electricity is flowing perfectly!
              </p>
            </div>

            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">💡 Concept Summary</h3>
              <p className="text-sm text-muted-foreground">
                You learned that circuits need to be complete for electricity to flow.
                Each rotation was crucial to making the connection!
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleComplete} className="flex-1 bg-secondary">
                🏠 Back to Games
              </Button>
              {level < 3 && (
                <Button onClick={handleNextLevel} className="flex-1 bg-primary">
                  ➡️ Next Level
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main game view
  const gameContent = (
    <div className="w-full h-full bg-gradient-to-b from-purple-900 via-blue-900 to-blue-800 flex flex-col items-center justify-center p-4 relative">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">⚡ Village Light-Up</h2>
          <p className="text-sm text-blue-200">Level {level}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition"
          >
            {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          {!isFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition"
            >
              <Maximize2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Game Grid */}
      <div className="mt-20 flex flex-wrap justify-center max-w-2xl gap-2">
        {circuits.map((circuit, index) => renderCircuitTile(circuit, index))}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white rounded-lg p-3 text-sm">
        <p>
          💡 <strong>Tip:</strong> Tap tiles to rotate them. Turn them GREEN to complete
          circuits. All green = WIN!
        </p>
      </div>
    </div>
  );

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-purple-900 via-blue-900 to-blue-800">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-lg text-white"
          >
            {isSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
          <button
            onClick={() => setIsFullscreen(false)}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-lg text-white"
          >
            <Minimize2 size={24} />
          </button>
          <button
            onClick={() => navigate("/student/technology")}
            className="bg-red-500 hover:bg-red-600 p-3 rounded-lg text-white"
          >
            <X size={24} />
          </button>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {gameContent}
        </div>
      </div>
    );
  }

  // Embedded game view
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-b from-purple-900 via-blue-900 to-blue-800 h-96">
          {gameContent}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">About This Game</h3>
            <p className="text-sm text-muted-foreground">
              In this game, you're repairing the village's electrical system. Electricity
              only flows when circuits are complete. Rotate the wire tiles to connect them
              properly and light up the whole village!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">💡 Key Concept</h3>
            <p className="text-xs text-muted-foreground">
              Circuits are loops that electricity travels through. When the loop is
              complete, electricity can flow. When it's broken, no flow = no light!
            </p>
          </div>

          <Button
            onClick={() => setIsFullscreen(true)}
            className="w-full bg-primary"
          >
            ⛶ Full Screen
          </Button>
        </div>
      </div>
    </div>
  );
}
