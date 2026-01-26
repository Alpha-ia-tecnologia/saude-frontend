import { useState } from 'react';

// Sample data for dashboard
const kpisData = {
    atendimentos: { valor: 1247, variacao: 12, periodo: 'este mês' },
    pacientes: { valor: 3456, variacao: 5, periodo: 'cadastrados' },
    consultas: { valor: 89, variacao: -3, periodo: 'hoje' },
    satisfacao: { valor: 4.7, variacao: 0.2, periodo: 'média 5.0' }
};

const atendimentosDiarios = [
    { dia: 'Seg', consultas: 145, procedimentos: 45, urgencias: 12 },
    { dia: 'Ter', consultas: 132, procedimentos: 38, urgencias: 15 },
    { dia: 'Qua', consultas: 156, procedimentos: 52, urgencias: 8 },
    { dia: 'Qui', consultas: 128, procedimentos: 41, urgencias: 18 },
    { dia: 'Sex', consultas: 167, procedimentos: 55, urgencias: 11 },
    { dia: 'Sáb', consultas: 78, procedimentos: 22, urgencias: 6 }
];

const distribuicaoAtendimentos = [
    { tipo: 'Consultas Médicas', valor: 45, cor: 'var(--sus-blue)' },
    { tipo: 'Enfermagem', valor: 25, cor: 'var(--sus-green)' },
    { tipo: 'Odontologia', valor: 15, cor: 'var(--sus-yellow)' },
    { tipo: 'Procedimentos', valor: 10, cor: '#17a2b8' },
    { tipo: 'Outros', valor: 5, cor: '#6c757d' }
];

const doencasMaisFrequentes = [
    { cid: 'I10', nome: 'Hipertensão Essencial', casos: 234, percentual: 18.7 },
    { cid: 'E11', nome: 'Diabetes Mellitus Tipo 2', casos: 189, percentual: 15.2 },
    { cid: 'J06', nome: 'IVAS', casos: 156, percentual: 12.5 },
    { cid: 'M54', nome: 'Dorsalgia', casos: 98, percentual: 7.9 },
    { cid: 'F32', nome: 'Episódio Depressivo', casos: 87, percentual: 7.0 },
    { cid: 'J45', nome: 'Asma', casos: 76, percentual: 6.1 }
];

const alertasAtivos = [
    { tipo: 'urgente', mensagem: '23 pacientes diabéticos sem HbA1c há mais de 6 meses', icone: 'fa-exclamation-triangle' },
    { tipo: 'atencao', mensagem: '45 gestantes com consulta de pré-natal em atraso', icone: 'fa-calendar-times' },
    { tipo: 'info', mensagem: '12 medicamentos com estoque abaixo do mínimo', icone: 'fa-pills' }
];

const metasUnidade = [
    { indicador: 'Cobertura Pré-Natal', meta: 85, atual: 78, unidade: '%' },
    { indicador: 'Hipertensos Controlados', meta: 70, atual: 65, unidade: '%' },
    { indicador: 'Diabéticos Controlados', meta: 65, atual: 58, unidade: '%' },
    { indicador: 'Vacinas em Dia (<1 ano)', meta: 95, atual: 92, unidade: '%' },
    { indicador: 'Consultas Realizadas', meta: 3000, atual: 2847, unidade: '' }
];

export default function Dashboard() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');
    const [unidadeSelecionada, setUnidadeSelecionada] = useState('todas');

    const maxBarValue = Math.max(...atendimentosDiarios.map(d => d.consultas + d.procedimentos + d.urgencias));

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>
                    <i className="fas fa-chart-line" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                    Dashboard de Análise
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
                        value={periodoSelecionado}
                        onChange={(e) => setPeriodoSelecionado(e.target.value)}
                    >
                        <option value="semana">Esta Semana</option>
                        <option value="mes">Este Mês</option>
                        <option value="trimestre">Trimestre</option>
                        <option value="ano">Este Ano</option>
                    </select>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-sync-alt"></i> Atualizar
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-file-export"></i> Exportar
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--sus-blue), var(--sus-light-blue))', color: 'white' }}>
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: 0, opacity: 0.9 }}>Atendimentos</p>
                                <h2 style={{ margin: '0.5rem 0' }}>{kpisData.atendimentos.valor.toLocaleString()}</h2>
                                <small style={{ opacity: 0.8 }}>{kpisData.atendimentos.periodo}</small>
                            </div>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-stethoscope fa-lg"></i>
                            </div>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <span style={{
                                background: kpisData.atendimentos.variacao >= 0 ? 'rgba(255,255,255,0.3)' : 'rgba(220,53,69,0.5)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.85rem'
                            }}>
                                <i className={`fas fa-arrow-${kpisData.atendimentos.variacao >= 0 ? 'up' : 'down'}`}></i>
                                {' '}{Math.abs(kpisData.atendimentos.variacao)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, var(--sus-green), #20c997)', color: 'white' }}>
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: 0, opacity: 0.9 }}>Pacientes</p>
                                <h2 style={{ margin: '0.5rem 0' }}>{kpisData.pacientes.valor.toLocaleString()}</h2>
                                <small style={{ opacity: 0.8 }}>{kpisData.pacientes.periodo}</small>
                            </div>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-users fa-lg"></i>
                            </div>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <span style={{
                                background: 'rgba(255,255,255,0.3)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.85rem'
                            }}>
                                <i className="fas fa-arrow-up"></i>
                                {' '}{kpisData.pacientes.variacao}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #17a2b8, #6610f2)', color: 'white' }}>
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: 0, opacity: 0.9 }}>Consultas Hoje</p>
                                <h2 style={{ margin: '0.5rem 0' }}>{kpisData.consultas.valor}</h2>
                                <small style={{ opacity: 0.8 }}>{kpisData.consultas.periodo}</small>
                            </div>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-calendar-check fa-lg"></i>
                            </div>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <span style={{
                                background: kpisData.consultas.variacao >= 0 ? 'rgba(255,255,255,0.3)' : 'rgba(220,53,69,0.5)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.85rem'
                            }}>
                                <i className={`fas fa-arrow-${kpisData.consultas.variacao >= 0 ? 'up' : 'down'}`}></i>
                                {' '}{Math.abs(kpisData.consultas.variacao)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, var(--sus-yellow), #fd7e14)', color: 'white' }}>
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: 0, opacity: 0.9 }}>Satisfação</p>
                                <h2 style={{ margin: '0.5rem 0' }}>{kpisData.satisfacao.valor}</h2>
                                <small style={{ opacity: 0.8 }}>{kpisData.satisfacao.periodo}</small>
                            </div>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-smile fa-lg"></i>
                            </div>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <span style={{
                                background: 'rgba(255,255,255,0.3)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.85rem'
                            }}>
                                <i className="fas fa-arrow-up"></i>
                                {' '}+{kpisData.satisfacao.variacao}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Bar Chart */}
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-chart-bar"></i> Atendimentos por Dia da Semana
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--sus-blue)', marginRight: '0.25rem' }}></span> Consultas</span>
                            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--sus-green)', marginRight: '0.25rem' }}></span> Procedimentos</span>
                            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#dc3545', marginRight: '0.25rem' }}></span> Urgências</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', gap: '0.5rem' }}>
                            {atendimentosDiarios.map((dia, i) => {
                                const total = dia.consultas + dia.procedimentos + dia.urgencias;
                                const altura = (total / maxBarValue) * 180;
                                return (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                        <div style={{
                                            width: '100%',
                                            maxWidth: '50px',
                                            height: `${altura}px`,
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <div style={{
                                                flex: dia.urgencias,
                                                background: '#dc3545',
                                                borderRadius: '4px 4px 0 0'
                                            }}></div>
                                            <div style={{
                                                flex: dia.procedimentos,
                                                background: 'var(--sus-green)'
                                            }}></div>
                                            <div style={{
                                                flex: dia.consultas,
                                                background: 'var(--sus-blue)',
                                                borderRadius: '0 0 4px 4px'
                                            }}></div>
                                        </div>
                                        <span style={{ marginTop: '0.5rem', fontWeight: '500', color: 'var(--sus-gray)' }}>{dia.dia}</span>
                                        <small style={{ color: 'var(--sus-gray)' }}>{total}</small>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-chart-pie"></i> Distribuição por Tipo
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <div style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                background: `conic-gradient(
                                    var(--sus-blue) 0deg ${45 * 3.6}deg,
                                    var(--sus-green) ${45 * 3.6}deg ${(45 + 25) * 3.6}deg,
                                    var(--sus-yellow) ${70 * 3.6}deg ${85 * 3.6}deg,
                                    #17a2b8 ${85 * 3.6}deg ${95 * 3.6}deg,
                                    #6c757d ${95 * 3.6}deg 360deg
                                )`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column'
                                }}>
                                    <strong style={{ fontSize: '1.25rem' }}>1.2K</strong>
                                    <small style={{ color: 'var(--sus-gray)' }}>Total</small>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {distribuicaoAtendimentos.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '12px', height: '12px', background: item.cor, borderRadius: '2px' }}></div>
                                        <span style={{ fontSize: '0.85rem' }}>{item.tipo}</span>
                                    </div>
                                    <strong>{item.valor}%</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                {/* Alerts */}
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-bell"></i> Alertas Ativos
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        {alertasAtivos.map((alerta, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '1rem',
                                    borderBottom: i < alertasAtivos.length - 1 ? '1px solid #e9ecef' : 'none',
                                    display: 'flex',
                                    gap: '0.75rem',
                                    alignItems: 'flex-start'
                                }}
                            >
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: alerta.tipo === 'urgente' ? '#dc3545' :
                                        alerta.tipo === 'atencao' ? 'var(--sus-yellow)' : 'var(--sus-blue)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <i className={`fas ${alerta.icone}`}></i>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>{alerta.mensagem}</p>
                            </div>
                        ))}
                        <div style={{ padding: '0.75rem', textAlign: 'center' }}>
                            <a href="#" style={{ fontSize: '0.85rem' }}>Ver todos os alertas</a>
                        </div>
                    </div>
                </div>

                {/* Top Diseases */}
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-disease"></i> Doenças Mais Frequentes
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <table className="table table-sm" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>CID</th>
                                    <th>Doença</th>
                                    <th>Casos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doencasMaisFrequentes.slice(0, 5).map((doenca, i) => (
                                    <tr key={i}>
                                        <td><code>{doenca.cid}</code></td>
                                        <td style={{ fontSize: '0.85rem' }}>{doenca.nome}</td>
                                        <td>
                                            <strong>{doenca.casos}</strong>
                                            <br />
                                            <small style={{ color: 'var(--sus-gray)' }}>{doenca.percentual}%</small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Goals */}
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-bullseye"></i> Metas da Unidade
                    </div>
                    <div className="card-body">
                        {metasUnidade.map((meta, i) => {
                            const percentual = (meta.atual / meta.meta) * 100;
                            const cor = percentual >= 90 ? 'var(--sus-green)' :
                                percentual >= 70 ? 'var(--sus-yellow)' : '#dc3545';
                            return (
                                <div key={i} style={{ marginBottom: i < metasUnidade.length - 1 ? '1rem' : 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.85rem' }}>{meta.indicador}</span>
                                        <span style={{ fontSize: '0.85rem' }}>
                                            <strong style={{ color: cor }}>{meta.atual}{meta.unidade}</strong>
                                            <span style={{ color: 'var(--sus-gray)' }}> / {meta.meta}{meta.unidade}</span>
                                        </span>
                                    </div>
                                    <div style={{
                                        height: '8px',
                                        background: '#e9ecef',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${Math.min(100, percentual)}%`,
                                            height: '100%',
                                            background: cor,
                                            borderRadius: '4px',
                                            transition: 'width 0.5s ease'
                                        }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
