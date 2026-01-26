import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Card } from '../../components/ui';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// SUS Colors
const susColors = {
    blue: '#0054A6',
    green: '#00A651',
    yellow: '#FFF200',
    red: '#ED1C24',
    lightBlue: '#3D7CC9',
    lightGreen: '#4DC47D',
};

// Sample data for indicators
const indicatorsData = [
    { id: 1, name: 'Cobertura Vacinal', category: 'Assistencial', value: '85%', goal: '80%', trend: '+5%', trendUp: true, status: 'Acima da Meta', statusClass: 'badge-success' },
    { id: 2, name: 'Consultas Pré-natal', category: 'Assistencial', value: '92%', goal: '80%', trend: '+12%', trendUp: true, status: 'Acima da Meta', statusClass: 'badge-success' },
    { id: 3, name: 'Controle de Hipertensão', category: 'Assistencial', value: '68%', goal: '70%', trend: '-2%', trendUp: false, status: 'Abaixo da Meta', statusClass: 'badge-warning' },
    { id: 4, name: 'Rastreamento de Câncer', category: 'Assistencial', value: '45%', goal: '60%', trend: '-15%', trendUp: false, status: 'Crítico', statusClass: 'badge-danger' },
    { id: 5, name: 'Taxa de Internação por Condições Sensíveis', category: 'Epidemiológico', value: '12%', goal: '15%', trend: '-3%', trendUp: true, status: 'Acima da Meta', statusClass: 'badge-success' },
    { id: 6, name: 'Tempo Médio de Espera', category: 'Operacional', value: '35 min', goal: '30 min', trend: '+5 min', trendUp: false, status: 'Abaixo da Meta', statusClass: 'badge-warning' },
    { id: 7, name: 'Satisfação do Usuário', category: 'Qualidade', value: '88%', goal: '85%', trend: '+3%', trendUp: true, status: 'Acima da Meta', statusClass: 'badge-success' },
];

// Chart data for evolution
const evolutionChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
        {
            label: 'Cobertura Vacinal',
            data: [75, 76, 78, 79, 80, 81, 82, 83, 84, 85, 85, 85],
            borderColor: susColors.blue,
            backgroundColor: 'rgba(0, 84, 166, 0.1)',
            tension: 0.3,
            fill: true,
        },
        {
            label: 'Consultas Pré-natal',
            data: [80, 82, 84, 85, 86, 88, 89, 90, 91, 92, 92, 92],
            borderColor: susColors.green,
            backgroundColor: 'rgba(0, 166, 81, 0.1)',
            tension: 0.3,
            fill: true,
        },
    ],
};

// Chart data for goals comparison
const goalsChartData = {
    labels: ['Cobertura Vacinal', 'Pré-natal', 'Hipertensão', 'Câncer', 'Satisfação'],
    datasets: [
        {
            label: 'Atual',
            data: [85, 92, 68, 45, 88],
            backgroundColor: susColors.blue,
        },
        {
            label: 'Meta',
            data: [80, 80, 70, 60, 85],
            backgroundColor: susColors.lightBlue,
        },
    ],
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};

export default function Indicadores() {
    const [filters, setFilters] = useState({
        categoria: '',
        periodo: 'ano',
        status: '',
        search: '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        // Filter logic would go here
    };

    const handleFilterReset = () => {
        setFilters({ categoria: '', periodo: 'ano', status: '', search: '' });
    };

    return (
        <div className="fade-in">
            {/* Page Header */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <nav style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--sus-gray)' }}>Início / Análise de Dados / </span>
                    <span style={{ color: 'var(--sus-blue)' }}>Indicadores</span>
                </nav>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <i className="fas fa-chart-line" style={{ color: 'var(--sus-blue)' }}></i>
                        Indicadores
                    </h1>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <button className="btn btn-outline-primary">
                            <i className="fas fa-robot" style={{ marginRight: '0.5rem' }}></i>
                            Análise IA
                        </button>
                        <button className="btn btn-primary">
                            <i className="fas fa-plus-circle" style={{ marginRight: '0.5rem' }}></i>
                            Novo Indicador
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <i className="fas fa-robot" style={{ color: 'var(--sus-blue)' }}></i>
                        Insights de IA - Indicadores
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
                            Análise de Tendências
                        </h5>
                        <p style={{ margin: 0 }}>A IA detectou uma tendência de melhoria nos indicadores de cobertura vacinal e consultas pré-natal nos últimos 3 meses. Recomenda-se compartilhar as estratégias bem-sucedidas com outras unidades de saúde.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
                        <div className="alert alert-warning">
                            <h5 style={{ marginBottom: 'var(--spacing-xs)' }}>
                                <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
                                Indicadores Críticos
                            </h5>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>A IA identificou 3 indicadores abaixo da meta por mais de 6 meses consecutivos.</p>
                        </div>
                        <div className="alert alert-success">
                            <h5 style={{ marginBottom: 'var(--spacing-xs)' }}>
                                <i className="fas fa-chart-pie" style={{ marginRight: '0.5rem' }}></i>
                                Novos Indicadores Sugeridos
                            </h5>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>A IA sugere 4 novos indicadores para insights valiosos sobre qualidade.</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <Card style={{ borderLeft: `4px solid ${susColors.blue}` }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: susColors.blue }}>85%</div>
                        <h5 style={{ margin: 'var(--spacing-sm) 0' }}>Cobertura Vacinal</h5>
                        <span style={{ color: susColors.green }}><i className="fas fa-arrow-up"></i> 5% acima da meta</span>
                    </div>
                </Card>
                <Card style={{ borderLeft: `4px solid ${susColors.green}` }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: susColors.green }}>92%</div>
                        <h5 style={{ margin: 'var(--spacing-sm) 0' }}>Consultas Pré-natal</h5>
                        <span style={{ color: susColors.green }}><i className="fas fa-arrow-up"></i> 12% acima da meta</span>
                    </div>
                </Card>
                <Card style={{ borderLeft: `4px solid ${susColors.yellow}` }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#d4a500' }}>68%</div>
                        <h5 style={{ margin: 'var(--spacing-sm) 0' }}>Controle Hipertensão</h5>
                        <span style={{ color: susColors.red }}><i className="fas fa-arrow-down"></i> 2% abaixo da meta</span>
                    </div>
                </Card>
                <Card style={{ borderLeft: `4px solid ${susColors.red}` }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: susColors.red }}>45%</div>
                        <h5 style={{ margin: 'var(--spacing-sm) 0' }}>Rastreamento Câncer</h5>
                        <span style={{ color: susColors.red }}><i className="fas fa-arrow-down"></i> 15% abaixo da meta</span>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                <Card>
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h5 style={{ margin: 0 }}>Evolução dos Indicadores</h5>
                        <button className="btn btn-outline-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                            <i className="fas fa-download" style={{ marginRight: '0.25rem' }}></i>
                            Exportar
                        </button>
                    </div>
                    <div className="card-body" style={{ height: '300px' }}>
                        <Line data={evolutionChartData} options={chartOptions} />
                    </div>
                </Card>
                <Card>
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h5 style={{ margin: 0 }}>Comparativo com Metas</h5>
                        <button className="btn btn-outline-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                            <i className="fas fa-download" style={{ marginRight: '0.25rem' }}></i>
                            Exportar
                        </button>
                    </div>
                    <div className="card-body" style={{ height: '300px' }}>
                        <Bar data={goalsChartData} options={chartOptions} />
                    </div>
                </Card>
            </div>

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
                                    <option value="assistenciais">Assistenciais</option>
                                    <option value="epidemiologicos">Epidemiológicos</option>
                                    <option value="operacionais">Operacionais</option>
                                    <option value="financeiros">Financeiros</option>
                                    <option value="qualidade">Qualidade</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Período</label>
                                <select className="form-select" name="periodo" value={filters.periodo} onChange={handleFilterChange}>
                                    <option value="mes_atual">Mês Atual</option>
                                    <option value="trimestre">Último Trimestre</option>
                                    <option value="semestre">Último Semestre</option>
                                    <option value="ano">Último Ano</option>
                                    <option value="personalizado">Personalizado</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Status</label>
                                <select className="form-select" name="status" value={filters.status} onChange={handleFilterChange}>
                                    <option value="">Todos</option>
                                    <option value="acima_meta">Acima da Meta</option>
                                    <option value="na_meta">Na Meta</option>
                                    <option value="abaixo_meta">Abaixo da Meta</option>
                                    <option value="critico">Crítico</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Buscar</label>
                                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="search"
                                        placeholder="Nome do indicador"
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

            {/* Indicators Table */}
            <Card>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ margin: 0 }}>Indicadores</h5>
                    <button className="btn btn-outline-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                        <i className="fas fa-file-excel" style={{ marginRight: '0.25rem' }}></i>
                        Exportar
                    </button>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nome do Indicador</th>
                                    <th>Categoria</th>
                                    <th>Valor Atual</th>
                                    <th>Meta</th>
                                    <th>Tendência</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {indicatorsData.map(indicator => (
                                    <tr key={indicator.id}>
                                        <td>{indicator.name}</td>
                                        <td>{indicator.category}</td>
                                        <td>{indicator.value}</td>
                                        <td>{indicator.goal}</td>
                                        <td>
                                            <span style={{ color: indicator.trendUp ? susColors.green : susColors.red }}>
                                                <i className={`fas fa-arrow-${indicator.trendUp ? 'up' : 'down'}`}></i> {indicator.trend}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${indicator.statusClass}`}>{indicator.status}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                                <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem' }} title="Visualizar">
                                                    <i className="fas fa-eye"></i>
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
