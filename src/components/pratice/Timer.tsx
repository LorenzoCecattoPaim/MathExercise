import { motion } from "framer-motion";
import { Clock, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  time: string;
  isRunning: boolean;
  isCountDown?: boolean;
  totalTime?: number;
  currentTime?: number;
  onToggle?: () => void;
  showControls?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "warning" | "danger";
}

export function Timer({
  time,
  isRunning,
  isCountDown = false,
  totalTime,
  currentTime,
  onToggle,
  showControls = false,
  size = "md",
  variant = "default",
}: TimerProps) {
  const progress = isCountDown && totalTime ? ((currentTime ?? 0) / totalTime) * 100 : 0;
  
  const sizeClasses = {
    sm: "text-lg px-3 py-1.5",
    md: "text-xl px-4 py-2",
    lg: "text-3xl px-6 py-3",
  };

  const variantClasses = {
    default: "bg-card border-border text-foreground",
    warning: "bg-accent/10 border-accent text-accent-foreground",
    danger: "bg-destructive/10 border-destructive text-destructive animate-pulse",
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "relative flex items-center gap-3 rounded-2xl border-2 font-mono font-bold overflow-hidden",
        sizeClasses[size],
        variantClasses[variant]
      )}
    >
      {/* Progress bar for countdown */}
      {isCountDown && totalTime && (
        <motion.div
          className="absolute inset-0 bg-primary/10 origin-left"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.5 }}
        />
      )}

      <div className="relative flex items-center gap-2">
        <motion.div
          animate={isRunning ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Clock className={cn(
            "w-5 h-5",
            size === "lg" && "w-7 h-7",
            size === "sm" && "w-4 h-4"
          )} />
        </motion.div>
        <span>{time}</span>
      </div>

      {showControls && onToggle && (
        <button
          onClick={onToggle}
          className="relative p-1.5 rounded-lg hover:bg-foreground/10 transition-colors"
        >
          {isRunning ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
      )}
    </motion.div>
  );
}
