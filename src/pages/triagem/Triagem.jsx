import { useState, useEffect, useCallback } from 'react';
import { triageService } from '../../services/triage.service';
import {
  HeartPulse, Thermometer, Activity, Clock, AlertTriangle, Users,
  Stethoscope, Search, Loader2, Save, ChevronRight, Bell, Phone,
  Eye, RefreshCw, Droplets, Gauge, Wind, Zap, User, ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MANCHESTER_COLORS = {
  RED: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-600', light: 'bg-red-50', lightText: 'text-red-700', ring: 'ring-red-200', label: 'Emergencia', cor: 'Vermelho' },
  ORANGE: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-500', light: 'bg-orange-50', lightText: 'text-orange-700', ring: 'ring-orange-200', label: 'Muito Urgente', cor: 'Laranja' },
  YELLOW: { bg: 'bg-yellow-500', text: 'text-white', border: 'border-yellow-500', light: 'bg-yellow-50', lightText: 'text-yellow-700', ring: 'ring-yellow-200', label: 'Urgente', cor: 'Amarelo' },
  GREEN: { bg: 'bg-green-600', text: 'text-white', border: 'border-green-600', light: 'bg-green-50', lightText: 'text-green-700', ring: 'ring-green-200', label: 'Pouco Urgente', cor: 'Verde' },
  BLUE: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-600', light: 'bg-blue-50', lightText: 'text-blue-700', ring: 'ring-blue-200', label: 'Nao Urgente', cor: 'Azul' },
};

const PAIN_FACES = ['😊', '🙂', '😐', '😕', '😣', '😖', '😫', '😩', '😰', '😱', '🤯'];

const PREDEFINED_SYMPTOMS = [
  { id: 'febre', label: 'Febre' },
  { id: 'tosse', label: 'Tosse' },
  { id: 'dor_cabeca', label: 'Dor de cabeca' },
  { id: 'dor_abdominal', label: 'Dor abdominal' },
  { id: 'nausea', label: 'Nausea' },
  { id: 'vomito', label: 'Vomito' },
  { id: 'diarreia', label: 'Diarreia' },
  { id: 'dispneia', label: 'Dispneia' },
  { id: 'tontura', label: 'Tontura' },
  { id: 'dor_toracica', label: 'Dor toracica' },
  { id: 'dor_muscular', label: 'Dor muscular' },
  { id: 'fadiga', label: 'Fadiga' },
  { id: 'perda_consciencia', label: 'Perda de consciencia' },
  { id: 'convulsao', label: 'Convulsao' },
  { id: 'sangramento', label: 'Sangramento' },
  { id: 'edema', label: 'Edema' },
  { id: 'cianose', label: 'Cianose' },
  { id: 'confusao_mental', label: 'Confusao mental' },
  { id: 'dor_lombar', label: 'Dor lombar' },
  { id: 'erupcao_cutanea', label: 'Erupcao cutanea' },
];

const SAMPLE_PATIENTS = [
  { id: 'PAC-010', nome: 'Carlos Eduardo Martins', idade: 54, cns: '898.0010.0011.0012' },
  { id: 'PAC-011', nome: 'Fernanda Rodrigues', idade: 28, cns: '898.0011.0012.0013' },
  { id: 'PAC-012', nome: 'Jose Antonio da Silva', idade: 73, cns: '898.0012.0013.0014' },
  { id: 'PAC-013', nome: 'Mariana Oliveira Costa', idade: 19, cns: '898.0013.0014.0015' },
  { id: 'PAC-014', nome: 'Raimundo Pereira Neto', idade: 41, cns: '898.0014.0015.0016' },
];

const tabItems = [
  { id: 'registro', label: 'Registro de Triagem', icon: ClipboardList },
  { id: 'fila', label: 'Fila de Atendimento', icon: Users },
  { id: 'alertas', label: 'Alertas Medicos', icon: Bell },
];

function formatWaitTime(registeredAt) {
  const diff = Date.now() - new Date(registeredAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainMin = minutes % 60;
  return `${hours}h ${remainMin}min`;
}

function classifyLocally(vitalSigns, symptoms) {
  const alerts = [];
  let level = 'BLUE';

  if (vitalSigns.temperature >= 39.5) { alerts.push(`Temperatura >= 39.5: ${vitalSigns.temperature}C`); level = 'RED'; }
  if (vitalSigns.oxygenSaturation < 90) { alerts.push(`SpO2 < 90%: ${vitalSigns.oxygenSaturation}%`); level = 'RED'; }
  if (vitalSigns.painLevel >= 9) { alerts.push('Dor nivel >= 9'); level = 'RED'; }
  if (vitalSigns.systolicBP > 200 || vitalSigns.systolicBP < 80) { alerts.push(`PA Sistolica critica: ${vitalSigns.systolicBP} mmHg`); level = 'RED'; }
  if (vitalSigns.heartRate > 140 || vitalSigns.heartRate < 40) { alerts.push(`FC critica: ${vitalSigns.heartRate} bpm`); level = 'RED'; }
  if (symptoms.includes('perda_consciencia') || symptoms.includes('convulsao')) { alerts.push('Sintoma critico presente'); level = 'RED'; }

  if (level !== 'RED') {
    if (vitalSigns.painLevel >= 8) { alerts.push('Dor nivel >= 8'); level = 'ORANGE'; }
    if (vitalSigns.oxygenSaturation >= 90 && vitalSigns.oxygenSaturation < 93) { alerts.push(`SpO2 baixa: ${vitalSigns.oxygenSaturation}%`); level = 'ORANGE'; }
    if (vitalSigns.systolicBP >= 180) { alerts.push(`PA elevada: ${vitalSigns.systolicBP} mmHg`); level = 'ORANGE'; }
    if (symptoms.includes('dor_toracica')) { alerts.push('Dor toracica presente'); level = 'ORANGE'; }
    if (symptoms.includes('confusao_mental')) { alerts.push('Confusao mental'); level = 'ORANGE'; }
  }

  if (level !== 'RED' && level !== 'ORANGE') {
    if (vitalSigns.temperature >= 38.5) { alerts.push(`Febre alta: ${vitalSigns.temperature}C`); level = 'YELLOW'; }
    if (vitalSigns.painLevel >= 5) { alerts.push(`Dor moderada: ${vitalSigns.painLevel}`); level = 'YELLOW'; }
    if (vitalSigns.systolicBP >= 160) { alerts.push(`PA elevada: ${vitalSigns.systolicBP} mmHg`); level = 'YELLOW'; }
    if (vitalSigns.heartRate > 100) { alerts.push(`FC elevada: ${vitalSigns.heartRate} bpm`); level = 'YELLOW'; }
    if (symptoms.includes('dispneia')) { alerts.push('Dispneia presente'); level = 'YELLOW'; }
    if (symptoms.includes('sangramento')) { alerts.push('Sangramento'); level = 'YELLOW'; }
  }

  if (level !== 'RED' && level !== 'ORANGE' && level !== 'YELLOW') {
    if (vitalSigns.temperature >= 37.5) { alerts.push(`Febre leve: ${vitalSigns.temperature}C`); level = 'GREEN'; }
    if (vitalSigns.painLevel >= 3) { alerts.push(`Dor leve: ${vitalSigns.painLevel}`); level = 'GREEN'; }
    if (symptoms.length >= 3) { alerts.push('Multiplos sintomas'); level = 'GREEN'; }
  }

  return { level, alerts, colors: MANCHESTER_COLORS[level] };
}

export default function Triagem() {
  const [activeTab, setActiveTab] = useState('registro');

  // Registration form state
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '',
    systolicBP: '',
    diastolicBP: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    painLevel: 0,
    bloodGlucose: '',
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [mainComplaint, setMainComplaint] = useState('');
  const [previewClassification, setPreviewClassification] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Queue state
  const [queue, setQueue] = useState([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const [selectedTriageDetail, setSelectedTriageDetail] = useState(null);

  // Alerts state
  const [alerts, setAlerts] = useState([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);

  const inputClass = 'h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

  // Filter patients by search
  const filteredPatients = SAMPLE_PATIENTS.filter(p =>
    p.nome.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.cns.includes(patientSearch)
  );

  // Auto-classify whenever vital signs or symptoms change
  useEffect(() => {
    const vs = {
      temperature: parseFloat(vitalSigns.temperature) || 36.5,
      systolicBP: parseInt(vitalSigns.systolicBP) || 120,
      diastolicBP: parseInt(vitalSigns.diastolicBP) || 80,
      heartRate: parseInt(vitalSigns.heartRate) || 75,
      respiratoryRate: parseInt(vitalSigns.respiratoryRate) || 16,
      oxygenSaturation: parseInt(vitalSigns.oxygenSaturation) || 98,
      painLevel: vitalSigns.painLevel,
      bloodGlucose: parseInt(vitalSigns.bloodGlucose) || 90,
    };

    const hasAnyValue = vitalSigns.temperature || vitalSigns.systolicBP || vitalSigns.heartRate || vitalSigns.oxygenSaturation || vitalSigns.painLevel > 0 || selectedSymptoms.length > 0;

    if (hasAnyValue) {
      setPreviewClassification(classifyLocally(vs, selectedSymptoms));
    } else {
      setPreviewClassification(null);
    }
  }, [vitalSigns, selectedSymptoms]);

  const loadQueue = useCallback(async () => {
    setIsLoadingQueue(true);
    try {
      const data = await triageService.getQueue('waiting');
      setQueue(data);
    } catch {
      // Use empty queue on error
      setQueue([]);
    } finally {
      setIsLoadingQueue(false);
    }
  }, []);

  const loadAlerts = useCallback(async () => {
    setIsLoadingAlerts(true);
    try {
      const data = await triageService.getAlerts();
      setAlerts(data);
    } catch {
      setAlerts([]);
    } finally {
      setIsLoadingAlerts(false);
    }
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'fila') loadQueue();
    if (activeTab === 'alertas') loadAlerts();
  }, [activeTab, loadQueue, loadAlerts]);

  const toggleSymptom = (id) => {
    setSelectedSymptoms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const updateVitalSign = (field, value) => {
    setVitalSigns(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveTriage = async () => {
    if (!selectedPatient) {
      alert('Selecione um paciente antes de registrar a triagem.');
      return;
    }

    if (!vitalSigns.temperature && !vitalSigns.systolicBP && !vitalSigns.heartRate) {
      alert('Preencha ao menos os sinais vitais basicos (temperatura, PA ou FC).');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await triageService.registerTriage({
        patientId: selectedPatient.id,
        patientName: selectedPatient.nome,
        patientAge: selectedPatient.idade,
        patientCNS: selectedPatient.cns,
        vitalSigns: {
          temperature: parseFloat(vitalSigns.temperature) || 36.5,
          systolicBP: parseInt(vitalSigns.systolicBP) || 120,
          diastolicBP: parseInt(vitalSigns.diastolicBP) || 80,
          heartRate: parseInt(vitalSigns.heartRate) || 75,
          respiratoryRate: parseInt(vitalSigns.respiratoryRate) || 16,
          oxygenSaturation: parseInt(vitalSigns.oxygenSaturation) || 98,
          painLevel: vitalSigns.painLevel,
          bloodGlucose: parseInt(vitalSigns.bloodGlucose) || 90,
        },
        symptoms: selectedSymptoms,
        mainComplaint,
        registeredBy: 'Enf. Sistema'
      });

      setSaveSuccess(true);
      // Reset form
      setSelectedPatient(null);
      setPatientSearch('');
      setVitalSigns({ temperature: '', systolicBP: '', diastolicBP: '', heartRate: '', respiratoryRate: '', oxygenSaturation: '', painLevel: 0, bloodGlucose: '' });
      setSelectedSymptoms([]);
      setMainComplaint('');
      setPreviewClassification(null);

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert(`Erro ao salvar triagem: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <HeartPulse className="size-6 text-primary" />
          Triagem - Protocolo de Manchester
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>Ultima atualizacao: {new Date().toLocaleTimeString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Manchester Protocol Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(MANCHESTER_COLORS).map(([code, style]) => (
          <div key={code} className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium', style.bg, style.text)}>
            <span className="size-2 rounded-full bg-white/40" />
            {style.label}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1">
          {tabItems.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              )}>
              <tab.icon className="size-4" /> {tab.label}
              {tab.id === 'alertas' && alerts.length > 0 && (
                <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {alerts.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ==================== TAB 1: REGISTRO DE TRIAGEM ==================== */}
      {activeTab === 'registro' && (
        <div className="space-y-6">
          {/* Success banner */}
          {saveSuccess && (
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <HeartPulse className="size-5 shrink-0" />
              <span className="font-medium">Triagem registrada com sucesso! Paciente adicionado a fila de atendimento.</span>
            </div>
          )}

          {/* Patient Search */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-primary px-5 py-2.5 text-sm font-medium text-white flex items-center gap-2">
              <User className="size-4" /> Selecionar Paciente
            </div>
            <div className="p-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  className={cn(inputClass, 'pl-10')}
                  placeholder="Buscar paciente por nome ou CNS..."
                  value={patientSearch}
                  onChange={(e) => { setPatientSearch(e.target.value); setShowPatientDropdown(true); }}
                  onFocus={() => setShowPatientDropdown(true)}
                />
                {showPatientDropdown && patientSearch.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-white shadow-lg">
                    {filteredPatients.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-muted-foreground">Nenhum paciente encontrado</div>
                    ) : (
                      filteredPatients.map(p => (
                        <button key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(p.nome); setShowPatientDropdown(false); }}
                          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-muted/50 transition-colors">
                          <div>
                            <div className="font-medium text-foreground">{p.nome}</div>
                            <div className="text-xs text-muted-foreground">CNS: {p.cns} | Idade: {p.idade} anos</div>
                          </div>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {selectedPatient && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <User className="size-5 text-primary" />
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">{selectedPatient.nome}</span>
                    <span className="ml-3 text-muted-foreground">CNS: {selectedPatient.cns}</span>
                    <span className="ml-3 text-muted-foreground">{selectedPatient.idade} anos</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Vital Signs Form */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity className="size-4 text-primary" /> Sinais Vitais
              </div>
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                  {/* Temperature */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                      <Thermometer className="size-3.5 text-red-500" /> Temperatura (C)
                    </label>
                    <input type="number" step="0.1" min="34" max="43" className={inputClass}
                      placeholder="36.5" value={vitalSigns.temperature}
                      onChange={(e) => updateVitalSign('temperature', e.target.value)} />
                  </div>
                  {/* Heart Rate */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                      <HeartPulse className="size-3.5 text-red-500" /> FC (bpm)
                    </label>
                    <input type="number" min="30" max="250" className={inputClass}
                      placeholder="75" value={vitalSigns.heartRate}
                      onChange={(e) => updateVitalSign('heartRate', e.target.value)} />
                  </div>
                  {/* Systolic BP */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                      <Gauge className="size-3.5 text-blue-600" /> PA Sistolica (mmHg)
                    </label>
                    <input type="number" min="50" max="300" className={inputClass}
                      placeholder="120" value={vitalSigns.systolicBP}
                      onChange={(e) => updateVitalSign('systolicBP', e.target.value)} />
                  </div>
                  {/* Diastolic BP */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                      <Gauge className="size-3.5 text-blue-600" /> PA Diastolica (mmHg)
                    </label>
                    <input type="number" min="30" max="200" className={inputClass}
                      placeholder="80" value={vitalSigns.diastolicBP}
                      onChange={(e) => updateVitalSign('diastolicBP', e.target.value)} />
                  </div>
                  {/* Respiratory Rate */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                      <Wind className="size-3.5 text-cyan-600" /> FR (irpm)
                    </label>
                    <input type="number" min="8" max="60" className={inputClass}
                      placeholder="16" value={vitalSigns.respiratoryRate}
                      onChange={(e) => updateVitalSign('respiratoryRate', e.target.value)} />
                  </div>
                  {/* Oxygen Saturation */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                      <Droplets className="size-3.5 text-blue-500" /> SpO2 (%)
                    </label>
                    <input type="number" min="50" max="100" className={inputClass}
                      placeholder="98" value={vitalSigns.oxygenSaturation}
                      onChange={(e) => updateVitalSign('oxygenSaturation', e.target.value)} />
                  </div>
                  {/* Blood Glucose */}
                  <div className="col-span-2">
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                      <Zap className="size-3.5 text-amber-500" /> Glicemia (mg/dL)
                    </label>
                    <input type="number" min="20" max="600" className={inputClass}
                      placeholder="90" value={vitalSigns.bloodGlucose}
                      onChange={(e) => updateVitalSign('bloodGlucose', e.target.value)} />
                  </div>
                </div>

                {/* Pain Level Slider */}
                <div>
                  <label className="mb-2 flex items-center justify-between text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="size-3.5 text-orange-500" /> Nivel de Dor
                    </span>
                    <span className="text-lg">{PAIN_FACES[vitalSigns.painLevel]} {vitalSigns.painLevel}/10</span>
                  </label>
                  <input
                    type="range" min="0" max="10" step="1"
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-600 accent-primary"
                    value={vitalSigns.painLevel}
                    onChange={(e) => updateVitalSign('painLevel', parseInt(e.target.value))}
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>Sem dor</span>
                    <span>Moderada</span>
                    <span>Insuportavel</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Symptoms Section */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground flex items-center gap-2">
                <Stethoscope className="size-4 text-primary" /> Sintomas
              </div>
              <div className="space-y-4 p-5">
                {/* Symptom Checkboxes Grid */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Sintomas observados</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PREDEFINED_SYMPTOMS.map(s => (
                      <label key={s.id}
                        className={cn(
                          'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                          selectedSymptoms.includes(s.id)
                            ? 'border-primary bg-primary/5 text-primary font-medium'
                            : 'border-border bg-white text-muted-foreground hover:border-primary/40'
                        )}>
                        <input type="checkbox" className="sr-only"
                          checked={selectedSymptoms.includes(s.id)}
                          onChange={() => toggleSymptom(s.id)} />
                        <span className={cn(
                          'flex size-4 shrink-0 items-center justify-center rounded border transition-colors',
                          selectedSymptoms.includes(s.id)
                            ? 'border-primary bg-primary text-white'
                            : 'border-border'
                        )}>
                          {selectedSymptoms.includes(s.id) && (
                            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Main Complaint */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Queixa principal</label>
                  <textarea
                    className={cn(inputClass, 'h-24 py-2')}
                    placeholder="Descreva a queixa principal do paciente..."
                    value={mainComplaint}
                    onChange={(e) => setMainComplaint(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Classification Preview + Save */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground flex items-center gap-2">
              <HeartPulse className="size-4 text-primary" /> Classificacao de Risco
            </div>
            <div className="p-5">
              {previewClassification ? (
                <div className="space-y-4">
                  {/* Classification Band */}
                  <div className={cn('flex items-center justify-between rounded-xl p-5', previewClassification.colors.bg)}>
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
                        <AlertTriangle className="size-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{previewClassification.colors.label}</div>
                        <div className="text-sm text-white/80">Protocolo de Manchester</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white/80">Nivel</div>
                      <div className="text-2xl font-bold text-white">{previewClassification.colors.cor}</div>
                    </div>
                  </div>

                  {/* Alerts */}
                  {previewClassification.alerts.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">Sinais de Alerta Identificados:</h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {previewClassification.alerts.map((alert, i) => (
                          <div key={i} className={cn('flex items-start gap-2 rounded-lg border p-3 text-sm',
                            previewClassification.colors.light, previewClassification.colors.lightText,
                            `border-current/20`
                          )}>
                            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                            {alert}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <button onClick={handleSaveTriage} disabled={isSaving || !selectedPatient}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60">
                    {isSaving ? (
                      <><Loader2 className="size-4 animate-spin" /> Salvando...</>
                    ) : (
                      <><Save className="size-4" /> Registrar Triagem e Adicionar a Fila</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <Activity className="size-12 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Preencha os sinais vitais para visualizar a classificacao de risco automatica.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: FILA DE ATENDIMENTO ==================== */}
      {activeTab === 'fila' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{queue.length}</span> pacientes na fila
            </div>
            <button onClick={loadQueue} disabled={isLoadingQueue}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
              <RefreshCw className={cn('size-4', isLoadingQueue && 'animate-spin')} />
              Atualizar
            </button>
          </div>

          {/* Queue Table */}
          {isLoadingQueue ? (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Carregando fila...</p>
            </div>
          ) : queue.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
              <Users className="mx-auto size-12 text-muted-foreground/30" />
              <p className="mt-3 text-sm text-muted-foreground">Nenhum paciente na fila de atendimento.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Prioridade</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Paciente</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Classificacao</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Sinais de Alerta</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Tempo de Espera</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Acoes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {queue.map((patient, idx) => {
                      const colors = MANCHESTER_COLORS[patient.classification.code] || MANCHESTER_COLORS.BLUE;
                      return (
                        <tr key={patient.id}
                          className={cn(
                            'transition-colors',
                            patient.classification.code === 'RED' && 'bg-red-50/50',
                            patient.classification.code === 'ORANGE' && 'bg-orange-50/30',
                            patient.classification.code === 'YELLOW' && 'bg-yellow-50/30',
                          )}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                              <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', colors.bg, colors.text)}>
                                {colors.cor || patient.classification.code}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-foreground">{patient.patientName}</div>
                              <div className="text-xs text-muted-foreground">
                                {patient.patientAge ? `${patient.patientAge} anos` : ''} {patient.patientCNS ? `| CNS: ${patient.patientCNS}` : ''}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn('rounded-md px-2 py-1 text-xs font-medium', colors.light, colors.lightText)}>
                              {colors.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {patient.alerts.length > 0 ? (
                              <div className="max-w-xs space-y-1">
                                {patient.alerts.slice(0, 2).map((alert, i) => (
                                  <div key={i} className="flex items-start gap-1 text-xs text-muted-foreground">
                                    <AlertTriangle className="mt-0.5 size-3 shrink-0 text-amber-500" />
                                    <span className="line-clamp-1">{alert}</span>
                                  </div>
                                ))}
                                {patient.alerts.length > 2 && (
                                  <span className="text-xs text-muted-foreground">+{patient.alerts.length - 2} mais</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Clock className="size-3.5 text-muted-foreground" />
                              <span className={cn(
                                'font-medium',
                                patient.classification.code === 'RED' ? 'text-red-600' :
                                patient.classification.code === 'ORANGE' ? 'text-orange-600' : 'text-foreground'
                              )}>
                                {formatWaitTime(patient.registeredAt)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => alert(`Chamando paciente: ${patient.patientName}`)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90">
                                <Phone className="size-3" /> Chamar
                              </button>
                              <button
                                onClick={() => setSelectedTriageDetail(selectedTriageDetail?.id === patient.id ? null : patient)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                                <Eye className="size-3" /> Ver Triagem
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Triage Detail Panel */}
          {selectedTriageDetail && (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className={cn('flex items-center justify-between px-5 py-3 text-sm font-semibold text-white',
                MANCHESTER_COLORS[selectedTriageDetail.classification.code]?.bg || 'bg-blue-600')}>
                <span className="flex items-center gap-2">
                  <ClipboardList className="size-4" />
                  Detalhes da Triagem - {selectedTriageDetail.patientName}
                </span>
                <button onClick={() => setSelectedTriageDetail(null)} className="text-white/80 hover:text-white">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-5">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">Temperatura</div>
                    <div className="text-lg font-bold text-foreground">{selectedTriageDetail.vitalSigns.temperature}C</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">Pressao Arterial</div>
                    <div className="text-lg font-bold text-foreground">{selectedTriageDetail.vitalSigns.systolicBP}/{selectedTriageDetail.vitalSigns.diastolicBP} mmHg</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">FC</div>
                    <div className="text-lg font-bold text-foreground">{selectedTriageDetail.vitalSigns.heartRate} bpm</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">SpO2</div>
                    <div className="text-lg font-bold text-foreground">{selectedTriageDetail.vitalSigns.oxygenSaturation}%</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">FR</div>
                    <div className="text-lg font-bold text-foreground">{selectedTriageDetail.vitalSigns.respiratoryRate} irpm</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">Dor</div>
                    <div className="text-lg font-bold text-foreground">{PAIN_FACES[selectedTriageDetail.vitalSigns.painLevel]} {selectedTriageDetail.vitalSigns.painLevel}/10</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">Glicemia</div>
                    <div className="text-lg font-bold text-foreground">{selectedTriageDetail.vitalSigns.bloodGlucose} mg/dL</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">Registrado por</div>
                    <div className="text-sm font-medium text-foreground">{selectedTriageDetail.registeredBy}</div>
                  </div>
                </div>
                {selectedTriageDetail.mainComplaint && (
                  <div className="mt-4 rounded-lg border border-border p-3">
                    <div className="text-xs font-medium text-muted-foreground">Queixa Principal</div>
                    <p className="mt-1 text-sm text-foreground">{selectedTriageDetail.mainComplaint}</p>
                  </div>
                )}
                {selectedTriageDetail.symptoms.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedTriageDetail.symptoms.map((s, i) => {
                      const symptomObj = PREDEFINED_SYMPTOMS.find(ps => ps.id === s);
                      return (
                        <span key={i} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {symptomObj ? symptomObj.label : s}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: ALERTAS MEDICOS ==================== */}
      {activeTab === 'alertas' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-600" />
              <span className="text-sm font-semibold text-foreground">
                {alerts.length} alerta{alerts.length !== 1 ? 's' : ''} ativo{alerts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button onClick={loadAlerts} disabled={isLoadingAlerts}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
              <RefreshCw className={cn('size-4', isLoadingAlerts && 'animate-spin')} />
              Atualizar
            </button>
          </div>

          {isLoadingAlerts ? (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Carregando alertas...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
              <HeartPulse className="mx-auto size-12 text-green-500/50" />
              <p className="mt-3 text-sm font-medium text-foreground">Nenhum alerta critico no momento</p>
              <p className="mt-1 text-xs text-muted-foreground">Todos os pacientes estao dentro dos parametros aceitaveis.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {alerts.map((patient) => {
                const colors = MANCHESTER_COLORS[patient.classification.code] || MANCHESTER_COLORS.ORANGE;
                const isRed = patient.classification.code === 'RED';
                return (
                  <div key={patient.id}
                    className={cn(
                      'rounded-xl border-2 bg-card shadow-sm overflow-hidden transition-all',
                      isRed ? 'border-red-500 animate-pulse' : 'border-orange-400',
                    )}>
                    {/* Card Header */}
                    <div className={cn('flex items-center justify-between px-5 py-3', colors.bg)}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="size-5 text-white" />
                        <span className="text-sm font-bold text-white">{colors.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/80">
                        <Clock className="size-3.5" />
                        Espera: {formatWaitTime(patient.registeredAt)}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4">
                      {/* Patient Info */}
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{patient.patientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.patientAge ? `${patient.patientAge} anos` : ''} {patient.patientCNS ? `| CNS: ${patient.patientCNS}` : ''}
                        </p>
                      </div>

                      {/* Key Vital Signs */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className={cn('rounded-lg p-2 text-center', colors.light)}>
                          <div className="text-[10px] text-muted-foreground">Temp</div>
                          <div className={cn('text-sm font-bold', colors.lightText)}>{patient.vitalSigns.temperature}C</div>
                        </div>
                        <div className={cn('rounded-lg p-2 text-center', colors.light)}>
                          <div className="text-[10px] text-muted-foreground">SpO2</div>
                          <div className={cn('text-sm font-bold', colors.lightText)}>{patient.vitalSigns.oxygenSaturation}%</div>
                        </div>
                        <div className={cn('rounded-lg p-2 text-center', colors.light)}>
                          <div className="text-[10px] text-muted-foreground">PA</div>
                          <div className={cn('text-sm font-bold', colors.lightText)}>
                            {patient.vitalSigns.systolicBP}/{patient.vitalSigns.diastolicBP}
                          </div>
                        </div>
                        <div className={cn('rounded-lg p-2 text-center', colors.light)}>
                          <div className="text-[10px] text-muted-foreground">FC</div>
                          <div className={cn('text-sm font-bold', colors.lightText)}>{patient.vitalSigns.heartRate} bpm</div>
                        </div>
                        <div className={cn('rounded-lg p-2 text-center', colors.light)}>
                          <div className="text-[10px] text-muted-foreground">Dor</div>
                          <div className={cn('text-sm font-bold', colors.lightText)}>
                            {PAIN_FACES[patient.vitalSigns.painLevel]} {patient.vitalSigns.painLevel}
                          </div>
                        </div>
                        <div className={cn('rounded-lg p-2 text-center', colors.light)}>
                          <div className="text-[10px] text-muted-foreground">Glic.</div>
                          <div className={cn('text-sm font-bold', colors.lightText)}>{patient.vitalSigns.bloodGlucose}</div>
                        </div>
                      </div>

                      {/* Alerts List */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-semibold text-foreground">Alertas que acionaram a classificacao:</h4>
                        {patient.alerts.map((alert, i) => (
                          <div key={i} className={cn('flex items-start gap-2 rounded-lg p-2 text-xs',
                            colors.light, colors.lightText)}>
                            <AlertTriangle className="mt-0.5 size-3 shrink-0" />
                            {alert}
                          </div>
                        ))}
                      </div>

                      {/* Main Complaint */}
                      {patient.mainComplaint && (
                        <div className="rounded-lg border border-border bg-muted/50 p-3">
                          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Queixa Principal</div>
                          <p className="mt-1 text-sm text-foreground">{patient.mainComplaint}</p>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() => alert(`Iniciando atendimento de: ${patient.patientName}`)}
                        className={cn(
                          'inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors',
                          isRed ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'
                        )}>
                        <Stethoscope className="size-4" /> Atender Agora
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
