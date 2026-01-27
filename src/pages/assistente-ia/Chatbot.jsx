import { useState, useRef, useEffect } from 'react';
import { config } from '../../config/app.config';

export function Chatbot() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Olá! Sou o assistente de IA do PEC. Como posso ajudar você hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState('deepseek');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(`${config.api.ai}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider,
                    messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.response.content,
                    mode: data.mode,
                    model: data.response.model
                }]);
            } else {
                throw new Error(data.error || 'Erro ao processar mensagem');
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Erro: ${error.message}. Verifique se o servidor backend está rodando.`,
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: 'Chat limpo. Como posso ajudar?' }]);
    };

    return (
        <div className="fade-in" style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ margin: 0 }}>
                    <i className="fas fa-robot" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                    Assistente IA
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select
                        className="form-control"
                        style={{ width: 'auto' }}
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                    >
                        <option value="deepseek">DeepSeek</option>
                        <option value="openai">OpenAI (GPT-4)</option>
                        <option value="gemini">Google Gemini</option>
                    </select>
                    <button className="btn btn-outline-primary" onClick={clearChat}>
                        <i className="fas fa-trash"></i> Limpar
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: '1rem'
                            }}
                        >
                            <div style={{
                                maxWidth: '70%',
                                padding: '0.75rem 1rem',
                                borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                background: msg.role === 'user' ? 'var(--sus-blue)' : msg.isError ? '#f8d7da' : '#f8f9fa',
                                color: msg.role === 'user' ? 'white' : msg.isError ? '#721c24' : 'inherit'
                            }}>
                                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                                {msg.mode && (
                                    <small style={{
                                        display: 'block',
                                        marginTop: '0.5rem',
                                        opacity: 0.7,
                                        fontSize: '0.75rem'
                                    }}>
                                        {msg.mode === 'demo' ? '🔸 Modo Demo' : '🟢 Produção'} • {msg.model}
                                    </small>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem 1rem', background: '#f8f9fa', borderRadius: '1rem' }}>
                                <i className="fas fa-spinner fa-spin"></i> Processando...
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: '1rem', borderTop: '1px solid var(--sus-light-gray)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline-primary" title="Anexar arquivo">
                            <i className="fas fa-paperclip"></i>
                        </button>
                        <textarea
                            className="form-control"
                            placeholder="Digite sua mensagem..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            rows={1}
                            style={{ resize: 'none' }}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <small style={{ color: 'var(--sus-gray)', marginTop: '0.5rem', display: 'block' }}>
                        Pressione Enter para enviar. O assistente pode auxiliar em decisões clínicas.
                    </small>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
