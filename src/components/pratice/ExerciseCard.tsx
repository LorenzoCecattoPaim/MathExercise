import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface Exercise {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  selectedAnswer: string | null;
  isSubmitted: boolean;
  onSelectAnswer: (answer: string) => void;
}

export function ExerciseCard({
  exercise,
  selectedAnswer,
  isSubmitted,
  onSelectAnswer,
}: ExerciseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border shadow-lg"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold">?</span>
          </div>
          <h2 className="text-lg font-medium leading-relaxed">{exercise.question}</h2>
        </div>
      </motion.div>

      {/* Options */}
      <div className="grid gap-3">
        {exercise.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === exercise.correctAnswer;
          const letters = ["A", "B", "C", "D"];

          let optionClass = "group relative p-4 rounded-xl border-2 text-left transition-all duration-300 ";

          if (isSubmitted) {
            if (isCorrect) {
              optionClass += "bg-success/10 border-success";
            } else if (isSelected && !isCorrect) {
              optionClass += "bg-destructive/10 border-destructive";
            } else {
              optionClass += "bg-muted/30 border-border/50 opacity-50";
            }
          } else {
            optionClass += isSelected
              ? "bg-primary/10 border-primary shadow-md shadow-primary/10"
              : "bg-card border-border hover:border-primary/50 hover:shadow-md";
          }

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={!isSubmitted ? { scale: 1.01, x: 4 } : {}}
              whileTap={!isSubmitted ? { scale: 0.99 } : {}}
              onClick={() => !isSubmitted && onSelectAnswer(option)}
              disabled={isSubmitted}
              className={optionClass}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className={`
                    w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                    transition-colors duration-300
                    ${isSubmitted && isCorrect ? "bg-success text-success-foreground" : ""}
                    ${isSubmitted && isSelected && !isCorrect ? "bg-destructive text-destructive-foreground" : ""}
                    ${!isSubmitted && isSelected ? "bg-primary text-primary-foreground" : ""}
                    ${!isSubmitted && !isSelected ? "bg-muted group-hover:bg-primary/20" : ""}
                    ${isSubmitted && !isCorrect && !isSelected ? "bg-muted/50" : ""}
                  `}
                  animate={isSubmitted && isCorrect ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {letters[index]}
                </motion.div>
                <span className="font-medium flex-1">{option}</span>
                {isSubmitted && isCorrect && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <CheckCircle className="w-6 h-6 text-success" />
                  </motion.div>
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <XCircle className="w-6 h-6 text-destructive" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.4 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-secondary text-sm">💡</span>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-secondary">Explicação</h3>
              <p className="text-muted-foreground leading-relaxed">{exercise.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
