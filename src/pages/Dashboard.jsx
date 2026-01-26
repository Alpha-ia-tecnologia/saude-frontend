import { Link } from 'react-router-dom';

const quickAccessCards = [
    { title: 'Pacientes', icon: 'fa-user-injured', color: 'var(--sus-blue)', link: '/pacientes/cadastro', description: 'Cadastro e gerenciamento de pacientes' },
    { title: 'Prontuário', icon: 'fa-file-medical', color: 'var(--sus-green)', link: '/pacientes/prontuario', description: 'Acesso ao prontuário eletrônico' },
    { title: 'Farmácia', icon: 'fa-pills', color: 'var(--sus-yellow)', link: '/farmacia/medicamentos', description: 'Gestão de medicamentos e prescrições' },
    { title: 'Análise de Dados', icon: 'fa-chart-bar', color: 'var(--sus-red)', link: '/analise-dados/dashboard', description: 'Relatórios e indicadores' }
];

const aiInsights = [
    { type: 'info', title: 'Tendências de Saúde', icon: 'fa-lightbulb', message: 'A análise de IA detectou um aumento de 15% nos casos de hipertensão nos últimos 3 meses.' },
    { type: 'warning', title: 'Alerta de Estoque', icon: 'fa-exclamation-triangle', message: 'Medicamentos para diabetes estão com estoque abaixo do nível crítico.' },
    { type: 'success', title: 'Melhoria de Indicadores', icon: 'fa-chart-line', message: 'A cobertura vacinal aumentou 8% no último trimestre, atingindo 92% da população-alvo.' }
];

const recentActivities = [
    { type: 'Cadastro', message: 'Novo paciente cadastrado: Maria Silva', time: 'Há 10 minutos', badge: 'primary' },
    { type: 'Atendimento', message: 'Consulta finalizada: João Santos', time: 'Há 25 minutos', badge: 'success' },
    { type: 'Farmácia', message: 'Medicamento dispensado: Losartana', time: 'Há 45 minutos', badge: 'warning' },
    { type: 'Exame', message: 'Resultado disponível: Hemograma', time: 'Há 1 hora', badge: 'info' }
];

const todaySchedule = [
    { time: '08:00 - 08:30', patient: 'Carlos Pereira', type: 'Consulta de rotina', doctor: 'Dr. Roberto Almeida', status: 'success' },
    { time: '09:00 - 09:30', patient: 'Juliana Lima', type: 'Retorno', doctor: 'Dra. Fernanda Costa', status: 'warning' },
    { time: '10:00 - 11:00', patient: 'Paulo Souza', type: 'Avaliação cardiológica', doctor: 'Dr. André Martins', status: 'success' },
    { time: '15:00 - 15:30', patient: 'Lucas Oliveira', type: 'Vacinação', doctor: 'Enf. Patrícia Silva', status: 'success' }
];

export function Dashboard() {
    return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '1.5rem' }}>Acesso Rápido</h1>

            {/* Cards de acesso rápido */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {quickAccessCards.map(card => (
                    <div key={card.title} className="card">
                        <div className="card-header" style={{ background: card.color, color: 'white', textAlign: 'center', padding: '1.5rem' }}>
                            <i className={`fas ${card.icon}`} style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{card.title}</h3>
                        </div>
                        <div className="card-body" style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--sus-gray)', marginBottom: '1rem' }}>{card.description}</p>
                            <Link to={card.link} className="btn btn-outline-primary">Acessar</Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Insights de IA */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>
                        <i className="fas fa-robot" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                        Insights de IA
                    </h2>
                    <button className="btn btn-outline-primary" style={{ padding: '0.25rem 0.75rem' }}>
                        <i className="fas fa-sync-alt"></i> Atualizar
                    </button>
                </div>
                <div className="card">
                    <div className="card-body">
                        {aiInsights.map((insight, index) => (
                            <div key={index} className={`alert alert-${insight.type}`} style={{ marginBottom: index === aiInsights.length - 1 ? 0 : '1rem' }}>
                                <h5 style={{ marginBottom: '0.5rem' }}>
                                    <i className={`fas ${insight.icon}`} style={{ marginRight: '0.5rem' }}></i>
                                    {insight.title}
                                </h5>
                                <p style={{ margin: 0 }}>{insight.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Atividades e Agenda */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
                {/* Atividades Recentes */}
                <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h5 style={{ margin: 0 }}>Atividades Recentes</h5>
                        <button className="btn btn-outline-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Ver todas</button>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        {recentActivities.map((activity, index) => (
                            <div key={index} style={{
                                padding: '1rem',
                                borderBottom: index < recentActivities.length - 1 ? '1px solid var(--sus-light-gray)' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <span className={`badge badge-${activity.badge}`} style={{ marginRight: '0.5rem' }}>{activity.type}</span>
                                    <span>{activity.message}</span>
                                </div>
                                <small style={{ color: 'var(--sus-gray)' }}>{activity.time}</small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Agenda do Dia */}
                <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h5 style={{ margin: 0 }}>Agenda do Dia</h5>
                        <button className="btn btn-outline-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Ver agenda completa</button>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        {todaySchedule.map((item, index) => (
                            <div key={index} style={{
                                padding: '1rem',
                                borderBottom: index < todaySchedule.length - 1 ? '1px solid var(--sus-light-gray)' : 'none'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                    <strong>{item.time}</strong>
                                    <span className={`badge badge-${item.status}`}>
                                        {item.status === 'success' ? 'Confirmado' : 'Pendente'}
                                    </span>
                                </div>
                                <div>{item.patient} - {item.type}</div>
                                <small style={{ color: 'var(--sus-gray)' }}>{item.doctor}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
