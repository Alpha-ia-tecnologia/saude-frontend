import { useState } from 'react';

// Sample prescriptions data
const prescricoesData = [
    {
        id: 1,
        numero: 'RX2025001234',
        paciente: 'Maria Silva Santos',
        cpf: '123.456.789-00',
        cns: '898.0001.0002.0003',
        medico: 'Dr. Carlos Oliveira',
        crm: 'CRM-SP 123456',
        data: '2025-01-26',
        validade: '2025-03-26',
        status: 'pendente',
        medicamentos: [
            { nome: 'Losartana 50mg', quantidade: 60, posologia: '1 comp. 12/12h' },
            { nome: 'Metformina 850mg', quantidade: 90, posologia: '1 comp. 8/8h' }
        ]
    },
    {
        id: 2,
        numero: 'RX2025001233',
        paciente: 'José Carlos Oliveira',
        cpf: '234.567.890-11',
        cns: '898.0002.0003.0004',
        medico: 'Dra. Ana Santos',
        crm: 'CRM-SP 654321',
        data: '2025-01-25',
        validade: '2025-03-25',
        status: 'parcial',
        medicamentos: [
            { nome: 'Omeprazol 20mg', quantidade: 30, posologia: '1 cáps. em jejum', dispensado: 30 },
            { nome: 'Amoxicilina 500mg', quantidade: 21, posologia: '1 cáps. 8/8h por 7 dias' }
        ]
    },
    {
        id: 3,
        numero: 'RX2025001232',
        paciente: 'Ana Paula Ferreira',
        cpf: '345.678.901-22',
        cns: '898.0003.0004.0005',
        medico: 'Dr. Paulo Lima',
        crm: 'CRM-SP 789012',
        data: '2025-01-24',
        validade: '2025-03-24',
        status: 'dispensada',
        medicamentos: [
            { nome: 'Dipirona 500mg', quantidade: 20, posologia: '1 comp. se dor', dispensado: 20 }
        ]
    },
    {
        id: 4,
        numero: 'RX2025001231',
        paciente: 'Pedro Henrique Lima',
        cpf: '456.789.012-33',
        cns: '898.0004.0005.0006',
        medico: 'Dr. Carlos Oliveira',
        crm: 'CRM-SP 123456',
        data: '2025-01-20',
        validade: '2025-03-20',
        status: 'dispensada',
        medicamentos: [
            { nome: 'Atenolol 25mg', quantidade: 30, posologia: '1 comp. manhã', dispensado: 30 },
            { nome: 'AAS 100mg', quantidade: 30, posologia: '1 comp. após almoço', dispensado: 30 }
        ]
    },
    {
        id: 5,
        numero: 'RX2025001230',
        paciente: 'Francisca Moura Costa',
        cpf: '567.890.123-44',
        cns: '898.0005.0006.0007',
        medico: 'Dra. Ana Santos',
        crm: 'CRM-SP 654321',
        data: '2024-11-15',
        validade: '2025-01-15',
        status: 'vencida',
        medicamentos: [
            { nome: 'Levotiroxina 50mcg', quantidade: 30, posologia: '1 comp. em jejum' }
        ]
    }
];

// Statistics
const estatisticas = {
    total: 156,
    pendentes: 23,
    parciais: 8,
    dispensadas: 118,
    vencidas: 7
};

export default function Prescricoes() {
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [prescricaoSelecionada, setPrescricaoSelecionada] = useState(null);
    const [showDispensarModal, setShowDispensarModal] = useState(false);

    // Filter prescriptions
    const prescricoesFiltradas = prescricoesData.filter(p => {
        const matchStatus = !filtroStatus || p.status === filtroStatus;
        const matchPesquisa = !pesquisa ||
            p.paciente.toLowerCase().includes(pesquisa.toLowerCase()) ||
            p.numero.toLowerCase().includes(pesquisa.toLowerCase()) ||
            p.cns.includes(pesquisa);
        return matchStatus && matchPesquisa;
    });

    const getStatusBadge = (status) => {
        const config = {
            pendente: { color: 'warning', label: 'Pendente', icon: 'fa-clock' },
            parcial: { color: 'info', label: 'Parcial', icon: 'fa-minus-circle' },
            dispensada: { color: 'success', label: 'Dispensada', icon: 'fa-check-circle' },
            vencida: { color: 'danger', label: 'Vencida', icon: 'fa-times-circle' }
        };
        const s = config[status] || config.pendente;
        return (
            <span className={`badge badge-${s.color}`}>
                <i className={`fas ${s.icon}`} style={{ marginRight: '0.25rem' }}></i>
                {s.label}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    };

    const isExpired = (dateStr) => {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return date < new Date();
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>
                    <i className="fas fa-prescription" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                    Prescrições
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-file-export"></i> Exportar
                    </button>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-print"></i> Imprimir
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i> Nova Prescrição
                    </button>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-blue)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-blue)', margin: 0 }}>{estatisticas.total}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Total</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-yellow)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-yellow)', margin: 0 }}>{estatisticas.pendentes}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Pendentes</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #17a2b8' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: '#17a2b8', margin: 0 }}>{estatisticas.parciais}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Parciais</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-green)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-green)', margin: 0 }}>{estatisticas.dispensadas}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Dispensadas</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #dc3545' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: '#dc3545', margin: 0 }}>{estatisticas.vencidas}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Vencidas</small>
                    </div>
                </div>
            </div>

            {/* Alert */}
            <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
                <strong><i className="fas fa-exclamation-triangle"></i> Atenção:</strong> {estatisticas.pendentes} prescrições aguardando dispensação.
                <button className="btn btn-sm btn-warning" style={{ marginLeft: '1rem' }}>
                    Ver Pendentes
                </button>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body">
                    <h5 style={{ marginBottom: '1rem' }}>Filtros</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Status</label>
                            <select
                                className="form-control"
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="pendente">Pendente</option>
                                <option value="parcial">Parcialmente Dispensada</option>
                                <option value="dispensada">Dispensada</option>
                                <option value="vencida">Vencida</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Período</label>
                            <select className="form-control">
                                <option>Últimos 7 dias</option>
                                <option>Últimos 30 dias</option>
                                <option>Últimos 3 meses</option>
                                <option>Todos</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Pesquisar</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Paciente, número da prescrição ou CNS..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Prescriptions Table */}
            <div className="card">
                <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ padding: '1rem 1rem 0.5rem' }}>
                        <h5>Prescrições ({prescricoesFiltradas.length})</h5>
                    </div>
                    <table className="table" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>Nº Prescrição</th>
                                <th>Paciente</th>
                                <th>Prescritor</th>
                                <th>Data</th>
                                <th>Validade</th>
                                <th>Itens</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescricoesFiltradas.map(rx => (
                                <tr key={rx.id}>
                                    <td>
                                        <code style={{ fontWeight: '600' }}>{rx.numero}</code>
                                    </td>
                                    <td>
                                        <strong>{rx.paciente}</strong>
                                        <br />
                                        <small style={{ color: 'var(--sus-gray)' }}>CNS: {rx.cns}</small>
                                    </td>
                                    <td>
                                        {rx.medico}
                                        <br />
                                        <small style={{ color: 'var(--sus-gray)' }}>{rx.crm}</small>
                                    </td>
                                    <td>{formatDate(rx.data)}</td>
                                    <td style={{ color: isExpired(rx.validade) ? '#dc3545' : 'inherit' }}>
                                        {isExpired(rx.validade) && <i className="fas fa-exclamation-circle" style={{ marginRight: '0.25rem' }}></i>}
                                        {formatDate(rx.validade)}
                                    </td>
                                    <td>
                                        <span className="badge badge-secondary">{rx.medicamentos.length} item(s)</span>
                                    </td>
                                    <td>{getStatusBadge(rx.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setPrescricaoSelecionada(rx)}
                                                title="Detalhes"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            {(rx.status === 'pendente' || rx.status === 'parcial') && (
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => {
                                                        setPrescricaoSelecionada(rx);
                                                        setShowDispensarModal(true);
                                                    }}
                                                    title="Dispensar"
                                                >
                                                    <i className="fas fa-hand-holding-medical"></i>
                                                </button>
                                            )}
                                            <button className="btn btn-sm btn-outline-secondary" title="Imprimir">
                                                <i className="fas fa-print"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {prescricaoSelecionada && !showDispensarModal && (
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
                    onClick={() => setPrescricaoSelecionada(null)}
                >
                    <div
                        className="card"
                        style={{ width: '700px', maxWidth: '90%', maxHeight: '80vh', overflow: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-blue)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-prescription"></i> Prescrição {prescricaoSelecionada.numero}</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setPrescricaoSelecionada(null)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <h6>Paciente</h6>
                                    <p style={{ margin: '0.25rem 0' }}><strong>{prescricaoSelecionada.paciente}</strong></p>
                                    <p style={{ margin: '0.25rem 0', color: 'var(--sus-gray)' }}>CPF: {prescricaoSelecionada.cpf}</p>
                                    <p style={{ margin: '0.25rem 0', color: 'var(--sus-gray)' }}>CNS: {prescricaoSelecionada.cns}</p>
                                </div>
                                <div>
                                    <h6>Prescritor</h6>
                                    <p style={{ margin: '0.25rem 0' }}><strong>{prescricaoSelecionada.medico}</strong></p>
                                    <p style={{ margin: '0.25rem 0', color: 'var(--sus-gray)' }}>{prescricaoSelecionada.crm}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <p style={{ margin: 0 }}><strong>Data:</strong> {formatDate(prescricaoSelecionada.data)}</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0 }}><strong>Validade:</strong> {formatDate(prescricaoSelecionada.validade)}</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0 }}><strong>Status:</strong> {getStatusBadge(prescricaoSelecionada.status)}</p>
                                </div>
                            </div>

                            <hr />

                            <h6>Medicamentos Prescritos</h6>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Medicamento</th>
                                        <th>Quantidade</th>
                                        <th>Posologia</th>
                                        <th>Dispensado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescricaoSelecionada.medicamentos.map((med, idx) => (
                                        <tr key={idx}>
                                            <td><strong>{med.nome}</strong></td>
                                            <td>{med.quantidade} un.</td>
                                            <td>{med.posologia}</td>
                                            <td>
                                                {med.dispensado ? (
                                                    <span className="badge badge-success">{med.dispensado} un.</span>
                                                ) : (
                                                    <span className="badge badge-warning">Pendente</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button className="btn btn-outline-secondary">
                                    <i className="fas fa-print"></i> Imprimir
                                </button>
                                {(prescricaoSelecionada.status === 'pendente' || prescricaoSelecionada.status === 'parcial') && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => setShowDispensarModal(true)}
                                    >
                                        <i className="fas fa-hand-holding-medical"></i> Dispensar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dispensar Modal */}
            {prescricaoSelecionada && showDispensarModal && (
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
                    onClick={() => {
                        setShowDispensarModal(false);
                        setPrescricaoSelecionada(null);
                    }}
                >
                    <div
                        className="card"
                        style={{ width: '700px', maxWidth: '90%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-green)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-hand-holding-medical"></i> Dispensar Medicamentos</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => {
                                        setShowDispensarModal(false);
                                        setPrescricaoSelecionada(null);
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="alert alert-info">
                                <strong>Prescrição:</strong> {prescricaoSelecionada.numero}
                                <br />
                                <strong>Paciente:</strong> {prescricaoSelecionada.paciente}
                            </div>

                            <h6>Selecione os medicamentos a dispensar:</h6>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>
                                            <input type="checkbox" defaultChecked />
                                        </th>
                                        <th>Medicamento</th>
                                        <th>Prescrito</th>
                                        <th>Dispensar</th>
                                        <th>Lote</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescricaoSelecionada.medicamentos.map((med, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <input type="checkbox" defaultChecked={!med.dispensado} disabled={med.dispensado} />
                                            </td>
                                            <td><strong>{med.nome}</strong></td>
                                            <td>{med.quantidade} un.</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    style={{ width: '80px' }}
                                                    defaultValue={med.dispensado ? 0 : med.quantidade}
                                                    disabled={med.dispensado}
                                                />
                                            </td>
                                            <td>
                                                <select className="form-control form-control-sm" style={{ width: '120px' }} disabled={med.dispensado}>
                                                    <option>LOT2025001</option>
                                                    <option>LOT2025002</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ marginTop: '1rem' }}>
                                <label className="form-label">Observações</label>
                                <textarea className="form-control" rows="2" placeholder="Observações sobre a dispensação..."></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setShowDispensarModal(false);
                                        setPrescricaoSelecionada(null);
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button className="btn btn-success">
                                    <i className="fas fa-check"></i> Confirmar Dispensação
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
