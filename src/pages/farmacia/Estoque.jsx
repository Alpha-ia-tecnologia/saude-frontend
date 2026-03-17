import { useState, Fragment } from 'react';
import { cn } from '@/lib/utils';
import {
    Package,
    AlertTriangle,
    Calendar,
    Check,
    Search,
    Plus,
    ChevronDown,
    ChevronRight,
    Clock,
    ClipboardList,
    Pill,
    CheckCircle2,
    Circle,
    X,
    Save,
    User,
    FileText,
    ArrowRight,
    Filter,
    RotateCcw,
} from 'lucide-react';

// ─── In-memory data ────────────────────────────────────────────────

const medications = [
    { id: 'MED001', nome: 'Losartana Potássica', concentracao: '50mg', forma: 'Comprimido', categoria: 'Anti-hipertensivo' },
    { id: 'MED002', nome: 'Metformina', concentracao: '850mg', forma: 'Comprimido', categoria: 'Antidiabético' },
    { id: 'MED003', nome: 'Omeprazol', concentracao: '20mg', forma: 'Cápsula', categoria: 'Antiulceroso' },
    { id: 'MED004', nome: 'Amoxicilina', concentracao: '500mg', forma: 'Cápsula', categoria: 'Antibiótico' },
    { id: 'MED005', nome: 'Dipirona Sódica', concentracao: '500mg', forma: 'Comprimido', categoria: 'Analgésico' },
    { id: 'MED006', nome: 'Salbutamol', concentracao: '100mcg', forma: 'Aerosol', categoria: 'Broncodilatador' },
    { id: 'MED007', nome: 'Atenolol', concentracao: '25mg', forma: 'Comprimido', categoria: 'Anti-hipertensivo' },
    { id: 'MED008', nome: 'Insulina NPH', concentracao: '100UI/ml', forma: 'Frasco', categoria: 'Antidiabético' },
    { id: 'MED009', nome: 'Ceftriaxona', concentracao: '1g', forma: 'Injetável', categoria: 'Antibiótico' },
    { id: 'MED010', nome: 'Enoxaparina', concentracao: '40mg', forma: 'Injetável', categoria: 'Anticoagulante' },
    { id: 'MED011', nome: 'Furosemida', concentracao: '40mg', forma: 'Comprimido', categoria: 'Diurético' },
    { id: 'MED012', nome: 'Paracetamol', concentracao: '750mg', forma: 'Comprimido', categoria: 'Analgésico' },
    { id: 'MED013', nome: 'Azitromicina', concentracao: '500mg', forma: 'Comprimido', categoria: 'Antibiótico' },
    { id: 'MED014', nome: 'Prednisona', concentracao: '20mg', forma: 'Comprimido', categoria: 'Anti-inflamatório' },
    { id: 'MED015', nome: 'Sinvastatina', concentracao: '20mg', forma: 'Comprimido', categoria: 'Hipolipemiante' },
    { id: 'MED016', nome: 'Captopril', concentracao: '25mg', forma: 'Comprimido', categoria: 'Anti-hipertensivo' },
    { id: 'MED017', nome: 'Ibuprofeno', concentracao: '600mg', forma: 'Comprimido', categoria: 'Anti-inflamatório' },
    { id: 'MED018', nome: 'Ciprofloxacino', concentracao: '500mg', forma: 'Comprimido', categoria: 'Antibiótico' },
    { id: 'MED019', nome: 'Dexametasona', concentracao: '4mg', forma: 'Comprimido', categoria: 'Anti-inflamatório' },
    { id: 'MED020', nome: 'Ranitidina', concentracao: '150mg', forma: 'Comprimido', categoria: 'Antiulceroso' },
    { id: 'MED021', nome: 'Metoclopramida', concentracao: '10mg', forma: 'Comprimido', categoria: 'Antiemético' },
    { id: 'MED022', nome: 'Hidroclorotiazida', concentracao: '25mg', forma: 'Comprimido', categoria: 'Diurético' },
];

const initialLots = [
    { id: 'LOT001', medicationId: 'MED001', lote: 'LOS-2025-A01', validade: '2026-12-15', quantidade: 1200, fabricante: 'EMS' },
    { id: 'LOT002', medicationId: 'MED001', lote: 'LOS-2025-B02', validade: '2026-04-20', quantidade: 800, fabricante: 'EMS' },
    { id: 'LOT003', medicationId: 'MED001', lote: 'LOS-2026-A01', validade: '2027-08-30', quantidade: 500, fabricante: 'Medley' },
    { id: 'LOT004', medicationId: 'MED002', lote: 'MET-2025-C01', validade: '2026-05-10', quantidade: 900, fabricante: 'Merck' },
    { id: 'LOT005', medicationId: 'MED002', lote: 'MET-2026-A01', validade: '2027-03-25', quantidade: 600, fabricante: 'Merck' },
    { id: 'LOT006', medicationId: 'MED003', lote: 'OME-2024-D02', validade: '2026-04-01', quantidade: 150, fabricante: 'Medley' },
    { id: 'LOT007', medicationId: 'MED003', lote: 'OME-2025-A01', validade: '2026-09-15', quantidade: 400, fabricante: 'Medley' },
    { id: 'LOT008', medicationId: 'MED003', lote: 'OME-2026-A01', validade: '2027-06-30', quantidade: 300, fabricante: 'EMS' },
    { id: 'LOT009', medicationId: 'MED004', lote: 'AMO-2024-B01', validade: '2026-03-15', quantidade: 80, fabricante: 'Eurofarma' },
    { id: 'LOT010', medicationId: 'MED004', lote: 'AMO-2025-A01', validade: '2026-11-20', quantidade: 600, fabricante: 'Eurofarma' },
    { id: 'LOT011', medicationId: 'MED005', lote: 'DIP-2025-A01', validade: '2027-01-15', quantidade: 1500, fabricante: 'Neo Química' },
    { id: 'LOT012', medicationId: 'MED005', lote: 'DIP-2025-B01', validade: '2027-05-30', quantidade: 1000, fabricante: 'Neo Química' },
    { id: 'LOT013', medicationId: 'MED005', lote: 'DIP-2026-A01', validade: '2028-02-28', quantidade: 700, fabricante: 'EMS' },
    { id: 'LOT014', medicationId: 'MED006', lote: 'SAL-2025-A01', validade: '2026-06-30', quantidade: 25, fabricante: 'GSK' },
    { id: 'LOT015', medicationId: 'MED006', lote: 'SAL-2025-B01', validade: '2026-12-15', quantidade: 20, fabricante: 'GSK' },
    { id: 'LOT016', medicationId: 'MED007', lote: 'ATE-2025-A01', validade: '2026-09-20', quantidade: 700, fabricante: 'Biolab' },
    { id: 'LOT017', medicationId: 'MED007', lote: 'ATE-2026-A01', validade: '2027-06-15', quantidade: 500, fabricante: 'Biolab' },
    { id: 'LOT018', medicationId: 'MED008', lote: 'INS-2025-A01', validade: '2026-04-10', quantidade: 30, fabricante: 'Lilly' },
    { id: 'LOT019', medicationId: 'MED008', lote: 'INS-2026-A01', validade: '2027-02-28', quantidade: 50, fabricante: 'Lilly' },
    { id: 'LOT020', medicationId: 'MED009', lote: 'CEF-2025-A01', validade: '2026-07-20', quantidade: 200, fabricante: 'Eurofarma' },
    { id: 'LOT021', medicationId: 'MED009', lote: 'CEF-2026-A01', validade: '2027-05-10', quantidade: 150, fabricante: 'EMS' },
    { id: 'LOT022', medicationId: 'MED010', lote: 'ENO-2025-B01', validade: '2026-08-15', quantidade: 100, fabricante: 'Sanofi' },
    { id: 'LOT023', medicationId: 'MED010', lote: 'ENO-2026-A01', validade: '2027-04-30', quantidade: 80, fabricante: 'Sanofi' },
    { id: 'LOT024', medicationId: 'MED011', lote: 'FUR-2025-A01', validade: '2026-10-10', quantidade: 500, fabricante: 'Neo Química' },
    { id: 'LOT025', medicationId: 'MED011', lote: 'FUR-2026-A01', validade: '2027-07-20', quantidade: 400, fabricante: 'EMS' },
    { id: 'LOT026', medicationId: 'MED012', lote: 'PAR-2025-A01', validade: '2026-05-01', quantidade: 800, fabricante: 'Medley' },
    { id: 'LOT027', medicationId: 'MED012', lote: 'PAR-2025-B01', validade: '2026-11-30', quantidade: 1200, fabricante: 'Medley' },
    { id: 'LOT028', medicationId: 'MED012', lote: 'PAR-2026-A01', validade: '2027-08-15', quantidade: 600, fabricante: 'EMS' },
    { id: 'LOT029', medicationId: 'MED013', lote: 'AZI-2025-A01', validade: '2026-06-15', quantidade: 300, fabricante: 'Eurofarma' },
    { id: 'LOT030', medicationId: 'MED013', lote: 'AZI-2026-A01', validade: '2027-03-20', quantidade: 200, fabricante: 'EMS' },
    { id: 'LOT031', medicationId: 'MED014', lote: 'PRE-2025-A01', validade: '2026-04-25', quantidade: 400, fabricante: 'EMS' },
    { id: 'LOT032', medicationId: 'MED014', lote: 'PRE-2026-A01', validade: '2027-01-10', quantidade: 350, fabricante: 'Medley' },
    { id: 'LOT033', medicationId: 'MED015', lote: 'SIN-2025-A01', validade: '2026-08-20', quantidade: 600, fabricante: 'Biolab' },
    { id: 'LOT034', medicationId: 'MED015', lote: 'SIN-2026-A01', validade: '2027-05-15', quantidade: 450, fabricante: 'EMS' },
    { id: 'LOT035', medicationId: 'MED016', lote: 'CAP-2024-C01', validade: '2026-03-20', quantidade: 60, fabricante: 'Biolab' },
    { id: 'LOT036', medicationId: 'MED016', lote: 'CAP-2025-A01', validade: '2026-10-30', quantidade: 500, fabricante: 'EMS' },
    { id: 'LOT037', medicationId: 'MED017', lote: 'IBU-2025-A01', validade: '2026-07-10', quantidade: 700, fabricante: 'Neo Química' },
    { id: 'LOT038', medicationId: 'MED017', lote: 'IBU-2026-A01', validade: '2027-04-25', quantidade: 500, fabricante: 'Medley' },
    { id: 'LOT039', medicationId: 'MED018', lote: 'CIP-2025-A01', validade: '2026-09-05', quantidade: 250, fabricante: 'Eurofarma' },
    { id: 'LOT040', medicationId: 'MED018', lote: 'CIP-2026-A01', validade: '2027-06-20', quantidade: 200, fabricante: 'EMS' },
    { id: 'LOT041', medicationId: 'MED019', lote: 'DEX-2025-B01', validade: '2026-05-18', quantidade: 350, fabricante: 'EMS' },
    { id: 'LOT042', medicationId: 'MED019', lote: 'DEX-2026-A01', validade: '2027-02-14', quantidade: 300, fabricante: 'Medley' },
    { id: 'LOT043', medicationId: 'MED020', lote: 'RAN-2025-A01', validade: '2026-06-28', quantidade: 450, fabricante: 'Medley' },
    { id: 'LOT044', medicationId: 'MED020', lote: 'RAN-2026-A01', validade: '2027-03-10', quantidade: 300, fabricante: 'EMS' },
    { id: 'LOT045', medicationId: 'MED021', lote: 'MTC-2025-A01', validade: '2026-04-05', quantidade: 200, fabricante: 'Neo Química' },
    { id: 'LOT046', medicationId: 'MED021', lote: 'MTC-2026-A01', validade: '2027-01-25', quantidade: 250, fabricante: 'EMS' },
    { id: 'LOT047', medicationId: 'MED022', lote: 'HCT-2025-A01', validade: '2026-08-12', quantidade: 550, fabricante: 'EMS' },
    { id: 'LOT048', medicationId: 'MED022', lote: 'HCT-2026-A01', validade: '2027-05-05', quantidade: 400, fabricante: 'Biolab' },
];

const initialPrescriptions = [
    {
        id: 'PRESC001', paciente: 'Maria Silva Santos', prontuario: 'PRONT-2025-0012',
        medico: 'Dr. Carlos Oliveira', dataHora: '2026-03-14T08:30:00', status: 'recebida',
        itens: [
            { medicationId: 'MED001', nome: 'Losartana Potássica 50mg', quantidade: 30, separado: false },
            { medicationId: 'MED005', nome: 'Dipirona Sódica 500mg', quantidade: 20, separado: false },
            { medicationId: 'MED008', nome: 'Insulina NPH 100UI/ml', quantidade: 2, separado: false },
        ],
    },
    {
        id: 'PRESC002', paciente: 'José Carlos Oliveira', prontuario: 'PRONT-2025-0034',
        medico: 'Dra. Ana Santos', dataHora: '2026-03-14T09:15:00', status: 'recebida',
        itens: [
            { medicationId: 'MED009', nome: 'Ceftriaxona 1g', quantidade: 14, separado: false },
            { medicationId: 'MED003', nome: 'Omeprazol 20mg', quantidade: 7, separado: false },
        ],
    },
    {
        id: 'PRESC003', paciente: 'Ana Paula Ferreira', prontuario: 'PRONT-2025-0056',
        medico: 'Dr. Paulo Lima', dataHora: '2026-03-14T07:45:00', status: 'em_separacao',
        itens: [
            { medicationId: 'MED010', nome: 'Enoxaparina 40mg', quantidade: 7, separado: true },
            { medicationId: 'MED005', nome: 'Dipirona Sódica 500mg', quantidade: 28, separado: true },
            { medicationId: 'MED019', nome: 'Dexametasona 4mg', quantidade: 5, separado: false },
        ],
    },
    {
        id: 'PRESC004', paciente: 'Pedro Henrique Lima', prontuario: 'PRONT-2025-0078',
        medico: 'Dr. Carlos Oliveira', dataHora: '2026-03-13T14:20:00', status: 'separada',
        itens: [
            { medicationId: 'MED007', nome: 'Atenolol 25mg', quantidade: 14, separado: true },
            { medicationId: 'MED002', nome: 'Metformina 850mg', quantidade: 42, separado: true },
            { medicationId: 'MED011', nome: 'Furosemida 40mg', quantidade: 28, separado: true },
        ],
    },
    {
        id: 'PRESC005', paciente: 'Luísa Mendes Costa', prontuario: 'PRONT-2025-0090',
        medico: 'Dra. Ana Santos', dataHora: '2026-03-13T10:00:00', status: 'dispensada',
        itens: [
            { medicationId: 'MED015', nome: 'Sinvastatina 20mg', quantidade: 30, separado: true },
            { medicationId: 'MED016', nome: 'Captopril 25mg', quantidade: 60, separado: true },
            { medicationId: 'MED012', nome: 'Paracetamol 750mg', quantidade: 10, separado: true },
        ],
    },
];

const initialDispensations = [
    { id: 'DISP001', paciente: 'Luísa Mendes Costa', medicamento: 'Sinvastatina 20mg', lote: 'SIN-2025-A01', quantidade: 30, responsavel: 'Farm. Juliana Rocha', dataHora: '2026-03-13T11:30:00' },
    { id: 'DISP002', paciente: 'Luísa Mendes Costa', medicamento: 'Captopril 25mg', lote: 'CAP-2024-C01', quantidade: 60, responsavel: 'Farm. Juliana Rocha', dataHora: '2026-03-13T11:30:00' },
    { id: 'DISP003', paciente: 'Luísa Mendes Costa', medicamento: 'Paracetamol 750mg', lote: 'PAR-2025-A01', quantidade: 10, responsavel: 'Farm. Juliana Rocha', dataHora: '2026-03-13T11:30:00' },
    { id: 'DISP004', paciente: 'Carlos Alberto Souza', medicamento: 'Losartana Potássica 50mg', lote: 'LOS-2025-A01', quantidade: 30, responsavel: 'Farm. Ricardo Mendes', dataHora: '2026-03-13T14:00:00' },
    { id: 'DISP005', paciente: 'Fernanda Lima', medicamento: 'Ibuprofeno 600mg', lote: 'IBU-2025-A01', quantidade: 12, responsavel: 'Farm. Juliana Rocha', dataHora: '2026-03-13T15:20:00' },
    { id: 'DISP006', paciente: 'Roberto Nascimento', medicamento: 'Azitromicina 500mg', lote: 'AZI-2025-A01', quantidade: 3, responsavel: 'Farm. Ricardo Mendes', dataHora: '2026-03-14T08:00:00' },
    { id: 'DISP007', paciente: 'Patrícia Gomes', medicamento: 'Omeprazol 20mg', lote: 'OME-2024-D02', quantidade: 30, responsavel: 'Farm. Juliana Rocha', dataHora: '2026-03-14T08:45:00' },
    { id: 'DISP008', paciente: 'Marcos Almeida', medicamento: 'Atenolol 25mg', lote: 'ATE-2025-A01', quantidade: 30, responsavel: 'Farm. Ricardo Mendes', dataHora: '2026-03-14T09:10:00' },
    { id: 'DISP009', paciente: 'Juliana Ferreira', medicamento: 'Metformina 850mg', lote: 'MET-2025-C01', quantidade: 60, responsavel: 'Farm. Juliana Rocha', dataHora: '2026-03-14T09:30:00' },
    { id: 'DISP010', paciente: 'Eduardo Santos', medicamento: 'Dipirona Sódica 500mg', lote: 'DIP-2025-A01', quantidade: 10, responsavel: 'Farm. Ricardo Mendes', dataHora: '2026-03-14T10:15:00' },
];

// ─── Helpers ───────────────────────────────────────────────────────

const now = new Date();

function daysUntil(dateStr) {
    return Math.ceil((new Date(dateStr) - now) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
}

function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

function expiryColor(dateStr) {
    const d = daysUntil(dateStr);
    if (d <= 0) return 'text-red-700 bg-red-100';
    if (d <= 30) return 'text-red-600 bg-red-50';
    if (d <= 90) return 'text-amber-600 bg-amber-50';
    return 'text-emerald-600 bg-emerald-50';
}

function expiryBadge(dateStr) {
    const d = daysUntil(dateStr);
    if (d <= 0) return { label: 'Vencido', cls: 'bg-red-100 text-red-800' };
    if (d <= 30) return { label: `${d}d restantes`, cls: 'bg-red-100 text-red-700' };
    if (d <= 90) return { label: `${d}d restantes`, cls: 'bg-amber-100 text-amber-700' };
    return { label: `${d}d restantes`, cls: 'bg-emerald-100 text-emerald-700' };
}

const statusConfig = {
    recebida: { label: 'Recebida', cls: 'bg-sky-100 text-sky-800' },
    em_separacao: { label: 'Em Separação', cls: 'bg-amber-100 text-amber-800' },
    separada: { label: 'Separada', cls: 'bg-emerald-100 text-emerald-800' },
    dispensada: { label: 'Dispensada', cls: 'bg-gray-100 text-gray-600' },
};

// ─── Component ─────────────────────────────────────────────────────

export default function Estoque() {
    const [activeTab, setActiveTab] = useState('estoque');
    const [lots, setLots] = useState(initialLots);
    const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
    const [dispensations] = useState(initialDispensations);
    const [pesquisa, setPesquisa] = useState('');
    const [filtroValidade, setFiltroValidade] = useState('todos');
    const [expandedMeds, setExpandedMeds] = useState({});
    const [showAddLotModal, setShowAddLotModal] = useState(false);
    const [separatingId, setSeparatingId] = useState(null);

    // New lot form state
    const [newLot, setNewLot] = useState({ medicationId: '', lote: '', validade: '', quantidade: '', fabricante: '' });

    // ── Build inventory from medications + lots ────────────────────
    const inventory = medications.map(med => {
        const medLots = lots
            .filter(l => l.medicationId === med.id)
            .sort((a, b) => new Date(a.validade) - new Date(b.validade));
        const quantidadeTotal = medLots.reduce((s, l) => s + l.quantidade, 0);
        const hasExpiringSoon = medLots.some(l => daysUntil(l.validade) <= 30 && daysUntil(l.validade) > 0);
        const hasExpired = medLots.some(l => daysUntil(l.validade) <= 0);
        let status = 'disponivel';
        if (quantidadeTotal === 0) status = 'esgotado';
        else if (hasExpired) status = 'vencido';
        else if (hasExpiringSoon) status = 'vencendo';
        else if (quantidadeTotal < 100) status = 'baixo';
        return { ...med, lotes: medLots, quantidadeTotal, status };
    });

    // Expiring alerts
    const expiringCount30 = lots.filter(l => { const d = daysUntil(l.validade); return d > 0 && d <= 30; }).length;
    const expiringCount90 = lots.filter(l => { const d = daysUntil(l.validade); return d > 0 && d <= 90; }).length;
    const expiredCount = lots.filter(l => daysUntil(l.validade) <= 0).length;

    // Filter inventory
    const filteredInventory = inventory.filter(med => {
        const matchSearch = !pesquisa || med.nome.toLowerCase().includes(pesquisa.toLowerCase()) || med.lotes.some(l => l.lote.toLowerCase().includes(pesquisa.toLowerCase()));
        let matchExpiry = true;
        if (filtroValidade === 'vencido') matchExpiry = med.status === 'vencido';
        else if (filtroValidade === 'vencendo30') matchExpiry = med.lotes.some(l => { const d = daysUntil(l.validade); return d > 0 && d <= 30; });
        else if (filtroValidade === 'vencendo90') matchExpiry = med.lotes.some(l => { const d = daysUntil(l.validade); return d > 0 && d <= 90; });
        else if (filtroValidade === 'baixo') matchExpiry = med.status === 'baixo' || med.status === 'esgotado';
        return matchSearch && matchExpiry;
    });

    // Pending prescriptions
    const pendingPrescriptions = prescriptions.filter(p => p.status !== 'dispensada');

    function toggleExpand(medId) {
        setExpandedMeds(prev => ({ ...prev, [medId]: !prev[medId] }));
    }

    function handleAddLot() {
        if (!newLot.medicationId || !newLot.lote || !newLot.validade || !newLot.quantidade) return;
        const id = `LOT${String(lots.length + 1).padStart(3, '0')}`;
        setLots(prev => [...prev, { ...newLot, id, quantidade: parseInt(newLot.quantidade, 10) }]);
        setNewLot({ medicationId: '', lote: '', validade: '', quantidade: '', fabricante: '' });
        setShowAddLotModal(false);
    }

    function handleToggleSeparado(prescId, itemIdx) {
        setPrescriptions(prev => prev.map(p => {
            if (p.id !== prescId) return p;
            const updatedItens = p.itens.map((it, i) => i === itemIdx ? { ...it, separado: !it.separado } : it);
            const allSep = updatedItens.every(it => it.separado);
            const someSep = updatedItens.some(it => it.separado);
            return { ...p, itens: updatedItens, status: allSep ? 'separada' : someSep ? 'em_separacao' : 'recebida' };
        }));
    }

    function handleConfirmSeparation(prescId) {
        setPrescriptions(prev => prev.map(p => {
            if (p.id !== prescId) return p;
            return { ...p, itens: p.itens.map(it => ({ ...it, separado: true })), status: 'separada' };
        }));
        setSeparatingId(null);
    }

    const tabs = [
        { id: 'estoque', label: 'Estoque e Lotes', icon: Package },
        { id: 'prescricoes', label: 'Prescrições Pendentes', icon: ClipboardList },
        { id: 'dispensacao', label: 'Dispensação', icon: Pill },
    ];

    // ── Render ─────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                    <Package className="h-6 w-6 text-secondary" />
                    Farmácia - Estoque e Dispensação
                </h1>
                <button
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                    onClick={() => setShowAddLotModal(true)}
                >
                    <Plus className="h-4 w-4" /> Adicionar Lote
                </button>
            </div>

            {/* Alert banners */}
            {(expiringCount30 > 0 || expiredCount > 0) && (
                <div className="space-y-2">
                    {expiredCount > 0 && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span><strong>Atenção:</strong> {expiredCount} lote(s) com validade expirada. Retirar do estoque imediatamente.</span>
                        </div>
                    )}
                    {expiringCount30 > 0 && (
                        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span><strong>Vencimento Próximo:</strong> {expiringCount30} lote(s) vencem nos próximos 30 dias. Total em 90 dias: {expiringCount90}.</span>
                        </div>
                    )}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4">
                {[
                    { label: 'Total Medicamentos', value: medications.length, color: 'border-l-primary', textColor: 'text-primary' },
                    { label: 'Lotes Ativos', value: lots.length, color: 'border-l-secondary', textColor: 'text-secondary' },
                    { label: 'Vencendo (30d)', value: expiringCount30, color: 'border-l-red-500', textColor: 'text-red-500' },
                    { label: 'Vencendo (90d)', value: expiringCount90, color: 'border-l-amber-400', textColor: 'text-amber-500' },
                    { label: 'Prescrições Pend.', value: pendingPrescriptions.filter(p => p.status !== 'dispensada').length, color: 'border-l-sky-500', textColor: 'text-sky-500' },
                ].map((s, i) => (
                    <div key={i} className={cn('rounded-xl border border-border bg-card shadow-sm border-l-4', s.color)}>
                        <div className="p-4 text-center">
                            <h2 className={cn('text-2xl font-bold', s.textColor)}>{s.value}</h2>
                            <small className="text-muted-foreground">{s.label}</small>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                            activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ═══ TAB 1: Estoque e Lotes ═══ */}
            {activeTab === 'estoque' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-end gap-4">
                            <div className="flex-1">
                                <label className="mb-1 block text-sm font-medium text-foreground">Pesquisar</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="h-10 w-full rounded-lg border border-input bg-white pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Medicamento ou número do lote..."
                                        value={pesquisa}
                                        onChange={e => setPesquisa(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="w-56">
                                <label className="mb-1 block text-sm font-medium text-foreground">Filtrar por Validade</label>
                                <select
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={filtroValidade}
                                    onChange={e => setFiltroValidade(e.target.value)}
                                >
                                    <option value="todos">Todos</option>
                                    <option value="vencido">Vencidos</option>
                                    <option value="vencendo30">Vencendo em 30 dias</option>
                                    <option value="vencendo90">Vencendo em 90 dias</option>
                                    <option value="baixo">Estoque Baixo / Esgotado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="px-5 pt-4 pb-2">
                            <h5 className="font-semibold">Inventário ({filteredInventory.length} medicamentos)</h5>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="w-8 px-4 py-3" />
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Medicamento</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Forma</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Lotes</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Qtd Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredInventory.map(med => {
                                    const isExpanded = expandedMeds[med.id];
                                    const statusBadge = {
                                        disponivel: { label: 'Disponível', cls: 'bg-emerald-100 text-emerald-800' },
                                        baixo: { label: 'Estoque Baixo', cls: 'bg-amber-100 text-amber-800' },
                                        vencendo: { label: 'Vencendo', cls: 'bg-red-100 text-red-700' },
                                        vencido: { label: 'Lote Vencido', cls: 'bg-red-200 text-red-900' },
                                        esgotado: { label: 'Esgotado', cls: 'bg-gray-100 text-gray-600' },
                                    }[med.status];

                                    return (
                                        <Fragment key={med.id}>
                                            <tr
                                                className="cursor-pointer hover:bg-muted/30"
                                                onClick={() => toggleExpand(med.id)}
                                            >
                                                <td className="px-4 py-3">
                                                    {isExpanded
                                                        ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                        : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    }
                                                </td>
                                                <td className="px-4 py-3">
                                                    <strong>{med.nome}</strong>
                                                    <br />
                                                    <small className="text-muted-foreground">{med.concentracao} - {med.categoria}</small>
                                                </td>
                                                <td className="px-4 py-3">{med.forma}</td>
                                                <td className="px-4 py-3 font-medium">{med.lotes.length}</td>
                                                <td className="px-4 py-3 font-semibold">{med.quantidadeTotal}</td>
                                                <td className="px-4 py-3">
                                                    <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', statusBadge.cls)}>
                                                        {statusBadge.label}
                                                    </span>
                                                </td>
                                            </tr>
                                            {isExpanded && med.lotes.map(lot => {
                                                const eb = expiryBadge(lot.validade);
                                                return (
                                                    <tr key={lot.id} className="bg-muted/20">
                                                        <td className="px-4 py-2" />
                                                        <td className="px-4 py-2 pl-12">
                                                            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{lot.lote}</code>
                                                            <span className="ml-2 text-xs text-muted-foreground">{lot.fabricante}</span>
                                                        </td>
                                                        <td className="px-4 py-2" />
                                                        <td className="px-4 py-2">
                                                            <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', eb.cls)}>
                                                                {formatDate(lot.validade)} ({eb.label})
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 font-medium">{lot.quantidade}</td>
                                                        <td className="px-4 py-2">
                                                            {daysUntil(lot.validade) <= 30 && (
                                                                <AlertTriangle className="inline h-4 w-4 text-red-500" />
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredInventory.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                <Package className="mx-auto mb-2 h-10 w-10 opacity-40" />
                                <p>Nenhum medicamento encontrado com os filtros aplicados.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══ TAB 2: Prescrições Pendentes ═══ */}
            {activeTab === 'prescricoes' && (
                <div className="space-y-4">
                    {pendingPrescriptions.length === 0 ? (
                        <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
                            <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-400" />
                            <p className="text-lg font-medium text-foreground">Nenhuma prescrição pendente</p>
                            <p className="text-sm text-muted-foreground">Todas as prescrições foram dispensadas.</p>
                        </div>
                    ) : (
                        pendingPrescriptions.map(presc => {
                            const sc = statusConfig[presc.status];
                            const isSeparating = separatingId === presc.id;
                            const allSeparated = presc.itens.every(it => it.separado);

                            return (
                                <div key={presc.id} className="rounded-xl border border-border bg-card shadow-sm">
                                    {/* Prescription header */}
                                    <div className="flex items-center justify-between border-b border-border px-5 py-3">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-primary" />
                                                    <strong>{presc.id}</strong>
                                                    <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', sc.cls)}>{sc.label}</span>
                                                </div>
                                                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {presc.paciente}</span>
                                                    <span>{presc.medico}</span>
                                                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatDateTime(presc.dataHora)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {presc.status !== 'separada' && (
                                                <button
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
                                                    onClick={() => setSeparatingId(isSeparating ? null : presc.id)}
                                                >
                                                    <ClipboardList className="h-4 w-4" />
                                                    {isSeparating ? 'Fechar' : 'Separar'}
                                                </button>
                                            )}
                                            {presc.status === 'separada' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700">
                                                    <CheckCircle2 className="h-4 w-4" /> Pronta para dispensação
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="p-5">
                                        <table className="w-full text-sm">
                                            <thead className="border-b border-border bg-muted/30">
                                                <tr>
                                                    {(isSeparating || presc.status === 'em_separacao') && (
                                                        <th className="w-10 px-3 py-2" />
                                                    )}
                                                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Medicamento</th>
                                                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Quantidade</th>
                                                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {presc.itens.map((item, idx) => (
                                                    <tr key={idx} className={item.separado ? 'bg-emerald-50/50' : ''}>
                                                        {(isSeparating || presc.status === 'em_separacao') && (
                                                            <td className="px-3 py-2 text-center">
                                                                <button onClick={() => handleToggleSeparado(presc.id, idx)}>
                                                                    {item.separado
                                                                        ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                                        : <Circle className="h-5 w-5 text-gray-300" />
                                                                    }
                                                                </button>
                                                            </td>
                                                        )}
                                                        <td className="px-3 py-2 font-medium">{item.nome}</td>
                                                        <td className="px-3 py-2">{item.quantidade} un.</td>
                                                        <td className="px-3 py-2">
                                                            {item.separado
                                                                ? <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"><Check className="h-3 w-3" /> Separado</span>
                                                                : <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Pendente</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {isSeparating && (
                                            <div className="mt-4 flex justify-end gap-2">
                                                <button
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                                    onClick={() => setSeparatingId(null)}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    className={cn(
                                                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white',
                                                        allSeparated ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-300 cursor-not-allowed'
                                                    )}
                                                    disabled={!allSeparated}
                                                    onClick={() => handleConfirmSeparation(presc.id)}
                                                >
                                                    <CheckCircle2 className="h-4 w-4" /> Confirmar Separação
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* ═══ TAB 3: Dispensação ═══ */}
            {activeTab === 'dispensacao' && (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="px-5 pt-4 pb-2">
                        <h5 className="font-semibold">Histórico de Dispensação ({dispensations.length} registros)</h5>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Data / Hora</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Paciente</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Medicamento</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Lote</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Quantidade</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Responsável</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[...dispensations].sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora)).map(d => (
                                <tr key={d.id}>
                                    <td className="px-4 py-3">{formatDateTime(d.dataHora)}</td>
                                    <td className="px-4 py-3 font-medium">{d.paciente}</td>
                                    <td className="px-4 py-3">{d.medicamento}</td>
                                    <td className="px-4 py-3"><code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{d.lote}</code></td>
                                    <td className="px-4 py-3">{d.quantidade}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{d.responsavel}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ═══ Add Lot Modal ═══ */}
            {showAddLotModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowAddLotModal(false)}
                >
                    <div
                        className="w-[550px] max-w-[90%] rounded-xl border border-border bg-card shadow-sm"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-border bg-primary px-5 py-3 text-sm font-semibold text-white">
                            <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Adicionar Novo Lote</span>
                            <button className="rounded-lg bg-white/20 px-2 py-1 text-white hover:bg-white/30" onClick={() => setShowAddLotModal(false)}>
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Medicamento *</label>
                                <select
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={newLot.medicationId}
                                    onChange={e => setNewLot(p => ({ ...p, medicationId: e.target.value }))}
                                >
                                    <option value="">Selecione...</option>
                                    {medications.map(m => (
                                        <option key={m.id} value={m.id}>{m.nome} {m.concentracao}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Número do Lote *</label>
                                    <input
                                        type="text"
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Ex: LOS-2026-B01"
                                        value={newLot.lote}
                                        onChange={e => setNewLot(p => ({ ...p, lote: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Data de Validade *</label>
                                    <input
                                        type="date"
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={newLot.validade}
                                        onChange={e => setNewLot(p => ({ ...p, validade: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Quantidade *</label>
                                    <input
                                        type="number"
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Ex: 500"
                                        value={newLot.quantidade}
                                        onChange={e => setNewLot(p => ({ ...p, quantidade: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-foreground">Fabricante</label>
                                    <input
                                        type="text"
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Ex: EMS"
                                        value={newLot.fabricante}
                                        onChange={e => setNewLot(p => ({ ...p, fabricante: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                    onClick={() => setShowAddLotModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                                    onClick={handleAddLot}
                                >
                                    <Save className="h-4 w-4" /> Salvar Lote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

