import { useState } from 'react';

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
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>
                        <i className="fas fa-calendar-check" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                        Agendamento
                    </h1>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--sus-gray)' }}>Marcação de consultas e exames</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body" style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className={`btn ${abaAtiva === 'novo' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setAbaAtiva('novo')}
                        >
                            <i className="fas fa-plus-circle"></i> Novo Agendamento
                        </button>
                        <button
                            className={`btn ${abaAtiva === 'pendentes' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setAbaAtiva('pendentes')}
                            style={{ position: 'relative' }}
                        >
                            <i className="fas fa-clock"></i> Pendentes de Confirmação
                            {pendentes.length > 0 && (
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
                                    {pendentes.length}
                                </span>
                            )}
                        </button>
                        <button
                            className={`btn ${abaAtiva === 'confirmados' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setAbaAtiva('confirmados')}
                        >
                            <i className="fas fa-check-circle"></i> Confirmados
                        </button>
                    </div>
                </div>
            </div>

            {/* Novo Agendamento Tab */}
            {abaAtiva === 'novo' && (
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>
                                <i className="fas fa-calendar-plus"></i> Novo Agendamento
                            </span>
                            {/* Progress Steps */}
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                {[1, 2, 3, 4].map(step => (
                                    <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            background: etapa >= step ? 'var(--sus-blue)' : '#e9ecef',
                                            color: etapa >= step ? 'white' : 'var(--sus-gray)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '600',
                                            fontSize: '0.85rem'
                                        }}>
                                            {step === 4 ? <i className="fas fa-check"></i> : step}
                                        </div>
                                        {step < 4 && (
                                            <div style={{ width: '30px', height: '3px', background: etapa > step ? 'var(--sus-blue)' : '#e9ecef' }}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        {/* Step 1: Patient Selection */}
                        {etapa === 1 && (
                            <div>
                                <h5>1. Identificação do Paciente</h5>
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
                                    <div className="alert alert-success">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                background: 'var(--sus-green)',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.25rem'
                                            }}>
                                                <i className="fas fa-user-check"></i>
                                            </div>
                                            <div>
                                                <strong>{pacienteBuscado.nome}</strong>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <span>CNS: {pacienteBuscado.cns}</span> •
                                                    <span> Tel: {pacienteBuscado.telefone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <h6 style={{ marginTop: '1.5rem' }}>Tipo de Agendamento</h6>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        className={`btn ${tipoAgendamento === 'consulta' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setTipoAgendamento('consulta')}
                                        style={{ flex: 1, padding: '1.5rem' }}
                                    >
                                        <i className="fas fa-stethoscope fa-2x" style={{ marginBottom: '0.5rem' }}></i>
                                        <br />
                                        Consulta
                                    </button>
                                    <button
                                        className={`btn ${tipoAgendamento === 'exame' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setTipoAgendamento('exame')}
                                        style={{ flex: 1, padding: '1.5rem' }}
                                    >
                                        <i className="fas fa-flask fa-2x" style={{ marginBottom: '0.5rem' }}></i>
                                        <br />
                                        Exame
                                    </button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={proximaEtapa}
                                        disabled={!pacienteBuscado}
                                    >
                                        Próximo <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Service Selection */}
                        {etapa === 2 && (
                            <div>
                                <h5>2. {tipoAgendamento === 'consulta' ? 'Selecionar Profissional' : 'Selecionar Exame'}</h5>

                                {tipoAgendamento === 'consulta' ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                        {profissionais.map(prof => (
                                            <div
                                                key={prof.id}
                                                className={`card ${formData.profissional === String(prof.id) ? 'border-primary' : ''}`}
                                                style={{
                                                    cursor: 'pointer',
                                                    borderWidth: formData.profissional === String(prof.id) ? '2px' : '1px'
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
                                                            <i className="fas fa-check-circle" style={{ marginLeft: 'auto', color: 'var(--sus-blue)' }}></i>
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
                                                className={`card ${formData.tipoExame === String(exame.id) ? 'border-primary' : ''}`}
                                                style={{
                                                    cursor: 'pointer',
                                                    borderWidth: formData.tipoExame === String(exame.id) ? '2px' : '1px'
                                                }}
                                                onClick={() => handleInputChange('tipoExame', String(exame.id))}
                                            >
                                                <div className="card-body" style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '45px',
                                                            height: '45px',
                                                            borderRadius: '50%',
                                                            background: exame.categoria === 'Laboratorial' ? 'var(--sus-green)' :
                                                                exame.categoria === 'Imagem' ? 'var(--sus-blue)' :
                                                                    exame.categoria === 'Cardiológico' ? '#dc3545' : 'var(--sus-yellow)',
                                                            color: 'white',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <i className={`fas ${exame.categoria === 'Laboratorial' ? 'fa-flask' :
                                                                    exame.categoria === 'Imagem' ? 'fa-x-ray' :
                                                                        exame.categoria === 'Cardiológico' ? 'fa-heartbeat' : 'fa-ribbon'
                                                                }`}></i>
                                                        </div>
                                                        <div>
                                                            <strong>{exame.nome}</strong>
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--sus-gray)' }}>
                                                                {exame.categoria}
                                                            </div>
                                                        </div>
                                                        {formData.tipoExame === String(exame.id) && (
                                                            <i className="fas fa-check-circle" style={{ marginLeft: 'auto', color: 'var(--sus-blue)' }}></i>
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

                        {/* Step 3: Date and Time Selection */}
                        {etapa === 3 && (
                            <div>
                                <h5>3. Data e Horário</h5>

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
                                                        className={`btn btn-sm ${formData.hora === hora ? 'btn-primary' : indisponivel ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
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

                                <div style={{ marginTop: '1.5rem' }}>
                                    <label className="form-label">Observações</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
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
                                        <i className="fas fa-check"></i> Finalizar Agendamento
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Confirmation */}
                        {etapa === 4 && agendamentoCriado && (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'var(--sus-green)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    fontSize: '2rem'
                                }}>
                                    <i className="fas fa-check"></i>
                                </div>
                                <h3 style={{ color: 'var(--sus-green)' }}>Agendamento Realizado!</h3>
                                <p style={{ color: 'var(--sus-gray)' }}>O agendamento foi registrado e está pendente de confirmação.</p>

                                <div className="card" style={{ maxWidth: '400px', margin: '1.5rem auto', textAlign: 'left' }}>
                                    <div className="card-body">
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <small style={{ color: 'var(--sus-gray)' }}>Paciente</small>
                                            <p style={{ margin: 0, fontWeight: '600' }}>{agendamentoCriado.paciente}</p>
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

                                <div className="alert alert-info" style={{ maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                                    <i className="fas fa-info-circle"></i> Uma notificação será enviada ao paciente para confirmação do agendamento.
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button className="btn btn-outline-primary" onClick={novoAgendamento}>
                                        <i className="fas fa-plus"></i> Novo Agendamento
                                    </button>
                                    <button className="btn btn-primary" onClick={() => setAbaAtiva('pendentes')}>
                                        <i className="fas fa-list"></i> Ver Pendentes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pendentes Tab */}
            {abaAtiva === 'pendentes' && (
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-clock"></i> Agendamentos Pendentes de Confirmação
                    </div>
                    <div className="card-body" style={{ padding: pendentes.length === 0 ? '2rem' : 0 }}>
                        {pendentes.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--sus-gray)' }}>
                                <i className="fas fa-check-circle fa-3x" style={{ marginBottom: '1rem', color: 'var(--sus-green)' }}></i>
                                <p>Nenhum agendamento pendente de confirmação.</p>
                            </div>
                        ) : (
                            <table className="table" style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                        <th>Paciente</th>
                                        <th>Tipo</th>
                                        <th>Descrição</th>
                                        <th>Data</th>
                                        <th>Horário</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendentes.map(ag => (
                                        <tr key={ag.id}>
                                            <td><strong>{ag.paciente}</strong></td>
                                            <td>
                                                <span className={`badge badge-${ag.tipo === 'consulta' ? 'primary' : 'info'}`}>
                                                    {ag.tipo === 'consulta' ? 'Consulta' : 'Exame'}
                                                </span>
                                            </td>
                                            <td>{ag.descricao}</td>
                                            <td>{formatDate(ag.data)}</td>
                                            <td>{ag.hora}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => setShowConfirmacao(ag)}
                                                        title="Confirmar"
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => cancelarAgendamento(ag)}
                                                        title="Cancelar"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-primary" title="Reagendar">
                                                        <i className="fas fa-calendar-alt"></i>
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
                <div className="card">
                    <div className="card-header" style={{ background: '#f8f9fa' }}>
                        <i className="fas fa-check-circle"></i> Agendamentos Confirmados
                    </div>
                    <div className="card-body" style={{ padding: confirmados.length === 0 ? '2rem' : 0 }}>
                        {confirmados.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--sus-gray)' }}>
                                <i className="fas fa-calendar-times fa-3x" style={{ marginBottom: '1rem' }}></i>
                                <p>Nenhum agendamento confirmado.</p>
                            </div>
                        ) : (
                            <table className="table" style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                        <th>Paciente</th>
                                        <th>Tipo</th>
                                        <th>Descrição</th>
                                        <th>Data</th>
                                        <th>Horário</th>
                                        <th>Confirmado em</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {confirmados.map(ag => (
                                        <tr key={ag.id}>
                                            <td><strong>{ag.paciente}</strong></td>
                                            <td>
                                                <span className={`badge badge-${ag.tipo === 'consulta' ? 'primary' : 'info'}`}>
                                                    {ag.tipo === 'consulta' ? 'Consulta' : 'Exame'}
                                                </span>
                                            </td>
                                            <td>{ag.descricao}</td>
                                            <td>{formatDate(ag.data)}</td>
                                            <td>{ag.hora}</td>
                                            <td style={{ fontSize: '0.85rem' }}>{new Date(ag.confirmadoEm).toLocaleString('pt-BR')}</td>
                                            <td><span className="badge badge-success">Confirmado</span></td>
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
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setShowConfirmacao(null)}
                >
                    <div className="card" style={{ width: '450px', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
                        <div className="card-header" style={{ background: 'var(--sus-green)', color: 'white' }}>
                            <i className="fas fa-check-circle"></i> Confirmar Agendamento
                        </div>
                        <div className="card-body">
                            <p>Deseja confirmar o seguinte agendamento?</p>

                            <div className="card" style={{ background: '#f8f9fa' }}>
                                <div className="card-body" style={{ padding: '1rem' }}>
                                    <strong>{showConfirmacao.paciente}</strong>
                                    <p style={{ margin: '0.5rem 0', color: 'var(--sus-gray)' }}>
                                        {showConfirmacao.descricao}
                                    </p>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <span><i className="fas fa-calendar"></i> {formatDate(showConfirmacao.data)}</span>
                                        <span><i className="fas fa-clock"></i> {showConfirmacao.hora}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <label className="form-label">Enviar confirmação para:</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <input type="checkbox" defaultChecked /> SMS
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <input type="checkbox" defaultChecked /> WhatsApp
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <input type="checkbox" /> E-mail
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button className="btn btn-outline-secondary" onClick={() => setShowConfirmacao(null)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-success" onClick={() => confirmarAgendamento(showConfirmacao)}>
                                    <i className="fas fa-check"></i> Confirmar Agendamento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
