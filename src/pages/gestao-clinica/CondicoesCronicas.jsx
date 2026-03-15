import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    HeartPulse,
    FileOutput,
    Plus,
    PieChart,
    Bot,
    AlertTriangle,
    Lightbulb,
    CheckCircle,
    XCircle,
    AlertCircle,
    Bell,
    Eye,
    ClipboardPlus,
    Calendar,
    User,
    X,
    FileHeart,
} from 'lucide-react';

// Sample chronic patients data
const pacientesCronicos = [
    {
        id: 1,
        nome: 'Maria Silva Santos',
        idade: 67,
        cns: '898.0001.0002.0003',
        condicoes: ['Hipertensão', 'Diabetes Tipo 2'],
        risco: 'alto',
        ultimoAtendimento: '28/03/2025',
        proximoRetorno: '28/04/2025',
        alertas: 2,
        status: 'atencao'
    },
    {
        id: 2,
        nome: 'José Carlos Oliveira',
        idade: 72,
        cns: '898.0002.0003.0004',
        condicoes: ['DPOC', 'Insuficiência Cardíaca'],
        risco: 'alto',
        ultimoAtendimento: '15/03/2025',
        proximoRetorno: '15/04/2025',
        alertas: 3,
        status: 'critico'
    },
    {
        id: 3,
        nome: 'Ana Paula Ferreira',
        idade: 55,
        cns: '898.0003.0004.0005',
        condicoes: ['Diabetes Tipo 2'],
        risco: 'medio',
        ultimoAtendimento: '20/03/2025',
        proximoRetorno: '20/05/2025',
        alertas: 0,
        status: 'controlado'
    },
    {
        id: 4,
        nome: 'Pedro Henrique Lima',
        idade: 48,
        cns: '898.0004.0005.0006',
        condicoes: ['Hipertensão'],
        risco: 'baixo',
        ultimoAtendimento: '10/03/2025',
        proximoRetorno: '10/06/2025',
        alertas: 0,
        status: 'controlado'
    },
    {
        id: 5,
        nome: 'Francisca Moura Costa',
        idade: 63,
        cns: '898.0005.0006.0007',
        condicoes: ['Hipotireoidismo', 'Osteoporose'],
        risco: 'medio',
        ultimoAtendimento: '05/03/2025',
        proximoRetorno: '05/04/2025',
        alertas: 1,
        status: 'atencao'
    },
    {
        id: 6,
        nome: 'Antônio Rodrigues',
        idade: 70,
        cns: '898.0006.0007.0008',
        condicoes: ['Doença Renal Crônica', 'Hipertensão'],
        risco: 'alto',
        ultimoAtendimento: '01/04/2025',
        proximoRetorno: '15/04/2025',
        alertas: 1,
        status: 'atencao'
    }
];

// Summary stats
const estatisticas = {
    total: 1245,
    hipertensao: 456,
    diabetes: 312,
    dpoc: 89,
    outros: 388,
    controlados: 780,
    atencao: 312,
    criticos: 153
};

const condicoesFiltro = [
    'Todas',
    'Hipertensão',
    'Diabetes Tipo 2',
    'DPOC',
    'Insuficiência Cardíaca',
    'Doença Renal Crônica',
    'Hipotireoidismo',
    'Asma'
];

export default function CondicoesCronicas() {
    const [filtroCondicao, setFiltroCondicao] = useState('Todas');
    const [filtroRisco, setFiltroRisco] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

    // Filter patients
    const pacientesFiltrados = pacientesCronicos.filter(p => {
        const matchCondicao = filtroCondicao === 'Todas' || p.condicoes.includes(filtroCondicao);
        const matchRisco = !filtroRisco || p.risco === filtroRisco;
        const matchStatus = !filtroStatus || p.status === filtroStatus;
        const matchPesquisa = !pesquisa ||
            p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
            p.cns.includes(pesquisa);
        return matchCondicao && matchRisco && matchStatus && matchPesquisa;
    });

    const getRiscoBadge = (risco) => {
        const config = {
            alto: 'bg-destructive/10 text-destructive',
            medio: 'bg-accent/10 text-amber-700',
            baixo: 'bg-secondary/10 text-secondary-dark',
        };
        const labels = { alto: 'Alto', medio: 'Médio', baixo: 'Baixo' };
        return (
            <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', config[risco])}>
                {labels[risco]}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const config = {
            controlado: {
                classes: 'bg-secondary/10 text-secondary-dark',
                label: 'Controlado',
                Icon: CheckCircle,
            },
            atencao: {
                classes: 'bg-accent/10 text-amber-700',
                label: 'Atenção',
                Icon: AlertCircle,
            },
            critico: {
                classes: 'bg-destructive/10 text-destructive',
                label: 'Crítico',
                Icon: XCircle,
            },
        };
        const s = config[status] || config.controlado;
        return (
            <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium', s.classes)}>
                <s.Icon className="h-3 w-3" />
                {s.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="flex items-center gap-2 text-2xl font-bold">
                    <HeartPulse className="h-7 w-7 text-destructive" />
                    Condições Crônicas
                </h1>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                        <FileOutput className="h-4 w-4" /> Exportar
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                        <Plus className="h-4 w-4" /> Cadastrar Paciente
                    </button>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-primary p-5 text-center">
                    <h2 className="text-3xl font-bold text-primary">{estatisticas.total}</h2>
                    <p className="text-sm text-muted-foreground">Total de Pacientes</p>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-secondary p-5 text-center">
                    <h2 className="text-3xl font-bold text-secondary">{estatisticas.controlados}</h2>
                    <p className="text-sm text-muted-foreground">Controlados</p>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-accent p-5 text-center">
                    <h2 className="text-3xl font-bold text-accent">{estatisticas.atencao}</h2>
                    <p className="text-sm text-muted-foreground">Atenção Necessária</p>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-destructive p-5 text-center">
                    <h2 className="text-3xl font-bold text-destructive">{estatisticas.criticos}</h2>
                    <p className="text-sm text-muted-foreground">Situação Crítica</p>
                </div>
            </div>

            {/* Conditions Distribution */}
            <div className="grid grid-cols-2 gap-6">
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <span className="flex items-center gap-1.5">
                            <PieChart className="h-4 w-4" /> Distribuição por Condição
                        </span>
                    </div>
                    <div className="p-5 space-y-4">
                        {/* Hipertensão */}
                        <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <span>Hipertensão</span>
                                <strong>{estatisticas.hipertensao}</strong>
                            </div>
                            <div className="h-2 w-full rounded-full bg-border">
                                <div
                                    className="h-full rounded-full bg-primary"
                                    style={{ width: `${(estatisticas.hipertensao / estatisticas.total) * 100}%` }}
                                />
                            </div>
                        </div>
                        {/* Diabetes */}
                        <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <span>Diabetes</span>
                                <strong>{estatisticas.diabetes}</strong>
                            </div>
                            <div className="h-2 w-full rounded-full bg-border">
                                <div
                                    className="h-full rounded-full bg-secondary"
                                    style={{ width: `${(estatisticas.diabetes / estatisticas.total) * 100}%` }}
                                />
                            </div>
                        </div>
                        {/* DPOC */}
                        <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <span>DPOC</span>
                                <strong>{estatisticas.dpoc}</strong>
                            </div>
                            <div className="h-2 w-full rounded-full bg-border">
                                <div
                                    className="h-full rounded-full bg-accent"
                                    style={{ width: `${(estatisticas.dpoc / estatisticas.total) * 100}%` }}
                                />
                            </div>
                        </div>
                        {/* Outras */}
                        <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <span>Outras</span>
                                <strong>{estatisticas.outros}</strong>
                            </div>
                            <div className="h-2 w-full rounded-full bg-border">
                                <div
                                    className="h-full rounded-full bg-muted-foreground"
                                    style={{ width: `${(estatisticas.outros / estatisticas.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-primary px-5 py-3 text-sm font-semibold text-white">
                        <span className="flex items-center gap-1.5">
                            <Bot className="h-4 w-4" /> Insights de IA
                        </span>
                    </div>
                    <div className="p-5 space-y-3">
                        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                            <p>
                                <span className="font-semibold">Alerta:</span> 23 pacientes diabéticos não realizaram exame de hemoglobina glicada nos últimos 6 meses.
                            </p>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <p>
                                <span className="font-semibold">Sugestão:</span> 15 pacientes hipertensos podem se beneficiar de atividades em grupo.
                            </p>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border border-secondary/20 bg-secondary/5 p-4 text-sm">
                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                            <p>
                                <span className="font-semibold">Positivo:</span> Taxa de controle pressórico aumentou 12% no último trimestre.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="p-5">
                    <h5 className="mb-4 text-sm font-semibold">Filtrar Pacientes</h5>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                                Condição
                            </label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={filtroCondicao}
                                onChange={(e) => setFiltroCondicao(e.target.value)}
                            >
                                {condicoesFiltro.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                                Risco
                            </label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={filtroRisco}
                                onChange={(e) => setFiltroRisco(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="alto">Alto</option>
                                <option value="medio">Médio</option>
                                <option value="baixo">Baixo</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                                Status
                            </label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="controlado">Controlado</option>
                                <option value="atencao">Atenção</option>
                                <option value="critico">Crítico</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                                Pesquisar
                            </label>
                            <input
                                type="text"
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Nome ou CNS..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Patients Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="px-5 pt-4 pb-2">
                    <h5 className="text-sm font-semibold">
                        Pacientes com Condições Crônicas ({pacientesFiltrados.length})
                    </h5>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Paciente</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Condições</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Risco</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Último Atend.</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Próximo Retorno</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Alertas</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {pacientesFiltrados.map(paciente => (
                            <tr key={paciente.id} className="hover:bg-muted/30">
                                <td className="px-4 py-3">
                                    <strong className="block text-sm">{paciente.nome}</strong>
                                    <span className="text-xs text-muted-foreground">
                                        {paciente.idade} anos &bull; CNS: {paciente.cns}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {paciente.condicoes.map((c, i) => (
                                            <span
                                                key={i}
                                                className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3">{getRiscoBadge(paciente.risco)}</td>
                                <td className="px-4 py-3">{getStatusBadge(paciente.status)}</td>
                                <td className="px-4 py-3 text-muted-foreground">{paciente.ultimoAtendimento}</td>
                                <td className="px-4 py-3 text-muted-foreground">{paciente.proximoRetorno}</td>
                                <td className="px-4 py-3">
                                    {paciente.alertas > 0 ? (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                                            <Bell className="h-3 w-3" /> {paciente.alertas}
                                        </span>
                                    ) : (
                                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                            0
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <button
                                            className="inline-flex items-center rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                                            onClick={() => setPacienteSelecionado(paciente)}
                                            title="Ver Detalhes"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="inline-flex items-center rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-secondary"
                                            title="Registrar Atendimento"
                                        >
                                            <ClipboardPlus className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="inline-flex items-center rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                                            title="Agendar"
                                        >
                                            <Calendar className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Patient Detail Modal */}
            {pacienteSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setPacienteSelecionado(null)}
                >
                    <div
                        className="w-[700px] max-w-[90%] max-h-[80vh] overflow-auto rounded-xl border border-border bg-card shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-border bg-secondary px-5 py-3 text-white rounded-t-xl">
                            <span className="flex items-center gap-2 text-sm font-semibold">
                                <User className="h-4 w-4" /> {pacienteSelecionado.nome}
                            </span>
                            <button
                                className="inline-flex items-center rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white"
                                onClick={() => setPacienteSelecionado(null)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 text-sm">
                                    <p><strong>Idade:</strong> {pacienteSelecionado.idade} anos</p>
                                    <p><strong>CNS:</strong> {pacienteSelecionado.cns}</p>
                                    <p className="flex items-center gap-2">
                                        <strong>Risco:</strong> {getRiscoBadge(pacienteSelecionado.risco)}
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p className="flex items-center gap-2">
                                        <strong>Status:</strong> {getStatusBadge(pacienteSelecionado.status)}
                                    </p>
                                    <p><strong>Último Atendimento:</strong> {pacienteSelecionado.ultimoAtendimento}</p>
                                    <p><strong>Próximo Retorno:</strong> {pacienteSelecionado.proximoRetorno}</p>
                                </div>
                            </div>

                            <div>
                                <h6 className="mb-2 text-sm font-semibold">Condições de Saúde</h6>
                                <div className="flex flex-wrap gap-2">
                                    {pacienteSelecionado.condicoes.map((c, i) => (
                                        <span
                                            key={i}
                                            className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                                        >
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {pacienteSelecionado.alertas > 0 && (
                                <div>
                                    <h6 className="mb-2 text-sm font-semibold">Alertas Ativos</h6>
                                    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                                        <p>Paciente com exames em atraso. Verificar hemoglobina glicada e função renal.</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h6 className="mb-2 text-sm font-semibold">Últimos Registros</h6>
                                <div className="overflow-hidden rounded-lg border border-border">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border bg-muted/50">
                                                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Data</th>
                                                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Tipo</th>
                                                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Observação</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            <tr>
                                                <td className="px-4 py-2">{pacienteSelecionado.ultimoAtendimento}</td>
                                                <td className="px-4 py-2">Consulta</td>
                                                <td className="px-4 py-2">Acompanhamento de rotina. PA: 140/90</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2">15/03/2025</td>
                                                <td className="px-4 py-2">Exame</td>
                                                <td className="px-4 py-2">Hemoglobina glicada: 7.2%</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2">01/03/2025</td>
                                                <td className="px-4 py-2">Visita ACS</td>
                                                <td className="px-4 py-2">Verificação domiciliar. Paciente estável.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                                    <FileHeart className="h-4 w-4" /> Prontuário
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-white hover:bg-secondary-dark">
                                    <ClipboardPlus className="h-4 w-4" /> Novo Atendimento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
