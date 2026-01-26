import { useState } from 'react';

// External services data
const servicosData = [
    {
        id: 1,
        nome: 'e-SUS AB',
        descricao: 'Sistema de Atenção Básica do Ministério da Saúde',
        tipo: 'governo',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-26T10:30:00',
        registrosSincronizados: 12450,
        icone: 'fa-hospital',
        cor: 'var(--sus-blue)',
        endpoints: ['CDS', 'PEC', 'Relatórios'],
        credenciais: { usuario: 'ubs_centro', ativo: true }
    },
    {
        id: 2,
        nome: 'CADSUS Web',
        descricao: 'Cadastro Nacional de Usuários do SUS',
        tipo: 'governo',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-26T09:15:00',
        registrosSincronizados: 3456,
        icone: 'fa-id-card',
        cor: 'var(--sus-green)',
        endpoints: ['Consulta CNS', 'Validação', 'Atualização'],
        credenciais: { usuario: 'sistema_ubs', ativo: true }
    },
    {
        id: 3,
        nome: 'BPA - Boletim de Produção Ambulatorial',
        descricao: 'Sistema de faturamento ambulatorial SUS',
        tipo: 'governo',
        status: 'erro',
        ultimaSincronizacao: '2025-01-25T18:00:00',
        registrosSincronizados: 890,
        icone: 'fa-file-medical',
        cor: '#dc3545',
        endpoints: ['BPA-I', 'BPA-C'],
        credenciais: { usuario: 'faturamento', ativo: true },
        erro: 'Timeout na conexão. Última tentativa: 26/01 às 08:00'
    },
    {
        id: 4,
        nome: 'SISREG - Regulação',
        descricao: 'Sistema de Regulação de Vagas',
        tipo: 'governo',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-26T08:00:00',
        registrosSincronizados: 234,
        icone: 'fa-exchange-alt',
        cor: 'var(--sus-yellow)',
        endpoints: ['Consulta Vagas', 'Agendamento', 'Regulação'],
        credenciais: { usuario: 'regulacao_ubs', ativo: true }
    },
    {
        id: 5,
        nome: 'Laboratório Municipal',
        descricao: 'Sistema de Resultados de Exames',
        tipo: 'parceiro',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-26T11:00:00',
        registrosSincronizados: 1567,
        icone: 'fa-flask',
        cor: '#17a2b8',
        endpoints: ['Solicitação', 'Resultados', 'Histórico'],
        credenciais: { usuario: 'lab_integracao', ativo: true }
    },
    {
        id: 6,
        nome: 'Farmácia Popular',
        descricao: 'Programa Farmácia Popular do Brasil',
        tipo: 'governo',
        status: 'desconectado',
        ultimaSincronizacao: null,
        registrosSincronizados: 0,
        icone: 'fa-pills',
        cor: '#6c757d',
        endpoints: ['Consulta', 'Dispensação'],
        credenciais: { usuario: '', ativo: false }
    },
    {
        id: 7,
        nome: 'SISMAMA/SISCAN',
        descricao: 'Sistema de Informação de Câncer',
        tipo: 'governo',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-25T14:30:00',
        registrosSincronizados: 89,
        icone: 'fa-ribbon',
        cor: '#e83e8c',
        endpoints: ['Mamografia', 'Citopatológico'],
        credenciais: { usuario: 'cancer_ubs', ativo: true }
    },
    {
        id: 8,
        nome: 'SIPNI - Vacinação',
        descricao: 'Sistema de Informação do PNI',
        tipo: 'governo',
        status: 'conectado',
        ultimaSincronizacao: '2025-01-26T10:00:00',
        registrosSincronizados: 4523,
        icone: 'fa-syringe',
        cor: '#20c997',
        endpoints: ['Registro', 'Consulta', 'Relatórios'],
        credenciais: { usuario: 'vacinacao_ubs', ativo: true }
    }
];

const estatisticas = {
    total: 8,
    conectados: 6,
    erro: 1,
    desconectados: 1,
    sincronizacoesHoje: 45
};

export default function ServicosExternos() {
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [servicoSelecionado, setServicoSelecionado] = useState(null);
    const [showConfigurar, setShowConfigurar] = useState(false);

    const servicosFiltrados = servicosData.filter(s => {
        const matchStatus = !filtroStatus || s.status === filtroStatus;
        const matchTipo = !filtroTipo || s.tipo === filtroTipo;
        return matchStatus && matchTipo;
    });

    const getStatusBadge = (status) => {
        const config = {
            conectado: { color: 'success', label: 'Conectado', icon: 'fa-check-circle' },
            erro: { color: 'danger', label: 'Erro', icon: 'fa-exclamation-circle' },
            desconectado: { color: 'secondary', label: 'Desconectado', icon: 'fa-times-circle' }
        };
        const s = config[status] || config.desconectado;
        return (
            <span className={`badge badge-${s.color}`}>
                <i className={`fas ${s.icon}`} style={{ marginRight: '0.25rem' }}></i>
                {s.label}
            </span>
        );
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'Nunca';
        const date = new Date(dateStr);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeSince = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 60) return `há ${diffMins} min`;
        if (diffHours < 24) return `há ${diffHours}h`;
        return `há ${Math.floor(diffHours / 24)} dias`;
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>
                    <i className="fas fa-plug" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                    Serviços Externos
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-sync-alt"></i> Sincronizar Todos
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i> Nova Integração
                    </button>
                </div>
            </div>

            {/* Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-blue)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-blue)', margin: 0 }}>{estatisticas.total}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Total de Serviços</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-green)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-green)', margin: 0 }}>{estatisticas.conectados}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Conectados</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #dc3545' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: '#dc3545', margin: 0 }}>{estatisticas.erro}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Com Erro</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #6c757d' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: '#6c757d', margin: 0 }}>{estatisticas.desconectados}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Desconectados</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-yellow)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-yellow)', margin: 0 }}>{estatisticas.sincronizacoesHoje}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Sincs. Hoje</small>
                    </div>
                </div>
            </div>

            {/* Alert for errors */}
            {estatisticas.erro > 0 && (
                <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
                    <strong><i className="fas fa-exclamation-triangle"></i> Atenção:</strong> {estatisticas.erro} serviço(s) com erro de conexão. Verifique as configurações.
                </div>
            )}

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Status</label>
                            <select
                                className="form-control"
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="conectado">Conectados</option>
                                <option value="erro">Com Erro</option>
                                <option value="desconectado">Desconectados</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Tipo</label>
                            <select
                                className="form-control"
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="governo">Governo/SUS</option>
                                <option value="parceiro">Parceiros</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Pesquisar</label>
                            <input type="text" className="form-control" placeholder="Nome do serviço..." />
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {servicosFiltrados.map(servico => (
                    <div
                        key={servico.id}
                        className="card"
                        style={{
                            borderLeft: `4px solid ${servico.status === 'conectado' ? 'var(--sus-green)' :
                                servico.status === 'erro' ? '#dc3545' : '#6c757d'}`
                        }}
                    >
                        <div className="card-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '10px',
                                        background: servico.cor,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className={`fas ${servico.icone} fa-lg`}></i>
                                    </div>
                                    <div>
                                        <h5 style={{ margin: 0 }}>{servico.nome}</h5>
                                        <small style={{ color: 'var(--sus-gray)' }}>{servico.descricao}</small>
                                    </div>
                                </div>
                                {getStatusBadge(servico.status)}
                            </div>

                            {servico.erro && (
                                <div className="alert alert-danger" style={{ margin: '1rem 0 0', padding: '0.5rem', fontSize: '0.85rem' }}>
                                    <i className="fas fa-exclamation-circle"></i> {servico.erro}
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                <div>
                                    <small style={{ color: 'var(--sus-gray)' }}>Última Sincronização</small>
                                    <p style={{ margin: 0, fontWeight: '500' }}>
                                        {formatDateTime(servico.ultimaSincronizacao)}
                                        {servico.ultimaSincronizacao && (
                                            <small style={{ color: 'var(--sus-gray)', marginLeft: '0.5rem' }}>
                                                ({getTimeSince(servico.ultimaSincronizacao)})
                                            </small>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <small style={{ color: 'var(--sus-gray)' }}>Registros Sincronizados</small>
                                    <p style={{ margin: 0, fontWeight: '500' }}>{servico.registrosSincronizados.toLocaleString()}</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <small style={{ color: 'var(--sus-gray)' }}>Endpoints:</small>
                                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                    {servico.endpoints.map((ep, i) => (
                                        <span key={i} className="badge badge-secondary" style={{ fontWeight: 'normal' }}>{ep}</span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => setServicoSelecionado(servico)}
                                >
                                    <i className="fas fa-eye"></i> Detalhes
                                </button>
                                {servico.status === 'conectado' && (
                                    <button className="btn btn-sm btn-outline-success">
                                        <i className="fas fa-sync-alt"></i> Sincronizar
                                    </button>
                                )}
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => {
                                        setServicoSelecionado(servico);
                                        setShowConfigurar(true);
                                    }}
                                >
                                    <i className="fas fa-cog"></i> Configurar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {servicoSelecionado && !showConfigurar && (
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
                    onClick={() => setServicoSelecionado(null)}
                >
                    <div
                        className="card"
                        style={{ width: '700px', maxWidth: '90%', maxHeight: '80vh', overflow: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: servicoSelecionado.cor, color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                    <i className={`fas ${servicoSelecionado.icone}`}></i> {servicoSelecionado.nome}
                                </span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setServicoSelecionado(null)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                {getStatusBadge(servicoSelecionado.status)}
                                <span className="badge badge-secondary">
                                    {servicoSelecionado.tipo === 'governo' ? 'Governo/SUS' : 'Parceiro'}
                                </span>
                            </div>

                            <p>{servicoSelecionado.descricao}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="card" style={{ background: '#f8f9fa' }}>
                                    <div className="card-body" style={{ padding: '1rem', textAlign: 'center' }}>
                                        <small style={{ color: 'var(--sus-gray)' }}>Registros Sincronizados</small>
                                        <h3 style={{ margin: '0.25rem 0', color: 'var(--sus-blue)' }}>
                                            {servicoSelecionado.registrosSincronizados.toLocaleString()}
                                        </h3>
                                    </div>
                                </div>
                                <div className="card" style={{ background: '#f8f9fa' }}>
                                    <div className="card-body" style={{ padding: '1rem', textAlign: 'center' }}>
                                        <small style={{ color: 'var(--sus-gray)' }}>Última Sincronização</small>
                                        <h5 style={{ margin: '0.25rem 0' }}>
                                            {formatDateTime(servicoSelecionado.ultimaSincronizacao)}
                                        </h5>
                                    </div>
                                </div>
                            </div>

                            <h6>Endpoints Disponíveis</h6>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                {servicoSelecionado.endpoints.map((ep, i) => (
                                    <span key={i} className="badge badge-primary" style={{ padding: '0.5rem 0.75rem' }}>{ep}</span>
                                ))}
                            </div>

                            <h6>Histórico de Sincronizações</h6>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Data/Hora</th>
                                        <th>Tipo</th>
                                        <th>Registros</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>26/01/2025 10:30</td>
                                        <td>Automática</td>
                                        <td>+45</td>
                                        <td><span className="badge badge-success">Sucesso</span></td>
                                    </tr>
                                    <tr>
                                        <td>26/01/2025 06:00</td>
                                        <td>Automática</td>
                                        <td>+123</td>
                                        <td><span className="badge badge-success">Sucesso</span></td>
                                    </tr>
                                    <tr>
                                        <td>25/01/2025 18:00</td>
                                        <td>Manual</td>
                                        <td>+67</td>
                                        <td><span className="badge badge-success">Sucesso</span></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button className="btn btn-outline-secondary">
                                    <i className="fas fa-history"></i> Ver Logs
                                </button>
                                <button className="btn btn-success">
                                    <i className="fas fa-sync-alt"></i> Sincronizar Agora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Config Modal */}
            {servicoSelecionado && showConfigurar && (
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
                        setServicoSelecionado(null);
                        setShowConfigurar(false);
                    }}
                >
                    <div
                        className="card"
                        style={{ width: '600px', maxWidth: '90%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-blue)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-cog"></i> Configurar {servicoSelecionado.nome}</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => {
                                        setServicoSelecionado(null);
                                        setShowConfigurar(false);
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">URL do Serviço *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={`https://api.${servicoSelecionado.nome.toLowerCase().replace(/\s/g, '')}.gov.br`}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label className="form-label">Usuário</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={servicoSelecionado.credenciais.usuario}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Senha</label>
                                    <input type="password" className="form-control" placeholder="••••••••" />
                                </div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Chave de API (se aplicável)</label>
                                <input type="text" className="form-control" placeholder="Chave de autenticação" />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Intervalo de Sincronização</label>
                                <select className="form-control">
                                    <option>A cada 15 minutos</option>
                                    <option>A cada 30 minutos</option>
                                    <option>A cada hora</option>
                                    <option>A cada 6 horas</option>
                                    <option>Diariamente</option>
                                    <option>Manual</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input type="checkbox" id="ativo" defaultChecked={servicoSelecionado.credenciais.ativo} />
                                    <label htmlFor="ativo">Integração Ativa</label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                <button className="btn btn-outline-info">
                                    <i className="fas fa-plug"></i> Testar Conexão
                                </button>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            setServicoSelecionado(null);
                                            setShowConfigurar(false);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button className="btn btn-primary">
                                        <i className="fas fa-save"></i> Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
