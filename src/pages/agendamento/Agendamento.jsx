import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    CalendarCheck,
    CalendarPlus,
    PlusCircle,
    Clock,
    CheckCircle,
    Search,
    UserCheck,
    Stethoscope,
    FlaskConical,
    ArrowRight,
    ArrowLeft,
    Check,
    X,
    CalendarDays,
    List,
    Plus,
    Info,
    UserRound,
    Heart,
    Ribbon,
    ScanLine,
    CalendarX,
} from 'lucide-react';

// Available professionals
const profissionais = [
    { id: 1, nome: 'Dr. Carlos Oliveira', especialidade: 'Clínico Geral', unidade: 'UBS Centro' },
    { id: 2, nome: 'Dra. Ana Santos', especialidade: 'Médico de Família', unidade: 'UBS Norte' },
    { id: 3, nome: 'Dr. Paulo Lima', especialidade: 'Dentista', unidade: 'UBS Centro' },
    { id: 4, nome: 'Dra. Mariana Costa', especialidade: 'Ginecologista', unidade: 'UBS Sul' },
    { id: 5, nome: 'Enf. Maria Lima', especialidade: 'Enfermagem', unidade: 'UBS Centro' }
];

// Available exam types
const tiposExame = [
    { id: 1, nome: 'Hemograma Completo', categoria: 'Laboratorial' },
    { id: 2, nome: 'Glicemia de Jejum', categoria: 'Laboratorial' },
    { id: 3, nome: 'Raio-X Tórax', categoria: 'Imagem' },
    { id: 4, nome: 'Ultrassom Abdominal', categoria: 'Imagem' },
    { id: 5, nome: 'Eletrocardiograma', categoria: 'Cardiológico' },
    { id: 6, nome: 'Papanicolau', categoria: 'Preventivo' },
    { id: 7, nome: 'Mamografia', categoria: 'Imagem' }
];

// Available time slots
const horariosDisponiveis = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

// Pending confirmations
const agendamentosPendentes = [
    { id: 1, paciente: 'Maria Silva', tipo: 'consulta', descricao: 'Clínico Geral - Dr. Carlos', data: '2025-01-27', hora: '09:00', status: 'pendente' },
    { id: 2, paciente: 'João Santos', tipo: 'exame', descricao: 'Hemograma Completo', data: '2025-01-28', hora: '07:30', status: 'pendente' },
    { id: 3, paciente: 'Ana Costa', tipo: 'consulta', descricao: 'Ginecologista - Dra. Mariana', data: '2025-01-27', hora: '14:00', status: 'pendente' }
];

// Confirmed appointments
const agendamentosConfirmados = [
    { id: 4, paciente: 'Pedro Lima', tipo: 'consulta', descricao: 'Dentista - Dr. Paulo', data: '2025-01-27', hora: '10:00', confirmadoEm: '2025-01-25T14:30:00' },
    { id: 5, paciente: 'Carla Souza', tipo: 'exame', descricao: 'Ultrassom Abdominal', data: '2025-01-28', hora: '08:00', confirmadoEm: '2025-01-26T09:15:00' }
];

function getExameIcon(categoria) {
    switch (categoria) {
        case 'Laboratorial':
            return FlaskConical;
        case 'Imagem':
            return ScanLine;
        case 'Cardiológico':
            return Heart;
        default:
            return Ribbon;
    }
}

function getExameBgColor(categoria) {
    switch (categoria) {
        case 'Laboratorial':
            return 'bg-secondary';
        case 'Imagem':
            return 'bg-primary';
        case 'Cardiológico':
            return 'bg-destructive';
        default:
            return 'bg-accent';
    }
}

export default function Agendamento() {
    const [abaAtiva, setAbaAtiva] = useState('novo');
    const [tipoAgendamento, setTipoAgendamento] = useState('consulta');
    const [formData, setFormData] = useState({
        pacienteCpf: '',
        pacienteNome: '',
        profissional: '',
        tipoExame: '',
        data: '',
        hora: '',
        observacoes: ''
    });
    const [pacienteBuscado, setPacienteBuscado] = useState(null);
    const [etapa, setEtapa] = useState(1);
    const [agendamentoCriado, setAgendamentoCriado] = useState(null);
    const [pendentes, setPendentes] = useState(agendamentosPendentes);
    const [confirmados, setConfirmados] = useState(agendamentosConfirmados);
    const [showConfirmacao, setShowConfirmacao] = useState(null);

    const buscarPaciente = () => {
        // Simulating patient search
        if (formData.pacienteCpf === '123.456.789-00' || formData.pacienteCpf.length >= 11) {
            setPacienteBuscado({
                nome: 'Maria da Silva Santos',
                cpf: formData.pacienteCpf,
                cns: '1234567890123456',
                nascimento: '1985-03-15',
                telefone: '(11) 98765-4321'
            });
            setFormData({ ...formData, pacienteNome: 'Maria da Silva Santos' });
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const proximaEtapa = () => {
        if (etapa < 3) setEtapa(etapa + 1);
    };

    const etapaAnterior = () => {
        if (etapa > 1) setEtapa(etapa - 1);
    };

    const finalizarAgendamento = () => {
        const novoAgendamento = {
            id: Date.now(),
            paciente: pacienteBuscado?.nome || formData.pacienteNome,
            tipo: tipoAgendamento,
            descricao: tipoAgendamento === 'consulta'
                ? profissionais.find(p => p.id === parseInt(formData.profissional))?.nome
                : tiposExame.find(e => e.id === parseInt(formData.tipoExame))?.nome,
            data: formData.data,
            hora: formData.hora,
            status: 'pendente'
        };
        setAgendamentoCriado(novoAgendamento);
        setPendentes([...pendentes, novoAgendamento]);
        setEtapa(4);
    };

    const confirmarAgendamento = (agendamento) => {
        setPendentes(pendentes.filter(a => a.id !== agendamento.id));
        setConfirmados([...confirmados, { ...agendamento, confirmadoEm: new Date().toISOString() }]);
        setShowConfirmacao(null);
    };

    const cancelarAgendamento = (agendamento) => {
        setPendentes(pendentes.filter(a => a.id !== agendamento.id));
        setShowConfirmacao(null);
    };

    const novoAgendamento = () => {
        setFormData({
            pacienteCpf: '',
            pacienteNome: '',
            profissional: '',
            tipoExame: '',
            data: '',
            hora: '',
            observacoes: ''
        });
        setPacienteBuscado(null);
        setAgendamentoCriado(null);
        setEtapa(1);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <CalendarCheck className="h-7 w-7 text-primary" />
                        Agendamento
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Marcação de consultas e exames</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="flex gap-2 p-2">
                    <button
                        className={cn(
                            'border-b-2 px-4 py-2.5 text-sm font-medium',
                            abaAtiva === 'novo'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground'
                        )}
                        onClick={() => setAbaAtiva('novo')}
                    >
                        <span className="inline-flex items-center gap-1.5">
                            <PlusCircle className="h-4 w-4" /> Novo Agendamento
                        </span>
                    </button>
                    <button
                        className={cn(
                            'relative border-b-2 px-4 py-2.5 text-sm font-medium',
                            abaAtiva === 'pendentes'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground'
                        )}
                        onClick={() => setAbaAtiva('pendentes')}
                    >
                        <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4" /> Pendentes de Confirmação
                        </span>
                        {pendentes.length > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[0.75rem] text-white">
                                {pendentes.length}
                            </span>
                        )}
                    </button>
                    <button
                        className={cn(
                            'border-b-2 px-4 py-2.5 text-sm font-medium',
                            abaAtiva === 'confirmados'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground'
                        )}
                        onClick={() => setAbaAtiva('confirmados')}
                    >
                        <span className="inline-flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4" /> Confirmados
                        </span>
                    </button>
                </div>
            </div>

            {/* Novo Agendamento Tab */}
            {abaAtiva === 'novo' && (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarPlus className="h-4 w-4" /> Novo Agendamento
                        </span>
                        {/* Progress Steps */}
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4].map(step => (
                                <div key={step} className="flex items-center">
                                    <div
                                        className={cn(
                                            'flex h-[30px] w-[30px] items-center justify-center rounded-full text-[0.85rem] font-semibold',
                                            etapa >= step
                                                ? 'bg-primary text-white'
                                                : 'bg-muted text-muted-foreground'
                                        )}
                                    >
                                        {step === 4 ? <Check className="h-4 w-4" /> : step}
                                    </div>
                                    {step < 4 && (
                                        <div
                                            className={cn(
                                                'h-[3px] w-[30px]',
                                                etapa > step ? 'bg-primary' : 'bg-muted'
                                            )}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-5">
                        {/* Step 1: Patient Selection */}
                        {etapa === 1 && (
                            <div>
                                <h5 className="mb-4 text-base font-semibold">1. Identificação do Paciente</h5>
                                <div className="mb-4 grid grid-cols-[1fr_auto] gap-4">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">CPF do Paciente *</label>
                                        <input
                                            type="text"
                                            className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="000.000.000-00"
                                            value={formData.pacienteCpf}
                                            onChange={(e) => handleInputChange('pacienteCpf', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                                            onClick={buscarPaciente}
                                        >
                                            <Search className="h-4 w-4" /> Buscar
                                        </button>
                                    </div>
                                </div>

                                {pacienteBuscado && (
                                    <div className="mb-4 rounded-lg border border-secondary/30 bg-secondary/10 p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-secondary text-white">
                                                <UserCheck className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <strong>{pacienteBuscado.nome}</strong>
                                                <div className="text-sm">
                                                    <span>CNS: {pacienteBuscado.cns}</span> {' \u2022 '}
                                                    <span>Tel: {pacienteBuscado.telefone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <h6 className="mb-3 mt-6 text-sm font-semibold">Tipo de Agendamento</h6>
                                <div className="flex gap-4">
                                    <button
                                        className={cn(
                                            'flex flex-1 flex-col items-center gap-2 rounded-lg border px-6 py-6 text-sm font-medium',
                                            tipoAgendamento === 'consulta'
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-border text-muted-foreground hover:bg-muted'
                                        )}
                                        onClick={() => setTipoAgendamento('consulta')}
                                    >
                                        <Stethoscope className="h-8 w-8" />
                                        Consulta
                                    </button>
                                    <button
                                        className={cn(
                                            'flex flex-1 flex-col items-center gap-2 rounded-lg border px-6 py-6 text-sm font-medium',
                                            tipoAgendamento === 'exame'
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-border text-muted-foreground hover:bg-muted'
                                        )}
                                        onClick={() => setTipoAgendamento('exame')}
                                    >
                                        <FlaskConical className="h-8 w-8" />
                                        Exame
                                    </button>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
                                        onClick={proximaEtapa}
                                        disabled={!pacienteBuscado}
                                    >
                                        Próximo <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Service Selection */}
                        {etapa === 2 && (
                            <div>
                                <h5 className="mb-4 text-base font-semibold">
                                    2. {tipoAgendamento === 'consulta' ? 'Selecionar Profissional' : 'Selecionar Exame'}
                                </h5>

                                {tipoAgendamento === 'consulta' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {profissionais.map(prof => (
                                            <div
                                                key={prof.id}
                                                className={cn(
                                                    'cursor-pointer rounded-xl border bg-card shadow-sm transition-colors',
                                                    formData.profissional === String(prof.id)
                                                        ? 'border-2 border-primary'
                                                        : 'border-border hover:border-primary-light'
                                                )}
                                                onClick={() => handleInputChange('profissional', String(prof.id))}
                                            >
                                                <div className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-primary text-white">
                                                            <UserRound className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <strong>{prof.nome}</strong>
                                                            <div className="text-sm text-muted-foreground">
                                                                {prof.especialidade} {' \u2022 '} {prof.unidade}
                                                            </div>
                                                        </div>
                                                        {formData.profissional === String(prof.id) && (
                                                            <CheckCircle className="ml-auto h-5 w-5 text-primary" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        {tiposExame.map(exame => {
                                            const ExameIcon = getExameIcon(exame.categoria);
                                            const bgColor = getExameBgColor(exame.categoria);
                                            return (
                                                <div
                                                    key={exame.id}
                                                    className={cn(
                                                        'cursor-pointer rounded-xl border bg-card shadow-sm transition-colors',
                                                        formData.tipoExame === String(exame.id)
                                                            ? 'border-2 border-primary'
                                                            : 'border-border hover:border-primary-light'
                                                    )}
                                                    onClick={() => handleInputChange('tipoExame', String(exame.id))}
                                                >
                                                    <div className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                'flex h-[45px] w-[45px] items-center justify-center rounded-full text-white',
                                                                bgColor
                                                            )}>
                                                                <ExameIcon className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <strong>{exame.nome}</strong>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {exame.categoria}
                                                                </div>
                                                            </div>
                                                            {formData.tipoExame === String(exame.id) && (
                                                                <CheckCircle className="ml-auto h-5 w-5 text-primary" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="mt-6 flex justify-between">
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                        onClick={etapaAnterior}
                                    >
                                        <ArrowLeft className="h-4 w-4" /> Voltar
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
                                        onClick={proximaEtapa}
                                        disabled={tipoAgendamento === 'consulta' ? !formData.profissional : !formData.tipoExame}
                                    >
                                        Próximo <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Date and Time Selection */}
                        {etapa === 3 && (
                            <div>
                                <h5 className="mb-4 text-base font-semibold">3. Data e Horário</h5>

                                <div className="grid grid-cols-[1fr_2fr] gap-6">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Data *</label>
                                        <input
                                            type="date"
                                            className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            value={formData.data}
                                            onChange={(e) => handleInputChange('data', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Horários Disponíveis *</label>
                                        <div className="grid grid-cols-6 gap-2">
                                            {horariosDisponiveis.map(hora => {
                                                const indisponivel = Math.random() > 0.7;
                                                return (
                                                    <button
                                                        key={hora}
                                                        className={cn(
                                                            'rounded-lg border px-2 py-1.5 text-sm',
                                                            formData.hora === hora
                                                                ? 'border-primary bg-primary text-white'
                                                                : indisponivel
                                                                    ? 'border-border text-muted-foreground opacity-50'
                                                                    : 'border-primary/30 text-primary hover:bg-primary/10'
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

                                <div className="mt-6">
                                    <label className="mb-1.5 block text-sm font-medium">Observações</label>
                                    <textarea
                                        className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        rows={3}
                                        placeholder="Informações adicionais..."
                                        value={formData.observacoes}
                                        onChange={(e) => handleInputChange('observacoes', e.target.value)}
                                    />
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                        onClick={etapaAnterior}
                                    >
                                        <ArrowLeft className="h-4 w-4" /> Voltar
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-white hover:bg-secondary-dark disabled:opacity-50"
                                        onClick={finalizarAgendamento}
                                        disabled={!formData.data || !formData.hora}
                                    >
                                        <Check className="h-4 w-4" /> Finalizar Agendamento
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Confirmation */}
                        {etapa === 4 && agendamentoCriado && (
                            <div className="px-8 py-8 text-center">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-white">
                                    <Check className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-secondary">Agendamento Realizado!</h3>
                                <p className="mt-1 text-muted-foreground">O agendamento foi registrado e está pendente de confirmação.</p>

                                <div className="mx-auto mt-6 max-w-[400px] rounded-xl border border-border bg-card text-left shadow-sm">
                                    <div className="p-5">
                                        <div className="mb-3">
                                            <small className="text-muted-foreground">Paciente</small>
                                            <p className="m-0 font-semibold">{agendamentoCriado.paciente}</p>
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
                                                <small className="text-muted-foreground">Horário</small>
                                                <p className="m-0 font-semibold">{agendamentoCriado.hora}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mx-auto mb-6 mt-4 flex max-w-[400px] items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                                    <Info className="h-4 w-4 shrink-0" /> Uma notificação será enviada ao paciente para confirmação do agendamento.
                                </div>

                                <div className="flex justify-center gap-4">
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                        onClick={novoAgendamento}
                                    >
                                        <Plus className="h-4 w-4" /> Novo Agendamento
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                                        onClick={() => setAbaAtiva('pendentes')}
                                    >
                                        <List className="h-4 w-4" /> Ver Pendentes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pendentes Tab */}
            {abaAtiva === 'pendentes' && (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-1.5 border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <Clock className="h-4 w-4" /> Agendamentos Pendentes de Confirmação
                    </div>
                    <div className={cn(pendentes.length === 0 && 'p-8')}>
                        {pendentes.length === 0 ? (
                            <div className="text-center text-muted-foreground">
                                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-secondary" />
                                <p>Nenhum agendamento pendente de confirmação.</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Paciente</th>
                                        <th className="px-4 py-3 text-left font-medium">Tipo</th>
                                        <th className="px-4 py-3 text-left font-medium">Descrição</th>
                                        <th className="px-4 py-3 text-left font-medium">Data</th>
                                        <th className="px-4 py-3 text-left font-medium">Horário</th>
                                        <th className="px-4 py-3 text-left font-medium">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {pendentes.map(ag => (
                                        <tr key={ag.id}>
                                            <td className="px-4 py-3"><strong>{ag.paciente}</strong></td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    'rounded-md px-2 py-0.5 text-xs font-medium',
                                                    ag.tipo === 'consulta'
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'bg-sky-100 text-sky-700'
                                                )}>
                                                    {ag.tipo === 'consulta' ? 'Consulta' : 'Exame'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{ag.descricao}</td>
                                            <td className="px-4 py-3">{formatDate(ag.data)}</td>
                                            <td className="px-4 py-3">{ag.hora}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1">
                                                    <button
                                                        className="inline-flex items-center rounded-lg bg-secondary px-2 py-1.5 text-xs text-white hover:bg-secondary-dark"
                                                        onClick={() => setShowConfirmacao(ag)}
                                                        title="Confirmar"
                                                    >
                                                        <Check className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center rounded-lg bg-destructive px-2 py-1.5 text-xs text-white hover:bg-red-700"
                                                        onClick={() => cancelarAgendamento(ag)}
                                                        title="Cancelar"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                                        title="Reagendar"
                                                    >
                                                        <CalendarDays className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmados Tab */}
            {abaAtiva === 'confirmados' && (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-1.5 border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <CheckCircle className="h-4 w-4" /> Agendamentos Confirmados
                    </div>
                    <div className={cn(confirmados.length === 0 && 'p-8')}>
                        {confirmados.length === 0 ? (
                            <div className="text-center text-muted-foreground">
                                <CalendarX className="mx-auto mb-4 h-12 w-12" />
                                <p>Nenhum agendamento confirmado.</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Paciente</th>
                                        <th className="px-4 py-3 text-left font-medium">Tipo</th>
                                        <th className="px-4 py-3 text-left font-medium">Descrição</th>
                                        <th className="px-4 py-3 text-left font-medium">Data</th>
                                        <th className="px-4 py-3 text-left font-medium">Horário</th>
                                        <th className="px-4 py-3 text-left font-medium">Confirmado em</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {confirmados.map(ag => (
                                        <tr key={ag.id}>
                                            <td className="px-4 py-3"><strong>{ag.paciente}</strong></td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    'rounded-md px-2 py-0.5 text-xs font-medium',
                                                    ag.tipo === 'consulta'
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'bg-sky-100 text-sky-700'
                                                )}>
                                                    {ag.tipo === 'consulta' ? 'Consulta' : 'Exame'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{ag.descricao}</td>
                                            <td className="px-4 py-3">{formatDate(ag.data)}</td>
                                            <td className="px-4 py-3">{ag.hora}</td>
                                            <td className="px-4 py-3 text-sm">{new Date(ag.confirmadoEm).toLocaleString('pt-BR')}</td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
                                                    Confirmado
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmacao && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowConfirmacao(null)}
                >
                    <div
                        className="w-[450px] max-w-[90%] rounded-xl border border-border bg-card shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-1.5 rounded-t-xl border-b border-border bg-secondary px-5 py-3 text-sm font-semibold text-white">
                            <CheckCircle className="h-4 w-4" /> Confirmar Agendamento
                        </div>
                        <div className="p-5">
                            <p className="mb-3">Deseja confirmar o seguinte agendamento?</p>

                            <div className="rounded-xl border border-border bg-muted shadow-sm">
                                <div className="p-4">
                                    <strong>{showConfirmacao.paciente}</strong>
                                    <p className="my-2 text-muted-foreground">
                                        {showConfirmacao.descricao}
                                    </p>
                                    <div className="flex gap-4 text-sm">
                                        <span className="inline-flex items-center gap-1">
                                            <CalendarDays className="h-3.5 w-3.5" /> {formatDate(showConfirmacao.data)}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" /> {showConfirmacao.hora}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="mb-1.5 block text-sm font-medium">Enviar confirmação para:</label>
                                <div className="flex gap-3">
                                    <label className="flex items-center gap-1.5 text-sm">
                                        <input type="checkbox" defaultChecked /> SMS
                                    </label>
                                    <label className="flex items-center gap-1.5 text-sm">
                                        <input type="checkbox" defaultChecked /> WhatsApp
                                    </label>
                                    <label className="flex items-center gap-1.5 text-sm">
                                        <input type="checkbox" /> E-mail
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                    onClick={() => setShowConfirmacao(null)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-white hover:bg-secondary-dark"
                                    onClick={() => confirmarAgendamento(showConfirmacao)}
                                >
                                    <Check className="h-4 w-4" /> Confirmar Agendamento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
