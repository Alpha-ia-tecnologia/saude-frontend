import { Link } from 'react-router-dom';

const features = [
    {
        category: 'Pacientes',
        icon: 'fa-user-injured',
        color: 'var(--sus-blue)',
        items: [
            { name: 'Cadastro de Pacientes', description: 'Formulário completo com dados pessoais, demográficos e socioeconômicos', link: '/pacientes/cadastro' },
            { name: 'Prontuário Eletrônico', description: 'Histórico médico completo com navegação por abas', link: '/pacientes/prontuario' }
        ]
    },
    {
        category: 'Gestão Clínica',
        icon: 'fa-stethoscope',
        color: 'var(--sus-green)',
        items: [
            { name: 'Apoio à Decisão Clínica', description: 'Recomendações baseadas em sintomas e histórico', link: '/gestao-clinica/decisao' },
            { name: 'Protocolos Clínicos', description: 'Biblioteca de protocolos padronizados do SUS', link: '/gestao-clinica/protocolos' },
            { name: 'Condições Crônicas', description: 'Monitoramento de pacientes com doenças crônicas', link: '/gestao-clinica/cronicas' }
        ]
    },
    {
        category: 'Assistente IA',
        icon: 'fa-robot',
        color: 'var(--sus-light-blue)',
        items: [
            { name: 'Chatbot Clínico', description: 'Assistente inteligente com suporte a OpenAI, Gemini e DeepSeek', link: '/assistente-ia/chatbot' }
        ]
    },
    {
        category: 'Farmácia',
        icon: 'fa-pills',
        color: 'var(--sus-yellow)',
        items: [
            { name: 'Gestão de Medicamentos', description: 'Controle de estoque e alertas de validade', link: '/farmacia/medicamentos' },
            { name: 'Prescrições', description: 'Gerenciamento de prescrições médicas', link: '/farmacia/prescricoes' }
        ]
    }
];

export function Funcionalidades() {
    return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '0.5rem' }}>Funcionalidades do Sistema</h1>
            <p style={{ color: 'var(--sus-gray)', marginBottom: '2rem' }}>
                Explore todas as funcionalidades disponíveis no PEC
            </p>

            {features.map(feature => (
                <div key={feature.category} style={{ marginBottom: '2rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <i className={`fas ${feature.icon}`} style={{ color: feature.color, marginRight: '0.75rem' }}></i>
                        {feature.category}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        {feature.items.map(item => (
                            <div key={item.name} className="card">
                                <div className="card-body">
                                    <h5 style={{ marginBottom: '0.5rem' }}>{item.name}</h5>
                                    <p style={{ color: 'var(--sus-gray)', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.description}</p>
                                    <Link to={item.link} className="btn btn-outline-primary" style={{ fontSize: '0.875rem' }}>
                                        <i className="fas fa-arrow-right"></i> Acessar
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Funcionalidades;
