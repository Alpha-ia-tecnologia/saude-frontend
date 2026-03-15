import { useState } from 'react';
import {
    TrendingUp,
    RefreshCw,
    FileDown,
    Stethoscope,
    ArrowUp,
    ArrowDown,
    Users,
    CalendarCheck,
    Smile,
    BarChart3,
    PieChart,
    Bell,
    AlertTriangle,
    CalendarX,
    Pill,
    Bug,
    Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

// Sample data for dashboard
const kpisData = {
    atendimentos: { valor: 1247, variacao: 12, periodo: 'este mês' },
    pacientes: { valor: 3456, variacao: 5, periodo: 'cadastrados' },
    consultas: { valor: 89, variacao: -3, periodo: 'hoje' },
    satisfacao: { valor: 4.7, variacao: 0.2, periodo: 'média 5.0' }
};

const atendimentosDiarios = [
    { dia: 'Seg', consultas: 145, procedimentos: 45, urgencias: 12 },
    { dia: 'Ter', consultas: 132, procedimentos: 38, urgencias: 15 },
    { dia: 'Qua', consultas: 156, procedimentos: 52, urgencias: 8 },
    { dia: 'Qui', consultas: 128, procedimentos: 41, urgencias: 18 },
    { dia: 'Sex', consultas: 167, procedimentos: 55, urgencias: 11 },
    { dia: 'Sáb', consultas: 78, procedimentos: 22, urgencias: 6 }
];

const distribuicaoAtendimentos = [
    { tipo: 'Consultas Médicas', valor: 45, corClass: 'bg-primary' },
    { tipo: 'Enfermagem', valor: 25, corClass: 'bg-secondary' },
    { tipo: 'Odontologia', valor: 15, corClass: 'bg-accent' },
    { tipo: 'Procedimentos', valor: 10, corClass: 'bg-sky-500' },
    { tipo: 'Outros', valor: 5, corClass: 'bg-muted-foreground' }
];

const doencasMaisFrequentes = [
    { cid: 'I10', nome: 'Hipertensão Essencial', casos: 234, percentual: 18.7 },
    { cid: 'E11', nome: 'Diabetes Mellitus Tipo 2', casos: 189, percentual: 15.2 },
    { cid: 'J06', nome: 'IVAS', casos: 156, percentual: 12.5 },
    { cid: 'M54', nome: 'Dorsalgia', casos: 98, percentual: 7.9 },
    { cid: 'F32', nome: 'Episódio Depressivo', casos: 87, percentual: 7.0 },
    { cid: 'J45', nome: 'Asma', casos: 76, percentual: 6.1 }
];

const alertaIconMap = {
    urgente: AlertTriangle,
    atencao: CalendarX,
    info: Pill,
};

const alertasAtivos = [
    { tipo: 'urgente', mensagem: '23 pacientes diabéticos sem HbA1c há mais de 6 meses' },
    { tipo: 'atencao', mensagem: '45 gestantes com consulta de pré-natal em atraso' },
    { tipo: 'info', mensagem: '12 medicamentos com estoque abaixo do mínimo' }
];

const metasUnidade = [
    { indicador: 'Cobertura Pré-Natal', meta: 85, atual: 78, unidade: '%' },
    { indicador: 'Hipertensos Controlados', meta: 70, atual: 65, unidade: '%' },
    { indicador: 'Diabéticos Controlados', meta: 65, atual: 58, unidade: '%' },
    { indicador: 'Vacinas em Dia (<1 ano)', meta: 95, atual: 92, unidade: '%' },
    { indicador: 'Consultas Realizadas', meta: 3000, atual: 2847, unidade: '' }
];

function KpiCard({ title, value, period, variation, variationLabel, icon: Icon, gradientClass }) {
    const isPositive = variation >= 0;

    return (
        <div className={cn('rounded-xl text-white shadow-sm', gradientClass)}>
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="m-0 opacity-90">{title}</p>
                        <h2 className="my-2">{typeof value === 'number' ? value.toLocaleString() : value}</h2>
                        <small className="opacity-80">{period}</small>
                    </div>
                    <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-white/20">
                        <Icon className="size-6" />
                    </div>
                </div>
                <div className="mt-2">
                    <span className={cn(
                        'inline-flex items-center gap-1 rounded px-2 py-1 text-sm',
                        isPositive ? 'bg-white/30' : 'bg-destructive/50'
                    )}>
                        {isPositive ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
                        {variationLabel ?? `${Math.abs(variation)}%`}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');
    const [unidadeSelecionada, setUnidadeSelecionada] = useState('todas');

    const maxBarValue = Math.max(...atendimentosDiarios.map(d => d.consultas + d.procedimentos + d.urgencias));

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="m-0 flex items-center gap-2">
                    <TrendingUp className="size-7 text-primary" />
                    Dashboard de Análise
                </h1>
                <div className="flex gap-2">
                    <select
                        className="rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground"
                        value={unidadeSelecionada}
                        onChange={(e) => setUnidadeSelecionada(e.target.value)}
                    >
                        <option value="todas">Todas as Unidades</option>
                        <option value="centro">UBS Centro</option>
                        <option value="norte">UBS Norte</option>
                        <option value="sul">UBS Sul</option>
                    </select>
                    <select
                        className="rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground"
                        value={periodoSelecionado}
                        onChange={(e) => setPeriodoSelecionado(e.target.value)}
                    >
                        <option value="semana">Esta Semana</option>
                        <option value="mes">Este Mês</option>
                        <option value="trimestre">Trimestre</option>
                        <option value="ano">Este Ano</option>
                    </select>
                    <button className="inline-flex items-center gap-1.5 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5">
                        <RefreshCw className="size-4" /> Atualizar
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark">
                        <FileDown className="size-4" /> Exportar
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    title="Atendimentos"
                    value={kpisData.atendimentos.valor}
                    period={kpisData.atendimentos.periodo}
                    variation={kpisData.atendimentos.variacao}
                    icon={Stethoscope}
                    gradientClass="bg-gradient-to-br from-primary to-primary-light"
                />
                <KpiCard
                    title="Pacientes"
                    value={kpisData.pacientes.valor}
                    period={kpisData.pacientes.periodo}
                    variation={kpisData.pacientes.variacao}
                    icon={Users}
                    gradientClass="bg-gradient-to-br from-secondary to-emerald-400"
                />
                <KpiCard
                    title="Consultas Hoje"
                    value={kpisData.consultas.valor}
                    period={kpisData.consultas.periodo}
                    variation={kpisData.consultas.variacao}
                    icon={CalendarCheck}
                    gradientClass="bg-gradient-to-br from-sky-500 to-violet-600"
                />
                <KpiCard
                    title="Satisfação"
                    value={kpisData.satisfacao.valor}
                    period={kpisData.satisfacao.periodo}
                    variation={kpisData.satisfacao.variacao}
                    variationLabel={`+${kpisData.satisfacao.variacao}`}
                    icon={Smile}
                    gradientClass="bg-gradient-to-br from-accent to-orange-500"
                />
            </div>

            {/* Charts Row */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
                {/* Bar Chart */}
                <Card
                    header={
                        <span className="flex items-center gap-2">
                            <BarChart3 className="size-4" />
                            Atendimentos por Dia da Semana
                        </span>
                    }
                    headerClassName="bg-muted"
                >
                    <div className="mb-4 flex justify-end gap-4 text-sm">
                        <span className="flex items-center gap-1">
                            <span className="inline-block size-3 bg-primary" /> Consultas
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="inline-block size-3 bg-secondary" /> Procedimentos
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="inline-block size-3 bg-destructive" /> Urgências
                        </span>
                    </div>
                    <div className="flex h-[200px] items-end justify-around gap-2">
                        {atendimentosDiarios.map((dia, i) => {
                            const total = dia.consultas + dia.procedimentos + dia.urgencias;
                            const altura = (total / maxBarValue) * 180;
                            return (
                                <div key={i} className="flex flex-1 flex-col items-center">
                                    <div
                                        className="flex w-full max-w-[50px] flex-col"
                                        style={{ height: `${altura}px` }}
                                    >
                                        <div
                                            className="rounded-t bg-destructive"
                                            style={{ flex: dia.urgencias }}
                                        />
                                        <div
                                            className="bg-secondary"
                                            style={{ flex: dia.procedimentos }}
                                        />
                                        <div
                                            className="rounded-b bg-primary"
                                            style={{ flex: dia.consultas }}
                                        />
                                    </div>
                                    <span className="mt-2 font-medium text-muted-foreground">{dia.dia}</span>
                                    <small className="text-muted-foreground">{total}</small>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Pie Chart */}
                <Card
                    header={
                        <span className="flex items-center gap-2">
                            <PieChart className="size-4" />
                            Distribuição por Tipo
                        </span>
                    }
                    headerClassName="bg-muted"
                >
                    <div className="mb-4 flex justify-center">
                        <div
                            className="flex size-[150px] items-center justify-center rounded-full"
                            style={{
                                background: `conic-gradient(
                                    var(--color-primary) 0deg ${45 * 3.6}deg,
                                    var(--color-secondary) ${45 * 3.6}deg ${(45 + 25) * 3.6}deg,
                                    var(--color-accent) ${70 * 3.6}deg ${85 * 3.6}deg,
                                    #0ea5e9 ${85 * 3.6}deg ${95 * 3.6}deg,
                                    #64748b ${95 * 3.6}deg 360deg
                                )`,
                            }}
                        >
                            <div className="flex size-20 flex-col items-center justify-center rounded-full bg-card">
                                <strong className="text-xl">1.2K</strong>
                                <small className="text-muted-foreground">Total</small>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {distribuicaoAtendimentos.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn('size-3 rounded-sm', item.corClass)} />
                                    <span className="text-sm">{item.tipo}</span>
                                </div>
                                <strong>{item.valor}%</strong>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Alerts */}
                <Card
                    header={
                        <span className="flex items-center gap-2">
                            <Bell className="size-4" />
                            Alertas Ativos
                        </span>
                    }
                    headerClassName="bg-muted"
                    className="overflow-hidden"
                >
                    <div className="-m-5">
                        {alertasAtivos.map((alerta, i) => {
                            const IconComponent = alertaIconMap[alerta.tipo];
                            return (
                                <div
                                    key={i}
                                    className={cn(
                                        'flex items-start gap-3 p-4',
                                        i < alertasAtivos.length - 1 && 'border-b border-border'
                                    )}
                                >
                                    <div className={cn(
                                        'flex size-9 shrink-0 items-center justify-center rounded-full text-white',
                                        alerta.tipo === 'urgente' && 'bg-destructive',
                                        alerta.tipo === 'atencao' && 'bg-accent',
                                        alerta.tipo === 'info' && 'bg-primary'
                                    )}>
                                        <IconComponent className="size-4" />
                                    </div>
                                    <p className="m-0 text-sm">{alerta.mensagem}</p>
                                </div>
                            );
                        })}
                        <div className="p-3 text-center">
                            <a href="#" className="text-sm text-primary hover:underline">Ver todos os alertas</a>
                        </div>
                    </div>
                </Card>

                {/* Top Diseases */}
                <Card
                    header={
                        <span className="flex items-center gap-2">
                            <Bug className="size-4" />
                            Doenças Mais Frequentes
                        </span>
                    }
                    headerClassName="bg-muted"
                >
                    <div className="-m-5">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="px-4 py-2 text-left font-semibold">CID</th>
                                    <th className="px-4 py-2 text-left font-semibold">Doença</th>
                                    <th className="px-4 py-2 text-left font-semibold">Casos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doencasMaisFrequentes.slice(0, 5).map((doenca, i) => (
                                    <tr key={i} className="border-b border-border last:border-b-0">
                                        <td className="px-4 py-2">
                                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{doenca.cid}</code>
                                        </td>
                                        <td className="px-4 py-2 text-sm">{doenca.nome}</td>
                                        <td className="px-4 py-2">
                                            <strong>{doenca.casos}</strong>
                                            <br />
                                            <small className="text-muted-foreground">{doenca.percentual}%</small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Goals */}
                <Card
                    header={
                        <span className="flex items-center gap-2">
                            <Target className="size-4" />
                            Metas da Unidade
                        </span>
                    }
                    headerClassName="bg-muted"
                >
                    {metasUnidade.map((meta, i) => {
                        const percentual = (meta.atual / meta.meta) * 100;
                        const barColorClass = percentual >= 90
                            ? 'bg-secondary'
                            : percentual >= 70
                                ? 'bg-accent'
                                : 'bg-destructive';
                        const textColorClass = percentual >= 90
                            ? 'text-secondary'
                            : percentual >= 70
                                ? 'text-accent'
                                : 'text-destructive';
                        return (
                            <div key={i} className={cn(i < metasUnidade.length - 1 && 'mb-4')}>
                                <div className="mb-1 flex justify-between">
                                    <span className="text-sm">{meta.indicador}</span>
                                    <span className="text-sm">
                                        <strong className={textColorClass}>{meta.atual}{meta.unidade}</strong>
                                        <span className="text-muted-foreground"> / {meta.meta}{meta.unidade}</span>
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded bg-muted">
                                    <div
                                        className={cn('h-full rounded transition-all duration-500', barColorClass)}
                                        style={{ width: `${Math.min(100, percentual)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </Card>
            </div>
        </div>
    );
}
