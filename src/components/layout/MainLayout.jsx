import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Bell, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const pageTitles = {
  '/': 'Início',
  '/funcionalidades': 'Funcionalidades',
  '/pacientes/cadastro': 'Cadastro de Pacientes',
  '/pacientes/prontuario': 'Prontuário Eletrônico',
  '/gestao-clinica/decisao': 'Apoio à Decisão Clínica',
  '/gestao-clinica/protocolos': 'Protocolos Clínicos',
  '/gestao-clinica/cronicas': 'Condições Crônicas',
  '/assistente-ia/chatbot': 'Assistente IA',
  '/farmacia/medicamentos': 'Medicamentos',
  '/farmacia/prescricoes': 'Prescrições',
  '/comunicacao/referencia': 'Referência e Contra-referência',
  '/comunicacao/mensagens': 'Mensagens',
  '/analise-dados/dashboard': 'Dashboard de Análise',
  '/analise-dados/relatorios': 'Relatórios',
  '/analise-dados/indicadores': 'Indicadores',
  '/financeiro/orcamento': 'Orçamento',
  '/integracao/servicos': 'Serviços Externos',
  '/gestores/dashboard': 'Dashboard Gerencial',
  '/gestores/indicadores': 'Indicadores Gerenciais',
  '/gestores/rh': 'Recursos Humanos',
  '/gestores/planejamento': 'Planejamento Estratégico',
  '/agendamento': 'Agendamento',
  '/atendimento/whatsapp': 'Atendimento WhatsApp',
  '/triagem': 'Triagem e Classificação de Risco',
  '/enfermagem/aprazamento': 'Aprazamento e Checagem de Medicamentos',
  '/farmacia/reconciliacao': 'Reconciliação Medicamentosa',
  '/farmacia/estoque': 'Estoque e Lotes',
  '/gestao/nps': 'Pesquisa de Satisfação - NPS',
  '/admin/usuarios': 'Gestão de Usuários e Permissões',
  '/comunicacao/chat': 'Chat Interno',
  '/acs/territorio': 'Territorialização e Microáreas',
  '/acs/visitas': 'Visitas Domiciliares',
  '/acs/linhas-cuidado': 'Linhas de Cuidado - MACC',
  '/painel/chamada': 'Painel de Chamada de Pacientes',
};

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || '';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-white/80 px-4 backdrop-blur-md sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div className="flex-1">
            {pageTitle && (
              <h2 className="text-sm font-semibold text-foreground">{pageTitle}</h2>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <Search className="size-5" />
            </button>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
          &copy; 2026 PEC - Prontuário Eletrônico do Cidadão &middot; Sistema Único de Saúde
        </footer>
      </div>
    </div>
  );
}

export default MainLayout;
