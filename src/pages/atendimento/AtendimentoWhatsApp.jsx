import { useState } from 'react';
import {
    MessageSquare,
    CheckCircle,
    Clock,
    TrendingUp,
    Headset,
    Bell,
    BellOff,
    History,
    User,
    Search,
    ArrowRight,
    ArrowLeft,
    CalendarPlus,
    Stethoscope,
    FlaskConical,
    UserCheck,
    Check,
    Calendar,
    RefreshCw,
    Eye,
    Plus,
    Info,
    ScanLine,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample professionals
const profissionais = [
    { id: 1, nome: 'Dr. Carlos Oliveira', especialidade: 'Clinico Geral', unidade: 'UBS Centro' },
    { id: 2, nome: 'Dra. Ana Santos', especialidade: 'Medico de Familia', unidade: 'UBS Norte' },
    { id: 3, nome: 'Dr. Paulo Lima', especialidade: 'Dentista', unidade: 'UBS Centro' },
    { id: 4, nome: 'Dra. Mariana Costa', especialidade: 'Ginecologista', unidade: 'UBS Sul' },
    { id: 5, nome: 'Enf. Maria Lima', especialidade: 'Enfermagem', unidade: 'UBS Centro' }
];

// Sample exam types
const tiposExame = [
    { id: 1, nome: 'Hemograma Completo', categoria: 'Laboratorial' },
    { id: 2, nome: 'Glicemia de Jejum', categoria: 'Laboratorial' },
    { id: 3, nome: 'Raio-X Torax', categoria: 'Imagem' },
    { id: 4, nome: 'Ultrassom Abdominal', categoria: 'Imagem' },
    { id: 5, nome: 'Eletrocardiograma', categoria: 'Cardiologico' }
];

// Sample reminders
const lembretesData = [
    { id: 1, paciente: 'Maria Silva', telefone: '(11) 99999-1234', tipo: 'consulta', descricao: 'Clinico Geral - Dr. Carlos', data: '2025-01-28', hora: '09:00', status: 'enviado', lembreteEnviado: '2025-01-27T09:00:00', confirmado: false },
    { id: 2, paciente: 'Joao Santos', telefone: '(11) 98888-5678', tipo: 'exame', descricao: 'Hemograma Completo', data: '2025-01-29', hora: '07:30', status: 'confirmado', lembreteEnviado: '2025-01-28T07:30:00', confirmado: true },
    { id: 3, paciente: 'Ana Costa', telefone: '(11) 97777-9012', tipo: 'consulta', descricao: 'Ginecologista - Dra. Mariana', data: '2025-01-28', hora: '14:00', status: 'pendente', lembreteEnviado: null, confirmado: false }
];

// Sample history
const historicoData = [
    { id: 1, paciente: 'Pedro Lima', telefone: '(11) 96666-3456', tipo: 'consulta', descricao: 'Dentista - Dr. Paulo', data: '2025-01-25', hora: '10:00', status: 'realizado', mensagensEnviadas: 3 },
    { id: 2, paciente: 'Carla Souza', telefone: '(11) 95555-7890', tipo: 'exame', descricao: 'Ultrassom', data: '2025-01-24', hora: '08:00', status: 'faltou', mensagensEnviadas: 4 },
    { id: 3, paciente: 'Roberto Alves', telefone: '(11) 94444-2345', tipo: 'consulta', descricao: 'Clinico Geral', data: '2025-01-23', hora: '11:00', status: 'cancelado', mensagensEnviadas: 2 }
];

// Time slots
const horariosDisponiveis = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
];

const statusClasses = {
    pendente: 'bg-amber-400 text-black',
    enviado: 'bg-cyan-600 text-white',
    confirmado: 'bg-green-600 text-white',
    realizado: 'bg-green-600 text-white',
    faltou: 'bg-red-600 text-white',
    cancelado: 'bg-gray-500 text-white',
};

export default function AtendimentoWhatsApp() {
    const [abaAtiva, setAbaAtiva] = useState('atendimento');
    const [etapa, setEtapa] = useState(1);
    const [tipoAgendamento, setTipoAgendamento] = useState('consulta');
    const [lembretes, setLembretes] = useState(lembretesData);
    const [showMensagem, setShowMensagem] = useState(null);
    const [formData, setFormData] = useState({
        pacienteCpf: '',
        pacienteNome: '',
        telefone: '',
        profissional: '',
        tipoExame: '',
        data: '',
        hora: '',
        lembrete24h: true,
        lembrete2h: true,
        observacoes: ''
    });
    const [pacienteBuscado, setPacienteBuscado] = useState(null);
    const [agendamentoCriado, setAgendamentoCriado] = useState(null);

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const buscarPaciente = () => {
        if (formData.pacienteCpf.length >= 11) {
            setPacienteBuscado({
                nome: 'Maria da Silva Santos',
                cpf: formData.pacienteCpf,
                cns: '1234567890123456',
                nascimento: '1985-03-15',
                telefone: '(11) 98765-4321'
            });
            setFormData({
                ...formData,
                pacienteNome: 'Maria da Silva Santos',
                telefone: '(11) 98765-4321'
            });
        }
    };

    const proximaEtapa = () => {
        if (etapa < 5) setEtapa(etapa + 1);
    };

    const etapaAnterior = () => {
        if (etapa > 1) setEtapa(etapa - 1);
    };

    const finalizarAgendamento = () => {
        const novoAgendamento = {
            id: Date.now(),
            paciente: pacienteBuscado?.nome || formData.pacienteNome,
            telefone: formData.telefone,
            tipo: tipoAgendamento,
            descricao: tipoAgendamento === 'consulta'
                ? profissionais.find(p => p.id === parseInt(formData.profissional))?.nome
                : tiposExame.find(e => e.id === parseInt(formData.tipoExame))?.nome,
            data: formData.data,
            hora: formData.hora
        };
        setAgendamentoCriado(novoAgendamento);

        // Add to reminders
        setLembretes([...lembretes, {
            ...novoAgendamento,
            status: 'enviado',
            lembreteEnviado: new Date().toISOString(),
            confirmado: false
        }]);

        setEtapa(5);
    };

    const novoAtendimento = () => {
        setFormData({
            pacienteCpf: '',
            pacienteNome: '',
            telefone: '',
            profissional: '',
            tipoExame: '',
            data: '',
            hora: '',
            lembrete24h: true,
            lembrete2h: true,
            observacoes: ''
        });
        setPacienteBuscado(null);
        setAgendamentoCriado(null);
        setEtapa(1);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR');
    };

    const enviarWhatsApp = (telefone, mensagem) => {
        const numeroLimpo = telefone.replace(/\D/g, '');
        const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    };

    const getStatusBadge = (status) => {
        const classes = statusClasses[status] || statusClasses.pendente;
        return (
            <span className={cn('inline-block rounded-xl px-3 py-1 text-xs font-semibold uppercase', classes)}>
                {status}
            </span>
        );
    };

    const reenviarLembrete = (lembrete) => {
        const mensagem = `🏥 *SmartHealth - Lembrete de ${lembrete.tipo === 'consulta' ? 'Consulta' : 'Exame'}*\n\nOla ${lembrete.paciente}!\n\nLembramos que voce tem ${lembrete.tipo === 'consulta' ? 'uma consulta' : 'um exame'} agendado:\n\n📋 ${lembrete.descricao}\n📅 ${formatDate(lembrete.data)}\n⏰ ${lembrete.hora}\n\nPor favor, confirme sua presenca respondendo:\n✅ *SIM* para confirmar\n❌ *NAO* para cancelar`;
        enviarWhatsApp(lembrete.telefone, mensagem);
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="m-0 flex items-center gap-2">
                        <MessageSquare className="size-7 text-emerald-500" />
                        Atendimento WhatsApp
                    </h1>
                    <p className="mt-1 text-muted-foreground">Agendamento e lembretes via WhatsApp</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm">
                        <div className="size-2.5 rounded-full bg-emerald-500" />
                        <span className="text-sm">WhatsApp Conectado</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 text-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="m-0 text-sm opacity-90">Mensagens Hoje</p>
                            <h3 className="mt-1 text-3xl font-bold">127</h3>
                        </div>
                        <MessageSquare className="size-10 opacity-80" />
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="m-0 text-sm text-muted-foreground">Confirmados</p>
                            <h3 className="mt-1 text-3xl font-bold text-green-600">42</h3>
                        </div>
                        <CheckCircle className="size-8 text-green-600" />
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="m-0 text-sm text-muted-foreground">Pendentes</p>
                            <h3 className="mt-1 text-3xl font-bold text-amber-500">18</h3>
                        </div>
                        <Clock className="size-8 text-amber-500" />
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="m-0 text-sm text-muted-foreground">Taxa Confirmacao</p>
                            <h3 className="mt-1 text-3xl font-bold text-primary">87%</h3>
                        </div>
                        <TrendingUp className="size-8 text-primary" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 rounded-xl border border-border bg-card p-2 shadow-sm">
                <div className="flex gap-2">
                    <button
                        className={cn(
                            'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            abaAtiva === 'atendimento'
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border bg-transparent text-foreground hover:bg-muted'
                        )}
                        onClick={() => setAbaAtiva('atendimento')}
                    >
                        <Headset className="size-4" /> Novo Atendimento
                    </button>
                    <button
                        className={cn(
                            'relative inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            abaAtiva === 'lembretes'
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border bg-transparent text-foreground hover:bg-muted'
                        )}
                        onClick={() => setAbaAtiva('lembretes')}
                    >
                        <Bell className="size-4" /> Lembretes
                        {lembretes.filter(l => l.status === 'pendente').length > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                                {lembretes.filter(l => l.status === 'pendente').length}
                            </span>
                        )}
                    </button>
                    <button
                        className={cn(
                            'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            abaAtiva === 'historico'
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border bg-transparent text-foreground hover:bg-muted'
                        )}
                        onClick={() => setAbaAtiva('historico')}
                    >
                        <History className="size-4" /> Historico
                    </button>
                </div>
            </div>

            {/* Tab: Atendimento */}
            {abaAtiva === 'atendimento' && (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-3">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                            <MessageSquare className="size-4 text-emerald-500" /> Novo Atendimento via WhatsApp
                        </span>
                        {/* Progress Steps */}
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(step => (
                                <div key={step} className="flex items-center">
                                    <div
                                        className={cn(
                                            'flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-all',
                                            etapa >= step
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-gray-200 text-muted-foreground'
                                        )}
                                    >
                                        {etapa > step ? <Check className="size-4" /> : step}
                                    </div>
                                    {step < 5 && (
                                        <div
                                            className={cn(
                                                'h-0.5 w-5 transition-all',
                                                etapa > step ? 'bg-emerald-500' : 'bg-gray-200'
                                            )}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-5">
                        {/* Etapa 1: Identificacao */}
                        {etapa === 1 && (
                            <div>
                                <h5 className="flex items-center gap-2">
                                    <User className="size-5 text-emerald-500" />
                                    1. Identificacao do Paciente
                                </h5>
                                <div className="mb-4 grid grid-cols-[1fr_auto] gap-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">CPF do Paciente *</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="000.000.000-00"
                                            value={formData.pacienteCpf}
                                            onChange={(e) => handleInputChange('pacienteCpf', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark"
                                            onClick={buscarPaciente}
                                        >
                                            <Search className="size-4" /> Buscar
                                        </button>
                                    </div>
                                </div>

                                {pacienteBuscado && (
                                    <div className="rounded-lg border border-green-300 bg-green-50 p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white">
                                                <UserCheck className="size-6" />
                                            </div>
                                            <div className="flex-1">
                                                <strong>{pacienteBuscado.nome}</strong>
                                                <div className="text-sm">
                                                    <span>CNS: {pacienteBuscado.cns}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {pacienteBuscado && (
                                    <div className="mt-4">
                                        <label className="mb-1 flex items-center gap-2 text-sm font-medium">
                                            <MessageSquare className="size-4 text-emerald-500" /> Numero WhatsApp *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="(00) 00000-0000"
                                            value={formData.telefone}
                                            onChange={(e) => handleInputChange('telefone', e.target.value)}
                                        />
                                        <small className="text-muted-foreground">Confirme o numero do WhatsApp do paciente</small>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end">
                                    <button
                                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark disabled:opacity-50"
                                        onClick={proximaEtapa}
                                        disabled={!pacienteBuscado || !formData.telefone}
                                    >
                                        Proximo <ArrowRight className="size-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Etapa 2: Tipo de Agendamento */}
                        {etapa === 2 && (
                            <div>
                                <h5 className="flex items-center gap-2">
                                    <CalendarPlus className="size-5 text-emerald-500" />
                                    2. Tipo de Agendamento
                                </h5>
                                <div className="flex gap-4">
                                    <button
                                        className={cn(
                                            'flex flex-1 flex-col items-center gap-2 rounded-lg border-2 px-6 py-8 text-center transition-colors',
                                            tipoAgendamento === 'consulta'
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-border bg-transparent text-foreground hover:bg-muted'
                                        )}
                                        onClick={() => setTipoAgendamento('consulta')}
                                    >
                                        <Stethoscope className="size-8" />
                                        <strong>Consulta</strong>
                                        <small className="opacity-80">Atendimento medico</small>
                                    </button>
                                    <button
                                        className={cn(
                                            'flex flex-1 flex-col items-center gap-2 rounded-lg border-2 px-6 py-8 text-center transition-colors',
                                            tipoAgendamento === 'exame'
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-border bg-transparent text-foreground hover:bg-muted'
                                        )}
                                        onClick={() => setTipoAgendamento('exame')}
                                    >
                                        <FlaskConical className="size-8" />
                                        <strong>Exame</strong>
                                        <small className="opacity-80">Exames laboratoriais/imagem</small>
                                    </button>
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <button
                                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                                        onClick={etapaAnterior}
                                    >
                                        <ArrowLeft className="size-4" /> Voltar
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark"
                                        onClick={proximaEtapa}
                                    >
                                        Proximo <ArrowRight className="size-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Etapa 3: Selecao de Profissional/Exame */}
                        {etapa === 3 && (
                            <div>
                                <h5 className="flex items-center gap-2">
                                    {tipoAgendamento === 'consulta'
                                        ? <Stethoscope className="size-5 text-emerald-500" />
                                        : <FlaskConical className="size-5 text-emerald-500" />
                                    }
                                    3. {tipoAgendamento === 'consulta' ? 'Selecionar Profissional' : 'Selecionar Exame'}
                                </h5>

                                {tipoAgendamento === 'consulta' ? (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {profissionais.map(prof => (
                                            <div
                                                key={prof.id}
                                                className={cn(
                                                    'cursor-pointer rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md',
                                                    formData.profissional === String(prof.id)
                                                        ? 'border-2 border-emerald-500'
                                                        : 'border-border'
                                                )}
                                                onClick={() => handleInputChange('profissional', String(prof.id))}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-11 items-center justify-center rounded-full bg-primary text-white">
                                                        <Stethoscope className="size-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <strong>{prof.nome}</strong>
                                                        <div className="text-sm text-muted-foreground">
                                                            {prof.especialidade} &bull; {prof.unidade}
                                                        </div>
                                                    </div>
                                                    {formData.profissional === String(prof.id) && (
                                                        <CheckCircle className="ml-auto size-5 text-emerald-500" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {tiposExame.map(exame => (
                                            <div
                                                key={exame.id}
                                                className={cn(
                                                    'cursor-pointer rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md',
                                                    formData.tipoExame === String(exame.id)
                                                        ? 'border-2 border-emerald-500'
                                                        : 'border-border'
                                                )}
                                                onClick={() => handleInputChange('tipoExame', String(exame.id))}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        'flex size-11 items-center justify-center rounded-full text-white',
                                                        exame.categoria === 'Laboratorial' ? 'bg-secondary' : 'bg-primary'
                                                    )}>
                                                        {exame.categoria === 'Laboratorial'
                                                            ? <FlaskConical className="size-5" />
                                                            : <ScanLine className="size-5" />
                                                        }
                                                    </div>
                                                    <div className="flex-1">
                                                        <strong>{exame.nome}</strong>
                                                        <div className="text-sm text-muted-foreground">
                                                            {exame.categoria}
                                                        </div>
                                                    </div>
                                                    {formData.tipoExame === String(exame.id) && (
                                                        <CheckCircle className="ml-auto size-5 text-emerald-500" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 flex justify-between">
                                    <button
                                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                                        onClick={etapaAnterior}
                                    >
                                        <ArrowLeft className="size-4" /> Voltar
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark disabled:opacity-50"
                                        onClick={proximaEtapa}
                                        disabled={tipoAgendamento === 'consulta' ? !formData.profissional : !formData.tipoExame}
                                    >
                                        Proximo <ArrowRight className="size-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Etapa 4: Data, Horario e Lembretes */}
                        {etapa === 4 && (
                            <div>
                                <h5 className="flex items-center gap-2">
                                    <Calendar className="size-5 text-emerald-500" />
                                    4. Data, Horario e Lembretes
                                </h5>

                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Data *</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={formData.data}
                                            onChange={(e) => handleInputChange('data', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Horarios Disponiveis *</label>
                                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                                            {horariosDisponiveis.map(hora => {
                                                const indisponivel = Math.random() > 0.7;
                                                return (
                                                    <button
                                                        key={hora}
                                                        className={cn(
                                                            'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                                                            formData.hora === hora
                                                                ? 'border-green-600 bg-green-600 text-white'
                                                                : indisponivel
                                                                    ? 'border-border bg-muted text-muted-foreground opacity-50'
                                                                    : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                                                        )}
                                                        onClick={() => !indisponivel && handleInputChange('hora', hora)}
                                                        disabled={indisponivel}
                                                    >
                                                        {hora}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Configuracao de Lembretes */}
                                <div className="mt-6 rounded-xl border border-border bg-muted p-5">
                                    <h6 className="mb-3 flex items-center gap-2 font-semibold">
                                        <Bell className="size-4 text-emerald-500" /> Configurar Lembretes WhatsApp
                                    </h6>
                                    <div className="flex gap-8">
                                        <label className="flex cursor-pointer items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.lembrete24h}
                                                onChange={(e) => handleInputChange('lembrete24h', e.target.checked)}
                                                className="size-4.5 rounded accent-emerald-500"
                                            />
                                            <span className="text-sm">Lembrete 24h antes</span>
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.lembrete2h}
                                                onChange={(e) => handleInputChange('lembrete2h', e.target.checked)}
                                                className="size-4.5 rounded accent-emerald-500"
                                            />
                                            <span className="text-sm">Lembrete 2h antes</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="mb-1 block text-sm font-medium">Observacoes</label>
                                    <textarea
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        rows={2}
                                        placeholder="Informacoes adicionais..."
                                        value={formData.observacoes}
                                        onChange={(e) => handleInputChange('observacoes', e.target.value)}
                                    />
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <button
                                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                                        onClick={etapaAnterior}
                                    >
                                        <ArrowLeft className="size-4" /> Voltar
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                        onClick={finalizarAgendamento}
                                        disabled={!formData.data || !formData.hora}
                                    >
                                        <MessageSquare className="size-4" /> Enviar via WhatsApp
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Etapa 5: Confirmacao */}
                        {etapa === 5 && agendamentoCriado && (
                            <div className="p-8 text-center">
                                <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-emerald-500 text-white">
                                    <MessageSquare className="size-12" />
                                </div>
                                <h3 className="text-emerald-500">Agendamento Enviado!</h3>
                                <p className="text-muted-foreground">O agendamento foi registrado e enviado via WhatsApp.</p>

                                <div className="mx-auto mt-6 max-w-md rounded-xl border border-border bg-card p-5 text-left shadow-sm">
                                    <div className="mb-3">
                                        <small className="text-muted-foreground">Paciente</small>
                                        <p className="m-0 font-semibold">{agendamentoCriado.paciente}</p>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted-foreground">WhatsApp</small>
                                        <p className="m-0 font-semibold">{agendamentoCriado.telefone}</p>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted-foreground">{tipoAgendamento === 'consulta' ? 'Profissional' : 'Exame'}</small>
                                        <p className="m-0 font-semibold">{agendamentoCriado.descricao}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <small className="text-muted-foreground">Data</small>
                                            <p className="m-0 font-semibold">{formatDate(agendamentoCriado.data)}</p>
                                        </div>
                                        <div>
                                            <small className="text-muted-foreground">Horario</small>
                                            <p className="m-0 font-semibold">{agendamentoCriado.hora}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mx-auto mb-6 mt-6 flex max-w-md items-center gap-4 rounded-lg border border-green-300 bg-green-50 p-4">
                                    <CheckCircle className="size-6 shrink-0 text-green-600" />
                                    <div className="text-left">
                                        <strong>Mensagem enviada!</strong>
                                        <p className="m-0 text-sm">Lembretes automaticos foram configurados.</p>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4">
                                    <button
                                        className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground"
                                        onClick={novoAtendimento}
                                    >
                                        <Plus className="size-4" /> Novo Atendimento
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                        onClick={() => {
                                            const msg = `🏥 *SmartHealth - Confirmacao de Agendamento*\n\nOla ${agendamentoCriado.paciente}!\n\nSeu agendamento foi confirmado:\n\n📋 ${agendamentoCriado.descricao}\n📅 ${formatDate(agendamentoCriado.data)}\n⏰ ${agendamentoCriado.hora}\n\nVoce recebera lembretes automaticos antes da consulta.\n\nEm caso de duvidas, responda esta mensagem.`;
                                            enviarWhatsApp(agendamentoCriado.telefone, msg);
                                        }}
                                    >
                                        <MessageSquare className="size-4" /> Abrir WhatsApp
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tab: Lembretes */}
            {abaAtiva === 'lembretes' && (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-3">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                            <Bell className="size-4" /> Gerenciamento de Lembretes
                        </span>
                        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary-dark">
                            <RefreshCw className="size-3.5" /> Atualizar
                        </button>
                    </div>
                    <div className={cn(lembretes.length === 0 && 'p-8')}>
                        {lembretes.length === 0 ? (
                            <div className="text-center text-muted-foreground">
                                <BellOff className="mx-auto mb-4 size-12" />
                                <p>Nenhum lembrete configurado.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50">
                                            <th className="px-4 py-3 text-left font-semibold">Paciente</th>
                                            <th className="px-4 py-3 text-left font-semibold">WhatsApp</th>
                                            <th className="px-4 py-3 text-left font-semibold">Agendamento</th>
                                            <th className="px-4 py-3 text-left font-semibold">Data/Hora</th>
                                            <th className="px-4 py-3 text-left font-semibold">Status</th>
                                            <th className="px-4 py-3 text-left font-semibold">Acoes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lembretes.map(l => (
                                            <tr key={l.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                                                <td className="px-4 py-3 font-semibold">{l.paciente}</td>
                                                <td className="px-4 py-3">
                                                    <span className="flex items-center gap-1.5 text-emerald-500">
                                                        <MessageSquare className="size-4" /> {l.telefone}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={cn(
                                                        'mr-2 inline-block rounded px-2 py-0.5 text-xs font-medium text-white',
                                                        l.tipo === 'consulta' ? 'bg-primary' : 'bg-cyan-500'
                                                    )}>
                                                        {l.tipo}
                                                    </span>
                                                    {l.descricao}
                                                </td>
                                                <td className="px-4 py-3">{formatDate(l.data)} as {l.hora}</td>
                                                <td className="px-4 py-3">{getStatusBadge(l.status)}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-1">
                                                        <button
                                                            className="inline-flex items-center justify-center rounded-md bg-green-600 p-1.5 text-white hover:bg-green-700"
                                                            onClick={() => reenviarLembrete(l)}
                                                            title="Enviar lembrete"
                                                        >
                                                            <MessageSquare className="size-4" />
                                                        </button>
                                                        <button
                                                            className="inline-flex items-center justify-center rounded-md border border-primary p-1.5 text-primary hover:bg-primary hover:text-primary-foreground"
                                                            onClick={() => setShowMensagem(l)}
                                                            title="Ver mensagem"
                                                        >
                                                            <Eye className="size-4" />
                                                        </button>
                                                        <button
                                                            className="inline-flex items-center justify-center rounded-md border border-border p-1.5 text-foreground hover:bg-muted"
                                                            title="Marcar confirmado"
                                                        >
                                                            <Check className="size-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tab: Historico */}
            {abaAtiva === 'historico' && (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-3">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                            <History className="size-4" /> Historico de Atendimentos
                        </span>
                        <div className="flex gap-2">
                            <input type="date" className="w-auto rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
                            <input type="date" className="w-auto rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
                            <select className="w-auto rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
                                <option value="">Todos os status</option>
                                <option value="realizado">Realizado</option>
                                <option value="faltou">Faltou</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-4 py-3 text-left font-semibold">Paciente</th>
                                    <th className="px-4 py-3 text-left font-semibold">WhatsApp</th>
                                    <th className="px-4 py-3 text-left font-semibold">Agendamento</th>
                                    <th className="px-4 py-3 text-left font-semibold">Data/Hora</th>
                                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold">Mensagens</th>
                                    <th className="px-4 py-3 text-left font-semibold">Acoes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicoData.map(h => (
                                    <tr key={h.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                                        <td className="px-4 py-3 font-semibold">{h.paciente}</td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1.5 text-emerald-500">
                                                <MessageSquare className="size-4" /> {h.telefone}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'mr-2 inline-block rounded px-2 py-0.5 text-xs font-medium text-white',
                                                h.tipo === 'consulta' ? 'bg-primary' : 'bg-cyan-500'
                                            )}>
                                                {h.tipo}
                                            </span>
                                            {h.descricao}
                                        </td>
                                        <td className="px-4 py-3">{formatDate(h.data)} as {h.hora}</td>
                                        <td className="px-4 py-3">{getStatusBadge(h.status)}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-block rounded bg-gray-500 px-2 py-0.5 text-xs font-medium text-white">
                                                {h.mensagensEnviadas} msgs
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                className="inline-flex items-center justify-center rounded-md border border-primary p-1.5 text-primary hover:bg-primary hover:text-primary-foreground"
                                                title="Ver detalhes"
                                            >
                                                <Info className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal: Preview Mensagem */}
            {showMensagem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowMensagem(null)}
                >
                    <div
                        className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-2 rounded-t-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white">
                            <MessageSquare className="size-4" /> Preview da Mensagem
                        </div>
                        <div className="p-5">
                            <div className="rounded-lg bg-green-100 p-4 font-sans text-sm leading-relaxed">
                                <p className="mb-2">🏥 <strong>SmartHealth - Lembrete de {showMensagem.tipo === 'consulta' ? 'Consulta' : 'Exame'}</strong></p>
                                <p className="mb-2">Ola {showMensagem.paciente}!</p>
                                <p className="mb-2">Lembramos que voce tem {showMensagem.tipo === 'consulta' ? 'uma consulta' : 'um exame'} agendado:</p>
                                <p className="mb-2">📋 {showMensagem.descricao}<br />📅 {formatDate(showMensagem.data)}<br />⏰ {showMensagem.hora}</p>
                                <p className="m-0">Por favor, confirme sua presenca respondendo:<br />✅ <strong>SIM</strong> para confirmar<br />❌ <strong>NAO</strong> para cancelar</p>
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                                    onClick={() => setShowMensagem(null)}
                                >
                                    Fechar
                                </button>
                                <button
                                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                    onClick={() => { reenviarLembrete(showMensagem); setShowMensagem(null); }}
                                >
                                    <MessageSquare className="size-4" /> Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
