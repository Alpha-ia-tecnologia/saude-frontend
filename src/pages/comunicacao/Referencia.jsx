import { useState } from 'react';

// Sample referrals data
const encaminhamentosData = [
    {
        id: 1,
        numero: 'REF2025000123',
        tipo: 'referencia',
        paciente: 'Maria Silva Santos',
        cns: '898.0001.0002.0003',
        origem: 'UBS Centro',
        destino: 'Hospital Regional - Cardiologia',
        motivo: 'Avaliação cardiológica - paciente com HAS refratária',
        prioridade: 'alta',
        status: 'aguardando',
        dataEnvio: '2025-01-25',
        medicoSolicitante: 'Dr. Carlos Oliveira',
        cid: 'I10 - Hipertensão Essencial'
    },
    {
        id: 2,
        numero: 'REF2025000122',
        tipo: 'referencia',
        paciente: 'José Carlos Oliveira',
        cns: '898.0002.0003.0004',
        origem: 'UBS Centro',
        destino: 'CAPS - Centro de Atenção Psicossocial',
        motivo: 'Acompanhamento de transtorno depressivo grave',
        prioridade: 'media',
        status: 'agendado',
        dataEnvio: '2025-01-24',
        dataAgendada: '2025-02-05',
        medicoSolicitante: 'Dra. Ana Santos',
        cid: 'F32 - Episódio Depressivo'
    },
    {
        id: 3,
        numero: 'REF2025000121',
        tipo: 'contra-referencia',
        paciente: 'Ana Paula Ferreira',
        cns: '898.0003.0004.0005',
        origem: 'Hospital Regional - Ortopedia',
        destino: 'UBS Centro',
        motivo: 'Alta pós-cirúrgica - fratura de fêmur. Continuar fisioterapia.',
        prioridade: 'baixa',
        status: 'recebido',
        dataEnvio: '2025-01-23',
        dataRecebimento: '2025-01-23',
        medicoSolicitante: 'Dr. Paulo Lima',
        cid: 'S72 - Fratura do Fêmur'
    },
    {
        id: 4,
        numero: 'REF2025000120',
        tipo: 'referencia',
        paciente: 'Pedro Henrique Lima',
        cns: '898.0004.0005.0006',
        origem: 'UBS Centro',
        destino: 'Laboratório Municipal',
        motivo: 'Exames complementares para investigação de diabetes',
        prioridade: 'baixa',
        status: 'concluido',
        dataEnvio: '2025-01-20',
        dataConclusao: '2025-01-22',
        medicoSolicitante: 'Dr. Carlos Oliveira',
        cid: 'R73 - Glicemia Alterada'
    },
    {
        id: 5,
        numero: 'REF2025000119',
        tipo: 'referencia',
        paciente: 'Francisca Moura Costa',
        cns: '898.0005.0006.0007',
        origem: 'UBS Centro',
        destino: 'Hospital Regional - Endocrinologia',
        motivo: 'Nódulo tireoidiano para investigação',
        prioridade: 'alta',
        status: 'negado',
        dataEnvio: '2025-01-18',
        motivoNegacao: 'Documentação incompleta. Faltam exames de USG tireóide.',
        medicoSolicitante: 'Dra. Ana Santos',
        cid: 'E04 - Bócio'
    }
];

// Statistics
const estatisticas = {
    total: 234,
    aguardando: 45,
    agendados: 67,
    concluidos: 112,
    negados: 10
};

export default function Referencia() {
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [encaminhamentoSelecionado, setEncaminhamentoSelecionado] = useState(null);
    const [showNovoModal, setShowNovoModal] = useState(false);

    // Filter referrals
    const encaminhamentosFiltrados = encaminhamentosData.filter(e => {
        const matchTipo = !filtroTipo || e.tipo === filtroTipo;
        const matchStatus = !filtroStatus || e.status === filtroStatus;
        const matchPesquisa = !pesquisa ||
            e.paciente.toLowerCase().includes(pesquisa.toLowerCase()) ||
            e.numero.toLowerCase().includes(pesquisa.toLowerCase()) ||
            e.cns.includes(pesquisa);
        return matchTipo && matchStatus && matchPesquisa;
    });

    const getTipoBadge = (tipo) => {
        const config = {
            referencia: { color: 'primary', label: 'Referência', icon: 'fa-arrow-right' },
            'contra-referencia': { color: 'info', label: 'Contra-Referência', icon: 'fa-arrow-left' }
        };
        const t = config[tipo] || config.referencia;
        return (
            <span className={`badge badge-${t.color}`}>
                <i className={`fas ${t.icon}`} style={{ marginRight: '0.25rem' }}></i>
                {t.label}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const config = {
            aguardando: { color: 'warning', label: 'Aguardando' },
            agendado: { color: 'info', label: 'Agendado' },
            recebido: { color: 'primary', label: 'Recebido' },
            concluido: { color: 'success', label: 'Concluído' },
            negado: { color: 'danger', label: 'Negado' }
        };
        const s = config[status] || config.aguardando;
        return <span className={`badge badge-${s.color}`}>{s.label}</span>;
    };

    const getPrioridadeBadge = (prioridade) => {
        const config = {
            alta: { color: '#dc3545', label: 'Alta' },
            media: { color: 'var(--sus-yellow)', label: 'Média' },
            baixa: { color: 'var(--sus-green)', label: 'Baixa' }
        };
        const p = config[prioridade] || config.baixa;
        return (
            <span style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                background: p.color,
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600'
            }}>
                {p.label}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>
                    <i className="fas fa-exchange-alt" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                    Referência e Contra-Referência
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-file-export"></i> Exportar
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowNovoModal(true)}>
                        <i className="fas fa-plus"></i> Novo Encaminhamento
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
                        <h2 style={{ color: 'var(--sus-yellow)', margin: 0 }}>{estatisticas.aguardando}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Aguardando</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #17a2b8' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: '#17a2b8', margin: 0 }}>{estatisticas.agendados}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Agendados</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-green)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-green)', margin: 0 }}>{estatisticas.concluidos}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Concluídos</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #dc3545' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: '#dc3545', margin: 0 }}>{estatisticas.negados}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Negados</small>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body">
                    <h5 style={{ marginBottom: '1rem' }}>Filtros</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Tipo</label>
                            <select
                                className="form-control"
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="referencia">Referência</option>
                                <option value="contra-referencia">Contra-Referência</option>
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
                                <option value="aguardando">Aguardando</option>
                                <option value="agendado">Agendado</option>
                                <option value="recebido">Recebido</option>
                                <option value="concluido">Concluído</option>
                                <option value="negado">Negado</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Pesquisar</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Paciente, número ou CNS..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Referrals Table */}
            <div className="card">
                <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ padding: '1rem 1rem 0.5rem' }}>
                        <h5>Encaminhamentos ({encaminhamentosFiltrados.length})</h5>
                    </div>
                    <table className="table" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>Nº / Tipo</th>
                                <th>Paciente</th>
                                <th>Origem → Destino</th>
                                <th>Prioridade</th>
                                <th>Data</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {encaminhamentosFiltrados.map(enc => (
                                <tr key={enc.id}>
                                    <td>
                                        <code style={{ fontWeight: '600' }}>{enc.numero}</code>
                                        <br />
                                        {getTipoBadge(enc.tipo)}
                                    </td>
                                    <td>
                                        <strong>{enc.paciente}</strong>
                                        <br />
                                        <small style={{ color: 'var(--sus-gray)' }}>CNS: {enc.cns}</small>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem' }}>
                                            <div><i className="fas fa-hospital" style={{ color: 'var(--sus-blue)', marginRight: '0.25rem' }}></i> {enc.origem}</div>
                                            <div style={{ color: 'var(--sus-gray)', margin: '0.25rem 0' }}>↓</div>
                                            <div><i className="fas fa-hospital-alt" style={{ color: 'var(--sus-green)', marginRight: '0.25rem' }}></i> {enc.destino}</div>
                                        </div>
                                    </td>
                                    <td>{getPrioridadeBadge(enc.prioridade)}</td>
                                    <td>{formatDate(enc.dataEnvio)}</td>
                                    <td>{getStatusBadge(enc.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setEncaminhamentoSelecionado(enc)}
                                                title="Detalhes"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-secondary" title="Editar">
                                                <i className="fas fa-edit"></i>
                                            </button>
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
            {encaminhamentoSelecionado && (
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
                    onClick={() => setEncaminhamentoSelecionado(null)}
                >
                    <div
                        className="card"
                        style={{ width: '700px', maxWidth: '90%', maxHeight: '80vh', overflow: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-blue)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-exchange-alt"></i> {encaminhamentoSelecionado.numero}</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setEncaminhamentoSelecionado(null)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                {getTipoBadge(encaminhamentoSelecionado.tipo)}
                                {getStatusBadge(encaminhamentoSelecionado.status)}
                                {getPrioridadeBadge(encaminhamentoSelecionado.prioridade)}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <h6>Paciente</h6>
                                    <p style={{ margin: '0.25rem 0' }}><strong>{encaminhamentoSelecionado.paciente}</strong></p>
                                    <p style={{ margin: '0.25rem 0', color: 'var(--sus-gray)' }}>CNS: {encaminhamentoSelecionado.cns}</p>
                                </div>
                                <div>
                                    <h6>Solicitante</h6>
                                    <p style={{ margin: '0.25rem 0' }}><strong>{encaminhamentoSelecionado.medicoSolicitante}</strong></p>
                                    <p style={{ margin: '0.25rem 0', color: 'var(--sus-gray)' }}>{encaminhamentoSelecionado.origem}</p>
                                </div>
                            </div>

                            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <i className="fas fa-hospital fa-2x" style={{ color: 'var(--sus-blue)' }}></i>
                                        <p style={{ margin: '0.5rem 0 0' }}><strong>{encaminhamentoSelecionado.origem}</strong></p>
                                    </div>
                                    <div>
                                        <i className="fas fa-arrow-right fa-2x" style={{ color: 'var(--sus-gray)' }}></i>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <i className="fas fa-hospital-alt fa-2x" style={{ color: 'var(--sus-green)' }}></i>
                                        <p style={{ margin: '0.5rem 0 0' }}><strong>{encaminhamentoSelecionado.destino}</strong></p>
                                    </div>
                                </div>
                            </div>

                            <h6>Motivo do Encaminhamento</h6>
                            <p style={{ background: '#fff3cd', padding: '0.75rem', borderRadius: '0.25rem' }}>
                                {encaminhamentoSelecionado.motivo}
                            </p>

                            <p><strong>CID:</strong> {encaminhamentoSelecionado.cid}</p>
                            <p><strong>Data de Envio:</strong> {formatDate(encaminhamentoSelecionado.dataEnvio)}</p>

                            {encaminhamentoSelecionado.dataAgendada && (
                                <p><strong>Data Agendada:</strong> {formatDate(encaminhamentoSelecionado.dataAgendada)}</p>
                            )}

                            {encaminhamentoSelecionado.motivoNegacao && (
                                <div className="alert alert-danger">
                                    <strong><i className="fas fa-times-circle"></i> Motivo da Negativa:</strong><br />
                                    {encaminhamentoSelecionado.motivoNegacao}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button className="btn btn-outline-secondary">
                                    <i className="fas fa-print"></i> Imprimir
                                </button>
                                {encaminhamentoSelecionado.status === 'aguardando' && (
                                    <button className="btn btn-success">
                                        <i className="fas fa-check"></i> Confirmar Recebimento
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Referral Modal */}
            {showNovoModal && (
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
                    onClick={() => setShowNovoModal(false)}
                >
                    <div
                        className="card"
                        style={{ width: '700px', maxWidth: '90%', maxHeight: '90vh', overflow: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-blue)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-plus"></i> Novo Encaminhamento</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setShowNovoModal(false)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Paciente *</label>
                                    <input type="text" className="form-control" placeholder="Buscar paciente por nome ou CNS..." />
                                </div>
                                <div>
                                    <label className="form-label">Tipo *</label>
                                    <select className="form-control">
                                        <option>Referência</option>
                                        <option>Contra-Referência</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Prioridade *</label>
                                    <select className="form-control">
                                        <option>Baixa</option>
                                        <option>Média</option>
                                        <option>Alta</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Unidade de Origem *</label>
                                    <select className="form-control">
                                        <option>UBS Centro</option>
                                        <option>UBS Norte</option>
                                        <option>UBS Sul</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Unidade de Destino *</label>
                                    <select className="form-control">
                                        <option>Hospital Regional - Cardiologia</option>
                                        <option>Hospital Regional - Ortopedia</option>
                                        <option>Hospital Regional - Neurologia</option>
                                        <option>CAPS</option>
                                        <option>CEO - Centro de Especialidades</option>
                                        <option>Laboratório Municipal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">CID Principal</label>
                                    <input type="text" className="form-control" placeholder="Ex: I10" />
                                </div>
                                <div>
                                    <label className="form-label">Médico Solicitante</label>
                                    <input type="text" className="form-control" defaultValue="Dr. Carlos Oliveira" />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Motivo do Encaminhamento *</label>
                                    <textarea className="form-control" rows="3" placeholder="Descreva o motivo clínico do encaminhamento..."></textarea>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Resumo Clínico</label>
                                    <textarea className="form-control" rows="3" placeholder="Histórico relevante, exames realizados, tratamentos anteriores..."></textarea>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button className="btn btn-outline-secondary" onClick={() => setShowNovoModal(false)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-primary">
                                    <i className="fas fa-paper-plane"></i> Enviar Encaminhamento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
