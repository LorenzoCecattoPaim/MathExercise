import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, Timer as TimerIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimedSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (duration: number) => void;
}

const sessionOptions = [
  { duration: 5 * 60, label: "5 min", description: "Aquecimento rápido", icon: Zap },
  { duration: 10 * 60, label: "10 min", description: "Sessão curta", icon: Clock },
  { duration: 15 * 60, label: "15 min", description: "Prática focada", icon: TimerIcon },
  { duration: 30 * 60, label: "30 min", description: "Sessão completa", icon: TimerIcon },
];

export function TimedSessionModal({ isOpen, onClose, onStart }: TimedSessionModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const handleStart = () => {
    if (selectedDuration) {
      onStart(selectedDuration);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Sessão Cronometrada</h2>
                <p className="text-muted-foreground text-sm">
                  Simule condições de prova
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {sessionOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedDuration === option.duration;
                
                return (
                  <motion.button
                    key={option.duration}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDuration(option.duration)}
                    className={`
                      p-4 rounded-2xl border-2 text-left transition-all
                      ${isSelected 
                        ? "bg-primary/10 border-primary" 
                        : "bg-muted/50 border-transparent hover:border-border"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-bold text-lg">{option.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button 
                variant="hero" 
                onClick={handleStart}
                disabled={!selectedDuration}
                className="flex-1"
              >
                <Zap className="w-4 h-4 mr-2" />
                Iniciar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
