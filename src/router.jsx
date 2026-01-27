import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Funcionalidades from './pages/Funcionalidades';

// Pacientes
import PacientesCadastro from './pages/pacientes/Cadastro';
import Prontuario from './pages/pacientes/Prontuario';

// Gestão Clínica
import DecisaoClinica from './pages/gestao-clinica/DecisaoClinica';
import Protocolos from './pages/gestao-clinica/Protocolos';
import CondicoesCronicas from './pages/gestao-clinica/CondicoesCronicas';

// Assistente IA
import Chatbot from './pages/assistente-ia/Chatbot';

// Farmácia
import Medicamentos from './pages/farmacia/Medicamentos';
import Prescricoes from './pages/farmacia/Prescricoes';

// Comunicação
import Referencia from './pages/comunicacao/Referencia';
import Mensagens from './pages/comunicacao/Mensagens';

// Análise de Dados
import AnaliseDashboard from './pages/analise-dados/Dashboard';
import Relatorios from './pages/analise-dados/Relatorios';
import Indicadores from './pages/analise-dados/Indicadores';

// Financeiro
import Orcamento from './pages/financeiro/Orcamento';

// Integração
import ServicosExternos from './pages/integracao/ServicosExternos';

// Gestores
import GestoresDashboard from './pages/gestores/Dashboard';
import GestoresIndicadores from './pages/gestores/Indicadores';
import RecursosHumanos from './pages/gestores/RecursosHumanos';
import Planejamento from './pages/gestores/Planejamento';

// Agendamento
import Agendamento from './pages/agendamento/Agendamento';

// Atendimento
import AtendimentoWhatsApp from './pages/atendimento/AtendimentoWhatsApp';

// Componente para proteger rotas
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'funcionalidades', element: <Funcionalidades /> },

            // Pacientes
            { path: 'pacientes/cadastro', element: <PacientesCadastro /> },
            { path: 'pacientes/prontuario', element: <Prontuario /> },

            // Gestão Clínica
            { path: 'gestao-clinica/decisao', element: <DecisaoClinica /> },
            { path: 'gestao-clinica/protocolos', element: <Protocolos /> },
            { path: 'gestao-clinica/cronicas', element: <CondicoesCronicas /> },

            // Assistente IA
            { path: 'assistente-ia/chatbot', element: <Chatbot /> },

            // Farmácia
            { path: 'farmacia/medicamentos', element: <Medicamentos /> },
            { path: 'farmacia/prescricoes', element: <Prescricoes /> },

            // Comunicação
            { path: 'comunicacao/referencia', element: <Referencia /> },
            { path: 'comunicacao/mensagens', element: <Mensagens /> },

            // Análise de Dados
            { path: 'analise-dados/dashboard', element: <AnaliseDashboard /> },
            { path: 'analise-dados/relatorios', element: <Relatorios /> },
            { path: 'analise-dados/indicadores', element: <Indicadores /> },

            // Financeiro
            { path: 'financeiro/orcamento', element: <Orcamento /> },

            // Integração
            { path: 'integracao/servicos', element: <ServicosExternos /> },

            // Gestores
            { path: 'gestores/dashboard', element: <GestoresDashboard /> },
            { path: 'gestores/indicadores', element: <GestoresIndicadores /> },
            { path: 'gestores/rh', element: <RecursosHumanos /> },
            { path: 'gestores/planejamento', element: <Planejamento /> },

            // Agendamento
            { path: 'agendamento', element: <Agendamento /> },

            // Atendimento
            { path: 'atendimento/whatsapp', element: <AtendimentoWhatsApp /> }
        ]
    }
]);

export default router;
