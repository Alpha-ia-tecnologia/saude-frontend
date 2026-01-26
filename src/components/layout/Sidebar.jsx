import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
    { path: '/', label: 'Início', icon: 'fa-home' },
    { path: '/funcionalidades', label: 'Funcionalidades', icon: 'fa-th-large' },
    {
        label: 'Pacientes',
        icon: 'fa-user-injured',
        children: [
            { path: '/pacientes/cadastro', label: 'Cadastro de Pacientes', icon: 'fa-user-plus' },
            { path: '/pacientes/prontuario', label: 'Prontuário Eletrônico', icon: 'fa-file-medical' }
        ]
    },
    {
        label: 'Gestão Clínica',
        icon: 'fa-stethoscope',
        children: [
            { path: '/gestao-clinica/decisao', label: 'Apoio à Decisão', icon: 'fa-brain' },
            { path: '/gestao-clinica/protocolos', label: 'Protocolos Clínicos', icon: 'fa-file-medical-alt' },
            { path: '/gestao-clinica/cronicas', label: 'Condições Crônicas', icon: 'fa-heartbeat' }
        ]
    },
    {
        label: 'Assistente IA',
        icon: 'fa-robot',
        children: [
            { path: '/assistente-ia/chatbot', label: 'Decisões Clínicas', icon: 'fa-comment-medical' }
        ]
    },
    {
        label: 'Farmácia',
        icon: 'fa-pills',
        children: [
            { path: '/farmacia/medicamentos', label: 'Gestão de Medicamentos', icon: 'fa-capsules' },
            { path: '/farmacia/prescricoes', label: 'Prescrições', icon: 'fa-prescription' }
        ]
    },
    {
        label: 'Comunicação',
        icon: 'fa-comments',
        children: [
            { path: '/comunicacao/referencia', label: 'Referência e Contra-referência', icon: 'fa-exchange-alt' },
            { path: '/comunicacao/mensagens', label: 'Mensagens', icon: 'fa-envelope' }
        ]
    },
    {
        label: 'Análise de Dados',
        icon: 'fa-chart-bar',
        children: [
            { path: '/analise-dados/dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
            { path: '/analise-dados/relatorios', label: 'Relatórios', icon: 'fa-file-alt' },
            { path: '/analise-dados/indicadores', label: 'Indicadores', icon: 'fa-chart-line' }
        ]
    },
    {
        label: 'Financeiro',
        icon: 'fa-dollar-sign',
        children: [
            { path: '/financeiro/orcamento', label: 'Orçamento', icon: 'fa-money-bill-alt' }
        ]
    },
    {
        label: 'Integração',
        icon: 'fa-plug',
        children: [
            { path: '/integracao/servicos', label: 'Serviços Externos', icon: 'fa-external-link-alt' }
        ]
    },
    {
        label: 'Gestores',
        icon: 'fa-user-tie',
        children: [
            { path: '/gestores/dashboard', label: 'Dashboard Gerencial', icon: 'fa-tachometer-alt' },
            { path: '/gestores/indicadores', label: 'Indicadores', icon: 'fa-chart-line' },
            { path: '/gestores/rh', label: 'Recursos Humanos', icon: 'fa-users' },
            { path: '/gestores/planejamento', label: 'Planejamento Estratégico', icon: 'fa-tasks' }
        ]
    }
];

function MenuItem({ item }) {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    if (item.children) {
        const isActive = item.children.some(child => location.pathname === child.path);

        return (
            <li className="nav-item">
                <button
                    className={`nav-link ${isActive ? 'active' : ''} ${isOpen ? 'expanded' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.label}</span>
                    <i className="fas fa-chevron-down chevron"></i>
                </button>
                <ul className={`submenu ${isOpen ? 'open' : ''}`}>
                    {item.children.map(child => (
                        <li key={child.path} className="nav-item">
                            <NavLink
                                to={child.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <i className={`fas ${child.icon}`}></i>
                                <span>{child.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </li>
        );
    }

    return (
        <li className="nav-item">
            <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
                <i className={`fas ${item.icon}`}></i>
                <span>{item.label}</span>
            </NavLink>
        </li>
    );
}

export function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
            <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h1>PEC</h1>
                    <small>Prontuário Eletrônico do Cidadão</small>
                </div>

                <div className="sidebar-user">
                    <div className="user-avatar">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="user-name">{user?.name || 'Usuário'}</div>
                    <span className="user-role">{user?.role || 'Visitante'}</span>
                </div>

                <ul className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <MenuItem key={item.path || index} item={item} />
                    ))}
                </ul>

                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        className="nav-link"
                        onClick={logout}
                        style={{ width: '100%' }}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Sair</span>
                    </button>
                </div>
            </nav>
        </>
    );
}

export default Sidebar;
