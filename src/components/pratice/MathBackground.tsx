import { motion } from "framer-motion";

const mathSymbols = [
  "∫", "∑", "π", "√", "∞", "±", "÷", "×", "=", "≠", 
  "≤", "≥", "α", "β", "γ", "θ", "Δ", "∂", "∇", "∈",
  "x²", "y³", "∮", "∏", "⊂", "∪", "∩", "⊥", "∠", "λ"
];

const formulas = [
  "E=mc²",
  "a²+b²=c²",
  "∫f(x)dx",
  "Σn²",
  "√x",
  "sinθ",
  "cosπ",
  "lim→∞",
  "dy/dx",
  "∂f/∂x"
];

export function MathBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating symbols */}
      {mathSymbols.map((symbol, i) => (
        <motion.div
          key={`symbol-${i}`}
          className="absolute text-primary/5 font-mono select-none"
          style={{
            left: `${(i * 3.3) % 100}%`,
            top: `${(i * 7.7) % 100}%`,
            fontSize: `${20 + (i % 4) * 10}px`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 5 + (i % 3),
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        >
          {symbol}
        </motion.div>
      ))}

      {/* Floating formulas */}
      {formulas.map((formula, i) => (
        <motion.div
          key={`formula-${i}`}
          className="absolute text-secondary/5 font-mono select-none"
          style={{
            right: `${(i * 9.1) % 100}%`,
            bottom: `${(i * 8.3) % 100}%`,
            fontSize: `${14 + (i % 3) * 6}px`,
          }}
          animate={{
            x: [0, 15, 0],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: 7 + (i % 4),
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        >
          {formula}
        </motion.div>
      ))}

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tl from-secondary/10 to-transparent blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
