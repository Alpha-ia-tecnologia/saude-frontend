// Placeholder page component generator
export function createPlaceholderPage(title, icon, description) {
    return function PlaceholderPage() {
        return (
            <div className="fade-in">
                <h1 style={{ marginBottom: '0.5rem' }}>{title}</h1>
                <p style={{ color: 'var(--sus-gray)', marginBottom: '2rem' }}>{description}</p>

                <div className="card">
                    <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
                        <i className={`fas ${icon}`} style={{ fontSize: '4rem', color: 'var(--sus-blue)', marginBottom: '1rem' }}></i>
                        <h3>Página em Desenvolvimento</h3>
                        <p style={{ color: 'var(--sus-gray)' }}>
                            Esta funcionalidade está sendo implementada e estará disponível em breve.
                        </p>
                    </div>
                </div>
            </div>
        );
    };
}

// Gestão Clínica
export const DecisaoClinica = createPlaceholderPage(
    'Apoio à Decisão Clínica',
    'fa-brain',
    'Sistema de apoio à decisão baseado em evidências clínicas'
);

export const Protocolos = createPlaceholderPage(
    'Protocolos Clínicos',
    'fa-file-medical-alt',
    'Biblioteca de protocolos padronizados do SUS'
);

export const CondicoesCronicas = createPlaceholderPage(
    'Condições Crônicas',
    'fa-heartbeat',
    'Monitoramento e gestão de pacientes com doenças crônicas'
);

// Farmácia
export const Medicamentos = createPlaceholderPage(
    'Gestão de Medicamentos',
    'fa-capsules',
    'Controle de estoque, validade e dispensação de medicamentos'
);

export const Prescricoes = createPlaceholderPage(
    'Prescrições',
    'fa-prescription',
    'Gerenciamento de prescrições médicas e posologia'
);

// Comunicação
export const Referencia = createPlaceholderPage(
    'Referência e Contra-referência',
    'fa-exchange-alt',
    'Sistema de encaminhamentos entre unidades de saúde'
);

export const Mensagens = createPlaceholderPage(
    'Mensagens',
    'fa-envelope',
    'Sistema de comunicação interna entre profissionais'
);

// Análise de Dados
export const AnaliseDashboard = createPlaceholderPage(
    'Dashboard de Análise',
    'fa-tachometer-alt',
    'Painel de indicadores e métricas de saúde'
);

export const Relatorios = createPlaceholderPage(
    'Relatórios',
    'fa-file-alt',
    'Geração e exportação de relatórios personalizados'
);

export const Indicadores = createPlaceholderPage(
    'Indicadores de Saúde',
    'fa-chart-line',
    'Análise de indicadores e tendências epidemiológicas'
);

// Financeiro
export const Orcamento = createPlaceholderPage(
    'Orçamento',
    'fa-money-bill-alt',
    'Gestão orçamentária e faturamento SUS'
);

// Integração
export const ServicosExternos = createPlaceholderPage(
    'Serviços Externos',
    'fa-external-link-alt',
    'Integração com laboratórios, hospitais e APIs externas'
);

// Gestores
export const GestoresDashboard = createPlaceholderPage(
    'Dashboard Gerencial',
    'fa-tachometer-alt',
    'Visão consolidada de indicadores para gestão'
);

export const GestoresIndicadores = createPlaceholderPage(
    'Indicadores Gerenciais',
    'fa-chart-line',
    'KPIs e indicadores de desempenho'
);

export const RecursosHumanos = createPlaceholderPage(
    'Recursos Humanos',
    'fa-users',
    'Gestão de profissionais e escalas de trabalho'
);

export const Planejamento = createPlaceholderPage(
    'Planejamento Estratégico',
    'fa-tasks',
    'Definição de metas e acompanhamento de ações'
);

export default { createPlaceholderPage };
