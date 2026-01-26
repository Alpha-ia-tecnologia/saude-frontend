import { useState } from 'react';

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
    { fonte: 'PAB Fixo', valor: 850000, cor: 'var(--sus-blue)' },
    { fonte: 'PAB Variável', valor: 620000, cor: 'var(--sus-green)' },
    { fonte: 'MAC', valor: 480000, cor: 'var(--sus-yellow)' },
    { fonte: 'Outros SUS', valor: 350000, cor: '#17a2b8' },
    { fonte: 'Recursos Próprios', valor: 200000, cor: '#6c757d' }
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
        if (percentual >= 80) return 'var(--sus-green)';
        if (percentual >= 50) return 'var(--sus-yellow)';
        return '#dc3545';
    };

    const totalFontes = fonteRecursos.reduce((acc, f) => acc + f.valor, 0);
    const maxMensal = Math.max(...execucaoMensal.map(m => Math.max(m.previsto, m.executado)));

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>
                    <i className="fas fa-coins" style={{ color: 'var(--sus-yellow)', marginRight: '0.5rem' }}></i>
                    Orçamento
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                        className="form-control"
                        style={{ width: 'auto' }}
                        value={unidadeSelecionada}
                        onChange={(e) => setUnidadeSelecionada(e.target.value)}
                    >
                        <option value="todas">Todas as Unidades</option>
                        <option value="centro">UBS Centro</option>
                        <option value="norte">UBS Norte</option>
                        <option value="sul">UBS Sul</option>
                    </select>
                    <select
                        className="form-control"
                        style={{ width: 'auto' }}
                        value={anoSelecionado}
                        onChange={(e) => setAnoSelecionado(e.target.value)}
                    >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-file-pdf"></i> Relatório
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i> Nova Dotação
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ borderTop: '4px solid var(--sus-blue)' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, color: 'var(--sus-gray)', fontSize: '0.85rem' }}>Orçamento Aprovado</p>
                        <h2 style={{ color: 'var(--sus-blue)', margin: '0.5rem 0' }}>{formatCurrency(orcamentoGeral.aprovado)}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>LOA {anoSelecionado}</small>
                    </div>
                </div>
                <div className="card" style={{ borderTop: '4px solid var(--sus-yellow)' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, color: 'var(--sus-gray)', fontSize: '0.85rem' }}>Empenhado</p>
                        <h2 style={{ color: 'var(--sus-yellow)', margin: '0.5rem 0' }}>{formatCurrency(orcamentoGeral.empenhado)}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>{((orcamentoGeral.empenhado / orcamentoGeral.aprovado) * 100).toFixed(1)}% do total</small>
                    </div>
                </div>
                <div className="card" style={{ borderTop: '4px solid var(--sus-green)' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, color: 'var(--sus-gray)', fontSize: '0.85rem' }}>Executado</p>
                        <h2 style={{ color: 'var(--sus-green)', margin: '0.5rem 0' }}>{formatCurrency(orcamentoGeral.executado)}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>{((orcamentoGeral.executado / orcamentoGeral.aprovado) * 100).toFixed(1)}% do total</small>
                    </div>
                </div>
                <div className="card" style={{ borderTop: '4px solid #17a2b8' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, color: 'var(--sus-gray)', fontSize: '0.85rem' }}>Disponível</p>
                        <h2 style={{ color: '#17a2b8', margin: '0.5rem 0' }}>{formatCurrency(orcamentoGeral.disponivel)}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>{((orcamentoGeral.disponivel / orcamentoGeral.aprovado) * 100).toFixed(1)}% restante</small>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Monthly Execution Chart */}
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-chart-area"></i> Execução Mensal
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--sus-blue)', marginRight: '0.25rem' }}></span> Previsto</span>
                            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--sus-green)', marginRight: '0.25rem' }}></span> Executado</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '4px' }}>
                            {execucaoMensal.map((mes, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '2px',
                                        alignItems: 'flex-end',
                                        height: '150px'
                                    }}>
                                        <div style={{
                                            width: '12px',
                                            height: `${(mes.previsto / maxMensal) * 140}px`,
                                            background: 'var(--sus-blue)',
                                            borderRadius: '2px 2px 0 0',
                                            opacity: 0.7
                                        }}></div>
                                        <div style={{
                                            width: '12px',
                                            height: `${(mes.executado / maxMensal) * 140}px`,
                                            background: mes.executado > 0 ? 'var(--sus-green)' : '#e9ecef',
                                            borderRadius: '2px 2px 0 0'
                                        }}></div>
                                    </div>
                                    <small style={{ marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--sus-gray)' }}>{mes.mes}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resources by Source */}
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-wallet"></i> Fontes de Recursos
                    </div>
                    <div className="card-body">
                        {fonteRecursos.map((fonte, i) => (
                            <div key={i} style={{ marginBottom: i < fonteRecursos.length - 1 ? '1rem' : 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '0.85rem' }}>{fonte.fonte}</span>
                                    <strong style={{ fontSize: '0.85rem' }}>{formatCurrency(fonte.valor)}</strong>
                                </div>
                                <div style={{
                                    height: '8px',
                                    background: '#e9ecef',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${(fonte.valor / totalFontes) * 100}%`,
                                        height: '100%',
                                        background: fonte.cor,
                                        borderRadius: '4px'
                                    }}></div>
                                </div>
                                <small style={{ color: 'var(--sus-gray)' }}>{((fonte.valor / totalFontes) * 100).toFixed(1)}%</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Budget Items Table */}
            <div className="card">
                <div className="card-header" style={{ background: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><i className="fas fa-list-alt"></i> Execução por Rubrica</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="text" className="form-control form-control-sm" placeholder="Buscar rubrica..." style={{ width: '200px' }} />
                        <select className="form-control form-control-sm" style={{ width: 'auto' }}>
                            <option>Todas as Categorias</option>
                            <option>Pessoal</option>
                            <option>Custeio</option>
                            <option>Investimento</option>
                        </select>
                    </div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="table" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Rubrica</th>
                                <th>Categoria</th>
                                <th style={{ textAlign: 'right' }}>Aprovado</th>
                                <th style={{ textAlign: 'right' }}>Empenhado</th>
                                <th style={{ textAlign: 'right' }}>Executado</th>
                                <th>Execução</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rubricas.map(rubrica => (
                                <tr key={rubrica.id}>
                                    <td><code>{rubrica.codigo}</code></td>
                                    <td>
                                        <strong>{rubrica.nome}</strong>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${rubrica.categoria === 'Pessoal' ? 'primary' :
                                                rubrica.categoria === 'Custeio' ? 'info' : 'warning'
                                            }`}>
                                            {rubrica.categoria}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(rubrica.aprovado)}</td>
                                    <td style={{ textAlign: 'right', color: 'var(--sus-yellow)' }}>{formatCurrency(rubrica.empenhado)}</td>
                                    <td style={{ textAlign: 'right', color: 'var(--sus-green)' }}>{formatCurrency(rubrica.executado)}</td>
                                    <td style={{ width: '150px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{
                                                flex: 1,
                                                height: '8px',
                                                background: '#e9ecef',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${rubrica.percentual}%`,
                                                    height: '100%',
                                                    background: getProgressColor(rubrica.percentual),
                                                    borderRadius: '4px'
                                                }}></div>
                                            </div>
                                            <span style={{
                                                fontWeight: '600',
                                                fontSize: '0.85rem',
                                                color: getProgressColor(rubrica.percentual)
                                            }}>
                                                {rubrica.percentual}%
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setRubricaSelecionada(rubrica)}
                                                title="Detalhes"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-secondary" title="Editar">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot style={{ background: '#f8f9fa', fontWeight: '600' }}>
                            <tr>
                                <td colSpan="3">TOTAL</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(rubricas.reduce((acc, r) => acc + r.aprovado, 0))}</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(rubricas.reduce((acc, r) => acc + r.empenhado, 0))}</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(rubricas.reduce((acc, r) => acc + r.executado, 0))}</td>
                                <td colSpan="2"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {rubricaSelecionada && (
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
                    onClick={() => setRubricaSelecionada(null)}
                >
                    <div
                        className="card"
                        style={{ width: '600px', maxWidth: '90%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-blue)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-file-invoice-dollar"></i> Detalhes da Rubrica</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setRubricaSelecionada(null)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <h5>{rubricaSelecionada.nome}</h5>
                            <p><code>{rubricaSelecionada.codigo}</code> - {rubricaSelecionada.categoria}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="card" style={{ background: '#f8f9fa' }}>
                                    <div className="card-body" style={{ padding: '1rem', textAlign: 'center' }}>
                                        <small style={{ color: 'var(--sus-gray)' }}>Aprovado</small>
                                        <h4 style={{ margin: '0.25rem 0', color: 'var(--sus-blue)' }}>{formatCurrency(rubricaSelecionada.aprovado)}</h4>
                                    </div>
                                </div>
                                <div className="card" style={{ background: '#f8f9fa' }}>
                                    <div className="card-body" style={{ padding: '1rem', textAlign: 'center' }}>
                                        <small style={{ color: 'var(--sus-gray)' }}>Executado</small>
                                        <h4 style={{ margin: '0.25rem 0', color: 'var(--sus-green)' }}>{formatCurrency(rubricaSelecionada.executado)}</h4>
                                    </div>
                                </div>
                            </div>

                            <h6>Execução</h6>
                            <div style={{
                                height: '20px',
                                background: '#e9ecef',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                marginBottom: '0.5rem'
                            }}>
                                <div style={{
                                    width: `${rubricaSelecionada.percentual}%`,
                                    height: '100%',
                                    background: `linear-gradient(90deg, var(--sus-green), ${getProgressColor(rubricaSelecionada.percentual)})`,
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '0.85rem'
                                }}>
                                    {rubricaSelecionada.percentual}%
                                </div>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--sus-gray)' }}>
                                Saldo disponível: <strong>{formatCurrency(rubricaSelecionada.aprovado - rubricaSelecionada.empenhado)}</strong>
                            </p>

                            <h6>Últimas Movimentações</h6>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Descrição</th>
                                        <th style={{ textAlign: 'right' }}>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>25/01/2025</td>
                                        <td>Pagamento NF 1234</td>
                                        <td style={{ textAlign: 'right', color: '#dc3545' }}>-R$ 15.000</td>
                                    </tr>
                                    <tr>
                                        <td>20/01/2025</td>
                                        <td>Empenho nº 456</td>
                                        <td style={{ textAlign: 'right', color: 'var(--sus-yellow)' }}>R$ 25.000</td>
                                    </tr>
                                    <tr>
                                        <td>15/01/2025</td>
                                        <td>Pagamento NF 1198</td>
                                        <td style={{ textAlign: 'right', color: '#dc3545' }}>-R$ 8.500</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button className="btn btn-outline-secondary">
                                    <i className="fas fa-file-pdf"></i> Exportar
                                </button>
                                <button className="btn btn-primary">
                                    <i className="fas fa-plus"></i> Novo Empenho
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
