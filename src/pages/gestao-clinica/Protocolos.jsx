import { useState } from 'react';

// Sample protocols data
const protocolsData = [
    {
        id: 1,
        nome: 'Hipertensão Arterial Sistêmica',
        categoria: 'Doenças Crônicas',
        origem: 'Ministério da Saúde',
        atualizacao: '15/01/2025',
        status: 'ativo',
        adesao: 85,
        descricao: 'Protocolo para manejo de pacientes com hipertensão arterial na Atenção Primária'
    },
    {
        id: 2,
        nome: 'Diabetes Mellitus',
        categoria: 'Doenças Crônicas',
        origem: 'Ministério da Saúde',
        atualizacao: '10/12/2024',
        status: 'ativo',
        adesao: 58,
        descricao: 'Diretrizes para tratamento e acompanhamento de pacientes diabéticos'
    },
    {
        id: 3,
        nome: 'Pré-Natal de Baixo Risco',
        categoria: 'Saúde da Mulher',
        origem: 'Ministério da Saúde',
        atualizacao: '05/02/2025',
        status: 'ativo',
        adesao: 92,
        descricao: 'Acompanhamento pré-natal para gestantes de baixo risco'
    },
    {
        id: 4,
        nome: 'Tuberculose',
        categoria: 'Doenças Infecciosas',
        origem: 'Ministério da Saúde',
        atualizacao: '20/11/2024',
        status: 'revisao',
        adesao: 75,
        descricao: 'Protocolo de diagnóstico e tratamento da tuberculose'
    },
    {
        id: 5,
        nome: 'Saúde Mental na Atenção Básica',
        categoria: 'Saúde Mental',
        origem: 'Secretaria Estadual',
        atualizacao: '03/03/2025',
        status: 'ativo',
        adesao: 62,
        descricao: 'Protocolo de atendimento em saúde mental na APS'
    },
    {
        id: 6,
        nome: 'Puericultura',
        categoria: 'Saúde da Criança',
        origem: 'Ministério da Saúde',
        atualizacao: '18/01/2025',
        status: 'ativo',
        adesao: 88,
        descricao: 'Acompanhamento do crescimento e desenvolvimento infantil'
    },
    {
        id: 7,
        nome: 'Manejo da Dengue',
        categoria: 'Doenças Infecciosas',
        origem: 'Ministério da Saúde',
        atualizacao: '01/03/2025',
        status: 'ativo',
        adesao: 78,
        descricao: 'Protocolo para diagnóstico e tratamento da dengue'
    },
    {
        id: 8,
        nome: 'DPOC e Asma',
        categoria: 'Doenças Crônicas',
        origem: 'Secretaria Municipal',
        atualizacao: '25/02/2025',
        status: 'rascunho',
        adesao: 0,
        descricao: 'Protocolo para manejo de doenças respiratórias crônicas'
    }
];

const categorias = [
    'Todas',
    'Doenças Crônicas',
    'Saúde da Mulher',
    'Saúde da Criança',
    'Saúde Mental',
    'Doenças Infecciosas',
    'Urgência e Emergência'
];

const origens = [
    'Todas',
    'Ministério da Saúde',
    'Secretaria Estadual',
    'Secretaria Municipal',
    'Institucional'
];

const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'ativo', label: 'Ativo', color: 'success' },
    { value: 'revisao', label: 'Em Revisão', color: 'warning' },
    { value: 'rascunho', label: 'Rascunho', color: 'secondary' },
    { value: 'desativado', label: 'Desativado', color: 'danger' }
];

export default function Protocolos() {
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');
    const [filtroOrigem, setFiltroOrigem] = useState('Todas');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [protocoloSelecionado, setProtocoloSelecionado] = useState(null);

    // Filter protocols
    const protocolosFiltrados = protocolsData.filter(p => {
        const matchCategoria = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
        const matchOrigem = filtroOrigem === 'Todas' || p.origem === filtroOrigem;
        const matchStatus = !filtroStatus || p.status === filtroStatus;
        const matchPesquisa = !pesquisa ||
            p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
            p.descricao.toLowerCase().includes(pesquisa.toLowerCase());
        return matchCategoria && matchOrigem && matchStatus && matchPesquisa;
    });

    const getStatusBadge = (status) => {
        const statusInfo = statusOptions.find(s => s.value === status);
        return (
            <span className={`badge badge-${statusInfo?.color || 'secondary'}`}>
                {statusInfo?.label || status}
            </span>
        );
    };

    const getAdesaoColor = (adesao) => {
        if (adesao >= 80) return 'var(--sus-green)';
        if (adesao >= 60) return 'var(--sus-yellow)';
        return 'var(--sus-red, #dc3545)';
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>
                    <i className="fas fa-file-medical-alt" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                    Protocolos Clínicos
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-robot"></i> Análise IA
                    </button>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-print"></i> Imprimir
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i> Novo Protocolo
                    </button>
                </div>
            </div>

            {/* AI Insights */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-header" style={{ background: 'var(--sus-light-blue)', color: 'white' }}>
                    <i className="fas fa-robot"></i> Insights de IA - Protocolos Clínicos
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="alert alert-primary" style={{ margin: 0 }}>
                            <h6 style={{ margin: '0 0 0.5rem 0' }}>
                                <i className="fas fa-lightbulb"></i> Análise de Adesão aos Protocolos
                            </h6>
                            <p style={{ margin: 0 }}>
                                A IA analisou 1.245 atendimentos e identificou adesão média de 78% aos protocolos,
                                com variação significativa entre equipes (62% a 91%). Recomenda-se capacitação focada.
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="alert alert-success" style={{ margin: 0 }}>
                            <h6 style={{ margin: '0 0 0.5rem 0' }}>
                                <i className="fas fa-check-circle"></i> Protocolos Mais Efetivos
                            </h6>
                            <p style={{ margin: 0 }}>
                                O protocolo de Hipertensão atualizado em janeiro/2025 está associado a melhoria de 23%
                                no controle pressórico quando seguido integralmente.
                            </p>
                        </div>
                        <div className="alert alert-warning" style={{ margin: 0 }}>
                            <h6 style={{ margin: '0 0 0.5rem 0' }}>
                                <i className="fas fa-exclamation-triangle"></i> Oportunidades de Melhoria
                            </h6>
                            <p style={{ margin: 0 }}>
                                Protocolo de Diabetes tem baixa adesão (58%). Sugere-se revisão para simplificação
                                de passos frequentemente omitidos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body">
                    <h5 style={{ marginBottom: '1rem' }}>Filtros</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Categoria</label>
                            <select
                                className="form-control"
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                            >
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Origem</label>
                            <select
                                className="form-control"
                                value={filtroOrigem}
                                onChange={(e) => setFiltroOrigem(e.target.value)}
                            >
                                {origens.map(org => (
                                    <option key={org} value={org}>{org}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Status</label>
                            <select
                                className="form-control"
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                            >
                                {statusOptions.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Pesquisar</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nome ou palavra-chave..."
                                    value={pesquisa}
                                    onChange={(e) => setPesquisa(e.target.value)}
                                />
                                <button className="btn btn-primary">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Protocols Table */}
            <div className="card">
                <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ padding: '1rem 1rem 0.5rem' }}>
                        <h5>Protocolos Clínicos ({protocolosFiltrados.length})</h5>
                    </div>
                    <table className="table" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>Nome do Protocolo</th>
                                <th>Categoria</th>
                                <th>Origem</th>
                                <th>Atualização</th>
                                <th>Status</th>
                                <th>Adesão</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {protocolosFiltrados.map(protocolo => (
                                <tr key={protocolo.id}>
                                    <td>
                                        <strong>{protocolo.nome}</strong>
                                        <br />
                                        <small style={{ color: 'var(--sus-gray)' }}>{protocolo.descricao}</small>
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{protocolo.categoria}</span>
                                    </td>
                                    <td>{protocolo.origem}</td>
                                    <td>{protocolo.atualizacao}</td>
                                    <td>{getStatusBadge(protocolo.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{
                                                width: '80px',
                                                height: '8px',
                                                background: '#e9ecef',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${protocolo.adesao}%`,
                                                    height: '100%',
                                                    background: getAdesaoColor(protocolo.adesao),
                                                    borderRadius: '4px'
                                                }}></div>
                                            </div>
                                            <span style={{
                                                fontWeight: '600',
                                                color: getAdesaoColor(protocolo.adesao)
                                            }}>
                                                {protocolo.adesao}%
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setProtocoloSelecionado(protocolo)}
                                                title="Visualizar"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-secondary" title="Editar">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" title="Excluir">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button className="btn btn-sm btn-outline-secondary" disabled>Anterior</button>
                        <button className="btn btn-sm btn-primary">1</button>
                        <button className="btn btn-sm btn-outline-secondary">2</button>
                        <button className="btn btn-sm btn-outline-secondary">3</button>
                        <button className="btn btn-sm btn-outline-secondary">Próximo</button>
                    </div>
                </div>
            </div>

            {/* Protocol Detail Modal */}
            {protocoloSelecionado && (
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
                    onClick={() => setProtocoloSelecionado(null)}
                >
                    <div
                        className="card"
                        style={{ width: '600px', maxWidth: '90%', maxHeight: '80vh', overflow: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-blue)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-file-medical-alt"></i> {protocoloSelecionado.nome}</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setProtocoloSelecionado(null)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <p><strong>Categoria:</strong> {protocoloSelecionado.categoria}</p>
                            <p><strong>Origem:</strong> {protocoloSelecionado.origem}</p>
                            <p><strong>Última Atualização:</strong> {protocoloSelecionado.atualizacao}</p>
                            <p><strong>Status:</strong> {getStatusBadge(protocoloSelecionado.status)}</p>
                            <p><strong>Taxa de Adesão:</strong> {protocoloSelecionado.adesao}%</p>
                            <hr />
                            <h6>Descrição</h6>
                            <p>{protocoloSelecionado.descricao}</p>
                            <hr />
                            <h6>Diretrizes Principais</h6>
                            <ul>
                                <li>Avaliação inicial completa do paciente</li>
                                <li>Exames laboratoriais conforme indicação</li>
                                <li>Tratamento baseado em evidências</li>
                                <li>Acompanhamento periódico programado</li>
                                <li>Educação em saúde para o paciente e família</li>
                            </ul>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button className="btn btn-outline-primary">
                                    <i className="fas fa-download"></i> Baixar PDF
                                </button>
                                <button className="btn btn-primary">
                                    <i className="fas fa-play"></i> Aplicar Protocolo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
