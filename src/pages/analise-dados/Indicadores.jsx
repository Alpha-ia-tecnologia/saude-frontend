import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    TrendingUp,
    Bot,
    PlusCircle,
    RefreshCw,
    Lightbulb,
    AlertTriangle,
    PieChart,
    Download,
    Search,
    RotateCcw,
    Filter,
    FileSpreadsheet,
    Eye,
    Pencil,
    History,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// SUS Colors
const susColors = {
    blue: '#0054A6',
    green: '#00A651',
    yellow: '#FFF200',
    red: '#ED1C24',
    lightBlue: '#3D7CC9',
    lightGreen: '#4DC47D',
};

// Sample data for indicators
const indicatorsData = [
    { id: 1, name: 'Cobertura Vacinal', category: 'Assistencial', value: 85, goal: 80, unit: '%', trend: '+5%', trendUp: true, status: 'Acima da Meta' },
    { id: 2, name: 'Consultas Pré-natal', category: 'Assistencial', value: 92, goal: 80, unit: '%', trend: '+12%', trendUp: true, status: 'Acima da Meta' },
    { id: 3, name: 'Controle de Hipertensão', category: 'Assistencial', value: 68, goal: 70, unit: '%', trend: '-2%', trendUp: false, status: 'Abaixo da Meta' },
    { id: 4, name: 'Rastreamento de Câncer', category: 'Assistencial', value: 45, goal: 60, unit: '%', trend: '-15%', trendUp: false, status: 'Crítico' },
    { id: 5, name: 'Taxa de Internação por Condições Sensíveis', category: 'Epidemiológico', value: 12, goal: 15, unit: '%', trend: '-3%', trendUp: true, status: 'Acima da Meta' },
    { id: 6, name: 'Tempo Médio de Espera', category: 'Operacional', value: 35, goal: 30, unit: ' min', trend: '+5 min', trendUp: false, status: 'Abaixo da Meta' },
    { id: 7, name: 'Satisfação do Usuário', category: 'Qualidade', value: 88, goal: 85, unit: '%', trend: '+3%', trendUp: true, status: 'Acima da Meta' },
];

const statusConfig = {
    'Acima da Meta': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    'Abaixo da Meta': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    'Crítico': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
};

const categoryConfig = {
    'Assistencial': 'bg-blue-50 text-blue-700',
    'Epidemiológico': 'bg-purple-50 text-purple-700',
    'Operacional': 'bg-orange-50 text-orange-700',
    'Qualidade': 'bg-teal-50 text-teal-700',
};

function getProgressColor(value, goal, unit) {
    const ratio = unit === ' min' ? goal / value : value / goal;
    if (ratio >= 1) return 'bg-emerald-500';
    if (ratio >= 0.85) return 'bg-amber-500';
    return 'bg-red-500';
}

// Chart data for evolution
const evolutionChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
        {
            label: 'Cobertura Vacinal',
            data: [75, 76, 78, 79, 80, 81, 82, 83, 84, 85, 85, 85],
            borderColor: susColors.blue,
            backgroundColor: 'rgba(0, 84, 166, 0.1)',
            tension: 0.3,
            fill: true,
        },
        {
            label: 'Consultas Pré-natal',
            data: [80, 82, 84, 85, 86, 88, 89, 90, 91, 92, 92, 92],
            borderColor: susColors.green,
            backgroundColor: 'rgba(0, 166, 81, 0.1)',
            tension: 0.3,
            fill: true,
        },
    ],
};

// Chart data for goals comparison
const goalsChartData = {
    labels: ['Cobertura Vacinal', 'Pré-natal', 'Hipertensão', 'Câncer', 'Satisfação'],
    datasets: [
        {
            label: 'Atual',
            data: [85, 92, 68, 45, 88],
            backgroundColor: susColors.blue,
        },
        {
            label: 'Meta',
            data: [80, 80, 70, 60, 85],
            backgroundColor: susColors.lightBlue,
        },
    ],
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};

export default function Indicadores() {
    const [filters, setFilters] = useState({
        categoria: '',
        periodo: 'ano',
        status: '',
        search: '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        // Filter logic would go here
    };

    const handleFilterReset = () => {
        setFilters({ categoria: '', periodo: 'ano', status: '', search: '' });
    };

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="mb-6">
                <nav className="text-sm mb-2">
                    <span className="text-muted-foreground">Início / Análise de Dados / </span>
                    <span className="text-primary">Indicadores</span>
                </nav>
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-[1.75rem] font-semibold flex items-center gap-2">
                        <TrendingUp className="size-7 text-primary" />
                        Indicadores
                    </h1>
                    <div className="flex gap-2">
                        <button className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5">
                            <Bot className="size-4" />
                            Análise IA
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
                            <PlusCircle className="size-4" />
                            Novo Indicador
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <Card className="mb-6">
                <div className="flex justify-between items-center border-b border-border px-5 py-3">
                    <h4 className="m-0 flex items-center gap-2 font-semibold">
                        <Bot className="size-5 text-primary" />
                        Insights de IA - Indicadores
                    </h4>
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-input px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <RefreshCw className="size-3.5" />
                        Atualizar
                    </button>
                </div>
                <div className="p-5">
                    <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <h5 className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary">
                            <Lightbulb className="size-4" />
                            Análise de Tendências
                        </h5>
                        <p className="m-0 text-sm text-foreground/80">A IA detectou uma tendência de melhoria nos indicadores de cobertura vacinal e consultas pré-natal nos últimos 3 meses. Recomenda-se compartilhar as estratégias bem-sucedidas com outras unidades de saúde.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <h5 className="mb-1 flex items-center gap-2 text-sm font-semibold text-amber-800">
                                <AlertTriangle className="size-4" />
                                Indicadores Críticos
                            </h5>
                            <p className="m-0 text-sm text-amber-700">A IA identificou 3 indicadores abaixo da meta por mais de 6 meses consecutivos.</p>
                        </div>
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                            <h5 className="mb-1 flex items-center gap-2 text-sm font-semibold text-emerald-800">
                                <PieChart className="size-4" />
                                Novos Indicadores Sugeridos
                            </h5>
                            <p className="m-0 text-sm text-emerald-700">A IA sugere 4 novos indicadores para insights valiosos sobre qualidade.</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="border-l-4 border-l-primary">
                    <div className="text-center">
                        <div className="text-[2.5rem] font-bold text-primary">85%</div>
                        <h5 className="my-2">Cobertura Vacinal</h5>
                        <span className="text-secondary">
                            <ArrowUp className="size-4 inline" /> 5% acima da meta
                        </span>
                    </div>
                </Card>
                <Card className="border-l-4 border-l-secondary">
                    <div className="text-center">
                        <div className="text-[2.5rem] font-bold text-secondary">92%</div>
                        <h5 className="my-2">Consultas Pré-natal</h5>
                        <span className="text-secondary">
                            <ArrowUp className="size-4 inline" /> 12% acima da meta
                        </span>
                    </div>
                </Card>
                <Card className="border-l-4 border-l-accent">
                    <div className="text-center">
                        <div className="text-[2.5rem] font-bold text-amber-600">68%</div>
                        <h5 className="my-2">Controle Hipertensão</h5>
                        <span className="text-destructive">
                            <ArrowDown className="size-4 inline" /> 2% abaixo da meta
                        </span>
                    </div>
                </Card>
                <Card className="border-l-4 border-l-destructive">
                    <div className="text-center">
                        <div className="text-[2.5rem] font-bold text-destructive">45%</div>
                        <h5 className="my-2">Rastreamento Câncer</h5>
                        <span className="text-destructive">
                            <ArrowDown className="size-4 inline" /> 15% abaixo da meta
                        </span>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <div className="flex justify-between items-center border-b border-border px-5 py-3">
                        <h5 className="m-0 font-semibold">Evolução dos Indicadores</h5>
                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-input px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <Download className="size-3.5" />
                            Exportar
                        </button>
                    </div>
                    <div className="h-[300px]">
                        <Line data={evolutionChartData} options={chartOptions} />
                    </div>
                </Card>
                <Card>
                    <div className="flex justify-between items-center border-b border-border px-5 py-3">
                        <h5 className="m-0 font-semibold">Comparativo com Metas</h5>
                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-input px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <Download className="size-3.5" />
                            Exportar
                        </button>
                    </div>
                    <div className="h-[300px]">
                        <Bar data={goalsChartData} options={chartOptions} />
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <div>
                    <h5 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                        <Filter className="size-4 text-primary" />
                        Filtros
                    </h5>
                    <form onSubmit={handleFilterSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Categoria</label>
                                <select
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    name="categoria" value={filters.categoria} onChange={handleFilterChange}
                                >
                                    <option value="">Todas</option>
                                    <option value="assistenciais">Assistenciais</option>
                                    <option value="epidemiologicos">Epidemiológicos</option>
                                    <option value="operacionais">Operacionais</option>
                                    <option value="financeiros">Financeiros</option>
                                    <option value="qualidade">Qualidade</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Período</label>
                                <select
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    name="periodo" value={filters.periodo} onChange={handleFilterChange}
                                >
                                    <option value="mes_atual">Mês Atual</option>
                                    <option value="trimestre">Último Trimestre</option>
                                    <option value="semestre">Último Semestre</option>
                                    <option value="ano">Último Ano</option>
                                    <option value="personalizado">Personalizado</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Status</label>
                                <select
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    name="status" value={filters.status} onChange={handleFilterChange}
                                >
                                    <option value="">Todos</option>
                                    <option value="acima_meta">Acima da Meta</option>
                                    <option value="na_meta">Na Meta</option>
                                    <option value="abaixo_meta">Abaixo da Meta</option>
                                    <option value="critico">Crítico</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Buscar</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        className="h-10 w-full rounded-lg border border-input bg-white pl-10 pr-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        name="search"
                                        placeholder="Nome do indicador..."
                                        value={filters.search}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-input px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                onClick={handleFilterReset}
                            >
                                <RotateCcw className="size-3.5" />
                                Limpar
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                            >
                                <Filter className="size-3.5" />
                                Aplicar Filtros
                            </button>
                        </div>
                    </form>
                </div>
            </Card>

            {/* Indicators Table */}
            <Card className="overflow-hidden p-0">
                <div className="flex justify-between items-center border-b border-border px-5 py-4">
                    <div>
                        <h5 className="m-0 font-semibold text-foreground">Painel de Indicadores</h5>
                        <p className="mt-0.5 text-xs text-muted-foreground">{indicatorsData.length} indicadores monitorados</p>
                    </div>
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-input px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <FileSpreadsheet className="size-4" />
                        Exportar
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40">
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Indicador</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoria</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progresso</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tendência</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {indicatorsData.map(indicator => {
                                const sc = statusConfig[indicator.status] || statusConfig['Abaixo da Meta'];
                                const cc = categoryConfig[indicator.category] || 'bg-gray-50 text-gray-700';
                                const progressPercent = indicator.unit === ' min'
                                    ? Math.min(100, Math.round((indicator.goal / indicator.value) * 100))
                                    : Math.min(100, Math.round((indicator.value / indicator.goal) * 100));

                                return (
                                    <tr key={indicator.id} className="transition-colors hover:bg-muted/30">
                                        {/* Indicador */}
                                        <td className="px-5 py-4">
                                            <span className="font-medium text-foreground">{indicator.name}</span>
                                        </td>

                                        {/* Categoria */}
                                        <td className="px-4 py-4">
                                            <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', cc)}>
                                                {indicator.category}
                                            </span>
                                        </td>

                                        {/* Progresso: valor, barra, meta */}
                                        <td className="px-4 py-4">
                                            <div className="mx-auto w-36">
                                                <div className="flex items-baseline justify-between mb-1">
                                                    <span className="text-sm font-bold text-foreground">
                                                        {indicator.value}{indicator.unit}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Meta: {indicator.goal}{indicator.unit}
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className={cn('h-full rounded-full transition-all', getProgressColor(indicator.value, indicator.goal, indicator.unit))}
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        {/* Tendência */}
                                        <td className="px-4 py-4 text-center">
                                            <span className={cn(
                                                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                                                indicator.trendUp
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-red-50 text-red-700'
                                            )}>
                                                {indicator.trendUp
                                                    ? <ArrowUp className="size-3" />
                                                    : <ArrowDown className="size-3" />
                                                }
                                                {indicator.trend}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4 text-center">
                                            <span className={cn(
                                                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
                                                sc.bg, sc.text, sc.border
                                            )}>
                                                <span className={cn('size-1.5 rounded-full', sc.dot)} />
                                                {indicator.status}
                                            </span>
                                        </td>

                                        {/* Ações */}
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                                    title="Visualizar"
                                                >
                                                    <Eye className="size-4" />
                                                </button>
                                                <button
                                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                                    title="Editar"
                                                >
                                                    <Pencil className="size-4" />
                                                </button>
                                                <button
                                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                                    title="Histórico"
                                                >
                                                    <History className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-border px-5 py-3">
                    <p className="text-sm text-muted-foreground">Mostrando 1-7 de 7 indicadores</p>
                    <nav className="flex items-center gap-1">
                        <button className="rounded-lg border border-input px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40" disabled>
                            Anterior
                        </button>
                        <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white">1</button>
                        <button className="rounded-lg border border-input px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted">2</button>
                        <button className="rounded-lg border border-input px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted">3</button>
                        <button className="rounded-lg border border-input px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted">
                            Próximo
                        </button>
                    </nav>
                </div>
            </Card>
        </div>
    );
}
