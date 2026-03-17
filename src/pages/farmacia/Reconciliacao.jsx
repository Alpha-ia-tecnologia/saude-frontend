import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    Pill,
    Plus,
    Search,
    X,
    CheckCircle,
    XCircle,
    Info,
    ClipboardList,
    GitCompare,
    Zap,
    Trash2,
    Pencil,
    Save,
    User,
    Calendar,
    ArrowRight,
    Shield,
    Activity,
    ChevronRight,
    FileWarning,
    Heart,
} from 'lucide-react';

// ──────────────────────────────────────────────
// In-memory data mirroring the backend service
// ──────────────────────────────────────────────

const interactionsDatabase = [
    { drug1: 'warfarina', drug2: 'aas', severity: 'grave', type: 'Risco de hemorragia', description: 'A combinacao de Warfarina com AAS aumenta significativamente o risco de sangramento gastrointestinal e hemorragias graves.', recommendation: 'CONTRAINDICADO. Evitar uso concomitante. Considerar alternativas terapeuticas.' },
    { drug1: 'ieca', drug2: 'espironolactona', severity: 'grave', type: 'Hipercalemia', description: 'IECA combinado com Espironolactona pode causar hipercalemia grave, potencialmente fatal.', recommendation: 'CONTRAINDICADO sem monitoramento rigoroso de potassio serico.' },
    { drug1: 'fluoxetina', drug2: 'tramadol', severity: 'grave', type: 'Sindrome serotoninica', description: 'A combinacao pode desencadear sindrome serotoninica, condicao potencialmente fatal com hipertermia, rigidez muscular e alteracoes do estado mental.', recommendation: 'CONTRAINDICADO. Utilizar analgesico alternativo.' },
    { drug1: 'warfarina', drug2: 'ibuprofeno', severity: 'grave', type: 'Risco de hemorragia', description: 'AINEs como Ibuprofeno aumentam o risco de sangramento quando combinados com Warfarina.', recommendation: 'CONTRAINDICADO. Preferir Paracetamol para analgesia.' },
    { drug1: 'enalapril', drug2: 'espironolactona', severity: 'grave', type: 'Hipercalemia', description: 'Enalapril (IECA) com Espironolactona pode causar elevacao perigosa do potassio serico.', recommendation: 'CONTRAINDICADO sem monitoramento.' },
    { drug1: 'captopril', drug2: 'espironolactona', severity: 'grave', type: 'Hipercalemia', description: 'Captopril (IECA) com Espironolactona aumenta risco de hipercalemia severa.', recommendation: 'CONTRAINDICADO sem monitoramento rigoroso.' },
    { drug1: 'metformina', drug2: 'contraste iodado', severity: 'moderada', type: 'Acidose latica', description: 'Metformina deve ser suspensa antes de exames com contraste iodado pelo risco de acidose latica.', recommendation: 'Suspender Metformina 48h antes do exame com contraste.' },
    { drug1: 'omeprazol', drug2: 'clopidogrel', severity: 'moderada', type: 'Reducao do efeito antiplaquetario', description: 'Omeprazol inibe o CYP2C19, reduzindo a conversao do Clopidogrel em seu metabolito ativo.', recommendation: 'Substituir Omeprazol por Pantoprazol.' },
    { drug1: 'diclofenaco', drug2: 'losartana', severity: 'moderada', type: 'Nefrotoxicidade', description: 'AINEs como Diclofenaco reduzem o fluxo sanguineo renal e podem comprometer a eficacia da Losartana.', recommendation: 'Evitar uso prolongado. Monitorar funcao renal.' },
    { drug1: 'captopril', drug2: 'litio', severity: 'moderada', type: 'Toxicidade por litio', description: 'Captopril pode reduzir a excrecao renal de Litio, levando a niveis toxicos.', recommendation: 'Monitorar niveis sericos de Litio frequentemente.' },
    { drug1: 'aas', drug2: 'ibuprofeno', severity: 'moderada', type: 'Reducao efeito antiagregante', description: 'Ibuprofeno pode bloquear o efeito antiagregante plaquetario do AAS.', recommendation: 'Se ambos necessarios, administrar AAS 30min antes do Ibuprofeno.' },
    { drug1: 'sinvastatina', drug2: 'amiodarona', severity: 'moderada', type: 'Rabdomiolise', description: 'Amiodarona inibe o metabolismo da Sinvastatina, aumentando risco de miopatia e rabdomiolise.', recommendation: 'Limitar dose de Sinvastatina a 20mg/dia. Considerar trocar estatina.' },
    { drug1: 'metoclopramida', drug2: 'haloperidol', severity: 'moderada', type: 'Efeitos extrapiramidais', description: 'Ambos sao antagonistas dopaminergicos. Uso concomitante aumenta risco de efeitos extrapiramidais.', recommendation: 'Evitar uso concomitante. Considerar Ondansetrona como alternativa.' },
    { drug1: 'ciprofloxacino', drug2: 'teofilina', severity: 'moderada', type: 'Toxicidade por teofilina', description: 'Ciprofloxacino inibe o metabolismo da Teofilina, podendo causar niveis toxicos.', recommendation: 'Reduzir dose de Teofilina em 30-50%.' },
    { drug1: 'digoxina', drug2: 'amiodarona', severity: 'moderada', type: 'Toxicidade digitalica', description: 'Amiodarona aumenta os niveis sericos de Digoxina por reducao da depuracao.', recommendation: 'Reduzir dose de Digoxina em 50% ao iniciar Amiodarona.' },
    { drug1: 'fluconazol', drug2: 'sinvastatina', severity: 'moderada', type: 'Rabdomiolise', description: 'Fluconazol inibe CYP3A4 e aumenta niveis de Sinvastatina.', recommendation: 'Suspender estatina durante tratamento com Fluconazol.' },
    { drug1: 'omeprazol', drug2: 'metotrexato', severity: 'moderada', type: 'Toxicidade por metotrexato', description: 'Omeprazol pode reduzir a eliminacao renal do Metotrexato.', recommendation: 'Considerar suspensao temporaria do Omeprazol.' },
    { drug1: 'paracetamol', drug2: 'warfarina', severity: 'leve', type: 'Aumento discreto do INR', description: 'Uso regular de Paracetamol pode aumentar levemente o INR.', recommendation: 'Permitido em doses terapeuticas. Monitorar INR se uso prolongado.' },
    { drug1: 'amoxicilina', drug2: 'anticoncepcional', severity: 'leve', type: 'Possivel reducao eficacia contraceptiva', description: 'Antibioticos de amplo espectro podem teoricamente reduzir a eficacia de contraceptivos orais.', recommendation: 'Orientar metodo contraceptivo adicional durante o uso.' },
    { drug1: 'losartana', drug2: 'suplemento de potassio', severity: 'leve', type: 'Risco de hipercalemia', description: 'BRAs como Losartana retem potassio. Suplementacao adicional pode elevar o potassio serico.', recommendation: 'Monitorar potassio serico.' },
];

const drugAliases = {
    'aas': ['aas', 'acido acetilsalicilico', 'aspirina'],
    'warfarina': ['warfarina', 'marevan', 'coumadin'],
    'ieca': ['ieca', 'inibidor da eca'],
    'enalapril': ['enalapril', 'renitec'],
    'captopril': ['captopril', 'capoten'],
    'espironolactona': ['espironolactona', 'aldactone'],
    'fluoxetina': ['fluoxetina', 'prozac'],
    'tramadol': ['tramadol', 'tramal'],
    'metformina': ['metformina', 'glifage'],
    'contraste iodado': ['contraste iodado', 'contraste'],
    'omeprazol': ['omeprazol', 'losec'],
    'clopidogrel': ['clopidogrel', 'plavix'],
    'diclofenaco': ['diclofenaco', 'voltaren', 'cataflan'],
    'losartana': ['losartana', 'cozaar', 'losartana potassica'],
    'litio': ['litio', 'carbolitium', 'carbonato de litio'],
    'ibuprofeno': ['ibuprofeno', 'advil', 'alivium'],
    'sinvastatina': ['sinvastatina', 'zocor'],
    'amiodarona': ['amiodarona', 'ancoron'],
    'metoclopramida': ['metoclopramida', 'plasil'],
    'haloperidol': ['haloperidol', 'haldol'],
    'ciprofloxacino': ['ciprofloxacino', 'cipro'],
    'teofilina': ['teofilina'],
    'digoxina': ['digoxina', 'lanoxin'],
    'fluconazol': ['fluconazol', 'diflucan'],
    'metotrexato': ['metotrexato', 'methotrexate'],
    'paracetamol': ['paracetamol', 'tylenol'],
    'amoxicilina': ['amoxicilina', 'amoxil'],
    'anticoncepcional': ['anticoncepcional', 'contraceptivo oral'],
    'suplemento de potassio': ['suplemento de potassio', 'kcl', 'cloreto de potassio', 'slow-k'],
};

const initialPatients = {
    'P001': {
        patientId: 'P001', patientName: 'Maria da Silva Santos', age: 68,
        medications: [
            { id: 1, name: 'Losartana', dose: '50mg', frequency: '1x ao dia', route: 'Oral', prescriber: 'Dr. Carlos Mendes', since: '2023-03-15' },
            { id: 2, name: 'Metformina', dose: '850mg', frequency: '2x ao dia', route: 'Oral', prescriber: 'Dra. Ana Souza', since: '2022-08-10' },
            { id: 3, name: 'Omeprazol', dose: '20mg', frequency: '1x ao dia (jejum)', route: 'Oral', prescriber: 'Dr. Carlos Mendes', since: '2023-01-20' },
            { id: 4, name: 'AAS', dose: '100mg', frequency: '1x ao dia', route: 'Oral', prescriber: 'Dra. Fernanda Lima', since: '2023-06-01' },
            { id: 5, name: 'Sinvastatina', dose: '20mg', frequency: '1x ao dia (noite)', route: 'Oral', prescriber: 'Dr. Carlos Mendes', since: '2023-03-15' },
        ]
    },
    'P002': {
        patientId: 'P002', patientName: 'Joao Carlos Pereira', age: 72,
        medications: [
            { id: 6, name: 'Enalapril', dose: '10mg', frequency: '2x ao dia', route: 'Oral', prescriber: 'Dra. Patricia Rocha', since: '2021-11-05' },
            { id: 7, name: 'Warfarina', dose: '5mg', frequency: '1x ao dia', route: 'Oral', prescriber: 'Dr. Roberto Alves', since: '2022-04-18' },
            { id: 8, name: 'Digoxina', dose: '0.25mg', frequency: '1x ao dia', route: 'Oral', prescriber: 'Dr. Roberto Alves', since: '2022-04-18' },
            { id: 9, name: 'Furosemida', dose: '40mg', frequency: '1x ao dia (manha)', route: 'Oral', prescriber: 'Dr. Roberto Alves', since: '2022-06-10' },
        ]
    },
    'P003': {
        patientId: 'P003', patientName: 'Ana Beatriz Oliveira', age: 45,
        medications: [
            { id: 10, name: 'Fluoxetina', dose: '20mg', frequency: '1x ao dia (manha)', route: 'Oral', prescriber: 'Dra. Luciana Campos', since: '2024-01-10' },
            { id: 11, name: 'Captopril', dose: '25mg', frequency: '3x ao dia', route: 'Oral', prescriber: 'Dr. Marcos Vieira', since: '2023-09-22' },
        ]
    },
    'P004': {
        patientId: 'P004', patientName: 'Roberto Lima Nascimento', age: 58,
        medications: [
            { id: 12, name: 'Metformina', dose: '500mg', frequency: '2x ao dia', route: 'Oral', prescriber: 'Dra. Claudia Ferreira', since: '2022-05-14' },
            { id: 13, name: 'Losartana', dose: '100mg', frequency: '1x ao dia', route: 'Oral', prescriber: 'Dra. Claudia Ferreira', since: '2022-05-14' },
            { id: 14, name: 'Sinvastatina', dose: '40mg', frequency: '1x ao dia (noite)', route: 'Oral', prescriber: 'Dr. Paulo Henrique', since: '2023-02-28' },
            { id: 15, name: 'Clopidogrel', dose: '75mg', frequency: '1x ao dia', route: 'Oral', prescriber: 'Dr. Paulo Henrique', since: '2024-06-10' },
            { id: 16, name: 'Omeprazol', dose: '20mg', frequency: '1x ao dia (jejum)', route: 'Oral', prescriber: 'Dr. Paulo Henrique', since: '2024-06-10' },
        ]
    },
};

const knownMedications = [
    'Losartana', 'Metformina', 'Omeprazol', 'AAS', 'Sinvastatina', 'Enalapril',
    'Warfarina', 'Digoxina', 'Furosemida', 'Fluoxetina', 'Captopril', 'Clopidogrel',
    'Amiodarona', 'Haloperidol', 'Metoclopramida', 'Tramadol', 'Ibuprofeno',
    'Diclofenaco', 'Paracetamol', 'Amoxicilina', 'Ciprofloxacino', 'Fluconazol',
    'Espironolactona', 'Metotrexato', 'Teofilina', 'Atenolol', 'Propranolol',
    'Dipirona', 'Hidroclorotiazida', 'Anlodipino', 'Insulina NPH', 'Glibenclamida',
    'Prednisona', 'Dexametasona', 'Azitromicina', 'Cefalexina', 'Pantoprazol',
    'Ranitidina', 'Salbutamol', 'Budesonida', 'Sertralina', 'Escitalopram',
    'Clonazepam', 'Carvedilol', 'Rosuvastatina', 'Atorvastatina',
];

// ──────────────────────────────────────────────
// Helper functions
// ──────────────────────────────────────────────

function normalizeDrugName(name) {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}

function resolveAlias(drugName) {
    const normalized = normalizeDrugName(drugName);
    for (const [canonical, aliases] of Object.entries(drugAliases)) {
        if (aliases.some(alias => normalized.includes(alias) || alias.includes(normalized))) {
            return canonical;
        }
    }
    return normalized;
}

function checkInteractions(medicationList) {
    const interactions = [];
    const resolvedMeds = medicationList.map(med => ({
        original: med,
        resolved: resolveAlias(typeof med === 'string' ? med : med.name)
    }));

    for (let i = 0; i < resolvedMeds.length; i++) {
        for (let j = i + 1; j < resolvedMeds.length; j++) {
            const med1 = resolvedMeds[i];
            const med2 = resolvedMeds[j];
            const found = interactionsDatabase.filter(inter => {
                const d1 = inter.drug1;
                const d2 = inter.drug2;
                return (med1.resolved === d1 && med2.resolved === d2) || (med1.resolved === d2 && med2.resolved === d1);
            });
            found.forEach(inter => {
                interactions.push({
                    drug1: typeof med1.original === 'string' ? med1.original : med1.original.name,
                    drug2: typeof med2.original === 'string' ? med2.original : med2.original.name,
                    severity: inter.severity,
                    type: inter.type,
                    description: inter.description,
                    recommendation: inter.recommendation,
                });
            });
        }
    }

    const severityOrder = { grave: 0, moderada: 1, leve: 2 };
    interactions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    return interactions;
}

function formatDate(dateStr) {
    if (!dateStr || dateStr === '-') return '-';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
}

let nextId = 200;

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

function SeverityBadge({ severity, large }) {
    const config = {
        grave: { classes: 'bg-red-100 text-red-800 border-red-200', label: 'Grave', icon: XCircle },
        moderada: { classes: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Moderada', icon: AlertTriangle },
        leve: { classes: 'bg-sky-100 text-sky-800 border-sky-200', label: 'Leve', icon: Info },
    };
    const c = config[severity] || config.leve;
    const Icon = c.icon;
    return (
        <span className={cn(
            'inline-flex items-center gap-1 rounded-md border font-semibold',
            large ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs',
            c.classes
        )}>
            <Icon className={large ? 'h-4 w-4' : 'h-3 w-3'} />
            {c.label}
        </span>
    );
}

function MedicationAutocomplete({ value, onChange, placeholder }) {
    const [open, setOpen] = useState(false);
    const filtered = knownMedications.filter(m =>
        m.toLowerCase().includes((value || '').toLowerCase()) && m.toLowerCase() !== (value || '').toLowerCase()
    ).slice(0, 8);

    return (
        <div className="relative">
            <input
                type="text"
                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder={placeholder || 'Nome do medicamento...'}
                value={value}
                onChange={(e) => { onChange(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 200)}
            />
            {open && filtered.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-48 overflow-auto rounded-lg border border-border bg-white shadow-lg">
                    {filtered.map(m => (
                        <button
                            key={m}
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-primary/5"
                            onMouseDown={() => { onChange(m); setOpen(false); }}
                        >
                            <Pill className="h-3.5 w-3.5 text-muted-foreground" />
                            {m}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────

export default function Reconciliacao() {
    const [activeTab, setActiveTab] = useState('continuous');
    const [patients, setPatients] = useState(initialPatients);

    // Tab 1 state
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [showAddMedForm, setShowAddMedForm] = useState(false);
    const [editingMedId, setEditingMedId] = useState(null);
    const [newMed, setNewMed] = useState({ name: '', dose: '', frequency: '', route: 'Oral', prescriber: '' });
    const [editMed, setEditMed] = useState({ name: '', dose: '', frequency: '', route: 'Oral', prescriber: '' });

    // Tab 2 state
    const [reconcilePatientId, setReconcilePatientId] = useState('');
    const [newPrescription, setNewPrescription] = useState([]);
    const [prescriptionInput, setPrescriptionInput] = useState({ name: '', dose: '', frequency: '' });
    const [reconcileResult, setReconcileResult] = useState(null);

    // Tab 3 state
    const [interactionMeds, setInteractionMeds] = useState([]);
    const [interactionInput, setInteractionInput] = useState('');
    const [interactionResults, setInteractionResults] = useState(null);

    const patientList = Object.values(patients);
    const selectedPatient = patients[selectedPatientId] || null;
    const reconcilePatient = patients[reconcilePatientId] || null;

    const tabs = [
        { id: 'continuous', label: 'Medicamentos de Uso Continuo', icon: ClipboardList },
        { id: 'reconcile', label: 'Reconciliacao', icon: GitCompare },
        { id: 'interactions', label: 'Interacoes Medicamentosas', icon: Zap },
    ];

    // ── Tab 1: Add medication ──
    const handleAddMedication = useCallback(() => {
        if (!selectedPatientId || !newMed.name) return;
        setPatients(prev => {
            const p = { ...prev };
            const patient = { ...p[selectedPatientId] };
            patient.medications = [...patient.medications, { id: nextId++, ...newMed, since: new Date().toISOString().split('T')[0] }];
            p[selectedPatientId] = patient;
            return p;
        });
        setNewMed({ name: '', dose: '', frequency: '', route: 'Oral', prescriber: '' });
        setShowAddMedForm(false);
    }, [selectedPatientId, newMed]);

    const handleRemoveMedication = useCallback((medId) => {
        if (!selectedPatientId) return;
        setPatients(prev => {
            const p = { ...prev };
            const patient = { ...p[selectedPatientId] };
            patient.medications = patient.medications.filter(m => m.id !== medId);
            p[selectedPatientId] = patient;
            return p;
        });
    }, [selectedPatientId]);

    const handleStartEdit = useCallback((med) => {
        setEditingMedId(med.id);
        setEditMed({ name: med.name, dose: med.dose, frequency: med.frequency, route: med.route, prescriber: med.prescriber });
    }, []);

    const handleSaveEdit = useCallback(() => {
        if (!selectedPatientId || !editingMedId) return;
        setPatients(prev => {
            const p = { ...prev };
            const patient = { ...p[selectedPatientId] };
            patient.medications = patient.medications.map(m => m.id === editingMedId ? { ...m, ...editMed } : m);
            p[selectedPatientId] = patient;
            return p;
        });
        setEditingMedId(null);
    }, [selectedPatientId, editingMedId, editMed]);

    // ── Tab 2: Reconciliation ──
    const handleAddToPrescription = useCallback(() => {
        if (!prescriptionInput.name) return;
        setNewPrescription(prev => [...prev, { id: nextId++, ...prescriptionInput }]);
        setPrescriptionInput({ name: '', dose: '', frequency: '' });
    }, [prescriptionInput]);

    const handleRunReconciliation = useCallback(() => {
        if (!reconcilePatientId || newPrescription.length === 0) return;
        const patient = patients[reconcilePatientId];
        if (!patient) return;

        const allMedNames = [
            ...patient.medications.map(m => m.name),
            ...newPrescription.map(m => m.name),
        ];
        const allInteractions = checkInteractions(allMedNames);

        const safe = [];
        const warnings = [];
        const blocked = [];

        newPrescription.forEach(newM => {
            const resolvedNew = resolveAlias(newM.name);
            const related = allInteractions.filter(inter => {
                return resolveAlias(inter.drug1) === resolvedNew || resolveAlias(inter.drug2) === resolvedNew;
            });
            const grave = related.filter(i => i.severity === 'grave');
            const moderada = related.filter(i => i.severity === 'moderada');
            const leve = related.filter(i => i.severity === 'leve');

            if (grave.length > 0) {
                blocked.push({ medication: newM, interactions: grave, reason: grave.map(i => i.type).join(', ') });
            } else if (moderada.length > 0) {
                warnings.push({ medication: newM, interactions: moderada, reason: moderada.map(i => i.type).join(', ') });
            } else {
                safe.push({ medication: newM, interactions: leve });
            }
        });

        setReconcileResult({ safe, warnings, blocked, interactions: allInteractions });
    }, [reconcilePatientId, newPrescription, patients]);

    // ── Tab 3: Interaction checker ──
    const handleAddInteractionMed = useCallback(() => {
        if (!interactionInput.trim()) return;
        const updated = [...interactionMeds, interactionInput.trim()];
        setInteractionMeds(updated);
        setInteractionInput('');
        if (updated.length >= 2) {
            setInteractionResults(checkInteractions(updated));
        }
    }, [interactionInput, interactionMeds]);

    const handleRemoveInteractionMed = useCallback((index) => {
        const updated = interactionMeds.filter((_, i) => i !== index);
        setInteractionMeds(updated);
        if (updated.length >= 2) {
            setInteractionResults(checkInteractions(updated));
        } else {
            setInteractionResults(null);
        }
    }, [interactionMeds]);

    // Interaction matrix for Tab 3
    const interactionMatrix = useMemo(() => {
        if (interactionMeds.length < 2) return null;
        const matrix = {};
        interactionMeds.forEach(m1 => {
            matrix[m1] = {};
            interactionMeds.forEach(m2 => {
                if (m1 === m2) { matrix[m1][m2] = null; return; }
                const r1 = resolveAlias(m1);
                const r2 = resolveAlias(m2);
                const found = interactionsDatabase.find(inter =>
                    (inter.drug1 === r1 && inter.drug2 === r2) || (inter.drug1 === r2 && inter.drug2 === r1)
                );
                matrix[m1][m2] = found ? found.severity : 'none';
            });
        });
        return matrix;
    }, [interactionMeds]);

    const hasGraveInteraction = interactionResults?.some(i => i.severity === 'grave');

    // ──────────────────────────────────────────────
    // Render
    // ──────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-7 w-7 text-secondary" />
                    Reconciliacao Medicamentosa
                </h1>
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">RF16-RF18</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Diferencial Competitivo</span>
                </div>
            </div>

            {/* Info Banner */}
            <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 text-secondary" />
                    <div>
                        <p className="text-sm font-semibold text-secondary">Seguranca do Paciente</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            O modulo de reconciliacao medicamentosa cruza os medicamentos de uso continuo do paciente com novas prescricoes,
                            identificando interacoes potencialmente perigosas e bloqueando combinacoes de alto risco.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <nav className="flex gap-0">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors',
                                    activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* ═══════════════════════════════════════════
                TAB 1: Medicamentos de Uso Continuo (RF16)
                ═══════════════════════════════════════════ */}
            {activeTab === 'continuous' && (
                <div className="space-y-5">
                    {/* Patient selector */}
                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="p-5">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-medium text-foreground">Selecionar Paciente</label>
                                    <select
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={selectedPatientId}
                                        onChange={(e) => { setSelectedPatientId(e.target.value); setEditingMedId(null); setShowAddMedForm(false); }}
                                    >
                                        <option value="">-- Selecione um paciente --</option>
                                        {patientList.map(p => (
                                            <option key={p.patientId} value={p.patientId}>{p.patientName} ({p.patientId})</option>
                                        ))}
                                    </select>
                                </div>
                                {selectedPatient && (
                                    <div className="flex items-center gap-4 pt-5">
                                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            {selectedPatient.age ? `${selectedPatient.age} anos` : 'Idade n/d'}
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Pill className="h-4 w-4" />
                                            {selectedPatient.medications.length} medicamento(s)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {selectedPatient && (
                        <>
                            {/* Medications list */}
                            <div className="rounded-xl border border-border bg-card shadow-sm">
                                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                                    <h5 className="flex items-center gap-2 font-semibold">
                                        <ClipboardList className="h-4 w-4 text-secondary" />
                                        Medicamentos de Uso Continuo ({selectedPatient.medications.length})
                                    </h5>
                                    <button
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                                        onClick={() => { setShowAddMedForm(true); setEditingMedId(null); }}
                                    >
                                        <Plus className="h-4 w-4" /> Adicionar Medicamento
                                    </button>
                                </div>

                                {selectedPatient.medications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <Pill className="mb-2 h-10 w-10 opacity-30" />
                                        <p className="text-sm">Nenhum medicamento de uso continuo registrado.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="border-b border-border bg-muted/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Medicamento</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Dose</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Frequencia</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Via</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Prescritor</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Desde</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Acoes</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {selectedPatient.medications.map(med => (
                                                <tr key={med.id}>
                                                    {editingMedId === med.id ? (
                                                        <>
                                                            <td className="px-4 py-2">
                                                                <MedicationAutocomplete value={editMed.name} onChange={(v) => setEditMed(prev => ({ ...prev, name: v }))} />
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <input type="text" className="h-9 w-full rounded-lg border border-input bg-white px-2 text-sm" value={editMed.dose} onChange={e => setEditMed(prev => ({ ...prev, dose: e.target.value }))} />
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <input type="text" className="h-9 w-full rounded-lg border border-input bg-white px-2 text-sm" value={editMed.frequency} onChange={e => setEditMed(prev => ({ ...prev, frequency: e.target.value }))} />
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <select className="h-9 rounded-lg border border-input bg-white px-2 text-sm" value={editMed.route} onChange={e => setEditMed(prev => ({ ...prev, route: e.target.value }))}>
                                                                    <option>Oral</option><option>Sublingual</option><option>Intravenoso</option><option>Intramuscular</option><option>Topico</option><option>Inalatorio</option>
                                                                </select>
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <input type="text" className="h-9 w-full rounded-lg border border-input bg-white px-2 text-sm" value={editMed.prescriber} onChange={e => setEditMed(prev => ({ ...prev, prescriber: e.target.value }))} />
                                                            </td>
                                                            <td className="px-4 py-2 text-muted-foreground">{formatDate(med.since)}</td>
                                                            <td className="px-4 py-2">
                                                                <div className="flex gap-1">
                                                                    <button className="inline-flex items-center rounded-lg bg-emerald-600 px-2 py-1.5 text-xs text-white hover:bg-emerald-700" onClick={handleSaveEdit}>
                                                                        <Save className="h-3.5 w-3.5" />
                                                                    </button>
                                                                    <button className="inline-flex items-center rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted" onClick={() => setEditingMedId(null)}>
                                                                        <X className="h-3.5 w-3.5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="px-4 py-3 font-medium">{med.name}</td>
                                                            <td className="px-4 py-3">{med.dose}</td>
                                                            <td className="px-4 py-3">{med.frequency}</td>
                                                            <td className="px-4 py-3">
                                                                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{med.route}</span>
                                                            </td>
                                                            <td className="px-4 py-3 text-muted-foreground">{med.prescriber}</td>
                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="h-3.5 w-3.5" />
                                                                    {formatDate(med.since)}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex gap-1">
                                                                    <button
                                                                        className="inline-flex items-center rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                                                        title="Editar"
                                                                        onClick={() => handleStartEdit(med)}
                                                                    >
                                                                        <Pencil className="h-3.5 w-3.5" />
                                                                    </button>
                                                                    <button
                                                                        className="inline-flex items-center rounded-lg border border-red-300 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50"
                                                                        title="Remover"
                                                                        onClick={() => handleRemoveMedication(med.id)}
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Add medication form */}
                            {showAddMedForm && (
                                <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-5">
                                    <h6 className="mb-4 flex items-center gap-2 font-semibold text-primary">
                                        <Plus className="h-4 w-4" /> Adicionar Novo Medicamento de Uso Continuo
                                    </h6>
                                    <div className="grid grid-cols-5 gap-4">
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-foreground">Medicamento *</label>
                                            <MedicationAutocomplete
                                                value={newMed.name}
                                                onChange={(v) => setNewMed(prev => ({ ...prev, name: v }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-foreground">Dose</label>
                                            <input
                                                type="text"
                                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="Ex: 50mg"
                                                value={newMed.dose}
                                                onChange={e => setNewMed(prev => ({ ...prev, dose: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-foreground">Frequencia</label>
                                            <input
                                                type="text"
                                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="Ex: 2x ao dia"
                                                value={newMed.frequency}
                                                onChange={e => setNewMed(prev => ({ ...prev, frequency: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-foreground">Via</label>
                                            <select
                                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                value={newMed.route}
                                                onChange={e => setNewMed(prev => ({ ...prev, route: e.target.value }))}
                                            >
                                                <option>Oral</option>
                                                <option>Sublingual</option>
                                                <option>Intravenoso</option>
                                                <option>Intramuscular</option>
                                                <option>Topico</option>
                                                <option>Inalatorio</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-foreground">Prescritor</label>
                                            <input
                                                type="text"
                                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="Ex: Dr. Silva"
                                                value={newMed.prescriber}
                                                onChange={e => setNewMed(prev => ({ ...prev, prescriber: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                            onClick={() => setShowAddMedForm(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
                                            onClick={handleAddMedication}
                                            disabled={!newMed.name}
                                        >
                                            <Save className="h-4 w-4" /> Salvar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {!selectedPatientId && (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-muted-foreground">
                            <User className="mb-3 h-12 w-12 opacity-20" />
                            <p className="text-sm font-medium">Selecione um paciente para visualizar seus medicamentos de uso continuo</p>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════
                TAB 2: Reconciliacao (RF17)
                ═══════════════════════════════════════════ */}
            {activeTab === 'reconcile' && (
                <div className="space-y-5">
                    {/* Patient selector */}
                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="p-5">
                            <label className="mb-1 block text-sm font-medium text-foreground">Selecionar Paciente para Reconciliacao</label>
                            <select
                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={reconcilePatientId}
                                onChange={(e) => { setReconcilePatientId(e.target.value); setReconcileResult(null); }}
                            >
                                <option value="">-- Selecione um paciente --</option>
                                {patientList.map(p => (
                                    <option key={p.patientId} value={p.patientId}>{p.patientName} ({p.patientId})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {reconcilePatient && (
                        <div className="grid grid-cols-2 gap-5">
                            {/* Left: Continuous Meds */}
                            <div className="rounded-xl border border-border bg-card shadow-sm">
                                <div className="border-b border-border bg-secondary/5 px-5 py-3">
                                    <h5 className="flex items-center gap-2 text-sm font-semibold">
                                        <ClipboardList className="h-4 w-4 text-secondary" />
                                        Medicamentos de Uso Continuo
                                        <span className="ml-auto rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-bold text-secondary">{reconcilePatient.medications.length}</span>
                                    </h5>
                                </div>
                                <div className="divide-y divide-border">
                                    {reconcilePatient.medications.map(med => (
                                        <div key={med.id} className="flex items-center gap-3 px-5 py-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                                                <Pill className="h-4 w-4 text-secondary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{med.name}</p>
                                                <p className="text-xs text-muted-foreground">{med.dose} - {med.frequency}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: New Prescription */}
                            <div className="rounded-xl border border-border bg-card shadow-sm">
                                <div className="border-b border-border bg-primary/5 px-5 py-3">
                                    <h5 className="flex items-center gap-2 text-sm font-semibold">
                                        <FileWarning className="h-4 w-4 text-primary" />
                                        Nova Prescricao Hospitalar
                                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{newPrescription.length}</span>
                                    </h5>
                                </div>
                                <div className="p-5 space-y-3">
                                    <div className="grid grid-cols-3 gap-2">
                                        <MedicationAutocomplete
                                            value={prescriptionInput.name}
                                            onChange={(v) => setPrescriptionInput(prev => ({ ...prev, name: v }))}
                                            placeholder="Medicamento"
                                        />
                                        <input
                                            type="text"
                                            className="h-10 rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Dose"
                                            value={prescriptionInput.dose}
                                            onChange={e => setPrescriptionInput(prev => ({ ...prev, dose: e.target.value }))}
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="h-10 flex-1 rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="Frequencia"
                                                value={prescriptionInput.frequency}
                                                onChange={e => setPrescriptionInput(prev => ({ ...prev, frequency: e.target.value }))}
                                                onKeyDown={e => { if (e.key === 'Enter') handleAddToPrescription(); }}
                                            />
                                            <button
                                                className="inline-flex items-center rounded-lg bg-primary px-3 text-white hover:bg-primary-dark disabled:opacity-50"
                                                onClick={handleAddToPrescription}
                                                disabled={!prescriptionInput.name}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {newPrescription.length > 0 && (
                                        <div className="divide-y divide-border rounded-lg border border-border">
                                            {newPrescription.map((med, idx) => (
                                                <div key={med.id} className="flex items-center gap-3 px-4 py-2.5">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                                                        <Pill className="h-3.5 w-3.5 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="text-sm font-medium">{med.name}</span>
                                                        {med.dose && <span className="ml-2 text-xs text-muted-foreground">{med.dose}</span>}
                                                        {med.frequency && <span className="ml-2 text-xs text-muted-foreground">- {med.frequency}</span>}
                                                    </div>
                                                    <button
                                                        className="text-muted-foreground hover:text-red-500"
                                                        onClick={() => setNewPrescription(prev => prev.filter((_, i) => i !== idx))}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Execute Reconciliation button */}
                    {reconcilePatient && newPrescription.length > 0 && (
                        <div className="flex justify-center">
                            <button
                                className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
                                onClick={handleRunReconciliation}
                            >
                                <ShieldAlert className="h-6 w-6" />
                                Executar Reconciliacao
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    {/* Results */}
                    {reconcileResult && (
                        <div className="space-y-5">
                            <h4 className="flex items-center gap-2 text-lg font-bold">
                                <Activity className="h-5 w-5 text-primary" />
                                Resultado da Reconciliacao
                            </h4>

                            {/* Summary cards */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                                    <CheckCircle className="mx-auto mb-1 h-8 w-8 text-emerald-600" />
                                    <h3 className="text-2xl font-bold text-emerald-700">{reconcileResult.safe.length}</h3>
                                    <p className="text-sm font-medium text-emerald-600">Seguros</p>
                                </div>
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
                                    <AlertTriangle className="mx-auto mb-1 h-8 w-8 text-amber-600" />
                                    <h3 className="text-2xl font-bold text-amber-700">{reconcileResult.warnings.length}</h3>
                                    <p className="text-sm font-medium text-amber-600">Atencao</p>
                                </div>
                                <div className={cn('rounded-xl border border-red-200 bg-red-50 p-4 text-center', reconcileResult.blocked.length > 0 && 'animate-pulse')}>
                                    <XCircle className="mx-auto mb-1 h-8 w-8 text-red-600" />
                                    <h3 className="text-2xl font-bold text-red-700">{reconcileResult.blocked.length}</h3>
                                    <p className="text-sm font-medium text-red-600">Bloqueados</p>
                                </div>
                            </div>

                            {/* Blocked - Red cards */}
                            {reconcileResult.blocked.length > 0 && (
                                <div className="space-y-3">
                                    <h5 className="flex items-center gap-2 font-semibold text-red-700">
                                        <XCircle className="h-5 w-5" /> Bloqueados - Interacoes Graves
                                    </h5>
                                    {reconcileResult.blocked.map((item, idx) => (
                                        <div key={idx} className="animate-pulse rounded-xl border-2 border-red-300 bg-red-50 p-5">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-200">
                                                    <ShieldAlert className="h-6 w-6 text-red-700" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-red-800">{item.medication.name}</span>
                                                        <SeverityBadge severity="grave" large />
                                                    </div>
                                                    <p className="mt-1 text-sm font-medium text-red-700">{item.reason}</p>
                                                    {item.interactions.map((inter, i2) => (
                                                        <div key={i2} className="mt-3 rounded-lg bg-white/80 p-3">
                                                            <p className="text-sm">
                                                                <strong className="text-red-700">Interacao:</strong> {inter.drug1} + {inter.drug2}
                                                            </p>
                                                            <p className="mt-1 text-sm text-red-900">{inter.description}</p>
                                                            <p className="mt-2 text-sm font-semibold text-red-800">
                                                                <ChevronRight className="mr-1 inline h-4 w-4" />
                                                                {inter.recommendation}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Warnings - Amber cards */}
                            {reconcileResult.warnings.length > 0 && (
                                <div className="space-y-3">
                                    <h5 className="flex items-center gap-2 font-semibold text-amber-700">
                                        <AlertTriangle className="h-5 w-5" /> Atencao - Interacoes Moderadas
                                    </h5>
                                    {reconcileResult.warnings.map((item, idx) => (
                                        <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200">
                                                    <AlertTriangle className="h-5 w-5 text-amber-700" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base font-bold text-amber-800">{item.medication.name}</span>
                                                        <SeverityBadge severity="moderada" />
                                                    </div>
                                                    <p className="mt-1 text-sm text-amber-700">{item.reason}</p>
                                                    {item.interactions.map((inter, i2) => (
                                                        <div key={i2} className="mt-3 rounded-lg bg-white/70 p-3">
                                                            <p className="text-sm">
                                                                <strong className="text-amber-700">Interacao:</strong> {inter.drug1} + {inter.drug2}
                                                            </p>
                                                            <p className="mt-1 text-sm text-amber-900">{inter.description}</p>
                                                            <p className="mt-2 text-sm font-medium text-amber-800">
                                                                <ChevronRight className="mr-1 inline h-4 w-4" />
                                                                {inter.recommendation}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Safe - Green cards */}
                            {reconcileResult.safe.length > 0 && (
                                <div className="space-y-3">
                                    <h5 className="flex items-center gap-2 font-semibold text-emerald-700">
                                        <CheckCircle className="h-5 w-5" /> Seguros - Sem Interacoes Significativas
                                    </h5>
                                    <div className="grid grid-cols-2 gap-3">
                                        {reconcileResult.safe.map((item, idx) => (
                                            <div key={idx} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-200">
                                                        <ShieldCheck className="h-5 w-5 text-emerald-700" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-emerald-800">{item.medication.name}</p>
                                                        {item.medication.dose && (
                                                            <p className="text-xs text-emerald-600">{item.medication.dose} {item.medication.frequency && `- ${item.medication.frequency}`}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {item.interactions && item.interactions.length > 0 && (
                                                    <div className="mt-2 rounded-md bg-sky-50 p-2 text-xs text-sky-700">
                                                        <Info className="mr-1 inline h-3 w-3" />
                                                        Interacao leve: {item.interactions.map(i => i.type).join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!reconcilePatientId && (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-muted-foreground">
                            <GitCompare className="mb-3 h-12 w-12 opacity-20" />
                            <p className="text-sm font-medium">Selecione um paciente e adicione medicamentos da nova prescricao para executar a reconciliacao</p>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════
                TAB 3: Interacoes Medicamentosas (RF18)
                ═══════════════════════════════════════════ */}
            {activeTab === 'interactions' && (
                <div className="space-y-5">
                    {/* Alert banner for dangerous interactions */}
                    {hasGraveInteraction && (
                        <div className="animate-pulse rounded-lg border-2 border-red-300 bg-red-50 p-4">
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="h-6 w-6 text-red-600" />
                                <div>
                                    <p className="font-bold text-red-800">Interacao Grave Detectada!</p>
                                    <p className="text-sm text-red-700">Foram identificadas interacoes medicamentosas de alto risco. Revise imediatamente.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Input area */}
                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="border-b border-border px-5 py-3">
                            <h5 className="flex items-center gap-2 text-sm font-semibold">
                                <Search className="h-4 w-4 text-primary" />
                                Verificador Rapido de Interacoes
                            </h5>
                        </div>
                        <div className="p-5">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <MedicationAutocomplete
                                        value={interactionInput}
                                        onChange={setInteractionInput}
                                        placeholder="Digite o nome do medicamento e pressione Enter ou clique em +"
                                    />
                                </div>
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
                                    onClick={handleAddInteractionMed}
                                    disabled={!interactionInput.trim()}
                                >
                                    <Plus className="h-4 w-4" /> Adicionar
                                </button>
                            </div>

                            {/* Medication tags */}
                            {interactionMeds.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {interactionMeds.map((med, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium">
                                            <Pill className="h-3.5 w-3.5 text-primary" />
                                            {med}
                                            <button className="ml-1 text-muted-foreground hover:text-red-500" onClick={() => handleRemoveInteractionMed(idx)}>
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {interactionMeds.length > 0 && interactionMeds.length < 2 && (
                                <p className="mt-3 text-xs text-muted-foreground">Adicione pelo menos 2 medicamentos para verificar interacoes.</p>
                            )}
                        </div>
                    </div>

                    {/* Severity Legend */}
                    <div className="flex items-center gap-6 rounded-lg border border-border bg-muted/30 px-5 py-3">
                        <span className="text-xs font-semibold text-muted-foreground">Legenda:</span>
                        <span className="flex items-center gap-1.5 text-xs">
                            <span className="h-3 w-3 rounded-full bg-red-500"></span> Grave (bloqueio)
                        </span>
                        <span className="flex items-center gap-1.5 text-xs">
                            <span className="h-3 w-3 rounded-full bg-amber-500"></span> Moderada (alerta)
                        </span>
                        <span className="flex items-center gap-1.5 text-xs">
                            <span className="h-3 w-3 rounded-full bg-sky-500"></span> Leve (informativo)
                        </span>
                        <span className="flex items-center gap-1.5 text-xs">
                            <span className="h-3 w-3 rounded-full bg-emerald-500"></span> Sem interacao
                        </span>
                    </div>

                    {/* Interaction Matrix */}
                    {interactionMatrix && interactionMeds.length >= 2 && (
                        <div className="rounded-xl border border-border bg-card shadow-sm">
                            <div className="border-b border-border px-5 py-3">
                                <h5 className="flex items-center gap-2 text-sm font-semibold">
                                    <Activity className="h-4 w-4 text-primary" />
                                    Matriz de Interacoes
                                </h5>
                            </div>
                            <div className="overflow-x-auto p-5">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr>
                                            <th className="p-2 text-left text-xs font-semibold text-muted-foreground"></th>
                                            {interactionMeds.map(med => (
                                                <th key={med} className="p-2 text-center text-xs font-semibold text-muted-foreground">
                                                    <div className="max-w-[100px] truncate" title={med}>{med}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {interactionMeds.map(rowMed => (
                                            <tr key={rowMed}>
                                                <td className="p-2 text-xs font-semibold text-muted-foreground">
                                                    <div className="max-w-[100px] truncate" title={rowMed}>{rowMed}</div>
                                                </td>
                                                {interactionMeds.map(colMed => {
                                                    const cell = interactionMatrix[rowMed]?.[colMed];
                                                    const cellColor = {
                                                        grave: 'bg-red-500',
                                                        moderada: 'bg-amber-400',
                                                        leve: 'bg-sky-400',
                                                        none: 'bg-emerald-400',
                                                        null: 'bg-gray-200'
                                                    };
                                                    return (
                                                        <td key={colMed} className="p-2 text-center">
                                                            <div className={cn(
                                                                'mx-auto h-8 w-8 rounded-lg transition-all',
                                                                cellColor[cell === null ? 'null' : cell] || cellColor.none,
                                                                cell === 'grave' && 'animate-pulse shadow-md shadow-red-200',
                                                                cell === null && 'opacity-30'
                                                            )} title={cell === null ? 'Mesmo medicamento' : cell === 'none' ? 'Sem interacao' : `Interacao ${cell}`}></div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Interaction Results */}
                    {interactionResults && interactionResults.length > 0 && (
                        <div className="space-y-3">
                            <h5 className="flex items-center gap-2 font-semibold">
                                <Heart className="h-5 w-5 text-primary" />
                                Interacoes Encontradas ({interactionResults.length})
                            </h5>
                            {interactionResults.map((inter, idx) => {
                                const borderColor = {
                                    grave: 'border-red-300 bg-red-50',
                                    moderada: 'border-amber-200 bg-amber-50',
                                    leve: 'border-sky-200 bg-sky-50',
                                };
                                const iconBg = {
                                    grave: 'bg-red-200',
                                    moderada: 'bg-amber-200',
                                    leve: 'bg-sky-200',
                                };
                                const iconColor = {
                                    grave: 'text-red-700',
                                    moderada: 'text-amber-700',
                                    leve: 'text-sky-700',
                                };
                                const textColor = {
                                    grave: 'text-red-800',
                                    moderada: 'text-amber-800',
                                    leve: 'text-sky-800',
                                };
                                const Icon = inter.severity === 'grave' ? XCircle : inter.severity === 'moderada' ? AlertTriangle : Info;

                                return (
                                    <div key={idx} className={cn('rounded-xl border p-4', borderColor[inter.severity], inter.severity === 'grave' && 'animate-pulse border-2')}>
                                        <div className="flex items-start gap-4">
                                            <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', iconBg[inter.severity])}>
                                                <Icon className={cn('h-5 w-5', iconColor[inter.severity])} />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className={cn('font-bold', textColor[inter.severity])}>
                                                        {inter.drug1} + {inter.drug2}
                                                    </span>
                                                    <SeverityBadge severity={inter.severity} />
                                                </div>
                                                <p className={cn('text-sm font-medium', textColor[inter.severity])}>{inter.type}</p>
                                                <p className="text-sm text-foreground/80">{inter.description}</p>
                                                <div className="mt-2 rounded-lg bg-white/60 p-2.5">
                                                    <p className={cn('text-sm font-medium', textColor[inter.severity])}>
                                                        <ChevronRight className="mr-1 inline h-4 w-4" />
                                                        {inter.recommendation}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {interactionResults && interactionResults.length === 0 && interactionMeds.length >= 2 && (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 py-12">
                            <ShieldCheck className="mb-3 h-14 w-14 text-emerald-500" />
                            <p className="text-lg font-semibold text-emerald-700">Nenhuma interacao encontrada</p>
                            <p className="mt-1 text-sm text-emerald-600">Os medicamentos informados podem ser utilizados em conjunto com seguranca.</p>
                        </div>
                    )}

                    {interactionMeds.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-muted-foreground">
                            <Zap className="mb-3 h-12 w-12 opacity-20" />
                            <p className="text-sm font-medium">Adicione medicamentos acima para verificar interacoes em tempo real</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
