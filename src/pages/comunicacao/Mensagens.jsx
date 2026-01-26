import { useState } from 'react';

// Sample conversations data
const conversasData = [
    {
        id: 1,
        contato: 'Dr. Paulo Lima',
        cargo: 'Médico - Hospital Regional',
        avatar: 'PL',
        ultimaMensagem: 'Paciente Maria Silva encaminhado, aguardo retorno sobre o agendamento.',
        dataHora: '2025-01-26T10:30:00',
        naoLidas: 2,
        online: true
    },
    {
        id: 2,
        contato: 'Dra. Ana Santos',
        cargo: 'Médica - UBS Norte',
        avatar: 'AS',
        ultimaMensagem: 'Obrigada pelas orientações sobre o protocolo de diabetes.',
        dataHora: '2025-01-26T09:15:00',
        naoLidas: 0,
        online: true
    },
    {
        id: 3,
        contato: 'Farmácia Central',
        cargo: 'Setor',
        avatar: 'FC',
        ultimaMensagem: 'Lote de Losartana chegou. Estoque normalizado.',
        dataHora: '2025-01-25T16:45:00',
        naoLidas: 1,
        online: false
    },
    {
        id: 4,
        contato: 'CAPS Municipal',
        cargo: 'Unidade de Saúde',
        avatar: 'CM',
        ultimaMensagem: 'Confirmamos recebimento do encaminhamento REF2025000122.',
        dataHora: '2025-01-25T14:20:00',
        naoLidas: 0,
        online: false
    },
    {
        id: 5,
        contato: 'Coordenação de Saúde',
        cargo: 'Gestão',
        avatar: 'CS',
        ultimaMensagem: 'Reunião de equipe amanhã às 14h. Confirme presença.',
        dataHora: '2025-01-24T11:00:00',
        naoLidas: 0,
        online: false
    }
];

// Sample messages for selected conversation
const mensagensExemplo = [
    {
        id: 1,
        remetente: 'Dr. Paulo Lima',
        conteudo: 'Bom dia! Recebi o encaminhamento da paciente Maria Silva Santos.',
        dataHora: '2025-01-26T09:00:00',
        enviada: false
    },
    {
        id: 2,
        remetente: 'Eu',
        conteudo: 'Bom dia, Dr. Paulo! Que bom. Ela está com HAS refratária, precisando de avaliação cardiológica urgente.',
        dataHora: '2025-01-26T09:05:00',
        enviada: true
    },
    {
        id: 3,
        remetente: 'Dr. Paulo Lima',
        conteudo: 'Entendi. Vi os exames anexados. Vou verificar a disponibilidade de agenda.',
        dataHora: '2025-01-26T09:10:00',
        enviada: false
    },
    {
        id: 4,
        remetente: 'Eu',
        conteudo: 'Perfeito! Ela está usando Losartana 50mg 2x ao dia, mas sem controle adequado.',
        dataHora: '2025-01-26T09:15:00',
        enviada: true
    },
    {
        id: 5,
        remetente: 'Dr. Paulo Lima',
        conteudo: 'Paciente Maria Silva encaminhado, aguardo retorno sobre o agendamento.',
        dataHora: '2025-01-26T10:30:00',
        enviada: false
    }
];

export default function Mensagens() {
    const [conversaSelecionada, setConversaSelecionada] = useState(conversasData[0]);
    const [mensagens, setMensagens] = useState(mensagensExemplo);
    const [novaMensagem, setNovaMensagem] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [showNovaConversa, setShowNovaConversa] = useState(false);

    const conversasFiltradas = conversasData.filter(c =>
        c.contato.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Ontem';
        } else {
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        }
    };

    const formatMessageTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const handleEnviarMensagem = () => {
        if (!novaMensagem.trim()) return;

        const nova = {
            id: mensagens.length + 1,
            remetente: 'Eu',
            conteudo: novaMensagem,
            dataHora: new Date().toISOString(),
            enviada: true
        };

        setMensagens([...mensagens, nova]);
        setNovaMensagem('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEnviarMensagem();
        }
    };

    return (
        <div className="fade-in" style={{ height: 'calc(100vh - 120px)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ margin: 0 }}>
                    <i className="fas fa-comments" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                    Mensagens
                </h1>
                <button className="btn btn-primary" onClick={() => setShowNovaConversa(true)}>
                    <i className="fas fa-plus"></i> Nova Conversa
                </button>
            </div>

            {/* Main Container */}
            <div className="card" style={{ height: 'calc(100% - 60px)', display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
                {/* Conversations List */}
                <div style={{
                    width: '350px',
                    borderRight: '1px solid #e9ecef',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Search */}
                    <div style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar conversas..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <i className="fas fa-search" style={{
                                position: 'absolute',
                                left: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--sus-gray)'
                            }}></i>
                        </div>
                    </div>

                    {/* Conversations */}
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        {conversasFiltradas.map(conversa => (
                            <div
                                key={conversa.id}
                                onClick={() => setConversaSelecionada(conversa)}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid #e9ecef',
                                    cursor: 'pointer',
                                    background: conversaSelecionada?.id === conversa.id ? '#e7f3ff' : 'white',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = conversaSelecionada?.id === conversa.id ? '#e7f3ff' : '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.background = conversaSelecionada?.id === conversa.id ? '#e7f3ff' : 'white'}
                            >
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'var(--sus-blue)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '600',
                                        position: 'relative'
                                    }}>
                                        {conversa.avatar}
                                        {conversa.online && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '2px',
                                                right: '2px',
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: 'var(--sus-green)',
                                                border: '2px solid white'
                                            }}></div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <strong style={{ fontSize: '0.95rem' }}>{conversa.contato}</strong>
                                            <small style={{ color: 'var(--sus-gray)' }}>{formatDateTime(conversa.dataHora)}</small>
                                        </div>
                                        <small style={{ color: 'var(--sus-gray)' }}>{conversa.cargo}</small>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.85rem',
                                                color: '#666',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '200px'
                                            }}>
                                                {conversa.ultimaMensagem}
                                            </p>
                                            {conversa.naoLidas > 0 && (
                                                <span className="badge badge-primary" style={{ borderRadius: '50%', minWidth: '20px' }}>
                                                    {conversa.naoLidas}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {conversaSelecionada ? (
                        <>
                            {/* Chat Header */}
                            <div style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e9ecef',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--sus-blue)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '600'
                                }}>
                                    {conversaSelecionada.avatar}
                                </div>
                                <div>
                                    <strong>{conversaSelecionada.contato}</strong>
                                    <br />
                                    <small style={{ color: conversaSelecionada.online ? 'var(--sus-green)' : 'var(--sus-gray)' }}>
                                        {conversaSelecionada.online ? '● Online' : '○ Offline'}
                                    </small>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-sm btn-outline-secondary" title="Buscar">
                                        <i className="fas fa-search"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary" title="Mais opções">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{
                                flex: 1,
                                overflow: 'auto',
                                padding: '1rem',
                                background: '#f8f9fa',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                            }}>
                                {mensagens.map(msg => (
                                    <div
                                        key={msg.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: msg.enviada ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <div style={{
                                            maxWidth: '70%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: msg.enviada ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                            background: msg.enviada ? 'var(--sus-blue)' : 'white',
                                            color: msg.enviada ? 'white' : 'inherit',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                        }}>
                                            <p style={{ margin: 0 }}>{msg.conteudo}</p>
                                            <small style={{
                                                opacity: 0.7,
                                                fontSize: '0.75rem',
                                                display: 'block',
                                                textAlign: 'right',
                                                marginTop: '0.25rem'
                                            }}>
                                                {formatMessageTime(msg.dataHora)}
                                                {msg.enviada && <i className="fas fa-check-double" style={{ marginLeft: '0.25rem' }}></i>}
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div style={{
                                padding: '1rem',
                                borderTop: '1px solid #e9ecef',
                                display: 'flex',
                                gap: '0.5rem',
                                alignItems: 'flex-end'
                            }}>
                                <button className="btn btn-outline-secondary">
                                    <i className="fas fa-paperclip"></i>
                                </button>
                                <textarea
                                    className="form-control"
                                    placeholder="Digite sua mensagem..."
                                    value={novaMensagem}
                                    onChange={(e) => setNovaMensagem(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    rows="1"
                                    style={{ resize: 'none' }}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={handleEnviarMensagem}
                                    disabled={!novaMensagem.trim()}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--sus-gray)'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <i className="fas fa-comments fa-4x" style={{ marginBottom: '1rem', opacity: 0.5 }}></i>
                                <p>Selecione uma conversa para começar</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Conversation Modal */}
            {showNovaConversa && (
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
                    onClick={() => setShowNovaConversa(false)}
                >
                    <div
                        className="card"
                        style={{ width: '500px', maxWidth: '90%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-blue)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-plus"></i> Nova Conversa</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setShowNovaConversa(false)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Destinatário</label>
                                <input type="text" className="form-control" placeholder="Buscar profissional ou unidade..." />
                            </div>

                            <h6>Sugestões</h6>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                {['Dr. Paulo Lima - Cardiologista', 'Dra. Ana Santos - UBS Norte', 'Farmácia Central', 'CAPS Municipal'].map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            padding: '0.75rem',
                                            border: '1px solid #e9ecef',
                                            borderRadius: '0.25rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <i className="fas fa-user-md" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Mensagem Inicial</label>
                                <textarea className="form-control" rows="3" placeholder="Digite sua mensagem..."></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button className="btn btn-outline-secondary" onClick={() => setShowNovaConversa(false)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-primary">
                                    <i className="fas fa-paper-plane"></i> Iniciar Conversa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
