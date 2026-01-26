import { useState } from 'react';

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
        const colors = { alto: 'danger', medio: 'warning', baixo: 'success' };
        const labels = { alto: 'Alto', medio: 'Médio', baixo: 'Baixo' };
        return <span className={`badge badge-${colors[risco]}`}>{labels[risco]}</span>;
    };

    const getStatusBadge = (status) => {
        const config = {
            controlado: { color: 'success', label: 'Controlado', icon: 'fa-check-circle' },
            atencao: { color: 'warning', label: 'Atenção', icon: 'fa-exclamation-circle' },
            critico: { color: 'danger', label: 'Crítico', icon: 'fa-times-circle' }
        };
        const s = config[status] || config.controlado;
        return (
            <span className={`badge badge-${s.color}`}>
                <i className={`fas ${s.icon}`} style={{ marginRight: '0.25rem' }}></i>
                {s.label}
            </span>
        );
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>
                    <i className="fas fa-heartbeat" style={{ color: 'var(--sus-red, #dc3545)', marginRight: '0.5rem' }}></i>
                    Condições Crônicas
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-file-export"></i> Exportar
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i> Cadastrar Paciente
                    </button>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-blue)' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--sus-blue)', margin: 0 }}>{estatisticas.total}</h2>
                        <p style={{ margin: 0, color: 'var(--sus-gray)' }}>Total de Pacientes</p>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-green)' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--sus-green)', margin: 0 }}>{estatisticas.controlados}</h2>
                        <p style={{ margin: 0, color: 'var(--sus-gray)' }}>Controlados</p>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-yellow)' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--sus-yellow)', margin: 0 }}>{estatisticas.atencao}</h2>
                        <p style={{ margin: 0, color: 'var(--sus-gray)' }}>Atenção Necessária</p>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #dc3545' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#dc3545', margin: 0 }}>{estatisticas.criticos}</h2>
                        <p style={{ margin: 0, color: 'var(--sus-gray)' }}>Situação Crítica</p>
                    </div>
                </div>
            </div>

            {/* Conditions Distribution */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-chart-pie"></i> Distribuição por Condição
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span>Hipertensão</span>
                                    <strong>{estatisticas.hipertensao}</strong>
                                </div>
                                <div style={{ height: '8px', background: '#e9ecef', borderRadius: '4px' }}>
                                    <div style={{ width: `${(estatisticas.hipertensao / estatisticas.total) * 100}%`, height: '100%', background: 'var(--sus-blue)', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span>Diabetes</span>
                                    <strong>{estatisticas.diabetes}</strong>
                                </div>
                                <div style={{ height: '8px', background: '#e9ecef', borderRadius: '4px' }}>
                                    <div style={{ width: `${(estatisticas.diabetes / estatisticas.total) * 100}%`, height: '100%', background: 'var(--sus-green)', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span>DPOC</span>
                                    <strong>{estatisticas.dpoc}</strong>
                                </div>
                                <div style={{ height: '8px', background: '#e9ecef', borderRadius: '4px' }}>
                                    <div style={{ width: `${(estatisticas.dpoc / estatisticas.total) * 100}%`, height: '100%', background: 'var(--sus-yellow)', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span>Outras</span>
                                    <strong>{estatisticas.outros}</strong>
                                </div>
                                <div style={{ height: '8px', background: '#e9ecef', borderRadius: '4px' }}>
                                    <div style={{ width: `${(estatisticas.outros / estatisticas.total) * 100}%`, height: '100%', background: '#6c757d', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" style={{ background: 'var(--sus-light-blue)', color: 'white' }}>
                        <i className="fas fa-robot"></i> Insights de IA
                    </div>
                    <div className="card-body">
                        <div className="alert alert-warning" style={{ marginBottom: '0.75rem' }}>
                            <strong><i className="fas fa-exclamation-triangle"></i> Alerta:</strong> 23 pacientes diabéticos não realizaram exame de hemoglobina glicada nos últimos 6 meses.
                        </div>
                        <div className="alert alert-info" style={{ marginBottom: '0.75rem' }}>
                            <strong><i className="fas fa-lightbulb"></i> Sugestão:</strong> 15 pacientes hipertensos podem se beneficiar de atividades em grupo.
                        </div>
                        <div className="alert alert-success" style={{ margin: 0 }}>
                            <strong><i className="fas fa-check-circle"></i> Positivo:</strong> Taxa de controle pressórico aumentou 12% no último trimestre.
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body">
                    <h5 style={{ marginBottom: '1rem' }}>Filtrar Pacientes</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Condição</label>
                            <select
                                className="form-control"
                                value={filtroCondicao}
                                onChange={(e) => setFiltroCondicao(e.target.value)}
                            >
                                {condicoesFiltro.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Risco</label>
                            <select
                                className="form-control"
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
                            <label className="form-label">Status</label>
                            <select
                                className="form-control"
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
                            <label className="form-label">Pesquisar</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nome ou CNS..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Patients Table */}
            <div className="card">
                <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ padding: '1rem 1rem 0.5rem' }}>
                        <h5>Pacientes com Condições Crônicas ({pacientesFiltrados.length})</h5>
                    </div>
                    <table className="table" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>Paciente</th>
                                <th>Condições</th>
                                <th>Risco</th>
                                <th>Status</th>
                                <th>Último Atend.</th>
                                <th>Próximo Retorno</th>
                                <th>Alertas</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pacientesFiltrados.map(paciente => (
                                <tr key={paciente.id}>
                                    <td>
                                        <strong>{paciente.nome}</strong>
                                        <br />
                                        <small style={{ color: 'var(--sus-gray)' }}>
                                            {paciente.idade} anos • CNS: {paciente.cns}
                                        </small>
                                    </td>
                                    <td>
                                        {paciente.condicoes.map((c, i) => (
                                            <span key={i} className="badge badge-info" style={{ marginRight: '0.25rem', marginBottom: '0.25rem' }}>
                                                {c}
                                            </span>
                                        ))}
                                    </td>
                                    <td>{getRiscoBadge(paciente.risco)}</td>
                                    <td>{getStatusBadge(paciente.status)}</td>
                                    <td>{paciente.ultimoAtendimento}</td>
                                    <td>{paciente.proximoRetorno}</td>
                                    <td>
                                        {paciente.alertas > 0 ? (
                                            <span className="badge badge-danger">
                                                <i className="fas fa-bell"></i> {paciente.alertas}
                                            </span>
                                        ) : (
                                            <span className="badge badge-secondary">0</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setPacienteSelecionado(paciente)}
                                                title="Ver Detalhes"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-success" title="Registrar Atendimento">
                                                <i className="fas fa-notes-medical"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-secondary" title="Agendar">
                                                <i className="fas fa-calendar"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Patient Detail Modal */}
            {pacienteSelecionado && (
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
                    onClick={() => setPacienteSelecionado(null)}
                >
                    <div
                        className="card"
                        style={{ width: '700px', maxWidth: '90%', maxHeight: '80vh', overflow: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-green)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-user"></i> {pacienteSelecionado.nome}</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setPacienteSelecionado(null)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <p><strong>Idade:</strong> {pacienteSelecionado.idade} anos</p>
                                    <p><strong>CNS:</strong> {pacienteSelecionado.cns}</p>
                                    <p><strong>Risco:</strong> {getRiscoBadge(pacienteSelecionado.risco)}</p>
                                </div>
                                <div>
                                    <p><strong>Status:</strong> {getStatusBadge(pacienteSelecionado.status)}</p>
                                    <p><strong>Último Atendimento:</strong> {pacienteSelecionado.ultimoAtendimento}</p>
                                    <p><strong>Próximo Retorno:</strong> {pacienteSelecionado.proximoRetorno}</p>
                                </div>
                            </div>

                            <h6>Condições de Saúde</h6>
                            <div style={{ marginBottom: '1rem' }}>
                                {pacienteSelecionado.condicoes.map((c, i) => (
                                    <span key={i} className="badge badge-primary" style={{ marginRight: '0.5rem', padding: '0.5rem 0.75rem' }}>
                                        {c}
                                    </span>
                                ))}
                            </div>

                            {pacienteSelecionado.alertas > 0 && (
                                <>
                                    <h6>Alertas Ativos</h6>
                                    <div className="alert alert-warning">
                                        <i className="fas fa-exclamation-triangle"></i> Paciente com exames em atraso. Verificar hemoglobina glicada e função renal.
                                    </div>
                                </>
                            )}

                            <h6>Últimos Registros</h6>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Tipo</th>
                                        <th>Observação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{pacienteSelecionado.ultimoAtendimento}</td>
                                        <td>Consulta</td>
                                        <td>Acompanhamento de rotina. PA: 140/90</td>
                                    </tr>
                                    <tr>
                                        <td>15/03/2025</td>
                                        <td>Exame</td>
                                        <td>Hemoglobina glicada: 7.2%</td>
                                    </tr>
                                    <tr>
                                        <td>01/03/2025</td>
                                        <td>Visita ACS</td>
                                        <td>Verificação domiciliar. Paciente estável.</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button className="btn btn-outline-primary">
                                    <i className="fas fa-file-medical"></i> Prontuário
                                </button>
                                <button className="btn btn-success">
                                    <i className="fas fa-notes-medical"></i> Novo Atendimento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
