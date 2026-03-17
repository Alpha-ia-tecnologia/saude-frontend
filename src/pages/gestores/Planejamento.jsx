import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import {
    Target, FileText, Plus, X, Pencil, ListChecks, AlertTriangle,
    CalendarDays, CheckCircle2, Clock, Activity, ChevronRight
} from 'lucide-react';

// Strategic objectives data
const objetivosEstrategicos = [
    {
        id: 1,
        titulo: 'Ampliar Cobertura da Atenção Básica',
        descricao: 'Aumentar a cobertura populacional da atenção básica para 85% até 2026',
        progresso: 72,
        prazo: '2026-12-31',
        status: 'em_andamento',
        responsavel: 'Coord. Atenção Básica',
        prioridade: 'alta'
    },
    {
        id: 2,
        titulo: 'Reduzir Mortalidade Infantil',
        descricao: 'Reduzir a taxa de mortalidade infantil para menos de 10/1000 nascidos vivos',
        progresso: 85,
        prazo: '2025-12-31',
        status: 'em_andamento',
        responsavel: 'Coord. Saúde da Criança',
        prioridade: 'alta'
    },
    {
        id: 3,
        titulo: 'Implementar Prontuário Eletrônico',
        descricao: 'Implantar PEP em 100% das unidades de saúde',
        progresso: 95,
        prazo: '2025-06-30',
        status: 'em_andamento',
        responsavel: 'TI/Informática',
        prioridade: 'media'
    },
    {
        id: 4,
        titulo: 'Qualificar Equipes de Saúde',
        descricao: 'Capacitar 100% dos profissionais em protocolos clínicos atualizados',
        progresso: 45,
        prazo: '2025-12-31',
        status: 'em_andamento',
        responsavel: 'Educação Permanente',
        prioridade: 'media'
    },
    {
        id: 5,
        titulo: 'Modernizar Infraestrutura',
        descricao: 'Reformar e adequar 5 unidades básicas de saúde',
        progresso: 20,
        prazo: '2026-06-30',
        status: 'planejado',
        responsavel: 'Coord. Administrativa',
        prioridade: 'baixa'
    }
];

// Action plans
const planosAcao = [
    { id: 1, objetivo: 1, acao: 'Contratar 10 novos ACS', prazo: '2025-03-31', status: 'em_andamento', progresso: 60 },
    { id: 2, objetivo: 1, acao: 'Ampliar horário de funcionamento UBS Centro', prazo: '2025-02-28', status: 'concluido', progresso: 100 },
    { id: 3, objetivo: 2, acao: 'Implementar busca ativa de gestantes', prazo: '2025-04-30', status: 'em_andamento', progresso: 75 },
    { id: 4, objetivo: 3, acao: 'Treinamento de usuários do PEP', prazo: '2025-03-15', status: 'em_andamento', progresso: 80 },
    { id: 5, objetivo: 4, acao: 'Curso de atualização em diabetes', prazo: '2025-02-28', status: 'planejado', progresso: 0 }
];

// Risk matrix
const riscosIdentificados = [
    { id: 1, descricao: 'Corte orçamentário federal', probabilidade: 'alta', impacto: 'alto', mitigacao: 'Buscar parcerias e recursos alternativos' },
    { id: 2, descricao: 'Rotatividade de profissionais', probabilidade: 'media', impacto: 'alto', mitigacao: 'Plano de carreira e valorização' },
    { id: 3, descricao: 'Resistência à mudança tecnológica', probabilidade: 'media', impacto: 'medio', mitigacao: 'Capacitação e suporte contínuo' },
    { id: 4, descricao: 'Surto epidêmico', probabilidade: 'baixa', impacto: 'alto', mitigacao: 'Plano de contingência ativo' }
];

const statusConfig = {
    em_andamento: { className: 'bg-primary/10 text-primary', label: 'Em Andamento' },
    concluido: { className: 'bg-secondary/10 text-secondary', label: 'Concluído' },
    planejado: { className: 'bg-muted text-muted-foreground', label: 'Planejado' },
    atrasado: { className: 'bg-destructive/10 text-destructive', label: 'Atrasado' }
};

const prioridadeConfig = {
    alta: { className: 'bg-destructive/10 text-destructive', label: 'Alta' },
    media: { className: 'bg-accent/10 text-accent-foreground', label: 'Média' },
    baixa: { className: 'bg-muted text-muted-foreground', label: 'Baixa' }
};

function getRiscoClasses(nivel) {
    if (nivel === 'alto' || nivel === 'alta') return 'bg-destructive text-destructive-foreground';
    if (nivel === 'medio' || nivel === 'media') return 'bg-accent text-accent-foreground';
    return 'bg-secondary text-secondary-foreground';
}

function getProgressBarColor(progresso) {
    if (progresso >= 80) return 'bg-secondary';
    if (progresso >= 50) return 'bg-primary';
    return 'bg-accent';
}

function getBorderColor(prioridade) {
    if (prioridade === 'alta') return 'border-l-destructive';
    if (prioridade === 'media') return 'border-l-accent';
    return 'border-l-secondary';
}

export default function Planejamento() {
    const [abaAtiva, setAbaAtiva] = useState('objetivos');
    const [objetivoSelecionado, setObjetivoSelecionado] = useState(null);
    const [showNovoModal, setShowNovoModal] = useState(false);
    const [novoObjetivo, setNovoObjetivo] = useState({
        titulo: '', descricao: '', prazo: '', responsavel: '', prioridade: 'media', status: 'planejado'
    });

    const getStatusBadge = (status) => {
        const s = statusConfig[status] || statusConfig.planejado;
        return (
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', s.className)}>
                {s.label}
            </span>
        );
    };

    const getPrioridadeBadge = (prioridade) => {
        const p = prioridadeConfig[prioridade] || prioridadeConfig.media;
        return (
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', p.className)}>
                {p.label}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    const calcularResumo = () => {
        const total = objetivosEstrategicos.length;
        const concluidos = objetivosEstrategicos.filter(o => o.progresso === 100).length;
        const emAndamento = objetivosEstrategicos.filter(o => o.progresso > 0 && o.progresso < 100).length;
        const mediaProgresso = objetivosEstrategicos.reduce((acc, o) => acc + o.progresso, 0) / total;
        return { total, concluidos, emAndamento, mediaProgresso: mediaProgresso.toFixed(0) };
    };

    const resumo = calcularResumo();

    const exportarPMS = () => {
        const linhas = [
            ['Titulo', 'Descricao', 'Progresso (%)', 'Prazo', 'Status', 'Responsavel', 'Prioridade']
        ];
        objetivosEstrategicos.forEach(obj => {
            linhas.push([
                obj.titulo,
                obj.descricao,
                obj.progresso,
                obj.prazo,
                statusConfig[obj.status]?.label || obj.status,
                obj.responsavel,
                prioridadeConfig[obj.prioridade]?.label || obj.prioridade
            ]);
        });
        const csv = linhas.map(l => l.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'plano_municipal_saude.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleSalvarObjetivo = () => {
        alert('Objetivo criado com sucesso!');
        setShowNovoModal(false);
        setNovoObjetivo({ titulo: '', descricao: '', prazo: '', responsavel: '', prioridade: 'media', status: 'planejado' });
    };

    const tabs = [
        { key: 'objetivos', label: 'Objetivos Estratégicos', icon: Target },
        { key: 'acoes', label: 'Planos de Ação', icon: ListChecks },
        { key: 'riscos', label: 'Matriz de Riscos', icon: AlertTriangle },
        { key: 'cronograma', label: 'Cronograma', icon: CalendarDays },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="m-0 text-2xl font-bold text-foreground">
                        <Target className="mr-2 inline-block size-6 text-primary" />
                        Planejamento Estratégico
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Plano Municipal de Saúde 2022-2025</p>
                </div>
                <div className="flex gap-2">
                    <button
                        className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                        onClick={exportarPMS}
                    >
                        <FileText className="size-4" /> Exportar PMS
                    </button>
                    <button
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark"
                        onClick={() => setShowNovoModal(true)}
                    >
                        <Plus className="size-4" /> Novo Objetivo
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border border-t-4 border-t-primary bg-card shadow-sm">
                    <div className="p-5 text-center">
                        <h2 className="m-0 text-3xl font-bold text-primary">{resumo.total}</h2>
                        <small className="text-muted-foreground">Objetivos Estratégicos</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border border-t-4 border-t-secondary bg-card shadow-sm">
                    <div className="p-5 text-center">
                        <h2 className="m-0 text-3xl font-bold text-secondary">{resumo.concluidos}</h2>
                        <small className="text-muted-foreground">Concluídos</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border border-t-4 border-t-cyan-500 bg-card shadow-sm">
                    <div className="p-5 text-center">
                        <h2 className="m-0 text-3xl font-bold text-cyan-500">{resumo.emAndamento}</h2>
                        <small className="text-muted-foreground">Em Andamento</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border border-t-4 border-t-accent bg-card shadow-sm">
                    <div className="p-5 text-center">
                        <h2 className="m-0 text-3xl font-bold text-accent">{resumo.mediaProgresso}%</h2>
                        <small className="text-muted-foreground">Progresso Médio</small>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Card className="p-2">
                <div className="flex gap-2">
                    {tabs.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                                abaAtiva === key
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                            onClick={() => setAbaAtiva(key)}
                        >
                            <Icon className="size-4" /> {label}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Objetivos Tab */}
            {abaAtiva === 'objetivos' && (
                <div className="flex flex-col gap-4">
                    {objetivosEstrategicos.map(obj => (
                        <div
                            key={obj.id}
                            className={cn(
                                'rounded-xl border border-border border-l-4 bg-card shadow-sm',
                                getBorderColor(obj.prioridade)
                            )}
                        >
                            <div className="p-5">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <h5 className="m-0 text-base font-semibold text-foreground">{obj.titulo}</h5>
                                        <p className="mt-1 text-sm text-muted-foreground">{obj.descricao}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {getPrioridadeBadge(obj.prioridade)}
                                        {getStatusBadge(obj.status)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-[2fr_1fr_1fr] items-center gap-4">
                                    <div>
                                        <div className="mb-1 flex justify-between">
                                            <small className="text-muted-foreground">Progresso</small>
                                            <strong className="text-sm">{obj.progresso}%</strong>
                                        </div>
                                        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className={cn('h-full rounded-full transition-all', getProgressBarColor(obj.progresso))}
                                                style={{ width: `${obj.progresso}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <small className="text-muted-foreground">Prazo</small>
                                        <p className="m-0 font-semibold">{formatDate(obj.prazo)}</p>
                                    </div>
                                    <div>
                                        <small className="text-muted-foreground">Responsável</small>
                                        <p className="m-0 font-semibold">{obj.responsavel}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                        <Pencil className="size-3.5" /> Editar
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                                        onClick={() => setObjetivoSelecionado(obj)}
                                    >
                                        <ListChecks className="size-3.5" /> Ver Ações
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ações Tab */}
            {abaAtiva === 'acoes' && (
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-3">
                        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <ListChecks className="size-4" /> Planos de Ação
                        </span>
                        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-dark">
                            <Plus className="size-3.5" /> Nova Ação
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-4 py-3 text-left font-semibold text-foreground">Ação</th>
                                    <th className="px-4 py-3 text-left font-semibold text-foreground">Objetivo</th>
                                    <th className="px-4 py-3 text-left font-semibold text-foreground">Prazo</th>
                                    <th className="px-4 py-3 text-left font-semibold text-foreground">Progresso</th>
                                    <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-foreground">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {planosAcao.map(acao => {
                                    const objetivo = objetivosEstrategicos.find(o => o.id === acao.objetivo);
                                    return (
                                        <tr key={acao.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                                            <td className="px-4 py-3 font-semibold">{acao.acao}</td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">{objetivo?.titulo}</td>
                                            <td className="px-4 py-3">{formatDate(acao.prazo)}</td>
                                            <td className="w-[150px] px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-primary transition-all"
                                                            style={{ width: `${acao.progresso}%` }}
                                                        />
                                                    </div>
                                                    <small className="text-xs text-muted-foreground">{acao.progresso}%</small>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{getStatusBadge(acao.status)}</td>
                                            <td className="px-4 py-3">
                                                <button className="inline-flex items-center rounded-lg border border-primary p-1.5 text-primary transition-colors hover:bg-primary/5">
                                                    <Pencil className="size-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Riscos Tab */}
            {abaAtiva === 'riscos' && (
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-2 border-b border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground">
                        <AlertTriangle className="size-4" /> Matriz de Riscos
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-4 py-3 text-left font-semibold text-foreground">Risco Identificado</th>
                                    <th className="px-4 py-3 text-center font-semibold text-foreground">Probabilidade</th>
                                    <th className="px-4 py-3 text-center font-semibold text-foreground">Impacto</th>
                                    <th className="px-4 py-3 text-left font-semibold text-foreground">Ação de Mitigação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {riscosIdentificados.map(risco => (
                                    <tr key={risco.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                                        <td className="px-4 py-3 font-semibold">{risco.descricao}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={cn(
                                                'inline-block rounded px-2 py-1 text-xs font-medium',
                                                getRiscoClasses(risco.probabilidade)
                                            )}>
                                                {risco.probabilidade.charAt(0).toUpperCase() + risco.probabilidade.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={cn(
                                                'inline-block rounded px-2 py-1 text-xs font-medium',
                                                getRiscoClasses(risco.impacto)
                                            )}>
                                                {risco.impacto.charAt(0).toUpperCase() + risco.impacto.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{risco.mitigacao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Cronograma Tab */}
            {abaAtiva === 'cronograma' && (
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-2 border-b border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground">
                        <CalendarDays className="size-4" /> Cronograma Geral
                    </div>
                    <div className="p-5">
                        <div className="overflow-x-auto">
                            <div className="mb-4 flex gap-px">
                                <div className="w-[200px] shrink-0" />
                                {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((mes, i) => (
                                    <div key={i} className="min-w-[60px] flex-1 bg-muted px-2 py-2 text-center text-xs font-semibold text-foreground">
                                        {mes}
                                    </div>
                                ))}
                            </div>
                            {objetivosEstrategicos.map((obj) => {
                                const prazoMes = new Date(obj.prazo).getMonth();
                                return (
                                    <div key={obj.id} className="mb-2 flex gap-px">
                                        <div className="w-[200px] shrink-0 truncate px-2 py-1.5 text-xs font-medium text-foreground">
                                            {obj.titulo.substring(0, 30)}...
                                        </div>
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(mes => {
                                            const isActive = mes <= prazoMes;
                                            const isCompleted = mes <= prazoMes * (obj.progresso / 100);
                                            return (
                                                <div
                                                    key={mes}
                                                    className={cn(
                                                        'h-[30px] min-w-[60px] flex-1',
                                                        isActive ? getProgressBarColor(obj.progresso) : 'bg-muted',
                                                        isActive && !isCompleted && 'opacity-40',
                                                        mes === 0 && 'rounded-l',
                                                        mes === prazoMes && 'rounded-r'
                                                    )}
                                                />
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Novo Objetivo Modal */}
            {showNovoModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowNovoModal(false)}
                >
                    <div
                        className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between rounded-t-xl bg-primary px-5 py-3 text-primary-foreground">
                            <span className="flex items-center gap-2 text-sm font-semibold">
                                <Plus className="size-4" /> Novo Objetivo Estratégico
                            </span>
                            <button
                                className="rounded-lg bg-white/20 p-1.5 text-primary-foreground transition-colors hover:bg-white/30"
                                onClick={() => setShowNovoModal(false)}
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Título</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Título do objetivo"
                                    value={novoObjetivo.titulo}
                                    onChange={(e) => setNovoObjetivo({ ...novoObjetivo, titulo: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Descrição</label>
                                <textarea
                                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    rows={3}
                                    placeholder="Descreva o objetivo estratégico"
                                    value={novoObjetivo.descricao}
                                    onChange={(e) => setNovoObjetivo({ ...novoObjetivo, descricao: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Prazo</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={novoObjetivo.prazo}
                                        onChange={(e) => setNovoObjetivo({ ...novoObjetivo, prazo: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Responsável</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="Nome do responsável"
                                        value={novoObjetivo.responsavel}
                                        onChange={(e) => setNovoObjetivo({ ...novoObjetivo, responsavel: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Prioridade</label>
                                    <select
                                        className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={novoObjetivo.prioridade}
                                        onChange={(e) => setNovoObjetivo({ ...novoObjetivo, prioridade: e.target.value })}
                                    >
                                        <option value="alta">Alta</option>
                                        <option value="media">Média</option>
                                        <option value="baixa">Baixa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
                                    <select
                                        className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={novoObjetivo.status}
                                        onChange={(e) => setNovoObjetivo({ ...novoObjetivo, status: e.target.value })}
                                    >
                                        <option value="planejado">Planejado</option>
                                        <option value="em_andamento">Em Andamento</option>
                                        <option value="concluido">Concluído</option>
                                        <option value="atrasado">Atrasado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    onClick={() => setShowNovoModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark"
                                    onClick={handleSalvarObjetivo}
                                >
                                    <CheckCircle2 className="size-4" /> Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Objetivo Detail Modal */}
            {objetivoSelecionado && (
                <div
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
                    onClick={() => setObjetivoSelecionado(null)}
                >
                    <div
                        className="max-h-[80vh] w-[700px] max-w-[90%] overflow-auto rounded-xl border border-border bg-card shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between rounded-t-xl bg-primary px-5 py-3 text-primary-foreground">
                            <span className="flex items-center gap-2 text-sm font-semibold">
                                <Target className="size-4" /> {objetivoSelecionado.titulo}
                            </span>
                            <button
                                className="rounded-lg bg-white/20 p-1.5 text-primary-foreground transition-colors hover:bg-white/30"
                                onClick={() => setObjetivoSelecionado(null)}
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                        <div className="p-5">
                            <p className="mb-4 text-sm text-muted-foreground">{objetivoSelecionado.descricao}</p>

                            <div className="mb-6 grid grid-cols-3 gap-4">
                                <div className="rounded-xl bg-muted p-4 text-center">
                                    <small className="text-muted-foreground">Progresso</small>
                                    <h3 className="my-1 text-2xl font-bold">{objetivoSelecionado.progresso}%</h3>
                                </div>
                                <div className="rounded-xl bg-muted p-4 text-center">
                                    <small className="text-muted-foreground">Prazo</small>
                                    <h5 className="my-1 text-base font-semibold">{formatDate(objetivoSelecionado.prazo)}</h5>
                                </div>
                                <div className="rounded-xl bg-muted p-4 text-center">
                                    <small className="text-muted-foreground">Prioridade</small>
                                    <div className="mt-1">{getPrioridadeBadge(objetivoSelecionado.prioridade)}</div>
                                </div>
                            </div>

                            <h6 className="mb-3 text-sm font-semibold text-foreground">Ações Vinculadas</h6>
                            <div className="overflow-hidden rounded-lg border border-border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50">
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Ação</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Prazo</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Progresso</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {planosAcao.filter(a => a.objetivo === objetivoSelecionado.id).map(acao => (
                                            <tr key={acao.id} className="border-b border-border last:border-b-0">
                                                <td className="px-4 py-2">{acao.acao}</td>
                                                <td className="px-4 py-2">{formatDate(acao.prazo)}</td>
                                                <td className="px-4 py-2">{acao.progresso}%</td>
                                                <td className="px-4 py-2">{getStatusBadge(acao.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                    <Pencil className="size-4" /> Editar Objetivo
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark">
                                    <Plus className="size-4" /> Adicionar Ação
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
