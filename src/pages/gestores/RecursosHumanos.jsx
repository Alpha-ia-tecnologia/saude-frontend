import { useState } from 'react';

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
    { cargo: 'Médicos', quantidade: 24, cor: 'var(--sus-blue)' },
    { cargo: 'Enfermeiros', quantidade: 18, cor: 'var(--sus-green)' },
    { cargo: 'Téc. Enfermagem', quantidade: 45, cor: 'var(--sus-yellow)' },
    { cargo: 'ACS', quantidade: 52, cor: '#17a2b8' },
    { cargo: 'Administrativo', quantidade: 12, cor: '#6c757d' },
    { cargo: 'Outros', quantidade: 5, cor: '#e83e8c' }
];

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
            ativo: { color: 'success', label: 'Ativo' },
            ferias: { color: 'info', label: 'Férias' },
            licenca: { color: 'warning', label: 'Licença' },
            afastado: { color: 'danger', label: 'Afastado' }
        };
        const s = config[status] || config.ativo;
        return <span className={`badge badge-${s.color}`}>{s.label}</span>;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    const totalFuncionarios = distribuicaoCargos.reduce((acc, c) => acc + c.quantidade, 0);

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>
                        <i className="fas fa-users" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                        Recursos Humanos
                    </h1>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--sus-gray)' }}>Gestão de pessoal e capacitação</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-file-excel"></i> Exportar
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i> Novo Funcionário
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--sus-blue), var(--sus-light-blue))', color: 'white' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <i className="fas fa-users fa-2x" style={{ marginBottom: '0.5rem', opacity: 0.8 }}></i>
                        <h2 style={{ margin: '0.25rem 0' }}>{estatisticas.totalFuncionarios}</h2>
                        <small>Total de Funcionários</small>
                    </div>
                </div>
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--sus-green), #20c997)', color: 'white' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <i className="fas fa-check-circle fa-2x" style={{ marginBottom: '0.5rem', opacity: 0.8 }}></i>
                        <h2 style={{ margin: '0.25rem 0' }}>{estatisticas.ativos}</h2>
                        <small>Ativos</small>
                    </div>
                </div>
                <div className="card" style={{ background: 'linear-gradient(135deg, #17a2b8, #6610f2)', color: 'white' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <i className="fas fa-umbrella-beach fa-2x" style={{ marginBottom: '0.5rem', opacity: 0.8 }}></i>
                        <h2 style={{ margin: '0.25rem 0' }}>{estatisticas.ferias}</h2>
                        <small>Em Férias</small>
                    </div>
                </div>
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--sus-yellow), #fd7e14)', color: 'white' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <i className="fas fa-file-medical fa-2x" style={{ marginBottom: '0.5rem', opacity: 0.8 }}></i>
                        <h2 style={{ margin: '0.25rem 0' }}>{estatisticas.licenca}</h2>
                        <small>Em Licença</small>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body" style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className={`btn ${abaAtiva === 'funcionarios' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setAbaAtiva('funcionarios')}
                        >
                            <i className="fas fa-id-card"></i> Funcionários
                        </button>
                        <button
                            className={`btn ${abaAtiva === 'distribuicao' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setAbaAtiva('distribuicao')}
                        >
                            <i className="fas fa-chart-pie"></i> Distribuição
                        </button>
                        <button
                            className={`btn ${abaAtiva === 'capacitacao' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setAbaAtiva('capacitacao')}
                        >
                            <i className="fas fa-graduation-cap"></i> Capacitação
                        </button>
                    </div>
                </div>
            </div>

            {/* Funcionários Tab */}
            {abaAtiva === 'funcionarios' && (
                <>
                    {/* Filters */}
                    <div className="card" style={{ marginBottom: '1rem' }}>
                        <div className="card-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">Status</label>
                                    <select className="form-control" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                                        <option value="">Todos</option>
                                        <option value="ativo">Ativo</option>
                                        <option value="ferias">Férias</option>
                                        <option value="licenca">Licença</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Unidade</label>
                                    <select className="form-control" value={filtroUnidade} onChange={(e) => setFiltroUnidade(e.target.value)}>
                                        <option value="">Todas</option>
                                        <option value="UBS Centro">UBS Centro</option>
                                        <option value="UBS Norte">UBS Norte</option>
                                        <option value="UBS Sul">UBS Sul</option>
                                        <option value="NASF">NASF</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Pesquisar</label>
                                    <input type="text" className="form-control" placeholder="Nome ou cargo..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Staff Table */}
                    <div className="card">
                        <div className="card-body" style={{ padding: 0 }}>
                            <table className="table" style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                        <th>Funcionário</th>
                                        <th>Cargo</th>
                                        <th>Unidade</th>
                                        <th>CH</th>
                                        <th>Vínculo</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {funcionariosFiltrados.map(f => (
                                        <tr key={f.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        background: 'var(--sus-blue)',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: '600',
                                                        fontSize: '0.85rem'
                                                    }}>
                                                        {f.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                                    </div>
                                                    <strong>{f.nome}</strong>
                                                </div>
                                            </td>
                                            <td>{f.cargo}</td>
                                            <td>{f.unidade}</td>
                                            <td>{f.cargaHoraria}h</td>
                                            <td><span className={`badge badge-${f.vinculo === 'Efetivo' ? 'primary' : 'secondary'}`}>{f.vinculo}</span></td>
                                            <td>{getStatusBadge(f.status)}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => setFuncionarioSelecionado(f)}>
                                                    <i className="fas fa-eye"></i>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="card">
                        <div className="card-header" style={{ background: '#f8f9fa' }}>
                            <i className="fas fa-chart-pie"></i> Distribuição por Cargo
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '50%',
                                    background: `conic-gradient(
                                        var(--sus-blue) 0deg ${(24 / 156) * 360}deg,
                                        var(--sus-green) ${(24 / 156) * 360}deg ${((24 + 18) / 156) * 360}deg,
                                        var(--sus-yellow) ${((24 + 18) / 156) * 360}deg ${((24 + 18 + 45) / 156) * 360}deg,
                                        #17a2b8 ${((24 + 18 + 45) / 156) * 360}deg ${((24 + 18 + 45 + 52) / 156) * 360}deg,
                                        #6c757d ${((24 + 18 + 45 + 52) / 156) * 360}deg ${((24 + 18 + 45 + 52 + 12) / 156) * 360}deg,
                                        #e83e8c ${((24 + 18 + 45 + 52 + 12) / 156) * 360}deg 360deg
                                    )`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                        <strong style={{ fontSize: '1.5rem' }}>{totalFuncionarios}</strong>
                                        <small>Total</small>
                                    </div>
                                </div>
                            </div>
                            {distribuicaoCargos.map((c, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '12px', height: '12px', background: c.cor, borderRadius: '2px' }}></div>
                                        <span>{c.cargo}</span>
                                    </div>
                                    <strong>{c.quantidade} ({((c.quantidade / totalFuncionarios) * 100).toFixed(0)}%)</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header" style={{ background: '#f8f9fa' }}>
                            <i className="fas fa-hospital"></i> Distribuição por Unidade
                        </div>
                        <div className="card-body">
                            {['UBS Centro', 'UBS Norte', 'UBS Sul', 'UBS Leste', 'NASF'].map((unidade, i) => {
                                const quantidade = Math.floor(Math.random() * 20) + 25;
                                return (
                                    <div key={i} style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span>{unidade}</span>
                                            <strong>{quantidade}</strong>
                                        </div>
                                        <div style={{ height: '8px', background: '#e9ecef', borderRadius: '4px' }}>
                                            <div style={{ width: `${(quantidade / 50) * 100}%`, height: '100%', background: 'var(--sus-blue)', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Capacitação Tab */}
            {abaAtiva === 'capacitacao' && (
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><i className="fas fa-graduation-cap"></i> Capacitações</span>
                        <button className="btn btn-sm btn-primary"><i className="fas fa-plus"></i> Nova Capacitação</button>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <table className="table" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>Capacitação</th>
                                    <th>Data</th>
                                    <th>Participantes</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {capacitacoes.map((c, i) => (
                                    <tr key={i}>
                                        <td><strong>{c.nome}</strong></td>
                                        <td>{formatDate(c.data)}</td>
                                        <td>{c.participantes || '-'}</td>
                                        <td>
                                            <span className={`badge badge-${c.status === 'concluida' ? 'success' : c.status === 'agendada' ? 'info' : 'secondary'}`}>
                                                {c.status === 'concluida' ? 'Concluída' : c.status === 'agendada' ? 'Agendada' : 'Planejada'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary"><i className="fas fa-eye"></i></button>
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
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setFuncionarioSelecionado(null)}
                >
                    <div className="card" style={{ width: '500px', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
                        <div className="card-header" style={{ background: 'var(--sus-blue)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-user"></i> Dados do Funcionário</span>
                                <button className="btn btn-sm btn-light" onClick={() => setFuncionarioSelecionado(null)}><i className="fas fa-times"></i></button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%', background: 'var(--sus-blue)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '600', margin: '0 auto 0.5rem'
                                }}>
                                    {funcionarioSelecionado.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </div>
                                <h5 style={{ margin: 0 }}>{funcionarioSelecionado.nome}</h5>
                                <p style={{ color: 'var(--sus-gray)', margin: 0 }}>{funcionarioSelecionado.cargo}</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div><small style={{ color: 'var(--sus-gray)' }}>Unidade</small><p style={{ margin: 0 }}><strong>{funcionarioSelecionado.unidade}</strong></p></div>
                                <div><small style={{ color: 'var(--sus-gray)' }}>Status</small><p style={{ margin: 0 }}>{getStatusBadge(funcionarioSelecionado.status)}</p></div>
                                <div><small style={{ color: 'var(--sus-gray)' }}>Carga Horária</small><p style={{ margin: 0 }}><strong>{funcionarioSelecionado.cargaHoraria}h/semana</strong></p></div>
                                <div><small style={{ color: 'var(--sus-gray)' }}>Vínculo</small><p style={{ margin: 0 }}><strong>{funcionarioSelecionado.vinculo}</strong></p></div>
                                <div style={{ gridColumn: 'span 2' }}><small style={{ color: 'var(--sus-gray)' }}>Admissão</small><p style={{ margin: 0 }}><strong>{formatDate(funcionarioSelecionado.admissao)}</strong></p></div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button className="btn btn-outline-secondary"><i className="fas fa-edit"></i> Editar</button>
                                <button className="btn btn-primary"><i className="fas fa-calendar-alt"></i> Escala</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
