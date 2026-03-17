import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Bell, Search, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const pageTitles = {
  '/': 'Inicio',
  '/funcionalidades': 'Funcionalidades',
  '/pacientes/cadastro': 'Cadastro de Pacientes',
  '/pacientes/prontuario': 'Prontuario Eletronico',
  '/gestao-clinica/decisao': 'Apoio a Decisao Clinica',
  '/gestao-clinica/protocolos': 'Protocolos Clinicos',
  '/gestao-clinica/cronicas': 'Condicoes Cronicas',
  '/assistente-ia/chatbot': 'Assistente IA',
  '/farmacia/medicamentos': 'Medicamentos',
  '/farmacia/prescricoes': 'Prescricoes',
  '/comunicacao/referencia': 'Referencia e Contra-referencia',
  '/comunicacao/mensagens': 'Mensagens',
  '/analise-dados/dashboard': 'Dashboard de Analise',
  '/analise-dados/relatorios': 'Relatorios',
  '/analise-dados/indicadores': 'Indicadores',
  '/financeiro/orcamento': 'Orcamento',
  '/integracao/servicos': 'Servicos Externos',
  '/gestores/dashboard': 'Dashboard Gerencial',
  '/gestores/indicadores': 'Indicadores Gerenciais',
  '/gestores/rh': 'Recursos Humanos',
  '/gestores/planejamento': 'Planejamento Estrategico',
  '/agendamento': 'Agendamento',
  '/atendimento/whatsapp': 'Atendimento WhatsApp',
  '/triagem': 'Triagem e Classificacao de Risco',
  '/enfermagem/aprazamento': 'Aprazamento e Checagem de Medicamentos',
  '/farmacia/reconciliacao': 'Reconciliacao Medicamentosa',
  '/farmacia/estoque': 'Estoque e Lotes',
  '/gestao/nps': 'Pesquisa de Satisfacao - NPS',
  '/admin/usuarios': 'Gestao de Usuarios e Permissoes',
  '/comunicacao/chat': 'Chat Interno',
  '/acs/territorio': 'Territorializacao e Microareas',
  '/acs/visitas': 'Visitas Domiciliares',
  '/acs/linhas-cuidado': 'Linhas de Cuidado - MACC',
  '/painel/chamada': 'Painel de Chamada de Pacientes',
};

const sampleNotifications = [
  { id: 1, title: 'Novo agendamento', message: 'Paciente Maria Silva agendou consulta para amanha.', time: 'Há 5 min', read: false },
  { id: 2, title: 'Resultado de exame', message: 'Hemograma de Joao Oliveira esta disponivel.', time: 'Há 30 min', read: false },
  { id: 3, title: 'Lembrete de medicacao', message: 'Estoque de Losartana abaixo do minimo.', time: 'Há 2 horas', read: true },
  { id: 4, title: 'Mensagem recebida', message: 'Dr. Roberto enviou uma mensagem no chat.', time: 'Há 4 horas', read: true },
];

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = pageTitles[location.pathname] || '';
  const searchInputRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchOverlayRef = useRef(null);

  // Filter page routes based on search query
  const filteredRoutes = Object.entries(pageTitles).filter(([, title]) =>
    searchQuery.trim() === '' ? true : title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Close search and notifications on route change
  useEffect(() => {
    setShowSearch(false);
    setShowNotifications(false);
    setSearchQuery('');
  }, [location.pathname]);

  const handleSearchNavigate = (path) => {
    navigate(path);
    setShowSearch(false);
    setSearchQuery('');
  };

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
            <button
              onClick={() => { setShowSearch(!showSearch); setShowNotifications(false); }}
              className={cn(
                'relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground',
                showSearch && 'bg-muted text-foreground'
              )}
            >
              <Search className="size-5" />
            </button>
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowSearch(false); }}
                className={cn(
                  'relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground',
                  showNotifications && 'bg-muted text-foreground'
                )}
              >
                <Bell className="size-5" />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-white shadow-lg">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h3 className="text-sm font-semibold text-foreground">Notificacoes</h3>
                    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                      {sampleNotifications.filter(n => !n.read).length} novas
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {sampleNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'border-b border-border px-4 py-3 transition-colors hover:bg-muted/50 cursor-pointer',
                          !notification.read && 'bg-primary/5'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">{notification.title}</p>
                          {!notification.read && (
                            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{notification.message}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground/70">
                          <Clock className="size-3" />
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border px-4 py-2.5 text-center">
                    <button className="text-xs font-medium text-primary hover:underline">
                      Ver todas as notificacoes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Search Overlay */}
        {showSearch && (
          <div
            ref={searchOverlayRef}
            className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 pt-20"
            onClick={(e) => { if (e.target === searchOverlayRef.current) { setShowSearch(false); setSearchQuery(''); } }}
          >
            <div className="mx-4 w-full max-w-lg rounded-xl border border-border bg-white shadow-xl">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="size-5 shrink-0 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar paginas..."
                  className="h-8 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto py-2">
                {filteredRoutes.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">Nenhuma pagina encontrada.</p>
                ) : (
                  filteredRoutes.map(([path, title]) => (
                    <button
                      key={path}
                      onClick={() => handleSearchNavigate(path)}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted',
                        location.pathname === path ? 'bg-primary/5 text-primary font-medium' : 'text-foreground'
                      )}
                    >
                      <span className="flex-1">{title}</span>
                      <span className="text-xs text-muted-foreground">{path}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
          &copy; 2026 PEC - Prontuario Eletronico do Cidadao &middot; Sistema Unico de Saude
        </footer>
      </div>
    </div>
  );
}

export default MainLayout;
