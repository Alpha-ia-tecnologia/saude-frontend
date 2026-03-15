import { useState } from 'react';
import {
  HeartPulse, Baby, Brain, Activity, Users, TrendingUp,
  CheckCircle, AlertTriangle, Eye, Calendar, ClipboardList,
  Shield, Stethoscope, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Care Lines data (MACC) ──────────────────────────────────────────
const careLinesData = [
  {
    id: 'saude_mulher',
    nome: 'Saúde da Mulher',
    icon: Baby,
    iconColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    descricao: 'Acompanhamento gestacional, puerpério e saúde reprodutiva',
    totalPacientes: 5,
    controladoPercent: 40,
    ultimaAtualizacao: '14/03/2026',
    kpis: [
      { label: 'Total pacientes', valor: 5, icon: Users },
      { label: 'Em dia', valor: 2, icon: CheckCircle },
      { label: 'Controlado', valor: '40%', icon: TrendingUp },
      { label: 'Última atualização', valor: '14/03', icon: Calendar },
    ],
    pacientes: [
      { id: 1, nome: 'Maria da Silva', idade: 28, status: 'Atenção', detalhes: 'Gestante alto risco - 7 meses, faltou ao pré-natal', ultimaVisita: '28/02/2026', progresso: 55 },
      { id: 8, nome: 'Fernanda Almeida', idade: 25, status: 'Crítico', detalhes: 'Gestante com TB - alto risco, sem USG 2o trimestre', ultimaVisita: '20/02/2026', progresso: 25 },
      { id: 12, nome: 'Clara Nascimento', idade: 30, status: 'Crítico', detalhes: 'Gestante diabética - faltou ao pré-natal', ultimaVisita: '01/03/2026', progresso: 30 },
      { id: 17, nome: 'Amanda Teixeira', idade: 22, status: 'Atenção', detalhes: 'Puérpera com depressão pós-parto', ultimaVisita: '25/02/2026', progresso: 50 },
      { id: 16, nome: 'Tereza Mendes', idade: 70, status: 'Em dia', detalhes: 'Preventivo em dia, mamografia solicitada', ultimaVisita: '10/03/2026', progresso: 90 },
    ]
  },
  {
    id: 'saude_crianca',
    nome: 'Saúde da Criança',
    icon: Baby,
    iconColor: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    descricao: 'Puericultura, vacinação e desenvolvimento infantil',
    totalPacientes: 4,
    controladoPercent: 25,
    ultimaAtualizacao: '14/03/2026',
    kpis: [
      { label: 'Total pacientes', valor: 4, icon: Users },
      { label: 'Em dia', valor: 1, icon: CheckCircle },
      { label: 'Controlado', valor: '25%', icon: TrendingUp },
      { label: 'Última atualização', valor: '14/03', icon: Calendar },
    ],
    pacientes: [
      { id: 3, nome: 'Pedro da Silva', idade: 1, status: 'Em dia', detalhes: 'Puericultura em dia, vacinação completa', ultimaVisita: '05/03/2026', progresso: 95 },
      { id: 9, nome: 'Lucas Almeida', idade: 1, status: 'Crítico', detalhes: 'Vacina Pentavalente 3a dose atrasada 25 dias', ultimaVisita: '15/02/2026', progresso: 20 },
      { id: 18, nome: 'Bebê Teixeira', idade: 0, status: 'Crítico', detalhes: 'BCG e Hepatite B pendentes - 30 dias', ultimaVisita: '12/02/2026', progresso: 10 },
      { id: 15, nome: 'Sofia Araújo', idade: 3, status: 'Atenção', detalhes: 'Reforço tríplice viral pendente', ultimaVisita: '28/02/2026', progresso: 60 },
    ]
  },
  {
    id: 'hipertensos_diabeticos',
    nome: 'Hipertensos e Diabéticos',
    icon: HeartPulse,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    descricao: 'Monitoramento e controle de HAS e DM conforme MACC',
    totalPacientes: 7,
    controladoPercent: 43,
    ultimaAtualizacao: '14/03/2026',
    kpis: [
      { label: 'Total pacientes', valor: 7, icon: Users },
      { label: 'Em dia', valor: 3, icon: CheckCircle },
      { label: 'Controlado', valor: '43%', icon: TrendingUp },
      { label: 'Última atualização', valor: '14/03', icon: Calendar },
    ],
    pacientes: [
      { id: 4, nome: 'José Santos', idade: 78, status: 'Crítico', detalhes: 'HAS + DM2 descompensados, acamado, sem aferir PA há 3 meses', ultimaVisita: '14/12/2025', progresso: 10 },
      { id: 5, nome: 'Ana Santos', idade: 72, status: 'Atenção', detalhes: 'HAS controlada, DM em ajuste', ultimaVisita: '20/02/2026', progresso: 65 },
      { id: 6, nome: 'Lúcia Pereira', idade: 55, status: 'Em dia', detalhes: 'HAS controlada, medicação em dia', ultimaVisita: '08/03/2026', progresso: 90 },
      { id: 7, nome: 'Roberto Costa', idade: 60, status: 'Crítico', detalhes: 'DM2 descompensado, sem consulta há 6 meses', ultimaVisita: '14/09/2025', progresso: 5 },
      { id: 11, nome: 'Dona Marta Ferreira', idade: 62, status: 'Crítico', detalhes: 'HAS descompensada - PA 190/110 última aferição', ultimaVisita: '28/01/2026', progresso: 15 },
      { id: 16, nome: 'Tereza Mendes', idade: 70, status: 'Em dia', detalhes: 'HAS controlada, acompanhamento regular', ultimaVisita: '10/03/2026', progresso: 85 },
      { id: 25, nome: 'Ricardo Pereira', idade: 58, status: 'Em dia', detalhes: 'HAS + DM controlados, exames em dia', ultimaVisita: '05/03/2026', progresso: 92 },
    ]
  },
  {
    id: 'saude_mental',
    nome: 'Saúde Mental',
    icon: Brain,
    iconColor: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    descricao: 'Acompanhamento de transtornos mentais e dependência',
    totalPacientes: 3,
    controladoPercent: 33,
    ultimaAtualizacao: '14/03/2026',
    kpis: [
      { label: 'Total pacientes', valor: 3, icon: Users },
      { label: 'Em dia', valor: 1, icon: CheckCircle },
      { label: 'Controlado', valor: '33%', icon: TrendingUp },
      { label: 'Última atualização', valor: '14/03', icon: Calendar },
    ],
    pacientes: [
      { id: 11, nome: 'Dona Marta Ferreira', idade: 62, status: 'Atenção', detalhes: 'Tratamento psiquiátrico em curso, medicação ajustada', ultimaVisita: '28/02/2026', progresso: 60 },
      { id: 17, nome: 'Amanda Teixeira', idade: 22, status: 'Crítico', detalhes: 'Depressão pós-parto - sem acompanhamento há 15 dias', ultimaVisita: '25/02/2026', progresso: 20 },
      { id: 4, nome: 'José Santos', idade: 78, status: 'Em dia', detalhes: 'Sintomas leves de ansiedade, acompanhamento com equipe', ultimaVisita: '02/03/2026', progresso: 80 },
    ]
  }
];

const statusConfig = {
  'Em dia': { color: 'bg-emerald-100 text-emerald-700', dotColor: 'bg-emerald-500' },
  'Atenção': { color: 'bg-amber-100 text-amber-700', dotColor: 'bg-amber-500' },
  'Crítico': { color: 'bg-red-100 text-red-700', dotColor: 'bg-red-500' },
};

export default function LinhasCuidado() {
  const [activeCareLine, setActiveCareLine] = useState(careLinesData[0].id);

  const currentLine = careLinesData.find(cl => cl.id === activeCareLine);
  const LineIcon = currentLine.icon;

  const countByStatus = (status) => currentLine.pacientes.filter(p => p.status === status).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <ClipboardList className="size-6 text-primary" />
          Linhas de Cuidado (MACC)
        </h1>
        <p className="text-sm text-muted-foreground">
          Modelo de Atenção às Condições Crônicas - PlanificaSUS
        </p>
      </div>

      {/* Care line overview cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {careLinesData.map(cl => {
          const CLIcon = cl.icon;
          const isActive = activeCareLine === cl.id;
          return (
            <button key={cl.id} onClick={() => setActiveCareLine(cl.id)}
              className={cn(
                'rounded-xl border p-4 text-left shadow-sm transition-all hover:shadow-md',
                isActive ? `${cl.borderColor} ${cl.bgColor} ring-2 ring-offset-1` : 'border-border bg-card hover:border-primary/30',
                isActive && cl.id === 'saude_mulher' && 'ring-rose-300',
                isActive && cl.id === 'saude_crianca' && 'ring-sky-300',
                isActive && cl.id === 'hipertensos_diabeticos' && 'ring-red-300',
                isActive && cl.id === 'saude_mental' && 'ring-violet-300',
              )}>
              <div className="flex items-center gap-3">
                <div className={cn('flex size-10 items-center justify-center rounded-lg', cl.bgColor)}>
                  <CLIcon className={cn('size-5', cl.iconColor)} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{cl.nome}</h3>
                  <p className="text-xs text-muted-foreground">{cl.totalPacientes} pacientes</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Controlado</span>
                  <span className="font-semibold text-foreground">{cl.controladoPercent}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className={cn(
                    'h-full rounded-full transition-all',
                    cl.controladoPercent >= 60 ? 'bg-emerald-500' : cl.controladoPercent >= 40 ? 'bg-amber-400' : 'bg-red-500'
                  )} style={{ width: `${cl.controladoPercent}%` }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active care line detail */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className={cn('flex items-center gap-3 border-b px-5 py-4', currentLine.bgColor, currentLine.borderColor)}>
          <LineIcon className={cn('size-5', currentLine.iconColor)} />
          <div>
            <h2 className="text-lg font-semibold text-foreground">{currentLine.nome}</h2>
            <p className="text-xs text-muted-foreground">{currentLine.descricao}</p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
          {currentLine.kpis.map((kpi, i) => {
            const KIcon = kpi.icon;
            return (
              <div key={i} className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                <KIcon className="mx-auto size-5 text-muted-foreground" />
                <p className="mt-1.5 text-xl font-bold text-foreground">{kpi.valor}</p>
                <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-3 gap-3 px-5 pb-3">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5">
            <div className="size-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-700">Em dia: {countByStatus('Em dia')}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-2.5">
            <div className="size-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-amber-700">Atenção: {countByStatus('Atenção')}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2.5">
            <div className="size-2.5 rounded-full bg-red-500" />
            <span className="text-xs font-medium text-red-700">Crítico: {countByStatus('Crítico')}</span>
          </div>
        </div>

        {/* Patient list */}
        <div className="border-t border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Paciente</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Idade</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Detalhes</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Última Visita</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Progresso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentLine.pacientes
                  .sort((a, b) => {
                    const order = { 'Crítico': 0, 'Atenção': 1, 'Em dia': 2 };
                    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
                  })
                  .map(pac => {
                    const sc = statusConfig[pac.status] || statusConfig['Em dia'];
                    return (
                      <tr key={pac.id} className="hover:bg-muted/30">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className={cn('size-2 rounded-full', sc.dotColor)} />
                            <span className="font-medium text-foreground">{pac.nome}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {pac.idade} {pac.idade <= 1 ? 'ano' : 'anos'}
                        </td>
                        <td className="px-5 py-3">
                          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', sc.color)}>
                            {pac.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 max-w-xs">
                          <p className="truncate text-xs text-muted-foreground" title={pac.detalhes}>
                            {pac.detalhes}
                          </p>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" /> {pac.ultimaVisita}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                              <div className={cn(
                                'h-full rounded-full',
                                pac.progresso >= 70 ? 'bg-emerald-500' : pac.progresso >= 40 ? 'bg-amber-400' : 'bg-red-500'
                              )} style={{ width: `${pac.progresso}%` }} />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">{pac.progresso}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
