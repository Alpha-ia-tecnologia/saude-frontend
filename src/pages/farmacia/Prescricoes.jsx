import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    ClipboardList,
    FileOutput,
    Printer,
    Plus,
    AlertTriangle,
    AlertCircle,
    Eye,
    X,
    Check,
    Clock,
    MinusCircle,
    CheckCircle,
    XCircle,
    HandHelping,
    Trash2,
    Search,
} from 'lucide-react';

// Sample prescriptions data
const prescricoesData = [
    {
        id: 1,
        numero: 'RX2025001234',
        paciente: 'Maria Silva Santos',
        cpf: '123.456.789-00',
        cns: '898.0001.0002.0003',
        medico: 'Dr. Carlos Oliveira',
        crm: 'CRM-SP 123456',
        data: '2025-01-26',
        validade: '2025-03-26',
        status: 'pendente',
        medicamentos: [
            { nome: 'Losartana 50mg', quantidade: 60, posologia: '1 comp. 12/12h' },
            { nome: 'Metformina 850mg', quantidade: 90, posologia: '1 comp. 8/8h' }
        ]
    },
    {
        id: 2,
        numero: 'RX2025001233',
        paciente: 'José Carlos Oliveira',
        cpf: '234.567.890-11',
        cns: '898.0002.0003.0004',
        medico: 'Dra. Ana Santos',
        crm: 'CRM-SP 654321',
        data: '2025-01-25',
        validade: '2025-03-25',
        status: 'parcial',
        medicamentos: [
            { nome: 'Omeprazol 20mg', quantidade: 30, posologia: '1 cáps. em jejum', dispensado: 30 },
            { nome: 'Amoxicilina 500mg', quantidade: 21, posologia: '1 cáps. 8/8h por 7 dias' }
        ]
    },
    {
        id: 3,
        numero: 'RX2025001232',
        paciente: 'Ana Paula Ferreira',
        cpf: '345.678.901-22',
        cns: '898.0003.0004.0005',
        medico: 'Dr. Paulo Lima',
        crm: 'CRM-SP 789012',
        data: '2025-01-24',
        validade: '2025-03-24',
        status: 'dispensada',
        medicamentos: [
            { nome: 'Dipirona 500mg', quantidade: 20, posologia: '1 comp. se dor', dispensado: 20 }
        ]
    },
    {
        id: 4,
        numero: 'RX2025001231',
        paciente: 'Pedro Henrique Lima',
        cpf: '456.789.012-33',
        cns: '898.0004.0005.0006',
        medico: 'Dr. Carlos Oliveira',
        crm: 'CRM-SP 123456',
        data: '2025-01-20',
        validade: '2025-03-20',
        status: 'dispensada',
        medicamentos: [
            { nome: 'Atenolol 25mg', quantidade: 30, posologia: '1 comp. manhã', dispensado: 30 },
            { nome: 'AAS 100mg', quantidade: 30, posologia: '1 comp. após almoço', dispensado: 30 }
        ]
    },
    {
        id: 5,
        numero: 'RX2025001230',
        paciente: 'Francisca Moura Costa',
        cpf: '567.890.123-44',
        cns: '898.0005.0006.0007',
        medico: 'Dra. Ana Santos',
        crm: 'CRM-SP 654321',
        data: '2024-11-15',
        validade: '2025-01-15',
        status: 'vencida',
        medicamentos: [
            { nome: 'Levotiroxina 50mcg', quantidade: 30, posologia: '1 comp. em jejum' }
        ]
    }
];

// Statistics
const estatisticas = {
    total: 156,
    pendentes: 23,
    parciais: 8,
    dispensadas: 118,
    vencidas: 7
};

const medicamentosDisponiveis = [
    'Paracetamol 500mg', 'Ibuprofeno 600mg', 'Amoxicilina 500mg', 'Losartana 50mg',
    'Metformina 850mg', 'Omeprazol 20mg', 'Sinvastatina 20mg', 'Enalapril 10mg',
    'Dipirona 500mg', 'Hidroclorotiazida 25mg', 'Captopril 25mg', 'Salbutamol 100mcg',
    'Atenolol 25mg', 'AAS 100mg', 'Levotiroxina 50mcg', 'Anlodipino 5mg',
    'Prednisona 20mg', 'Azitromicina 500mg', 'Dexametasona 4mg', 'Ciprofloxacino 500mg',
];

const posologiasComuns = [
    '1 comp. 1x/dia', '1 comp. 12/12h', '1 comp. 8/8h', '1 comp. 6/6h',
    '1 comp. manhã', '1 comp. em jejum', '1 comp. após almoço', '1 comp. à noite',
    '1 cáps. 12/12h', '1 cáps. 8/8h', '1 cáps. em jejum',
    '1 comp. se dor (máx 4/dia)', '2 puffs 12/12h', '20 gotas 6/6h',
];

const emptyMedItem = () => ({ nome: '', quantidade: '', posologia: '', busca: '' });

const novaPrescricaoInicial = {
    paciente: '', cpf: '', cns: '', medico: '', crm: '', observacoes: '',
    medicamentos: [emptyMedItem()],
};

export default function Prescricoes() {
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [prescricaoSelecionada, setPrescricaoSelecionada] = useState(null);
    const [showDispensarModal, setShowDispensarModal] = useState(false);
    const [showNovaModal, setShowNovaModal] = useState(false);
    const [novaPrescricao, setNovaPrescricao] = useState(novaPrescricaoInicial);
    const [prescricoes, setPrescricoes] = useState(prescricoesData);
    const [focusedMedIdx, setFocusedMedIdx] = useState(null);
    const [filtroPeriodo, setFiltroPeriodo] = useState('');

    // Filter prescriptions
    const prescricoesFiltradas = prescricoes.filter(p => {
        const matchStatus = !filtroStatus || p.status === filtroStatus;
        const matchPesquisa = !pesquisa ||
            p.paciente.toLowerCase().includes(pesquisa.toLowerCase()) ||
            p.numero.toLowerCase().includes(pesquisa.toLowerCase()) ||
            p.cns.includes(pesquisa);

        let matchPeriodo = true;
        if (filtroPeriodo) {
            const dataPrescrição = new Date(p.data);
            const hoje = new Date();
            const diffDias = Math.floor((hoje - dataPrescrição) / (1000 * 60 * 60 * 24));
            if (filtroPeriodo === '7') matchPeriodo = diffDias <= 7;
            else if (filtroPeriodo === '30') matchPeriodo = diffDias <= 30;
            else if (filtroPeriodo === '90') matchPeriodo = diffDias <= 90;
        }

        return matchStatus && matchPesquisa && matchPeriodo;
    });

    // Export prescriptions to CSV
    const exportarCSV = () => {
        const headers = ['Numero', 'Paciente', 'CPF', 'CNS', 'Medico', 'CRM', 'Data', 'Validade', 'Status', 'Medicamentos'];
        const rows = prescricoesFiltradas.map(p => [
            p.numero,
            p.paciente,
            p.cpf,
            p.cns,
            p.medico,
            p.crm,
            p.data,
            p.validade,
            p.status,
            p.medicamentos.map(m => `${m.nome} (${m.quantidade}un - ${m.posologia})`).join('; ')
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `prescricoes_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getStatusBadge = (status) => {
        const config = {
            pendente: { classes: 'bg-amber-100 text-amber-800', label: 'Pendente', Icon: Clock },
            parcial: { classes: 'bg-sky-100 text-sky-800', label: 'Parcial', Icon: MinusCircle },
            dispensada: { classes: 'bg-emerald-100 text-emerald-800', label: 'Dispensada', Icon: CheckCircle },
            vencida: { classes: 'bg-red-100 text-red-800', label: 'Vencida', Icon: XCircle }
        };
        const s = config[status] || config.pendente;
        return (
            <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium', s.classes)}>
                <s.Icon className="h-3 w-3" />
                {s.label}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    };

    const isExpired = (dateStr) => {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return date < new Date();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <ClipboardList className="h-6 w-6 text-primary" />
                    Prescrições
                </h1>
                <div className="flex gap-2">
                    <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                        onClick={exportarCSV}
                    >
                        <FileOutput className="h-4 w-4" /> Exportar
                    </button>
                    <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                        onClick={() => window.print()}
                    >
                        <Printer className="h-4 w-4" /> Imprimir
                    </button>
                    <button
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                        onClick={() => { setNovaPrescricao({ ...novaPrescricaoInicial, medicamentos: [emptyMedItem()] }); setShowNovaModal(true); }}
                    >
                        <Plus className="h-4 w-4" /> Nova Prescrição
                    </button>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-5 gap-4">
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-primary">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-primary">{estatisticas.total}</h2>
                        <small className="text-muted-foreground">Total</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-amber-400">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-amber-500">{estatisticas.pendentes}</h2>
                        <small className="text-muted-foreground">Pendentes</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-sky-500">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-sky-500">{estatisticas.parciais}</h2>
                        <small className="text-muted-foreground">Parciais</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-secondary">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-secondary">{estatisticas.dispensadas}</h2>
                        <small className="text-muted-foreground">Dispensadas</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-red-500">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-red-500">{estatisticas.vencidas}</h2>
                        <small className="text-muted-foreground">Vencidas</small>
                    </div>
                </div>
            </div>

            {/* Alert */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <strong className="inline-flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> Atenção:</strong> {estatisticas.pendentes} prescrições aguardando dispensação.
                <button
                    className="ml-4 inline-flex items-center rounded-lg bg-amber-200 px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-300"
                    onClick={() => setFiltroStatus('pendente')}
                >
                    Ver Pendentes
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="p-5">
                    <h5 className="mb-4 font-semibold">Filtros</h5>
                    <div className="grid grid-cols-[1fr_1fr_2fr] gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="pendente">Pendente</option>
                                <option value="parcial">Parcialmente Dispensada</option>
                                <option value="dispensada">Dispensada</option>
                                <option value="vencida">Vencida</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">Período</label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={filtroPeriodo}
                                onChange={(e) => setFiltroPeriodo(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="7">Últimos 7 dias</option>
                                <option value="30">Últimos 30 dias</option>
                                <option value="90">Últimos 3 meses</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">Pesquisar</label>
                            <input
                                type="text"
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Paciente, número da prescrição ou CNS..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Prescriptions Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="px-5 pt-4 pb-2">
                    <h5 className="font-semibold">Prescrições ({prescricoesFiltradas.length})</h5>
                </div>
                <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Nº Prescrição</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Paciente</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Prescritor</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Data</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Validade</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Itens</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {prescricoesFiltradas.map(rx => (
                            <tr key={rx.id}>
                                <td className="px-4 py-3">
                                    <code className="font-semibold">{rx.numero}</code>
                                </td>
                                <td className="px-4 py-3">
                                    <strong>{rx.paciente}</strong>
                                    <br />
                                    <small className="text-muted-foreground">CNS: {rx.cns}</small>
                                </td>
                                <td className="px-4 py-3">
                                    {rx.medico}
                                    <br />
                                    <small className="text-muted-foreground">{rx.crm}</small>
                                </td>
                                <td className="px-4 py-3">{formatDate(rx.data)}</td>
                                <td className={cn('px-4 py-3', isExpired(rx.validade) && 'text-red-500')}>
                                    {isExpired(rx.validade) && <AlertCircle className="mr-1 inline h-4 w-4" />}
                                    {formatDate(rx.validade)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{rx.medicamentos.length} item(s)</span>
                                </td>
                                <td className="px-4 py-3">{getStatusBadge(rx.status)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <button
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                            onClick={() => setPrescricaoSelecionada(rx)}
                                            title="Detalhes"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>
                                        {(rx.status === 'pendente' || rx.status === 'parcial') && (
                                            <button
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2 py-1.5 text-xs text-white hover:bg-emerald-700"
                                                onClick={() => {
                                                    setPrescricaoSelecionada(rx);
                                                    setShowDispensarModal(true);
                                                }}
                                                title="Dispensar"
                                            >
                                                <HandHelping className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                        <button
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                            title="Imprimir"
                                            onClick={() => window.print()}
                                        >
                                            <Printer className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {prescricaoSelecionada && !showDispensarModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setPrescricaoSelecionada(null)}
                >
                    <div
                        className="rounded-xl border border-border bg-card shadow-sm w-[700px] max-w-[90%] max-h-[80vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="border-b border-border bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Prescrição {prescricaoSelecionada.numero}</span>
                                <button
                                    className="rounded-lg bg-white/20 px-2 py-1 text-white hover:bg-white/30"
                                    onClick={() => setPrescricaoSelecionada(null)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <h6 className="mb-1 font-semibold">Paciente</h6>
                                    <p className="my-1"><strong>{prescricaoSelecionada.paciente}</strong></p>
                                    <p className="my-1 text-muted-foreground">CPF: {prescricaoSelecionada.cpf}</p>
                                    <p className="my-1 text-muted-foreground">CNS: {prescricaoSelecionada.cns}</p>
                                </div>
                                <div>
                                    <h6 className="mb-1 font-semibold">Prescritor</h6>
                                    <p className="my-1"><strong>{prescricaoSelecionada.medico}</strong></p>
                                    <p className="my-1 text-muted-foreground">{prescricaoSelecionada.crm}</p>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-3 gap-4">
                                <div>
                                    <p><strong>Data:</strong> {formatDate(prescricaoSelecionada.data)}</p>
                                </div>
                                <div>
                                    <p><strong>Validade:</strong> {formatDate(prescricaoSelecionada.validade)}</p>
                                </div>
                                <div>
                                    <p><strong>Status:</strong> {getStatusBadge(prescricaoSelecionada.status)}</p>
                                </div>
                            </div>

                            <hr className="my-4 border-border" />

                            <h6 className="mb-2 font-semibold">Medicamentos Prescritos</h6>
                            <table className="w-full text-sm">
                                <thead className="border-b border-border bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Medicamento</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Quantidade</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Posologia</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Dispensado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {prescricaoSelecionada.medicamentos.map((med, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2"><strong>{med.nome}</strong></td>
                                            <td className="px-4 py-2">{med.quantidade} un.</td>
                                            <td className="px-4 py-2">{med.posologia}</td>
                                            <td className="px-4 py-2">
                                                {med.dispensado ? (
                                                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">{med.dispensado} un.</span>
                                                ) : (
                                                    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Pendente</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                    onClick={() => window.print()}
                                >
                                    <Printer className="h-4 w-4" /> Imprimir
                                </button>
                                {(prescricaoSelecionada.status === 'pendente' || prescricaoSelecionada.status === 'parcial') && (
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                                        onClick={() => setShowDispensarModal(true)}
                                    >
                                        <HandHelping className="h-4 w-4" /> Dispensar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Nova Prescrição Modal */}
            {showNovaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowNovaModal(false)}>
                    <div className="rounded-xl border border-border bg-card shadow-sm w-[800px] max-w-[95%] max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="border-b border-border bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Nova Prescrição</span>
                                <button className="rounded-lg bg-white/20 px-2 py-1 text-white hover:bg-white/30" onClick={() => setShowNovaModal(false)}>
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-5 space-y-5">
                            {/* Dados do Paciente */}
                            <div>
                                <h6 className="mb-3 font-semibold text-foreground">Dados do Paciente</h6>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-3 sm:col-span-1">
                                        <label className="mb-1 block text-xs font-medium text-foreground">Nome do Paciente *</label>
                                        <input className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Nome completo" value={novaPrescricao.paciente}
                                            onChange={(e) => setNovaPrescricao(p => ({ ...p, paciente: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-foreground">CPF</label>
                                        <input className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="000.000.000-00" value={novaPrescricao.cpf}
                                            onChange={(e) => setNovaPrescricao(p => ({ ...p, cpf: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-foreground">Cartão SUS (CNS)</label>
                                        <input className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="898.0000.0000.0000" value={novaPrescricao.cns}
                                            onChange={(e) => setNovaPrescricao(p => ({ ...p, cns: e.target.value }))} />
                                    </div>
                                </div>
                            </div>

                            {/* Prescritor */}
                            <div>
                                <h6 className="mb-3 font-semibold text-foreground">Prescritor</h6>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-foreground">Médico *</label>
                                        <input className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Dr(a). Nome" value={novaPrescricao.medico}
                                            onChange={(e) => setNovaPrescricao(p => ({ ...p, medico: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-foreground">CRM *</label>
                                        <input className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="CRM-UF 000000" value={novaPrescricao.crm}
                                            onChange={(e) => setNovaPrescricao(p => ({ ...p, crm: e.target.value }))} />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-border" />

                            {/* Medicamentos */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h6 className="font-semibold text-foreground">Medicamentos *</h6>
                                    <button className="inline-flex items-center gap-1 rounded-lg border border-primary text-primary px-2.5 py-1.5 text-xs font-medium hover:bg-primary/5"
                                        onClick={() => setNovaPrescricao(p => ({ ...p, medicamentos: [...p.medicamentos, emptyMedItem()] }))}>
                                        <Plus className="h-3.5 w-3.5" /> Adicionar Medicamento
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {novaPrescricao.medicamentos.map((med, idx) => (
                                        <div key={idx} className="rounded-lg border border-border bg-muted/20 p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-white text-[10px] font-bold">{idx + 1}</span>
                                                <span className="text-xs font-semibold text-foreground flex-1">Medicamento {idx + 1}</span>
                                                {novaPrescricao.medicamentos.length > 1 && (
                                                    <button className="text-muted-foreground hover:text-destructive" onClick={() =>
                                                        setNovaPrescricao(p => ({ ...p, medicamentos: p.medicamentos.filter((_, i) => i !== idx) }))
                                                    }><Trash2 className="h-3.5 w-3.5" /></button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-[1fr_80px_1fr] gap-2">
                                                <div className="relative">
                                                    <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Medicamento</label>
                                                    <div className="relative">
                                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                                                        <input
                                                            className="h-9 w-full rounded-lg border border-input bg-white pl-8 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                            placeholder="Buscar medicamento..."
                                                            value={med.nome || med.busca}
                                                            onFocus={() => setFocusedMedIdx(idx)}
                                                            onBlur={() => setTimeout(() => setFocusedMedIdx(null), 150)}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setNovaPrescricao(p => {
                                                                    const meds = [...p.medicamentos];
                                                                    meds[idx] = { ...meds[idx], busca: val, nome: '' };
                                                                    return { ...p, medicamentos: meds };
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                    {focusedMedIdx === idx && (med.busca || '').length > 0 && !med.nome && (
                                                        <div className="absolute z-10 mt-1 w-full max-h-40 overflow-auto rounded-lg border border-border bg-white shadow-lg">
                                                            {medicamentosDisponiveis
                                                                .filter(m => m.toLowerCase().includes((med.busca || '').toLowerCase()))
                                                                .map((m, i) => (
                                                                    <button key={i} className="w-full px-3 py-2 text-left text-sm hover:bg-primary/5 hover:text-primary"
                                                                        onMouseDown={() => {
                                                                            setNovaPrescricao(p => {
                                                                                const meds = [...p.medicamentos];
                                                                                meds[idx] = { ...meds[idx], nome: m, busca: '' };
                                                                                return { ...p, medicamentos: meds };
                                                                            });
                                                                        }}>
                                                                        {m}
                                                                    </button>
                                                                ))
                                                            }
                                                            {medicamentosDisponiveis.filter(m => m.toLowerCase().includes((med.busca || '').toLowerCase())).length === 0 && (
                                                                <div className="px-3 py-2 text-xs text-muted-foreground">
                                                                    Nenhum encontrado.
                                                                    <button className="ml-1 text-primary font-medium" onMouseDown={() => {
                                                                        setNovaPrescricao(p => {
                                                                            const meds = [...p.medicamentos];
                                                                            meds[idx] = { ...meds[idx], nome: med.busca, busca: '' };
                                                                            return { ...p, medicamentos: meds };
                                                                        });
                                                                    }}>Usar "{med.busca}"</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Qtd.</label>
                                                    <input type="number" min="1"
                                                        className="h-9 w-full rounded-lg border border-input bg-white px-2 text-sm text-center focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        placeholder="30" value={med.quantidade}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setNovaPrescricao(p => {
                                                                const meds = [...p.medicamentos];
                                                                meds[idx] = { ...meds[idx], quantidade: val };
                                                                return { ...p, medicamentos: meds };
                                                            });
                                                        }} />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Posologia</label>
                                                    <select
                                                        className="h-9 w-full rounded-lg border border-input bg-white px-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        value={med.posologia}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setNovaPrescricao(p => {
                                                                const meds = [...p.medicamentos];
                                                                meds[idx] = { ...meds[idx], posologia: val };
                                                                return { ...p, medicamentos: meds };
                                                            });
                                                        }}>
                                                        <option value="">Selecione...</option>
                                                        {posologiasComuns.map((pos, i) => <option key={i} value={pos}>{pos}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Observações */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-foreground">Observações</label>
                                <textarea className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    rows="2" placeholder="Observações sobre a prescrição..."
                                    value={novaPrescricao.observacoes}
                                    onChange={(e) => setNovaPrescricao(p => ({ ...p, observacoes: e.target.value }))} />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2 border-t border-border">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                                    onClick={() => setShowNovaModal(false)}>
                                    Cancelar
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                                    onClick={() => {
                                        // Validação
                                        if (!novaPrescricao.paciente.trim()) { alert('Informe o nome do paciente.'); return; }
                                        if (!novaPrescricao.medico.trim()) { alert('Informe o médico prescritor.'); return; }
                                        if (!novaPrescricao.crm.trim()) { alert('Informe o CRM.'); return; }
                                        const medsValidos = novaPrescricao.medicamentos.filter(m => m.nome && m.quantidade && m.posologia);
                                        if (medsValidos.length === 0) { alert('Adicione ao menos um medicamento com quantidade e posologia.'); return; }

                                        const hoje = new Date();
                                        const validade = new Date(hoje);
                                        validade.setMonth(validade.getMonth() + 2);
                                        const seq = String(prescricoes.length + 1230 + 1).padStart(7, '0');

                                        const nova = {
                                            id: Date.now(),
                                            numero: `RX2026${seq}`,
                                            paciente: novaPrescricao.paciente,
                                            cpf: novaPrescricao.cpf || '-',
                                            cns: novaPrescricao.cns || '-',
                                            medico: novaPrescricao.medico,
                                            crm: novaPrescricao.crm,
                                            data: hoje.toISOString().split('T')[0],
                                            validade: validade.toISOString().split('T')[0],
                                            status: 'pendente',
                                            medicamentos: medsValidos.map(m => ({
                                                nome: m.nome, quantidade: parseInt(m.quantidade), posologia: m.posologia,
                                            })),
                                        };

                                        setPrescricoes(prev => [nova, ...prev]);
                                        setShowNovaModal(false);
                                        setNovaPrescricao({ ...novaPrescricaoInicial, medicamentos: [emptyMedItem()] });
                                    }}>
                                    <Check className="h-4 w-4" /> Criar Prescrição
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dispensar Modal */}
            {prescricaoSelecionada && showDispensarModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => {
                        setShowDispensarModal(false);
                        setPrescricaoSelecionada(null);
                    }}
                >
                    <div
                        className="rounded-xl border border-border bg-card shadow-sm w-[700px] max-w-[90%]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="border-b border-border bg-secondary px-5 py-3 text-sm font-semibold text-white">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><HandHelping className="h-4 w-4" /> Dispensar Medicamentos</span>
                                <button
                                    className="rounded-lg bg-white/20 px-2 py-1 text-white hover:bg-white/30"
                                    onClick={() => {
                                        setShowDispensarModal(false);
                                        setPrescricaoSelecionada(null);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm mb-4">
                                <div>
                                    <strong>Prescrição:</strong> {prescricaoSelecionada.numero}
                                    <br />
                                    <strong>Paciente:</strong> {prescricaoSelecionada.paciente}
                                </div>
                            </div>

                            <h6 className="mb-2 font-semibold">Selecione os medicamentos a dispensar:</h6>
                            <table className="w-full text-sm">
                                <thead className="border-b border-border bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                                            <input type="checkbox" defaultChecked />
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Medicamento</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Prescrito</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Dispensar</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Lote</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {prescricaoSelecionada.medicamentos.map((med, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2">
                                                <input type="checkbox" defaultChecked={!med.dispensado} disabled={med.dispensado} />
                                            </td>
                                            <td className="px-4 py-2"><strong>{med.nome}</strong></td>
                                            <td className="px-4 py-2">{med.quantidade} un.</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    className="h-8 w-20 rounded-lg border border-input bg-white px-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                    defaultValue={med.dispensado ? 0 : med.quantidade}
                                                    disabled={med.dispensado}
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <select className="h-8 w-[120px] rounded-lg border border-input bg-white px-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" disabled={med.dispensado}>
                                                    <option>LOT2025001</option>
                                                    <option>LOT2025002</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-4">
                                <label className="mb-1 block text-sm font-medium text-foreground">Observações</label>
                                <textarea className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" rows="2" placeholder="Observações sobre a dispensação..."></textarea>
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                    onClick={() => {
                                        setShowDispensarModal(false);
                                        setPrescricaoSelecionada(null);
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                                    <Check className="h-4 w-4" /> Confirmar Dispensação
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
