import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    FileText,
    Bot,
    Printer,
    Plus,
    Lightbulb,
    CheckCircle,
    AlertTriangle,
    Search,
    Eye,
    Pencil,
    Trash2,
    X,
    Download,
    Play,
} from 'lucide-react';

// Sample protocols data
const protocolsData = [
    {
        id: 1,
        nome: 'Hipertensão Arterial Sistêmica',
        categoria: 'Doenças Crônicas',
        origem: 'Ministério da Saúde',
        atualizacao: '15/01/2025',
        status: 'ativo',
        adesao: 85,
        descricao: 'Protocolo para manejo de pacientes com hipertensão arterial na Atenção Primária'
    },
    {
        id: 2,
        nome: 'Diabetes Mellitus',
        categoria: 'Doenças Crônicas',
        origem: 'Ministério da Saúde',
        atualizacao: '10/12/2024',
        status: 'ativo',
        adesao: 58,
        descricao: 'Diretrizes para tratamento e acompanhamento de pacientes diabéticos'
    },
    {
        id: 3,
        nome: 'Pré-Natal de Baixo Risco',
        categoria: 'Saúde da Mulher',
        origem: 'Ministério da Saúde',
        atualizacao: '05/02/2025',
        status: 'ativo',
        adesao: 92,
        descricao: 'Acompanhamento pré-natal para gestantes de baixo risco'
    },
    {
        id: 4,
        nome: 'Tuberculose',
        categoria: 'Doenças Infecciosas',
        origem: 'Ministério da Saúde',
        atualizacao: '20/11/2024',
        status: 'revisao',
        adesao: 75,
        descricao: 'Protocolo de diagnóstico e tratamento da tuberculose'
    },
    {
        id: 5,
        nome: 'Saúde Mental na Atenção Básica',
        categoria: 'Saúde Mental',
        origem: 'Secretaria Estadual',
        atualizacao: '03/03/2025',
        status: 'ativo',
        adesao: 62,
        descricao: 'Protocolo de atendimento em saúde mental na APS'
    },
    {
        id: 6,
        nome: 'Puericultura',
        categoria: 'Saúde da Criança',
        origem: 'Ministério da Saúde',
        atualizacao: '18/01/2025',
        status: 'ativo',
        adesao: 88,
        descricao: 'Acompanhamento do crescimento e desenvolvimento infantil'
    },
    {
        id: 7,
        nome: 'Manejo da Dengue',
        categoria: 'Doenças Infecciosas',
        origem: 'Ministério da Saúde',
        atualizacao: '01/03/2025',
        status: 'ativo',
        adesao: 78,
        descricao: 'Protocolo para diagnóstico e tratamento da dengue'
    },
    {
        id: 8,
        nome: 'DPOC e Asma',
        categoria: 'Doenças Crônicas',
        origem: 'Secretaria Municipal',
        atualizacao: '25/02/2025',
        status: 'rascunho',
        adesao: 0,
        descricao: 'Protocolo para manejo de doenças respiratórias crônicas'
    }
];

const categorias = [
    'Todas',
    'Doenças Crônicas',
    'Saúde da Mulher',
    'Saúde da Criança',
    'Saúde Mental',
    'Doenças Infecciosas',
    'Urgência e Emergência'
];

const origens = [
    'Todas',
    'Ministério da Saúde',
    'Secretaria Estadual',
    'Secretaria Municipal',
    'Institucional'
];

const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'ativo', label: 'Ativo', color: 'success' },
    { value: 'revisao', label: 'Em Revisão', color: 'warning' },
    { value: 'rascunho', label: 'Rascunho', color: 'secondary' },
    { value: 'desativado', label: 'Desativado', color: 'danger' }
];

export default function Protocolos() {
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');
    const [filtroOrigem, setFiltroOrigem] = useState('Todas');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [protocoloSelecionado, setProtocoloSelecionado] = useState(null);

    // Filter protocols
    const protocolosFiltrados = protocolsData.filter(p => {
        const matchCategoria = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
        const matchOrigem = filtroOrigem === 'Todas' || p.origem === filtroOrigem;
        const matchStatus = !filtroStatus || p.status === filtroStatus;
        const matchPesquisa = !pesquisa ||
            p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
            p.descricao.toLowerCase().includes(pesquisa.toLowerCase());
        return matchCategoria && matchOrigem && matchStatus && matchPesquisa;
    });

    const getStatusBadge = (status) => {
        const statusInfo = statusOptions.find(s => s.value === status);
        const colorMap = {
            success: 'bg-secondary/10 text-secondary-dark',
            warning: 'bg-amber-50 text-amber-800',
            secondary: 'bg-muted text-muted-foreground',
            danger: 'bg-red-50 text-destructive',
        };
        return (
            <span
                className={cn(
                    'rounded-md px-2 py-0.5 text-xs font-medium',
                    colorMap[statusInfo?.color] || 'bg-muted text-muted-foreground'
                )}
            >
                {statusInfo?.label || status}
            </span>
        );
    };

    const getAdesaoColor = (adesao) => {
        if (adesao >= 80) return 'bg-secondary';
        if (adesao >= 60) return 'bg-accent';
        return 'bg-destructive';
    };

    const getAdesaoTextColor = (adesao) => {
        if (adesao >= 80) return 'text-secondary-dark';
        if (adesao >= 60) return 'text-accent';
        return 'text-destructive';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                    <FileText className="mr-2 inline-block h-6 w-6 text-primary" />
                    Protocolos Clínicos
                </h1>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                        <Bot className="h-4 w-4" /> Análise IA
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                        <Printer className="h-4 w-4" /> Imprimir
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                        <Plus className="h-4 w-4" /> Novo Protocolo
                    </button>
                </div>
            </div>

            {/* AI Insights */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="bg-primary-light px-5 py-3 text-sm font-semibold text-white rounded-t-xl">
                    <Bot className="mr-1.5 inline-block h-4 w-4" /> Insights de IA - Protocolos Clínicos
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <div>
                            <h6 className="mb-1 font-semibold text-foreground">
                                Análise de Adesão aos Protocolos
                            </h6>
                            <p className="text-muted-foreground">
                                A IA analisou 1.245 atendimentos e identificou adesão média de 78% aos protocolos,
                                com variação significativa entre equipes (62% a 91%). Recomenda-se capacitação focada.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4 text-sm">
                            <h6 className="mb-1 flex items-center gap-1.5 font-semibold text-secondary-dark">
                                <CheckCircle className="h-4 w-4" /> Protocolos Mais Efetivos
                            </h6>
                            <p className="text-muted-foreground">
                                O protocolo de Hipertensão atualizado em janeiro/2025 está associado a melhoria de 23%
                                no controle pressórico quando seguido integralmente.
                            </p>
                        </div>
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                            <h6 className="mb-1 flex items-center gap-1.5 font-semibold text-amber-800">
                                <AlertTriangle className="h-4 w-4" /> Oportunidades de Melhoria
                            </h6>
                            <p className="text-amber-800">
                                Protocolo de Diabetes tem baixa adesão (58%). Sugere-se revisão para simplificação
                                de passos frequentemente omitidos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="p-5">
                    <h5 className="mb-4 text-base font-semibold text-foreground">Filtros</h5>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">Categoria</label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                            >
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">Origem</label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={filtroOrigem}
                                onChange={(e) => setFiltroOrigem(e.target.value)}
                            >
                                {origens.map(org => (
                                    <option key={org} value={org}>{org}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                            >
                                {statusOptions.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">Pesquisar</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Nome ou palavra-chave..."
                                    value={pesquisa}
                                    onChange={(e) => setPesquisa(e.target.value)}
                                />
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Protocols Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="px-5 pt-4 pb-2">
                    <h5 className="text-base font-semibold text-foreground">
                        Protocolos Clínicos ({protocolosFiltrados.length})
                    </h5>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-y border-border bg-muted/50">
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome do Protocolo</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoria</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Origem</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Atualização</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Adesão</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {protocolosFiltrados.map(protocolo => (
                                <tr key={protocolo.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-5 py-3">
                                        <span className="font-semibold text-foreground">{protocolo.nome}</span>
                                        <br />
                                        <span className="text-xs text-muted-foreground">{protocolo.descricao}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary-dark">
                                            {protocolo.categoria}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">{protocolo.origem}</td>
                                    <td className="px-5 py-3 text-muted-foreground">{protocolo.atualizacao}</td>
                                    <td className="px-5 py-3">{getStatusBadge(protocolo.status)}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className={cn(
                                                        'h-full rounded-full',
                                                        getAdesaoColor(protocolo.adesao)
                                                    )}
                                                    style={{ width: `${protocolo.adesao}%` }}
                                                />
                                            </div>
                                            <span className={cn('text-sm font-semibold', getAdesaoTextColor(protocolo.adesao))}>
                                                {protocolo.adesao}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-1">
                                            <button
                                                className="inline-flex items-center rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                                                onClick={() => setProtocoloSelecionado(protocolo)}
                                                title="Visualizar"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="inline-flex items-center rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                                                title="Editar"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="inline-flex items-center rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 border-t border-border px-5 py-3">
                    <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        disabled
                    >
                        Anterior
                    </button>
                    <button className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white">
                        1
                    </button>
                    <button className="inline-flex items-center rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">
                        2
                    </button>
                    <button className="inline-flex items-center rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">
                        3
                    </button>
                    <button className="inline-flex items-center rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">
                        Próximo
                    </button>
                </div>
            </div>

            {/* Protocol Detail Modal */}
            {protocoloSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setProtocoloSelecionado(null)}
                >
                    <div
                        className="w-[600px] max-w-[90%] max-h-[80vh] overflow-auto rounded-xl border border-border bg-card shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between rounded-t-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <span className="flex items-center gap-1.5">
                                <FileText className="h-4 w-4" /> {protocoloSelecionado.nome}
                            </span>
                            <button
                                className="inline-flex items-center rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white"
                                onClick={() => setProtocoloSelecionado(null)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-3 p-5">
                            <p className="text-sm text-foreground"><strong>Categoria:</strong> {protocoloSelecionado.categoria}</p>
                            <p className="text-sm text-foreground"><strong>Origem:</strong> {protocoloSelecionado.origem}</p>
                            <p className="text-sm text-foreground"><strong>Última Atualização:</strong> {protocoloSelecionado.atualizacao}</p>
                            <p className="text-sm text-foreground"><strong>Status:</strong> {getStatusBadge(protocoloSelecionado.status)}</p>
                            <p className="text-sm text-foreground"><strong>Taxa de Adesão:</strong> {protocoloSelecionado.adesao}%</p>
                            <hr className="border-border" />
                            <h6 className="text-sm font-semibold text-foreground">Descrição</h6>
                            <p className="text-sm text-muted-foreground">{protocoloSelecionado.descricao}</p>
                            <hr className="border-border" />
                            <h6 className="text-sm font-semibold text-foreground">Diretrizes Principais</h6>
                            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                                <li>Avaliação inicial completa do paciente</li>
                                <li>Exames laboratoriais conforme indicação</li>
                                <li>Tratamento baseado em evidências</li>
                                <li>Acompanhamento periódico programado</li>
                                <li>Educação em saúde para o paciente e família</li>
                            </ul>
                            <div className="flex justify-end gap-2 pt-2">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                                    <Download className="h-4 w-4" /> Baixar PDF
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                                    <Play className="h-4 w-4" /> Aplicar Protocolo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
