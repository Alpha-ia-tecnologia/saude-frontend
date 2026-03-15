import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import {
    Users, CheckCircle, Umbrella, FileText, PieChart,
    GraduationCap, IdCard, Eye, X, Pencil, CalendarDays, Search,
    Hospital, Plus, User, ClipboardList
} from 'lucide-react';

/** Donut chart rendered via an inline <style> to avoid style={{}} props */
function DonutChart({ gradient, total }) {
    const id = 'donut-chart';
    return (
        <>
            <style>{`#${id}{background:${gradient}}`}</style>
            <div id={id} className="flex size-[200px] items-center justify-center rounded-full">
                <div className="flex size-[120px] flex-col items-center justify-center rounded-full bg-white">
                    <strong className="text-2xl">{total}</strong>
                    <small className="text-muted-foreground">Total</small>
                </div>
            </div>
        </>
    );
}

/** Progress bar that sets width via an inline <style> tag to avoid style={{}} */
function ProgressBar({ id, percent }) {
    return (
        <>
            <style>{`#${id}{width:${percent}%}`}</style>
            <div className="h-2 w-full rounded-full bg-muted">
                <div id={id} className="h-full rounded-full bg-primary transition-all" />
            </div>
        </>
    );
}

// Staff data
const funcionariosData = [
    { id: 1, nome: 'Dr. Carlos Oliveira', cargo: 'Médico Clínico Geral', unidade: 'UBS Centro', status: 'ativo', cargaHoraria: 40, admissao: '2020-03-15', vinculo: 'Efetivo' },
    { id: 2, nome: 'Dra. Ana Santos', cargo: 'Médica de Família', unidade: 'UBS Norte', status: 'ativo', cargaHoraria: 40, admissao: '2019-08-01', vinculo: 'Efetivo' },
    { id: 3, nome: 'Enf. Maria Lima', cargo: 'Enfermeira', unidade: 'UBS Centro', status: 'ativo', cargaHoraria: 40, admissao: '2018-02-10', vinculo: 'Efetivo' },
    { id: 4, nome: 'Tec. João Silva', cargo: 'Técnico de Enfermagem', unidade: 'UBS Sul', status: 'ferias', cargaHoraria: 40, admissao: '2021-06-20', vinculo: 'Efetivo' },
    { id: 5, nome: 'Dr. Paulo Lima', cargo: 'Dentista', unidade: 'UBS Centro', status: 'ativo', cargaHoraria: 20, admissao: '2022-01-05', vinculo: 'Contratado' },
    { id: 6, nome: 'ACS Francisca Moura', cargo: 'Agente Comunitário', unidade: 'UBS Norte', status: 'licenca', cargaHoraria: 40, admissao: '2017-04-12', vinculo: 'Efetivo' },
    { id: 7, nome: 'Farm. Roberto Costa', cargo: 'Farmacêutico', unidade: 'UBS Centro', status: 'ativo', cargaHoraria: 40, admissao: '2020-11-03', vinculo: 'Efetivo' },
    { id: 8, nome: 'Psic. Laura Ferreira', cargo: 'Psicóloga', unidade: 'NASF', status: 'ativo', cargaHoraria: 30, admissao: '2021-09-15', vinculo: 'Contratado' }
];

// Statistics
const estatisticas = {
    totalFuncionarios: 156,
    ativos: 142,
    ferias: 8,
    licenca: 6,
    medicos: 24,
    enfermeiros: 18,
    tecnicos: 45,
    acs: 52,
    administrativo: 12,
    outros: 5
};

// Categories for the pie chart
const distribuicaoCargos = [
    { cargo: 'Médicos', quantidade: 24, cor: 'bg-primary' },
    { cargo: 'Enfermeiros', quantidade: 18, cor: 'bg-secondary' },
    { cargo: 'Téc. Enfermagem', quantidade: 45, cor: 'bg-accent' },
    { cargo: 'ACS', quantidade: 52, cor: 'bg-cyan-500' },
    { cargo: 'Administrativo', quantidade: 12, cor: 'bg-gray-500' },
    { cargo: 'Outros', quantidade: 5, cor: 'bg-pink-500' }
];

// Conic gradient colors for the donut chart (raw hex values needed for conic-gradient)
const conicColors = ['#0054A6', '#00A651', '#f59e0b', '#06b6d4', '#6b7280', '#ec4899'];

// Distribution by unit (stable random data, moved outside component)
const unidadesData = ['UBS Centro', 'UBS Norte', 'UBS Sul', 'UBS Leste', 'NASF'].map((unidade, i) => ({
    nome: unidade,
    quantidade: [38, 31, 27, 44, 29][i]
}));

// Training data
const capacitacoes = [
    { nome: 'Atualização em Diabetes', data: '2025-02-10', participantes: 45, status: 'agendada' },
    { nome: 'Manejo de Hipertensão', data: '2025-01-20', participantes: 38, status: 'concluida' },
    { nome: 'Saúde Mental na AB', data: '2025-03-05', participantes: 0, status: 'planejada' }
];

export default function RecursosHumanos() {
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroUnidade, setFiltroUnidade] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
    const [abaAtiva, setAbaAtiva] = useState('funcionarios');

    const funcionariosFiltrados = funcionariosData.filter(f => {
        const matchStatus = !filtroStatus || f.status === filtroStatus;
        const matchUnidade = !filtroUnidade || f.unidade === filtroUnidade;
        const matchPesquisa = !pesquisa ||
            f.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
            f.cargo.toLowerCase().includes(pesquisa.toLowerCase());
        return matchStatus && matchUnidade && matchPesquisa;
    });

    const getStatusBadge = (status) => {
        const config = {
            ativo: { classes: 'bg-secondary/10 text-secondary', label: 'Ativo' },
            ferias: { classes: 'bg-cyan-100 text-cyan-700', label: 'Férias' },
            licenca: { classes: 'bg-accent/10 text-accent', label: 'Licença' },
            afastado: { classes: 'bg-destructive/10 text-destructive', label: 'Afastado' }
        };
        const s = config[status] || config.ativo;
        return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', s.classes)}>{s.label}</span>;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    const totalFuncionarios = distribuicaoCargos.reduce((acc, c) => acc + c.quantidade, 0);

    // Build conic gradient string for the donut chart
    const conicGradient = (() => {
        let currentDeg = 0;
        const segments = distribuicaoCargos.map((c, i) => {
            const startDeg = currentDeg;
            const endDeg = currentDeg + (c.quantidade / totalFuncionarios) * 360;
            currentDeg = endDeg;
            return `${conicColors[i]} ${startDeg}deg ${endDeg}deg`;
        });
        return `conic-gradient(${segments.join(', ')})`;
    })();

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="m-0 flex items-center gap-2 text-2xl font-bold">
                        <Users className="size-7 text-primary" />
                        Recursos Humanos
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Gestão de pessoal e capacitação</p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5">
                        <FileText className="size-4" /> Exportar
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark">
                        <Plus className="size-4" /> Novo Funcionário
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gradient-to-br from-primary to-primary-light p-5 text-white shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <Users className="mb-2 size-8 opacity-80" />
                        <h2 className="my-1 text-3xl font-bold">{estatisticas.totalFuncionarios}</h2>
                        <small className="text-sm opacity-90">Total de Funcionários</small>
                    </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-secondary to-emerald-400 p-5 text-white shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <CheckCircle className="mb-2 size-8 opacity-80" />
                        <h2 className="my-1 text-3xl font-bold">{estatisticas.ativos}</h2>
                        <small className="text-sm opacity-90">Ativos</small>
                    </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-5 text-white shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <Umbrella className="mb-2 size-8 opacity-80" />
                        <h2 className="my-1 text-3xl font-bold">{estatisticas.ferias}</h2>
                        <small className="text-sm opacity-90">Em Férias</small>
                    </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-accent to-orange-500 p-5 text-white shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <ClipboardList className="mb-2 size-8 opacity-80" />
                        <h2 className="my-1 text-3xl font-bold">{estatisticas.licenca}</h2>
                        <small className="text-sm opacity-90">Em Licença</small>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Card className="mb-6">
                <div className="flex gap-2">
                    <button
                        className={cn(
                            'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            abaAtiva === 'funcionarios'
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border text-foreground hover:bg-muted'
                        )}
                        onClick={() => setAbaAtiva('funcionarios')}
                    >
                        <IdCard className="size-4" /> Funcionários
                    </button>
                    <button
                        className={cn(
                            'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            abaAtiva === 'distribuicao'
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border text-foreground hover:bg-muted'
                        )}
                        onClick={() => setAbaAtiva('distribuicao')}
                    >
                        <PieChart className="size-4" /> Distribuição
                    </button>
                    <button
                        className={cn(
                            'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            abaAtiva === 'capacitacao'
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border text-foreground hover:bg-muted'
                        )}
                        onClick={() => setAbaAtiva('capacitacao')}
                    >
                        <GraduationCap className="size-4" /> Capacitação
                    </button>
                </div>
            </Card>

            {/* Funcionários Tab */}
            {abaAtiva === 'funcionarios' && (
                <>
                    {/* Filters */}
                    <Card className="mb-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
                                <select
                                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={filtroStatus}
                                    onChange={(e) => setFiltroStatus(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    <option value="ativo">Ativo</option>
                                    <option value="ferias">Férias</option>
                                    <option value="licenca">Licença</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Unidade</label>
                                <select
                                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={filtroUnidade}
                                    onChange={(e) => setFiltroUnidade(e.target.value)}
                                >
                                    <option value="">Todas</option>
                                    <option value="UBS Centro">UBS Centro</option>
                                    <option value="UBS Norte">UBS Norte</option>
                                    <option value="UBS Sul">UBS Sul</option>
                                    <option value="NASF">NASF</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-foreground">Pesquisar</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-input bg-card py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="Nome ou cargo..."
                                        value={pesquisa}
                                        onChange={(e) => setPesquisa(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Staff Table */}
                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="px-4 py-3 text-left font-semibold text-foreground">Funcionário</th>
                                        <th className="px-4 py-3 text-left font-semibold text-foreground">Cargo</th>
                                        <th className="px-4 py-3 text-left font-semibold text-foreground">Unidade</th>
                                        <th className="px-4 py-3 text-left font-semibold text-foreground">CH</th>
                                        <th className="px-4 py-3 text-left font-semibold text-foreground">Vínculo</th>
                                        <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                                        <th className="px-4 py-3 text-left font-semibold text-foreground">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {funcionariosFiltrados.map(f => (
                                        <tr key={f.id} className="border-b border-border transition-colors hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                                                        {f.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                                    </div>
                                                    <strong className="text-foreground">{f.nome}</strong>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-foreground">{f.cargo}</td>
                                            <td className="px-4 py-3 text-foreground">{f.unidade}</td>
                                            <td className="px-4 py-3 text-foreground">{f.cargaHoraria}h</td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                    f.vinculo === 'Efetivo'
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'bg-muted text-muted-foreground'
                                                )}>
                                                    {f.vinculo}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{getStatusBadge(f.status)}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    className="inline-flex items-center justify-center rounded-lg border border-primary/30 p-2 text-primary transition-colors hover:bg-primary/5"
                                                    onClick={() => setFuncionarioSelecionado(f)}
                                                >
                                                    <Eye className="size-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Distribuição Tab */}
            {abaAtiva === 'distribuicao' && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card
                        header={
                            <span className="flex items-center gap-2">
                                <PieChart className="size-4" /> Distribuição por Cargo
                            </span>
                        }
                        headerClassName="bg-muted/50"
                    >
                        <div className="mb-6 flex justify-center">
                            <DonutChart gradient={conicGradient} total={totalFuncionarios} />
                        </div>
                        {distribuicaoCargos.map((c, i) => (
                            <div key={i} className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn('size-3 rounded-sm', c.cor)} />
                                    <span className="text-sm text-foreground">{c.cargo}</span>
                                </div>
                                <strong className="text-sm">{c.quantidade} ({((c.quantidade / totalFuncionarios) * 100).toFixed(0)}%)</strong>
                            </div>
                        ))}
                    </Card>

                    <Card
                        header={
                            <span className="flex items-center gap-2">
                                <Hospital className="size-4" /> Distribuição por Unidade
                            </span>
                        }
                        headerClassName="bg-muted/50"
                    >
                        {unidadesData.map((u, i) => (
                            <div key={i} className="mb-4">
                                <div className="mb-1 flex justify-between">
                                    <span className="text-sm text-foreground">{u.nome}</span>
                                    <strong className="text-sm">{u.quantidade}</strong>
                                </div>
                                <ProgressBar id={`bar-unidade-${i}`} percent={(u.quantidade / 50) * 100} />
                            </div>
                        ))}
                    </Card>
                </div>
            )}

            {/* Capacitação Tab */}
            {abaAtiva === 'capacitacao' && (
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border bg-muted/50 px-5 py-3">
                        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <GraduationCap className="size-4" /> Capacitações
                        </span>
                        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-dark">
                            <Plus className="size-3.5" /> Nova Capacitação
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-5 py-3 text-left font-semibold text-foreground">Capacitação</th>
                                    <th className="px-5 py-3 text-left font-semibold text-foreground">Data</th>
                                    <th className="px-5 py-3 text-left font-semibold text-foreground">Participantes</th>
                                    <th className="px-5 py-3 text-left font-semibold text-foreground">Status</th>
                                    <th className="px-5 py-3 text-left font-semibold text-foreground">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {capacitacoes.map((c, i) => (
                                    <tr key={i} className="border-b border-border transition-colors hover:bg-muted/30">
                                        <td className="px-5 py-3"><strong>{c.nome}</strong></td>
                                        <td className="px-5 py-3">{formatDate(c.data)}</td>
                                        <td className="px-5 py-3">{c.participantes || '-'}</td>
                                        <td className="px-5 py-3">
                                            <span className={cn(
                                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                c.status === 'concluida' ? 'bg-secondary/10 text-secondary' :
                                                c.status === 'agendada' ? 'bg-cyan-100 text-cyan-700' :
                                                'bg-muted text-muted-foreground'
                                            )}>
                                                {c.status === 'concluida' ? 'Concluída' : c.status === 'agendada' ? 'Agendada' : 'Planejada'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <button className="inline-flex items-center justify-center rounded-lg border border-primary/30 p-2 text-primary transition-colors hover:bg-primary/5">
                                                <Eye className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {funcionarioSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setFuncionarioSelecionado(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between rounded-t-xl bg-primary px-5 py-3 text-primary-foreground">
                            <span className="flex items-center gap-2 text-sm font-semibold">
                                <User className="size-4" /> Dados do Funcionário
                            </span>
                            <button
                                className="rounded-md bg-white/20 p-1 transition-colors hover:bg-white/30"
                                onClick={() => setFuncionarioSelecionado(null)}
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-2 flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-white">
                                    {funcionarioSelecionado.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </div>
                                <h5 className="text-lg font-semibold text-foreground">{funcionarioSelecionado.nome}</h5>
                                <p className="text-sm text-muted-foreground">{funcionarioSelecionado.cargo}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <small className="text-xs text-muted-foreground">Unidade</small>
                                    <p className="mt-0.5 font-semibold text-foreground">{funcionarioSelecionado.unidade}</p>
                                </div>
                                <div>
                                    <small className="text-xs text-muted-foreground">Status</small>
                                    <p className="mt-0.5">{getStatusBadge(funcionarioSelecionado.status)}</p>
                                </div>
                                <div>
                                    <small className="text-xs text-muted-foreground">Carga Horária</small>
                                    <p className="mt-0.5 font-semibold text-foreground">{funcionarioSelecionado.cargaHoraria}h/semana</p>
                                </div>
                                <div>
                                    <small className="text-xs text-muted-foreground">Vínculo</small>
                                    <p className="mt-0.5 font-semibold text-foreground">{funcionarioSelecionado.vinculo}</p>
                                </div>
                                <div className="col-span-2">
                                    <small className="text-xs text-muted-foreground">Admissão</small>
                                    <p className="mt-0.5 font-semibold text-foreground">{formatDate(funcionarioSelecionado.admissao)}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                                    <Pencil className="size-4" /> Editar
                                </button>
                                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark">
                                    <CalendarDays className="size-4" /> Escala
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
