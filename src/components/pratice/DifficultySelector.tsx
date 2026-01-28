import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Zap, Target, Trophy, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

type Difficulty = "easy" | "medium" | "hard";

interface DifficultySelectorProps {
  subjectName: string;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onOpenTimedSession: () => void;
}

const difficultyConfig = {
  easy: {
    label: "Fácil",
    description: "Ideal para começar e revisar conceitos básicos",
    icon: Zap,
    gradient: "from-success/20 to-success/5",
    border: "border-success/30",
    iconBg: "bg-success/20",
    iconColor: "text-success",
  },
  medium: {
    label: "Médio",
    description: "Desafie-se com questões intermediárias",
    icon: Target,
    gradient: "from-accent/20 to-accent/5",
    border: "border-accent/30",
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
  },
  hard: {
    label: "Difícil",
    description: "Para quem busca desafios avançados",
    icon: Trophy,
    gradient: "from-destructive/20 to-destructive/5",
    border: "border-destructive/30",
    iconBg: "bg-destructive/20",
    iconColor: "text-destructive",
  },
};

export function DifficultySelector({
  subjectName,
  onSelectDifficulty,
  onOpenTimedSession,
}: DifficultySelectorProps) {
  return (
    <main className="container px-4 py-8 relative z-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao painel
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <span className="text-4xl">📐</span>
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">{subjectName}</h1>
          <p className="text-muted-foreground">
            Escolha o nível de dificuldade para começar.
          </p>
        </div>

        <div className="grid gap-4 mb-6">
          {(Object.keys(difficultyConfig) as Difficulty[]).map((diff, index) => {
            const config = difficultyConfig[diff];
            const Icon = config.icon;

            return (
              <motion.button
                key={diff}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectDifficulty(diff)}
                className={`
                  p-6 rounded-2xl border-2 ${config.border} 
                  bg-gradient-to-r ${config.gradient}
                  text-left transition-all hover:shadow-lg
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{config.label}</h3>
                      <p className="text-sm text-muted-foreground">{config.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Timed Session Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent blur-xl opacity-30 rounded-2xl" />
            <Button
              variant="outline"
              size="lg"
              onClick={onOpenTimedSession}
              className="relative border-2 border-dashed hover:border-solid"
            >
              <Timer className="w-5 h-5 mr-2" />
              Sessão Cronometrada
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Simule condições de prova com tempo limitado
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
