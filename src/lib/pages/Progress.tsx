import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  GraduationCap, 
  ArrowLeft,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Loader2
} from "lucide-react";
import { format, subDays, eachDayOfInterval, isSameDay, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";

const subjectConfig = {
  algebra: { name: "Álgebra", color: "hsl(var(--primary))" },
  geometry: { name: "Geometria", color: "hsl(var(--secondary))" },
  calculus: { name: "Cálculo", color: "hsl(var(--accent))" },
  statistics: { name: "Estatística", color: "hsl(var(--success))" },
  trigonometry: { name: "Trigonometria", color: "hsl(217, 91%, 60%)" },
  arithmetic: { name: "Aritmética", color: "hsl(280, 80%, 60%)" },
};

export default function ProgressPage() {
  const { user } = useAuth();

  const { data: attempts, isLoading } = useQuery({
    queryKey: ['progress-data', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('exercise_attempts')
        .select(`
          *,
          exercises (
            subject,
            difficulty
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Calculate streak
  const calculateStreak = () => {
    if (!attempts || attempts.length === 0) return 0;
    
    const today = startOfDay(new Date());
    const uniqueDays = [...new Set(
      attempts.map(a => startOfDay(new Date(a.created_at)).getTime())
    )].sort((a, b) => b - a);

    let streak = 0;
    let checkDate = today;

    for (const dayTime of uniqueDays) {
      if (isSameDay(new Date(dayTime), checkDate) || 
          isSameDay(new Date(dayTime), subDays(checkDate, 1))) {
        streak++;
        checkDate = new Date(dayTime);
      } else {
        break;
      }
    }

    return streak;
  };

  // Performance over time (last 14 days)
  const getPerformanceData = () => {
    if (!attempts) return [];

    const last14Days = eachDayOfInterval({
      start: subDays(new Date(), 13),
      end: new Date(),
    });

    return last14Days.map(day => {
      const dayAttempts = attempts.filter(a => 
        isSameDay(new Date(a.created_at), day)
      );
      const correct = dayAttempts.filter(a => a.is_correct).length;
      const total = dayAttempts.length;
      
      return {
        date: format(day, "dd/MM"),
        fullDate: format(day, "d 'de' MMM", { locale: ptBR }),
        exercicios: total,
        acertos: correct,
        taxa: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    });
  };

  // Subject breakdown
  const getSubjectData = () => {
    if (!attempts) return [];

    const subjectCounts: Record<string, { total: number; correct: number }> = {};

    attempts.forEach((attempt: any) => {
      const subject = attempt.exercises?.subject || 'algebra';
      if (!subjectCounts[subject]) {
        subjectCounts[subject] = { total: 0, correct: 0 };
      }
      subjectCounts[subject].total++;
      if (attempt.is_correct) {
        subjectCounts[subject].correct++;
      }
    });

    return Object.entries(subjectCounts).map(([subject, data]) => ({
      name: subjectConfig[subject as keyof typeof subjectConfig]?.name || subject,
      value: data.total,
      correct: data.correct,
      color: subjectConfig[subject as keyof typeof subjectConfig]?.color || "hsl(var(--muted))",
      percentage: Math.round((data.correct / data.total) * 100),
    }));
  };

  const streak = calculateStreak();
  const performanceData = getPerformanceData();
  const subjectData = getSubjectData();
  
  const totalExercises = attempts?.length || 0;
  const correctAnswers = attempts?.filter((a: any) => a.is_correct).length || 0;
  const overallRate = totalExercises > 0 ? Math.round((correctAnswers / totalExercises) * 100) : 0;

  const chartConfig = {
    exercicios: { label: "Exercícios", color: "hsl(var(--primary))" },
    acertos: { label: "Acertos", color: "hsl(var(--success))" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ProvaLab</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao painel
        </Link>

        <h1 className="text-3xl font-bold mb-2">Seu Progresso</h1>
        <p className="text-muted-foreground mb-8">
          Acompanhe seu desempenho e evolução nos estudos.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{streak}</p>
                    <p className="text-sm text-muted-foreground">Dias de sequência</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalExercises}</p>
                    <p className="text-sm text-muted-foreground">Total de exercícios</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{overallRate}%</p>
                    <p className="text-sm text-muted-foreground">Taxa de acerto</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{correctAnswers}</p>
                    <p className="text-sm text-muted-foreground">Respostas corretas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Over Time Chart */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-xl font-bold mb-6">Desempenho nos Últimos 14 Dias</h2>
              
              {performanceData.some(d => d.exercicios > 0) ? (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorExercicios" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAcertos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="exercicios" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorExercicios)" 
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="acertos" 
                      stroke="hsl(var(--success))" 
                      fillOpacity={1} 
                      fill="url(#colorAcertos)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <p>Pratique exercícios para ver seu progresso aqui!</p>
                </div>
              )}
            </div>

            {/* Subject Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-xl font-bold mb-6">Exercícios por Área</h2>
                
                {subjectData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subjectData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {subjectData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                                  <p className="font-medium">{data.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {data.value} exercícios ({data.percentage}% acerto)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <p>Nenhum exercício realizado ainda.</p>
                  </div>
                )}
              </div>

              {/* Subject Performance List */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-xl font-bold mb-6">Desempenho por Área</h2>
                
                {subjectData.length > 0 ? (
                  <div className="space-y-4">
                    {subjectData.map((subject, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: subject.color }}
                            />
                            <span className="font-medium">{subject.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {subject.correct}/{subject.value} ({subject.percentage}%)
                          </span>
                        </div>
                        <Progress value={subject.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <p>Pratique para ver seu desempenho!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Study Streak Calendar */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-xl font-bold mb-6">Calendário de Estudos</h2>
              
              <div className="grid grid-cols-7 gap-2">
                {eachDayOfInterval({
                  start: subDays(new Date(), 27),
                  end: new Date(),
                }).map((day, index) => {
                  const hasActivity = attempts?.some((a: any) => 
                    isSameDay(new Date(a.created_at), day)
                  );
                  const dayAttempts = attempts?.filter((a: any) => 
                    isSameDay(new Date(a.created_at), day)
                  ) || [];
                  const intensity = Math.min(dayAttempts.length / 5, 1);
                  
                  return (
                    <div 
                      key={index}
                      className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                        hasActivity 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-muted/50 text-muted-foreground'
                      }`}
                      style={hasActivity ? { opacity: 0.4 + intensity * 0.6 } : {}}
                      title={`${format(day, "d 'de' MMMM", { locale: ptBR })}: ${dayAttempts.length} exercícios`}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-end gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted/50" />
                  <span>Sem atividade</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-success" />
                  <span>Com atividade</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
