import { Brain, Zap, BarChart3, BookMarked, CheckCircle, Clock } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Exercícios Dinâmicos",
    description: "Geração automática de questões adaptadas ao seu nível e área de estudo.",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Correção Instantânea",
    description: "Receba feedback imediato sobre suas respostas com explicações detalhadas.",
    color: "secondary",
  },
  {
    icon: BarChart3,
    title: "Acompanhe seu Progresso",
    description: "Visualize sua evolução com estatísticas e histórico completo de exercícios.",
    color: "accent",
  },
  {
    icon: BookMarked,
    title: "Múltiplas Disciplinas",
    description: "Matemática, Física, Química, Biologia, Português e Inglês em um só lugar.",
    color: "primary",
  },
  {
    icon: CheckCircle,
    title: "Níveis de Dificuldade",
    description: "Escolha entre fácil, médio e difícil para desafiar-se progressivamente.",
    color: "secondary",
  },
  {
    icon: Clock,
    title: "Estude no seu Ritmo",
    description: "Pratique quando e onde quiser, salvando seu progresso automaticamente.",
    color: "accent",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
  },
  secondary: {
    bg: "bg-secondary/10",
    text: "text-secondary",
    border: "border-secondary/20",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/20",
  },
};

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tudo que você precisa para{' '}
            <span className="gradient-text">aprender melhor</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma completa para maximizar seu aprendizado com tecnologia de ponta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-card border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${colors.text}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
