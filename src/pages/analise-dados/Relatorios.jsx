import { useState } from 'react';
import {
    FileText,
    Bot,
    PlusCircle,
    RefreshCw,
    Stethoscope,
    HeartPulse,
    Pill,
    DollarSign,
    Search,
    RotateCcw,
    Filter,
    Play,
    Pencil,
    History,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';

// Sample reports data
const reportsData = [
    { id: 1, name: 'Producao Medica por Profissional', category: 'Atendimentos', lastRun: '10/04/2025', formats: ['PDF', 'Excel'], frequency: 'Diario', status: 'Ativo', statusClass: 'bg-secondary/10 text-secondary-dark' },
    { id: 2, name: 'Indicadores de Saude', category: 'Epidemiologicos', lastRun: '09/04/2025', formats: ['PDF', 'Excel', 'CSV'], frequency: 'Mensal', status: 'Ativo', statusClass: 'bg-secondary/10 text-secondary-dark' },
    { id: 3, name: 'Consumo de Medicamentos', category: 'Farmacia', lastRun: '08/04/2025', formats: ['PDF', 'Excel'], frequency: 'Semanal', status: 'Ativo', statusClass: 'bg-secondary/10 text-secondary-dark' },
    { id: 4, name: 'Faturamento SUS', category: 'Financeiros', lastRun: '05/04/2025', formats: ['PDF', 'Excel'], frequency: 'Mensal', status: 'Ativo', statusClass: 'bg-secondary/10 text-secondary-dark' },
    { id: 5, name: 'Atendimentos por Especialidade', category: 'Atendimentos', lastRun: '01/04/2025', formats: ['PDF', 'Excel'], frequency: 'Semanal', status: 'Ativo', statusClass: 'bg-secondary/10 text-secondary-dark' },
    { id: 6, name: 'Absenteismo de Pacientes', category: 'Gestao', lastRun: '31/03/2025', formats: ['PDF', 'Excel'], frequency: 'Mensal', status: 'Em revisao', statusClass: 'bg-amber-50 text-amber-800' },
    { id: 7, name: 'Produtividade por Equipe', category: 'Recursos Humanos', lastRun: '25/03/2025', formats: ['PDF', 'Excel'], frequency: 'Mensal', status: 'Inativo', statusClass: 'bg-muted text-muted-foreground' },
];

// Report categories
const categories = [
    { id: 1, name: 'Atendimentos', icon: Stethoscope, colorClass: 'text-primary', description: 'Relatorios sobre consultas, procedimentos e atendimentos realizados.' },
    { id: 2, name: 'Epidemiologicos', icon: HeartPulse, colorClass: 'text-destructive', description: 'Relatorios sobre doencas, condicoes de saude e vigilancia epidemiologica.' },
    { id: 3, name: 'Farmacia', icon: Pill, colorClass: 'text-secondary', description: 'Relatorios sobre dispensacao, estoque e consumo de medicamentos.' },
    { id: 4, name: 'Financeiros', icon: DollarSign, colorClass: 'text-amber-500', description: 'Relatorios sobre custos, faturamento e producao para o SUS.' },
];

export default function Relatorios() {
    const [filters, setFilters] = useState({
        categoria: '',
        periodo: 'mes',
        formato: '',
        search: '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    };

    const handleFilterReset = () => {
        setFilters({ categoria: '', periodo: 'mes', formato: '', search: '' });
    };

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="mb-6">
                <nav className="mb-2 text-sm">
                    <span className="text-muted-foreground">Inicio / Analise de Dados / </span>
                    <span className="text-primary">Relatorios</span>
                </nav>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="flex items-center gap-2 text-2xl font-semibold">
                        <FileText className="size-7 text-primary" />
                        Relatorios
                    </h1>
                    <div className="flex gap-2">
                        <button className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5">
                            <Bot className="size-4" />
                            Analise IA
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark">
                            <PlusCircle className="size-4" />
                            Novo Relatorio
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <Card className="mb-6">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                    <h4 className="flex items-center gap-2 text-base font-semibold">
                        <Bot className="size-5 text-primary" />
                        Insights de IA - Relatorios
                    </h4>
                    <button className="inline-flex items-center gap-1 rounded-md border border-primary px-3 py-1 text-sm text-primary hover:bg-primary/5">
                        <RefreshCw className="size-3.5" />
                        Atualizar
                    </button>
                </div>
                <div className="p-5">
                    <Alert type="info" title="Analise de Relatorios" className="mb-4">
                        <p>A IA analisou os relatorios mais acessados e identificou que os relatorios de produtividade medica e indicadores de saude sao os mais utilizados pelos gestores. Recomenda-se destacar esses relatorios na interface e otimizar seu tempo de geracao.</p>
                    </Alert>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Alert type="success" title="Sugestao de Novos Relatorios">
                            <p className="text-sm">A IA sugere 3 novos relatorios para insights sobre eficiencia operacional.</p>
                        </Alert>
                        <Alert type="warning" title="Relatorios Subutilizados">
                            <p className="text-sm">5 relatorios foram gerados menos de 3 vezes nos ultimos 6 meses.</p>
                        </Alert>
                    </div>
                </div>
            </Card>

            {/* Report Categories */}
            <Card className="mb-6">
                <div className="border-b border-border px-5 py-3">
                    <h5 className="text-sm font-semibold">Categorias de Relatorios</h5>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <Card key={cat.id} className="cursor-pointer text-center transition-shadow hover:shadow-md">
                                    <div className="mb-4">
                                        <Icon className={cn('mx-auto size-10', cat.colorClass)} />
                                    </div>
                                    <h5 className="mb-2 font-semibold">{cat.name}</h5>
                                    <p className="mb-4 text-sm text-muted-foreground">{cat.description}</p>
                                    <button className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5">
                                        Ver Relatorios
                                    </button>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* Filters */}
            <Card className="mb-6">
                <div className="p-5">
                    <h5 className="mb-4 font-semibold">Filtros</h5>
                    <form onSubmit={handleFilterSubmit}>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Categoria</label>
                                <select
                                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    name="categoria"
                                    value={filters.categoria}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Todas</option>
                                    <option value="atendimentos">Atendimentos</option>
                                    <option value="epidemiologicos">Epidemiologicos</option>
                                    <option value="farmacia">Farmacia</option>
                                    <option value="financeiros">Financeiros</option>
                                    <option value="gestao">Gestao</option>
                                    <option value="rh">Recursos Humanos</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Periodo</label>
                                <select
                                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    name="periodo"
                                    value={filters.periodo}
                                    onChange={handleFilterChange}
                                >
                                    <option value="hoje">Hoje</option>
                                    <option value="ontem">Ontem</option>
                                    <option value="semana">Ultimos 7 dias</option>
                                    <option value="mes">Ultimo mes</option>
                                    <option value="trimestre">Ultimo trimestre</option>
                                    <option value="ano">Ultimo ano</option>
                                    <option value="personalizado">Personalizado</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Formato</label>
                                <select
                                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    name="formato"
                                    value={filters.formato}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Todos</option>
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                    <option value="csv">CSV</option>
                                    <option value="html">HTML</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Buscar</label>
                                <div className="flex gap-1">
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        name="search"
                                        placeholder="Nome do relatorio"
                                        value={filters.search}
                                        onChange={handleFilterChange}
                                    />
                                    <button type="submit" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary-dark">
                                        <Search className="size-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button type="button" className="inline-flex items-center gap-1 rounded-md border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5" onClick={handleFilterReset}>
                                <RotateCcw className="size-3.5" />
                                Limpar
                            </button>
                            <button type="submit" className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark">
                                <Filter className="size-3.5" />
                                Aplicar Filtros
                            </button>
                        </div>
                    </form>
                </div>
            </Card>

            {/* Reports Table */}
            <Card>
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                    <h5 className="text-sm font-semibold">Relatorios Disponiveis</h5>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Nome do Relatorio</th>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Categoria</th>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Ultima Execucao</th>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Formatos</th>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Frequencia</th>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Acoes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {reportsData.map(report => (
                                <tr key={report.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{report.name}</td>
                                    <td className="px-4 py-3">{report.category}</td>
                                    <td className="px-4 py-3">{report.lastRun}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {report.formats.map((format, idx) => (
                                                <span key={idx} className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{format}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{report.frequency}</td>
                                    <td className="px-4 py-3">
                                        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', report.statusClass)}>{report.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            <button className="rounded-md bg-primary p-1.5 text-primary-foreground hover:bg-primary-dark" title="Gerar">
                                                <Play className="size-3.5" />
                                            </button>
                                            <button className="rounded-md border border-primary p-1.5 text-primary hover:bg-primary/5" title="Editar">
                                                <Pencil className="size-3.5" />
                                            </button>
                                            <button className="rounded-md border border-primary p-1.5 text-primary hover:bg-primary/5" title="Historico">
                                                <History className="size-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center border-t border-border px-5 py-4">
                    <nav className="flex gap-1">
                        <button className="rounded-md border border-primary px-3 py-1.5 text-sm text-primary opacity-50" disabled>Anterior</button>
                        <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">1</button>
                        <button className="rounded-md border border-primary px-3 py-1.5 text-sm text-primary hover:bg-primary/5">2</button>
                        <button className="rounded-md border border-primary px-3 py-1.5 text-sm text-primary hover:bg-primary/5">3</button>
                        <button className="rounded-md border border-primary px-3 py-1.5 text-sm text-primary hover:bg-primary/5">Proximo</button>
                    </nav>
                </div>
            </Card>
        </div>
    );
}
