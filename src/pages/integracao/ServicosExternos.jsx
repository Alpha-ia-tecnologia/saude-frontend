import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Plug, RefreshCw, Plus, Eye, Settings, CheckCircle2, XCircle,
    AlertCircle, X, History, Save, Hospital, IdCard, FileText,
    ArrowRightLeft, FlaskConical, Pill, Ribbon, Syringe, Search
} from 'lucide-react';

// Icon map for services
const iconMap = {
    'fa-hospital': Hospital,
    'fa-id-card': IdCard,
    'fa-file-medical': FileText,
    'fa-exchange-alt': ArrowRightLeft,
    'fa-flask': FlaskConical,
    'fa-pills': Pill,
    'fa-ribbon': Ribbon,
    'fa-syringe': Syringe,
};

// External services data
const servicosData = [
    {
        id: 1,
        nome: 'e-SUS AB',
        descricao: 'Sistema de Atencao Basica do Ministerio da Saude',
        tipo: 'governo',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-26T10:30:00',
        registrosSincronizados: 12450,
        icone: 'fa-hospital',
        cor: 'bg-primary',
        endpoints: ['CDS', 'PEC', 'Relatorios'],
        credenciais: { usuario: 'ubs_centro', ativo: true }
    },
    {
        id: 2,
        nome: 'CADSUS Web',
        descricao: 'Cadastro Nacional de Usuarios do SUS',
        tipo: 'governo',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-26T09:15:00',
        registrosSincronizados: 3456,
        icone: 'fa-id-card',
        cor: 'bg-secondary',
        endpoints: ['Consulta CNS', 'Validacao', 'Atualizacao'],
        credenciais: { usuario: 'sistema_ubs', ativo: true }
    },
    {
        id: 3,
        nome: 'BPA - Boletim de Producao Ambulatorial',
        descricao: 'Sistema de faturamento ambulatorial SUS',
        tipo: 'governo',
        status: 'erro',
        ultimaSincronizacao: '2025-01-25T18:00:00',
        registrosSincronizados: 890,
        icone: 'fa-file-medical',
        cor: 'bg-destructive',
        endpoints: ['BPA-I', 'BPA-C'],
        credenciais: { usuario: 'faturamento', ativo: true },
        erro: 'Timeout na conexao. Ultima tentativa: 26/01 as 08:00'
    },
    {
        id: 4,
        nome: 'SISREG - Regulacao',
        descricao: 'Sistema de Regulacao de Vagas',
        tipo: 'governo',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-26T08:00:00',
        registrosSincronizados: 234,
        icone: 'fa-exchange-alt',
        cor: 'bg-accent',
        endpoints: ['Consulta Vagas', 'Agendamento', 'Regulacao'],
        credenciais: { usuario: 'regulacao_ubs', ativo: true }
    },
    {
        id: 5,
        nome: 'Laboratorio Municipal',
        descricao: 'Sistema de Resultados de Exames',
        tipo: 'parceiro',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-26T11:00:00',
        registrosSincronizados: 1567,
        icone: 'fa-flask',
        cor: 'bg-cyan-500',
        endpoints: ['Solicitacao', 'Resultados', 'Historico'],
        credenciais: { usuario: 'lab_integracao', ativo: true }
    },
    {
        id: 6,
        nome: 'Farmacia Popular',
        descricao: 'Programa Farmacia Popular do Brasil',
        tipo: 'governo',
        status: 'desconectado',
        ultimaSincronizacao: null,
        registrosSincronizados: 0,
        icone: 'fa-pills',
        cor: 'bg-gray-500',
        endpoints: ['Consulta', 'Dispensacao'],
        credenciais: { usuario: '', ativo: false }
    },
    {
        id: 7,
        nome: 'SISMAMA/SISCAN',
        descricao: 'Sistema de Informacao de Cancer',
        tipo: 'governo',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-25T14:30:00',
        registrosSincronizados: 89,
        icone: 'fa-ribbon',
        cor: 'bg-pink-500',
        endpoints: ['Mamografia', 'Citopatologico'],
        credenciais: { usuario: 'cancer_ubs', ativo: true }
    },
    {
        id: 8,
        nome: 'SIPNI - Vacinacao',
        descricao: 'Sistema de Informacao do PNI',
        tipo: 'governo',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-26T10:00:00',
        registrosSincronizados: 4523,
        icone: 'fa-syringe',
        cor: 'bg-emerald-500',
        endpoints: ['Registro', 'Consulta', 'Relatorios'],
        credenciais: { usuario: 'vacinacao_ubs', ativo: true }
    }
];

const estatisticas = {
    total: 8,
    conectados: 6,
    erro: 1,
    desconectados: 1,
    sincronizacoesHoje: 45
};

export default function ServicosExternos() {
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [servicoSelecionado, setServicoSelecionado] = useState(null);
    const [showConfigurar, setShowConfigurar] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [showNovaIntegracaoModal, setShowNovaIntegracaoModal] = useState(false);

    const servicosFiltrados = servicosData.filter(s => {
        const matchStatus = !filtroStatus || s.status === filtroStatus;
        const matchTipo = !filtroTipo || s.tipo === filtroTipo;
        return matchStatus && matchTipo;
    });

    const getStatusBadge = (status) => {
        const config = {
            conectado: { classes: 'bg-secondary/10 text-secondary', label: 'Conectado', Icon: CheckCircle2 },
            erro: { classes: 'bg-destructive/10 text-destructive', label: 'Erro', Icon: AlertCircle },
            desconectado: { classes: 'bg-gray-100 text-gray-500', label: 'Desconectado', Icon: XCircle }
        };
        const s = config[status] || config.desconectado;
        return (
            <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium', s.classes)}>
                <s.Icon className="h-3 w-3" />
                {s.label}
            </span>
        );
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'Nunca';
        const date = new Date(dateStr);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeSince = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 60) return `ha ${diffMins} min`;
        if (diffHours < 24) return `ha ${diffHours}h`;
        return `ha ${Math.floor(diffHours / 24)} dias`;
    };

    const ServiceIcon = ({ icone, className }) => {
        const IconComponent = iconMap[icone] || Hospital;
        return <IconComponent className={className} />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                    <Plug className="mr-2 inline-block h-6 w-6 text-primary" />
                    Servicos Externos
                </h1>
                <div className="flex gap-2">
                    <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted disabled:opacity-50"
                        disabled={isSyncing}
                        onClick={() => {
                            setIsSyncing(true);
                            setTimeout(() => {
                                setIsSyncing(false);
                                const totalRegistros = servicosData
                                    .filter(s => s.status === 'conectado')
                                    .reduce((acc, s) => acc + s.registrosSincronizados, 0);
                                alert(`Sincronizacao concluida! ${totalRegistros} registros atualizados.`);
                            }, 2000);
                        }}
                    >
                        <RefreshCw className={cn('h-4 w-4', isSyncing && 'animate-spin')} /> Sincronizar Todos
                    </button>
                    <button
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                        onClick={() => setShowNovaIntegracaoModal(true)}
                    >
                        <Plus className="h-4 w-4" /> Nova Integracao
                    </button>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-5 gap-4">
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-primary">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-primary">{estatisticas.total}</h2>
                        <small className="text-muted-foreground">Total de Servicos</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-secondary">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-secondary">{estatisticas.conectados}</h2>
                        <small className="text-muted-foreground">Conectados</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-destructive">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-destructive">{estatisticas.erro}</h2>
                        <small className="text-muted-foreground">Com Erro</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-gray-500">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-gray-500">{estatisticas.desconectados}</h2>
                        <small className="text-muted-foreground">Desconectados</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-accent">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-accent">{estatisticas.sincronizacoesHoje}</h2>
                        <small className="text-muted-foreground">Sincs. Hoje</small>
                    </div>
                </div>
            </div>

            {/* Alert for errors */}
            {estatisticas.erro > 0 && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span><strong>Atencao:</strong> {estatisticas.erro} servico(s) com erro de conexao. Verifique as configuracoes.</span>
                </div>
            )}

            {/* Filters */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
                        <select
                            className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="conectado">Conectados</option>
                            <option value="erro">Com Erro</option>
                            <option value="desconectado">Desconectados</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Tipo</label>
                        <select
                            className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="governo">Governo/SUS</option>
                            <option value="parceiro">Parceiros</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Pesquisar</label>
                        <input type="text" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Nome do servico..." />
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-4">
                {servicosFiltrados.map(servico => (
                    <div
                        key={servico.id}
                        className={cn(
                            'rounded-xl border border-border bg-card shadow-sm border-l-4',
                            servico.status === 'conectado' ? 'border-l-secondary' :
                                servico.status === 'erro' ? 'border-l-destructive' : 'border-l-gray-500'
                        )}
                    >
                        <div className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={cn(
                                        'flex h-[50px] w-[50px] items-center justify-center rounded-xl text-white',
                                        servico.cor
                                    )}>
                                        <ServiceIcon icone={servico.icone} className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold">{servico.nome}</h5>
                                        <small className="text-muted-foreground">{servico.descricao}</small>
                                    </div>
                                </div>
                                {getStatusBadge(servico.status)}
                            </div>

                            {servico.erro && (
                                <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {servico.erro}
                                </div>
                            )}

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <small className="text-muted-foreground">Ultima Sincronizacao</small>
                                    <p className="font-medium">
                                        {formatDateTime(servico.ultimaSincronizacao)}
                                        {servico.ultimaSincronizacao && (
                                            <small className="ml-2 text-muted-foreground">
                                                ({getTimeSince(servico.ultimaSincronizacao)})
                                            </small>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <small className="text-muted-foreground">Registros Sincronizados</small>
                                    <p className="font-medium">{servico.registrosSincronizados.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <small className="text-muted-foreground">Endpoints:</small>
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {servico.endpoints.map((ep, i) => (
                                        <span key={i} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-600">{ep}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                    onClick={() => setServicoSelecionado(servico)}
                                >
                                    <Eye className="h-3.5 w-3.5" /> Detalhes
                                </button>
                                {servico.status === 'conectado' && (
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-secondary/30 px-2.5 py-1.5 text-xs text-secondary hover:bg-secondary/5"
                                        onClick={() => alert(`Sincronizando ${servico.nome}...`)}
                                    >
                                        <RefreshCw className="h-3.5 w-3.5" /> Sincronizar
                                    </button>
                                )}
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                    onClick={() => {
                                        setServicoSelecionado(servico);
                                        setShowConfigurar(true);
                                    }}
                                >
                                    <Settings className="h-3.5 w-3.5" /> Configurar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {servicoSelecionado && !showConfigurar && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setServicoSelecionado(null)}
                >
                    <div
                        className="w-[700px] max-w-[90%] max-h-[80vh] overflow-auto rounded-xl border border-border bg-card shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={cn('flex items-center justify-between rounded-t-xl px-5 py-3 text-sm font-semibold text-white', servicoSelecionado.cor)}>
                            <span className="flex items-center gap-2">
                                <ServiceIcon icone={servicoSelecionado.icone} className="h-4 w-4" /> {servicoSelecionado.nome}
                            </span>
                            <button
                                className="rounded-lg bg-white/20 px-2 py-1 text-xs text-white hover:bg-white/30"
                                onClick={() => setServicoSelecionado(null)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="mb-4 flex gap-4">
                                {getStatusBadge(servicoSelecionado.status)}
                                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                    {servicoSelecionado.tipo === 'governo' ? 'Governo/SUS' : 'Parceiro'}
                                </span>
                            </div>

                            <p className="text-sm">{servicoSelecionado.descricao}</p>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                    <small className="text-muted-foreground">Registros Sincronizados</small>
                                    <h3 className="my-1 text-xl font-bold text-primary">
                                        {servicoSelecionado.registrosSincronizados.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                    <small className="text-muted-foreground">Ultima Sincronizacao</small>
                                    <h5 className="my-1 font-semibold">
                                        {formatDateTime(servicoSelecionado.ultimaSincronizacao)}
                                    </h5>
                                </div>
                            </div>

                            <h6 className="mt-4 font-semibold">Endpoints Disponiveis</h6>
                            <div className="mb-4 mt-1 flex flex-wrap gap-2">
                                {servicoSelecionado.endpoints.map((ep, i) => (
                                    <span key={i} className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{ep}</span>
                                ))}
                            </div>

                            <h6 className="font-semibold">Historico de Sincronizacoes</h6>
                            <table className="mt-2 w-full text-sm">
                                <thead className="border-b border-border bg-muted/50">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium">Data/Hora</th>
                                        <th className="px-3 py-2 text-left font-medium">Tipo</th>
                                        <th className="px-3 py-2 text-left font-medium">Registros</th>
                                        <th className="px-3 py-2 text-left font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr>
                                        <td className="px-3 py-2">26/01/2025 10:30</td>
                                        <td className="px-3 py-2">Automatica</td>
                                        <td className="px-3 py-2">+45</td>
                                        <td className="px-3 py-2"><span className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">Sucesso</span></td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2">26/01/2025 06:00</td>
                                        <td className="px-3 py-2">Automatica</td>
                                        <td className="px-3 py-2">+123</td>
                                        <td className="px-3 py-2"><span className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">Sucesso</span></td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2">25/01/2025 18:00</td>
                                        <td className="px-3 py-2">Manual</td>
                                        <td className="px-3 py-2">+67</td>
                                        <td className="px-3 py-2"><span className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">Sucesso</span></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-4 flex justify-end gap-2">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                                    <History className="h-4 w-4" /> Ver Logs
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-white hover:bg-secondary-dark">
                                    <RefreshCw className="h-4 w-4" /> Sincronizar Agora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Config Modal */}
            {servicoSelecionado && showConfigurar && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => {
                        setServicoSelecionado(null);
                        setShowConfigurar(false);
                    }}
                >
                    <div
                        className="w-[600px] max-w-[90%] rounded-xl border border-border bg-card shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between rounded-t-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <span><Settings className="mr-1.5 inline-block h-4 w-4" /> Configurar {servicoSelecionado.nome}</span>
                            <button
                                className="rounded-lg bg-white/20 px-2 py-1 text-xs text-white hover:bg-white/30"
                                onClick={() => {
                                    setServicoSelecionado(null);
                                    setShowConfigurar(false);
                                }}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-foreground">URL do Servico *</label>
                                <input
                                    type="text"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    defaultValue={`https://api.${servicoSelecionado.nome.toLowerCase().replace(/\s/g, '')}.gov.br`}
                                />
                            </div>
                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-foreground">Usuario</label>
                                    <input
                                        type="text"
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        defaultValue={servicoSelecionado.credenciais.usuario}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-foreground">Senha</label>
                                    <input type="password" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="••••••••" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Chave de API (se aplicavel)</label>
                                <input type="text" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Chave de autenticacao" />
                            </div>
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Intervalo de Sincronizacao</label>
                                <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option>A cada 15 minutos</option>
                                    <option>A cada 30 minutos</option>
                                    <option>A cada hora</option>
                                    <option>A cada 6 horas</option>
                                    <option>Diariamente</option>
                                    <option>Manual</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="ativo" defaultChecked={servicoSelecionado.credenciais.ativo} className="h-4 w-4 rounded border-input" />
                                    <label htmlFor="ativo" className="text-sm">Integracao Ativa</label>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300 px-3 py-2 text-sm text-cyan-600 hover:bg-cyan-50">
                                    <Plug className="h-4 w-4" /> Testar Conexao
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                        onClick={() => {
                                            setServicoSelecionado(null);
                                            setShowConfigurar(false);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                                        <Save className="h-4 w-4" /> Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Nova Integracao Modal */}
            {showNovaIntegracaoModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowNovaIntegracaoModal(false)}
                >
                    <div
                        className="w-[600px] max-w-[90%] max-h-[80vh] overflow-auto rounded-xl border border-border bg-card shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between rounded-t-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <span><Plus className="mr-1.5 inline-block h-4 w-4" /> Nova Integracao</span>
                            <button
                                className="rounded-lg bg-white/20 px-2 py-1 text-xs text-white hover:bg-white/30"
                                onClick={() => setShowNovaIntegracaoModal(false)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Nome do Servico *</label>
                                <input
                                    type="text"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Ex: e-SUS AB"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Descricao</label>
                                <input
                                    type="text"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Descricao do servico"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Tipo *</label>
                                <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="">Selecione o tipo</option>
                                    <option value="governo">Governo/SUS</option>
                                    <option value="parceiro">Parceiro</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-foreground">URL do Servico *</label>
                                <input
                                    type="text"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="https://api.exemplo.gov.br"
                                />
                            </div>
                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-foreground">Usuario *</label>
                                    <input
                                        type="text"
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Nome de usuario"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-foreground">Senha *</label>
                                    <input
                                        type="password"
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Chave de API (opcional)</label>
                                <input
                                    type="text"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Chave de autenticacao"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Intervalo de Sincronizacao</label>
                                <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="15">A cada 15 minutos</option>
                                    <option value="30">A cada 30 minutos</option>
                                    <option value="60">A cada hora</option>
                                    <option value="360">A cada 6 horas</option>
                                    <option value="1440">Diariamente</option>
                                    <option value="manual">Manual</option>
                                </select>
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                    onClick={() => setShowNovaIntegracaoModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                                    onClick={() => {
                                        alert('Integracao criada com sucesso!');
                                        setShowNovaIntegracaoModal(false);
                                    }}
                                >
                                    <Save className="h-4 w-4" /> Salvar Integracao
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
