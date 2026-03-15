import { Link } from 'react-router-dom';
import {
  UserRound, FileHeart, Pill, BarChart3, Bot, RefreshCw,
  Lightbulb, AlertTriangle, TrendingUp, ArrowRight, Clock,
  CalendarCheck, Activity, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Pacientes Ativos', value: '2.847', change: '+12%', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Atendimentos Hoje', value: '156', change: '+8%', icon: Activity, color: 'text-secondary', bg: 'bg-secondary/10' },
  { label: 'Consultas Agendadas', value: '42', change: '+5%', icon: CalendarCheck, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Alertas Pendentes', value: '7', change: '-3%', icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
];

const quickAccessCards = [
  { title: 'Pacientes', icon: UserRound, color: 'bg-primary', link: '/pacientes/cadastro', description: 'Cadastro e gerenciamento' },
  { title: 'Prontuário', icon: FileHeart, color: 'bg-secondary', link: '/pacientes/prontuario', description: 'Prontuário eletrônico' },
  { title: 'Farmácia', icon: Pill, color: 'bg-accent', link: '/farmacia/medicamentos', description: 'Gestão de medicamentos' },
  { title: 'Análise', icon: BarChart3, color: 'bg-destructive', link: '/analise-dados/dashboard', description: 'Relatórios e indicadores' }
];

const aiInsights = [
  { type: 'info', title: 'Tendências de Saúde', icon: Lightbulb, message: 'Aumento de 15% nos casos de hipertensão nos últimos 3 meses.', color: 'border-primary/30 bg-primary/5' },
  { type: 'warning', title: 'Alerta de Estoque', icon: AlertTriangle, message: 'Medicamentos para diabetes abaixo do nível crítico.', color: 'border-amber-300 bg-amber-50' },
  { type: 'success', title: 'Melhoria de Indicadores', icon: TrendingUp, message: 'Cobertura vacinal aumentou 8%, atingindo 92%.', color: 'border-secondary/30 bg-secondary/5' }
];

const recentActivities = [
  { type: 'Cadastro', message: 'Novo paciente: Maria Silva', time: 'Há 10 min', variant: 'primary' },
  { type: 'Atendimento', message: 'Consulta finalizada: João Santos', time: 'Há 25 min', variant: 'success' },
  { type: 'Farmácia', message: 'Medicamento dispensado: Losartana', time: 'Há 45 min', variant: 'warning' },
  { type: 'Exame', message: 'Resultado disponível: Hemograma', time: 'Há 1h', variant: 'info' }
];

const todaySchedule = [
  { time: '08:00', patient: 'Carlos Pereira', type: 'Consulta de rotina', doctor: 'Dr. Roberto Almeida', confirmed: true },
  { time: '09:00', patient: 'Juliana Lima', type: 'Retorno', doctor: 'Dra. Fernanda Costa', confirmed: false },
  { time: '10:00', patient: 'Paulo Souza', type: 'Avaliação cardiológica', doctor: 'Dr. André Martins', confirmed: true },
  { time: '15:00', patient: 'Lucas Oliveira', type: 'Vacinação', doctor: 'Enf. Patrícia Silva', confirmed: true }
];

const badgeColors = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-secondary/10 text-secondary-dark',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={cn('flex size-10 items-center justify-center rounded-lg', stat.bg)}>
                <stat.icon className={cn('size-5', stat.color)} />
              </div>
              <span className={cn(
                'text-xs font-medium',
                stat.change.startsWith('+') ? 'text-secondary' : 'text-destructive'
              )}>
                {stat.change}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Acesso Rápido</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickAccessCards.map(card => (
            <Link
              key={card.title}
              to={card.link}
              className="group rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={cn('flex items-center justify-center rounded-t-xl py-6', card.color)}>
                <card.icon className="size-10 text-white" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{card.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Acessar <ArrowRight className="size-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Bot className="size-5 text-primary" />
            Insights de IA
          </h2>
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors">
            <RefreshCw className="size-3.5" />
            Atualizar
          </button>
        </div>
        <div className="space-y-3">
          {aiInsights.map((insight, index) => (
            <div key={index} className={cn('flex items-start gap-3 rounded-lg border p-4', insight.color)}>
              <insight.icon className="mt-0.5 size-5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold">{insight.title}</h4>
                <p className="mt-0.5 text-sm opacity-80">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activities + Schedule */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent Activities */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-semibold text-foreground">Atividades Recentes</h3>
            <button className="text-sm font-medium text-primary hover:text-primary-dark">Ver todas</button>
          </div>
          <div className="divide-y divide-border">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', badgeColors[activity.variant])}>
                    {activity.type}
                  </span>
                  <span className="text-sm text-foreground">{activity.message}</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                  <Clock className="size-3" />
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today Schedule */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-semibold text-foreground">Agenda do Dia</h3>
            <button className="text-sm font-medium text-primary hover:text-primary-dark">Ver completa</button>
          </div>
          <div className="divide-y divide-border">
            {todaySchedule.map((item, index) => (
              <div key={index} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground">{item.time}</span>
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium',
                    item.confirmed
                      ? 'bg-secondary/10 text-secondary-dark'
                      : 'bg-amber-100 text-amber-700'
                  )}>
                    {item.confirmed ? 'Confirmado' : 'Pendente'}
                  </span>
                </div>
                <p className="text-sm text-foreground">{item.patient} &mdash; {item.type}</p>
                <p className="text-xs text-muted-foreground">{item.doctor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
