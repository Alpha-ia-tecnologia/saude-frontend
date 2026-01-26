import { useState } from 'react';
import { Card } from '../../components/ui';

// SUS Colors
const susColors = {
    blue: '#0054A6',
    green: '#00A651',
    yellow: '#FFF200',
    red: '#ED1C24',
};

// Sample reports data
const reportsData = [
    { id: 1, name: 'Produção Médica por Profissional', category: 'Atendimentos', lastRun: '10/04/2025', formats: ['PDF', 'Excel'], frequency: 'Diário', status: 'Ativo', statusClass: 'badge-success' },
    { id: 2, name: 'Indicadores de Saúde', category: 'Epidemiológicos', lastRun: '09/04/2025', formats: ['PDF', 'Excel', 'CSV'], frequency: 'Mensal', status: 'Ativo', statusClass: 'badge-success' },
    { id: 3, name: 'Consumo de Medicamentos', category: 'Farmácia', lastRun: '08/04/2025', formats: ['PDF', 'Excel'], frequency: 'Semanal', status: 'Ativo', statusClass: 'badge-success' },
    { id: 4, name: 'Faturamento SUS', category: 'Financeiros', lastRun: '05/04/2025', formats: ['PDF', 'Excel'], frequency: 'Mensal', status: 'Ativo', statusClass: 'badge-success' },
    { id: 5, name: 'Atendimentos por Especialidade', category: 'Atendimentos', lastRun: '01/04/2025', formats: ['PDF', 'Excel'], frequency: 'Semanal', status: 'Ativo', statusClass: 'badge-success' },
    { id: 6, name: 'Absenteísmo de Pacientes', category: 'Gestão', lastRun: '31/03/2025', formats: ['PDF', 'Excel'], frequency: 'Mensal', status: 'Em revisão', statusClass: 'badge-warning' },
    { id: 7, name: 'Produtividade por Equipe', category: 'Recursos Humanos', lastRun: '25/03/2025', formats: ['PDF', 'Excel'], frequency: 'Mensal', status: 'Inativo', statusClass: 'badge-secondary' },
];

// Report categories
const categories = [
    { id: 1, name: 'Atendimentos', icon: 'fa-user-md', color: susColors.blue, description: 'Relatórios sobre consultas, procedimentos e atendimentos realizados.' },
    { id: 2, name: 'Epidemiológicos', icon: 'fa-heartbeat', color: susColors.red, description: 'Relatórios sobre doenças, condições de saúde e vigilância epidemiológica.' },
    { id: 3, name: 'Farmácia', icon: 'fa-pills', color: susColors.green, description: 'Relatórios sobre dispensação, estoque e consumo de medicamentos.' },
    { id: 4, name: 'Financeiros', icon: 'fa-dollar-sign', color: '#d4a500', description: 'Relatórios sobre custos, faturamento e produção para o SUS.' },
];

export default function Relatorios() {
    const [filters, setFilters] = useState({
        categoria: '',
        periodo: 'mes',
        formato: '',
        search: '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    };

    const handleFilterReset = () => {
        setFilters({ categoria: '', periodo: 'mes', formato: '', search: '' });
    };

    return (
        <div className="fade-in">
            {/* Page Header */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <nav style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--sus-gray)' }}>Início / Análise de Dados / </span>
                    <span style={{ color: 'var(--sus-blue)' }}>Relatórios</span>
                </nav>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <i className="fas fa-file-alt" style={{ color: 'var(--sus-blue)' }}></i>
                        Relatórios
                    </h1>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <button className="btn btn-outline-primary">
                            <i className="fas fa-robot" style={{ marginRight: '0.5rem' }}></i>
                            Análise IA
                        </button>
                        <button className="btn btn-primary">
                            <i className="fas fa-plus-circle" style={{ marginRight: '0.5rem' }}></i>
                            Novo Relatório
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <i className="fas fa-robot" style={{ color: 'var(--sus-blue)' }}></i>
                        Insights de IA - Relatórios
                    </h4>
                    <button className="btn btn-outline-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                        <i className="fas fa-sync-alt" style={{ marginRight: '0.25rem' }}></i>
                        Atualizar
                    </button>
                </div>
                <div className="card-body">
                    <div className="alert alert-info" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <h5 style={{ marginBottom: 'var(--spacing-xs)' }}>
                            <i className="fas fa-lightbulb" style={{ marginRight: '0.5rem' }}></i>
                            Análise de Relatórios
                        </h5>
                        <p style={{ margin: 0 }}>A IA analisou os relatórios mais acessados e identificou que os relatórios de produtividade médica e indicadores de saúde são os mais utilizados pelos gestores. Recomenda-se destacar esses relatórios na interface e otimizar seu tempo de geração.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
                        <div className="alert alert-success">
                            <h5 style={{ marginBottom: 'var(--spacing-xs)' }}>
                                <i className="fas fa-chart-pie" style={{ marginRight: '0.5rem' }}></i>
                                Sugestão de Novos Relatórios
                            </h5>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>A IA sugere 3 novos relatórios para insights sobre eficiência operacional.</p>
                        </div>
                        <div className="alert alert-warning">
                            <h5 style={{ marginBottom: 'var(--spacing-xs)' }}>
                                <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
                                Relatórios Subutilizados
                            </h5>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>5 relatórios foram gerados menos de 3 vezes nos últimos 6 meses.</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Report Categories */}
            <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="card-header">
                    <h5 style={{ margin: 0 }}>Categorias de Relatórios</h5>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-md)' }}>
                        {categories.map(cat => (
                            <Card key={cat.id} style={{ textAlign: 'center', cursor: 'pointer' }}>
                                <div className="card-body">
                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                        <i className={`fas ${cat.icon}`} style={{ fontSize: '2.5rem', color: cat.color }}></i>
                                    </div>
                                    <h5 style={{ marginBottom: 'var(--spacing-sm)' }}>{cat.name}</h5>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--sus-gray)', marginBottom: 'var(--spacing-md)' }}>{cat.description}</p>
                                    <button className="btn btn-outline-primary" style={{ fontSize: '0.875rem' }}>Ver Relatórios</button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Filters */}
            <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="card-body">
                    <h5 style={{ marginBottom: 'var(--spacing-md)' }}>Filtros</h5>
                    <form onSubmit={handleFilterSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                            <div>
                                <label className="form-label">Categoria</label>
                                <select className="form-select" name="categoria" value={filters.categoria} onChange={handleFilterChange}>
                                    <option value="">Todas</option>
                                    <option value="atendimentos">Atendimentos</option>
                                    <option value="epidemiologicos">Epidemiológicos</option>
                                    <option value="farmacia">Farmácia</option>
                                    <option value="financeiros">Financeiros</option>
                                    <option value="gestao">Gestão</option>
                                    <option value="rh">Recursos Humanos</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Período</label>
                                <select className="form-select" name="periodo" value={filters.periodo} onChange={handleFilterChange}>
                                    <option value="hoje">Hoje</option>
                                    <option value="ontem">Ontem</option>
                                    <option value="semana">Últimos 7 dias</option>
                                    <option value="mes">Último mês</option>
                                    <option value="trimestre">Último trimestre</option>
                                    <option value="ano">Último ano</option>
                                    <option value="personalizado">Personalizado</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Formato</label>
                                <select className="form-select" name="formato" value={filters.formato} onChange={handleFilterChange}>
                                    <option value="">Todos</option>
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                    <option value="csv">CSV</option>
                                    <option value="html">HTML</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Buscar</label>
                                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="search"
                                        placeholder="Nome do relatório"
                                        value={filters.search}
                                        onChange={handleFilterChange}
                                    />
                                    <button type="submit" className="btn btn-primary">
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                            <button type="button" className="btn btn-outline-primary" onClick={handleFilterReset}>
                                <i className="fas fa-undo" style={{ marginRight: '0.25rem' }}></i>
                                Limpar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-filter" style={{ marginRight: '0.25rem' }}></i>
                                Aplicar Filtros
                            </button>
                        </div>
                    </form>
                </div>
            </Card>

            {/* Reports Table */}
            <Card>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ margin: 0 }}>Relatórios Disponíveis</h5>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nome do Relatório</th>
                                    <th>Categoria</th>
                                    <th>Última Execução</th>
                                    <th>Formatos</th>
                                    <th>Frequência</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportsData.map(report => (
                                    <tr key={report.id}>
                                        <td>{report.name}</td>
                                        <td>{report.category}</td>
                                        <td>{report.lastRun}</td>
                                        <td>
                                            {report.formats.map((format, idx) => (
                                                <span key={idx} className="badge badge-secondary" style={{ marginRight: '0.25rem', background: 'var(--sus-gray)', color: 'white' }}>{format}</span>
                                            ))}
                                        </td>
                                        <td>{report.frequency}</td>
                                        <td>
                                            <span className={`badge ${report.statusClass}`}>{report.status}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                                <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem' }} title="Gerar">
                                                    <i className="fas fa-play"></i>
                                                </button>
                                                <button className="btn btn-outline-primary" style={{ padding: '0.25rem 0.5rem' }} title="Editar">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-outline-primary" style={{ padding: '0.25rem 0.5rem' }} title="Histórico">
                                                    <i className="fas fa-history"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer" style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-md)' }}>
                    <nav>
                        <button className="btn btn-outline-primary" disabled style={{ marginRight: 'var(--spacing-xs)' }}>Anterior</button>
                        <button className="btn btn-primary" style={{ marginRight: 'var(--spacing-xs)' }}>1</button>
                        <button className="btn btn-outline-primary" style={{ marginRight: 'var(--spacing-xs)' }}>2</button>
                        <button className="btn btn-outline-primary" style={{ marginRight: 'var(--spacing-xs)' }}>3</button>
                        <button className="btn btn-outline-primary">Próximo</button>
                    </nav>
                </div>
            </Card>
        </div>
    );
}
