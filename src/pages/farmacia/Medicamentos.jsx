import { useState } from 'react';

// Sample medications data
const medicamentosData = [
    {
        id: 1,
        nome: 'Losartana Potássica',
        concentracao: '50mg',
        formaFarmaceutica: 'Comprimido',
        categoria: 'Anti-hipertensivo',
        estoque: 2500,
        estoqueMinimo: 500,
        lote: 'LOT2025001',
        validade: '2026-06-15',
        fabricante: 'EMS',
        status: 'disponivel'
    },
    {
        id: 2,
        nome: 'Metformina',
        concentracao: '850mg',
        formaFarmaceutica: 'Comprimido',
        categoria: 'Antidiabético',
        estoque: 1800,
        estoqueMinimo: 400,
        lote: 'LOT2025002',
        validade: '2026-03-20',
        fabricante: 'Merck',
        status: 'disponivel'
    },
    {
        id: 3,
        nome: 'Omeprazol',
        concentracao: '20mg',
        formaFarmaceutica: 'Cápsula',
        categoria: 'Antiulceroso',
        estoque: 320,
        estoqueMinimo: 300,
        lote: 'LOT2025003',
        validade: '2025-08-10',
        fabricante: 'Medley',
        status: 'baixo'
    },
    {
        id: 4,
        nome: 'Amoxicilina',
        concentracao: '500mg',
        formaFarmaceutica: 'Cápsula',
        categoria: 'Antibiótico',
        estoque: 850,
        estoqueMinimo: 200,
        lote: 'LOT2025004',
        validade: '2025-05-01',
        fabricante: 'Eurofarma',
        status: 'vencendo'
    },
    {
        id: 5,
        nome: 'Dipirona Sódica',
        concentracao: '500mg',
        formaFarmaceutica: 'Comprimido',
        categoria: 'Analgésico',
        estoque: 3200,
        estoqueMinimo: 600,
        lote: 'LOT2025005',
        validade: '2027-01-15',
        fabricante: 'Neo Química',
        status: 'disponivel'
    },
    {
        id: 6,
        nome: 'Salbutamol',
        concentracao: '100mcg',
        formaFarmaceutica: 'Aerosol',
        categoria: 'Broncodilatador',
        estoque: 45,
        estoqueMinimo: 50,
        lote: 'LOT2025006',
        validade: '2025-12-30',
        fabricante: 'GSK',
        status: 'baixo'
    },
    {
        id: 7,
        nome: 'Atenolol',
        concentracao: '25mg',
        formaFarmaceutica: 'Comprimido',
        categoria: 'Anti-hipertensivo',
        estoque: 1200,
        estoqueMinimo: 300,
        lote: 'LOT2025007',
        validade: '2026-09-20',
        fabricante: 'Biolab',
        status: 'disponivel'
    },
    {
        id: 8,
        nome: 'Insulina NPH',
        concentracao: '100UI/ml',
        formaFarmaceutica: 'Frasco',
        categoria: 'Antidiabético',
        estoque: 0,
        estoqueMinimo: 100,
        lote: '-',
        validade: '-',
        fabricante: 'Lilly',
        status: 'esgotado'
    }
];

const categorias = [
    'Todas',
    'Anti-hipertensivo',
    'Antidiabético',
    'Antibiótico',
    'Analgésico',
    'Antiulceroso',
    'Broncodilatador'
];

// Statistics
const estatisticas = {
    totalItens: 156,
    disponiveis: 132,
    estoqueBaixo: 18,
    vencendo: 4,
    esgotados: 2
};

export default function Medicamentos() {
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
    const [showNovoModal, setShowNovoModal] = useState(false);

    // Filter medications
    const medicamentosFiltrados = medicamentosData.filter(m => {
        const matchCategoria = filtroCategoria === 'Todas' || m.categoria === filtroCategoria;
        const matchStatus = !filtroStatus || m.status === filtroStatus;
        const matchPesquisa = !pesquisa ||
            m.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
            m.lote.toLowerCase().includes(pesquisa.toLowerCase());
        return matchCategoria && matchStatus && matchPesquisa;
    });

    const getStatusBadge = (status) => {
        const config = {
            disponivel: { color: 'success', label: 'Disponível' },
            baixo: { color: 'warning', label: 'Estoque Baixo' },
            vencendo: { color: 'info', label: 'Vencendo' },
            esgotado: { color: 'danger', label: 'Esgotado' }
        };
        const s = config[status] || config.disponivel;
        return <span className={`badge badge-${s.color}`}>{s.label}</span>;
    };

    const getEstoqueColor = (estoque, minimo) => {
        const ratio = estoque / minimo;
        if (ratio <= 0) return '#dc3545';
        if (ratio < 1.2) return 'var(--sus-yellow)';
        return 'var(--sus-green)';
    };

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === '-') return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    };

    const isExpiringSoon = (dateStr) => {
        if (!dateStr || dateStr === '-') return false;
        const date = new Date(dateStr);
        const now = new Date();
        const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000;
        return date.getTime() - now.getTime() < threeMonths;
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>
                    <i className="fas fa-capsules" style={{ color: 'var(--sus-green)', marginRight: '0.5rem' }}></i>
                    Gestão de Medicamentos
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-file-export"></i> Exportar
                    </button>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-truck"></i> Entrada
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowNovoModal(true)}>
                        <i className="fas fa-plus"></i> Novo Medicamento
                    </button>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-blue)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-blue)', margin: 0 }}>{estatisticas.totalItens}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Total de Itens</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-green)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-green)', margin: 0 }}>{estatisticas.disponiveis}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Disponíveis</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--sus-yellow)' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: 'var(--sus-yellow)', margin: 0 }}>{estatisticas.estoqueBaixo}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Estoque Baixo</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #17a2b8' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: '#17a2b8', margin: 0 }}>{estatisticas.vencendo}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Vencendo</small>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #dc3545' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2 style={{ color: '#dc3545', margin: 0 }}>{estatisticas.esgotados}</h2>
                        <small style={{ color: 'var(--sus-gray)' }}>Esgotados</small>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="alert alert-warning" style={{ margin: 0 }}>
                    <strong><i className="fas fa-exclamation-triangle"></i> Estoque Crítico:</strong> {estatisticas.estoqueBaixo} medicamentos abaixo do estoque mínimo.
                    <a href="#" style={{ marginLeft: '0.5rem' }}>Ver lista</a>
                </div>
                <div className="alert alert-info" style={{ margin: 0 }}>
                    <strong><i className="fas fa-calendar-alt"></i> Vencimento Próximo:</strong> {estatisticas.vencendo} lotes vencem nos próximos 3 meses.
                    <a href="#" style={{ marginLeft: '0.5rem' }}>Ver lista</a>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body">
                    <h5 style={{ marginBottom: '1rem' }}>Filtros</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Categoria</label>
                            <select
                                className="form-control"
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                            >
                                {categorias.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Status</label>
                            <select
                                className="form-control"
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="disponivel">Disponível</option>
                                <option value="baixo">Estoque Baixo</option>
                                <option value="vencendo">Vencendo</option>
                                <option value="esgotado">Esgotado</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Pesquisar</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nome do medicamento ou lote..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Medications Table */}
            <div className="card">
                <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ padding: '1rem 1rem 0.5rem' }}>
                        <h5>Medicamentos ({medicamentosFiltrados.length})</h5>
                    </div>
                    <table className="table" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>Medicamento</th>
                                <th>Categoria</th>
                                <th>Estoque</th>
                                <th>Lote</th>
                                <th>Validade</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicamentosFiltrados.map(med => (
                                <tr key={med.id}>
                                    <td>
                                        <strong>{med.nome}</strong>
                                        <br />
                                        <small style={{ color: 'var(--sus-gray)' }}>
                                            {med.concentracao} - {med.formaFarmaceutica}
                                        </small>
                                    </td>
                                    <td>
                                        <span className="badge badge-secondary">{med.categoria}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{
                                                width: '60px',
                                                height: '8px',
                                                background: '#e9ecef',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${Math.min(100, (med.estoque / (med.estoqueMinimo * 2)) * 100)}%`,
                                                    height: '100%',
                                                    background: getEstoqueColor(med.estoque, med.estoqueMinimo),
                                                    borderRadius: '4px'
                                                }}></div>
                                            </div>
                                            <span style={{
                                                fontWeight: '600',
                                                color: getEstoqueColor(med.estoque, med.estoqueMinimo)
                                            }}>
                                                {med.estoque}
                                            </span>
                                        </div>
                                        <small style={{ color: 'var(--sus-gray)' }}>Mín: {med.estoqueMinimo}</small>
                                    </td>
                                    <td><code>{med.lote}</code></td>
                                    <td style={{ color: isExpiringSoon(med.validade) ? '#dc3545' : 'inherit' }}>
                                        {isExpiringSoon(med.validade) && <i className="fas fa-exclamation-circle" style={{ marginRight: '0.25rem' }}></i>}
                                        {formatDate(med.validade)}
                                    </td>
                                    <td>{getStatusBadge(med.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setMedicamentoSelecionado(med)}
                                                title="Detalhes"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-success" title="Entrada">
                                                <i className="fas fa-plus"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-secondary" title="Editar">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {medicamentoSelecionado && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setMedicamentoSelecionado(null)}
                >
                    <div
                        className="card"
                        style={{ width: '600px', maxWidth: '90%', maxHeight: '80vh', overflow: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-green)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-pills"></i> {medicamentoSelecionado.nome}</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setMedicamentoSelecionado(null)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <p><strong>Concentração:</strong> {medicamentoSelecionado.concentracao}</p>
                                    <p><strong>Forma:</strong> {medicamentoSelecionado.formaFarmaceutica}</p>
                                    <p><strong>Categoria:</strong> {medicamentoSelecionado.categoria}</p>
                                    <p><strong>Fabricante:</strong> {medicamentoSelecionado.fabricante}</p>
                                </div>
                                <div>
                                    <p><strong>Lote:</strong> <code>{medicamentoSelecionado.lote}</code></p>
                                    <p><strong>Validade:</strong> {formatDate(medicamentoSelecionado.validade)}</p>
                                    <p><strong>Estoque Atual:</strong> {medicamentoSelecionado.estoque} unidades</p>
                                    <p><strong>Estoque Mínimo:</strong> {medicamentoSelecionado.estoqueMinimo} unidades</p>
                                </div>
                            </div>

                            <h6>Movimentação Recente</h6>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Tipo</th>
                                        <th>Qtd</th>
                                        <th>Responsável</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>25/01/2025</td>
                                        <td><span className="badge badge-danger">Saída</span></td>
                                        <td>-30</td>
                                        <td>Dr. Carlos</td>
                                    </tr>
                                    <tr>
                                        <td>20/01/2025</td>
                                        <td><span className="badge badge-success">Entrada</span></td>
                                        <td>+500</td>
                                        <td>Farmácia Central</td>
                                    </tr>
                                    <tr>
                                        <td>15/01/2025</td>
                                        <td><span className="badge badge-danger">Saída</span></td>
                                        <td>-45</td>
                                        <td>Dra. Ana</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button className="btn btn-outline-danger">
                                    <i className="fas fa-minus"></i> Registrar Saída
                                </button>
                                <button className="btn btn-success">
                                    <i className="fas fa-plus"></i> Registrar Entrada
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Medication Modal */}
            {showNovoModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setShowNovoModal(false)}
                >
                    <div
                        className="card"
                        style={{ width: '600px', maxWidth: '90%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{ background: 'var(--sus-blue)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><i className="fas fa-plus"></i> Novo Medicamento</span>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setShowNovoModal(false)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">Nome do Medicamento *</label>
                                    <input type="text" className="form-control" placeholder="Ex: Losartana Potássica" />
                                </div>
                                <div>
                                    <label className="form-label">Concentração *</label>
                                    <input type="text" className="form-control" placeholder="Ex: 50mg" />
                                </div>
                                <div>
                                    <label className="form-label">Forma Farmacêutica</label>
                                    <select className="form-control">
                                        <option>Comprimido</option>
                                        <option>Cápsula</option>
                                        <option>Solução</option>
                                        <option>Suspensão</option>
                                        <option>Pomada</option>
                                        <option>Injetável</option>
                                        <option>Aerosol</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Categoria</label>
                                    <select className="form-control">
                                        {categorias.filter(c => c !== 'Todas').map(c => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Estoque Mínimo *</label>
                                    <input type="number" className="form-control" placeholder="Ex: 500" />
                                </div>
                                <div>
                                    <label className="form-label">Fabricante</label>
                                    <input type="text" className="form-control" placeholder="Ex: EMS" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button className="btn btn-outline-secondary" onClick={() => setShowNovoModal(false)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-primary">
                                    <i className="fas fa-save"></i> Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
