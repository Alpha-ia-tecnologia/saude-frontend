import { useState } from 'react';

// Executive KPIs
const kpisExecutivos = {
    orcamentoExecutado: { valor: 73.9, meta: 75, unidade: '%' },
    satisfacaoUsuario: { valor: 4.7, meta: 4.5, unidade: '/5.0' },
    coberturaVacinal: { valor: 92, meta: 95, unidade: '%' },
    tempoMedioEspera: { valor: 18, meta: 15, unidade: 'min' }
};

// Units performance
const desempenhoUnidades = [
    { nome: 'UBS Centro', atendimentos: 1234, meta: 1200, satisfacao: 4.8, cobertura: 94 },
    { nome: 'UBS Norte', atendimentos: 987, meta: 1000, satisfacao: 4.5, cobertura: 91 },
    { nome: 'UBS Sul', atendimentos: 856, meta: 900, satisfacao: 4.6, cobertura: 89 },
    { nome: 'UBS Leste', atendimentos: 1102, meta: 1100, satisfacao: 4.4, cobertura: 93 },
    { nome: 'UBS Oeste', atendimentos: 745, meta: 800, satisfacao: 4.7, cobertura: 88 }
];

// Priority alerts
const alertasPrioritarios = [
    { tipo: 'critico', titulo: 'Estoque Crítico', descricao: '3 medicamentos essenciais abaixo do nível mínimo', acao: 'Ver Estoque' },
    { tipo: 'atencao', titulo: 'Metas de Cobertura', descricao: 'UBS Oeste abaixo da meta de cobertura vacinal', acao: 'Ver Relatório' },
    { tipo: 'info', titulo: 'Orçamento', descricao: 'R$ 400.000 disponíveis para investimento', acao: 'Ver Detalhes' }
];

// Monthly trend data
const tendenciaMensal = [
    { mes: 'Jul', atendimentos: 4500, custos: 380000 },
    { mes: 'Ago', atendimentos: 4750, custos: 395000 },
    { mes: 'Set', atendimentos: 4900, custos: 410000 },
    { mes: 'Out', atendimentos: 5100, custos: 425000 },
    { mes: 'Nov', atendimentos: 5250, custos: 440000 },
    { mes: 'Dez', atendimentos: 5400, custos: 455000 }
];

// Resource allocation
const alocacaoRecursos = [
    { categoria: 'Pessoal', percentual: 55, valor: 1375000 },
    { categoria: 'Insumos', percentual: 20, valor: 500000 },
    { categoria: 'Infraestrutura', percentual: 10, valor: 250000 },
    { categoria: 'Equipamentos', percentual: 8, valor: 200000 },
    { categoria: 'Outros', percentual: 7, valor: 175000 }
];

export default function Dashboard() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0
        }).format(value);
    };

    const getKpiStatus = (valor, meta, invertido = false) => {
        const percentual = (valor / meta) * 100;
        if (invertido) {
            return percentual <= 100 ? 'success' : 'danger';
        }
        return percentual >= 100 ? 'success' : percentual >= 90 ? 'warning' : 'danger';
    };

    const maxAtendimentos = Math.max(...tendenciaMensal.map(t => t.atendimentos));

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>
                        <i className="fas fa-tachometer-alt" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                        Dashboard Gerencial
                    </h1>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--sus-gray)' }}>Visão executiva de todas as unidades</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                        className="form-control"
                        style={{ width: 'auto' }}
                        value={periodoSelecionado}
                        onChange={(e) => setPeriodoSelecionado(e.target.value)}
                    >
                        <option value="semana">Esta Semana</option>
                        <option value="mes">Este Mês</option>
                        <option value="trimestre">Trimestre</option>
                        <option value="ano">Este Ano</option>
                    </select>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-file-pdf"></i> Exportar
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-sync-alt"></i> Atualizar
                    </button>
                </div>
            </div>

            {/* Executive KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card">
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: 0, color: 'var(--sus-gray)', fontSize: '0.85rem' }}>Execução Orçamentária</p>
                                <h2 style={{ margin: '0.5rem 0', color: 'var(--sus-blue)' }}>
                                    {kpisExecutivos.orcamentoExecutado.valor}{kpisExecutivos.orcamentoExecutado.unidade}
                                </h2>
                                <small>Meta: {kpisExecutivos.orcamentoExecutado.meta}%</small>
                            </div>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: `conic-gradient(var(--sus-blue) ${kpisExecutivos.orcamentoExecutado.valor * 3.6}deg, #e9ecef 0deg)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-coins" style={{ color: 'var(--sus-blue)' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: 0, color: 'var(--sus-gray)', fontSize: '0.85rem' }}>Satisfação do Usuário</p>
                                <h2 style={{ margin: '0.5rem 0', color: 'var(--sus-green)' }}>
                                    {kpisExecutivos.satisfacaoUsuario.valor}{kpisExecutivos.satisfacaoUsuario.unidade}
                                </h2>
                                <small>Meta: {kpisExecutivos.satisfacaoUsuario.meta}/5.0</small>
                            </div>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: `conic-gradient(var(--sus-green) ${(kpisExecutivos.satisfacaoUsuario.valor / 5) * 360}deg, #e9ecef 0deg)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-smile" style={{ color: 'var(--sus-green)' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: 0, color: 'var(--sus-gray)', fontSize: '0.85rem' }}>Cobertura Vacinal</p>
                                <h2 style={{ margin: '0.5rem 0', color: 'var(--sus-yellow)' }}>
                                    {kpisExecutivos.coberturaVacinal.valor}{kpisExecutivos.coberturaVacinal.unidade}
                                </h2>
                                <small>Meta: {kpisExecutivos.coberturaVacinal.meta}%</small>
                            </div>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: `conic-gradient(var(--sus-yellow) ${kpisExecutivos.coberturaVacinal.valor * 3.6}deg, #e9ecef 0deg)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-syringe" style={{ color: 'var(--sus-yellow)' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: 0, color: 'var(--sus-gray)', fontSize: '0.85rem' }}>Tempo Médio de Espera</p>
                                <h2 style={{ margin: '0.5rem 0', color: '#dc3545' }}>
                                    {kpisExecutivos.tempoMedioEspera.valor}{kpisExecutivos.tempoMedioEspera.unidade}
                                </h2>
                                <small>Meta: {kpisExecutivos.tempoMedioEspera.meta} min</small>
                            </div>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: `conic-gradient(#dc3545 ${Math.min(100, (kpisExecutivos.tempoMedioEspera.valor / 30) * 100) * 3.6}deg, #e9ecef 0deg)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-clock" style={{ color: '#dc3545' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Trend Chart */}
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-chart-line"></i> Tendência de Atendimentos
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', gap: '1rem' }}>
                            {tendenciaMensal.map((mes, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                    <div style={{
                                        width: '100%',
                                        maxWidth: '60px',
                                        height: `${(mes.atendimentos / maxAtendimentos) * 160}px`,
                                        background: 'linear-gradient(180deg, var(--sus-blue), var(--sus-light-blue))',
                                        borderRadius: '4px 4px 0 0',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {(mes.atendimentos / 1000).toFixed(1)}k
                                        </span>
                                    </div>
                                    <span style={{ marginTop: '0.5rem', fontWeight: '500', color: 'var(--sus-gray)' }}>{mes.mes}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resource Allocation */}
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-chart-pie"></i> Alocação de Recursos
                    </div>
                    <div className="card-body">
                        {alocacaoRecursos.map((item, i) => (
                            <div key={i} style={{ marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '0.85rem' }}>{item.categoria}</span>
                                    <strong style={{ fontSize: '0.85rem' }}>{item.percentual}%</strong>
                                </div>
                                <div style={{ height: '8px', background: '#e9ecef', borderRadius: '4px' }}>
                                    <div style={{
                                        width: `${item.percentual}%`,
                                        height: '100%',
                                        background: i === 0 ? 'var(--sus-blue)' :
                                            i === 1 ? 'var(--sus-green)' :
                                                i === 2 ? 'var(--sus-yellow)' :
                                                    i === 3 ? '#17a2b8' : '#6c757d',
                                        borderRadius: '4px'
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Units Performance */}
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-hospital"></i> Desempenho por Unidade
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <table className="table" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>Unidade</th>
                                    <th>Atend.</th>
                                    <th>Meta</th>
                                    <th>Satisf.</th>
                                    <th>Cob.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {desempenhoUnidades.map((unidade, i) => (
                                    <tr key={i}>
                                        <td><strong>{unidade.nome}</strong></td>
                                        <td>{unidade.atendimentos}</td>
                                        <td>
                                            <span className={`badge badge-${unidade.atendimentos >= unidade.meta ? 'success' : 'warning'}`}>
                                                {unidade.atendimentos >= unidade.meta ? '✓' : `${Math.round((unidade.atendimentos / unidade.meta) * 100)}%`}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ color: unidade.satisfacao >= 4.5 ? 'var(--sus-green)' : 'var(--sus-yellow)' }}>
                                                ★ {unidade.satisfacao}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ color: unidade.cobertura >= 90 ? 'var(--sus-green)' : '#dc3545' }}>
                                                {unidade.cobertura}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Priority Alerts */}
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-bell"></i> Alertas Prioritários
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        {alertasPrioritarios.map((alerta, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '1rem',
                                    borderBottom: i < alertasPrioritarios.length - 1 ? '1px solid #e9ecef' : 'none',
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: alerta.tipo === 'critico' ? '#dc3545' :
                                        alerta.tipo === 'atencao' ? 'var(--sus-yellow)' : 'var(--sus-blue)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <i className={`fas ${alerta.tipo === 'critico' ? 'fa-exclamation-triangle' :
                                        alerta.tipo === 'atencao' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <strong>{alerta.titulo}</strong>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--sus-gray)' }}>{alerta.descricao}</p>
                                </div>
                                <button className="btn btn-sm btn-outline-primary">{alerta.acao}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
