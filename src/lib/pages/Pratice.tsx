import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, ArrowLeft, Loader2, RefreshCw, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTimer } from "@/hooks/useTimer";
import { MathBackground } from "@/components/practice/MathBackground";
import { Timer } from "@/components/practice/Timer";
import { TimedSessionModal } from "@/components/practice/TimedSessionModal";
import { DifficultySelector } from "@/components/practice/DifficultySelector";
import { ExerciseCard } from "@/components/practice/ExerciseCard";
import { SessionSummary } from "@/components/practice/SessionSummary";

type Difficulty = "easy" | "medium" | "hard";

const difficultyLabels = {
  easy: { label: "Fácil", color: "bg-success/10 text-success border-success/30" },
  medium: { label: "Médio", color: "bg-accent/10 text-accent border-accent/30" },
  hard: { label: "Difícil", color: "bg-destructive/10 text-destructive border-destructive/30" },
};

const subjectNames: Record<string, string> = {
  algebra: "Álgebra",
  geometry: "Geometria",
  calculus: "Cálculo",
  statistics: "Estatística",
  trigonometry: "Trigonometria",
  arithmetic: "Aritmética",
};

const subjectEmojis: Record<string, string> = {
  algebra: "📐",
  geometry: "📏",
  calculus: "∫",
  statistics: "📊",
  trigonometry: "📈",
  arithmetic: "🔢",
};

// Sample exercises
const sampleExercises: Record<string, Record<Difficulty, Array<{
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}>>> = {
  algebra: {
    easy: [
      {
        question: "Quanto é 15 + 27?",
        options: ["40", "42", "44", "38"],
        correctAnswer: "42",
        explanation: "15 + 27 = 42. Somamos as unidades (5+7=12) e depois as dezenas (1+2+1=4).",
      },
      {
        question: "Resolva: x + 5 = 12. Qual o valor de x?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7",
        explanation: "x + 5 = 12 → x = 12 - 5 → x = 7",
      },
    ],
    medium: [
      {
        question: "Resolva: 3x + 5 = 20. Qual o valor de x?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "5",
        explanation: "3x + 5 = 20 → 3x = 15 → x = 5",
      },
    ],
    hard: [
      {
        question: "Resolva o sistema: 2x + y = 10 e x - y = 2. Qual é o valor de x?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        explanation: "Somando as equações: 3x = 12 → x = 4",
      },
    ],
  },
  geometry: {
    easy: [
      {
        question: "Quantos lados tem um hexágono?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "Um hexágono tem 6 lados. O prefixo 'hexa' significa seis.",
      },
    ],
    medium: [
      {
        question: "Qual é a área de um retângulo com base 8 cm e altura 5 cm?",
        options: ["35 cm²", "40 cm²", "45 cm²", "50 cm²"],
        correctAnswer: "40 cm²",
        explanation: "Área = base × altura = 8 × 5 = 40 cm²",
      },
    ],
    hard: [
      {
        question: "Qual é o volume de uma esfera com raio 3 cm? (Use π ≈ 3.14)",
        options: ["113.04 cm³", "84.78 cm³", "56.52 cm³", "28.26 cm³"],
        correctAnswer: "113.04 cm³",
        explanation: "Volume = (4/3)πr³ = (4/3) × 3.14 × 27 = 113.04 cm³",
      },
    ],
  },
  calculus: {
    easy: [
      {
        question: "Qual é a derivada de f(x) = x²?",
        options: ["x", "2x", "2", "x²"],
        correctAnswer: "2x",
        explanation: "Usando a regra da potência: d/dx(x²) = 2x",
      },
    ],
    medium: [
      {
        question: "Qual é a integral de f(x) = 2x?",
        options: ["x²", "x² + C", "2x²", "2x² + C"],
        correctAnswer: "x² + C",
        explanation: "∫2x dx = x² + C (não esquecer da constante de integração)",
      },
    ],
    hard: [
      {
        question: "Qual é a derivada de f(x) = x³ + 2x²?",
        options: ["3x² + 4x", "3x² + 2x", "x² + 4x", "3x + 4"],
        correctAnswer: "3x² + 4x",
        explanation: "Usando a regra da potência: d/dx(x³) = 3x² e d/dx(2x²) = 4x",
      },
    ],
  },
  statistics: {
    easy: [
      {
        question: "Qual é a média de 2, 4, 6, 8?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "Média = (2+4+6+8)/4 = 20/4 = 5",
      },
    ],
    medium: [
      {
        question: "Qual é a mediana de 3, 7, 2, 9, 5?",
        options: ["3", "5", "7", "9"],
        correctAnswer: "5",
        explanation: "Ordenando: 2, 3, 5, 7, 9. A mediana é o valor central: 5",
      },
    ],
    hard: [
      {
        question: "Se a variância de um conjunto é 16, qual é o desvio padrão?",
        options: ["2", "4", "8", "16"],
        correctAnswer: "4",
        explanation: "Desvio padrão = √variância = √16 = 4",
      },
    ],
  },
  trigonometry: {
    easy: [
      {
        question: "Qual é o valor de sen(90°)?",
        options: ["0", "0.5", "1", "-1"],
        correctAnswer: "1",
        explanation: "O seno de 90° é igual a 1.",
      },
    ],
    medium: [
      {
        question: "Qual é o valor de cos(60°)?",
        options: ["0", "0.5", "√2/2", "√3/2"],
        correctAnswer: "0.5",
        explanation: "cos(60°) = 1/2 = 0.5",
      },
    ],
    hard: [
      {
        question: "Qual é o valor de tan(45°)?",
        options: ["0", "0.5", "1", "√3"],
        correctAnswer: "1",
        explanation: "tan(45°) = sen(45°)/cos(45°) = 1",
      },
    ],
  },
  arithmetic: {
    easy: [
      {
        question: "Qual é o resultado de 8 × 7?",
        options: ["54", "56", "58", "52"],
        correctAnswer: "56",
        explanation: "8 × 7 = 56.",
      },
    ],
    medium: [
      {
        question: "Qual é o MDC de 12 e 18?",
        options: ["2", "3", "6", "9"],
        correctAnswer: "6",
        explanation: "MDC(12, 18) = 6. Divisores de 12: 1,2,3,4,6,12. Divisores de 18: 1,2,3,6,9,18.",
      },
    ],
    hard: [
      {
        question: "Qual é o MMC de 8 e 12?",
        options: ["24", "48", "96", "4"],
        correctAnswer: "24",
        explanation: "MMC(8, 12) = 24. É o menor número divisível por ambos.",
      },
    ],
  },
};

const defaultExercise = {
  question: "Quanto é 2 + 2?",
  options: ["3", "4", "5", "6"],
  correctAnswer: "4",
  explanation: "2 + 2 = 4. Operação básica de adição.",
};

export default function Practice() {
  const { subject } = useParams<{ subject: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentExercise, setCurrentExercise] = useState<typeof defaultExercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Timer states
  const [showTimedModal, setShowTimedModal] = useState(false);
  const [isTimedSession, setIsTimedSession] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStats, setSessionStats] = useState({ total: 0, correct: 0 });
  const [showSummary, setShowSummary] = useState(false);
  
  // Exercise timer (counts up)
  const exerciseTimer = useTimer({ initialTime: 0 });
  
  // Session timer (counts down)
  const sessionTimer = useTimer({ 
    initialTime: sessionDuration, 
    countDown: true,
    onTimeUp: () => {
      setShowSummary(true);
      exerciseTimer.pause();
    }
  });

  const subjectName = subject ? subjectNames[subject] || subject : "Disciplina";
  const subjectEmoji = subject ? subjectEmojis[subject] || "📚" : "📚";

  const generateExercise = useCallback(() => {
    if (!difficulty || !subject) return;

    setLoading(true);

    setTimeout(() => {
      const subjectExercises = sampleExercises[subject];
      if (subjectExercises && subjectExercises[difficulty]) {
        const exercises = subjectExercises[difficulty];
        const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
        setCurrentExercise(randomExercise);
      } else {
        setCurrentExercise(defaultExercise);
      }
      setSelectedAnswer(null);
      setIsSubmitted(false);
      setLoading(false);
      exerciseTimer.reset(0);
      exerciseTimer.start();
    }, 300);
  }, [difficulty, subject, exerciseTimer]);

  const handleStartTimedSession = (duration: number) => {
    setSessionDuration(duration);
    setIsTimedSession(true);
    setSessionStats({ total: 0, correct: 0 });
    setDifficulty("medium"); // Default to medium for timed sessions
    sessionTimer.reset(duration);
    sessionTimer.start();
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !currentExercise || !user) return;

    setIsSubmitted(true);
    exerciseTimer.pause();
    
    const isCorrect = selectedAnswer === currentExercise.correctAnswer;

    // Update session stats
    if (isTimedSession) {
      setSessionStats(prev => ({
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
      }));
    }

    // Save to database
    try {
      const { data: exerciseData } = await supabase
        .from("exercises")
        .insert({
          subject: subject as any,
          difficulty: difficulty as any,
          question: currentExercise.question,
          options: currentExercise.options,
          correct_answer: currentExercise.correctAnswer,
          explanation: currentExercise.explanation,
        })
        .select()
        .single();

      if (exerciseData) {
        await supabase.from("exercise_attempts").insert({
          user_id: user.id,
          exercise_id: exerciseData.id,
          user_answer: selectedAnswer,
          is_correct: isCorrect,
          time_spent_seconds: exerciseTimer.time,
        });
      }
    } catch (error) {
      console.error("Error saving attempt:", error);
    }

    toast({
      title: isCorrect ? "Resposta correta! 🎉" : "Resposta incorreta",
      description: isCorrect
        ? "Parabéns! Continue praticando!"
        : `A resposta correta era: ${currentExercise.correctAnswer}`,
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const handleContinueFromSummary = () => {
    setShowSummary(false);
    setIsTimedSession(false);
    setDifficulty(null);
    setCurrentExercise(null);
  };

  const handleNewSession = () => {
    setShowSummary(false);
    setIsTimedSession(false);
    setDifficulty(null);
    setCurrentExercise(null);
    setShowTimedModal(true);
  };

  // Get timer variant based on remaining time
  const getTimerVariant = () => {
    if (!isTimedSession) return "default";
    const percentRemaining = (sessionTimer.time / sessionDuration) * 100;
    if (percentRemaining <= 10) return "danger";
    if (percentRemaining <= 25) return "warning";
    return "default";
  };

  // Show summary when session ends
  if (showSummary) {
    return (
      <div className="min-h-screen bg-background relative">
        <MathBackground />
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="container px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/dashboard" className="flex items-center gap-2">
                <motion.div 
                  className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <GraduationCap className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-xl font-bold">ProvaLab</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="container px-4 relative z-10">
          <SessionSummary
            totalExercises={sessionStats.total}
            correctAnswers={sessionStats.correct}
            totalTime={sessionDuration - sessionTimer.time}
            onContinue={handleContinueFromSummary}
            onNewSession={handleNewSession}
          />
        </main>
      </div>
    );
  }

  // Difficulty selection screen
  if (!difficulty) {
    return (
      <div className="min-h-screen bg-background relative">
        <MathBackground />
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="container px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/dashboard" className="flex items-center gap-2">
                <motion.div 
                  className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <GraduationCap className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-xl font-bold">ProvaLab</span>
              </Link>
            </div>
          </div>
        </header>
        <DifficultySelector
          subjectName={subjectName}
          onSelectDifficulty={setDifficulty}
          onOpenTimedSession={() => setShowTimedModal(true)}
        />
        <TimedSessionModal
          isOpen={showTimedModal}
          onClose={() => setShowTimedModal(false)}
          onStart={handleStartTimedSession}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <MathBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2">
              <motion.div 
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold">ProvaLab</span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Session Timer (countdown) */}
              {isTimedSession && (
                <Timer
                  time={sessionTimer.getFormattedTime()}
                  isRunning={sessionTimer.isRunning}
                  isCountDown
                  totalTime={sessionDuration}
                  currentTime={sessionTimer.time}
                  variant={getTimerVariant()}
                  size="md"
                />
              )}
              
              {/* Difficulty Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border ${difficultyLabels[difficulty].color}`}
              >
                {difficultyLabels[difficulty].label}
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 relative z-10">
        <button
          onClick={() => {
            setDifficulty(null);
            setCurrentExercise(null);
            setIsTimedSession(false);
            sessionTimer.pause();
          }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Trocar dificuldade
        </button>

        <div className="max-w-2xl mx-auto">
          {/* Subject Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <motion.span 
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {subjectEmoji}
              </motion.span>
              <h1 className="text-2xl font-bold">{subjectName}</h1>
            </div>
            
            {/* Exercise Timer */}
            {currentExercise && (
              <Timer
                time={exerciseTimer.getFormattedTime()}
                isRunning={exerciseTimer.isRunning}
                showControls={!isTimedSession}
                onToggle={() => exerciseTimer.isRunning ? exerciseTimer.pause() : exerciseTimer.start()}
                size="sm"
              />
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {!currentExercise ? (
              <motion.div
                key="generate"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl mb-6"
                >
                  🧮
                </motion.div>
                <p className="text-muted-foreground mb-8 text-lg">
                  Pronto para praticar? Clique abaixo para começar!
                </p>
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={generateExercise} 
                  disabled={loading}
                  className="shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Gerar Exercício
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="exercise"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ExerciseCard
                  exercise={currentExercise}
                  selectedAnswer={selectedAnswer}
                  isSubmitted={isSubmitted}
                  onSelectAnswer={setSelectedAnswer}
                />

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-4 mt-8"
                >
                  {!isSubmitted ? (
                    <Button
                      variant="hero"
                      size="lg"
                      className="flex-1 shadow-lg shadow-primary/20"
                      onClick={handleSubmit}
                      disabled={!selectedAnswer}
                    >
                      Verificar Resposta
                    </Button>
                  ) : (
                    <Button
                      variant="hero"
                      size="lg"
                      className="flex-1 shadow-lg shadow-primary/20"
                      onClick={generateExercise}
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Próximo Exercício
                    </Button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <TimedSessionModal
        isOpen={showTimedModal}
        onClose={() => setShowTimedModal(false)}
        onStart={handleStartTimedSession}
      />
    </div>
  );
}
