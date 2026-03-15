import { useState } from 'react';
import {
  Calendar, Bell, ClipboardList, AlertTriangle, MapPin, Users,
  Clock, Plus, X, Search, Send, Eye, Home, Baby, Stethoscope,
  HeartPulse, Activity, Shield, ChevronLeft, ChevronRight,
  CheckCircle, FileText, Thermometer
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Alerts data ─────────────────────────────────────────────────────
const alertsData = [
  { id: 1, tipo: 'prenatal', urgencia: 'urgent', pacienteNome: 'Maria da Silva', familia: 'Silva', microarea: 'MA-001', motivo: 'Gestante faltou ao pré-natal', diasPendentes: 12, status: 'pending' },
  { id: 2, tipo: 'vacina', urgencia: 'urgent', pacienteNome: 'Lucas Almeida', familia: 'Almeida', microarea: 'MA-002', motivo: 'Criança com vacina em atraso (Pentavalente 3a dose)', diasPendentes: 25, status: 'pending' },
  { id: 3, tipo: 'hipertensao', urgencia: 'moderate', pacienteNome: 'José Santos', familia: 'Santos', microarea: 'MA-001', motivo: 'Hipertenso sem aferir PA há 3 meses', diasPendentes: 90, status: 'pending' },
  { id: 4, tipo: 'diabetes', urgencia: 'moderate', pacienteNome: 'Roberto Costa', familia: 'Costa', microarea: 'MA-002', motivo: 'Diabético sem consulta há 6 meses', diasPendentes: 180, status: 'pending' },
  { id: 5, tipo: 'prenatal', urgencia: 'urgent', pacienteNome: 'Clara Nascimento', familia: 'Nascimento', microarea: 'MA-003', motivo: 'Gestante diabética faltou ao pré-natal', diasPendentes: 8, status: 'pending' },
  { id: 6, tipo: 'consulta', urgencia: 'moderate', pacienteNome: 'Tereza Mendes', familia: 'Mendes', microarea: 'MA-004', motivo: 'Idosa hipertensa sem consulta há 4 meses', diasPendentes: 120, status: 'pending' },
  { id: 7, tipo: 'saude_mental', urgencia: 'urgent', pacienteNome: 'Amanda Teixeira', familia: 'Teixeira', microarea: 'MA-004', motivo: 'Puérpera com sinais de depressão pós-parto sem acompanhamento', diasPendentes: 15, status: 'pending' },
  { id: 8, tipo: 'vacina', urgencia: 'urgent', pacienteNome: 'Bebê Teixeira', familia: 'Teixeira', microarea: 'MA-004', motivo: 'RN com vacinas BCG e Hepatite B pendentes', diasPendentes: 30, status: 'pending' },
  { id: 9, tipo: 'tuberculose', urgencia: 'urgent', pacienteNome: 'Carlos Almeida', familia: 'Almeida', microarea: 'MA-002', motivo: 'Paciente com TB faltou à DOTS', diasPendentes: 5, status: 'pending' },
  { id: 10, tipo: 'hipertensao', urgencia: 'moderate', pacienteNome: 'Dona Marta Ferreira', familia: 'Ferreira', microarea: 'MA-002', motivo: 'Hipertensa com PA descontrolada - última aferição 190/110', diasPendentes: 45, status: 'pending' },
  { id: 11, tipo: 'consulta', urgencia: 'moderate', pacienteNome: 'Sebastião Barbosa', familia: 'Barbosa', microarea: 'MA-003', motivo: 'Idoso com DPOC sem consulta há 5 meses', diasPendentes: 150, status: 'pending' },
  { id: 12, tipo: 'prenatal', urgencia: 'urgent', pacienteNome: 'Fernanda Almeida', familia: 'Almeida', microarea: 'MA-002', motivo: 'Gestante não realizou ultrassom do 2o trimestre', diasPendentes: 18, status: 'pending' },
  { id: 13, tipo: 'vacina', urgencia: 'moderate', pacienteNome: 'Sofia Araújo', familia: 'Araújo', microarea: 'MA-003', motivo: 'Criança com reforço da tríplice viral pendente', diasPendentes: 35, status: 'pending' },
];

// ── Visits data ─────────────────────────────────────────────────────
const initialVisits = [
  { id: 1, familiaId: 1, pacienteNome: 'Maria da Silva', endereco: 'Rua das Acácias, 150', tipo: 'Pré-natal', data: '2026-03-17', hora: '08:00', status: 'agendada', motivo: 'Acompanhamento pré-natal 7o mês' },
  { id: 2, familiaId: 3, pacienteNome: 'José Santos', endereco: 'Rua dos Ipês, 45', tipo: 'Rotina', data: '2026-03-17', hora: '09:30', status: 'agendada', motivo: 'Visita semanal - idoso acamado' },
  { id: 3, familiaId: 6, pacienteNome: 'Lucas Almeida', endereco: 'Av. Brasil, 780', tipo: 'Busca ativa', data: '2026-03-17', hora: '10:30', status: 'agendada', motivo: 'Vacina em atraso' },
  { id: 4, familiaId: 6, pacienteNome: 'Carlos Almeida', endereco: 'Av. Brasil, 780', tipo: 'Acompanhamento TB', data: '2026-03-18', hora: '08:00', status: 'agendada', motivo: 'DOTS - medicação supervisionada' },
  { id: 5, familiaId: 9, pacienteNome: 'Clara Nascimento', endereco: 'Rua Industrial, 200', tipo: 'Pré-natal', data: '2026-03-18', hora: '09:00', status: 'agendada', motivo: 'Busca ativa gestante alto risco' },
  { id: 6, familiaId: 11, pacienteNome: 'Sebastião Barbosa', endereco: 'Trav. das Mangueiras, 22', tipo: 'Rotina', data: '2026-03-18', hora: '10:30', status: 'agendada', motivo: 'Acompanhamento DPOC e condições de moradia' },
  { id: 7, familiaId: 15, pacienteNome: 'Amanda Teixeira', endereco: 'Rua da Paz, 55', tipo: 'Puérpera', data: '2026-03-19', hora: '08:00', status: 'agendada', motivo: 'Avaliação puérpera - sinais de depressão' },
  { id: 8, familiaId: 14, pacienteNome: 'Tereza Mendes', endereco: 'Rua XV de Novembro, 250', tipo: 'Rotina', data: '2026-03-19', hora: '09:30', status: 'agendada', motivo: 'Aferição de PA e acompanhamento' },
  { id: 9, familiaId: 5, pacienteNome: 'Roberto Costa', endereco: 'Av. Brasil, 500', tipo: 'Busca ativa', data: '2026-03-20', hora: '08:30', status: 'agendada', motivo: 'Diabético sem consulta - orientação' },
  { id: 10, familiaId: 8, pacienteNome: 'Dona Marta Ferreira', endereco: 'Rua Paraná, 88', tipo: 'Acompanhamento', data: '2026-03-20', hora: '10:00', status: 'agendada', motivo: 'PA descontrolada - monitoramento' },
];

const familyOptions = [
  { id: 1, label: 'Silva - Maria da Silva', endereco: 'Rua das Acácias, 150' },
  { id: 3, label: 'Santos - Ana Santos', endereco: 'Rua dos Ipês, 45' },
  { id: 5, label: 'Costa - Roberto Costa', endereco: 'Av. Brasil, 500' },
  { id: 6, label: 'Almeida - Fernanda Almeida', endereco: 'Av. Brasil, 780' },
  { id: 8, label: 'Ferreira - Dona Marta Ferreira', endereco: 'Rua Paraná, 88' },
  { id: 9, label: 'Nascimento - Clara Nascimento', endereco: 'Rua Industrial, 200' },
  { id: 11, label: 'Barbosa - Sebastião Barbosa', endereco: 'Trav. das Mangueiras, 22' },
  { id: 14, label: 'Mendes - Tereza Mendes', endereco: 'Rua XV de Novembro, 250' },
  { id: 15, label: 'Teixeira - Amanda Teixeira', endereco: 'Rua da Paz, 55' },
];

const visitTypeConfig = {
  'Rotina': { icon: Home, color: 'bg-blue-100 text-blue-700' },
  'Acompanhamento TB': { icon: Stethoscope, color: 'bg-purple-100 text-purple-700' },
  'Puérpera': { icon: Baby, color: 'bg-pink-100 text-pink-700' },
  'Pré-natal': { icon: Baby, color: 'bg-rose-100 text-rose-700' },
  'Busca ativa': { icon: Search, color: 'bg-orange-100 text-orange-700' },
  'Acompanhamento': { icon: HeartPulse, color: 'bg-teal-100 text-teal-700' },
};

const alertTypeLabels = {
  prenatal: 'Pré-natal',
  vacina: 'Vacinação',
  hipertensao: 'Hipertensão',
  diabetes: 'Diabetes',
  consulta: 'Consulta',
  saude_mental: 'Saúde Mental',
  tuberculose: 'Tuberculose',
};

const inputClass = 'h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

export default function VisitasDomiciliares() {
  const [activeTab, setActiveTab] = useState('alertas');
  const [localAlerts, setLocalAlerts] = useState(alertsData);
  const [localVisits, setLocalVisits] = useState(initialVisits);
  const [alertFilterTipo, setAlertFilterTipo] = useState('');
  const [alertFilterUrgencia, setAlertFilterUrgencia] = useState('');
  const [alertFilterMicroarea, setAlertFilterMicroarea] = useState('');
  const [showNewVisitModal, setShowNewVisitModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedAlertForReferral, setSelectedAlertForReferral] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);

  // New visit form
  const [visitForm, setVisitForm] = useState({
    familiaId: '', pacienteNome: '', data: '', hora: '08:00', tipo: 'Rotina', motivo: ''
  });

  // Record visit form
  const [recordForm, setRecordForm] = useState({
    condicaoPaciente: '', observacoes: '', pa: '', temperatura: '', glicemia: '',
    encaminhamento: false, proximaVisita: ''
  });

  // Referral form
  const [referralForm, setReferralForm] = useState({
    destinatario: 'Enfermeiro(a)', prioridade: 'normal', motivo: '', observacoes: ''
  });

  const tabs = [
    { id: 'alertas', label: 'Alertas de Busca Ativa', icon: Bell },
    { id: 'agenda', label: 'Agenda de Visitas', icon: Calendar },
    { id: 'registro', label: 'Registro de Visita', icon: ClipboardList },
  ];

  // ── Filtered alerts ──────────────────────────────────────────────
  const filteredAlerts = localAlerts.filter(a => {
    if (a.status !== 'pending') return false;
    if (alertFilterTipo && a.tipo !== alertFilterTipo) return false;
    if (alertFilterUrgencia && a.urgencia !== alertFilterUrgencia) return false;
    if (alertFilterMicroarea && a.microarea !== alertFilterMicroarea) return false;
    return true;
  }).sort((a, b) => {
    if (a.urgencia === 'urgent' && b.urgencia !== 'urgent') return -1;
    if (a.urgencia !== 'urgent' && b.urgencia === 'urgent') return 1;
    return b.diasPendentes - a.diasPendentes;
  });

  // ── Week calendar logic ──────────────────────────────────────────
  const getWeekDays = () => {
    const today = new Date(2026, 2, 16); // Monday 2026-03-16 as base
    today.setDate(today.getDate() + weekOffset * 7);
    const monday = new Date(today);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };
  const weekDays = getWeekDays();
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getVisitsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return localVisits.filter(v => v.data === dateStr);
  };

  // ── Handlers ──────────────────────────────────────────────────────
  const handleScheduleFromAlert = (alert) => {
    setVisitForm({
      familiaId: '', pacienteNome: alert.pacienteNome,
      data: '', hora: '08:00', tipo: 'Busca ativa', motivo: alert.motivo
    });
    setShowNewVisitModal(true);
  };

  const handleReferralFromAlert = (alert) => {
    setSelectedAlertForReferral(alert);
    setReferralForm({
      destinatario: 'Enfermeiro(a)', prioridade: alert.urgencia === 'urgent' ? 'alta' : 'normal',
      motivo: alert.motivo, observacoes: ''
    });
    setShowReferralModal(true);
  };

  const handleCreateVisit = () => {
    if (!visitForm.data || !visitForm.pacienteNome) {
      alert('Preencha ao menos o paciente e a data.');
      return;
    }
    const fam = familyOptions.find(f => f.id === Number(visitForm.familiaId));
    const newVisit = {
      id: localVisits.length + 100,
      familiaId: Number(visitForm.familiaId) || 0,
      pacienteNome: visitForm.pacienteNome,
      endereco: fam?.endereco || '',
      tipo: visitForm.tipo,
      data: visitForm.data,
      hora: visitForm.hora,
      status: 'agendada',
      motivo: visitForm.motivo
    };
    setLocalVisits(prev => [...prev, newVisit]);
    setShowNewVisitModal(false);
    setVisitForm({ familiaId: '', pacienteNome: '', data: '', hora: '08:00', tipo: 'Rotina', motivo: '' });
  };

  const handleOpenRecord = (visit) => {
    setSelectedVisit(visit);
    setRecordForm({ condicaoPaciente: '', observacoes: '', pa: '', temperatura: '', glicemia: '', encaminhamento: false, proximaVisita: '' });
    setShowRecordModal(true);
  };

  const handleRecordVisit = () => {
    if (!selectedVisit) return;
    setLocalVisits(prev => prev.map(v =>
      v.id === selectedVisit.id ? { ...v, status: 'realizada', ...recordForm } : v
    ));
    setShowRecordModal(false);
    setSelectedVisit(null);
  };

  const handleSendReferral = () => {
    if (selectedAlertForReferral) {
      setLocalAlerts(prev => prev.map(a =>
        a.id === selectedAlertForReferral.id ? { ...a, status: 'referred' } : a
      ));
    }
    setShowReferralModal(false);
    setSelectedAlertForReferral(null);
    alert('Encaminhamento enviado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Home className="size-6 text-primary" />
          Visitas Domiciliares
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            <Bell className="size-3.5" /> {localAlerts.filter(a => a.status === 'pending' && a.urgencia === 'urgent').length} urgentes
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            <AlertTriangle className="size-3.5" /> {localAlerts.filter(a => a.status === 'pending').length} pendentes
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              )}>
              <tab.icon className="size-4" /> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Tab 1: Alertas de Busca Ativa (RF28) ──────────────── */}
      {activeTab === 'alertas' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Search className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filtros:</span>
            </div>
            <select className={cn(inputClass, 'w-40')} value={alertFilterTipo}
              onChange={(e) => setAlertFilterTipo(e.target.value)}>
              <option value="">Todos os tipos</option>
              <option value="prenatal">Pré-natal</option>
              <option value="vacina">Vacinação</option>
              <option value="hipertensao">Hipertensão</option>
              <option value="diabetes">Diabetes</option>
              <option value="saude_mental">Saúde Mental</option>
              <option value="tuberculose">Tuberculose</option>
              <option value="consulta">Consulta</option>
            </select>
            <select className={cn(inputClass, 'w-36')} value={alertFilterUrgencia}
              onChange={(e) => setAlertFilterUrgencia(e.target.value)}>
              <option value="">Todas urgências</option>
              <option value="urgent">Urgente</option>
              <option value="moderate">Moderado</option>
            </select>
            <select className={cn(inputClass, 'w-36')} value={alertFilterMicroarea}
              onChange={(e) => setAlertFilterMicroarea(e.target.value)}>
              <option value="">Todas microáreas</option>
              <option value="MA-001">MA-001</option>
              <option value="MA-002">MA-002</option>
              <option value="MA-003">MA-003</option>
              <option value="MA-004">MA-004</option>
            </select>
          </div>

          {/* Alert cards */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {filteredAlerts.map(al => (
              <div key={al.id}
                className={cn(
                  'rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md',
                  al.urgencia === 'urgent' ? 'border-red-200 border-l-4 border-l-red-500' : 'border-amber-200 border-l-4 border-l-amber-400'
                )}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-full',
                      al.urgencia === 'urgent' ? 'bg-red-100' : 'bg-amber-100'
                    )}>
                      <AlertTriangle className={cn('size-4', al.urgencia === 'urgent' ? 'text-red-600' : 'text-amber-600')} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{al.pacienteNome}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Família {al.familia} | {al.microarea}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    al.urgencia === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    {al.urgencia === 'urgent' ? 'Urgente' : 'Moderado'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground">{al.motivo}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {al.diasPendentes} dias pendentes
                  </span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium">
                    {alertTypeLabels[al.tipo] || al.tipo}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleScheduleFromAlert(al)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
                    <Calendar className="size-3" /> Agendar Visita
                  </button>
                  <button onClick={() => handleReferralFromAlert(al)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
                    <Send className="size-3" /> Encaminhar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <CheckCircle className="size-12 text-emerald-300" />
              <p className="mt-3 text-sm">Nenhum alerta pendente com os filtros selecionados.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 2: Agenda de Visitas (RF29) ───────────────────── */}
      {activeTab === 'agenda' && (
        <div className="space-y-4">
          {/* Week header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekOffset(w => w - 1)}
                className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted">
                <ChevronLeft className="size-4" />
              </button>
              <h2 className="text-sm font-semibold text-foreground">
                {weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </h2>
              <button onClick={() => setWeekOffset(w => w + 1)}
                className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted">
                <ChevronRight className="size-4" />
              </button>
              <button onClick={() => setWeekOffset(0)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
                Hoje
              </button>
            </div>
            <button onClick={() => { setVisitForm({ familiaId: '', pacienteNome: '', data: '', hora: '08:00', tipo: 'Rotina', motivo: '' }); setShowNewVisitModal(true); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
              <Plus className="size-4" /> Nova Visita
            </button>
          </div>

          {/* Weekly calendar */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, idx) => {
              const dayVisits = getVisitsForDay(day);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              return (
                <div key={idx} className={cn('rounded-xl border bg-card min-h-[180px]', isWeekend ? 'border-border/50 bg-muted/30' : 'border-border')}>
                  <div className={cn('border-b px-2 py-2 text-center', isWeekend ? 'border-border/50' : 'border-border')}>
                    <p className="text-[10px] font-medium text-muted-foreground">{dayNames[day.getDay()]}</p>
                    <p className="text-sm font-bold text-foreground">{day.getDate()}</p>
                  </div>
                  <div className="space-y-1 p-1.5">
                    {dayVisits.map(v => {
                      const vtc = visitTypeConfig[v.tipo] || visitTypeConfig['Rotina'];
                      const VIcon = vtc.icon;
                      return (
                        <button key={v.id} onClick={() => handleOpenRecord(v)}
                          className={cn(
                            'w-full rounded-lg border p-1.5 text-left text-[10px] transition-colors hover:bg-muted/50',
                            v.status === 'realizada' ? 'border-emerald-200 bg-emerald-50/50' : 'border-border'
                          )}>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-foreground">{v.hora}</span>
                            {v.status === 'realizada' && <CheckCircle className="size-2.5 text-emerald-500" />}
                          </div>
                          <p className="mt-0.5 truncate font-medium text-foreground">{v.pacienteNome}</p>
                          <span className={cn('mt-0.5 inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[8px] font-medium', vtc.color)}>
                            <VIcon className="size-2.5" /> {v.tipo}
                          </span>
                        </button>
                      );
                    })}
                    {dayVisits.length === 0 && !isWeekend && (
                      <p className="py-4 text-center text-[10px] text-muted-foreground/50">Sem visitas</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visit list (detail) */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground">
              Visitas da Semana
            </div>
            <div className="divide-y divide-border">
              {weekDays.flatMap(day => getVisitsForDay(day)).map(v => {
                const vtc = visitTypeConfig[v.tipo] || visitTypeConfig['Rotina'];
                const VIcon = vtc.icon;
                return (
                  <div key={v.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex size-8 items-center justify-center rounded-full', vtc.color)}>
                        <VIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{v.pacienteNome}</p>
                        <p className="text-xs text-muted-foreground">{v.endereco}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', vtc.color)}>{v.tipo}</span>
                      <span className="text-xs text-muted-foreground">{v.data} {v.hora}</span>
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        v.status === 'realizada' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      )}>
                        {v.status === 'realizada' ? 'Realizada' : 'Agendada'}
                      </span>
                      <button onClick={() => handleOpenRecord(v)}
                        className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted">
                        <Eye className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {weekDays.flatMap(day => getVisitsForDay(day)).length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">Nenhuma visita nesta semana.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Registro de Visita ─────────────────────────── */}
      {activeTab === 'registro' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground flex items-center gap-2">
              <ClipboardList className="size-4" /> Registrar Visita Domiciliar
            </div>
            <div className="p-5 space-y-5">
              {/* Select visit */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">Selecionar visita agendada</label>
                <select className={inputClass}
                  value={selectedVisit?.id || ''}
                  onChange={(e) => {
                    const v = localVisits.find(v => v.id === Number(e.target.value));
                    setSelectedVisit(v || null);
                    setRecordForm({ condicaoPaciente: '', observacoes: '', pa: '', temperatura: '', glicemia: '', encaminhamento: false, proximaVisita: '' });
                  }}>
                  <option value="">Selecione uma visita...</option>
                  {localVisits.filter(v => v.status === 'agendada').map(v => (
                    <option key={v.id} value={v.id}>{v.data} {v.hora} - {v.pacienteNome} ({v.tipo})</option>
                  ))}
                </select>
              </div>

              {selectedVisit && (
                <>
                  {/* Visit info */}
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <p><span className="font-medium text-foreground">Paciente:</span> {selectedVisit.pacienteNome}</p>
                      <p><span className="font-medium text-foreground">Endereço:</span> {selectedVisit.endereco}</p>
                      <p><span className="font-medium text-foreground">Tipo:</span> {selectedVisit.tipo}</p>
                      <p><span className="font-medium text-foreground">Motivo:</span> {selectedVisit.motivo}</p>
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Condição do paciente</label>
                    <select className={inputClass} value={recordForm.condicaoPaciente}
                      onChange={(e) => setRecordForm(p => ({ ...p, condicaoPaciente: e.target.value }))}>
                      <option value="">Selecione...</option>
                      <option value="Estável">Estável</option>
                      <option value="Melhora">Melhora</option>
                      <option value="Piora">Piora</option>
                      <option value="Sem alteração">Sem alteração</option>
                      <option value="Ausente">Paciente ausente</option>
                    </select>
                  </div>

                  {/* Vitals */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium flex items-center gap-1.5">
                      <Thermometer className="size-4 text-primary" /> Sinais Vitais Aferidos
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">PA (mmHg)</label>
                        <input className={inputClass} placeholder="Ex: 120/80"
                          value={recordForm.pa}
                          onChange={(e) => setRecordForm(p => ({ ...p, pa: e.target.value }))} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Temperatura</label>
                        <input className={inputClass} placeholder="Ex: 36.5"
                          value={recordForm.temperatura}
                          onChange={(e) => setRecordForm(p => ({ ...p, temperatura: e.target.value }))} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Glicemia (mg/dL)</label>
                        <input className={inputClass} placeholder="Ex: 110"
                          value={recordForm.glicemia}
                          onChange={(e) => setRecordForm(p => ({ ...p, glicemia: e.target.value }))} />
                      </div>
                    </div>
                  </div>

                  {/* Observations */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Observações</label>
                    <textarea className={cn(inputClass, 'h-24 py-2')} rows="4"
                      placeholder="Descreva a situação encontrada, orientações realizadas..."
                      value={recordForm.observacoes}
                      onChange={(e) => setRecordForm(p => ({ ...p, observacoes: e.target.value }))} />
                  </div>

                  {/* Next visit */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Próxima visita</label>
                      <input type="date" className={inputClass}
                        value={recordForm.proximaVisita}
                        onChange={(e) => setRecordForm(p => ({ ...p, proximaVisita: e.target.value }))} />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input type="checkbox" className="size-4 rounded border-border text-primary focus:ring-primary"
                          checked={recordForm.encaminhamento}
                          onChange={(e) => setRecordForm(p => ({ ...p, encaminhamento: e.target.checked }))} />
                        Necessita encaminhamento para equipe
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button onClick={handleRecordVisit}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
                      <CheckCircle className="size-4" /> Registrar Visita
                    </button>
                    <button onClick={() => {
                      setReferralForm({
                        destinatario: 'Enfermeiro(a)',
                        prioridade: 'normal',
                        motivo: `Visita domiciliar: ${selectedVisit.pacienteNome} - ${selectedVisit.motivo}`,
                        observacoes: recordForm.observacoes
                      });
                      setSelectedAlertForReferral(null);
                      setShowReferralModal(true);
                    }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100">
                      <Send className="size-4" /> Encaminhar para Equipe (RF30)
                    </button>
                  </div>
                </>
              )}

              {!selectedVisit && (
                <div className="flex flex-col items-center py-8 text-muted-foreground">
                  <FileText className="size-12 text-muted-foreground/30" />
                  <p className="mt-3 text-sm">Selecione uma visita agendada para registrar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Nova Visita ────────────────────────────────── */}
      {showNewVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Plus className="size-5 text-primary" /> Nova Visita
              </h2>
              <button onClick={() => setShowNewVisitModal(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Família</label>
                <select className={inputClass} value={visitForm.familiaId}
                  onChange={(e) => {
                    const fam = familyOptions.find(f => f.id === Number(e.target.value));
                    setVisitForm(p => ({ ...p, familiaId: e.target.value, pacienteNome: fam ? fam.label.split(' - ')[1] : p.pacienteNome }));
                  }}>
                  <option value="">Selecione...</option>
                  {familyOptions.map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Paciente</label>
                <input className={inputClass} value={visitForm.pacienteNome}
                  onChange={(e) => setVisitForm(p => ({ ...p, pacienteNome: e.target.value }))}
                  placeholder="Nome do paciente" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Data</label>
                  <input type="date" className={inputClass} value={visitForm.data}
                    onChange={(e) => setVisitForm(p => ({ ...p, data: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Horário</label>
                  <input type="time" className={inputClass} value={visitForm.hora}
                    onChange={(e) => setVisitForm(p => ({ ...p, hora: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Tipo de visita</label>
                <select className={inputClass} value={visitForm.tipo}
                  onChange={(e) => setVisitForm(p => ({ ...p, tipo: e.target.value }))}>
                  <option value="Rotina">Rotina</option>
                  <option value="Pré-natal">Pré-natal</option>
                  <option value="Puérpera">Puérpera</option>
                  <option value="Busca ativa">Busca ativa</option>
                  <option value="Acompanhamento TB">Acompanhamento TB</option>
                  <option value="Acompanhamento">Acompanhamento</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Motivo</label>
                <textarea className={cn(inputClass, 'h-16 py-2')} rows="2"
                  value={visitForm.motivo}
                  onChange={(e) => setVisitForm(p => ({ ...p, motivo: e.target.value }))}
                  placeholder="Motivo da visita..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
              <button onClick={() => setShowNewVisitModal(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
                Cancelar
              </button>
              <button onClick={handleCreateVisit}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
                Agendar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Registro de Visita (from agenda click) ─────── */}
      {showRecordModal && selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <ClipboardList className="size-5 text-primary" /> Registrar Visita
              </h2>
              <button onClick={() => setShowRecordModal(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5 space-y-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <p><span className="font-medium">Paciente:</span> {selectedVisit.pacienteNome}</p>
                <p><span className="font-medium">Tipo:</span> {selectedVisit.tipo} | <span className="font-medium">Data:</span> {selectedVisit.data} {selectedVisit.hora}</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Condição do paciente</label>
                <select className={inputClass} value={recordForm.condicaoPaciente}
                  onChange={(e) => setRecordForm(p => ({ ...p, condicaoPaciente: e.target.value }))}>
                  <option value="">Selecione...</option>
                  <option value="Estável">Estável</option>
                  <option value="Melhora">Melhora</option>
                  <option value="Piora">Piora</option>
                  <option value="Sem alteração">Sem alteração</option>
                  <option value="Ausente">Paciente ausente</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">PA (mmHg)</label>
                  <input className={inputClass} placeholder="120/80" value={recordForm.pa}
                    onChange={(e) => setRecordForm(p => ({ ...p, pa: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Temperatura</label>
                  <input className={inputClass} placeholder="36.5" value={recordForm.temperatura}
                    onChange={(e) => setRecordForm(p => ({ ...p, temperatura: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Glicemia</label>
                  <input className={inputClass} placeholder="110" value={recordForm.glicemia}
                    onChange={(e) => setRecordForm(p => ({ ...p, glicemia: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Observações</label>
                <textarea className={cn(inputClass, 'h-20 py-2')} rows="3"
                  value={recordForm.observacoes}
                  onChange={(e) => setRecordForm(p => ({ ...p, observacoes: e.target.value }))}
                  placeholder="Observações da visita..." />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Próxima visita</label>
                <input type="date" className={inputClass} value={recordForm.proximaVisita}
                  onChange={(e) => setRecordForm(p => ({ ...p, proximaVisita: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
              <button onClick={() => setShowRecordModal(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
                Cancelar
              </button>
              <button onClick={handleRecordVisit}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Encaminhamento (RF30) ──────────────────────── */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Send className="size-5 text-primary" /> Encaminhar para Equipe
              </h2>
              <button onClick={() => setShowReferralModal(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Destinatário</label>
                <select className={inputClass} value={referralForm.destinatario}
                  onChange={(e) => setReferralForm(p => ({ ...p, destinatario: e.target.value }))}>
                  <option value="Enfermeiro(a)">Enfermeiro(a)</option>
                  <option value="Médico(a)">Médico(a)</option>
                  <option value="Equipe multidisciplinar">Equipe multidisciplinar</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Prioridade</label>
                <select className={inputClass} value={referralForm.prioridade}
                  onChange={(e) => setReferralForm(p => ({ ...p, prioridade: e.target.value }))}>
                  <option value="baixa">Baixa</option>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Motivo</label>
                <textarea className={cn(inputClass, 'h-16 py-2')} rows="2"
                  value={referralForm.motivo}
                  onChange={(e) => setReferralForm(p => ({ ...p, motivo: e.target.value }))}
                  placeholder="Motivo do encaminhamento..." />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Observações</label>
                <textarea className={cn(inputClass, 'h-16 py-2')} rows="2"
                  value={referralForm.observacoes}
                  onChange={(e) => setReferralForm(p => ({ ...p, observacoes: e.target.value }))}
                  placeholder="Informações complementares..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
              <button onClick={() => setShowReferralModal(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
                Cancelar
              </button>
              <button onClick={handleSendReferral}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
                <Send className="size-4" /> Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
