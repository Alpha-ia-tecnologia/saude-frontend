import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
    Clock,
    Check,
    CheckCircle,
    AlertTriangle,
    Pill,
    Calendar,
    User,
    ClipboardList,
    X,
    Search,
    Filter,
    ChevronRight,
    Timer,
    Syringe,
    Activity,
    FileText,
    XCircle,
    CircleDot,
    Save,
    History,
    Stethoscope,
} from 'lucide-react';

// ── In-memory sample data ──────────────────────────────────────────────

const patientsData = [
    { id: 'P001', nome: 'Maria Silva Santos', leito: 'Enf. A - Leito 12', idade: 68, prontuario: 'PRONT-2025-0012' },
    { id: 'P002', nome: 'José Carlos Oliveira', leito: 'Enf. B - Leito 04', idade: 55, prontuario: 'PRONT-2025-0034' },
    { id: 'P003', nome: 'Ana Paula Ferreira', leito: 'UTI - Leito 02', idade: 42, prontuario: 'PRONT-2025-0056' },
    { id: 'P004', nome: 'Pedro Henrique Lima', leito: 'Enf. A - Leito 08', idade: 73, prontuario: 'PRONT-2025-0078' },
];

const prescriptionsData = [
    { id: 'RX001', patientId: 'P001', medicamento: 'Dipirona 500mg', dose: '1 comprimido', via: 'VO', frequencia: '6/6h', intervalHours: 6, prescritor: 'Dr. Carlos Oliveira' },
    { id: 'RX002', patientId: 'P001', medicamento: 'Losartana 50mg', dose: '1 comprimido', via: 'VO', frequencia: '12/12h', intervalHours: 12, prescritor: 'Dr. Carlos Oliveira' },
    { id: 'RX003', patientId: 'P001', medicamento: 'Insulina NPH 10UI', dose: '10 unidades', via: 'SC', frequencia: '12/12h', intervalHours: 12, prescritor: 'Dr. Carlos Oliveira' },
    { id: 'RX004', patientId: 'P002', medicamento: 'Ceftriaxona 1g', dose: '1g diluído em 100ml SF', via: 'EV', frequencia: '12/12h', intervalHours: 12, prescritor: 'Dra. Ana Santos' },
    { id: 'RX005', patientId: 'P002', medicamento: 'Omeprazol 40mg', dose: '1 comprimido', via: 'VO', frequencia: '1x/dia', intervalHours: 24, prescritor: 'Dra. Ana Santos' },
    { id: 'RX006', patientId: 'P003', medicamento: 'Noradrenalina 8mg/4ml', dose: '0,1 mcg/kg/min', via: 'EV BIC', frequencia: 'contínuo', intervalHours: 0, prescritor: 'Dr. Paulo Lima' },
    { id: 'RX007', patientId: 'P003', medicamento: 'Enoxaparina 40mg', dose: '40mg', via: 'SC', frequencia: '1x/dia', intervalHours: 24, prescritor: 'Dr. Paulo Lima' },
    { id: 'RX008', patientId: 'P003', medicamento: 'Dipirona 1g EV', dose: '2ml diluído em 18ml AD', via: 'EV', frequencia: '6/6h', intervalHours: 6, prescritor: 'Dr. Paulo Lima' },
    { id: 'RX009', patientId: 'P004', medicamento: 'Atenolol 50mg', dose: '1 comprimido', via: 'VO', frequencia: '1x/dia', intervalHours: 24, prescritor: 'Dr. Carlos Oliveira' },
    { id: 'RX010', patientId: 'P004', medicamento: 'Metformina 850mg', dose: '1 comprimido', via: 'VO', frequencia: '8/8h', intervalHours: 8, prescritor: 'Dr. Carlos Oliveira' },
    { id: 'RX011', patientId: 'P004', medicamento: 'Furosemida 40mg', dose: '1 comprimido', via: 'VO', frequencia: '12/12h', intervalHours: 12, prescritor: 'Dr. Carlos Oliveira' },
];

const initialSchedules = [
    { id: 'S001', prescriptionId: 'RX001', patientId: 'P001', medicamento: 'Dipirona 500mg', dose: '1 comprimido', via: 'VO', horarios: ['00:00', '06:00', '12:00', '18:00'], criadoPor: 'Enf. Carla Dias' },
    { id: 'S002', prescriptionId: 'RX002', patientId: 'P001', medicamento: 'Losartana 50mg', dose: '1 comprimido', via: 'VO', horarios: ['08:00', '20:00'], criadoPor: 'Enf. Carla Dias' },
    { id: 'S003', prescriptionId: 'RX003', patientId: 'P001', medicamento: 'Insulina NPH 10UI', dose: '10 unidades', via: 'SC', horarios: ['07:00', '19:00'], criadoPor: 'Enf. Carla Dias' },
    { id: 'S004', prescriptionId: 'RX004', patientId: 'P002', medicamento: 'Ceftriaxona 1g', dose: '1g diluído em 100ml SF', via: 'EV', horarios: ['06:00', '18:00'], criadoPor: 'Enf. Roberto Alves' },
    { id: 'S005', prescriptionId: 'RX005', patientId: 'P002', medicamento: 'Omeprazol 40mg', dose: '1 comprimido', via: 'VO', horarios: ['06:00'], criadoPor: 'Enf. Roberto Alves' },
    { id: 'S006', prescriptionId: 'RX009', patientId: 'P004', medicamento: 'Atenolol 50mg', dose: '1 comprimido', via: 'VO', horarios: ['08:00'], criadoPor: 'Enf. Carla Dias' },
    { id: 'S007', prescriptionId: 'RX010', patientId: 'P004', medicamento: 'Metformina 850mg', dose: '1 comprimido', via: 'VO', horarios: ['06:00', '14:00', '22:00'], criadoPor: 'Enf. Carla Dias' },
    { id: 'S008', prescriptionId: 'RX011', patientId: 'P004', medicamento: 'Furosemida 40mg', dose: '1 comprimido', via: 'VO', horarios: ['08:00', '20:00'], criadoPor: 'Enf. Carla Dias' },
];

const initialChecks = [
    { id: 'C001', scheduleId: 'S001', prescriptionId: 'RX001', patientId: 'P001', medicamento: 'Dipirona 500mg', dose: '1 comprimido', via: 'VO', horarioPrevisto: '06:00', horarioReal: '06:12', data: '2026-03-14', status: 'administrado', responsavel: 'Téc. Enf. Luciana Moraes', observacoes: 'Paciente aceitou bem a medicação.' },
    { id: 'C002', scheduleId: 'S002', prescriptionId: 'RX002', patientId: 'P001', medicamento: 'Losartana 50mg', dose: '1 comprimido', via: 'VO', horarioPrevisto: '08:00', horarioReal: '08:05', data: '2026-03-14', status: 'administrado', responsavel: 'Téc. Enf. Luciana Moraes', observacoes: '' },
    { id: 'C003', scheduleId: 'S003', prescriptionId: 'RX003', patientId: 'P001', medicamento: 'Insulina NPH 10UI', dose: '10 unidades', via: 'SC', horarioPrevisto: '07:00', horarioReal: '07:08', data: '2026-03-14', status: 'administrado', responsavel: 'Enf. Carla Dias', observacoes: 'Glicemia capilar pré: 187 mg/dL. Aplicação em região abdominal.' },
    { id: 'C004', scheduleId: 'S004', prescriptionId: 'RX004', patientId: 'P002', medicamento: 'Ceftriaxona 1g', dose: '1g diluído em 100ml SF', via: 'EV', horarioPrevisto: '06:00', horarioReal: '06:20', data: '2026-03-14', status: 'administrado', responsavel: 'Enf. Roberto Alves', observacoes: 'Infusão em 30 minutos. Sem reações adversas.' },
    { id: 'C005', scheduleId: 'S005', prescriptionId: 'RX005', patientId: 'P002', medicamento: 'Omeprazol 40mg', dose: '1 comprimido', via: 'VO', horarioPrevisto: '06:00', horarioReal: '06:05', data: '2026-03-14', status: 'administrado', responsavel: 'Téc. Enf. Luciana Moraes', observacoes: 'Administrado em jejum.' },
    { id: 'C006', scheduleId: 'S006', prescriptionId: 'RX009', patientId: 'P004', medicamento: 'Atenolol 50mg', dose: '1 comprimido', via: 'VO', horarioPrevisto: '08:00', horarioReal: '08:10', data: '2026-03-14', status: 'administrado', responsavel: 'Téc. Enf. Luciana Moraes', observacoes: 'PA pré: 148x92 mmHg. FC: 78 bpm.' },
    { id: 'C007', scheduleId: 'S007', prescriptionId: 'RX010', patientId: 'P004', medicamento: 'Metformina 850mg', dose: '1 comprimido', via: 'VO', horarioPrevisto: '06:00', horarioReal: '06:15', data: '2026-03-14', status: 'administrado', responsavel: 'Téc. Enf. Luciana Moraes', observacoes: '' },
    { id: 'C008', scheduleId: 'S008', prescriptionId: 'RX011', patientId: 'P004', medicamento: 'Furosemida 40mg', dose: '1 comprimido', via: 'VO', horarioPrevisto: '08:00', horarioReal: '08:12', data: '2026-03-14', status: 'administrado', responsavel: 'Téc. Enf. Luciana Moraes', observacoes: '' },
];

// ── Color mapping for medications in the timeline ──

const medColors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-pink-500',
    'bg-lime-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
];

const medColorsLight = [
    'bg-blue-100 text-blue-800',
    'bg-emerald-100 text-emerald-800',
    'bg-violet-100 text-violet-800',
    'bg-amber-100 text-amber-800',
    'bg-rose-100 text-rose-800',
    'bg-cyan-100 text-cyan-800',
    'bg-pink-100 text-pink-800',
    'bg-lime-100 text-lime-800',
    'bg-indigo-100 text-indigo-800',
    'bg-orange-100 text-orange-800',
    'bg-teal-100 text-teal-800',
];

// ── Helpers ─────────────────────────────────────────────────────────────

const hours24 = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

function generateTimesFromInterval(intervalHours, baseHour = 6) {
    if (intervalHours <= 0) return [];
    const times = [];
    const slotsPerDay = Math.floor(24 / intervalHours);
    for (let i = 0; i < slotsPerDay; i++) {
        const hour = (baseHour + i * intervalHours) % 24;
        times.push(`${String(hour).padStart(2, '0')}:00`);
    }
    times.sort();
    return times;
}

function getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════

export default function AprazamentoChecagem() {
    const [activeTab, setActiveTab] = useState('aprazamento');

    // -- Aprazamento state --
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [schedules, setSchedules] = useState(initialSchedules);
    const [editingSchedules, setEditingSchedules] = useState({});
    const [saveSuccess, setSaveSuccess] = useState(false);

    // -- Checagem state --
    const [checksData, setChecksData] = useState(initialChecks);
    const [showAdminModal, setShowAdminModal] = useState(null);
    const [adminForm, setAdminForm] = useState({ horarioReal: '', responsavel: '', observacoes: '' });
    const [checagemFilter, setChecagemFilter] = useState('todos');

    // -- Historico state --
    const [histFilterPatient, setHistFilterPatient] = useState('');
    const [histFilterDate, setHistFilterDate] = useState('');
    const [histFilterMed, setHistFilterMed] = useState('');

    // ── Aprazamento (Tab 1) ────────────────────────────────────────────

    const selectedPatient = patientsData.find(p => p.id === selectedPatientId);
    const patientPrescriptions = prescriptionsData.filter(p => p.patientId === selectedPatientId);
    const patientSchedules = schedules.filter(s => s.patientId === selectedPatientId);

    function getScheduleForPrescription(rxId) {
        if (editingSchedules[rxId]) return editingSchedules[rxId];
        const existing = patientSchedules.find(s => s.prescriptionId === rxId);
        return existing ? existing.horarios : [];
    }

    function toggleTimeSlot(rxId, time) {
        const current = getScheduleForPrescription(rxId);
        const updated = current.includes(time)
            ? current.filter(t => t !== time)
            : [...current, time].sort();
        setEditingSchedules(prev => ({ ...prev, [rxId]: updated }));
        setSaveSuccess(false);
    }

    function autoFillSchedule(rx) {
        const times = generateTimesFromInterval(rx.intervalHours);
        setEditingSchedules(prev => ({ ...prev, [rx.id]: times }));
        setSaveSuccess(false);
    }

    function saveAllSchedules() {
        const updatedSchedules = [...schedules];

        Object.entries(editingSchedules).forEach(([rxId, horarios]) => {
            const existingIdx = updatedSchedules.findIndex(s => s.prescriptionId === rxId);
            const rx = prescriptionsData.find(p => p.id === rxId);
            if (!rx) return;

            const scheduleObj = {
                id: existingIdx >= 0 ? updatedSchedules[existingIdx].id : `S${String(Date.now()).slice(-5)}`,
                prescriptionId: rxId,
                patientId: selectedPatientId,
                medicamento: rx.medicamento,
                dose: rx.dose,
                via: rx.via,
                horarios,
                criadoPor: 'Enfermeiro(a) Logado',
            };

            if (existingIdx >= 0) {
                updatedSchedules[existingIdx] = scheduleObj;
            } else {
                updatedSchedules.push(scheduleObj);
            }
        });

        setSchedules(updatedSchedules);
        setEditingSchedules({});
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    }

    // ── Checagem (Tab 2) ───────────────────────────────────────────────

    const pendingMedications = useMemo(() => {
        const today = '2026-03-14';
        const pending = [];

        schedules.forEach(schedule => {
            const patient = patientsData.find(p => p.id === schedule.patientId);
            if (!patient) return;

            schedule.horarios.forEach(horario => {
                const alreadyChecked = checksData.some(
                    c => c.scheduleId === schedule.id && c.horarioPrevisto === horario && c.data === today
                );

                let status = 'pendente';
                if (alreadyChecked) {
                    status = 'administrado';
                } else {
                    const [h, m] = horario.split(':').map(Number);
                    const schedMin = h * 60 + m;
                    // Use 14:30 as simulated "current time" for demo purposes
                    const currentMin = 14 * 60 + 30;
                    if (currentMin > schedMin + 30) {
                        status = 'atrasado';
                    }
                }

                pending.push({
                    scheduleId: schedule.id,
                    prescriptionId: schedule.prescriptionId,
                    patientId: schedule.patientId,
                    paciente: patient.nome,
                    leito: patient.leito,
                    medicamento: schedule.medicamento,
                    dose: schedule.dose,
                    via: schedule.via,
                    horarioPrevisto: horario,
                    data: today,
                    status,
                });
            });
        });

        pending.sort((a, b) => a.horarioPrevisto.localeCompare(b.horarioPrevisto));
        return pending;
    }, [schedules, checksData]);

    const filteredPending = checagemFilter === 'todos'
        ? pendingMedications
        : pendingMedications.filter(p => p.status === checagemFilter);

    const summaryStats = useMemo(() => {
        const total = pendingMedications.length;
        const administrados = pendingMedications.filter(p => p.status === 'administrado').length;
        const pendentes = pendingMedications.filter(p => p.status === 'pendente').length;
        const atrasados = pendingMedications.filter(p => p.status === 'atrasado').length;
        return { total, administrados, pendentes, atrasados };
    }, [pendingMedications]);

    function openAdminModal(med) {
        setShowAdminModal(med);
        setAdminForm({
            horarioReal: getCurrentTime(),
            responsavel: '',
            observacoes: '',
        });
    }

    function confirmAdmin() {
        if (!showAdminModal) return;
        const med = showAdminModal;
        const newCheck = {
            id: `C${String(Date.now()).slice(-5)}`,
            scheduleId: med.scheduleId,
            prescriptionId: med.prescriptionId,
            patientId: med.patientId,
            medicamento: med.medicamento,
            dose: med.dose,
            via: med.via,
            horarioPrevisto: med.horarioPrevisto,
            horarioReal: adminForm.horarioReal || getCurrentTime(),
            data: med.data,
            status: 'administrado',
            responsavel: adminForm.responsavel || 'Enfermeiro(a)',
            observacoes: adminForm.observacoes,
        };
        setChecksData(prev => [...prev, newCheck]);
        setShowAdminModal(null);
    }

    // ── Historico (Tab 3) ──────────────────────────────────────────────

    const filteredHistory = useMemo(() => {
        return checksData.filter(c => {
            if (histFilterPatient && c.patientId !== histFilterPatient) return false;
            if (histFilterDate && c.data !== histFilterDate) return false;
            if (histFilterMed && !c.medicamento.toLowerCase().includes(histFilterMed.toLowerCase())) return false;
            return true;
        });
    }, [checksData, histFilterPatient, histFilterDate, histFilterMed]);

    // ── Status badge helper ────────────────────────────────────────────

    function getStatusBadge(status) {
        const config = {
            pendente: { classes: 'bg-amber-100 text-amber-800', label: 'Pendente', Icon: Clock },
            administrado: { classes: 'bg-emerald-100 text-emerald-800', label: 'Administrado', Icon: CheckCircle },
            atrasado: { classes: 'bg-red-100 text-red-800', label: 'Atrasado', Icon: AlertTriangle },
            nao_administrado: { classes: 'bg-gray-100 text-gray-600', label: 'Não administrado', Icon: XCircle },
        };
        const s = config[status] || config.pendente;
        return (
            <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium', s.classes)}>
                <s.Icon className="h-3 w-3" />
                {s.label}
            </span>
        );
    }

    function getPatientName(patientId) {
        return patientsData.find(p => p.id === patientId)?.nome || patientId;
    }

    // ═══════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════

    const tabs = [
        { id: 'aprazamento', label: 'Aprazamento', Icon: Calendar },
        { id: 'checagem', label: 'Checagem de Medicamentos', Icon: CheckCircle },
        { id: 'historico', label: 'Histórico', Icon: History },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Stethoscope className="h-6 w-6 text-primary" />
                    Enfermagem — Aprazamento e Checagem
                </h1>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'inline-flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
                            activeTab === tab.id
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                        )}
                    >
                        <tab.Icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ─── TAB 1: APRAZAMENTO ────────────────────────────────────── */}
            {activeTab === 'aprazamento' && (
                <div className="space-y-6">
                    {/* Patient selector */}
                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="p-5">
                            <h5 className="mb-4 font-semibold flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                Selecionar Paciente
                            </h5>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {patientsData.map(patient => (
                                    <button
                                        key={patient.id}
                                        onClick={() => {
                                            setSelectedPatientId(patient.id);
                                            setEditingSchedules({});
                                            setSaveSuccess(false);
                                        }}
                                        className={cn(
                                            'rounded-lg border p-4 text-left transition-all',
                                            selectedPatientId === patient.id
                                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/50'
                                        )}
                                    >
                                        <p className="font-semibold text-sm">{patient.nome}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{patient.leito}</p>
                                        <p className="text-xs text-muted-foreground">Idade: {patient.idade} anos</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Patient prescriptions and scheduling */}
                    {selectedPatient && (
                        <>
                            {/* Patient info bar */}
                            <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                                <User className="h-5 w-5 text-primary" />
                                <div>
                                    <strong>{selectedPatient.nome}</strong> — {selectedPatient.leito}
                                    <span className="ml-4 text-muted-foreground">Prontuário: {selectedPatient.prontuario}</span>
                                </div>
                            </div>

                            {/* Prescriptions with time selector */}
                            <div className="rounded-xl border border-border bg-card shadow-sm">
                                <div className="border-b border-border px-5 py-3">
                                    <h5 className="font-semibold flex items-center gap-2">
                                        <ClipboardList className="h-4 w-4 text-primary" />
                                        Prescrições Ativas
                                    </h5>
                                </div>
                                <div className="divide-y divide-border">
                                    {patientPrescriptions.length === 0 && (
                                        <div className="p-8 text-center text-muted-foreground">
                                            Nenhuma prescrição ativa para este paciente.
                                        </div>
                                    )}
                                    {patientPrescriptions.map((rx, rxIdx) => {
                                        const currentTimes = getScheduleForPrescription(rx.id);
                                        return (
                                            <div key={rx.id} className="p-5 space-y-4">
                                                {/* Medication info */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <span className={cn('mt-0.5 h-3 w-3 rounded-full shrink-0', medColors[rxIdx % medColors.length])} />
                                                        <div>
                                                            <p className="font-semibold">{rx.medicamento}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {rx.dose} — Via: {rx.via} — Frequência: {rx.frequencia}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">Prescritor: {rx.prescritor}</p>
                                                        </div>
                                                    </div>
                                                    {rx.intervalHours > 0 && (
                                                        <button
                                                            onClick={() => autoFillSchedule(rx)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                                        >
                                                            <Timer className="h-3.5 w-3.5" />
                                                            Sugerir horários
                                                        </button>
                                                    )}
                                                </div>

                                                {/* 24h timeline grid */}
                                                {rx.intervalHours > 0 ? (
                                                    <div>
                                                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                                                            Clique para selecionar/desmarcar horários:
                                                        </p>
                                                        <div className="grid grid-cols-12 gap-1 sm:grid-cols-24">
                                                            {hours24.map(time => {
                                                                const isSelected = currentTimes.includes(time);
                                                                return (
                                                                    <button
                                                                        key={time}
                                                                        onClick={() => toggleTimeSlot(rx.id, time)}
                                                                        className={cn(
                                                                            'flex flex-col items-center justify-center rounded-md border p-1 text-xs transition-all',
                                                                            isSelected
                                                                                ? 'border-primary bg-primary text-white shadow-sm'
                                                                                : 'border-border hover:border-primary/40 hover:bg-muted/50'
                                                                        )}
                                                                        title={time}
                                                                    >
                                                                        <span className="text-[10px] font-medium leading-none">{time.split(':')[0]}</span>
                                                                        <span className="text-[8px] leading-none opacity-70">h</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        {currentTimes.length > 0 && (
                                                            <div className="mt-2 flex flex-wrap gap-1">
                                                                {currentTimes.map(t => (
                                                                    <span key={t} className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium', medColorsLight[rxIdx % medColorsLight.length])}>
                                                                        <Clock className="h-3 w-3" /> {t}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                                        <AlertTriangle className="mr-1 inline h-4 w-4" />
                                                        Medicação de uso contínuo (infusão). Aprazamento não aplicável.
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Save button */}
                                {patientPrescriptions.some(rx => rx.intervalHours > 0) && (
                                    <div className="border-t border-border p-5 flex items-center justify-between">
                                        <div>
                                            {saveSuccess && (
                                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Aprazamento salvo com sucesso!
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={saveAllSchedules}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
                                        >
                                            <Save className="h-4 w-4" />
                                            Salvar Aprazamento
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* 24h Visual Timeline Overview */}
                            {patientSchedules.length > 0 && (
                                <div className="rounded-xl border border-border bg-card shadow-sm">
                                    <div className="border-b border-border px-5 py-3">
                                        <h5 className="font-semibold flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-primary" />
                                            Linha do Tempo — 24 horas
                                        </h5>
                                    </div>
                                    <div className="p-5 overflow-x-auto">
                                        <div className="min-w-[700px]">
                                            {/* Hour headers */}
                                            <div className="flex">
                                                <div className="w-44 shrink-0" />
                                                {hours24.map(h => (
                                                    <div key={h} className="flex-1 text-center text-[10px] font-medium text-muted-foreground">
                                                        {h.split(':')[0]}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Medication rows */}
                                            {patientSchedules.map((sch, idx) => (
                                                <div key={sch.id} className="flex items-center border-t border-border py-2">
                                                    <div className="w-44 shrink-0 pr-3 flex items-center gap-2">
                                                        <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', medColors[idx % medColors.length])} />
                                                        <span className="text-xs font-medium truncate">{sch.medicamento}</span>
                                                    </div>
                                                    {hours24.map(h => {
                                                        const isScheduled = sch.horarios.includes(h);
                                                        return (
                                                            <div key={h} className="flex-1 flex justify-center">
                                                                {isScheduled ? (
                                                                    <span className={cn('h-4 w-4 rounded-full flex items-center justify-center', medColors[idx % medColors.length])}>
                                                                        <Pill className="h-2.5 w-2.5 text-white" />
                                                                    </span>
                                                                ) : (
                                                                    <span className="h-4 w-4" />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {!selectedPatientId && (
                        <div className="rounded-xl border border-border bg-card shadow-sm p-12 text-center">
                            <Pill className="mx-auto h-12 w-12 text-muted-foreground/30" />
                            <p className="mt-4 text-muted-foreground">Selecione um paciente acima para visualizar as prescrições e realizar o aprazamento.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ─── TAB 2: CHECAGEM DE MEDICAMENTOS ──────────────────────── */}
            {activeTab === 'checagem' && (
                <div className="space-y-6">
                    {/* Summary cards */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-primary">
                            <div className="p-4 text-center">
                                <h2 className="text-2xl font-bold text-primary">{summaryStats.total}</h2>
                                <small className="text-muted-foreground">Total Doses</small>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-amber-400">
                            <div className="p-4 text-center">
                                <h2 className="text-2xl font-bold text-amber-500">{summaryStats.pendentes}</h2>
                                <small className="text-muted-foreground">Pendentes</small>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-emerald-500">
                            <div className="p-4 text-center">
                                <h2 className="text-2xl font-bold text-emerald-500">{summaryStats.administrados}</h2>
                                <small className="text-muted-foreground">Administrados</small>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-card shadow-sm border-l-4 border-l-red-500">
                            <div className="p-4 text-center">
                                <h2 className="text-2xl font-bold text-red-500">{summaryStats.atrasados}</h2>
                                <small className="text-muted-foreground">Atrasados</small>
                            </div>
                        </div>
                    </div>

                    {/* Overdue alert */}
                    {summaryStats.atrasados > 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                            <strong className="inline-flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> Atenção:</strong> {summaryStats.atrasados} medicamento(s) atrasado(s) necessitam atenção imediata.
                        </div>
                    )}

                    {/* Filter bar */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground mr-1">Filtrar:</span>
                        {[
                            { val: 'todos', label: 'Todos' },
                            { val: 'pendente', label: 'Pendentes' },
                            { val: 'atrasado', label: 'Atrasados' },
                            { val: 'administrado', label: 'Administrados' },
                        ].map(f => (
                            <button
                                key={f.val}
                                onClick={() => setChecagemFilter(f.val)}
                                className={cn(
                                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                                    checagemFilter === f.val
                                        ? 'bg-primary text-white'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                )}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Medication cards */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {filteredPending.map((med, idx) => (
                            <div
                                key={`${med.scheduleId}-${med.horarioPrevisto}`}
                                className={cn(
                                    'rounded-xl border bg-card shadow-sm transition-all',
                                    med.status === 'atrasado' && 'border-red-300 bg-red-50/30',
                                    med.status === 'administrado' && 'border-emerald-200 bg-emerald-50/30',
                                    med.status === 'pendente' && 'border-amber-200'
                                )}
                            >
                                <div className="p-4 space-y-3">
                                    {/* Top row */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-semibold">{med.paciente}</p>
                                            <p className="text-xs text-muted-foreground">{med.leito}</p>
                                        </div>
                                        {getStatusBadge(med.status)}
                                    </div>

                                    {/* Medication info */}
                                    <div className="rounded-lg bg-muted/50 p-3">
                                        <div className="flex items-center gap-2">
                                            <Pill className="h-4 w-4 text-primary" />
                                            <span className="font-medium text-sm">{med.medicamento}</span>
                                        </div>
                                        <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>Dose: {med.dose}</span>
                                            <span>Via: {med.via}</span>
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{med.horarioPrevisto}</span>
                                        </div>

                                        {med.status === 'administrado' ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                                <CheckCircle className="h-4 w-4" />
                                                Checado
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => openAdminModal(med)}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                                            >
                                                <Syringe className="h-3.5 w-3.5" />
                                                Administrar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredPending.length === 0 && (
                        <div className="rounded-xl border border-border bg-card shadow-sm p-12 text-center">
                            <CheckCircle className="mx-auto h-12 w-12 text-emerald-300" />
                            <p className="mt-4 text-muted-foreground">Nenhuma medicação encontrada para o filtro selecionado.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ─── TAB 3: HISTORICO ──────────────────────────────────────── */}
            {activeTab === 'historico' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="p-5">
                            <h5 className="mb-4 font-semibold flex items-center gap-2">
                                <Filter className="h-4 w-4 text-primary" />
                                Filtros
                            </h5>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Paciente</label>
                                    <select
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={histFilterPatient}
                                        onChange={e => setHistFilterPatient(e.target.value)}
                                    >
                                        <option value="">Todos os pacientes</option>
                                        {patientsData.map(p => (
                                            <option key={p.id} value={p.id}>{p.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Data</label>
                                    <input
                                        type="date"
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={histFilterDate}
                                        onChange={e => setHistFilterDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Medicamento</label>
                                    <input
                                        type="text"
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Buscar medicamento..."
                                        value={histFilterMed}
                                        onChange={e => setHistFilterMed(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History table */}
                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="px-5 pt-4 pb-2">
                            <h5 className="font-semibold flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                Registro de Administrações ({filteredHistory.length})
                            </h5>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-border bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Paciente</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Medicamento</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Dose</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Via</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Horário Previsto</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Horário Real</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Data</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Responsável</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Observações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredHistory.map(check => (
                                        <tr key={check.id}>
                                            <td className="px-4 py-3">
                                                <strong>{getPatientName(check.patientId)}</strong>
                                            </td>
                                            <td className="px-4 py-3 font-medium">{check.medicamento}</td>
                                            <td className="px-4 py-3">{check.dose}</td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{check.via}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1 text-muted-foreground">
                                                    <Clock className="h-3 w-3" /> {check.horarioPrevisto}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                                                    <CheckCircle className="h-3 w-3" /> {check.horarioReal}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{check.data}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1">
                                                    <User className="h-3 w-3 text-muted-foreground" /> {check.responsavel}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 max-w-[200px]">
                                                <span className="text-muted-foreground text-xs">{check.observacoes || '—'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredHistory.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                                                Nenhum registro de administração encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── MODAL: Confirmar Administração ────────────────────────── */}
            {showAdminModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowAdminModal(null)}
                >
                    <div
                        className="rounded-xl border border-border bg-card shadow-sm w-[520px] max-w-[90%]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="border-b border-border bg-emerald-600 px-5 py-3 text-sm font-semibold text-white rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Syringe className="h-4 w-4" />
                                    Confirmar Administração
                                </span>
                                <button
                                    className="rounded-lg bg-white/20 px-2 py-1 text-white hover:bg-white/30"
                                    onClick={() => setShowAdminModal(null)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* Medication info */}
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm space-y-1">
                                <p><strong>Paciente:</strong> {showAdminModal.paciente}</p>
                                <p><strong>Medicamento:</strong> {showAdminModal.medicamento}</p>
                                <p><strong>Dose:</strong> {showAdminModal.dose} — <strong>Via:</strong> {showAdminModal.via}</p>
                                <p><strong>Horário previsto:</strong> {showAdminModal.horarioPrevisto}</p>
                            </div>

                            {/* Form fields */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Horário da Administração</label>
                                <input
                                    type="time"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={adminForm.horarioReal}
                                    onChange={e => setAdminForm(prev => ({ ...prev, horarioReal: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Responsável pela Administração</label>
                                <input
                                    type="text"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Nome do profissional..."
                                    value={adminForm.responsavel}
                                    onChange={e => setAdminForm(prev => ({ ...prev, responsavel: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Observações</label>
                                <textarea
                                    className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    rows="3"
                                    placeholder="Reações, intercorrências, sinais vitais..."
                                    value={adminForm.observacoes}
                                    onChange={e => setAdminForm(prev => ({ ...prev, observacoes: e.target.value }))}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                    onClick={() => setShowAdminModal(null)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                                    onClick={confirmAdmin}
                                >
                                    <Check className="h-4 w-4" />
                                    Confirmar Administração
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
