import { useState, useRef } from 'react';
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
    X,
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

// Category-to-filter-value mapping for "Ver Relatorios" buttons
const categoryFilterMap = {
    'Atendimentos': 'atendimentos',
    'Epidemiologicos': 'epidemiologicos',
    'Farmacia': 'farmacia',
    'Financeiros': 'financeiros',
};

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
    const [showIAModal, setShowIAModal] = useState(false);
    const [showNovoModal, setShowNovoModal] = useState(false);
    const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
    const [novoRelatorio, setNovoRelatorio] = useState({
        nome: '',
        categoria: '',
        formato: '',
        frequencia: '',
        descricao: '',
    });

    const tableRef = useRef(null);

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

    const handleRefreshInsights = () => {
        setIsRefreshingInsights(true);
        setTimeout(() => setIsRefreshingInsights(false), 1500);
    };

    const handleNovoRelatorioChange = (e) => {
        const { name, value } = e.target;
        setNovoRelatorio(prev => ({ ...prev, [name]: value }));
    };

    const handleNovoRelatorioSave = () => {
        alert('Relatorio salvo com sucesso!');
        setShowNovoModal(false);
        setNovoRelatorio({ nome: '', categoria: '', formato: '', frequencia: '', descricao: '' });
    };

    const handleVerRelatorios = (categoryName) => {
        const filterValue = categoryFilterMap[categoryName] || categoryName.toLowerCase();
        setFilters(prev => ({ ...prev, categoria: filterValue }));
        setTimeout(() => {
            tableRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // Filter reports based on current filters
    const filteredReports = reportsData.filter(report => {
        // Category filter - normalize for case-insensitive comparison
        if (filters.categoria) {
            const filterCat = filters.categoria.toLowerCase();
            const reportCat = report.category.toLowerCase();
            // Handle "rh" matching "recursos humanos"
            if (filterCat === 'rh') {
                if (reportCat !== 'recursos humanos') return false;
            } else if (reportCat !== filterCat) {
                return false;
            }
        }

        // Format filter
        if (filters.formato) {
            const formatMatch = report.formats.some(
                f => f.toLowerCase() === filters.formato.toLowerCase()
            );
            if (!formatMatch) return false;
        }

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            if (!report.name.toLowerCase().includes(searchLower)) return false;
        }

        return true;
    });

    return (
        <div className="animate-fade-in">
            {/* IA Modal */}
            {showIAModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowIAModal(false)}>
                    <div className="mx-4 w-full max-w-lg rounded-xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <Bot className="size-5 text-primary" />
                                Analise IA - Relatorios
                            </h3>
                            <button onClick={() => setShowIAModal(false)} className="rounded-md p-1 hover:bg-muted">
                                <X className="size-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                                <h5 className="mb-1 text-sm font-semibold text-primary">Padroes de Uso</h5>
                                <p className="text-sm text-foreground/80">Os relatorios de Atendimentos sao os mais acessados, representando 45% das geracoes. Relatorios financeiros sao gerados predominantemente no inicio do mes.</p>
                            </div>
                            <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                                <h5 className="mb-1 text-sm font-semibold text-secondary-dark">Otimizacoes Sugeridas</h5>
                                <p className="text-sm text-foreground/80">3 relatorios podem ser consolidados para reduzir redundancia. O relatorio de Produtividade por Equipe esta inativo ha 3 meses e pode ser arquivado.</p>
                            </div>
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <h5 className="mb-1 text-sm font-semibold text-amber-800">Alertas</h5>
                                <p className="text-sm text-amber-700">O relatorio de Absenteismo esta em revisao ha mais de 30 dias. Recomenda-se finalizar a revisao ou reverter para a versao anterior.</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setShowIAModal(false)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Novo Relatorio Modal */}
            {showNovoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowNovoModal(false)}>
                    <div className="mx-4 w-full max-w-lg rounded-xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <PlusCircle className="size-5 text-primary" />
                                Novo Relatorio
                            </h3>
                            <button onClick={() => setShowNovoModal(false)} className="rounded-md p-1 hover:bg-muted">
                                <X className="size-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Nome</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={novoRelatorio.nome}
                                    onChange={handleNovoRelatorioChange}
                                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Nome do relatorio"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Categoria</label>
                                <select
                                    name="categoria"
                                    value={novoRelatorio.categoria}
                                    onChange={handleNovoRelatorioChange}
                                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Atendimentos">Atendimentos</option>
                                    <option value="Epidemiologicos">Epidemiologicos</option>
                                    <option value="Farmacia">Farmacia</option>
                                    <option value="Financeiros">Financeiros</option>
                                    <option value="Gestao">Gestao</option>
                                    <option value="Recursos Humanos">Recursos Humanos</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Formato</label>
                                <select
                                    name="formato"
                                    value={novoRelatorio.formato}
                                    onChange={handleNovoRelatorioChange}
                                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="">Selecione</option>
                                    <option value="PDF">PDF</option>
                                    <option value="Excel">Excel</option>
                                    <option value="CSV">CSV</option>
                                    <option value="HTML">HTML</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Frequencia</label>
                                <select
                                    name="frequencia"
                                    value={novoRelatorio.frequencia}
                                    onChange={handleNovoRelatorioChange}
                                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Diario">Diario</option>
                                    <option value="Semanal">Semanal</option>
                                    <option value="Mensal">Mensal</option>
                                    <option value="Trimestral">Trimestral</option>
                                    <option value="Anual">Anual</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Descricao</label>
                                <textarea
                                    name="descricao"
                                    value={novoRelatorio.descricao}
                                    onChange={handleNovoRelatorioChange}
                                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    rows={3}
                                    placeholder="Descricao do relatorio"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={() => setShowNovoModal(false)} className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted">
                                Cancelar
                            </button>
                            <button onClick={handleNovoRelatorioSave} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark">
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        <button
                            className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
                            onClick={() => setShowIAModal(true)}
                        >
                            <Bot className="size-4" />
                            Analise IA
                        </button>
                        <button
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark"
                            onClick={() => setShowNovoModal(true)}
                        >
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
                    <button
                        className="inline-flex items-center gap-1 rounded-md border border-primary px-3 py-1 text-sm text-primary hover:bg-primary/5"
                        onClick={handleRefreshInsights}
                    >
                        <RefreshCw className={cn('size-3.5', isRefreshingInsights && 'animate-spin')} />
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
                                    <button
                                        className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
                                        onClick={() => handleVerRelatorios(cat.name)}
                                    >
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
            <Card ref={tableRef}>
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                    <h5 className="text-sm font-semibold">Relatorios Disponiveis ({filteredReports.length})</h5>
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
                            {filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        Nenhum relatorio encontrado com os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map(report => (
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
                                                <button
                                                    className="rounded-md bg-primary p-1.5 text-primary-foreground hover:bg-primary-dark"
                                                    title="Gerar"
                                                    onClick={() => alert('Relatorio gerado com sucesso!')}
                                                >
                                                    <Play className="size-3.5" />
                                                </button>
                                                <button
                                                    className="rounded-md border border-primary p-1.5 text-primary hover:bg-primary/5"
                                                    title="Editar"
                                                    onClick={() => alert('Edicao em desenvolvimento')}
                                                >
                                                    <Pencil className="size-3.5" />
                                                </button>
                                                <button
                                                    className="rounded-md border border-primary p-1.5 text-primary hover:bg-primary/5"
                                                    title="Historico"
                                                    onClick={() => alert('Historico em desenvolvimento')}
                                                >
                                                    <History className="size-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
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
