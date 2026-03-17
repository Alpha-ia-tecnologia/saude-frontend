import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Gauge, FileText, RefreshCw, Coins, Smile, Syringe, Clock,
    TrendingUp, PieChart, Hospital, Bell, AlertTriangle, AlertCircle, Info
} from 'lucide-react';

// Executive KPIs
const kpisExecutivos = {
    orcamentoExecutado: { valor: 73.9, meta: 75, unidade: '%' },
    satisfacaoUsuario: { valor: 4.7, meta: 4.5, unidade: '/5.0' },
    coberturaVacinal: { valor: 92, meta: 95, unidade: '%' },
    tempoMedioEspera: { valor: 18, meta: 15, unidade: 'min' }
};

// Units performance
const desempenhoUnidades = [
    { nome: 'UBS Centro', atendimentos: 1234, meta: 1200, satisfacao: 4.8, cobertura: 94 },
    { nome: 'UBS Norte', atendimentos: 987, meta: 1000, satisfacao: 4.5, cobertura: 91 },
    { nome: 'UBS Sul', atendimentos: 856, meta: 900, satisfacao: 4.6, cobertura: 89 },
    { nome: 'UBS Leste', atendimentos: 1102, meta: 1100, satisfacao: 4.4, cobertura: 93 },
    { nome: 'UBS Oeste', atendimentos: 745, meta: 800, satisfacao: 4.7, cobertura: 88 }
];

// Priority alerts
const alertasPrioritarios = [
    { tipo: 'critico', titulo: 'Estoque Critico', descricao: '3 medicamentos essenciais abaixo do nivel minimo', acao: 'Ver Estoque' },
    { tipo: 'atencao', titulo: 'Metas de Cobertura', descricao: 'UBS Oeste abaixo da meta de cobertura vacinal', acao: 'Ver Relatorio' },
    { tipo: 'info', titulo: 'Orcamento', descricao: 'R$ 400.000 disponiveis para investimento', acao: 'Ver Detalhes' }
];

// Monthly trend data
const tendenciaMensal = [
    { mes: 'Jul', atendimentos: 4500, custos: 380000 },
    { mes: 'Ago', atendimentos: 4750, custos: 395000 },
    { mes: 'Set', atendimentos: 4900, custos: 410000 },
    { mes: 'Out', atendimentos: 5100, custos: 425000 },
    { mes: 'Nov', atendimentos: 5250, custos: 440000 },
    { mes: 'Dez', atendimentos: 5400, custos: 455000 }
];

// Resource allocation
const alocacaoRecursos = [
    { categoria: 'Pessoal', percentual: 55, valor: 1375000 },
    { categoria: 'Insumos', percentual: 20, valor: 500000 },
    { categoria: 'Infraestrutura', percentual: 10, valor: 250000 },
    { categoria: 'Equipamentos', percentual: 8, valor: 200000 },
    { categoria: 'Outros', percentual: 7, valor: 175000 }
];

const barColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-cyan-500', 'bg-gray-500'];

export default function Dashboard() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const exportarDashboard = () => {
        const linhas = [
            ['=== KPIs Executivos ==='],
            ['Indicador', 'Valor', 'Meta', 'Unidade'],
            ['Execucao Orcamentaria', kpisExecutivos.orcamentoExecutado.valor, kpisExecutivos.orcamentoExecutado.meta, kpisExecutivos.orcamentoExecutado.unidade],
            ['Satisfacao do Usuario', kpisExecutivos.satisfacaoUsuario.valor, kpisExecutivos.satisfacaoUsuario.meta, kpisExecutivos.satisfacaoUsuario.unidade],
            ['Cobertura Vacinal', kpisExecutivos.coberturaVacinal.valor, kpisExecutivos.coberturaVacinal.meta, kpisExecutivos.coberturaVacinal.unidade],
            ['Tempo Medio de Espera', kpisExecutivos.tempoMedioEspera.valor, kpisExecutivos.tempoMedioEspera.meta, kpisExecutivos.tempoMedioEspera.unidade],
            [],
            ['=== Desempenho por Unidade ==='],
            ['Unidade', 'Atendimentos', 'Meta', 'Satisfacao', 'Cobertura'],
            ...desempenhoUnidades.map(u => [u.nome, u.atendimentos, u.meta, u.satisfacao, u.cobertura])
        ];
        const csv = linhas.map(l => l.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'dashboard_gerencial.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0
        }).format(value);
    };

    const getKpiStatus = (valor, meta, invertido = false) => {
        const percentual = (valor / meta) * 100;
        if (invertido) {
            return percentual <= 100 ? 'success' : 'danger';
        }
        return percentual >= 100 ? 'success' : percentual >= 90 ? 'warning' : 'danger';
    };

    const maxAtendimentos = Math.max(...tendenciaMensal.map(t => t.atendimentos));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        <Gauge className="mr-2 inline-block h-6 w-6 text-primary" />
                        Dashboard Gerencial
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Visao executiva de todas as unidades</p>
                </div>
                <div className="flex gap-2">
                    <select
                        className="h-10 w-auto rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={periodoSelecionado}
                        onChange={(e) => setPeriodoSelecionado(e.target.value)}
                    >
                        <option value="semana">Esta Semana</option>
                        <option value="mes">Este Mes</option>
                        <option value="trimestre">Trimestre</option>
                        <option value="ano">Este Ano</option>
                    </select>
                    <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                        onClick={exportarDashboard}
                    >
                        <FileText className="h-4 w-4" /> Exportar
                    </button>
                    <button
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} /> Atualizar
                    </button>
                </div>
            </div>

            {/* Executive KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
                {/* Execucao Orcamentaria */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Execucao Orcamentaria</p>
                            <h2 className="my-2 text-2xl font-bold text-primary">
                                {kpisExecutivos.orcamentoExecutado.valor}{kpisExecutivos.orcamentoExecutado.unidade}
                            </h2>
                            <small className="text-muted-foreground">Meta: {kpisExecutivos.orcamentoExecutado.meta}%</small>
                        </div>
                        <div
                            className="flex h-[60px] w-[60px] items-center justify-center rounded-full"
                            style={{ background: `conic-gradient(var(--color-primary) ${kpisExecutivos.orcamentoExecutado.valor * 3.6}deg, #e5e7eb 0deg)` }}
                        >
                            <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white">
                                <Coins className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Satisfacao do Usuario */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Satisfacao do Usuario</p>
                            <h2 className="my-2 text-2xl font-bold text-secondary">
                                {kpisExecutivos.satisfacaoUsuario.valor}{kpisExecutivos.satisfacaoUsuario.unidade}
                            </h2>
                            <small className="text-muted-foreground">Meta: {kpisExecutivos.satisfacaoUsuario.meta}/5.0</small>
                        </div>
                        <div
                            className="flex h-[60px] w-[60px] items-center justify-center rounded-full"
                            style={{ background: `conic-gradient(var(--color-secondary) ${(kpisExecutivos.satisfacaoUsuario.valor / 5) * 360}deg, #e5e7eb 0deg)` }}
                        >
                            <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white">
                                <Smile className="h-4 w-4 text-secondary" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cobertura Vacinal */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Cobertura Vacinal</p>
                            <h2 className="my-2 text-2xl font-bold text-accent">
                                {kpisExecutivos.coberturaVacinal.valor}{kpisExecutivos.coberturaVacinal.unidade}
                            </h2>
                            <small className="text-muted-foreground">Meta: {kpisExecutivos.coberturaVacinal.meta}%</small>
                        </div>
                        <div
                            className="flex h-[60px] w-[60px] items-center justify-center rounded-full"
                            style={{ background: `conic-gradient(var(--color-accent) ${kpisExecutivos.coberturaVacinal.valor * 3.6}deg, #e5e7eb 0deg)` }}
                        >
                            <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white">
                                <Syringe className="h-4 w-4 text-accent" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tempo Medio de Espera */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Tempo Medio de Espera</p>
                            <h2 className="my-2 text-2xl font-bold text-destructive">
                                {kpisExecutivos.tempoMedioEspera.valor}{kpisExecutivos.tempoMedioEspera.unidade}
                            </h2>
                            <small className="text-muted-foreground">Meta: {kpisExecutivos.tempoMedioEspera.meta} min</small>
                        </div>
                        <div
                            className="flex h-[60px] w-[60px] items-center justify-center rounded-full"
                            style={{ background: `conic-gradient(var(--color-destructive) ${Math.min(100, (kpisExecutivos.tempoMedioEspera.valor / 30) * 100) * 3.6}deg, #e5e7eb 0deg)` }}
                        >
                            <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white">
                                <Clock className="h-4 w-4 text-destructive" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-3 gap-6">
                {/* Trend Chart */}
                <div className="col-span-2 rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <TrendingUp className="mr-1.5 inline-block h-4 w-4" /> Tendencia de Atendimentos
                    </div>
                    <div className="p-5">
                        <div className="flex h-[200px] items-end justify-around gap-4">
                            {tendenciaMensal.map((mes, i) => (
                                <div key={i} className="flex flex-1 flex-col items-center">
                                    <div
                                        className="relative w-full max-w-[60px] rounded-t bg-gradient-to-b from-primary to-primary-light"
                                        style={{ height: `${(mes.atendimentos / maxAtendimentos) * 160}px` }}
                                    >
                                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold">
                                            {(mes.atendimentos / 1000).toFixed(1)}k
                                        </span>
                                    </div>
                                    <span className="mt-2 font-medium text-muted-foreground">{mes.mes}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resource Allocation */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <PieChart className="mr-1.5 inline-block h-4 w-4" /> Alocacao de Recursos
                    </div>
                    <div className="p-5">
                        {alocacaoRecursos.map((item, i) => (
                            <div key={i} className="mb-3">
                                <div className="mb-1 flex justify-between">
                                    <span className="text-sm">{item.categoria}</span>
                                    <strong className="text-sm">{item.percentual}%</strong>
                                </div>
                                <div className="h-2 rounded-full bg-gray-200">
                                    <div
                                        className={cn('h-full rounded-full', barColors[i] || 'bg-gray-500')}
                                        style={{ width: `${item.percentual}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-6">
                {/* Units Performance */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <Hospital className="mr-1.5 inline-block h-4 w-4" /> Desempenho por Unidade
                    </div>
                    <div>
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Unidade</th>
                                    <th className="px-4 py-3 text-left font-medium">Atend.</th>
                                    <th className="px-4 py-3 text-left font-medium">Meta</th>
                                    <th className="px-4 py-3 text-left font-medium">Satisf.</th>
                                    <th className="px-4 py-3 text-left font-medium">Cob.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {desempenhoUnidades.map((unidade, i) => (
                                    <tr key={i} className="hover:bg-muted/30">
                                        <td className="px-4 py-3"><strong>{unidade.nome}</strong></td>
                                        <td className="px-4 py-3">{unidade.atendimentos}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'rounded-md px-2 py-0.5 text-xs font-medium',
                                                unidade.atendimentos >= unidade.meta
                                                    ? 'bg-secondary/10 text-secondary'
                                                    : 'bg-amber-50 text-amber-700'
                                            )}>
                                                {unidade.atendimentos >= unidade.meta ? '✓' : `${Math.round((unidade.atendimentos / unidade.meta) * 100)}%`}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(unidade.satisfacao >= 4.5 ? 'text-secondary' : 'text-accent')}>
                                                ★ {unidade.satisfacao}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(unidade.cobertura >= 90 ? 'text-secondary' : 'text-destructive')}>
                                                {unidade.cobertura}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Priority Alerts */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <Bell className="mr-1.5 inline-block h-4 w-4" /> Alertas Prioritarios
                    </div>
                    <div>
                        {alertasPrioritarios.map((alerta, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'flex items-center gap-4 p-4',
                                    i < alertasPrioritarios.length - 1 && 'border-b border-border'
                                )}
                            >
                                <div className={cn(
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white',
                                    alerta.tipo === 'critico' ? 'bg-destructive' :
                                        alerta.tipo === 'atencao' ? 'bg-accent' : 'bg-primary'
                                )}>
                                    {alerta.tipo === 'critico' ? <AlertTriangle className="h-4 w-4" /> :
                                        alerta.tipo === 'atencao' ? <AlertCircle className="h-4 w-4" /> :
                                            <Info className="h-4 w-4" />}
                                </div>
                                <div className="flex-1">
                                    <strong>{alerta.titulo}</strong>
                                    <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
                                </div>
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted">
                                    {alerta.acao}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
