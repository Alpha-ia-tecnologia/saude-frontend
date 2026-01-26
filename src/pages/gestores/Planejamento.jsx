import { useState } from 'react';

// Strategic objectives data
const objetivosEstrategicos = [
    {
        id: 1,
        titulo: 'Ampliar Cobertura da Atenção Básica',
        descricao: 'Aumentar a cobertura populacional da atenção básica para 85% até 2026',
        progresso: 72,
        prazo: '2026-12-31',
        status: 'em_andamento',
        responsavel: 'Coord. Atenção Básica',
        prioridade: 'alta'
    },
    {
        id: 2,
        titulo: 'Reduzir Mortalidade Infantil',
        descricao: 'Reduzir a taxa de mortalidade infantil para menos de 10/1000 nascidos vivos',
        progresso: 85,
        prazo: '2025-12-31',
        status: 'em_andamento',
        responsavel: 'Coord. Saúde da Criança',
        prioridade: 'alta'
    },
    {
        id: 3,
        titulo: 'Implementar Prontuário Eletrônico',
        descricao: 'Implantar PEP em 100% das unidades de saúde',
        progresso: 95,
        prazo: '2025-06-30',
        status: 'em_andamento',
        responsavel: 'TI/Informática',
        prioridade: 'media'
    },
    {
        id: 4,
        titulo: 'Qualificar Equipes de Saúde',
        descricao: 'Capacitar 100% dos profissionais em protocolos clínicos atualizados',
        progresso: 45,
        prazo: '2025-12-31',
        status: 'em_andamento',
        responsavel: 'Educação Permanente',
        prioridade: 'media'
    },
    {
        id: 5,
        titulo: 'Modernizar Infraestrutura',
        descricao: 'Reformar e adequar 5 unidades básicas de saúde',
        progresso: 20,
        prazo: '2026-06-30',
        status: 'planejado',
        responsavel: 'Coord. Administrativa',
        prioridade: 'baixa'
    }
];

// Action plans
const planosAcao = [
    { id: 1, objetivo: 1, acao: 'Contratar 10 novos ACS', prazo: '2025-03-31', status: 'em_andamento', progresso: 60 },
    { id: 2, objetivo: 1, acao: 'Ampliar horário de funcionamento UBS Centro', prazo: '2025-02-28', status: 'concluido', progresso: 100 },
    { id: 3, objetivo: 2, acao: 'Implementar busca ativa de gestantes', prazo: '2025-04-30', status: 'em_andamento', progresso: 75 },
    { id: 4, objetivo: 3, acao: 'Treinamento de usuários do PEP', prazo: '2025-03-15', status: 'em_andamento', progresso: 80 },
    { id: 5, objetivo: 4, acao: 'Curso de atualização em diabetes', prazo: '2025-02-28', status: 'planejado', progresso: 0 }
];

// Risk matrix
const riscosIdentificados = [
    { id: 1, descricao: 'Corte orçamentário federal', probabilidade: 'alta', impacto: 'alto', mitigacao: 'Buscar parcerias e recursos alternativos' },
    { id: 2, descricao: 'Rotatividade de profissionais', probabilidade: 'media', impacto: 'alto', mitigacao: 'Plano de carreira e valorização' },
    { id: 3, descricao: 'Resistência à mudança tecnológica', probabilidade: 'media', impacto: 'medio', mitigacao: 'Capacitação e suporte contínuo' },
    { id: 4, descricao: 'Surto epidêmico', probabilidade: 'baixa', impacto: 'alto', mitigacao: 'Plano de contingência ativo' }
];

export default function Planejamento() {
    const [abaAtiva, setAbaAtiva] = useState('objetivos');
    const [objetivoSelecionado, setObjetivoSelecionado] = useState(null);

    const getStatusBadge = (status) => {
        const config = {
            em_andamento: { color: 'info', label: 'Em Andamento' },
            concluido: { color: 'success', label: 'Concluído' },
            planejado: { color: 'secondary', label: 'Planejado' },
            atrasado: { color: 'danger', label: 'Atrasado' }
        };
        const s = config[status] || config.planejado;
        return <span className={`badge badge-${s.color}`}>{s.label}</span>;
    };

    const getPrioridadeBadge = (prioridade) => {
        const config = {
            alta: { color: 'danger', label: 'Alta' },
            media: { color: 'warning', label: 'Média' },
            baixa: { color: 'secondary', label: 'Baixa' }
        };
        const p = config[prioridade] || config.media;
        return <span className={`badge badge-${p.color}`}>{p.label}</span>;
    };

    const getRiscoColor = (nivel) => {
        if (nivel === 'alto' || nivel === 'alta') return '#dc3545';
        if (nivel === 'medio' || nivel === 'media') return 'var(--sus-yellow)';
        return 'var(--sus-green)';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    const calcularResumo = () => {
        const total = objetivosEstrategicos.length;
        const concluidos = objetivosEstrategicos.filter(o => o.progresso === 100).length;
        const emAndamento = objetivosEstrategicos.filter(o => o.progresso > 0 && o.progresso < 100).length;
        const mediaProgresso = objetivosEstrategicos.reduce((acc, o) => acc + o.progresso, 0) / total;
        return { total, concluidos, emAndamento, mediaProgresso: mediaProgresso.toFixed(0) };
    };

    const resumo = calcularResumo();

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>
                        <i className="fas fa-bullseye" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                        Planejamento Estratégico
                    </h1>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--sus-gray)' }}>Plano Municipal de Saúde 2022-2025</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-file-pdf"></i> Exportar PMS
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i> Novo Objetivo
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ borderTop: '4px solid var(--sus-blue)' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--sus-blue)', margin: 0 }}>{resumo.total}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Objetivos Estratégicos</small>
                    </div>
                </div>
                <div className="card" style={{ borderTop: '4px solid var(--sus-green)' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--sus-green)', margin: 0 }}>{resumo.concluidos}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Concluídos</small>
                    </div>
                </div>
                <div className="card" style={{ borderTop: '4px solid #17a2b8' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#17a2b8', margin: 0 }}>{resumo.emAndamento}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Em Andamento</small>
                    </div>
                </div>
                <div className="card" style={{ borderTop: '4px solid var(--sus-yellow)' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--sus-yellow)', margin: 0 }}>{resumo.mediaProgresso}%</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Progresso Médio</small>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body" style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className={`btn ${abaAtiva === 'objetivos' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setAbaAtiva('objetivos')}>
                            <i className="fas fa-bullseye"></i> Objetivos Estratégicos
                        </button>
                        <button className={`btn ${abaAtiva === 'acoes' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setAbaAtiva('acoes')}>
                            <i className="fas fa-tasks"></i> Planos de Ação
                        </button>
                        <button className={`btn ${abaAtiva === 'riscos' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setAbaAtiva('riscos')}>
                            <i className="fas fa-exclamation-triangle"></i> Matriz de Riscos
                        </button>
                        <button className={`btn ${abaAtiva === 'cronograma' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setAbaAtiva('cronograma')}>
                            <i className="fas fa-calendar-alt"></i> Cronograma
                        </button>
                    </div>
                </div>
            </div>

            {/* Objetivos Tab */}
            {abaAtiva === 'objetivos' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {objetivosEstrategicos.map(obj => (
                        <div key={obj.id} className="card" style={{ borderLeft: `4px solid ${obj.prioridade === 'alta' ? '#dc3545' : obj.prioridade === 'media' ? 'var(--sus-yellow)' : 'var(--sus-green)'}` }}>
                            <div className="card-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h5 style={{ margin: 0 }}>{obj.titulo}</h5>
                                        <p style={{ margin: '0.25rem 0 0', color: 'var(--sus-gray)', fontSize: '0.9rem' }}>{obj.descricao}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {getPrioridadeBadge(obj.prioridade)}
                                        {getStatusBadge(obj.status)}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <small>Progresso</small>
                                            <strong>{obj.progresso}%</strong>
                                        </div>
                                        <div style={{ height: '10px', background: '#e9ecef', borderRadius: '5px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${obj.progresso}%`,
                                                height: '100%',
                                                background: obj.progresso >= 80 ? 'var(--sus-green)' : obj.progresso >= 50 ? 'var(--sus-blue)' : 'var(--sus-yellow)',
                                                borderRadius: '5px'
                                            }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <small style={{ color: 'var(--sus-gray)' }}>Prazo</small>
                                        <p style={{ margin: 0, fontWeight: '600' }}>{formatDate(obj.prazo)}</p>
                                    </div>
                                    <div>
                                        <small style={{ color: 'var(--sus-gray)' }}>Responsável</small>
                                        <p style={{ margin: 0, fontWeight: '600' }}>{obj.responsavel}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-sm btn-outline-secondary">
                                        <i className="fas fa-edit"></i> Editar
                                    </button>
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => setObjetivoSelecionado(obj)}>
                                        <i className="fas fa-tasks"></i> Ver Ações
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ações Tab */}
            {abaAtiva === 'acoes' && (
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><i className="fas fa-tasks"></i> Planos de Ação</span>
                        <button className="btn btn-sm btn-primary"><i className="fas fa-plus"></i> Nova Ação</button>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <table className="table" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>Ação</th>
                                    <th>Objetivo</th>
                                    <th>Prazo</th>
                                    <th>Progresso</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {planosAcao.map(acao => {
                                    const objetivo = objetivosEstrategicos.find(o => o.id === acao.objetivo);
                                    return (
                                        <tr key={acao.id}>
                                            <td><strong>{acao.acao}</strong></td>
                                            <td style={{ fontSize: '0.85rem' }}>{objetivo?.titulo}</td>
                                            <td>{formatDate(acao.prazo)}</td>
                                            <td style={{ width: '150px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ flex: 1, height: '8px', background: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${acao.progresso}%`, height: '100%', background: 'var(--sus-blue)', borderRadius: '4px' }}></div>
                                                    </div>
                                                    <small>{acao.progresso}%</small>
                                                </div>
                                            </td>
                                            <td>{getStatusBadge(acao.status)}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary"><i className="fas fa-edit"></i></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Riscos Tab */}
            {abaAtiva === 'riscos' && (
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-exclamation-triangle"></i> Matriz de Riscos
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <table className="table" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>Risco Identificado</th>
                                    <th style={{ textAlign: 'center' }}>Probabilidade</th>
                                    <th style={{ textAlign: 'center' }}>Impacto</th>
                                    <th>Ação de Mitigação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {riscosIdentificados.map(risco => (
                                    <tr key={risco.id}>
                                        <td><strong>{risco.descricao}</strong></td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                background: getRiscoColor(risco.probabilidade),
                                                color: 'white',
                                                fontSize: '0.8rem'
                                            }}>
                                                {risco.probabilidade.charAt(0).toUpperCase() + risco.probabilidade.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                background: getRiscoColor(risco.impacto),
                                                color: 'white',
                                                fontSize: '0.8rem'
                                            }}>
                                                {risco.impacto.charAt(0).toUpperCase() + risco.impacto.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.9rem' }}>{risco.mitigacao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Cronograma Tab */}
            {abaAtiva === 'cronograma' && (
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-calendar-alt"></i> Cronograma Geral
                    </div>
                    <div className="card-body">
                        <div style={{ overflowX: 'auto' }}>
                            <div style={{ display: 'flex', gap: '1px', marginBottom: '1rem' }}>
                                <div style={{ width: '200px', flexShrink: 0 }}></div>
                                {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((mes, i) => (
                                    <div key={i} style={{ flex: 1, minWidth: '60px', textAlign: 'center', padding: '0.5rem', background: '#f8f9fa', fontWeight: '600', fontSize: '0.85rem' }}>
                                        {mes}
                                    </div>
                                ))}
                            </div>
                            {objetivosEstrategicos.map((obj, i) => {
                                const prazoMes = new Date(obj.prazo).getMonth();
                                return (
                                    <div key={obj.id} style={{ display: 'flex', gap: '1px', marginBottom: '0.5rem' }}>
                                        <div style={{ width: '200px', flexShrink: 0, padding: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>
                                            {obj.titulo.substring(0, 30)}...
                                        </div>
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(mes => (
                                            <div key={mes} style={{
                                                flex: 1,
                                                minWidth: '60px',
                                                height: '30px',
                                                background: mes <= prazoMes ? (obj.progresso >= 80 ? 'var(--sus-green)' : obj.progresso >= 50 ? 'var(--sus-blue)' : 'var(--sus-yellow)') : '#e9ecef',
                                                opacity: mes <= prazoMes ? (mes <= prazoMes * (obj.progresso / 100) ? 1 : 0.4) : 1,
                                                borderRadius: mes === 0 ? '4px 0 0 4px' : mes === prazoMes ? '0 4px 4px 0' : 0
                                            }}></div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Objetivo Detail Modal */}
            {objetivoSelecionado && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setObjetivoSelecionado(null)}
                >
                    <div className="card" style={{ width: '700px', maxWidth: '90%', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <div className="card-header" style={{ background: 'var(--sus-blue)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-bullseye"></i> {objetivoSelecionado.titulo}</span>
                                <button className="btn btn-sm btn-light" onClick={() => setObjetivoSelecionado(null)}><i className="fas fa-times"></i></button>
                            </div>
                        </div>
                        <div className="card-body">
                            <p>{objetivoSelecionado.descricao}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div className="card" style={{ background: '#f8f9fa' }}>
                                    <div className="card-body" style={{ padding: '1rem', textAlign: 'center' }}>
                                        <small style={{ color: 'var(--sus-gray)' }}>Progresso</small>
                                        <h3 style={{ margin: '0.25rem 0' }}>{objetivoSelecionado.progresso}%</h3>
                                    </div>
                                </div>
                                <div className="card" style={{ background: '#f8f9fa' }}>
                                    <div className="card-body" style={{ padding: '1rem', textAlign: 'center' }}>
                                        <small style={{ color: 'var(--sus-gray)' }}>Prazo</small>
                                        <h5 style={{ margin: '0.25rem 0' }}>{formatDate(objetivoSelecionado.prazo)}</h5>
                                    </div>
                                </div>
                                <div className="card" style={{ background: '#f8f9fa' }}>
                                    <div className="card-body" style={{ padding: '1rem', textAlign: 'center' }}>
                                        <small style={{ color: 'var(--sus-gray)' }}>Prioridade</small>
                                        <div style={{ marginTop: '0.25rem' }}>{getPrioridadeBadge(objetivoSelecionado.prioridade)}</div>
                                    </div>
                                </div>
                            </div>

                            <h6>Ações Vinculadas</h6>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Ação</th>
                                        <th>Prazo</th>
                                        <th>Progresso</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {planosAcao.filter(a => a.objetivo === objetivoSelecionado.id).map(acao => (
                                        <tr key={acao.id}>
                                            <td>{acao.acao}</td>
                                            <td>{formatDate(acao.prazo)}</td>
                                            <td>{acao.progresso}%</td>
                                            <td>{getStatusBadge(acao.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button className="btn btn-outline-secondary"><i className="fas fa-edit"></i> Editar Objetivo</button>
                                <button className="btn btn-primary"><i className="fas fa-plus"></i> Adicionar Ação</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
