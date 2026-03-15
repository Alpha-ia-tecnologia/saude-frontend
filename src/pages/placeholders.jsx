import { Construction } from 'lucide-react';

export function createPlaceholderPage(title, _icon, description) {
  return function PlaceholderPage() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Construction className="size-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Em Desenvolvimento</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Esta funcionalidade está sendo implementada e estará disponível em breve.
          </p>
        </div>
      </div>
    );
  };
}

// Farmácia
export const Medicamentos = createPlaceholderPage(
  'Gestão de Medicamentos', 'fa-capsules',
  'Controle de estoque, validade e dispensação de medicamentos'
);

export const Prescricoes = createPlaceholderPage(
  'Prescrições', 'fa-prescription',
  'Gerenciamento de prescrições médicas e posologia'
);

// Comunicação
export const Referencia = createPlaceholderPage(
  'Referência e Contra-referência', 'fa-exchange-alt',
  'Sistema de encaminhamentos entre unidades de saúde'
);

export const Mensagens = createPlaceholderPage(
  'Mensagens', 'fa-envelope',
  'Sistema de comunicação interna entre profissionais'
);

// Análise de Dados
export const AnaliseDashboard = createPlaceholderPage(
  'Dashboard de Análise', 'fa-tachometer-alt',
  'Painel de indicadores e métricas de saúde'
);

export const Relatorios = createPlaceholderPage(
  'Relatórios', 'fa-file-alt',
  'Geração e exportação de relatórios personalizados'
);

export const Indicadores = createPlaceholderPage(
  'Indicadores de Saúde', 'fa-chart-line',
  'Análise de indicadores e tendências epidemiológicas'
);

// Financeiro
export const Orcamento = createPlaceholderPage(
  'Orçamento', 'fa-money-bill-alt',
  'Gestão orçamentária e faturamento SUS'
);

// Integração
export const ServicosExternos = createPlaceholderPage(
  'Serviços Externos', 'fa-external-link-alt',
  'Integração com laboratórios, hospitais e APIs externas'
);

// Gestores
export const GestoresDashboard = createPlaceholderPage(
  'Dashboard Gerencial', 'fa-tachometer-alt',
  'Visão consolidada de indicadores para gestão'
);

export const GestoresIndicadores = createPlaceholderPage(
  'Indicadores Gerenciais', 'fa-chart-line',
  'KPIs e indicadores de desempenho'
);

export const RecursosHumanos = createPlaceholderPage(
  'Recursos Humanos', 'fa-users',
  'Gestão de profissionais e escalas de trabalho'
);

export const Planejamento = createPlaceholderPage(
  'Planejamento Estratégico', 'fa-tasks',
  'Definição de metas e acompanhamento de ações'
);

export default { createPlaceholderPage };
