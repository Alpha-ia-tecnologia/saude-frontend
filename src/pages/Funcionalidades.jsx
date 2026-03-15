import { Link } from 'react-router-dom';
import {
  UserRound, Stethoscope, Bot, Pill, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryIcons = {
  'Pacientes': UserRound,
  'Gestão Clínica': Stethoscope,
  'Assistente IA': Bot,
  'Farmácia': Pill,
};

const categoryColors = {
  'Pacientes': 'text-primary bg-primary/10',
  'Gestão Clínica': 'text-secondary bg-secondary/10',
  'Assistente IA': 'text-blue-500 bg-blue-50',
  'Farmácia': 'text-amber-600 bg-amber-50',
};

const features = [
  {
    category: 'Pacientes',
    items: [
      { name: 'Cadastro de Pacientes', description: 'Formulário completo com dados pessoais, demográficos e socioeconômicos', link: '/pacientes/cadastro' },
      { name: 'Prontuário Eletrônico', description: 'Histórico médico completo com navegação por abas', link: '/pacientes/prontuario' }
    ]
  },
  {
    category: 'Gestão Clínica',
    items: [
      { name: 'Apoio à Decisão Clínica', description: 'Recomendações baseadas em sintomas e histórico', link: '/gestao-clinica/decisao' },
      { name: 'Protocolos Clínicos', description: 'Biblioteca de protocolos padronizados do SUS', link: '/gestao-clinica/protocolos' },
      { name: 'Condições Crônicas', description: 'Monitoramento de pacientes com doenças crônicas', link: '/gestao-clinica/cronicas' }
    ]
  },
  {
    category: 'Assistente IA',
    items: [
      { name: 'Chatbot Clínico', description: 'Assistente inteligente com suporte a OpenAI, Gemini e DeepSeek', link: '/assistente-ia/chatbot' }
    ]
  },
  {
    category: 'Farmácia',
    items: [
      { name: 'Gestão de Medicamentos', description: 'Controle de estoque e alertas de validade', link: '/farmacia/medicamentos' },
      { name: 'Prescrições', description: 'Gerenciamento de prescrições médicas', link: '/farmacia/prescricoes' }
    ]
  }
];

export function Funcionalidades() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Funcionalidades do Sistema</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore todas as funcionalidades disponíveis no PEC
        </p>
      </div>

      {features.map(feature => {
        const Icon = categoryIcons[feature.category] || Stethoscope;
        const colorClass = categoryColors[feature.category] || 'text-primary bg-primary/10';

        return (
          <div key={feature.category}>
            <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-foreground">
              <span className={cn('flex size-8 items-center justify-center rounded-lg', colorClass)}>
                <Icon className="size-4" />
              </span>
              {feature.category}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {feature.items.map(item => (
                <div key={item.name} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  <Link
                    to={item.link}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    Acessar <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Funcionalidades;
