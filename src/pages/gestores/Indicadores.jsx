import { useState } from 'react';

// Indicators data by category
const indicadoresData = {
    atencaoBasica: [
        { id: 1, nome: 'Cobertura de Pré-Natal', valor: 82, meta: 85, unidade: '%', tendencia: 'up' },
        { id: 2, nome: 'Gestantes com 7+ Consultas', valor: 68, meta: 75, unidade: '%', tendencia: 'up' },
        { id: 3, nome: 'Crianças com Vacinas em Dia (<1a)', valor: 92, meta: 95, unidade: '%', tendencia: 'down' },
        { id: 4, nome: 'Hipertensos Acompanhados', valor: 78, meta: 80, unidade: '%', tendencia: 'up' },
        { id: 5, nome: 'Diabéticos com HbA1c <7', valor: 45, meta: 60, unidade: '%', tendencia: 'stable' }
    ],
    producao: [
        { id: 6, nome: 'Consultas Médicas', valor: 4523, meta: 4500, unidade: '', tendencia: 'up' },
        { id: 7, nome: 'Consultas de Enfermagem', valor: 3210, meta: 3000, unidade: '', tendencia: 'up' },
        { id: 8, nome: 'Visitas Domiciliares ACS', valor: 8945, meta: 9000, unidade: '', tendencia: 'down' },
        { id: 9, nome: 'Procedimentos', valor: 2156, meta: 2000, unidade: '', tendencia: 'up' },
        { id: 10, nome: 'Atendimentos Odontológicos', valor: 1567, meta: 1800, unidade: '', tendencia: 'stable' }
    ],
    qualidade: [
        { id: 11, nome: 'Satisfação do Usuário', valor: 4.7, meta: 4.5, unidade: '/5', tendencia: 'up' },
        { id: 12, nome: 'Tempo Médio de Espera', valor: 18, meta: 15, unidade: 'min', tendencia: 'down', invertido: true },
        { id: 13, nome: 'Retorno em 7 dias', valor: 8, meta: 5, unidade: '%', tendencia: 'up', invertido: true },
        { id: 14, nome: 'Absenteísmo Consultas', valor: 12, meta: 10, unidade: '%', tendencia: 'stable', invertido: true },
        { id: 15, nome: 'Resolubilidade AB', valor: 85, meta: 85, unidade: '%', tendencia: 'up' }
    ],
    financeiro: [
        { id: 16, nome: 'Execução Orçamentária', valor: 73.9, meta: 75, unidade: '%', tendencia: 'up' },
        { id: 17, nome: 'Custo por Atendimento', valor: 45, meta: 50, unidade: 'R$', tendencia: 'down' },
        { id: 18, nome: 'Produção BPA Enviada', valor: 98, meta: 100, unidade: '%', tendencia: 'up' },
        { id: 19, nome: 'Glosas', valor: 2.3, meta: 3, unidade: '%', tendencia: 'down' }
    ]
};

const categorias = [
    { id: 'atencaoBasica', nome: 'Atenção Básica', icone: 'fa-heartbeat', cor: 'var(--sus-blue)' },
    { id: 'producao', nome: 'Produção', icone: 'fa-chart-bar', cor: 'var(--sus-green)' },
    { id: 'qualidade', nome: 'Qualidade', icone: 'fa-star', cor: 'var(--sus-yellow)' },
    { id: 'financeiro', nome: 'Financeiro', icone: 'fa-coins', cor: '#17a2b8' }
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
            return percentual <= 100 ? 'var(--sus-green)' : percentual <= 120 ? 'var(--sus-yellow)' : '#dc3545';
        }
        return percentual >= 100 ? 'var(--sus-green)' : percentual >= 85 ? 'var(--sus-yellow)' : '#dc3545';
    };

    const getTendenciaIcon = (tendencia) => {
        if (tendencia === 'up') return { icon: 'fa-arrow-up', color: 'var(--sus-green)' };
        if (tendencia === 'down') return { icon: 'fa-arrow-down', color: '#dc3545' };
        return { icon: 'fa-minus', color: 'var(--sus-gray)' };
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

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>
                        <i className="fas fa-chart-line" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                        Indicadores de Desempenho
                    </h1>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--sus-gray)' }}>Monitoramento de metas e resultados</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                        className="form-control"
                        style={{ width: 'auto' }}
                        value={periodoSelecionado}
                        onChange={(e) => setPeriodoSelecionado(e.target.value)}
                    >
                        <option value="mes">Este Mês</option>
                        <option value="trimestre">Trimestre</option>
                        <option value="semestre">Semestre</option>
                        <option value="ano">Este Ano</option>
                    </select>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-file-excel"></i> Exportar
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-blue)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-blue)', margin: 0 }}>{resumo.total}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Total Indicadores</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-green)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-green)', margin: 0 }}>{resumo.atingidos}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Meta Atingida</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-yellow)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-yellow)', margin: 0 }}>{resumo.atencao}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Atenção</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #dc3545' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: '#dc3545', margin: 0 }}>{resumo.criticos}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Críticos</small>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body" style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {categorias.map(cat => (
                            <button
                                key={cat.id}
                                className={`btn ${categoriaSelecionada === cat.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setCategoriaSelecionada(cat.id)}
                                style={{ flex: 1 }}
                            >
                                <i className={`fas ${cat.icone}`} style={{ marginRight: '0.5rem' }}></i>
                                {cat.nome}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Indicators Table */}
            <div className="card">
                <div className="card-header" style={{ background: '#f8f9fa' }}>
                    <i className={`fas ${categorias.find(c => c.id === categoriaSelecionada)?.icone}`}></i>
                    {' '}{categorias.find(c => c.id === categoriaSelecionada)?.nome}
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="table" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>Indicador</th>
                                <th style={{ textAlign: 'center' }}>Valor Atual</th>
                                <th style={{ textAlign: 'center' }}>Meta</th>
                                <th style={{ width: '200px' }}>Progresso</th>
                                <th style={{ textAlign: 'center' }}>Tendência</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {indicadoresAtuais.map(ind => {
                                const statusColor = getStatusColor(ind.valor, ind.meta, ind.invertido);
                                const percentual = Math.min(100, (ind.valor / ind.meta) * 100);
                                const tendencia = getTendenciaIcon(ind.tendencia);
                                return (
                                    <tr key={ind.id}>
                                        <td><strong>{ind.nome}</strong></td>
                                        <td style={{ textAlign: 'center' }}>
                                            <strong style={{ color: statusColor, fontSize: '1.1rem' }}>
                                                {ind.valor}{ind.unidade}
                                            </strong>
                                        </td>
                                        <td style={{ textAlign: 'center', color: 'var(--sus-gray)' }}>
                                            {ind.meta}{ind.unidade}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{
                                                    flex: 1,
                                                    height: '10px',
                                                    background: '#e9ecef',
                                                    borderRadius: '5px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${percentual}%`,
                                                        height: '100%',
                                                        background: statusColor,
                                                        borderRadius: '5px',
                                                        transition: 'width 0.5s ease'
                                                    }}></div>
                                                </div>
                                                <span style={{ fontWeight: '600', fontSize: '0.85rem', color: statusColor }}>
                                                    {percentual.toFixed(0)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <i className={`fas ${tendencia.icon}`} style={{ color: tendencia.color }}></i>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setIndicadorSelecionado(ind)}
                                            >
                                                <i className="fas fa-chart-line"></i> Detalhes
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
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setIndicadorSelecionado(null)}
                >
                    <div
                        className="card"
                        style={{ width: '700px', maxWidth: '90%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-blue)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-chart-line"></i> {indicadorSelecionado.nome}</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setIndicadorSelecionado(null)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div className="card" style={{ background: '#f8f9fa' }}>
                                    <div className="card-body" style={{ padding: '1rem', textAlign: 'center' }}>
                                        <small style={{ color: 'var(--sus-gray)' }}>Valor Atual</small>
                                        <h3 style={{ margin: '0.25rem 0', color: getStatusColor(indicadorSelecionado.valor, indicadorSelecionado.meta, indicadorSelecionado.invertido) }}>
                                            {indicadorSelecionado.valor}{indicadorSelecionado.unidade}
                                        </h3>
                                    </div>
                                </div>
                                <div className="card" style={{ background: '#f8f9fa' }}>
                                    <div className="card-body" style={{ padding: '1rem', textAlign: 'center' }}>
                                        <small style={{ color: 'var(--sus-gray)' }}>Meta</small>
                                        <h3 style={{ margin: '0.25rem 0' }}>{indicadorSelecionado.meta}{indicadorSelecionado.unidade}</h3>
                                    </div>
                                </div>
                                <div className="card" style={{ background: '#f8f9fa' }}>
                                    <div className="card-body" style={{ padding: '1rem', textAlign: 'center' }}>
                                        <small style={{ color: 'var(--sus-gray)' }}>Alcance</small>
                                        <h3 style={{ margin: '0.25rem 0' }}>{((indicadorSelecionado.valor / indicadorSelecionado.meta) * 100).toFixed(1)}%</h3>
                                    </div>
                                </div>
                            </div>

                            <h6>Evolução Mensal</h6>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '150px', background: '#f8f9fa', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                                {historicoMensal.map((mes, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{
                                            width: '30px',
                                            height: `${mes.valor}px`,
                                            background: 'var(--sus-blue)',
                                            borderRadius: '4px 4px 0 0'
                                        }}></div>
                                        <small style={{ marginTop: '0.25rem', fontSize: '0.7rem' }}>{mes.mes}</small>
                                    </div>
                                ))}
                            </div>

                            <h6>Análise por Unidade</h6>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Unidade</th>
                                        <th>Valor</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>UBS Centro</td>
                                        <td>{(indicadorSelecionado.valor * 1.05).toFixed(1)}{indicadorSelecionado.unidade}</td>
                                        <td><span className="badge badge-success">Atingida</span></td>
                                    </tr>
                                    <tr>
                                        <td>UBS Norte</td>
                                        <td>{(indicadorSelecionado.valor * 0.92).toFixed(1)}{indicadorSelecionado.unidade}</td>
                                        <td><span className="badge badge-warning">Atenção</span></td>
                                    </tr>
                                    <tr>
                                        <td>UBS Sul</td>
                                        <td>{(indicadorSelecionado.valor * 0.98).toFixed(1)}{indicadorSelecionado.unidade}</td>
                                        <td><span className="badge badge-success">Atingida</span></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button className="btn btn-outline-secondary">
                                    <i className="fas fa-file-pdf"></i> Relatório
                                </button>
                                <button className="btn btn-primary">
                                    <i className="fas fa-bullseye"></i> Definir Ação
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
