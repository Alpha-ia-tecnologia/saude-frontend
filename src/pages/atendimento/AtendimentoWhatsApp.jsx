import { useState } from 'react';

// Sample professionals
const profissionais = [
    { id: 1, nome: 'Dr. Carlos Oliveira', especialidade: 'Clínico Geral', unidade: 'UBS Centro' },
    { id: 2, nome: 'Dra. Ana Santos', especialidade: 'Médico de Família', unidade: 'UBS Norte' },
    { id: 3, nome: 'Dr. Paulo Lima', especialidade: 'Dentista', unidade: 'UBS Centro' },
    { id: 4, nome: 'Dra. Mariana Costa', especialidade: 'Ginecologista', unidade: 'UBS Sul' },
    { id: 5, nome: 'Enf. Maria Lima', especialidade: 'Enfermagem', unidade: 'UBS Centro' }
];

// Sample exam types
const tiposExame = [
    { id: 1, nome: 'Hemograma Completo', categoria: 'Laboratorial' },
    { id: 2, nome: 'Glicemia de Jejum', categoria: 'Laboratorial' },
    { id: 3, nome: 'Raio-X Tórax', categoria: 'Imagem' },
    { id: 4, nome: 'Ultrassom Abdominal', categoria: 'Imagem' },
    { id: 5, nome: 'Eletrocardiograma', categoria: 'Cardiológico' }
];

// Sample reminders
const lembretesData = [
    { id: 1, paciente: 'Maria Silva', telefone: '(11) 99999-1234', tipo: 'consulta', descricao: 'Clínico Geral - Dr. Carlos', data: '2025-01-28', hora: '09:00', status: 'enviado', lembreteEnviado: '2025-01-27T09:00:00', confirmado: false },
    { id: 2, paciente: 'João Santos', telefone: '(11) 98888-5678', tipo: 'exame', descricao: 'Hemograma Completo', data: '2025-01-29', hora: '07:30', status: 'confirmado', lembreteEnviado: '2025-01-28T07:30:00', confirmado: true },
    { id: 3, paciente: 'Ana Costa', telefone: '(11) 97777-9012', tipo: 'consulta', descricao: 'Ginecologista - Dra. Mariana', data: '2025-01-28', hora: '14:00', status: 'pendente', lembreteEnviado: null, confirmado: false }
];

// Sample history
const historicoData = [
    { id: 1, paciente: 'Pedro Lima', telefone: '(11) 96666-3456', tipo: 'consulta', descricao: 'Dentista - Dr. Paulo', data: '2025-01-25', hora: '10:00', status: 'realizado', mensagensEnviadas: 3 },
    { id: 2, paciente: 'Carla Souza', telefone: '(11) 95555-7890', tipo: 'exame', descricao: 'Ultrassom', data: '2025-01-24', hora: '08:00', status: 'faltou', mensagensEnviadas: 4 },
    { id: 3, paciente: 'Roberto Alves', telefone: '(11) 94444-2345', tipo: 'consulta', descricao: 'Clínico Geral', data: '2025-01-23', hora: '11:00', status: 'cancelado', mensagensEnviadas: 2 }
];

// Time slots
const horariosDisponiveis = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
];

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
        const colors = {
            'pendente': { bg: '#ffc107', color: '#000' },
            'enviado': { bg: '#17a2b8', color: '#fff' },
            'confirmado': { bg: '#28a745', color: '#fff' },
            'realizado': { bg: '#28a745', color: '#fff' },
            'faltou': { bg: '#dc3545', color: '#fff' },
            'cancelado': { bg: '#6c757d', color: '#fff' }
        };
        const style = colors[status] || colors['pendente'];
        return (
            <span style={{
                background: style.bg,
                color: style.color,
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase'
            }}>
                {status}
            </span>
        );
    };

    const reenviarLembrete = (lembrete) => {
        const mensagem = `🏥 *SmartHealth - Lembrete de ${lembrete.tipo === 'consulta' ? 'Consulta' : 'Exame'}*\n\nOlá ${lembrete.paciente}!\n\nLembramos que você tem ${lembrete.tipo === 'consulta' ? 'uma consulta' : 'um exame'} agendado:\n\n📋 ${lembrete.descricao}\n📅 ${formatDate(lembrete.data)}\n⏰ ${lembrete.hora}\n\nPor favor, confirme sua presença respondendo:\n✅ *SIM* para confirmar\n❌ *NÃO* para cancelar`;
        enviarWhatsApp(lembrete.telefone, mensagem);
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>
                        <i className="fab fa-whatsapp" style={{ color: '#25D366', marginRight: '0.5rem' }}></i>
                        Atendimento WhatsApp
                    </h1>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--sus-gray)' }}>Agendamento e lembretes via WhatsApp</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '10px', height: '10px', background: '#25D366', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '0.85rem' }}>WhatsApp Conectado</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white' }}>
                    <div className="card-body" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.85rem' }}>Mensagens Hoje</p>
                                <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.75rem' }}>127</h3>
                            </div>
                            <i className="fab fa-whatsapp" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, color: 'var(--sus-gray)', fontSize: '0.85rem' }}>Confirmados</p>
                                <h3 style={{ margin: '0.25rem 0 0', color: '#28a745' }}>42</h3>
                            </div>
                            <i className="fas fa-check-circle" style={{ fontSize: '2rem', color: '#28a745' }}></i>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, color: 'var(--sus-gray)', fontSize: '0.85rem' }}>Pendentes</p>
                                <h3 style={{ margin: '0.25rem 0 0', color: '#ffc107' }}>18</h3>
                            </div>
                            <i className="fas fa-clock" style={{ fontSize: '2rem', color: '#ffc107' }}></i>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, color: 'var(--sus-gray)', fontSize: '0.85rem' }}>Taxa Confirmação</p>
                                <h3 style={{ margin: '0.25rem 0 0', color: 'var(--sus-blue)' }}>87%</h3>
                            </div>
                            <i className="fas fa-chart-line" style={{ fontSize: '2rem', color: 'var(--sus-blue)' }}></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body" style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className={`btn ${abaAtiva === 'atendimento' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setAbaAtiva('atendimento')}
                        >
                            <i className="fas fa-headset"></i> Novo Atendimento
                        </button>
                        <button
                            className={`btn ${abaAtiva === 'lembretes' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setAbaAtiva('lembretes')}
                            style={{ position: 'relative' }}
                        >
                            <i className="fas fa-bell"></i> Lembretes
                            {lembretes.filter(l => l.status === 'pendente').length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#dc3545',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {lembretes.filter(l => l.status === 'pendente').length}
                                </span>
                            )}
                        </button>
                        <button
                            className={`btn ${abaAtiva === 'historico' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setAbaAtiva('historico')}
                        >
                            <i className="fas fa-history"></i> Histórico
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab: Atendimento */}
            {abaAtiva === 'atendimento' && (
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>
                                <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i> Novo Atendimento via WhatsApp
                            </span>
                            {/* Progress Steps */}
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                {[1, 2, 3, 4, 5].map(step => (
                                    <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            background: etapa >= step ? '#25D366' : '#e9ecef',
                                            color: etapa >= step ? 'white' : 'var(--sus-gray)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '600',
                                            fontSize: '0.85rem',
                                            transition: 'all 0.3s'
                                        }}>
                                            {etapa > step ? <i className="fas fa-check"></i> : step}
                                        </div>
                                        {step < 5 && (
                                            <div style={{ width: '20px', height: '3px', background: etapa > step ? '#25D366' : '#e9ecef', transition: 'all 0.3s' }}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        {/* Etapa 1: Identificação */}
                        {etapa === 1 && (
                            <div>
                                <h5><i className="fas fa-user" style={{ color: '#25D366', marginRight: '0.5rem' }}></i> 1. Identificação do Paciente</h5>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label className="form-label">CPF do Paciente *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="000.000.000-00"
                                            value={formData.pacienteCpf}
                                            onChange={(e) => handleInputChange('pacienteCpf', e.target.value)}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <button className="btn btn-primary" onClick={buscarPaciente}>
                                            <i className="fas fa-search"></i> Buscar
                                        </button>
                                    </div>
                                </div>

                                {pacienteBuscado && (
                                    <div className="alert" style={{ background: '#d4edda', borderColor: '#c3e6cb' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                background: '#25D366',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.25rem'
                                            }}>
                                                <i className="fas fa-user-check"></i>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <strong>{pacienteBuscado.nome}</strong>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <span>CNS: {pacienteBuscado.cns}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {pacienteBuscado && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <label className="form-label">
                                            <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i> Número WhatsApp *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="(00) 00000-0000"
                                            value={formData.telefone}
                                            onChange={(e) => handleInputChange('telefone', e.target.value)}
                                        />
                                        <small className="text-muted">Confirme o número do WhatsApp do paciente</small>
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={proximaEtapa}
                                        disabled={!pacienteBuscado || !formData.telefone}
                                    >
                                        Próximo <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Etapa 2: Tipo de Agendamento */}
                        {etapa === 2 && (
                            <div>
                                <h5><i className="fas fa-calendar-plus" style={{ color: '#25D366', marginRight: '0.5rem' }}></i> 2. Tipo de Agendamento</h5>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        className={`btn ${tipoAgendamento === 'consulta' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setTipoAgendamento('consulta')}
                                        style={{ flex: 1, padding: '2rem' }}
                                    >
                                        <i className="fas fa-stethoscope fa-2x" style={{ marginBottom: '0.5rem' }}></i>
                                        <br />
                                        <strong>Consulta</strong>
                                        <br />
                                        <small style={{ opacity: 0.8 }}>Atendimento médico</small>
                                    </button>
                                    <button
                                        className={`btn ${tipoAgendamento === 'exame' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setTipoAgendamento('exame')}
                                        style={{ flex: 1, padding: '2rem' }}
                                    >
                                        <i className="fas fa-flask fa-2x" style={{ marginBottom: '0.5rem' }}></i>
                                        <br />
                                        <strong>Exame</strong>
                                        <br />
                                        <small style={{ opacity: 0.8 }}>Exames laboratoriais/imagem</small>
                                    </button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                    <button className="btn btn-outline-secondary" onClick={etapaAnterior}>
                                        <i className="fas fa-arrow-left"></i> Voltar
                                    </button>
                                    <button className="btn btn-primary" onClick={proximaEtapa}>
                                        Próximo <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Etapa 3: Seleção de Profissional/Exame */}
                        {etapa === 3 && (
                            <div>
                                <h5>
                                    <i className={`fas ${tipoAgendamento === 'consulta' ? 'fa-user-md' : 'fa-flask'}`} style={{ color: '#25D366', marginRight: '0.5rem' }}></i>
                                    3. {tipoAgendamento === 'consulta' ? 'Selecionar Profissional' : 'Selecionar Exame'}
                                </h5>

                                {tipoAgendamento === 'consulta' ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                        {profissionais.map(prof => (
                                            <div
                                                key={prof.id}
                                                className={`card ${formData.profissional === String(prof.id) ? 'border-success' : ''}`}
                                                style={{
                                                    cursor: 'pointer',
                                                    borderWidth: formData.profissional === String(prof.id) ? '2px' : '1px',
                                                    borderColor: formData.profissional === String(prof.id) ? '#25D366' : ''
                                                }}
                                                onClick={() => handleInputChange('profissional', String(prof.id))}
                                            >
                                                <div className="card-body" style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '45px',
                                                            height: '45px',
                                                            borderRadius: '50%',
                                                            background: 'var(--sus-blue)',
                                                            color: 'white',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <i className="fas fa-user-md"></i>
                                                        </div>
                                                        <div>
                                                            <strong>{prof.nome}</strong>
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--sus-gray)' }}>
                                                                {prof.especialidade} • {prof.unidade}
                                                            </div>
                                                        </div>
                                                        {formData.profissional === String(prof.id) && (
                                                            <i className="fas fa-check-circle" style={{ marginLeft: 'auto', color: '#25D366' }}></i>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                        {tiposExame.map(exame => (
                                            <div
                                                key={exame.id}
                                                className={`card ${formData.tipoExame === String(exame.id) ? 'border-success' : ''}`}
                                                style={{
                                                    cursor: 'pointer',
                                                    borderWidth: formData.tipoExame === String(exame.id) ? '2px' : '1px',
                                                    borderColor: formData.tipoExame === String(exame.id) ? '#25D366' : ''
                                                }}
                                                onClick={() => handleInputChange('tipoExame', String(exame.id))}
                                            >
                                                <div className="card-body" style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '45px',
                                                            height: '45px',
                                                            borderRadius: '50%',
                                                            background: exame.categoria === 'Laboratorial' ? 'var(--sus-green)' : 'var(--sus-blue)',
                                                            color: 'white',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <i className={`fas ${exame.categoria === 'Laboratorial' ? 'fa-flask' : 'fa-x-ray'}`}></i>
                                                        </div>
                                                        <div>
                                                            <strong>{exame.nome}</strong>
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--sus-gray)' }}>
                                                                {exame.categoria}
                                                            </div>
                                                        </div>
                                                        {formData.tipoExame === String(exame.id) && (
                                                            <i className="fas fa-check-circle" style={{ marginLeft: 'auto', color: '#25D366' }}></i>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                    <button className="btn btn-outline-secondary" onClick={etapaAnterior}>
                                        <i className="fas fa-arrow-left"></i> Voltar
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={proximaEtapa}
                                        disabled={tipoAgendamento === 'consulta' ? !formData.profissional : !formData.tipoExame}
                                    >
                                        Próximo <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Etapa 4: Data, Horário e Lembretes */}
                        {etapa === 4 && (
                            <div>
                                <h5><i className="fas fa-calendar-alt" style={{ color: '#25D366', marginRight: '0.5rem' }}></i> 4. Data, Horário e Lembretes</h5>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                                    <div>
                                        <label className="form-label">Data *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={formData.data}
                                            onChange={(e) => handleInputChange('data', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Horários Disponíveis *</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
                                            {horariosDisponiveis.map(hora => {
                                                const indisponivel = Math.random() > 0.7;
                                                return (
                                                    <button
                                                        key={hora}
                                                        className={`btn btn-sm ${formData.hora === hora ? 'btn-success' : indisponivel ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
                                                        onClick={() => !indisponivel && handleInputChange('hora', hora)}
                                                        disabled={indisponivel}
                                                        style={{ opacity: indisponivel ? 0.5 : 1 }}
                                                    >
                                                        {hora}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Configuração de Lembretes */}
                                <div className="card" style={{ marginTop: '1.5rem', background: '#f8f9fa' }}>
                                    <div className="card-body">
                                        <h6><i className="fas fa-bell" style={{ color: '#25D366' }}></i> Configurar Lembretes WhatsApp</h6>
                                        <div style={{ display: 'flex', gap: '2rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.lembrete24h}
                                                    onChange={(e) => handleInputChange('lembrete24h', e.target.checked)}
                                                    style={{ width: '18px', height: '18px' }}
                                                />
                                                <span>Lembrete 24h antes</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.lembrete2h}
                                                    onChange={(e) => handleInputChange('lembrete2h', e.target.checked)}
                                                    style={{ width: '18px', height: '18px' }}
                                                />
                                                <span>Lembrete 2h antes</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '1rem' }}>
                                    <label className="form-label">Observações</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        placeholder="Informações adicionais..."
                                        value={formData.observacoes}
                                        onChange={(e) => handleInputChange('observacoes', e.target.value)}
                                    ></textarea>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                    <button className="btn btn-outline-secondary" onClick={etapaAnterior}>
                                        <i className="fas fa-arrow-left"></i> Voltar
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={finalizarAgendamento}
                                        disabled={!formData.data || !formData.hora}
                                    >
                                        <i className="fab fa-whatsapp"></i> Enviar via WhatsApp
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Etapa 5: Confirmação */}
                        {etapa === 5 && agendamentoCriado && (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: '#25D366',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    fontSize: '3rem'
                                }}>
                                    <i className="fab fa-whatsapp"></i>
                                </div>
                                <h3 style={{ color: '#25D366' }}>Agendamento Enviado!</h3>
                                <p style={{ color: 'var(--sus-gray)' }}>O agendamento foi registrado e enviado via WhatsApp.</p>

                                <div className="card" style={{ maxWidth: '450px', margin: '1.5rem auto', textAlign: 'left' }}>
                                    <div className="card-body">
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <small style={{ color: 'var(--sus-gray)' }}>Paciente</small>
                                            <p style={{ margin: 0, fontWeight: '600' }}>{agendamentoCriado.paciente}</p>
                                        </div>
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <small style={{ color: 'var(--sus-gray)' }}>WhatsApp</small>
                                            <p style={{ margin: 0, fontWeight: '600' }}>{agendamentoCriado.telefone}</p>
                                        </div>
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <small style={{ color: 'var(--sus-gray)' }}>{tipoAgendamento === 'consulta' ? 'Profissional' : 'Exame'}</small>
                                            <p style={{ margin: 0, fontWeight: '600' }}>{agendamentoCriado.descricao}</p>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <small style={{ color: 'var(--sus-gray)' }}>Data</small>
                                                <p style={{ margin: 0, fontWeight: '600' }}>{formatDate(agendamentoCriado.data)}</p>
                                            </div>
                                            <div>
                                                <small style={{ color: 'var(--sus-gray)' }}>Horário</small>
                                                <p style={{ margin: 0, fontWeight: '600' }}>{agendamentoCriado.hora}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="alert" style={{ maxWidth: '450px', margin: '0 auto 1.5rem', background: '#d4edda', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <i className="fas fa-check-circle" style={{ color: '#28a745', fontSize: '1.5rem' }}></i>
                                    <div style={{ textAlign: 'left' }}>
                                        <strong>Mensagem enviada!</strong>
                                        <p style={{ margin: 0, fontSize: '0.85rem' }}>Lembretes automáticos foram configurados.</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button className="btn btn-outline-primary" onClick={novoAtendimento}>
                                        <i className="fas fa-plus"></i> Novo Atendimento
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            const msg = `🏥 *SmartHealth - Confirmação de Agendamento*\n\nOlá ${agendamentoCriado.paciente}!\n\nSeu agendamento foi confirmado:\n\n📋 ${agendamentoCriado.descricao}\n📅 ${formatDate(agendamentoCriado.data)}\n⏰ ${agendamentoCriado.hora}\n\nVocê receberá lembretes automáticos antes da consulta.\n\nEm caso de dúvidas, responda esta mensagem.`;
                                            enviarWhatsApp(agendamentoCriado.telefone, msg);
                                        }}
                                    >
                                        <i className="fab fa-whatsapp"></i> Abrir WhatsApp
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tab: Lembretes */}
            {abaAtiva === 'lembretes' && (
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span><i className="fas fa-bell"></i> Gerenciamento de Lembretes</span>
                            <button className="btn btn-sm btn-primary">
                                <i className="fas fa-sync-alt"></i> Atualizar
                            </button>
                        </div>
                    </div>
                    <div className="card-body" style={{ padding: lembretes.length === 0 ? '2rem' : 0 }}>
                        {lembretes.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--sus-gray)' }}>
                                <i className="fas fa-bell-slash fa-3x" style={{ marginBottom: '1rem' }}></i>
                                <p>Nenhum lembrete configurado.</p>
                            </div>
                        ) : (
                            <table className="table" style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                        <th>Paciente</th>
                                        <th>WhatsApp</th>
                                        <th>Agendamento</th>
                                        <th>Data/Hora</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lembretes.map(l => (
                                        <tr key={l.id}>
                                            <td><strong>{l.paciente}</strong></td>
                                            <td>
                                                <span style={{ color: '#25D366' }}>
                                                    <i className="fab fa-whatsapp"></i> {l.telefone}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${l.tipo === 'consulta' ? 'bg-primary' : 'bg-info'}`} style={{ marginRight: '0.5rem' }}>
                                                    {l.tipo}
                                                </span>
                                                {l.descricao}
                                            </td>
                                            <td>{formatDate(l.data)} às {l.hora}</td>
                                            <td>{getStatusBadge(l.status)}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => reenviarLembrete(l)}
                                                        title="Enviar lembrete"
                                                    >
                                                        <i className="fab fa-whatsapp"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => setShowMensagem(l)}
                                                        title="Ver mensagem"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-secondary" title="Marcar confirmado">
                                                        <i className="fas fa-check"></i>
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

            {/* Tab: Histórico */}
            {abaAtiva === 'historico' && (
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span><i className="fas fa-history"></i> Histórico de Atendimentos</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="date" className="form-control form-control-sm" style={{ width: 'auto' }} />
                                <input type="date" className="form-control form-control-sm" style={{ width: 'auto' }} />
                                <select className="form-control form-control-sm" style={{ width: 'auto' }}>
                                    <option value="">Todos os status</option>
                                    <option value="realizado">Realizado</option>
                                    <option value="faltou">Faltou</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <table className="table" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>WhatsApp</th>
                                    <th>Agendamento</th>
                                    <th>Data/Hora</th>
                                    <th>Status</th>
                                    <th>Mensagens</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicoData.map(h => (
                                    <tr key={h.id}>
                                        <td><strong>{h.paciente}</strong></td>
                                        <td>
                                            <span style={{ color: '#25D366' }}>
                                                <i className="fab fa-whatsapp"></i> {h.telefone}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${h.tipo === 'consulta' ? 'bg-primary' : 'bg-info'}`} style={{ marginRight: '0.5rem' }}>
                                                {h.tipo}
                                            </span>
                                            {h.descricao}
                                        </td>
                                        <td>{formatDate(h.data)} às {h.hora}</td>
                                        <td>{getStatusBadge(h.status)}</td>
                                        <td>
                                            <span className="badge bg-secondary">{h.mensagensEnviadas} msgs</span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary" title="Ver detalhes">
                                                <i className="fas fa-info-circle"></i>
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
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setShowMensagem(null)}
                >
                    <div className="card" style={{ width: '400px', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
                        <div className="card-header" style={{ background: '#25D366', color: 'white' }}>
                            <i className="fab fa-whatsapp"></i> Preview da Mensagem
                        </div>
                        <div className="card-body">
                            <div style={{
                                background: '#dcf8c6',
                                borderRadius: '8px',
                                padding: '1rem',
                                fontFamily: 'system-ui',
                                fontSize: '0.9rem',
                                lineHeight: '1.5'
                            }}>
                                <p style={{ margin: '0 0 0.5rem' }}>🏥 <strong>SmartHealth - Lembrete de {showMensagem.tipo === 'consulta' ? 'Consulta' : 'Exame'}</strong></p>
                                <p style={{ margin: '0 0 0.5rem' }}>Olá {showMensagem.paciente}!</p>
                                <p style={{ margin: '0 0 0.5rem' }}>Lembramos que você tem {showMensagem.tipo === 'consulta' ? 'uma consulta' : 'um exame'} agendado:</p>
                                <p style={{ margin: '0 0 0.5rem' }}>📋 {showMensagem.descricao}<br />📅 {formatDate(showMensagem.data)}<br />⏰ {showMensagem.hora}</p>
                                <p style={{ margin: '0' }}>Por favor, confirme sua presença respondendo:<br />✅ <strong>SIM</strong> para confirmar<br />❌ <strong>NÃO</strong> para cancelar</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button className="btn btn-outline-secondary" onClick={() => setShowMensagem(null)}>
                                    Fechar
                                </button>
                                <button className="btn btn-success" onClick={() => { reenviarLembrete(showMensagem); setShowMensagem(null); }}>
                                    <i className="fab fa-whatsapp"></i> Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
