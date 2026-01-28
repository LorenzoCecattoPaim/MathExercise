import { motion } from "framer-motion";
import { Trophy, Target, Clock, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionSummaryProps {
  totalExercises: number;
  correctAnswers: number;
  totalTime: number;
  onContinue: () => void;
  onNewSession: () => void;
}

export function SessionSummary({
  totalExercises,
  correctAnswers,
  totalTime,
  onContinue,
  onNewSession,
}: SessionSummaryProps) {
  const accuracy = totalExercises > 0 ? Math.round((correctAnswers / totalExercises) * 100) : 0;
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  const getGrade = () => {
    if (accuracy >= 90) return { emoji: "🏆", label: "Excelente!", color: "text-success" };
    if (accuracy >= 70) return { emoji: "🎯", label: "Muito bom!", color: "text-secondary" };
    if (accuracy >= 50) return { emoji: "📈", label: "Bom progresso!", color: "text-accent" };
    return { emoji: "💪", label: "Continue praticando!", color: "text-muted-foreground" };
  };

  const grade = getGrade();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 10, delay: 0.2 }}
        className="text-7xl mb-4"
      >
        {grade.emoji}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-3xl font-bold mb-2 ${grade.color}`}
      >
        {grade.label}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground mb-8"
      >
        Sessão cronometrada concluída
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <div className="p-4 rounded-2xl bg-card border border-border">
          <Target className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{accuracy}%</div>
          <div className="text-xs text-muted-foreground">Precisão</div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border">
          <Trophy className="w-6 h-6 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-bold">{correctAnswers}/{totalExercises}</div>
          <div className="text-xs text-muted-foreground">Acertos</div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border">
          <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold">{minutes}:{seconds.toString().padStart(2, "0")}</div>
          <div className="text-xs text-muted-foreground">Tempo</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3"
      >
        <Button variant="outline" onClick={onNewSession} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          Nova Sessão
        </Button>
        <Button variant="hero" onClick={onContinue} className="flex-1">
          Continuar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
