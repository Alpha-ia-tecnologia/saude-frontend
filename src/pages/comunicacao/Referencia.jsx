import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    ArrowLeftRight,
    FileOutput,
    Plus,
    ArrowRight,
    ArrowLeft,
    Eye,
    Pencil,
    Printer,
    X,
    Check,
    Send,
    Building2,
    XCircle,
} from 'lucide-react';

// Sample referrals data
const encaminhamentosData = [
    {
        id: 1,
        numero: 'REF2025000123',
        tipo: 'referencia',
        paciente: 'Maria Silva Santos',
        cns: '898.0001.0002.0003',
        origem: 'UBS Centro',
        destino: 'Hospital Regional - Cardiologia',
        motivo: 'Avaliação cardiológica - paciente com HAS refratária',
        prioridade: 'alta',
        status: 'aguardando',
        dataEnvio: '2025-01-25',
        medicoSolicitante: 'Dr. Carlos Oliveira',
        cid: 'I10 - Hipertensão Essencial'
    },
    {
        id: 2,
        numero: 'REF2025000122',
        tipo: 'referencia',
        paciente: 'José Carlos Oliveira',
        cns: '898.0002.0003.0004',
        origem: 'UBS Centro',
        destino: 'CAPS - Centro de Atenção Psicossocial',
        motivo: 'Acompanhamento de transtorno depressivo grave',
        prioridade: 'media',
        status: 'agendado',
        dataEnvio: '2025-01-24',
        dataAgendada: '2025-02-05',
        medicoSolicitante: 'Dra. Ana Santos',
        cid: 'F32 - Episódio Depressivo'
    },
    {
        id: 3,
        numero: 'REF2025000121',
        tipo: 'contra-referencia',
        paciente: 'Ana Paula Ferreira',
        cns: '898.0003.0004.0005',
        origem: 'Hospital Regional - Ortopedia',
        destino: 'UBS Centro',
        motivo: 'Alta pós-cirúrgica - fratura de fêmur. Continuar fisioterapia.',
        prioridade: 'baixa',
        status: 'recebido',
        dataEnvio: '2025-01-23',
        dataRecebimento: '2025-01-23',
        medicoSolicitante: 'Dr. Paulo Lima',
        cid: 'S72 - Fratura do Fêmur'
    },
    {
        id: 4,
        numero: 'REF2025000120',
        tipo: 'referencia',
        paciente: 'Pedro Henrique Lima',
        cns: '898.0004.0005.0006',
        origem: 'UBS Centro',
        destino: 'Laboratório Municipal',
        motivo: 'Exames complementares para investigação de diabetes',
        prioridade: 'baixa',
        status: 'concluido',
        dataEnvio: '2025-01-20',
        dataConclusao: '2025-01-22',
        medicoSolicitante: 'Dr. Carlos Oliveira',
        cid: 'R73 - Glicemia Alterada'
    },
    {
        id: 5,
        numero: 'REF2025000119',
        tipo: 'referencia',
        paciente: 'Francisca Moura Costa',
        cns: '898.0005.0006.0007',
        origem: 'UBS Centro',
        destino: 'Hospital Regional - Endocrinologia',
        motivo: 'Nódulo tireoidiano para investigação',
        prioridade: 'alta',
        status: 'negado',
        dataEnvio: '2025-01-18',
        motivoNegacao: 'Documentação incompleta. Faltam exames de USG tireóide.',
        medicoSolicitante: 'Dra. Ana Santos',
        cid: 'E04 - Bócio'
    }
];

// Statistics
const estatisticas = {
    total: 234,
    aguardando: 45,
    agendados: 67,
    concluidos: 112,
    negados: 10
};

export default function Referencia() {
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [encaminhamentoSelecionado, setEncaminhamentoSelecionado] = useState(null);
    const [showNovoModal, setShowNovoModal] = useState(false);

    // Filter referrals
    const encaminhamentosFiltrados = encaminhamentosData.filter(e => {
        const matchTipo = !filtroTipo || e.tipo === filtroTipo;
        const matchStatus = !filtroStatus || e.status === filtroStatus;
        const matchPesquisa = !pesquisa ||
            e.paciente.toLowerCase().includes(pesquisa.toLowerCase()) ||
            e.numero.toLowerCase().includes(pesquisa.toLowerCase()) ||
            e.cns.includes(pesquisa);
        return matchTipo && matchStatus && matchPesquisa;
    });

    const getTipoBadge = (tipo) => {
        const config = {
            referencia: { classes: 'bg-primary/10 text-primary', label: 'Referência', Icon: ArrowRight },
            'contra-referencia': { classes: 'bg-sky-100 text-sky-800', label: 'Contra-Referência', Icon: ArrowLeft }
        };
        const t = config[tipo] || config.referencia;
        return (
            <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium', t.classes)}>
                <t.Icon className="h-3 w-3" />
                {t.label}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const config = {
            aguardando: { classes: 'bg-amber-100 text-amber-800', label: 'Aguardando' },
            agendado: { classes: 'bg-sky-100 text-sky-800', label: 'Agendado' },
            recebido: { classes: 'bg-primary/10 text-primary', label: 'Recebido' },
            concluido: { classes: 'bg-emerald-100 text-emerald-800', label: 'Concluído' },
            negado: { classes: 'bg-red-100 text-red-800', label: 'Negado' }
        };
        const s = config[status] || config.aguardando;
        return <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', s.classes)}>{s.label}</span>;
    };

    const getPrioridadeBadge = (prioridade) => {
        const config = {
            alta: 'bg-red-500 text-white',
            media: 'bg-amber-400 text-white',
            baixa: 'bg-emerald-500 text-white'
        };
        const labels = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
        return (
            <span className={cn('rounded-md px-2 py-0.5 text-xs font-semibold', config[prioridade] || config.baixa)}>
                {labels[prioridade] || 'Baixa'}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <ArrowLeftRight className="h-6 w-6 text-primary" />
                    Referência e Contra-Referência
                </h1>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                        <FileOutput className="h-4 w-4" /> Exportar
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark" onClick={() => setShowNovoModal(true)}>
                        <Plus className="h-4 w-4" /> Novo Encaminhamento
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
                        <h2 className="text-2xl font-bold text-amber-500">{estatisticas.aguardando}</h2>
                        <small className="text-muted-foreground">Aguardando</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-sky-500">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-sky-500">{estatisticas.agendados}</h2>
                        <small className="text-muted-foreground">Agendados</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-secondary">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-secondary">{estatisticas.concluidos}</h2>
                        <small className="text-muted-foreground">Concluídos</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-red-500">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-red-500">{estatisticas.negados}</h2>
                        <small className="text-muted-foreground">Negados</small>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="p-5">
                    <h5 className="mb-4 font-semibold">Filtros</h5>
                    <div className="grid grid-cols-[1fr_1fr_2fr] gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">Tipo</label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="referencia">Referência</option>
                                <option value="contra-referencia">Contra-Referência</option>
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
                                <option value="aguardando">Aguardando</option>
                                <option value="agendado">Agendado</option>
                                <option value="recebido">Recebido</option>
                                <option value="concluido">Concluído</option>
                                <option value="negado">Negado</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">Pesquisar</label>
                            <input
                                type="text"
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Paciente, número ou CNS..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Referrals Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="px-5 pt-4 pb-2">
                    <h5 className="font-semibold">Encaminhamentos ({encaminhamentosFiltrados.length})</h5>
                </div>
                <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Nº / Tipo</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Paciente</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Origem → Destino</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Prioridade</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Data</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {encaminhamentosFiltrados.map(enc => (
                            <tr key={enc.id}>
                                <td className="px-4 py-3">
                                    <code className="font-semibold">{enc.numero}</code>
                                    <br />
                                    {getTipoBadge(enc.tipo)}
                                </td>
                                <td className="px-4 py-3">
                                    <strong>{enc.paciente}</strong>
                                    <br />
                                    <small className="text-muted-foreground">CNS: {enc.cns}</small>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-[0.85rem]">
                                        <div className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-primary" /> {enc.origem}</div>
                                        <div className="my-1 text-muted-foreground">↓</div>
                                        <div className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-secondary" /> {enc.destino}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{getPrioridadeBadge(enc.prioridade)}</td>
                                <td className="px-4 py-3">{formatDate(enc.dataEnvio)}</td>
                                <td className="px-4 py-3">{getStatusBadge(enc.status)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <button
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                            onClick={() => setEncaminhamentoSelecionado(enc)}
                                            title="Detalhes"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>
                                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted" title="Editar">
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted" title="Imprimir">
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
            {encaminhamentoSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setEncaminhamentoSelecionado(null)}
                >
                    <div
                        className="rounded-xl border border-border bg-card shadow-sm w-[700px] max-w-[90%] max-h-[80vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="border-b border-border bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><ArrowLeftRight className="h-4 w-4" /> {encaminhamentoSelecionado.numero}</span>
                                <button
                                    className="rounded-lg bg-white/20 px-2 py-1 text-white hover:bg-white/30"
                                    onClick={() => setEncaminhamentoSelecionado(null)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-4 flex gap-3">
                                {getTipoBadge(encaminhamentoSelecionado.tipo)}
                                {getStatusBadge(encaminhamentoSelecionado.status)}
                                {getPrioridadeBadge(encaminhamentoSelecionado.prioridade)}
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <h6 className="mb-1 font-semibold">Paciente</h6>
                                    <p className="my-1"><strong>{encaminhamentoSelecionado.paciente}</strong></p>
                                    <p className="my-1 text-muted-foreground">CNS: {encaminhamentoSelecionado.cns}</p>
                                </div>
                                <div>
                                    <h6 className="mb-1 font-semibold">Solicitante</h6>
                                    <p className="my-1"><strong>{encaminhamentoSelecionado.medicoSolicitante}</strong></p>
                                    <p className="my-1 text-muted-foreground">{encaminhamentoSelecionado.origem}</p>
                                </div>
                            </div>

                            <div className="mb-4 rounded-lg bg-muted p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 text-center">
                                        <Building2 className="mx-auto h-8 w-8 text-primary" />
                                        <p className="mt-2"><strong>{encaminhamentoSelecionado.origem}</strong></p>
                                    </div>
                                    <div>
                                        <ArrowRight className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 text-center">
                                        <Building2 className="mx-auto h-8 w-8 text-secondary" />
                                        <p className="mt-2"><strong>{encaminhamentoSelecionado.destino}</strong></p>
                                    </div>
                                </div>
                            </div>

                            <h6 className="mb-1 font-semibold">Motivo do Encaminhamento</h6>
                            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                {encaminhamentoSelecionado.motivo}
                            </p>

                            <p className="mt-3"><strong>CID:</strong> {encaminhamentoSelecionado.cid}</p>
                            <p><strong>Data de Envio:</strong> {formatDate(encaminhamentoSelecionado.dataEnvio)}</p>

                            {encaminhamentoSelecionado.dataAgendada && (
                                <p><strong>Data Agendada:</strong> {formatDate(encaminhamentoSelecionado.dataAgendada)}</p>
                            )}

                            {encaminhamentoSelecionado.motivoNegacao && (
                                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                                    <strong className="flex items-center gap-1"><XCircle className="h-4 w-4" /> Motivo da Negativa:</strong><br />
                                    {encaminhamentoSelecionado.motivoNegacao}
                                </div>
                            )}

                            <div className="mt-4 flex justify-end gap-2">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                                    <Printer className="h-4 w-4" /> Imprimir
                                </button>
                                {encaminhamentoSelecionado.status === 'aguardando' && (
                                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                                        <Check className="h-4 w-4" /> Confirmar Recebimento
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Referral Modal */}
            {showNovoModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowNovoModal(false)}
                >
                    <div
                        className="rounded-xl border border-border bg-card shadow-sm w-[700px] max-w-[90%] max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="border-b border-border bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Novo Encaminhamento</span>
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
                                <div className="col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-foreground">Paciente *</label>
                                    <input type="text" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Buscar paciente por nome ou CNS..." />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Tipo *</label>
                                    <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                                        <option>Referência</option>
                                        <option>Contra-Referência</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Prioridade *</label>
                                    <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                                        <option>Baixa</option>
                                        <option>Média</option>
                                        <option>Alta</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Unidade de Origem *</label>
                                    <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                                        <option>UBS Centro</option>
                                        <option>UBS Norte</option>
                                        <option>UBS Sul</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Unidade de Destino *</label>
                                    <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                                        <option>Hospital Regional - Cardiologia</option>
                                        <option>Hospital Regional - Ortopedia</option>
                                        <option>Hospital Regional - Neurologia</option>
                                        <option>CAPS</option>
                                        <option>CEO - Centro de Especialidades</option>
                                        <option>Laboratório Municipal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">CID Principal</label>
                                    <input type="text" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ex: I10" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Médico Solicitante</label>
                                    <input type="text" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="Dr. Carlos Oliveira" />
                                </div>
                                <div className="col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-foreground">Motivo do Encaminhamento *</label>
                                    <textarea className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" rows="3" placeholder="Descreva o motivo clínico do encaminhamento..."></textarea>
                                </div>
                                <div className="col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-foreground">Resumo Clínico</label>
                                    <textarea className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" rows="3" placeholder="Histórico relevante, exames realizados, tratamentos anteriores..."></textarea>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted" onClick={() => setShowNovoModal(false)}>
                                    Cancelar
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                                    <Send className="h-4 w-4" /> Enviar Encaminhamento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
