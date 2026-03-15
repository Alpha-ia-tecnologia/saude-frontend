import { useState } from 'react';
import {
  User, CreditCard, Cake, Phone, BadgeCheck, Pencil,
  Clock, History, FlaskConical, ClipboardList, Syringe, FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'resumo', label: 'Resumo', icon: User },
  { id: 'historico', label: 'Histórico', icon: History },
  { id: 'exames', label: 'Exames', icon: FlaskConical },
  { id: 'prescricoes', label: 'Prescrições', icon: ClipboardList },
  { id: 'vacinas', label: 'Vacinas', icon: Syringe }
];

const patientData = {
  nome: 'Maria da Silva Santos',
  cpf: '123.456.789-00',
  dataNascimento: '15/03/1985',
  idade: '40 anos',
  cns: '123456789012345',
  telefone: '(11) 99999-9999'
};

const historicoItems = [
  { data: '10/01/2026', tipo: 'Consulta', descricao: 'Consulta de rotina - Hipertensão controlada', medico: 'Dr. Roberto Almeida' },
  { data: '15/12/2025', tipo: 'Exame', descricao: 'Hemograma completo - Resultados normais', medico: 'Laboratório Central' },
  { data: '01/11/2025', tipo: 'Consulta', descricao: 'Retorno - Ajuste de medicação', medico: 'Dr. Roberto Almeida' }
];

export function Prontuario() {
  const [activeTab, setActiveTab] = useState('resumo');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Prontuário Eletrônico</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visualize e gerencie o prontuário do paciente
        </p>
      </div>

      {/* Patient header */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
            M
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-foreground">{patientData.nome}</h2>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CreditCard className="size-3.5" /> {patientData.cpf}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Cake className="size-3.5" /> {patientData.dataNascimento} ({patientData.idade})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5" /> {patientData.telefone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="size-3.5" /> CNS: {patientData.cns}
              </span>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark">
            <Pencil className="size-4" /> Editar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {activeTab === 'resumo' && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Resumo do Paciente</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-primary">Condições Crônicas</p>
                <p className="mt-1 text-sm text-foreground">Hipertensão Arterial, Diabetes Tipo 2</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-700">Alergias</p>
                <p className="mt-1 text-sm text-foreground">Dipirona, Penicilina</p>
              </div>
              <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                <p className="text-sm font-semibold text-secondary-dark">Última Consulta</p>
                <p className="mt-1 text-sm text-foreground">10/01/2026 - Dr. Roberto</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'historico' && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Histórico de Atendimentos</h3>
            <div className="relative space-y-6 pl-6 before:absolute before:left-[3px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border">
              {historicoItems.map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-6 top-1.5 size-2.5 rounded-full border-2 border-primary bg-white" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{item.tipo}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" /> {item.data}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-foreground">{item.descricao}</p>
                  <p className="text-xs text-muted-foreground">{item.medico}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'exames' || activeTab === 'prescricoes' || activeTab === 'vacinas') && (
          <div className="py-8 text-center">
            <FolderOpen className="mx-auto mb-3 size-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Nenhum registro encontrado nesta seção.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Prontuario;
