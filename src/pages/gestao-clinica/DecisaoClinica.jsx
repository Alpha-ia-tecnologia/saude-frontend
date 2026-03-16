import { useState } from 'react';
import { clinicalDecisionService } from '../../services/clinical-decision.service';
import {
  Brain, FileOutput, Printer, User, Stethoscope, FlaskConical,
  Pill, Loader2, Search, Info, CheckCircle, AlertTriangle,
  Lightbulb, Star, TrendingUp, UserCog, Eye, ClipboardList,
  Plus, X, Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';

const samplePatient = {
  id: 1, nome: 'Maria Silva Santos', cpf: '123.456.789-00',
  dataNascimento: '1958-05-15', idade: 67, sexo: 'Feminino',
  cns: '898.0001.0002.0003',
  conditions: ['Hipertensão', 'Diabetes Tipo 2', 'Artrite'],
  allergies: ['Penicilina', 'Dipirona'],
  medications: ['Losartana 50mg', 'Metformina 850mg', 'Meloxicam 15mg'],
  ultimaConsulta: '28/03/2025', medicoResponsavel: 'Dr. Carlos Oliveira'
};

const commonSymptoms = [
  { id: 'febre', label: 'Febre' }, { id: 'tosse', label: 'Tosse' },
  { id: 'dor_cabeca', label: 'Dor de cabeça' }, { id: 'dor_abdominal', label: 'Dor abdominal' },
  { id: 'nausea', label: 'Náusea' }, { id: 'fadiga', label: 'Fadiga' },
  { id: 'falta_ar', label: 'Falta de ar' }, { id: 'dor_peito', label: 'Dor no peito' },
  { id: 'tontura', label: 'Tontura' }, { id: 'dor_muscular', label: 'Dor muscular' }
];

const clinicalHistory = [
  { data: '28/03/2025', tipo: 'Consulta', descricao: 'HAS - PA 160/95 mmHg. Ajuste na medicação.', medico: 'Dr. Carlos Oliveira' },
  { data: '15/02/2025', tipo: 'Exame', descricao: 'DM2 - Glicemia jejum 180 mg/dL. Mantida medicação.', medico: 'Dra. Ana Santos' },
  { data: '10/01/2025', tipo: 'Consulta', descricao: 'Artrite - Dor articular mãos/joelhos. Iniciado anti-inflamatório.', medico: 'Dr. Paulo Lima' }
];

const tabItems = [
  { id: 'diagnostico', label: 'Diagnóstico', icon: Stethoscope },
  { id: 'tratamento', label: 'Tratamento', icon: ClipboardList },
  { id: 'exames', label: 'Exames', icon: FlaskConical },
  { id: 'medicamentos', label: 'Medicamentos', icon: Pill },
];

const intensityLevels = [
  { value: 1, label: '1', color: 'bg-green-400' },
  { value: 2, label: '2', color: 'bg-green-500' },
  { value: 3, label: '3', color: 'bg-lime-500' },
  { value: 4, label: '4', color: 'bg-yellow-400' },
  { value: 5, label: '5', color: 'bg-yellow-500' },
  { value: 6, label: '6', color: 'bg-amber-500' },
  { value: 7, label: '7', color: 'bg-orange-500' },
  { value: 8, label: '8', color: 'bg-red-400' },
  { value: 9, label: '9', color: 'bg-red-500' },
  { value: 10, label: '10', color: 'bg-red-700' },
];

function getIntensityLabel(value) {
  if (value <= 3) return 'Leve';
  if (value <= 6) return 'Moderada';
  return 'Severa';
}

function getIntensityColor(value) {
  if (value <= 3) return 'text-green-600';
  if (value <= 6) return 'text-amber-600';
  return 'text-red-600';
}

function IntensityScale({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <Gauge className="size-3.5 shrink-0 text-muted-foreground" />
      <div className="flex gap-0.5">
        {intensityLevels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={cn(
              'size-6 rounded text-[10px] font-bold transition-all',
              value >= level.value
                ? `${level.color} text-white shadow-sm`
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {level.label}
          </button>
        ))}
      </div>
      <span className={cn('ml-1 text-xs font-semibold', getIntensityColor(value))}>
        {getIntensityLabel(value)}
      </span>
    </div>
  );
}

export default function DecisaoClinica() {
  const [activeTab, setActiveTab] = useState('diagnostico');
  // selectedSymptoms: Map of id -> { id, label, intensity, duration, isCustom }
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [symptomText, setSymptomText] = useState('');
  const [newCustomSymptom, setNewCustomSymptom] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const toggleSymptom = (id, label) => {
    setSelectedSymptoms(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = { id, label, intensity: 5, duration: '', isCustom: false };
      }
      return next;
    });
  };

  const updateSymptomIntensity = (id, intensity) => {
    setSelectedSymptoms(prev => ({
      ...prev,
      [id]: { ...prev[id], intensity },
    }));
  };

  const updateSymptomDuration = (id, duration) => {
    setSelectedSymptoms(prev => ({
      ...prev,
      [id]: { ...prev[id], duration },
    }));
  };

  const addCustomSymptom = () => {
    const label = newCustomSymptom.trim();
    if (!label) return;
    const id = 'custom_' + label.toLowerCase().replace(/\s+/g, '_');
    if (selectedSymptoms[id]) {
      setNewCustomSymptom('');
      return;
    }
    setSelectedSymptoms(prev => ({
      ...prev,
      [id]: { id, label, intensity: 5, duration: '', isCustom: true },
    }));
    setNewCustomSymptom('');
  };

  const removeSymptom = (id) => {
    setSelectedSymptoms(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const analyzeSymptoms = async () => {
    const symptomEntries = Object.values(selectedSymptoms);
    if (symptomEntries.length === 0 && !symptomText.trim()) {
      alert('Por favor, selecione ou descreva ao menos um sintoma.');
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSelectedDiagnosis(null);
    setRecommendations(null);
    setAiInsights(null);
    try {
      // Send symptom IDs for the backend analysis
      const allSymptoms = symptomEntries.map(s => s.id.replace('custom_', ''));
      if (symptomText.trim()) {
        allSymptoms.push(...symptomText.toLowerCase().split(/[,;.\n]+/).map(s => s.trim()).filter(s => s.length > 2));
      }
      const result = await clinicalDecisionService.analyzeSymptoms(allSymptoms, {
        age: samplePatient.idade, sex: samplePatient.sexo,
        conditions: samplePatient.conditions, allergies: samplePatient.allergies,
        medications: samplePatient.medications,
        symptomDetails: symptomEntries.map(s => ({
          id: s.id, label: s.label,
          intensity: s.intensity,
          intensityLabel: getIntensityLabel(s.intensity),
          duration: s.duration,
        })),
      });
      setAnalysisResult(result);
      if (result.possibleDiagnoses?.length > 0) loadAIInsights(allSymptoms, result.possibleDiagnoses);
    } catch (error) {
      alert(`Erro ao analisar sintomas: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadAIInsights = async (symptoms, diagnoses) => {
    setIsLoadingInsights(true);
    try {
      const insights = await clinicalDecisionService.getAIInsights(symptoms, {
        age: samplePatient.idade, sex: samplePatient.sexo,
        conditions: samplePatient.conditions, allergies: samplePatient.allergies,
        medications: samplePatient.medications
      }, diagnoses);
      setAiInsights(insights);
    } catch (error) {
      setAiInsights({ insights: [], alerts: [`Erro: ${error.message}`], recommendations: [], aiEnhanced: false, aiError: error.message });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const selectDiagnosis = async (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    try {
      const recs = await clinicalDecisionService.getRecommendations(diagnosis.name);
      setRecommendations(recs);
    } catch (error) {
      setRecommendations({ diagnosis: diagnosis.name, medications: [], exams: [], treatments: [], warnings: [`Erro: ${error.message}`], protocols: [] });
    }
  };

  const inputClass = 'h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Brain className="size-6 text-primary" />
          Apoio à Decisão Clínica
        </h1>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <FileOutput className="size-4" /> Exportar
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <Printer className="size-4" /> Imprimir
          </button>
        </div>
      </div>

      {/* Patient card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-2.5 text-sm font-medium text-white flex items-center gap-2">
          <User className="size-4" /> Paciente Selecionado
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold text-foreground">{samplePatient.nome}</h3>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Cartão SUS:</span> {samplePatient.cns}</p>
              <p><span className="font-medium text-foreground">Nascimento:</span> {new Date(samplePatient.dataNascimento).toLocaleDateString('pt-BR')} ({samplePatient.idade} anos)</p>
              <p><span className="font-medium text-foreground">Sexo:</span> {samplePatient.sexo}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-foreground">Condições:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {samplePatient.conditions.map((c, i) => (
                  <span key={i} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium text-foreground">Alergias:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {samplePatient.allergies.map((a, i) => (
                  <span key={i} className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">{a}</span>
                ))}
              </div>
            </div>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">Última Consulta:</span> {samplePatient.ultimaConsulta}</p>
          </div>
        </div>
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
            </button>
          ))}
        </nav>
      </div>

      {/* Tab: Diagnóstico */}
      {activeTab === 'diagnostico' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Symptoms */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground">
              Sintomas Relatados
            </div>
            <div className="space-y-4 p-5">
              {/* Common symptoms quick select */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">Sintomas comuns</label>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map(s => (
                    <button key={s.id} onClick={() => toggleSymptom(s.id, s.label)}
                      className={cn('rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors',
                        selectedSymptoms[s.id] ? 'bg-primary text-white border-primary' : 'bg-white text-muted-foreground border-border hover:border-primary/40')}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add custom symptom */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">Cadastrar outro sintoma</label>
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    placeholder="Ex: Dor lombar, Visão turva..."
                    value={newCustomSymptom}
                    onChange={(e) => setNewCustomSymptom(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomSymptom()}
                  />
                  <button onClick={addCustomSymptom} type="button"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-white hover:bg-secondary-dark">
                    <Plus className="size-4" /> Adicionar
                  </button>
                </div>
              </div>

              {/* Selected symptoms with individual intensity */}
              {Object.keys(selectedSymptoms).length > 0 && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Sintomas selecionados — intensidade e duração
                  </label>
                  <div className="space-y-3">
                    {Object.values(selectedSymptoms).map(s => (
                      <div key={s.id} className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <button onClick={() => removeSymptom(s.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
                            <X className="size-4" />
                          </button>
                          <span className="text-sm font-semibold text-foreground">
                            {s.label}
                            {s.isCustom && <span className="ml-1 text-[10px] font-normal text-muted-foreground">(personalizado)</span>}
                          </span>
                        </div>
                        <div className="ml-6 space-y-2">
                          <IntensityScale value={s.intensity} onChange={(v) => updateSymptomIntensity(s.id, v)} />
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground shrink-0">Duração:</span>
                            <select
                              className="h-7 rounded border border-border bg-white px-2 text-xs focus:border-primary focus:outline-none"
                              value={s.duration}
                              onChange={(e) => updateSymptomDuration(s.id, e.target.value)}
                            >
                              <option value="">Selecione...</option>
                              <option value="menos_24h">&lt; 24 horas</option>
                              <option value="1_3_dias">1-3 dias</option>
                              <option value="4_7_dias">4-7 dias</option>
                              <option value="1_2_semanas">1-2 semanas</option>
                              <option value="mais_2_semanas">&gt; 2 semanas</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Free text */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">Observações adicionais</label>
                <textarea className={cn(inputClass, 'h-16 py-2')} rows="2" placeholder="Detalhes extras sobre os sintomas..." value={symptomText} onChange={(e) => setSymptomText(e.target.value)} />
              </div>

              <button onClick={analyzeSymptoms} disabled={isAnalyzing}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60">
                {isAnalyzing ? <><Loader2 className="size-4 animate-spin" /> Analisando...</> : <><Search className="size-4" /> Analisar Sintomas</>}
              </button>
            </div>
          </div>

          {/* Diagnoses */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border bg-primary-light px-5 py-3 text-sm font-semibold text-white flex items-center gap-2">
              <Stethoscope className="size-4" /> Diagnósticos Sugeridos
            </div>
            <div className="p-5">
              {!analysisResult ? (
                <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                  <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>Preencha os sintomas e clique em &ldquo;Analisar&rdquo; para obter sugestões.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisResult.possibleDiagnoses.map((d, i) => (
                    <button key={i} onClick={() => selectDiagnosis(d)} className={cn(
                      'w-full rounded-lg border p-4 text-left transition-all',
                      selectedDiagnosis?.name === d.name ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border hover:border-primary/40')}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">{d.name}</h4>
                        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold',
                          d.probability >= 70 ? 'bg-secondary/10 text-secondary-dark' : d.probability >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground')}>
                          {d.probability}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{d.matchingSymptoms} sintoma(s) correspondente(s)</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tratamento */}
      {activeTab === 'tratamento' && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {!selectedDiagnosis ? (
            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              Selecione um diagnóstico na aba anterior para ver opções de tratamento.
            </div>
          ) : (
            <div>
              <h3 className="mb-4 text-lg font-semibold">Tratamento para: <span className="text-primary">{selectedDiagnosis.name}</span></h3>
              {recommendations?.treatments?.length > 0 ? (
                <ul className="space-y-2">
                  {recommendations.treatments.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
                      <CheckCircle className="mt-0.5 size-4 shrink-0 text-secondary" /> {t}
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-muted-foreground">Tratamento padrão conforme protocolo do SUS.</p>}
            </div>
          )}
        </div>
      )}

      {/* Tab: Exames */}
      {activeTab === 'exames' && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {!analysisResult ? (
            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              Analise os sintomas para ver exames recomendados.
            </div>
          ) : (
            <div>
              <h3 className="mb-4 text-lg font-semibold">Exames Recomendados</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {analysisResult.recommendedExams.map((exam, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm">
                    <FlaskConical className="size-4 text-primary" /> {exam}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Medicamentos */}
      {activeTab === 'medicamentos' && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {!selectedDiagnosis ? (
            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              Selecione um diagnóstico para ver medicamentos recomendados.
            </div>
          ) : (
            <div>
              <h3 className="mb-4 text-lg font-semibold">Medicamentos para: <span className="text-primary">{selectedDiagnosis.name}</span></h3>
              {recommendations?.warnings?.length > 0 && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <AlertTriangle className="size-4" /> Alertas
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm text-amber-700">
                    {recommendations.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
              {recommendations?.medications?.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Medicamento</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recommendations.medications.map((med, i) => (
                        <tr key={i} className="hover:bg-muted/50">
                          <td className="flex items-center gap-2 px-4 py-3"><Pill className="size-4 text-accent" /> {med}</td>
                          <td className="px-4 py-3">
                            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5">
                              <ClipboardList className="size-3" /> Prescrever
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-sm text-muted-foreground">Consulte protocolos para prescrição adequada.</p>}
            </div>
          )}
        </div>
      )}

      {/* Clinical History */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground">
          Histórico Clínico Relevante
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Data</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Descrição</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Médico</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clinicalHistory.map((item, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-4 py-3 whitespace-nowrap">{item.data}</td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium',
                      item.tipo === 'Consulta' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-700')}>
                      {item.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.descricao}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.medico}</td>
                  <td className="px-4 py-3">
                    <button className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted">
                      <Eye className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border bg-primary-light px-5 py-3 text-sm font-semibold text-white">
          <Brain className="size-4" /> Insights de IA (DeepSeek)
          {aiInsights?.aiEnhanced && (
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">IA Ativa</span>
          )}
        </div>
        <div className="p-5">
          {isLoadingInsights ? (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Gerando insights com DeepSeek...</p>
            </div>
          ) : aiInsights ? (
            <div className="space-y-3">
              {aiInsights.insights?.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span><span className="font-semibold">Análise:</span> {insight}</span>
                </div>
              ))}
              {aiInsights.alerts?.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span><span className="font-semibold">Alerta:</span> {alert}</span>
                </div>
              ))}
              {aiInsights.recommendations?.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-secondary/20 bg-secondary/5 p-4 text-sm text-secondary-dark">
                  <CheckCircle className="mt-0.5 size-4 shrink-0" />
                  <span><span className="font-semibold">Recomendação:</span> {rec}</span>
                </div>
              ))}

              {aiInsights.aiInsights && (
                <div className="mt-4 rounded-xl border-2 border-primary/30 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white flex items-center gap-2">
                    <Brain className="size-4" /> Análise Avançada DeepSeek
                  </div>
                  <div className="space-y-4 p-5">
                    {aiInsights.aiInsights.analise_integrada && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold flex items-center gap-1.5"><Search className="size-3.5" /> Análise Integrada</h4>
                        <p className="rounded-lg bg-muted p-3 text-sm">{aiInsights.aiInsights.analise_integrada}</p>
                      </div>
                    )}
                    {aiInsights.aiInsights.riscos_identificados?.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-destructive flex items-center gap-1.5"><AlertTriangle className="size-3.5" /> Riscos Identificados</h4>
                        <ul className="list-inside list-disc space-y-1 text-sm text-destructive">{aiInsights.aiInsights.riscos_identificados.map((r, i) => <li key={i}>{r}</li>)}</ul>
                      </div>
                    )}
                    {aiInsights.aiInsights.interacoes_medicamentosas?.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-amber-700 flex items-center gap-1.5"><Pill className="size-3.5" /> Interações Medicamentosas</h4>
                        <ul className="list-inside list-disc space-y-1 text-sm text-amber-700">{aiInsights.aiInsights.interacoes_medicamentosas.map((it, i) => <li key={i}>{it}</li>)}</ul>
                      </div>
                    )}
                    {aiInsights.aiInsights.recomendacoes_personalizadas?.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-secondary-dark flex items-center gap-1.5"><Star className="size-3.5" /> Recomendações Personalizadas</h4>
                        <ul className="list-inside list-disc space-y-1 text-sm text-secondary-dark">{aiInsights.aiInsights.recomendacoes_personalizadas.map((r, i) => <li key={i}>{r}</li>)}</ul>
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {aiInsights.aiInsights.prognostico_estimado && (
                        <div className="rounded-lg bg-primary/5 p-4">
                          <h4 className="mb-1 text-sm font-semibold flex items-center gap-1.5"><TrendingUp className="size-3.5" /> Prognóstico</h4>
                          <p className="text-sm">{aiInsights.aiInsights.prognostico_estimado}</p>
                        </div>
                      )}
                      {aiInsights.aiInsights.necessidade_encaminhamento && (
                        <div className="rounded-lg bg-amber-50 p-4">
                          <h4 className="mb-1 text-sm font-semibold flex items-center gap-1.5"><UserCog className="size-3.5" /> Encaminhamento</h4>
                          <p className="text-sm">{aiInsights.aiInsights.necessidade_encaminhamento}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {aiInsights.aiAnalysis && !aiInsights.aiInsights && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <h4 className="mb-2 text-sm font-semibold flex items-center gap-1.5"><Brain className="size-3.5" /> Análise de IA</h4>
                  <pre className="whitespace-pre-wrap font-sans text-sm">{aiInsights.aiAnalysis}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              Analise os sintomas para gerar insights de IA com DeepSeek.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
