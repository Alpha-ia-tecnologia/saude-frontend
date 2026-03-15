import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import {
    Smile, Meh, Frown, TrendingUp, BarChart3, MessageSquare,
    Send, Star, Filter, ChevronDown, X, ThumbsUp, ThumbsDown,
    Minus, ClipboardList, Calendar, Building2
} from 'lucide-react';

// --- In-memory NPS data ---

const categories = [
    'Atendimento Medico',
    'Enfermagem',
    'Recepcao',
    'Farmacia',
    'Estrutura Fisica',
    'Tempo de Espera'
];

function generateSurveys() {
    const surveys = [];
    const comments = {
        promoter: [
            'Excelente atendimento, equipe muito atenciosa e competente.',
            'Fui muito bem atendido, superou minhas expectativas.',
            'Profissionais dedicados e estrutura de qualidade.',
            'Recomendo a todos, servico de excelencia.',
            'Rapido, eficiente e humanizado. Nota 10!',
            'Atendimento impecavel, me senti muito acolhido.',
            'Equipe muito profissional e ambiente agradavel.',
            'Otima experiencia, desde a recepcao ate a consulta.',
            'Medico muito atencioso, explicou tudo com paciencia.',
            'Servico de primeira qualidade, voltarei com certeza.'
        ],
        passive: [
            'Atendimento bom, mas poderia melhorar o tempo de espera.',
            'Razoavel, nada de especial. Cumpriu o esperado.',
            'Bom atendimento, mas a estrutura precisa de melhorias.',
            'Nao tenho reclamacoes, mas tambem nada excepcional.',
            'Atendimento adequado, porem um pouco demorado.',
            'Profissionais competentes, mas faltou empatia.',
            'Servico ok, mas achei a espera um pouco longa.'
        ],
        detractor: [
            'Esperei mais de 2 horas para ser atendido.',
            'Atendimento frio e impessoal, sem empatia.',
            'Estrutura precaria, faltam equipamentos basicos.',
            'Pessimo atendimento na recepcao, muita grosseria.',
            'Nao recomendo, experiencia muito negativa.',
            'Demora excessiva e falta de organizacao.',
            'Profissionais parecem sobrecarregados e desatentos.',
            'Faltou medicamento na farmacia, tive que comprar fora.'
        ]
    };
    const names = [
        'Ana Silva', 'Carlos Oliveira', 'Maria Santos', 'Joao Pereira',
        'Fernanda Costa', 'Pedro Almeida', 'Juliana Lima', 'Rafael Souza',
        'Patricia Ferreira', 'Lucas Rodrigues', 'Beatriz Martins', 'Gabriel Araujo',
        'Camila Barbosa', 'Thiago Ribeiro', 'Larissa Goncalves', 'Mateus Carvalho',
        'Amanda Nascimento', 'Diego Mendes', 'Isabela Rocha', 'Vinicius Castro',
        'Mariana Moreira', 'Bruno Alves', 'Leticia Cardoso', 'Felipe Nunes',
        'Daniela Correia', 'Gustavo Pinto', 'Aline Teixeira', 'Henrique Monteiro',
        'Renata Vieira', 'Eduardo Freitas', 'Natalia Duarte', 'Roberto Cunha'
    ];

    const seededRandom = (seed) => {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    for (let i = 0; i < 60; i++) {
        const monthsAgo = Math.floor(seededRandom(i * 17 + 3) * 12);
        const date = new Date(2026, 2, 14);
        date.setMonth(date.getMonth() - monthsAgo);
        date.setDate(Math.floor(seededRandom(i * 31 + 7) * 28) + 1);

        const score = Math.floor(seededRandom(i * 13 + 5) * 11);
        const category = categories[Math.floor(seededRandom(i * 23 + 11) * categories.length)];

        let commentList;
        if (score >= 9) commentList = comments.promoter;
        else if (score >= 7) commentList = comments.passive;
        else commentList = comments.detractor;

        const comment = commentList[Math.floor(seededRandom(i * 41 + 2) * commentList.length)];
        const name = names[Math.floor(seededRandom(i * 19 + 9) * names.length)];

        surveys.push({
            id: i + 1,
            pacienteNome: name,
            score,
            category,
            comment,
            date: date.toISOString().split('T')[0],
        });
    }

    surveys.sort((a, b) => new Date(b.date) - new Date(a.date));
    return surveys;
}

const initialSurveys = generateSurveys();

function classifyScore(score) {
    if (score >= 9) return 'promoter';
    if (score >= 7) return 'passive';
    return 'detractor';
}

function calcNPS(list) {
    if (list.length === 0) return { nps: 0, promoters: 0, passives: 0, detractors: 0, total: 0, promoterPct: 0, passivePct: 0, detractorPct: 0 };
    let p = 0, pa = 0, d = 0;
    list.forEach(s => {
        const c = classifyScore(s.score);
        if (c === 'promoter') p++;
        else if (c === 'passive') pa++;
        else d++;
    });
    const t = list.length;
    return {
        nps: Math.round(((p / t) - (d / t)) * 100),
        promoters: p, passives: pa, detractors: d, total: t,
        promoterPct: Math.round((p / t) * 100),
        passivePct: Math.round((pa / t) * 100),
        detractorPct: Math.round((d / t) * 100)
    };
}

function getNPSColor(nps) {
    if (nps < 0) return 'text-red-600';
    if (nps < 50) return 'text-amber-500';
    if (nps < 75) return 'text-emerald-500';
    return 'text-emerald-700';
}

function getNPSBg(nps) {
    if (nps < 0) return 'bg-red-50 border-red-200';
    if (nps < 50) return 'bg-amber-50 border-amber-200';
    if (nps < 75) return 'bg-emerald-50 border-emerald-200';
    return 'bg-emerald-50 border-emerald-300';
}

function getNPSLabel(nps) {
    if (nps < 0) return 'Zona Critica';
    if (nps < 50) return 'Zona de Aperfeicoamento';
    if (nps < 75) return 'Zona de Qualidade';
    return 'Zona de Excelencia';
}

const faceEmojis = ['😡', '😠', '😤', '😟', '😕', '😐', '🙂', '😊', '😀', '😁', '🤩'];

export default function NPS() {
    const [surveys, setSurveys] = useState(initialSurveys);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterClassification, setFilterClassification] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formScore, setFormScore] = useState(8);
    const [formCategory, setFormCategory] = useState(categories[0]);
    const [formComment, setFormComment] = useState('');
    const [formName, setFormName] = useState('');

    const npsData = useMemo(() => calcNPS(surveys), [surveys]);

    const trend = useMemo(() => {
        const months = [];
        const now = new Date(2026, 2, 14);
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const y = d.getFullYear();
            const m = d.getMonth();
            const mSurveys = surveys.filter(s => {
                const sd = new Date(s.date);
                return sd.getFullYear() === y && sd.getMonth() === m;
            });
            const data = calcNPS(mSurveys);
            months.push({ label: `${monthNames[m]}`, year: y, ...data });
        }
        return months;
    }, [surveys]);

    const categoryNPS = useMemo(() => {
        return categories.map(cat => {
            const catSurveys = surveys.filter(s => s.category === cat);
            return { category: cat, ...calcNPS(catSurveys) };
        });
    }, [surveys]);

    const filteredSurveys = useMemo(() => {
        let result = [...surveys];
        if (filterCategory) result = result.filter(s => s.category === filterCategory);
        if (filterClassification) result = result.filter(s => classifyScore(s.score) === filterClassification);
        return result;
    }, [surveys, filterCategory, filterClassification]);

    const handleSubmit = () => {
        if (formScore < 0 || formScore > 10) return;
        const newSurvey = {
            id: surveys.length + 1,
            pacienteNome: formName || 'Anonimo',
            score: formScore,
            category: formCategory,
            comment: formComment,
            date: new Date().toISOString().split('T')[0],
        };
        setSurveys([newSurvey, ...surveys]);
        setFormScore(8);
        setFormCategory(categories[0]);
        setFormComment('');
        setFormName('');
        setShowForm(false);
    };

    const maxTrendNPS = Math.max(...trend.map(t => Math.abs(t.nps)), 1);

    const categoryIcons = {
        'Atendimento Medico': Star,
        'Enfermagem': ThumbsUp,
        'Recepcao': Building2,
        'Farmacia': ClipboardList,
        'Estrutura Fisica': Building2,
        'Tempo de Espera': Calendar,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        <BarChart3 className="mr-2 inline-block h-6 w-6 text-primary" />
                        Pesquisa NPS
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Net Promoter Score - Satisfacao dos pacientes (RF20)</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
                >
                    <Send className="h-4 w-4" /> Nova Pesquisa
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
                {/* NPS Score */}
                <div className={cn('rounded-xl border p-5 shadow-sm', getNPSBg(npsData.nps))}>
                    <p className="text-sm font-medium text-muted-foreground">NPS Score</p>
                    <h2 className={cn('my-1 text-4xl font-bold', getNPSColor(npsData.nps))}>
                        {npsData.nps}
                    </h2>
                    <p className={cn('text-xs font-medium', getNPSColor(npsData.nps))}>{getNPSLabel(npsData.nps)}</p>
                </div>

                {/* Total Respostas */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Respostas</p>
                            <h2 className="my-1 text-3xl font-bold text-foreground">{npsData.total}</h2>
                            <p className="text-xs text-muted-foreground">pesquisas coletadas</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Promotores */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Promotores</p>
                            <h2 className="my-1 text-3xl font-bold text-emerald-600">{npsData.promoterPct}%</h2>
                            <p className="text-xs text-muted-foreground">{npsData.promoters} respostas (9-10)</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                            <Smile className="h-5 w-5 text-emerald-600" />
                        </div>
                    </div>
                </div>

                {/* Detratores */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Detratores</p>
                            <h2 className="my-1 text-3xl font-bold text-red-600">{npsData.detractorPct}%</h2>
                            <p className="text-xs text-muted-foreground">{npsData.detractors} respostas (0-6)</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <Frown className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Distribution Bar */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Distribuicao de Respostas</h3>
                <div className="flex h-8 w-full overflow-hidden rounded-full">
                    {npsData.promoterPct > 0 && (
                        <div
                            className="flex items-center justify-center bg-emerald-500 text-xs font-bold text-white transition-all"
                            style={{ width: `${npsData.promoterPct}%` }}
                        >
                            {npsData.promoterPct}%
                        </div>
                    )}
                    {npsData.passivePct > 0 && (
                        <div
                            className="flex items-center justify-center bg-amber-400 text-xs font-bold text-white transition-all"
                            style={{ width: `${npsData.passivePct}%` }}
                        >
                            {npsData.passivePct}%
                        </div>
                    )}
                    {npsData.detractorPct > 0 && (
                        <div
                            className="flex items-center justify-center bg-red-500 text-xs font-bold text-white transition-all"
                            style={{ width: `${npsData.detractorPct}%` }}
                        >
                            {npsData.detractorPct}%
                        </div>
                    )}
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        Promotores ({npsData.promoters})
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" />
                        Passivos ({npsData.passives})
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                        Detratores ({npsData.detractors})
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-3 gap-6">
                {/* NPS Trend Chart */}
                <div className="col-span-2 rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <TrendingUp className="mr-1.5 inline-block h-4 w-4" /> Tendencia NPS - Ultimos 12 Meses
                    </div>
                    <div className="p-5">
                        <div className="flex h-[220px] items-end justify-around gap-2">
                            {trend.map((m, i) => {
                                const barHeight = m.total > 0 ? Math.max(20, (Math.abs(m.nps) / Math.max(maxTrendNPS, 100)) * 180) : 10;
                                const isPositive = m.nps >= 0;
                                return (
                                    <div key={i} className="flex flex-1 flex-col items-center">
                                        <span className={cn(
                                            'mb-1 text-xs font-bold',
                                            m.total === 0 ? 'text-gray-400' : isPositive ? 'text-emerald-600' : 'text-red-600'
                                        )}>
                                            {m.total > 0 ? m.nps : '--'}
                                        </span>
                                        <div
                                            className={cn(
                                                'w-full max-w-[40px] rounded-t transition-all',
                                                m.total === 0 ? 'bg-gray-200' :
                                                    isPositive ? 'bg-gradient-to-b from-emerald-400 to-emerald-500' :
                                                        'bg-gradient-to-b from-red-400 to-red-500'
                                            )}
                                            style={{ height: `${barHeight}px` }}
                                        />
                                        <span className="mt-2 text-xs font-medium text-muted-foreground">{m.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* NPS by Category */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <Building2 className="mr-1.5 inline-block h-4 w-4" /> NPS por Categoria
                    </div>
                    <div className="divide-y divide-border">
                        {categoryNPS.map((cat, i) => {
                            const IconComp = categoryIcons[cat.category] || Star;
                            return (
                                <div key={i} className="flex items-center justify-between px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <IconComp className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{cat.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            'text-sm font-bold',
                                            cat.total === 0 ? 'text-gray-400' : getNPSColor(cat.nps)
                                        )}>
                                            {cat.total > 0 ? cat.nps : '--'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">({cat.total})</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Comments */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-3">
                    <span className="text-sm font-semibold">
                        <MessageSquare className="mr-1.5 inline-block h-4 w-4" /> Respostas Recentes
                    </span>
                    <div className="flex gap-2">
                        <select
                            className="h-8 rounded-lg border border-input bg-white px-2 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="">Todas as categorias</option>
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <select
                            className="h-8 rounded-lg border border-input bg-white px-2 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={filterClassification}
                            onChange={(e) => setFilterClassification(e.target.value)}
                        >
                            <option value="">Todas as notas</option>
                            <option value="promoter">Promotores (9-10)</option>
                            <option value="passive">Passivos (7-8)</option>
                            <option value="detractor">Detratores (0-6)</option>
                        </select>
                    </div>
                </div>
                <div className="divide-y divide-border">
                    {filteredSurveys.slice(0, 10).map((survey) => {
                        const classification = classifyScore(survey.score);
                        return (
                            <div key={survey.id} className="flex items-start gap-4 px-5 py-4">
                                <div className={cn(
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                                    classification === 'promoter' ? 'bg-emerald-500' :
                                        classification === 'passive' ? 'bg-amber-400' : 'bg-red-500'
                                )}>
                                    {survey.score}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <strong className="text-sm">{survey.pacienteNome}</strong>
                                        <span className={cn(
                                            'rounded-md px-2 py-0.5 text-xs font-medium',
                                            classification === 'promoter' ? 'bg-emerald-50 text-emerald-700' :
                                                classification === 'passive' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                        )}>
                                            {classification === 'promoter' ? 'Promotor' : classification === 'passive' ? 'Passivo' : 'Detrator'}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">{survey.comment}</p>
                                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                                        <span>{survey.category}</span>
                                        <span>{survey.date}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filteredSurveys.length === 0 && (
                        <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                            Nenhuma resposta encontrada com os filtros selecionados.
                        </div>
                    )}
                </div>
            </div>

            {/* Survey Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-lg rounded-xl border border-border bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <h2 className="text-lg font-semibold text-foreground">Nova Pesquisa NPS</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-5 p-6">
                            {/* Name */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Nome do Paciente</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="Nome completo (opcional)"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Score Slider */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    De 0 a 10, qual a probabilidade de voce nos recomendar?
                                </label>
                                <div className="mt-3 flex items-center justify-between gap-1">
                                    {Array.from({ length: 11 }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setFormScore(i)}
                                            className={cn(
                                                'flex h-10 w-10 flex-col items-center justify-center rounded-lg border text-sm font-bold transition-all',
                                                formScore === i
                                                    ? i <= 6
                                                        ? 'border-red-400 bg-red-500 text-white'
                                                        : i <= 8
                                                            ? 'border-amber-400 bg-amber-400 text-white'
                                                            : 'border-emerald-400 bg-emerald-500 text-white'
                                                    : 'border-border bg-white text-foreground hover:bg-muted'
                                            )}
                                        >
                                            {i}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                                    <span>Nada provavel</span>
                                    <span>Extremamente provavel</span>
                                </div>
                                <div className="mt-2 text-center text-2xl">{faceEmojis[formScore]}</div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Categoria</label>
                                <select
                                    value={formCategory}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Comentario</label>
                                <textarea
                                    value={formComment}
                                    onChange={(e) => setFormComment(e.target.value)}
                                    placeholder="Conte-nos mais sobre sua experiencia..."
                                    rows={3}
                                    className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
                            <button
                                onClick={() => setShowForm(false)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                            >
                                <Send className="h-4 w-4" /> Enviar Pesquisa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
