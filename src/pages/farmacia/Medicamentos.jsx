import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Pill,
    FileOutput,
    Truck,
    Plus,
    AlertTriangle,
    CalendarDays,
    AlertCircle,
    Eye,
    Pencil,
    X,
    Save,
    Minus,
} from 'lucide-react';

// Sample medications data
const medicamentosData = [
    {
        id: 1,
        nome: 'Losartana Potássica',
        concentracao: '50mg',
        formaFarmaceutica: 'Comprimido',
        categoria: 'Anti-hipertensivo',
        estoque: 2500,
        estoqueMinimo: 500,
        lote: 'LOT2025001',
        validade: '2026-06-15',
        fabricante: 'EMS',
        status: 'disponivel'
    },
    {
        id: 2,
        nome: 'Metformina',
        concentracao: '850mg',
        formaFarmaceutica: 'Comprimido',
        categoria: 'Antidiabético',
        estoque: 1800,
        estoqueMinimo: 400,
        lote: 'LOT2025002',
        validade: '2026-03-20',
        fabricante: 'Merck',
        status: 'disponivel'
    },
    {
        id: 3,
        nome: 'Omeprazol',
        concentracao: '20mg',
        formaFarmaceutica: 'Cápsula',
        categoria: 'Antiulceroso',
        estoque: 320,
        estoqueMinimo: 300,
        lote: 'LOT2025003',
        validade: '2025-08-10',
        fabricante: 'Medley',
        status: 'baixo'
    },
    {
        id: 4,
        nome: 'Amoxicilina',
        concentracao: '500mg',
        formaFarmaceutica: 'Cápsula',
        categoria: 'Antibiótico',
        estoque: 850,
        estoqueMinimo: 200,
        lote: 'LOT2025004',
        validade: '2025-05-01',
        fabricante: 'Eurofarma',
        status: 'vencendo'
    },
    {
        id: 5,
        nome: 'Dipirona Sódica',
        concentracao: '500mg',
        formaFarmaceutica: 'Comprimido',
        categoria: 'Analgésico',
        estoque: 3200,
        estoqueMinimo: 600,
        lote: 'LOT2025005',
        validade: '2027-01-15',
        fabricante: 'Neo Química',
        status: 'disponivel'
    },
    {
        id: 6,
        nome: 'Salbutamol',
        concentracao: '100mcg',
        formaFarmaceutica: 'Aerosol',
        categoria: 'Broncodilatador',
        estoque: 45,
        estoqueMinimo: 50,
        lote: 'LOT2025006',
        validade: '2025-12-30',
        fabricante: 'GSK',
        status: 'baixo'
    },
    {
        id: 7,
        nome: 'Atenolol',
        concentracao: '25mg',
        formaFarmaceutica: 'Comprimido',
        categoria: 'Anti-hipertensivo',
        estoque: 1200,
        estoqueMinimo: 300,
        lote: 'LOT2025007',
        validade: '2026-09-20',
        fabricante: 'Biolab',
        status: 'disponivel'
    },
    {
        id: 8,
        nome: 'Insulina NPH',
        concentracao: '100UI/ml',
        formaFarmaceutica: 'Frasco',
        categoria: 'Antidiabético',
        estoque: 0,
        estoqueMinimo: 100,
        lote: '-',
        validade: '-',
        fabricante: 'Lilly',
        status: 'esgotado'
    }
];

const categorias = [
    'Todas',
    'Anti-hipertensivo',
    'Antidiabético',
    'Antibiótico',
    'Analgésico',
    'Antiulceroso',
    'Broncodilatador'
];

// Statistics
const estatisticas = {
    totalItens: 156,
    disponiveis: 132,
    estoqueBaixo: 18,
    vencendo: 4,
    esgotados: 2
};

export default function Medicamentos() {
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
    const [showNovoModal, setShowNovoModal] = useState(false);

    // Filter medications
    const medicamentosFiltrados = medicamentosData.filter(m => {
        const matchCategoria = filtroCategoria === 'Todas' || m.categoria === filtroCategoria;
        const matchStatus = !filtroStatus || m.status === filtroStatus;
        const matchPesquisa = !pesquisa ||
            m.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
            m.lote.toLowerCase().includes(pesquisa.toLowerCase());
        return matchCategoria && matchStatus && matchPesquisa;
    });

    const getStatusBadge = (status) => {
        const config = {
            disponivel: { classes: 'bg-emerald-100 text-emerald-800', label: 'Disponível' },
            baixo: { classes: 'bg-amber-100 text-amber-800', label: 'Estoque Baixo' },
            vencendo: { classes: 'bg-sky-100 text-sky-800', label: 'Vencendo' },
            esgotado: { classes: 'bg-red-100 text-red-800', label: 'Esgotado' }
        };
        const s = config[status] || config.disponivel;
        return <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', s.classes)}>{s.label}</span>;
    };

    const getEstoqueClasses = (estoque, minimo) => {
        const ratio = estoque / minimo;
        if (ratio <= 0) return { bar: 'bg-red-500', text: 'text-red-500' };
        if (ratio < 1.2) return { bar: 'bg-amber-400', text: 'text-amber-500' };
        return { bar: 'bg-emerald-500', text: 'text-emerald-500' };
    };

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === '-') return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    };

    const isExpiringSoon = (dateStr) => {
        if (!dateStr || dateStr === '-') return false;
        const date = new Date(dateStr);
        const now = new Date();
        const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000;
        return date.getTime() - now.getTime() < threeMonths;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Pill className="h-6 w-6 text-secondary" />
                    Gestão de Medicamentos
                </h1>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                        <FileOutput className="h-4 w-4" /> Exportar
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                        <Truck className="h-4 w-4" /> Entrada
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark" onClick={() => setShowNovoModal(true)}>
                        <Plus className="h-4 w-4" /> Novo Medicamento
                    </button>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-5 gap-4">
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-primary">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-primary">{estatisticas.totalItens}</h2>
                        <small className="text-muted-foreground">Total de Itens</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-secondary">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-secondary">{estatisticas.disponiveis}</h2>
                        <small className="text-muted-foreground">Disponíveis</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-amber-400">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-amber-500">{estatisticas.estoqueBaixo}</h2>
                        <small className="text-muted-foreground">Estoque Baixo</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-sky-500">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-sky-500">{estatisticas.vencendo}</h2>
                        <small className="text-muted-foreground">Vencendo</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-red-500">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-red-500">{estatisticas.esgotados}</h2>
                        <small className="text-muted-foreground">Esgotados</small>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <strong className="inline-flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> Estoque Crítico:</strong> {estatisticas.estoqueBaixo} medicamentos abaixo do estoque mínimo.
                    <a href="#" className="ml-2 underline">Ver lista</a>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                    <strong className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Vencimento Próximo:</strong> {estatisticas.vencendo} lotes vencem nos próximos 3 meses.
                    <a href="#" className="ml-2 underline">Ver lista</a>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="p-5">
                    <h5 className="mb-4 font-semibold">Filtros</h5>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">Categoria</label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                            >
                                {categorias.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="disponivel">Disponível</option>
                                <option value="baixo">Estoque Baixo</option>
                                <option value="vencendo">Vencendo</option>
                                <option value="esgotado">Esgotado</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="mb-1 block text-sm font-medium text-foreground">Pesquisar</label>
                            <input
                                type="text"
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Nome do medicamento ou lote..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Medications Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="px-5 pt-4 pb-2">
                    <h5 className="font-semibold">Medicamentos ({medicamentosFiltrados.length})</h5>
                </div>
                <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Medicamento</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Categoria</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Estoque</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Lote</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Validade</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {medicamentosFiltrados.map(med => {
                            const estoqueStyle = getEstoqueClasses(med.estoque, med.estoqueMinimo);
                            return (
                                <tr key={med.id}>
                                    <td className="px-4 py-3">
                                        <strong>{med.nome}</strong>
                                        <br />
                                        <small className="text-muted-foreground">
                                            {med.concentracao} - {med.formaFarmaceutica}
                                        </small>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{med.categoria}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-[60px] overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className={cn('h-full rounded-full', estoqueStyle.bar)}
                                                    style={{ width: `${Math.min(100, (med.estoque / (med.estoqueMinimo * 2)) * 100)}%` }}
                                                />
                                            </div>
                                            <span className={cn('font-semibold', estoqueStyle.text)}>
                                                {med.estoque}
                                            </span>
                                        </div>
                                        <small className="text-muted-foreground">Mín: {med.estoqueMinimo}</small>
                                    </td>
                                    <td className="px-4 py-3"><code className="text-sm">{med.lote}</code></td>
                                    <td className={cn('px-4 py-3', isExpiringSoon(med.validade) && 'text-red-500')}>
                                        {isExpiringSoon(med.validade) && <AlertCircle className="mr-1 inline h-4 w-4" />}
                                        {formatDate(med.validade)}
                                    </td>
                                    <td className="px-4 py-3">{getStatusBadge(med.status)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            <button
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                                onClick={() => setMedicamentoSelecionado(med)}
                                                title="Detalhes"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-2 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50" title="Entrada">
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted" title="Editar">
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {medicamentoSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setMedicamentoSelecionado(null)}
                >
                    <div
                        className="rounded-xl border border-border bg-card shadow-sm w-[600px] max-w-[90%] max-h-[80vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="border-b border-border bg-secondary px-5 py-3 text-sm font-semibold text-white">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><Pill className="h-4 w-4" /> {medicamentoSelecionado.nome}</span>
                                <button
                                    className="rounded-lg bg-white/20 px-2 py-1 text-white hover:bg-white/30"
                                    onClick={() => setMedicamentoSelecionado(null)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p><strong>Concentração:</strong> {medicamentoSelecionado.concentracao}</p>
                                    <p><strong>Forma:</strong> {medicamentoSelecionado.formaFarmaceutica}</p>
                                    <p><strong>Categoria:</strong> {medicamentoSelecionado.categoria}</p>
                                    <p><strong>Fabricante:</strong> {medicamentoSelecionado.fabricante}</p>
                                </div>
                                <div>
                                    <p><strong>Lote:</strong> <code>{medicamentoSelecionado.lote}</code></p>
                                    <p><strong>Validade:</strong> {formatDate(medicamentoSelecionado.validade)}</p>
                                    <p><strong>Estoque Atual:</strong> {medicamentoSelecionado.estoque} unidades</p>
                                    <p><strong>Estoque Mínimo:</strong> {medicamentoSelecionado.estoqueMinimo} unidades</p>
                                </div>
                            </div>

                            <h6 className="mb-2 font-semibold">Movimentação Recente</h6>
                            <table className="w-full text-sm">
                                <thead className="border-b border-border bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Data</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Tipo</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Qtd</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Responsável</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr>
                                        <td className="px-4 py-2">25/01/2025</td>
                                        <td className="px-4 py-2"><span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Saída</span></td>
                                        <td className="px-4 py-2">-30</td>
                                        <td className="px-4 py-2">Dr. Carlos</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">20/01/2025</td>
                                        <td className="px-4 py-2"><span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">Entrada</span></td>
                                        <td className="px-4 py-2">+500</td>
                                        <td className="px-4 py-2">Farmácia Central</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">15/01/2025</td>
                                        <td className="px-4 py-2"><span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Saída</span></td>
                                        <td className="px-4 py-2">-45</td>
                                        <td className="px-4 py-2">Dra. Ana</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-4 flex justify-end gap-2">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                                    <Minus className="h-4 w-4" /> Registrar Saída
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                                    <Plus className="h-4 w-4" /> Registrar Entrada
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Medication Modal */}
            {showNovoModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowNovoModal(false)}
                >
                    <div
                        className="rounded-xl border border-border bg-card shadow-sm w-[600px] max-w-[90%]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="border-b border-border bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Novo Medicamento</span>
                                <button
                                    className="rounded-lg bg-white/20 px-2 py-1 text-white hover:bg-white/30"
                                    onClick={() => setShowNovoModal(false)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Nome do Medicamento *</label>
                                    <input type="text" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ex: Losartana Potássica" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Concentração *</label>
                                    <input type="text" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ex: 50mg" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Forma Farmacêutica</label>
                                    <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                                        <option>Comprimido</option>
                                        <option>Cápsula</option>
                                        <option>Solução</option>
                                        <option>Suspensão</option>
                                        <option>Pomada</option>
                                        <option>Injetável</option>
                                        <option>Aerosol</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Categoria</label>
                                    <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                                        {categorias.filter(c => c !== 'Todas').map(c => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Estoque Mínimo *</label>
                                    <input type="number" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ex: 500" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Fabricante</label>
                                    <input type="text" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ex: EMS" />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted" onClick={() => setShowNovoModal(false)}>
                                    Cancelar
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                                    <Save className="h-4 w-4" /> Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
