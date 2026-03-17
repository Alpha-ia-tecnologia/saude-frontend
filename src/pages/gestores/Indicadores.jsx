import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    TrendingUp, FileSpreadsheet, HeartPulse, BarChart3, Star, Coins,
    ArrowUp, ArrowDown, Minus, X, FileText, Target
} from 'lucide-react';

// Indicators data by category
const indicadoresData = {
    atencaoBasica: [
        { id: 1, nome: 'Cobertura de Pre-Natal', valor: 82, meta: 85, unidade: '%', tendencia: 'up' },
        { id: 2, nome: 'Gestantes com 7+ Consultas', valor: 68, meta: 75, unidade: '%', tendencia: 'up' },
        { id: 3, nome: 'Criancas com Vacinas em Dia (<1a)', valor: 92, meta: 95, unidade: '%', tendencia: 'down' },
        { id: 4, nome: 'Hipertensos Acompanhados', valor: 78, meta: 80, unidade: '%', tendencia: 'up' },
        { id: 5, nome: 'Diabeticos com HbA1c <7', valor: 45, meta: 60, unidade: '%', tendencia: 'stable' }
    ],
    producao: [
        { id: 6, nome: 'Consultas Medicas', valor: 4523, meta: 4500, unidade: '', tendencia: 'up' },
        { id: 7, nome: 'Consultas de Enfermagem', valor: 3210, meta: 3000, unidade: '', tendencia: 'up' },
        { id: 8, nome: 'Visitas Domiciliares ACS', valor: 8945, meta: 9000, unidade: '', tendencia: 'down' },
        { id: 9, nome: 'Procedimentos', valor: 2156, meta: 2000, unidade: '', tendencia: 'up' },
        { id: 10, nome: 'Atendimentos Odontologicos', valor: 1567, meta: 1800, unidade: '', tendencia: 'stable' }
    ],
    qualidade: [
        { id: 11, nome: 'Satisfacao do Usuario', valor: 4.7, meta: 4.5, unidade: '/5', tendencia: 'up' },
        { id: 12, nome: 'Tempo Medio de Espera', valor: 18, meta: 15, unidade: 'min', tendencia: 'down', invertido: true },
        { id: 13, nome: 'Retorno em 7 dias', valor: 8, meta: 5, unidade: '%', tendencia: 'up', invertido: true },
        { id: 14, nome: 'Absenteismo Consultas', valor: 12, meta: 10, unidade: '%', tendencia: 'stable', invertido: true },
        { id: 15, nome: 'Resolubilidade AB', valor: 85, meta: 85, unidade: '%', tendencia: 'up' }
    ],
    financeiro: [
        { id: 16, nome: 'Execucao Orcamentaria', valor: 73.9, meta: 75, unidade: '%', tendencia: 'up' },
        { id: 17, nome: 'Custo por Atendimento', valor: 45, meta: 50, unidade: 'R$', tendencia: 'down' },
        { id: 18, nome: 'Producao BPA Enviada', valor: 98, meta: 100, unidade: '%', tendencia: 'up' },
        { id: 19, nome: 'Glosas', valor: 2.3, meta: 3, unidade: '%', tendencia: 'down' }
    ]
};

const categorias = [
    { id: 'atencaoBasica', nome: 'Atencao Basica', Icon: HeartPulse },
    { id: 'producao', nome: 'Producao', Icon: BarChart3 },
    { id: 'qualidade', nome: 'Qualidade', Icon: Star },
    { id: 'financeiro', nome: 'Financeiro', Icon: Coins }
];

const historicoMensal = [
    { mes: 'Jan', valor: 72 },
    { mes: 'Fev', valor: 74 },
    { mes: 'Mar', valor: 73 },
    { mes: 'Abr', valor: 76 },
    { mes: 'Mai', valor: 78 },
    { mes: 'Jun', valor: 77 },
    { mes: 'Jul', valor: 79 },
    { mes: 'Ago', valor: 80 },
    { mes: 'Set', valor: 82 }
];

export default function Indicadores() {
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('atencaoBasica');
    const [indicadorSelecionado, setIndicadorSelecionado] = useState(null);
    const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');

    const indicadoresAtuais = indicadoresData[categoriaSelecionada] || [];

    const getStatusColor = (valor, meta, invertido = false) => {
        const percentual = (valor / meta) * 100;
        if (invertido) {
            return percentual <= 100 ? 'text-secondary' : percentual <= 120 ? 'text-accent' : 'text-destructive';
        }
        return percentual >= 100 ? 'text-secondary' : percentual >= 85 ? 'text-accent' : 'text-destructive';
    };

    const getStatusBgColor = (valor, meta, invertido = false) => {
        const percentual = (valor / meta) * 100;
        if (invertido) {
            return percentual <= 100 ? 'bg-secondary' : percentual <= 120 ? 'bg-accent' : 'bg-destructive';
        }
        return percentual >= 100 ? 'bg-secondary' : percentual >= 85 ? 'bg-accent' : 'bg-destructive';
    };

    const getTendenciaIcon = (tendencia) => {
        if (tendencia === 'up') return { Icon: ArrowUp, color: 'text-secondary' };
        if (tendencia === 'down') return { Icon: ArrowDown, color: 'text-destructive' };
        return { Icon: Minus, color: 'text-muted-foreground' };
    };

    const calcularResumo = () => {
        let total = 0, atingidos = 0, atencao = 0, criticos = 0;
        Object.values(indicadoresData).flat().forEach(ind => {
            total++;
            const percentual = (ind.valor / ind.meta) * 100;
            const isOk = ind.invertido ? percentual <= 100 : percentual >= 100;
            const isAtencao = ind.invertido ? percentual <= 120 : percentual >= 85;
            if (isOk) atingidos++;
            else if (isAtencao) atencao++;
            else criticos++;
        });
        return { total, atingidos, atencao, criticos };
    };

    const resumo = calcularResumo();

    const exportarIndicadores = () => {
        const linhas = [
            ['Categoria', 'Indicador', 'Valor', 'Meta', 'Unidade', 'Tendencia', 'Alcance (%)']
        ];
        Object.entries(indicadoresData).forEach(([categoria, indicadores]) => {
            const catNome = categorias.find(c => c.id === categoria)?.nome || categoria;
            indicadores.forEach(ind => {
                linhas.push([
                    catNome,
                    ind.nome,
                    ind.valor,
                    ind.meta,
                    ind.unidade,
                    ind.tendencia,
                    ((ind.valor / ind.meta) * 100).toFixed(1)
                ]);
            });
        });
        const csv = linhas.map(l => l.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'indicadores_desempenho.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        <TrendingUp className="mr-2 inline-block h-6 w-6 text-primary" />
                        Indicadores de Desempenho
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Monitoramento de metas e resultados</p>
                </div>
                <div className="flex gap-2">
                    <select
                        className="h-10 w-auto rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={periodoSelecionado}
                        onChange={(e) => setPeriodoSelecionado(e.target.value)}
                    >
                        <option value="mes">Este Mes</option>
                        <option value="trimestre">Trimestre</option>
                        <option value="semestre">Semestre</option>
                        <option value="ano">Este Ano</option>
                    </select>
                    <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                        onClick={exportarIndicadores}
                    >
                        <FileSpreadsheet className="h-4 w-4" /> Exportar
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-primary">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-primary">{resumo.total}</h2>
                        <small className="text-muted-foreground">Total Indicadores</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-secondary">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-secondary">{resumo.atingidos}</h2>
                        <small className="text-muted-foreground">Meta Atingida</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-accent">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-accent">{resumo.atencao}</h2>
                        <small className="text-muted-foreground">Atencao</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-destructive">
                    <div className="p-4 text-center">
                        <h2 className="text-2xl font-bold text-destructive">{resumo.criticos}</h2>
                        <small className="text-muted-foreground">Criticos</small>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="rounded-xl border border-border bg-card p-2 shadow-sm">
                <div className="flex gap-2">
                    {categorias.map(cat => (
                        <button
                            key={cat.id}
                            className={cn(
                                'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                categoriaSelecionada === cat.id
                                    ? 'bg-primary text-white'
                                    : 'border border-border text-muted-foreground hover:bg-muted'
                            )}
                            onClick={() => setCategoriaSelecionada(cat.id)}
                        >
                            <cat.Icon className="h-4 w-4" />
                            {cat.nome}
                        </button>
                    ))}
                </div>
            </div>

            {/* Indicators Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                    {(() => {
                        const cat = categorias.find(c => c.id === categoriaSelecionada);
                        return cat ? <><cat.Icon className="mr-1.5 inline-block h-4 w-4" /> {cat.nome}</> : null;
                    })()}
                </div>
                <div>
                    <table className="w-full text-sm">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Indicador</th>
                                <th className="px-4 py-3 text-center font-medium">Valor Atual</th>
                                <th className="px-4 py-3 text-center font-medium">Meta</th>
                                <th className="w-[200px] px-4 py-3 text-left font-medium">Progresso</th>
                                <th className="px-4 py-3 text-center font-medium">Tendencia</th>
                                <th className="px-4 py-3 text-left font-medium">Acoes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {indicadoresAtuais.map(ind => {
                                const statusColor = getStatusColor(ind.valor, ind.meta, ind.invertido);
                                const statusBg = getStatusBgColor(ind.valor, ind.meta, ind.invertido);
                                const percentual = Math.min(100, (ind.valor / ind.meta) * 100);
                                const tendencia = getTendenciaIcon(ind.tendencia);
                                return (
                                    <tr key={ind.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3"><strong>{ind.nome}</strong></td>
                                        <td className="px-4 py-3 text-center">
                                            <strong className={cn('text-base', statusColor)}>
                                                {ind.valor}{ind.unidade}
                                            </strong>
                                        </td>
                                        <td className="px-4 py-3 text-center text-muted-foreground">
                                            {ind.meta}{ind.unidade}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 overflow-hidden rounded-full bg-gray-200 h-2.5">
                                                    <div
                                                        className={cn('h-full rounded-full transition-all duration-500', statusBg)}
                                                        style={{ width: `${percentual}%` }}
                                                    ></div>
                                                </div>
                                                <span className={cn('text-sm font-semibold', statusColor)}>
                                                    {percentual.toFixed(0)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <tendencia.Icon className={cn('mx-auto h-4 w-4', tendencia.color)} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                                onClick={() => setIndicadorSelecionado(ind)}
                                            >
                                                <TrendingUp className="h-3.5 w-3.5" /> Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {indicadorSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setIndicadorSelecionado(null)}
                >
                    <div
                        className="w-[700px] max-w-[90%] rounded-xl border border-border bg-card shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between rounded-t-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <span><TrendingUp className="mr-1.5 inline-block h-4 w-4" /> {indicadorSelecionado.nome}</span>
                            <button
                                className="rounded-lg bg-white/20 px-2 py-1 text-xs text-white hover:bg-white/30"
                                onClick={() => setIndicadorSelecionado(null)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="mb-6 grid grid-cols-3 gap-4">
                                <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                    <small className="text-muted-foreground">Valor Atual</small>
                                    <h3 className={cn('my-1 text-xl font-bold', getStatusColor(indicadorSelecionado.valor, indicadorSelecionado.meta, indicadorSelecionado.invertido))}>
                                        {indicadorSelecionado.valor}{indicadorSelecionado.unidade}
                                    </h3>
                                </div>
                                <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                    <small className="text-muted-foreground">Meta</small>
                                    <h3 className="my-1 text-xl font-bold">{indicadorSelecionado.meta}{indicadorSelecionado.unidade}</h3>
                                </div>
                                <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                    <small className="text-muted-foreground">Alcance</small>
                                    <h3 className="my-1 text-xl font-bold">{((indicadorSelecionado.valor / indicadorSelecionado.meta) * 100).toFixed(1)}%</h3>
                                </div>
                            </div>

                            <h6 className="font-semibold">Evolucao Mensal</h6>
                            <div className="mb-4 mt-2 flex h-[150px] items-end justify-around rounded-lg bg-muted/50 p-4">
                                {historicoMensal.map((mes, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div
                                            className="w-[30px] rounded-t bg-primary"
                                            style={{ height: `${mes.valor}px` }}
                                        ></div>
                                        <small className="mt-1 text-xs">{mes.mes}</small>
                                    </div>
                                ))}
                            </div>

                            <h6 className="font-semibold">Analise por Unidade</h6>
                            <table className="mt-2 w-full text-sm">
                                <thead className="border-b border-border bg-muted/50">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium">Unidade</th>
                                        <th className="px-3 py-2 text-left font-medium">Valor</th>
                                        <th className="px-3 py-2 text-left font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr>
                                        <td className="px-3 py-2">UBS Centro</td>
                                        <td className="px-3 py-2">{(indicadorSelecionado.valor * 1.05).toFixed(1)}{indicadorSelecionado.unidade}</td>
                                        <td className="px-3 py-2"><span className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">Atingida</span></td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2">UBS Norte</td>
                                        <td className="px-3 py-2">{(indicadorSelecionado.valor * 0.92).toFixed(1)}{indicadorSelecionado.unidade}</td>
                                        <td className="px-3 py-2"><span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Atencao</span></td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2">UBS Sul</td>
                                        <td className="px-3 py-2">{(indicadorSelecionado.valor * 0.98).toFixed(1)}{indicadorSelecionado.unidade}</td>
                                        <td className="px-3 py-2"><span className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">Atingida</span></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-4 flex justify-end gap-2">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                                    <FileText className="h-4 w-4" /> Relatorio
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                                    <Target className="h-4 w-4" /> Definir Acao
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
