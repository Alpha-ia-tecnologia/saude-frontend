import { useState, useEffect } from 'react';
import { clinicalDecisionService } from '../../services/clinical-decision.service';

// Sample patient data for demonstration
const samplePatient = {
    id: 1,
    nome: 'Maria Silva Santos',
    cpf: '123.456.789-00',
    dataNascimento: '1958-05-15',
    idade: 67,
    sexo: 'Feminino',
    cns: '898.0001.0002.0003',
    conditions: ['Hipertensão', 'Diabetes Tipo 2', 'Artrite'],
    allergies: ['Penicilina', 'Dipirona'],
    medications: ['Losartana 50mg', 'Metformina 850mg', 'Meloxicam 15mg'],
    ultimaConsulta: '28/03/2025',
    medicoResponsavel: 'Dr. Carlos Oliveira'
};

const commonSymptoms = [
    { id: 'febre', label: 'Febre' },
    { id: 'tosse', label: 'Tosse' },
    { id: 'dor_cabeca', label: 'Dor de cabeça' },
    { id: 'dor_abdominal', label: 'Dor abdominal' },
    { id: 'nausea', label: 'Náusea' },
    { id: 'fadiga', label: 'Fadiga' },
    { id: 'falta_ar', label: 'Falta de ar' },
    { id: 'dor_peito', label: 'Dor no peito' },
    { id: 'tontura', label: 'Tontura' },
    { id: 'dor_muscular', label: 'Dor muscular' }
];

const clinicalHistory = [
    { data: '28/03/2025', tipo: 'Consulta', descricao: 'Hipertensão Arterial Sistêmica - Pressão arterial 160/95 mmHg. Ajuste na medicação.', medico: 'Dr. Carlos Oliveira' },
    { data: '15/02/2025', tipo: 'Exame', descricao: 'Diabetes Mellitus Tipo 2 - Glicemia em jejum 180 mg/dL. Mantida medicação.', medico: 'Dra. Ana Santos' },
    { data: '10/01/2025', tipo: 'Consulta', descricao: 'Artrite Reumatoide - Dor articular em mãos e joelhos. Iniciado anti-inflamatório.', medico: 'Dr. Paulo Lima' }
];

export default function DecisaoClinica() {
    const [activeTab, setActiveTab] = useState('diagnostico');
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [symptomText, setSymptomText] = useState('');
    const [duration, setDuration] = useState('');
    const [intensity, setIntensity] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [aiInsights, setAiInsights] = useState(null);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);

    const tabs = [
        { id: 'diagnostico', label: 'Diagnóstico', icon: 'fa-stethoscope' },
        { id: 'tratamento', label: 'Tratamento', icon: 'fa-prescription-bottle-alt' },
        { id: 'exames', label: 'Exames', icon: 'fa-flask' },
        { id: 'medicamentos', label: 'Medicamentos', icon: 'fa-pills' }
    ];

    const toggleSymptom = (symptomId) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptomId)
                ? prev.filter(s => s !== symptomId)
                : [...prev, symptomId]
        );
    };

    const analyzeSymptoms = async () => {
        if (selectedSymptoms.length === 0 && !symptomText.trim()) {
            alert('Por favor, selecione ou descreva ao menos um sintoma.');
            return;
        }

        setIsAnalyzing(true);
        setAnalysisResult(null);
        setSelectedDiagnosis(null);
        setRecommendations(null);

        try {
            // Combine selected symptoms with text symptoms
            const allSymptoms = [...selectedSymptoms];
            if (symptomText.trim()) {
                // Extract potential symptoms from text
                const textSymptoms = symptomText.toLowerCase()
                    .split(/[,;.\n]+/)
                    .map(s => s.trim())
                    .filter(s => s.length > 2);
                allSymptoms.push(...textSymptoms);
            }

            const result = await clinicalDecisionService.analyzeSymptoms(allSymptoms, {
                age: samplePatient.idade,
                sex: samplePatient.sexo,
                conditions: samplePatient.conditions,
                allergies: samplePatient.allergies,
                medications: samplePatient.medications
            });

            setAnalysisResult(result);

            // Auto-load AI insights
            loadAIInsights(allSymptoms, result.possibleDiagnoses);
        } catch (error) {
            console.error('Erro na análise:', error);
            // Fallback: use demo data
            setAnalysisResult({
                possibleDiagnoses: [
                    { name: 'Hipertensão Descompensada', probability: 90, matchingSymptoms: 2 },
                    { name: 'Síndrome Gripal', probability: 65, matchingSymptoms: 1 },
                    { name: 'Descompensação Diabética', probability: 45, matchingSymptoms: 1 }
                ],
                recommendedExams: ['Hemograma completo', 'PCR', 'Glicemia', 'Função renal'],
                suggestedTreatments: ['Antitérmicos', 'Hidratação', 'Repouso', 'Ajuste de anti-hipertensivo'],
                symptomCount: selectedSymptoms.length,
                analyzedAt: new Date().toISOString()
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const loadAIInsights = async (symptoms, diagnoses) => {
        setIsLoadingInsights(true);
        try {
            const insights = await clinicalDecisionService.getAIInsights(
                symptoms,
                {
                    age: samplePatient.idade,
                    sex: samplePatient.sexo,
                    conditions: samplePatient.conditions,
                    allergies: samplePatient.allergies,
                    medications: samplePatient.medications
                },
                diagnoses
            );
            setAiInsights(insights);
        } catch (error) {
            console.error('Erro ao carregar insights:', error);
            // Fallback demo insights
            setAiInsights({
                insights: ['Paciente com histórico de hipertensão e diabetes apresenta risco aumentado para complicações cardiovasculares.'],
                alerts: ['Possível interação medicamentosa entre anti-hipertensivos e anti-inflamatórios em uso.'],
                recommendations: ['Considerar monitoramento mais frequente da pressão arterial e glicemia.'],
                aiEnhanced: false
            });
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
            console.error('Erro ao carregar recomendações:', error);
            // Fallback
            setRecommendations({
                diagnosis: diagnosis.name,
                medications: ['Medicamento 1', 'Medicamento 2'],
                exams: ['Exame 1', 'Exame 2'],
                treatments: ['Tratamento 1', 'Tratamento 2'],
                warnings: [],
                protocols: ['Protocolo de Atendimento na APS']
            });
        }
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>
                    <i className="fas fa-brain" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                    Apoio à Decisão Clínica
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-file-export"></i> Exportar
                    </button>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-print"></i> Imprimir
                    </button>
                </div>
            </div>

            {/* Patient Card */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-header" style={{ background: 'var(--sus-green)', color: 'white' }}>
                    <i className="fas fa-user"></i> Paciente Selecionado
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <h4 style={{ marginBottom: '0.5rem' }}>{samplePatient.nome}</h4>
                            <p style={{ margin: '0.25rem 0', color: 'var(--sus-gray)' }}>
                                <strong>Cartão SUS:</strong> {samplePatient.cns}
                            </p>
                            <p style={{ margin: '0.25rem 0', color: 'var(--sus-gray)' }}>
                                <strong>Nascimento:</strong> {new Date(samplePatient.dataNascimento).toLocaleDateString('pt-BR')} ({samplePatient.idade} anos)
                            </p>
                            <p style={{ margin: '0.25rem 0', color: 'var(--sus-gray)' }}>
                                <strong>Sexo:</strong> {samplePatient.sexo}
                            </p>
                        </div>
                        <div>
                            <p style={{ margin: '0.25rem 0' }}>
                                <strong>Condições:</strong>
                                <span style={{ marginLeft: '0.5rem' }}>
                                    {samplePatient.conditions.map((c, i) => (
                                        <span key={i} className="badge badge-primary" style={{ marginRight: '0.25rem' }}>{c}</span>
                                    ))}
                                </span>
                            </p>
                            <p style={{ margin: '0.25rem 0' }}>
                                <strong>Alergias:</strong>
                                <span style={{ marginLeft: '0.5rem' }}>
                                    {samplePatient.allergies.map((a, i) => (
                                        <span key={i} className="badge badge-danger" style={{ marginRight: '0.25rem' }}>{a}</span>
                                    ))}
                                </span>
                            </p>
                            <p style={{ margin: '0.25rem 0', color: 'var(--sus-gray)' }}>
                                <strong>Última Consulta:</strong> {samplePatient.ultimaConsulta}
                            </p>
                            <p style={{ margin: '0.25rem 0', color: 'var(--sus-gray)' }}>
                                <strong>Médico:</strong> {samplePatient.medicoResponsavel}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--sus-light-gray)', marginBottom: '1.5rem' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '3px solid var(--sus-blue)' : '3px solid transparent',
                            background: 'transparent',
                            color: activeTab === tab.id ? 'var(--sus-blue)' : 'var(--sus-gray)',
                            fontWeight: activeTab === tab.id ? '600' : '400',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className={`fas ${tab.icon}`} style={{ marginRight: '0.5rem' }}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'diagnostico' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Symptoms Form */}
                    <div className="card">
                        <div className="card-header" style={{ background: '#f8f9fa' }}>
                            <i className="fas fa-clipboard-list"></i> Sintomas Relatados
                        </div>
                        <div className="card-body">
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Descreva os sintomas</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Digite os sintomas relatados pelo paciente..."
                                    value={symptomText}
                                    onChange={(e) => setSymptomText(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Sintomas comuns</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {commonSymptoms.map(symptom => (
                                        <button
                                            key={symptom.id}
                                            className={`btn btn-sm ${selectedSymptoms.includes(symptom.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
                                            onClick={() => toggleSymptom(symptom.id)}
                                        >
                                            {symptom.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label className="form-label">Duração</label>
                                    <select
                                        className="form-control"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="menos_24h">Menos de 24 horas</option>
                                        <option value="1_3_dias">1-3 dias</option>
                                        <option value="4_7_dias">4-7 dias</option>
                                        <option value="1_2_semanas">1-2 semanas</option>
                                        <option value="mais_2_semanas">Mais de 2 semanas</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Intensidade</label>
                                    <select
                                        className="form-control"
                                        value={intensity}
                                        onChange={(e) => setIntensity(e.target.value)}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="leve">Leve</option>
                                        <option value="moderada">Moderada</option>
                                        <option value="severa">Severa</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={analyzeSymptoms}
                                disabled={isAnalyzing}
                                style={{ width: '100%' }}
                            >
                                {isAnalyzing ? (
                                    <><i className="fas fa-spinner fa-spin"></i> Analisando...</>
                                ) : (
                                    <><i className="fas fa-search"></i> Analisar Sintomas</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Diagnoses List */}
                    <div className="card">
                        <div className="card-header" style={{ background: 'var(--sus-light-blue)', color: 'white' }}>
                            <i className="fas fa-stethoscope"></i> Diagnósticos Sugeridos
                        </div>
                        <div className="card-body">
                            {!analysisResult ? (
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle"></i> Preencha os sintomas e clique em "Analisar" para obter sugestões.
                                </div>
                            ) : (
                                <div>
                                    {analysisResult.possibleDiagnoses.map((diagnosis, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => selectDiagnosis(diagnosis)}
                                            style={{
                                                padding: '1rem',
                                                marginBottom: '0.75rem',
                                                border: selectedDiagnosis?.name === diagnosis.name
                                                    ? '2px solid var(--sus-blue)'
                                                    : '1px solid var(--sus-light-gray)',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer',
                                                background: selectedDiagnosis?.name === diagnosis.name ? '#e3f2fd' : 'white',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h5 style={{ margin: 0 }}>{diagnosis.name}</h5>
                                                <span
                                                    className={`badge ${diagnosis.probability >= 70 ? 'badge-success' : diagnosis.probability >= 40 ? 'badge-warning' : 'badge-secondary'}`}
                                                    style={{ fontSize: '1rem' }}
                                                >
                                                    {diagnosis.probability}%
                                                </span>
                                            </div>
                                            <small style={{ color: 'var(--sus-gray)' }}>
                                                Baseado em {diagnosis.matchingSymptoms} sintoma(s) correspondente(s)
                                            </small>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'tratamento' && (
                <div className="card">
                    <div className="card-body">
                        {!selectedDiagnosis ? (
                            <div className="alert alert-info">
                                <i className="fas fa-info-circle"></i> Selecione um diagnóstico na aba anterior para ver opções de tratamento.
                            </div>
                        ) : (
                            <div>
                                <h4 style={{ marginBottom: '1rem' }}>
                                    Tratamento para: <span style={{ color: 'var(--sus-blue)' }}>{selectedDiagnosis.name}</span>
                                </h4>
                                {recommendations?.treatments?.length > 0 ? (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {recommendations.treatments.map((t, i) => (
                                            <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                                <i className="fas fa-check-circle" style={{ color: 'var(--sus-green)', marginRight: '0.5rem' }}></i>
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Tratamento padrão conforme protocolo do SUS.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'exames' && (
                <div className="card">
                    <div className="card-body">
                        {!analysisResult ? (
                            <div className="alert alert-info">
                                <i className="fas fa-info-circle"></i> Analise os sintomas para ver exames recomendados.
                            </div>
                        ) : (
                            <div>
                                <h4 style={{ marginBottom: '1rem' }}>Exames Recomendados</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                    {analysisResult.recommendedExams.map((exam, i) => (
                                        <div key={i} className="card" style={{ marginBottom: 0 }}>
                                            <div className="card-body" style={{ padding: '1rem' }}>
                                                <i className="fas fa-flask" style={{ color: 'var(--sus-blue)', marginRight: '0.5rem' }}></i>
                                                {exam}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'medicamentos' && (
                <div className="card">
                    <div className="card-body">
                        {!selectedDiagnosis ? (
                            <div className="alert alert-info">
                                <i className="fas fa-info-circle"></i> Selecione um diagnóstico para ver medicamentos recomendados.
                            </div>
                        ) : (
                            <div>
                                <h4 style={{ marginBottom: '1rem' }}>
                                    Medicamentos para: <span style={{ color: 'var(--sus-blue)' }}>{selectedDiagnosis.name}</span>
                                </h4>
                                {recommendations?.warnings?.length > 0 && (
                                    <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
                                        <strong><i className="fas fa-exclamation-triangle"></i> Alertas:</strong>
                                        <ul style={{ marginBottom: 0, marginTop: '0.5rem' }}>
                                            {recommendations.warnings.map((w, i) => (
                                                <li key={i}>{w}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {recommendations?.medications?.length > 0 ? (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Medicamento</th>
                                                <th>Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recommendations.medications.map((med, i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <i className="fas fa-pills" style={{ color: 'var(--sus-yellow)', marginRight: '0.5rem' }}></i>
                                                        {med}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-primary">
                                                            <i className="fas fa-prescription"></i> Prescrever
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>Consulte protocolos para prescrição adequada.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Clinical History */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <div className="card-header" style={{ background: '#f8f9fa' }}>
                    <i className="fas fa-history"></i> Histórico Clínico Relevante
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="table" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Tipo</th>
                                <th>Descrição</th>
                                <th>Médico</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clinicalHistory.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.data}</td>
                                    <td>
                                        <span className={`badge ${item.tipo === 'Consulta' ? 'badge-primary' : 'badge-info'}`}>
                                            {item.tipo}
                                        </span>
                                    </td>
                                    <td>{item.descricao}</td>
                                    <td>{item.medico}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Insights */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <div className="card-header" style={{ background: 'var(--sus-light-blue)', color: 'white' }}>
                    <i className="fas fa-robot"></i> Insights de IA (DeepSeek)
                    {aiInsights?.aiEnhanced && (
                        <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>
                            <i className="fas fa-check-circle"></i> IA Ativa
                        </span>
                    )}
                    {aiInsights?.aiModel && (
                        <span className="badge badge-info" style={{ marginLeft: '0.5rem' }}>
                            {aiInsights.aiModel}
                        </span>
                    )}
                </div>
                <div className="card-body">
                    {isLoadingInsights ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--sus-blue)' }}></i>
                            <p style={{ marginTop: '1rem' }}>Gerando insights com DeepSeek...</p>
                        </div>
                    ) : aiInsights ? (
                        <>
                            {/* Standard Insights */}
                            {aiInsights.insights?.map((insight, i) => (
                                <div key={i} className="alert alert-info">
                                    <i className="fas fa-lightbulb"></i> <strong>Análise:</strong> {insight}
                                </div>
                            ))}
                            {aiInsights.alerts?.map((alert, i) => (
                                <div key={i} className="alert alert-warning">
                                    <i className="fas fa-exclamation-triangle"></i> <strong>Alerta:</strong> {alert}
                                </div>
                            ))}
                            {aiInsights.recommendations?.map((rec, i) => (
                                <div key={i} className="alert alert-success">
                                    <i className="fas fa-check-circle"></i> <strong>Recomendação:</strong> {rec}
                                </div>
                            ))}

                            {/* DeepSeek AI Advanced Insights */}
                            {aiInsights.aiInsights && (
                                <div className="card" style={{ marginTop: '1rem', border: '2px solid var(--sus-blue)' }}>
                                    <div className="card-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                        <i className="fas fa-brain"></i> Análise Avançada DeepSeek
                                    </div>
                                    <div className="card-body">
                                        {/* Análise Integrada */}
                                        {aiInsights.aiInsights.analise_integrada && (
                                            <div style={{ marginBottom: '1rem' }}>
                                                <h6><i className="fas fa-search-plus"></i> Análise Integrada</h6>
                                                <p style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '0.5rem' }}>
                                                    {aiInsights.aiInsights.analise_integrada}
                                                </p>
                                            </div>
                                        )}

                                        {/* Riscos Identificados */}
                                        {aiInsights.aiInsights.riscos_identificados?.length > 0 && (
                                            <div style={{ marginBottom: '1rem' }}>
                                                <h6><i className="fas fa-exclamation-circle" style={{ color: 'var(--sus-red)' }}></i> Riscos Identificados</h6>
                                                <ul style={{ marginBottom: 0 }}>
                                                    {aiInsights.aiInsights.riscos_identificados.map((risco, i) => (
                                                        <li key={i} style={{ color: '#dc3545' }}>{risco}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Interações Medicamentosas */}
                                        {aiInsights.aiInsights.interacoes_medicamentosas?.length > 0 && (
                                            <div style={{ marginBottom: '1rem' }}>
                                                <h6><i className="fas fa-pills" style={{ color: 'var(--sus-yellow)' }}></i> Interações Medicamentosas</h6>
                                                <ul style={{ marginBottom: 0 }}>
                                                    {aiInsights.aiInsights.interacoes_medicamentosas.map((interacao, i) => (
                                                        <li key={i} style={{ color: '#856404' }}>{interacao}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Recomendações Personalizadas */}
                                        {aiInsights.aiInsights.recomendacoes_personalizadas?.length > 0 && (
                                            <div style={{ marginBottom: '1rem' }}>
                                                <h6><i className="fas fa-star" style={{ color: 'var(--sus-green)' }}></i> Recomendações Personalizadas</h6>
                                                <ul style={{ marginBottom: 0 }}>
                                                    {aiInsights.aiInsights.recomendacoes_personalizadas.map((rec, i) => (
                                                        <li key={i} style={{ color: '#155724' }}>{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Prognóstico e Encaminhamento */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            {aiInsights.aiInsights.prognostico_estimado && (
                                                <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '0.5rem' }}>
                                                    <h6><i className="fas fa-chart-line"></i> Prognóstico</h6>
                                                    <p style={{ margin: 0 }}>{aiInsights.aiInsights.prognostico_estimado}</p>
                                                </div>
                                            )}
                                            {aiInsights.aiInsights.necessidade_encaminhamento && (
                                                <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '0.5rem' }}>
                                                    <h6><i className="fas fa-user-md"></i> Encaminhamento</h6>
                                                    <p style={{ margin: 0 }}>{aiInsights.aiInsights.necessidade_encaminhamento}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Legacy AI Analysis (texto livre) */}
                            {aiInsights.aiAnalysis && !aiInsights.aiInsights && (
                                <div className="card" style={{ marginTop: '1rem', background: '#f8f9fa' }}>
                                    <div className="card-body">
                                        <h6><i className="fas fa-brain"></i> Análise de IA</h6>
                                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                                            {aiInsights.aiAnalysis}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="alert alert-info">
                            <i className="fas fa-info-circle"></i> Analise os sintomas para gerar insights de IA com DeepSeek.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
