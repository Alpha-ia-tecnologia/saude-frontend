import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/lib/utils';
import {
  Home, LayoutGrid, UserRound, UserPlus, FileHeart,
  Stethoscope, Brain, FileText, HeartPulse, Bot, MessageSquareText,
  Pill, ClipboardList, ArrowLeftRight, Mail,
  BarChart3, Gauge, FileBarChart, TrendingUp,
  DollarSign, Banknote, Plug, ExternalLink,
  UserCog, Users, ListChecks,
  Headset, CalendarCheck, MessageCircle,
  LogOut, ChevronDown, X, Activity,
  Thermometer, Clock, ShieldCheck, Package,
  MessageSquare, Settings, MapPin, Home as HomeIcon,
  Heart, Star, Syringe, Hash, Monitor
} from 'lucide-react';

const iconMap = {
  'fa-home': Home,
  'fa-th-large': LayoutGrid,
  'fa-user-injured': UserRound,
  'fa-user-plus': UserPlus,
  'fa-file-medical': FileHeart,
  'fa-stethoscope': Stethoscope,
  'fa-brain': Brain,
  'fa-file-medical-alt': FileText,
  'fa-heartbeat': HeartPulse,
  'fa-robot': Bot,
  'fa-comment-medical': MessageSquareText,
  'fa-pills': Pill,
  'fa-capsules': Pill,
  'fa-prescription': ClipboardList,
  'fa-comments': MessageCircle,
  'fa-exchange-alt': ArrowLeftRight,
  'fa-envelope': Mail,
  'fa-chart-bar': BarChart3,
  'fa-tachometer-alt': Gauge,
  'fa-file-alt': FileBarChart,
  'fa-chart-line': TrendingUp,
  'fa-dollar-sign': DollarSign,
  'fa-money-bill-alt': Banknote,
  'fa-plug': Plug,
  'fa-external-link-alt': ExternalLink,
  'fa-user-tie': UserCog,
  'fa-users': Users,
  'fa-tasks': ListChecks,
  'fa-headset': Headset,
  'fa-calendar-check': CalendarCheck,
  'fab fa-whatsapp': MessageCircle,
  'fa-thermometer': Thermometer,
  'fa-clock': Clock,
  'fa-shield-check': ShieldCheck,
  'fa-package': Package,
  'fa-message-square': MessageSquare,
  'fa-syringe': Syringe,
  'fa-settings': Settings,
  'fa-map-pin': MapPin,
  'fa-home-icon': HomeIcon,
  'fa-heart': Heart,
  'fa-star': Star,
  'fa-hash': Hash,
  'fa-monitor': Monitor,
};

const menuItems = [
  { path: '/', label: 'Início', icon: 'fa-home' },
  { path: '/funcionalidades', label: 'Funcionalidades', icon: 'fa-th-large' },
  {
    label: 'Pacientes', icon: 'fa-user-injured',
    children: [
      { path: '/pacientes/cadastro', label: 'Cadastro', icon: 'fa-user-plus' },
      { path: '/pacientes/prontuario', label: 'Prontuário', icon: 'fa-file-medical' }
    ]
  },
  {
    label: 'Gestão Clínica', icon: 'fa-stethoscope',
    children: [
      { path: '/gestao-clinica/decisao', label: 'Apoio à Decisão', icon: 'fa-brain' },
      { path: '/gestao-clinica/protocolos', label: 'Protocolos', icon: 'fa-file-medical-alt' },
      { path: '/gestao-clinica/cronicas', label: 'Condições Crônicas', icon: 'fa-heartbeat' }
    ]
  },
  {
    label: 'Assistente IA', icon: 'fa-robot',
    children: [
      { path: '/assistente-ia/chatbot', label: 'Decisões Clínicas', icon: 'fa-comment-medical' }
    ]
  },
  {
    label: 'Triagem', icon: 'fa-thermometer',
    children: [
      { path: '/triagem', label: 'Classificação de Risco', icon: 'fa-thermometer' }
    ]
  },
  {
    label: 'Enfermagem', icon: 'fa-syringe',
    children: [
      { path: '/enfermagem/aprazamento', label: 'Aprazamento e Checagem', icon: 'fa-clock' }
    ]
  },
  {
    label: 'Farmácia', icon: 'fa-pills',
    children: [
      { path: '/farmacia/medicamentos', label: 'Medicamentos', icon: 'fa-capsules' },
      { path: '/farmacia/prescricoes', label: 'Prescrições', icon: 'fa-prescription' },
      { path: '/farmacia/reconciliacao', label: 'Reconciliação', icon: 'fa-shield-check' },
      { path: '/farmacia/estoque', label: 'Estoque e Lotes', icon: 'fa-package' }
    ]
  },
  {
    label: 'Comunicação', icon: 'fa-comments',
    children: [
      { path: '/comunicacao/referencia', label: 'Referência', icon: 'fa-exchange-alt' },
      { path: '/comunicacao/mensagens', label: 'Mensagens', icon: 'fa-envelope' },
      { path: '/comunicacao/chat', label: 'Chat Interno', icon: 'fa-message-square' }
    ]
  },
  {
    label: 'Análise de Dados', icon: 'fa-chart-bar',
    children: [
      { path: '/analise-dados/dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
      { path: '/analise-dados/relatorios', label: 'Relatórios', icon: 'fa-file-alt' },
      { path: '/analise-dados/indicadores', label: 'Indicadores', icon: 'fa-chart-line' }
    ]
  },
  {
    label: 'Financeiro', icon: 'fa-dollar-sign',
    children: [
      { path: '/financeiro/orcamento', label: 'Orçamento', icon: 'fa-money-bill-alt' }
    ]
  },
  {
    label: 'Integração', icon: 'fa-plug',
    children: [
      { path: '/integracao/servicos', label: 'Serviços Externos', icon: 'fa-external-link-alt' }
    ]
  },
  {
    label: 'Gestores', icon: 'fa-user-tie',
    children: [
      { path: '/gestores/dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
      { path: '/gestores/indicadores', label: 'Indicadores', icon: 'fa-chart-line' },
      { path: '/gestores/rh', label: 'Recursos Humanos', icon: 'fa-users' },
      { path: '/gestores/planejamento', label: 'Planejamento', icon: 'fa-tasks' },
      { path: '/gestao/nps', label: 'Pesquisa NPS', icon: 'fa-star' }
    ]
  },
  {
    label: 'ACS', icon: 'fa-map-pin',
    children: [
      { path: '/acs/territorio', label: 'Território e Famílias', icon: 'fa-map-pin' },
      { path: '/acs/visitas', label: 'Visitas Domiciliares', icon: 'fa-home-icon' },
      { path: '/acs/linhas-cuidado', label: 'Linhas de Cuidado', icon: 'fa-heart' }
    ]
  },
  {
    label: 'Atendimento', icon: 'fa-headset',
    children: [
      { path: '/agendamento', label: 'Agendamento', icon: 'fa-calendar-check' },
      { path: '/atendimento/whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp' },
      { path: '/painel/chamada', label: 'Painel de Chamada', icon: 'fa-monitor' }
    ]
  },
  {
    label: 'Administração', icon: 'fa-settings',
    children: [
      { path: '/admin/usuarios', label: 'Usuários e Permissões', icon: 'fa-users' }
    ]
  }
];

function getIcon(iconKey, className = 'size-4') {
  const IconComponent = iconMap[iconKey] || Activity;
  return <IconComponent className={className} />;
}

function MenuItem({ item, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  if (item.children) {
    const isActive = item.children.some(child => location.pathname === child.path);

    return (
      <li>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
            'text-slate-400 hover:bg-white/[0.06] hover:text-white',
            isActive && 'bg-white/[0.08] text-white'
          )}
        >
          {getIcon(item.icon)}
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown className={cn('size-4 transition-transform duration-200', isOpen && 'rotate-180')} />
        </button>
        <ul className={cn(
          'mt-1 space-y-0.5 overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}>
          {item.children.map(child => (
            <li key={child.path}>
              <NavLink
                to={child.path}
                onClick={onNavigate}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 rounded-lg py-1.5 pl-10 pr-3 text-sm transition-colors',
                  'text-slate-500 hover:bg-white/[0.06] hover:text-slate-300',
                  isActive && 'bg-primary/20 text-primary-light font-medium'
                )}
              >
                {getIcon(child.icon, 'size-3.5')}
                <span>{child.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={item.path}
        onClick={onNavigate}
        className={({ isActive }) => cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
          'text-slate-400 hover:bg-white/[0.06] hover:text-white',
          isActive && 'bg-primary/20 text-primary-light font-medium'
        )}
      >
        {getIcon(item.icon)}
        <span>{item.label}</span>
      </NavLink>
    </li>
  );
}

export function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar-bg',
        'transition-transform duration-300 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
              <HeartPulse className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">PEC</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Prontuário Eletrônico</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:text-white lg:hidden">
            <X className="size-5" />
          </button>
        </div>

        {/* User */}
        <div className="border-b border-white/[0.06] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-sm font-semibold text-white">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name || 'Usuário'}</p>
              <span className="inline-block rounded-md bg-primary/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary-light">
                {user?.role || 'Visitante'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <MenuItem key={item.path || index} item={item} onNavigate={onClose} />
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-white/[0.06] px-3 py-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="size-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
