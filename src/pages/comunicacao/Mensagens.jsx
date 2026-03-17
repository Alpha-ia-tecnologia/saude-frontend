import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    MessageCircle,
    Plus,
    Search,
    MoreVertical,
    Paperclip,
    Send,
    CheckCheck,
    X,
    UserRound,
} from 'lucide-react';

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
        <div className="h-[calc(100vh-120px)] space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    Mensagens
                </h1>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark" onClick={() => setShowNovaConversa(true)}>
                    <Plus className="h-4 w-4" /> Nova Conversa
                </button>
            </div>

            {/* Main Container */}
            <div className="rounded-xl border border-border bg-card shadow-sm flex h-[calc(100%-60px)] overflow-hidden">
                {/* Conversations List */}
                <div className="w-[350px] flex flex-col border-r border-border">
                    {/* Search */}
                    <div className="border-b border-border p-4">
                        <div className="relative">
                            <input
                                type="text"
                                className="h-10 w-full rounded-lg border border-input bg-white pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Buscar conversas..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>

                    {/* Conversations */}
                    <div className="flex-1 overflow-auto">
                        {conversasFiltradas.map(conversa => (
                            <div
                                key={conversa.id}
                                onClick={() => setConversaSelecionada(conversa)}
                                className={cn(
                                    'cursor-pointer border-b border-border p-4 transition-colors hover:bg-muted/50',
                                    conversaSelecionada?.id === conversa.id && 'bg-primary/5'
                                )}
                            >
                                <div className="flex gap-3">
                                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white">
                                        {conversa.avatar}
                                        {conversa.online && (
                                            <div className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <strong className="text-[0.95rem]">{conversa.contato}</strong>
                                            <small className="text-muted-foreground">{formatDateTime(conversa.dataHora)}</small>
                                        </div>
                                        <small className="text-muted-foreground">{conversa.cargo}</small>
                                        <div className="mt-1 flex items-center justify-between">
                                            <p className="m-0 max-w-[200px] truncate text-[0.85rem] text-muted-foreground">
                                                {conversa.ultimaMensagem}
                                            </p>
                                            {conversa.naoLidas > 0 && (
                                                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-white">
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
                <div className="flex flex-1 flex-col">
                    {conversaSelecionada ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center gap-3 border-b border-border p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white">
                                    {conversaSelecionada.avatar}
                                </div>
                                <div>
                                    <strong>{conversaSelecionada.contato}</strong>
                                    <br />
                                    <small className={conversaSelecionada.online ? 'text-emerald-500' : 'text-muted-foreground'}>
                                        {conversaSelecionada.online ? '● Online' : '○ Offline'}
                                    </small>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted" title="Buscar">
                                        <Search className="h-3.5 w-3.5" />
                                    </button>
                                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted" title="Mais opções">
                                        <MoreVertical className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex flex-1 flex-col gap-3 overflow-auto bg-muted/30 p-4">
                                {mensagens.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={cn('flex', msg.enviada ? 'justify-end' : 'justify-start')}
                                    >
                                        <div className={cn(
                                            'max-w-[70%] px-4 py-3 shadow-sm',
                                            msg.enviada
                                                ? 'rounded-2xl rounded-br-none bg-primary text-white'
                                                : 'rounded-2xl rounded-bl-none bg-white text-foreground'
                                        )}>
                                            <p className="m-0">{msg.conteudo}</p>
                                            <small className="mt-1 block text-right text-xs opacity-70">
                                                {formatMessageTime(msg.dataHora)}
                                                {msg.enviada && <CheckCheck className="ml-1 inline h-3 w-3" />}
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="flex items-end gap-2 border-t border-border p-4">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                                    <Paperclip className="h-4 w-4" />
                                </button>
                                <textarea
                                    className="w-full resize-none rounded-lg border border-input bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Digite sua mensagem..."
                                    value={novaMensagem}
                                    onChange={(e) => setNovaMensagem(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    rows="1"
                                />
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
                                    onClick={handleEnviarMensagem}
                                    disabled={!novaMensagem.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <MessageCircle className="mx-auto mb-4 h-16 w-16 opacity-50" />
                                <p>Selecione uma conversa para começar</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Conversation Modal */}
            {showNovaConversa && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowNovaConversa(false)}
                >
                    <div
                        className="rounded-xl border border-border bg-card shadow-sm w-[500px] max-w-[90%]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="border-b border-border bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Nova Conversa</span>
                                <button
                                    className="rounded-lg bg-white/20 px-2 py-1 text-white hover:bg-white/30"
                                    onClick={() => setShowNovaConversa(false)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-foreground">Destinatário</label>
                                <input type="text" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Buscar profissional ou unidade..." />
                            </div>

                            <h6 className="mb-2 font-semibold">Sugestões</h6>
                            <div className="mb-4 flex flex-col gap-2">
                                {['Dr. Paulo Lima - Cardiologista', 'Dra. Ana Santos - UBS Norte', 'Farmácia Central', 'CAPS Municipal'].map((item, i) => (
                                    <div
                                        key={i}
                                        className="cursor-pointer rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <UserRound className="mr-2 inline h-4 w-4 text-primary" />
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-foreground">Mensagem Inicial</label>
                                <textarea className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" rows="3" placeholder="Digite sua mensagem..."></textarea>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted" onClick={() => setShowNovaConversa(false)}>
                                    Cancelar
                                </button>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                                    <Send className="h-4 w-4" /> Iniciar Conversa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
