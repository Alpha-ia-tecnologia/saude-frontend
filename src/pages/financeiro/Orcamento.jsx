import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Coins, FileText, Plus, Eye, Pencil, AreaChart, Wallet,
    ListChecks, X, FileDown
} from 'lucide-react';

// Budget data
const orcamentoGeral = {
    aprovado: 2500000,
    executado: 1847500,
    empenhado: 2100000,
    disponivel: 400000
};

const rubricas = [
    {
        id: 1,
        codigo: '3.1.90.11',
        nome: 'Vencimentos e Vantagens Fixas',
        categoria: 'Pessoal',
        aprovado: 1200000,
        empenhado: 1150000,
        executado: 1050000,
        percentual: 87.5
    },
    {
        id: 2,
        codigo: '3.3.90.30',
        nome: 'Material de Consumo',
        categoria: 'Custeio',
        aprovado: 350000,
        empenhado: 320000,
        executado: 285000,
        percentual: 81.4
    },
    {
        id: 3,
        codigo: '3.3.90.32',
        nome: 'Material de Distribuição Gratuita',
        categoria: 'Custeio',
        aprovado: 280000,
        empenhado: 275000,
        executado: 210000,
        percentual: 75.0
    },
    {
        id: 4,
        codigo: '3.3.90.39',
        nome: 'Serviços de Terceiros - PJ',
        categoria: 'Custeio',
        aprovado: 420000,
        empenhado: 230000,
        executado: 187500,
        percentual: 44.6
    },
    {
        id: 5,
        codigo: '4.4.90.52',
        nome: 'Equipamentos e Material Permanente',
        categoria: 'Investimento',
        aprovado: 150000,
        empenhado: 85000,
        executado: 75000,
        percentual: 50.0
    },
    {
        id: 6,
        codigo: '3.3.90.36',
        nome: 'Outros Serviços de Terceiros - PF',
        categoria: 'Custeio',
        aprovado: 100000,
        empenhado: 40000,
        executado: 40000,
        percentual: 40.0
    }
];

const execucaoMensal = [
    { mes: 'Jan', previsto: 200000, executado: 195000 },
    { mes: 'Fev', previsto: 200000, executado: 188000 },
    { mes: 'Mar', previsto: 210000, executado: 205000 },
    { mes: 'Abr', previsto: 210000, executado: 198000 },
    { mes: 'Mai', previsto: 220000, executado: 215000 },
    { mes: 'Jun', previsto: 220000, executado: 210000 },
    { mes: 'Jul', previsto: 210000, executado: 205000 },
    { mes: 'Ago', previsto: 210000, executado: 198000 },
    { mes: 'Set', previsto: 210000, executado: 125000 },
    { mes: 'Out', previsto: 205000, executado: 0 },
    { mes: 'Nov', previsto: 205000, executado: 0 },
    { mes: 'Dez', previsto: 200000, executado: 0 }
];

const fonteRecursos = [
    { fonte: 'PAB Fixo', valor: 850000, cor: 'bg-primary' },
    { fonte: 'PAB Variável', valor: 620000, cor: 'bg-secondary' },
    { fonte: 'MAC', valor: 480000, cor: 'bg-accent' },
    { fonte: 'Outros SUS', valor: 350000, cor: 'bg-cyan-500' },
    { fonte: 'Recursos Próprios', valor: 200000, cor: 'bg-gray-500' }
];

export default function Orcamento() {
    const [anoSelecionado, setAnoSelecionado] = useState('2025');
    const [unidadeSelecionada, setUnidadeSelecionada] = useState('todas');
    const [rubricaSelecionada, setRubricaSelecionada] = useState(null);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const getProgressColor = (percentual) => {
        if (percentual >= 80) return 'bg-secondary';
        if (percentual >= 50) return 'bg-accent';
        return 'bg-destructive';
    };

    const getProgressTextColor = (percentual) => {
        if (percentual >= 80) return 'text-secondary';
        if (percentual >= 50) return 'text-accent';
        return 'text-destructive';
    };

    const totalFontes = fonteRecursos.reduce((acc, f) => acc + f.valor, 0);
    const maxMensal = Math.max(...execucaoMensal.map(m => Math.max(m.previsto, m.executado)));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                    <Coins className="mr-2 inline-block h-6 w-6 text-accent" />
                    Orcamento
                </h1>
                <div className="flex gap-2">
                    <select
                        className="h-10 w-auto rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={unidadeSelecionada}
                        onChange={(e) => setUnidadeSelecionada(e.target.value)}
                    >
                        <option value="todas">Todas as Unidades</option>
                        <option value="centro">UBS Centro</option>
                        <option value="norte">UBS Norte</option>
                        <option value="sul">UBS Sul</option>
                    </select>
                    <select
                        className="h-10 w-auto rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={anoSelecionado}
                        onChange={(e) => setAnoSelecionado(e.target.value)}
                    >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                        <FileText className="h-4 w-4" /> Relatorio
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                        <Plus className="h-4 w-4" /> Nova Dotacao
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="rounded-xl border border-border bg-card shadow-sm border-t-4 border-t-primary">
                    <div className="p-5 text-center">
                        <p className="text-sm text-muted-foreground">Orcamento Aprovado</p>
                        <h2 className="my-2 text-2xl font-bold text-primary">{formatCurrency(orcamentoGeral.aprovado)}</h2>
                        <small className="text-muted-foreground">LOA {anoSelecionado}</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-t-4 border-t-accent">
                    <div className="p-5 text-center">
                        <p className="text-sm text-muted-foreground">Empenhado</p>
                        <h2 className="my-2 text-2xl font-bold text-accent">{formatCurrency(orcamentoGeral.empenhado)}</h2>
                        <small className="text-muted-foreground">{((orcamentoGeral.empenhado / orcamentoGeral.aprovado) * 100).toFixed(1)}% do total</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-t-4 border-t-secondary">
                    <div className="p-5 text-center">
                        <p className="text-sm text-muted-foreground">Executado</p>
                        <h2 className="my-2 text-2xl font-bold text-secondary">{formatCurrency(orcamentoGeral.executado)}</h2>
                        <small className="text-muted-foreground">{((orcamentoGeral.executado / orcamentoGeral.aprovado) * 100).toFixed(1)}% do total</small>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm border-t-4 border-t-cyan-500">
                    <div className="p-5 text-center">
                        <p className="text-sm text-muted-foreground">Disponivel</p>
                        <h2 className="my-2 text-2xl font-bold text-cyan-500">{formatCurrency(orcamentoGeral.disponivel)}</h2>
                        <small className="text-muted-foreground">{((orcamentoGeral.disponivel / orcamentoGeral.aprovado) * 100).toFixed(1)}% restante</small>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-3 gap-6">
                {/* Monthly Execution Chart */}
                <div className="col-span-2 rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <AreaChart className="mr-1.5 inline-block h-4 w-4" /> Execucao Mensal
                    </div>
                    <div className="p-5">
                        <div className="mb-4 flex justify-end gap-4 text-sm">
                            <span><span className="mr-1 inline-block h-3 w-3 rounded-sm bg-primary"></span> Previsto</span>
                            <span><span className="mr-1 inline-block h-3 w-3 rounded-sm bg-secondary"></span> Executado</span>
                        </div>
                        <div className="flex h-[180px] items-end justify-between gap-1">
                            {execucaoMensal.map((mes, i) => (
                                <div key={i} className="flex flex-1 flex-col items-center">
                                    <div className="flex h-[150px] items-end gap-0.5">
                                        <div
                                            className="w-3 rounded-t bg-primary/70"
                                            style={{ height: `${(mes.previsto / maxMensal) * 140}px` }}
                                        ></div>
                                        <div
                                            className={cn('w-3 rounded-t', mes.executado > 0 ? 'bg-secondary' : 'bg-gray-200')}
                                            style={{ height: `${(mes.executado / maxMensal) * 140}px` }}
                                        ></div>
                                    </div>
                                    <small className="mt-1 text-xs text-muted-foreground">{mes.mes}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resources by Source */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <Wallet className="mr-1.5 inline-block h-4 w-4" /> Fontes de Recursos
                    </div>
                    <div className="p-5">
                        {fonteRecursos.map((fonte, i) => (
                            <div key={i} className={cn(i < fonteRecursos.length - 1 && 'mb-4')}>
                                <div className="mb-1 flex justify-between">
                                    <span className="text-sm">{fonte.fonte}</span>
                                    <strong className="text-sm">{formatCurrency(fonte.valor)}</strong>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className={cn('h-full rounded-full', fonte.cor)}
                                        style={{ width: `${(fonte.valor / totalFontes) * 100}%` }}
                                    ></div>
                                </div>
                                <small className="text-muted-foreground">{((fonte.valor / totalFontes) * 100).toFixed(1)}%</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Budget Items Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-3">
                    <span className="text-sm font-semibold">
                        <ListChecks className="mr-1.5 inline-block h-4 w-4" /> Execucao por Rubrica
                    </span>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="h-8 w-[200px] rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Buscar rubrica..."
                        />
                        <select className="h-8 w-auto rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option>Todas as Categorias</option>
                            <option>Pessoal</option>
                            <option>Custeio</option>
                            <option>Investimento</option>
                        </select>
                    </div>
                </div>
                <div>
                    <table className="w-full text-sm">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Codigo</th>
                                <th className="px-4 py-3 text-left font-medium">Rubrica</th>
                                <th className="px-4 py-3 text-left font-medium">Categoria</th>
                                <th className="px-4 py-3 text-right font-medium">Aprovado</th>
                                <th className="px-4 py-3 text-right font-medium">Empenhado</th>
                                <th className="px-4 py-3 text-right font-medium">Executado</th>
                                <th className="px-4 py-3 text-left font-medium">Execucao</th>
                                <th className="px-4 py-3 text-left font-medium">Acoes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {rubricas.map(rubrica => (
                                <tr key={rubrica.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{rubrica.codigo}</code></td>
                                    <td className="px-4 py-3">
                                        <strong>{rubrica.nome}</strong>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            'rounded-md px-2 py-0.5 text-xs font-medium',
                                            rubrica.categoria === 'Pessoal'
                                                ? 'bg-primary/10 text-primary'
                                                : rubrica.categoria === 'Custeio'
                                                    ? 'bg-cyan-50 text-cyan-700'
                                                    : 'bg-amber-50 text-amber-700'
                                        )}>
                                            {rubrica.categoria}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">{formatCurrency(rubrica.aprovado)}</td>
                                    <td className="px-4 py-3 text-right text-accent">{formatCurrency(rubrica.empenhado)}</td>
                                    <td className="px-4 py-3 text-right text-secondary">{formatCurrency(rubrica.executado)}</td>
                                    <td className="w-[150px] px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 overflow-hidden rounded-full bg-gray-200 h-2">
                                                <div
                                                    className={cn('h-full rounded-full', getProgressColor(rubrica.percentual))}
                                                    style={{ width: `${rubrica.percentual}%` }}
                                                ></div>
                                            </div>
                                            <span className={cn('text-sm font-semibold', getProgressTextColor(rubrica.percentual))}>
                                                {rubrica.percentual}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            <button
                                                className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                                                onClick={() => setRubricaSelecionada(rubrica)}
                                                title="Detalhes"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                                                title="Editar"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t border-border bg-muted/50 font-semibold">
                            <tr>
                                <td className="px-4 py-3" colSpan="3">TOTAL</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(rubricas.reduce((acc, r) => acc + r.aprovado, 0))}</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(rubricas.reduce((acc, r) => acc + r.empenhado, 0))}</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(rubricas.reduce((acc, r) => acc + r.executado, 0))}</td>
                                <td className="px-4 py-3" colSpan="2"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {rubricaSelecionada && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setRubricaSelecionada(null)}
                >
                    <div
                        className="w-[600px] max-w-[90%] rounded-xl border border-border bg-card shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between rounded-t-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <span><FileDown className="mr-1.5 inline-block h-4 w-4" /> Detalhes da Rubrica</span>
                            <button
                                className="rounded-lg bg-white/20 px-2 py-1 text-xs text-white hover:bg-white/30"
                                onClick={() => setRubricaSelecionada(null)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-5">
                            <h5 className="text-lg font-semibold">{rubricaSelecionada.nome}</h5>
                            <p className="mt-1 text-sm text-muted-foreground">
                                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{rubricaSelecionada.codigo}</code> - {rubricaSelecionada.categoria}
                            </p>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                    <small className="text-muted-foreground">Aprovado</small>
                                    <h4 className="my-1 text-xl font-bold text-primary">{formatCurrency(rubricaSelecionada.aprovado)}</h4>
                                </div>
                                <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                    <small className="text-muted-foreground">Executado</small>
                                    <h4 className="my-1 text-xl font-bold text-secondary">{formatCurrency(rubricaSelecionada.executado)}</h4>
                                </div>
                            </div>

                            <h6 className="mt-4 font-semibold">Execucao</h6>
                            <div className="mb-2 h-5 overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className={cn('flex h-full items-center justify-center rounded-full text-xs font-semibold text-white', getProgressColor(rubricaSelecionada.percentual))}
                                    style={{ width: `${rubricaSelecionada.percentual}%` }}
                                >
                                    {rubricaSelecionada.percentual}%
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Saldo disponivel: <strong>{formatCurrency(rubricaSelecionada.aprovado - rubricaSelecionada.empenhado)}</strong>
                            </p>

                            <h6 className="mt-4 font-semibold">Ultimas Movimentacoes</h6>
                            <table className="w-full text-sm">
                                <thead className="border-b border-border bg-muted/50">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium">Data</th>
                                        <th className="px-3 py-2 text-left font-medium">Descricao</th>
                                        <th className="px-3 py-2 text-right font-medium">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr>
                                        <td className="px-3 py-2">25/01/2025</td>
                                        <td className="px-3 py-2">Pagamento NF 1234</td>
                                        <td className="px-3 py-2 text-right text-destructive">-R$ 15.000</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2">20/01/2025</td>
                                        <td className="px-3 py-2">Empenho no 456</td>
                                        <td className="px-3 py-2 text-right text-accent">R$ 25.000</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2">15/01/2025</td>
                                        <td className="px-3 py-2">Pagamento NF 1198</td>
                                        <td className="px-3 py-2 text-right text-destructive">-R$ 8.500</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-4 flex justify-end gap-2">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                                    <FileText className="h-4 w-4" /> Exportar
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                                    <Plus className="h-4 w-4" /> Novo Empenho
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
