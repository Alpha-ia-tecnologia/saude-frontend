import { useState } from 'react';

const tabs = [
    { id: 'resumo', label: 'Resumo', icon: 'fa-user' },
    { id: 'historico', label: 'Histórico', icon: 'fa-history' },
    { id: 'exames', label: 'Exames', icon: 'fa-flask' },
    { id: 'prescricoes', label: 'Prescrições', icon: 'fa-prescription' },
    { id: 'vacinas', label: 'Vacinas', icon: 'fa-syringe' }
];

const patientData = {
    nome: 'Maria da Silva Santos',
    cpf: '123.456.789-00',
    dataNascimento: '15/03/1985',
    idade: '40 anos',
    cns: '123456789012345',
    telefone: '(11) 99999-9999'
};

const historicoItems = [
    { data: '10/01/2026', tipo: 'Consulta', descricao: 'Consulta de rotina - Hipertensão controlada', medico: 'Dr. Roberto Almeida' },
    { data: '15/12/2025', tipo: 'Exame', descricao: 'Hemograma completo - Resultados normais', medico: 'Laboratório Central' },
    { data: '01/11/2025', tipo: 'Consulta', descricao: 'Retorno - Ajuste de medicação', medico: 'Dr. Roberto Almeida' }
];

export function Prontuario() {
    const [activeTab, setActiveTab] = useState('resumo');

    return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '0.5rem' }}>Prontuário Eletrônico</h1>
            <p style={{ color: 'var(--sus-gray)', marginBottom: '2rem' }}>
                Visualize e gerencie o prontuário do paciente
            </p>

            {/* Dados do Paciente */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'var(--sus-blue)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem'
                    }}>
                        <i className="fas fa-user"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{patientData.nome}</h3>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', color: 'var(--sus-gray)' }}>
                            <span><i className="fas fa-id-card"></i> {patientData.cpf}</span>
                            <span><i className="fas fa-birthday-cake"></i> {patientData.dataNascimento} ({patientData.idade})</span>
                            <span><i className="fas fa-phone"></i> {patientData.telefone}</span>
                            <span><i className="fas fa-id-badge"></i> CNS: {patientData.cns}</span>
                        </div>
                    </div>
                    <div>
                        <button className="btn btn-primary">
                            <i className="fas fa-edit"></i> Editar
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--sus-light-gray)', paddingBottom: '0' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            background: activeTab === tab.id ? 'var(--sus-blue)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--sus-gray)',
                            borderRadius: '0.5rem 0.5rem 0 0',
                            cursor: 'pointer',
                            fontWeight: activeTab === tab.id ? '600' : '400'
                        }}
                    >
                        <i className={`fas ${tab.icon}`} style={{ marginRight: '0.5rem' }}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Conteúdo das Tabs */}
            <div className="card">
                <div className="card-body">
                    {activeTab === 'resumo' && (
                        <div>
                            <h5 style={{ marginBottom: '1rem' }}>Resumo do Paciente</h5>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                <div className="alert alert-info">
                                    <strong>Condições Crônicas</strong>
                                    <p>Hipertensão Arterial, Diabetes Tipo 2</p>
                                </div>
                                <div className="alert alert-warning">
                                    <strong>Alergias</strong>
                                    <p>Dipirona, Penicilina</p>
                                </div>
                                <div className="alert alert-success">
                                    <strong>Última Consulta</strong>
                                    <p>10/01/2026 - Dr. Roberto</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'historico' && (
                        <div>
                            <h5 style={{ marginBottom: '1rem' }}>Histórico de Atendimentos</h5>
                            <div className="timeline">
                                {historicoItems.map((item, index) => (
                                    <div key={index} className="timeline-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <strong>{item.tipo}</strong>
                                            <span style={{ color: 'var(--sus-gray)' }}>{item.data}</span>
                                        </div>
                                        <p style={{ margin: 0 }}>{item.descricao}</p>
                                        <small style={{ color: 'var(--sus-gray)' }}>{item.medico}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(activeTab === 'exames' || activeTab === 'prescricoes' || activeTab === 'vacinas') && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--sus-gray)' }}>
                            <i className="fas fa-folder-open" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                            <p>Nenhum registro encontrado nesta seção.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Prontuario;
