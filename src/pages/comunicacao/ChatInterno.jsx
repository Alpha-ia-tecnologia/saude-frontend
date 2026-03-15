import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
    MessageSquare,
    Hash,
    Users,
    Circle,
    Shield,
    Send,
    Search,
    ChevronDown,
    ChevronRight,
    X,
    User,
    Info,
    CheckCheck,
} from 'lucide-react';

// ─── In-memory data ────────────────────────────────────────────────

const currentUser = { id: 'U001', nome: 'Dr. Carlos Oliveira', cargo: 'Médico Clínico Geral', departamento: 'Médicos', avatar: 'CO' };

const usersData = [
    { id: 'U001', nome: 'Dr. Carlos Oliveira', cargo: 'Médico Clínico Geral', departamento: 'Médicos', avatar: 'CO', online: true },
    { id: 'U002', nome: 'Dra. Ana Santos', cargo: 'Médica de Família', departamento: 'Médicos', avatar: 'AS', online: true },
    { id: 'U003', nome: 'Dr. Paulo Lima', cargo: 'Cardiologista', departamento: 'Médicos', avatar: 'PL', online: false },
    { id: 'U004', nome: 'Enf. Carla Dias', cargo: 'Enfermeira Chefe', departamento: 'Enfermagem', avatar: 'CD', online: true },
    { id: 'U005', nome: 'Enf. Roberto Alves', cargo: 'Enfermeiro', departamento: 'Enfermagem', avatar: 'RA', online: true },
    { id: 'U006', nome: 'Téc. Luciana Moraes', cargo: 'Técnica de Enfermagem', departamento: 'Enfermagem', avatar: 'LM', online: false },
    { id: 'U007', nome: 'Farm. Juliana Rocha', cargo: 'Farmacêutica', departamento: 'Farmácia', avatar: 'JR', online: true },
    { id: 'U008', nome: 'Farm. Ricardo Mendes', cargo: 'Farmacêutico', departamento: 'Farmácia', avatar: 'RM', online: false },
    { id: 'U009', nome: 'Sandra Oliveira', cargo: 'Recepcionista', departamento: 'Recepção', avatar: 'SO', online: true },
    { id: 'U010', nome: 'Marcos Pereira', cargo: 'Recepcionista', departamento: 'Recepção', avatar: 'MP', online: true },
    { id: 'U011', nome: 'Adriana Costa', cargo: 'Coordenadora', departamento: 'Administração', avatar: 'AC', online: true },
    { id: 'U012', nome: 'Fernando Souza', cargo: 'Diretor Administrativo', departamento: 'Administração', avatar: 'FS', online: false },
];

const channelsData = [
    { id: 'CH001', nome: 'Geral', descricao: 'Canal geral para comunicação entre todos os profissionais da unidade.', departamento: null, naoLidas: 3 },
    { id: 'CH002', nome: 'Recepção', descricao: 'Canal exclusivo para a equipe de recepção. Avisos sobre agendamentos e demandas.', departamento: 'Recepção', naoLidas: 0 },
    { id: 'CH003', nome: 'Enfermagem', descricao: 'Canal da equipe de enfermagem. Protocolos, escalas e atualizações de pacientes.', departamento: 'Enfermagem', naoLidas: 5 },
    { id: 'CH004', nome: 'Médicos', descricao: 'Canal do corpo médico. Discussão de casos, interconsultas e atualizações clínicas.', departamento: 'Médicos', naoLidas: 1 },
    { id: 'CH005', nome: 'Farmácia', descricao: 'Canal da farmácia. Alertas de estoque, lotes vencendo e solicitações especiais.', departamento: 'Farmácia', naoLidas: 2 },
    { id: 'CH006', nome: 'Administração', descricao: 'Canal da administração. Comunicados institucionais, RH e planejamento.', departamento: 'Administração', naoLidas: 0 },
];

const initialChannelMessages = {
    CH001: [
        { id: 'M01', fromId: 'U011', from: 'Adriana Costa', avatar: 'AC', text: 'Bom dia a todos! Lembrete: reunião de equipe amanhã às 14h na sala de conferências.', timestamp: '2026-03-14T07:30:00' },
        { id: 'M02', fromId: 'U001', from: 'Dr. Carlos Oliveira', avatar: 'CO', text: 'Bom dia! Confirmado. Vou preparar a pauta sobre os novos protocolos.', timestamp: '2026-03-14T07:35:00' },
        { id: 'M03', fromId: 'U004', from: 'Enf. Carla Dias', avatar: 'CD', text: 'Bom dia! Posso incluir na pauta a atualização do protocolo de administração de insulina?', timestamp: '2026-03-14T07:40:00' },
        { id: 'M04', fromId: 'U011', from: 'Adriana Costa', avatar: 'AC', text: 'Claro, Carla! Já adicionei. Alguém mais tem pautas?', timestamp: '2026-03-14T07:45:00' },
        { id: 'M05', fromId: 'U007', from: 'Farm. Juliana Rocha', avatar: 'JR', text: 'Gostaria de apresentar o relatório de medicamentos próximos ao vencimento. Temos 8 lotes que vencem nos próximos 30 dias.', timestamp: '2026-03-14T08:00:00' },
        { id: 'M06', fromId: 'U009', from: 'Sandra Oliveira', avatar: 'SO', text: 'Informo que a agenda de hoje está cheia. 42 pacientes agendados. Reforço para os médicos manterem o horário.', timestamp: '2026-03-14T08:15:00' },
        { id: 'M07', fromId: 'U012', from: 'Fernando Souza', avatar: 'FS', text: 'Atenção: manutenção do sistema será realizada no domingo das 2h às 6h. Não haverá indisponibilidade em horário comercial.', timestamp: '2026-03-14T08:30:00' },
    ],
    CH002: [
        { id: 'M08', fromId: 'U009', from: 'Sandra Oliveira', avatar: 'SO', text: 'Marcos, o paciente das 10h ligou pedindo para remarcar. Pode verificar horário disponível?', timestamp: '2026-03-14T08:45:00' },
        { id: 'M09', fromId: 'U010', from: 'Marcos Pereira', avatar: 'MP', text: 'Verificando... Tem vaga dia 18 às 14h ou dia 19 às 9h.', timestamp: '2026-03-14T08:50:00' },
        { id: 'M10', fromId: 'U009', from: 'Sandra Oliveira', avatar: 'SO', text: 'Perfeito, vou ligar de volta e oferecer as opções. Obrigada!', timestamp: '2026-03-14T08:55:00' },
        { id: 'M11', fromId: 'U010', from: 'Marcos Pereira', avatar: 'MP', text: 'Aviso: paciente José Carlos Oliveira teve alta médica. Preparar documentação de saída.', timestamp: '2026-03-14T09:30:00' },
    ],
    CH003: [
        { id: 'M12', fromId: 'U004', from: 'Enf. Carla Dias', avatar: 'CD', text: 'Equipe, a paciente Maria Silva (Leito 12) teve pico de PA às 6h: 180x110. Medicação SOS administrada.', timestamp: '2026-03-14T06:30:00' },
        { id: 'M13', fromId: 'U005', from: 'Enf. Roberto Alves', avatar: 'RA', text: 'Entendido. Vou fazer a checagem das 8h e monitorar. Alguma orientação médica adicional?', timestamp: '2026-03-14T06:35:00' },
        { id: 'M14', fromId: 'U001', from: 'Dr. Carlos Oliveira', avatar: 'CO', text: 'Obrigado pelo aviso, Carla. Se PA não baixar para < 150x90 em 2h, me avisem para ajustar prescrição.', timestamp: '2026-03-14T06:45:00' },
        { id: 'M15', fromId: 'U006', from: 'Téc. Luciana Moraes', avatar: 'LM', text: 'Plantão noturno tranquilo. Todas as medicações das 0h e 6h administradas conforme aprazamento.', timestamp: '2026-03-14T07:00:00' },
        { id: 'M16', fromId: 'U004', from: 'Enf. Carla Dias', avatar: 'CD', text: 'Atualização: PA da paciente Maria Silva às 8h: 145x88. Melhorando.', timestamp: '2026-03-14T08:10:00' },
        { id: 'M17', fromId: 'U005', from: 'Enf. Roberto Alves', avatar: 'RA', text: 'Paciente José Carlos (Leito 04) completou ciclo de Ceftriaxona. Avisar Dra. Ana para reavaliação.', timestamp: '2026-03-14T09:00:00' },
        { id: 'M18', fromId: 'U004', from: 'Enf. Carla Dias', avatar: 'CD', text: 'Lembrem-se: inventário de material descartável hoje à tarde. Precisamos contar tudo até 17h.', timestamp: '2026-03-14T09:15:00' },
        { id: 'M19', fromId: 'U002', from: 'Dra. Ana Santos', avatar: 'AS', text: 'Roberto, obrigada. Vou passar no leito até 10h para reavaliar o José Carlos.', timestamp: '2026-03-14T09:20:00' },
        { id: 'M20', fromId: 'U006', from: 'Téc. Luciana Moraes', avatar: 'LM', text: 'Preciso de ajuda no banho do Sr. Pedro (Leito 08). Ele está com dificuldade de mobilidade hoje.', timestamp: '2026-03-14T09:30:00' },
    ],
    CH004: [
        { id: 'M21', fromId: 'U001', from: 'Dr. Carlos Oliveira', avatar: 'CO', text: 'Colegas, resultado da biópsia do paciente PRONT-2025-0045 saiu. Sugiro discussão do caso.', timestamp: '2026-03-14T08:00:00' },
        { id: 'M22', fromId: 'U002', from: 'Dra. Ana Santos', avatar: 'AS', text: 'Posso ver às 11h. Pode compartilhar o laudo no prontuário?', timestamp: '2026-03-14T08:20:00' },
        { id: 'M23', fromId: 'U003', from: 'Dr. Paulo Lima', avatar: 'PL', text: 'Estou no consultório externo hoje, mas posso participar por videochamada se for urgente.', timestamp: '2026-03-14T08:45:00' },
    ],
    CH005: [
        { id: 'M24', fromId: 'U007', from: 'Farm. Juliana Rocha', avatar: 'JR', text: 'ALERTA: Lote de Captopril 25mg (CAP-2024-C01) vence em 6 dias. Restam 60 unidades. Priorizar dispensação deste lote.', timestamp: '2026-03-14T07:15:00' },
        { id: 'M25', fromId: 'U008', from: 'Farm. Ricardo Mendes', avatar: 'RM', text: 'Entendido. Vou separar e etiquetar como prioridade. Já temos o lote novo (CAP-2025-A01) disponível.', timestamp: '2026-03-14T07:25:00' },
        { id: 'M26', fromId: 'U007', from: 'Farm. Juliana Rocha', avatar: 'JR', text: 'Prescrição do Dr. Carlos para Maria Silva já foi recebida. Iniciando separação.', timestamp: '2026-03-14T08:35:00' },
        { id: 'M27', fromId: 'U004', from: 'Enf. Carla Dias', avatar: 'CD', text: 'Farmácia, precisamos de mais Dipirona EV no carrinho de emergência da Enf. A. Acabou no plantão noturno.', timestamp: '2026-03-14T09:00:00' },
        { id: 'M28', fromId: 'U007', from: 'Farm. Juliana Rocha', avatar: 'JR', text: 'Carla, já separei 20 ampolas. Ricardo vai levar em 15 minutos.', timestamp: '2026-03-14T09:10:00' },
    ],
    CH006: [
        { id: 'M29', fromId: 'U012', from: 'Fernando Souza', avatar: 'FS', text: 'Relatório mensal de indicadores disponível na pasta compartilhada. Destaque: taxa de ocupação em 87%.', timestamp: '2026-03-14T08:00:00' },
        { id: 'M30', fromId: 'U011', from: 'Adriana Costa', avatar: 'AC', text: 'Obrigada, Fernando. Vou incluir na apresentação da reunião mensal.', timestamp: '2026-03-14T08:15:00' },
    ],
};

const initialDirectMessages = {
    U004: [
        { id: 'DM01', fromId: 'U004', text: 'Dr. Carlos, a paciente Maria Silva está queixando-se de cefaleia intensa há 2 horas.', timestamp: '2026-03-14T09:00:00' },
        { id: 'DM02', fromId: 'U001', text: 'Obrigado, Carla. Pode administrar Dipirona 500mg VO agora e eu passo no leito em 30min.', timestamp: '2026-03-14T09:05:00' },
        { id: 'DM03', fromId: 'U004', text: 'Medicação administrada às 09:08. Vou monitorar.', timestamp: '2026-03-14T09:10:00' },
        { id: 'DM04', fromId: 'U001', text: 'Perfeito. Se não melhorar em 1h, solicitar TC de crânio.', timestamp: '2026-03-14T09:12:00' },
    ],
    U007: [
        { id: 'DM05', fromId: 'U007', text: 'Dr. Carlos, sobre a prescrição da Maria Silva: a Insulina NPH está com estoque baixo. Temos apenas 2 frascos do lote que vence em abril.', timestamp: '2026-03-14T08:40:00' },
        { id: 'DM06', fromId: 'U001', text: 'Juliana, pode dispensar do lote que vence antes. Já solicitei nova compra via sistema.', timestamp: '2026-03-14T08:45:00' },
        { id: 'DM07', fromId: 'U007', text: 'Perfeito, vou dispensar do LOT INS-2025-A01. Previsão de entrega do novo lote?', timestamp: '2026-03-14T08:48:00' },
        { id: 'DM08', fromId: 'U001', text: 'Administração disse que chega na segunda-feira. Obrigado pela atenção.', timestamp: '2026-03-14T08:50:00' },
    ],
    U002: [
        { id: 'DM09', fromId: 'U002', text: 'Carlos, você viu o eco do paciente do leito 04? Achei a FE baixa para a idade dele.', timestamp: '2026-03-14T07:50:00' },
        { id: 'DM10', fromId: 'U001', text: 'Vi sim. FE de 42%. Vamos discutir o caso com o Paulo na interconsulta.', timestamp: '2026-03-14T07:55:00' },
        { id: 'DM11', fromId: 'U002', text: 'Concordo. Pode ser cardiomiopatia dilatada. Pedi BNP e troponina.', timestamp: '2026-03-14T08:00:00' },
        { id: 'DM12', fromId: 'U001', text: 'Boa conduta. Resultado deve sair até amanhã.', timestamp: '2026-03-14T08:05:00' },
    ],
    U011: [
        { id: 'DM13', fromId: 'U011', text: 'Dr. Carlos, precisamos da sua assinatura no relatório anual de qualidade. Pode passar na administração hoje?', timestamp: '2026-03-14T08:20:00' },
        { id: 'DM14', fromId: 'U001', text: 'Posso passar às 16h, após as consultas. Pode ser?', timestamp: '2026-03-14T08:25:00' },
        { id: 'DM15', fromId: 'U011', text: 'Perfeito! Estarei aguardando. Obrigada!', timestamp: '2026-03-14T08:28:00' },
    ],
    U005: [
        { id: 'DM16', fromId: 'U005', text: 'Dr. Carlos, paciente José Carlos relata melhora significativa. Febre cedeu, último registro 36.4°C.', timestamp: '2026-03-14T10:00:00' },
        { id: 'DM17', fromId: 'U005', text: 'Exames laboratoriais de hoje já foram colhidos. PCR e hemograma.', timestamp: '2026-03-14T10:05:00' },
    ],
    U009: [
        { id: 'DM18', fromId: 'U009', text: 'Dr. Carlos, a esposa do Sr. Pedro Lima está na recepção querendo falar sobre a alta dele. Pode atendê-la?', timestamp: '2026-03-14T10:30:00' },
    ],
};

const dmUnreadCounts = { U004: 0, U007: 0, U002: 0, U011: 0, U005: 2, U009: 1 };

// ─── Helpers ───────────────────────────────────────────────────────

function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatTimestamp(dateStr) {
    const d = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return formatTime(dateStr);
    if (diffDays === 1) return 'Ontem';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// ─── Component ─────────────────────────────────────────────────────

export default function ChatInterno() {
    const [channels] = useState(channelsData);
    const [channelMessages, setChannelMessages] = useState(initialChannelMessages);
    const [directMessages, setDirectMessages] = useState(initialDirectMessages);

    // View state: 'channel' or 'dm'
    const [viewMode, setViewMode] = useState('channel');
    const [selectedChannelId, setSelectedChannelId] = useState('CH001');
    const [selectedDmUserId, setSelectedDmUserId] = useState(null);

    const [novaMensagem, setNovaMensagem] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [showChannels, setShowChannels] = useState(true);
    const [showDMs, setShowDMs] = useState(true);
    const [showRightPanel, setShowRightPanel] = useState(false);

    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedChannelId, selectedDmUserId, channelMessages, directMessages]);

    // Current messages
    const currentMessages = viewMode === 'channel'
        ? (channelMessages[selectedChannelId] || [])
        : (directMessages[selectedDmUserId] || []);

    // Current header info
    const selectedChannel = channels.find(c => c.id === selectedChannelId);
    const selectedDmUser = usersData.find(u => u.id === selectedDmUserId);

    // Direct message contacts (users who have DM history)
    const dmContacts = Object.keys(initialDirectMessages).map(userId => {
        const user = usersData.find(u => u.id === userId);
        const msgs = directMessages[userId] || [];
        const lastMsg = msgs[msgs.length - 1];
        return {
            ...user,
            ultimaMensagem: lastMsg?.text || '',
            ultimaAtividade: lastMsg?.timestamp || '',
            naoLidas: dmUnreadCounts[userId] || 0,
        };
    });

    // Filtered contacts for search
    const filteredDmContacts = dmContacts.filter(c =>
        c.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );

    function handleSelectChannel(channelId) {
        setViewMode('channel');
        setSelectedChannelId(channelId);
        setSelectedDmUserId(null);
    }

    function handleSelectDm(userId) {
        setViewMode('dm');
        setSelectedDmUserId(userId);
        setSelectedChannelId(null);
    }

    function handleSend() {
        if (!novaMensagem.trim()) return;

        const ts = new Date().toISOString();

        if (viewMode === 'channel' && selectedChannelId) {
            const msg = {
                id: `M${Date.now()}`,
                fromId: currentUser.id,
                from: currentUser.nome,
                avatar: currentUser.avatar,
                text: novaMensagem,
                timestamp: ts,
            };
            setChannelMessages(prev => ({
                ...prev,
                [selectedChannelId]: [...(prev[selectedChannelId] || []), msg],
            }));
        } else if (viewMode === 'dm' && selectedDmUserId) {
            const msg = {
                id: `DM${Date.now()}`,
                fromId: currentUser.id,
                text: novaMensagem,
                timestamp: ts,
            };
            setDirectMessages(prev => ({
                ...prev,
                [selectedDmUserId]: [...(prev[selectedDmUserId] || []), msg],
            }));
        }

        setNovaMensagem('');
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    // Channel members for right panel
    const channelMembers = selectedChannel
        ? usersData.filter(u => true) // all users can see all channels for demo
        : [];

    return (
        <div className="h-[calc(100vh-120px)] space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Chat Interno
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span>Canal seguro e em conformidade com a LGPD</span>
                </div>
            </div>

            {/* Main Container */}
            <div className="flex h-[calc(100%-60px)] overflow-hidden rounded-xl border border-border bg-card shadow-sm">

                {/* ── Left Sidebar: Channels & DMs ── */}
                <div className="flex w-[280px] shrink-0 flex-col border-r border-border bg-muted/20">
                    {/* Search */}
                    <div className="border-b border-border p-3">
                        <div className="relative">
                            <input
                                type="text"
                                className="h-9 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Buscar..."
                                value={pesquisa}
                                onChange={e => setPesquisa(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {/* Channels Section */}
                        <div>
                            <button
                                className="flex w-full items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                                onClick={() => setShowChannels(!showChannels)}
                            >
                                {showChannels ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                Canais
                            </button>
                            {showChannels && channels.map(ch => (
                                <button
                                    key={ch.id}
                                    onClick={() => handleSelectChannel(ch.id)}
                                    className={cn(
                                        'flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-muted/60',
                                        viewMode === 'channel' && selectedChannelId === ch.id
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-foreground'
                                    )}
                                >
                                    <span className="flex items-center gap-2 truncate">
                                        <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        <span className="truncate">{ch.nome}</span>
                                    </span>
                                    {ch.naoLidas > 0 && (
                                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-white">
                                            {ch.naoLidas}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Direct Messages Section */}
                        <div className="mt-2">
                            <button
                                className="flex w-full items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                                onClick={() => setShowDMs(!showDMs)}
                            >
                                {showDMs ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                Mensagens Diretas
                            </button>
                            {showDMs && filteredDmContacts.map(contact => (
                                <button
                                    key={contact.id}
                                    onClick={() => handleSelectDm(contact.id)}
                                    className={cn(
                                        'flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-muted/60',
                                        viewMode === 'dm' && selectedDmUserId === contact.id
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-foreground'
                                    )}
                                >
                                    <span className="flex items-center gap-2 truncate">
                                        <span className="relative">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                                                {contact.avatar}
                                            </span>
                                            {contact.online && (
                                                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                                            )}
                                        </span>
                                        <span className="truncate">{contact.nome}</span>
                                    </span>
                                    {contact.naoLidas > 0 && (
                                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-white">
                                            {contact.naoLidas}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Current user footer */}
                    <div className="flex items-center gap-2 border-t border-border p-3">
                        <span className="relative">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                                {currentUser.avatar}
                            </span>
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{currentUser.nome}</p>
                            <p className="truncate text-xs text-muted-foreground">{currentUser.cargo}</p>
                        </div>
                    </div>
                </div>

                {/* ── Center: Messages Area ── */}
                <div className="flex flex-1 flex-col">
                    {(selectedChannelId || selectedDmUserId) ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                                <div className="flex items-center gap-3">
                                    {viewMode === 'channel' ? (
                                        <>
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                                <Hash className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-foreground">{selectedChannel?.nome}</h3>
                                                <p className="text-xs text-muted-foreground">{selectedChannel?.descricao?.substring(0, 80)}...</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="relative">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-semibold text-white text-xs">
                                                    {selectedDmUser?.avatar}
                                                </div>
                                                {selectedDmUser?.online && (
                                                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-foreground">{selectedDmUser?.nome}</h3>
                                                <p className={cn('text-xs', selectedDmUser?.online ? 'text-emerald-500' : 'text-muted-foreground')}>
                                                    {selectedDmUser?.online ? 'Online' : 'Offline'} - {selectedDmUser?.cargo}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    {viewMode === 'channel' && (
                                        <button
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                            onClick={() => setShowRightPanel(!showRightPanel)}
                                            title="Membros do canal"
                                        >
                                            <Users className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                        onClick={() => setShowRightPanel(!showRightPanel)}
                                        title="Informações"
                                    >
                                        <Info className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* LGPD Banner */}
                            <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50/60 px-4 py-1.5 text-xs text-emerald-700">
                                <Shield className="h-3.5 w-3.5" />
                                Canal seguro e em conformidade com a LGPD - Não compartilhe dados sensíveis desnecessários.
                            </div>

                            {/* Messages */}
                            <div className="flex flex-1 flex-col gap-3 overflow-auto bg-muted/10 px-4 py-4">
                                {currentMessages.map(msg => {
                                    const isMine = msg.fromId === currentUser.id;
                                    const senderUser = usersData.find(u => u.id === msg.fromId);

                                    return (
                                        <div
                                            key={msg.id}
                                            className={cn('flex gap-2', isMine ? 'justify-end' : 'justify-start')}
                                        >
                                            {/* Avatar (left side only) */}
                                            {!isMine && (
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                                                    {msg.avatar || senderUser?.avatar || '??'}
                                                </div>
                                            )}

                                            <div className={cn('max-w-[65%]', isMine ? 'items-end' : 'items-start')}>
                                                {/* Sender name (channels only, not own messages) */}
                                                {viewMode === 'channel' && !isMine && (
                                                    <p className="mb-0.5 text-xs font-semibold text-foreground">{msg.from || senderUser?.nome}</p>
                                                )}
                                                <div
                                                    className={cn(
                                                        'px-3.5 py-2.5 shadow-sm',
                                                        isMine
                                                            ? 'rounded-2xl rounded-br-sm bg-primary text-white'
                                                            : 'rounded-2xl rounded-bl-sm bg-white text-foreground border border-border/50'
                                                    )}
                                                >
                                                    <p className="m-0 text-sm leading-relaxed">{msg.text}</p>
                                                </div>
                                                <p className={cn('mt-0.5 text-[0.65rem] text-muted-foreground', isMine && 'text-right')}>
                                                    {formatTime(msg.timestamp)}
                                                    {isMine && <CheckCheck className="ml-1 inline h-3 w-3 text-primary/60" />}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="flex items-end gap-2 border-t border-border bg-white p-3">
                                <textarea
                                    className="w-full resize-none rounded-lg border border-input bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Digite sua mensagem..."
                                    value={novaMensagem}
                                    onChange={e => setNovaMensagem(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    rows="1"
                                />
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
                                    onClick={handleSend}
                                    disabled={!novaMensagem.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <MessageSquare className="mx-auto mb-4 h-16 w-16 opacity-30" />
                                <p className="text-lg font-medium">Selecione um canal ou conversa</p>
                                <p className="text-sm">Escolha um canal ou contato na barra lateral para iniciar.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right Sidebar (toggle) ── */}
                {showRightPanel && (
                    <div className="flex w-[260px] shrink-0 flex-col border-l border-border bg-muted/10">
                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                            <h4 className="text-sm font-semibold text-foreground">
                                {viewMode === 'channel' ? 'Detalhes do Canal' : 'Informações'}
                            </h4>
                            <button
                                className="rounded p-1 text-muted-foreground hover:bg-muted"
                                onClick={() => setShowRightPanel(false)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {viewMode === 'channel' && selectedChannel ? (
                            <div className="flex-1 overflow-auto p-4">
                                <div className="mb-4">
                                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <Hash className="h-6 w-6 text-primary" />
                                    </div>
                                    <h5 className="font-semibold text-foreground">{selectedChannel.nome}</h5>
                                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{selectedChannel.descricao}</p>
                                </div>

                                <div className="border-t border-border pt-3">
                                    <h6 className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <Users className="h-3.5 w-3.5" /> Membros ({channelMembers.length})
                                    </h6>
                                    <div className="space-y-1.5">
                                        {channelMembers.map(member => (
                                            <div key={member.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/50">
                                                <span className="relative">
                                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                                                        {member.avatar}
                                                    </span>
                                                    {member.online && (
                                                        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white bg-emerald-500" />
                                                    )}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-xs font-medium text-foreground">{member.nome}</p>
                                                    <p className="truncate text-[0.65rem] text-muted-foreground">{member.cargo}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : viewMode === 'dm' && selectedDmUser ? (
                            <div className="flex-1 overflow-auto p-4">
                                <div className="mb-4 text-center">
                                    <div className="relative mx-auto mb-2 inline-block">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                                            {selectedDmUser.avatar}
                                        </div>
                                        {selectedDmUser.online && (
                                            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                                        )}
                                    </div>
                                    <h5 className="font-semibold text-foreground">{selectedDmUser.nome}</h5>
                                    <p className="text-xs text-muted-foreground">{selectedDmUser.cargo}</p>
                                    <p className="text-xs text-muted-foreground">{selectedDmUser.departamento}</p>
                                    <span className={cn(
                                        'mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                                        selectedDmUser.online ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                    )}>
                                        {selectedDmUser.online ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}
