import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  Monitor, Megaphone, Printer, RotateCcw, PlayCircle, XCircle,
  Clock, Users, UserCheck, UserX, Volume2, ChevronDown,
  Ticket, AlertTriangle, Plus, RefreshCw, Trash2, Baby,
  Accessibility, Heart, User, Hash, CheckCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ── Priority config ──────────────────────────────────────────────
const PRIORIDADE_CONFIG = {
  normal:     { label: 'Normal',                   color: 'bg-gray-100 text-gray-700' },
  idoso:      { label: 'Idoso (60+)',              color: 'bg-amber-100 text-amber-800' },
  gestante:   { label: 'Gestante',                 color: 'bg-pink-100 text-pink-700' },
  deficiencia:{ label: 'PcD',                      color: 'bg-purple-100 text-purple-700' },
  lactante:   { label: 'Lactante',                 color: 'bg-rose-100 text-rose-700' },
};

const PRIORIDADE_ICON = {
  normal:      User,
  idoso:       Users,
  gestante:    Heart,
  deficiencia: Accessibility,
  lactante:    Baby,
};

// ── Safe string helper — prevents objects from leaking into JSX ──
function safeStr(v) {
  if (v == null) return '';
  if (typeof v === 'object') return v.nome || v.label || String(v.id || '') || '';
  return String(v);
}

// ── Helpers ──────────────────────────────────────────────────────
function formatCPF(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function tempoEspera(criadoEm) {
  if (!criadoEm) return '--';
  const diff = Date.now() - new Date(criadoEm).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Agora';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h${m > 0 ? ` ${m}min` : ''}`;
}

function horaFormatada(iso) {
  if (!iso) return '--';
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ── Status badge component ───────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    aguardando:     'bg-amber-100 text-amber-800',
    chamando:       'bg-blue-100 text-blue-800 animate-pulse',
    em_atendimento: 'bg-green-100 text-green-800',
    atendido:       'bg-gray-100 text-gray-600',
    ausente:        'bg-red-100 text-red-700',
  };
  const labels = {
    aguardando: 'Aguardando', chamando: 'Chamando', em_atendimento: 'Em Atendimento',
    atendido: 'Atendido', ausente: 'Ausente',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', map[status] || 'bg-gray-100 text-gray-600')}>
      {labels[status] || status}
    </span>
  );
}

// ── Main component ───────────────────────────────────────────────
export default function PainelChamada() {
  // Stats
  const [stats, setStats] = useState({
    aguardando: 0, chamando: 0, em_atendimento: 0, atendidos: 0, ausentes: 0, tempo_medio_espera: 0,
  });

  // Ticket form
  const [formNome, setFormNome] = useState('');
  const [formCPF, setFormCPF] = useState('');
  const [formTipo, setFormTipo] = useState('normal');
  const [formPrioridade, setFormPrioridade] = useState('normal');
  const [senhaGerada, setSenhaGerada] = useState(null);
  const [gerando, setGerando] = useState(false);

  // Queue
  const [fila, setFila] = useState([]);
  const [guiches, setGuiches] = useState([]);
  const [guicheSelecionado, setGuicheSelecionado] = useState('');

  // Current call
  const [chamadaAtual, setChamadaAtual] = useState(null);

  // History
  const [historico, setHistorico] = useState([]);

  // UI
  const [alerta, setAlerta] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Alert helper ─────────────────────────────────────────────
  const mostrarAlerta = useCallback((msg, tipo = 'success') => {
    setAlerta({ msg, tipo });
    setTimeout(() => setAlerta(null), 4000);
  }, []);

  // ── API helpers ──────────────────────────────────────────────
  const fetchJSON = useCallback(async (url, options = {}) => {
    const res = await fetch(`${API_URL}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `Erro ${res.status}`);
    }
    const json = await res.json();
    // Unwrap { success, data } envelope if present
    return json.data !== undefined ? json.data : json;
  }, []);

  // ── Data loaders ─────────────────────────────────────────────
  const carregarEstatisticas = useCallback(async () => {
    try {
      const data = await fetchJSON('/panel/estatisticas');
      setStats(data);
    } catch { /* silent */ }
  }, [fetchJSON]);

  const carregarFila = useCallback(async () => {
    try {
      const data = await fetchJSON('/panel/senhas?status=aguardando');
      setFila(Array.isArray(data) ? data : data.senhas || []);
    } catch { /* silent */ }
  }, [fetchJSON]);

  const carregarGuiches = useCallback(async () => {
    try {
      const data = await fetchJSON('/panel/guiches');
      const list = Array.isArray(data) ? data : data.guiches || [];
      setGuiches(list);
      if (list.length > 0 && !guicheSelecionado) {
        setGuicheSelecionado(safeStr(list[0].id || list[0].numero || list[0].nome || list[0]));
      }
    } catch {
      // Fallback guiches
      const fallback = [
        { id: '1', nome: 'Guichê 01' },
        { id: '2', nome: 'Guichê 02' },
        { id: '3', nome: 'Guichê 03' },
        { id: '4', nome: 'Sala 01' },
        { id: '5', nome: 'Sala 02' },
      ];
      setGuiches(fallback);
      if (!guicheSelecionado) setGuicheSelecionado(fallback[0].id);
    }
  }, [fetchJSON, guicheSelecionado]);

  const carregarHistorico = useCallback(async () => {
    try {
      const data = await fetchJSON('/panel/historico?limit=10');
      setHistorico(Array.isArray(data) ? data : data.historico || []);
    } catch { /* silent */ }
  }, [fetchJSON]);

  // Flatten chamada — explicitly pick only primitive fields (no object spread)
  const flattenChamada = (c) => {
    if (!c || typeof c !== 'object') return null;
    if (!c.id && !c.numero) return null; // not a valid chamada
    return {
      id: c.id || c._id || '',
      numero: c.numero || '',
      paciente: safeStr(c.paciente || c.nome),
      cpf: c.cpf || '',
      tipo: c.tipo || 'normal',
      status: c.status || '',
      guicheId: safeStr(c.guicheId),
      prioridade: c.prioridade || 'normal',
      criadoEm: c.criadoEm || c.createdAt || null,
      chamadoEm: c.chamadoEm || null,
      atendidoEm: c.atendidoEm || null,
      guicheNome: safeStr(c.guiche?.nome || c.guicheNome),
      profissional: safeStr(c.profissional || c.guiche?.profissional),
    };
  };

  const carregarChamadaAtual = useCallback(async () => {
    try {
      const data = await fetchJSON('/panel/senha-atual');
      setChamadaAtual(flattenChamada(data?.chamadaAtual));
    } catch {
      setChamadaAtual(null);
    }
  }, [fetchJSON]);

  const carregarTudo = useCallback(() => {
    carregarEstatisticas();
    carregarFila();
    carregarHistorico();
    carregarChamadaAtual();
  }, [carregarEstatisticas, carregarFila, carregarHistorico, carregarChamadaAtual]);

  // ── Initial load + polling ───────────────────────────────────
  useEffect(() => {
    carregarGuiches();
    carregarTudo();
    const interval = setInterval(carregarTudo, 5000);
    return () => clearInterval(interval);
  }, [carregarGuiches, carregarTudo]);

  // ── Actions ──────────────────────────────────────────────────
  const gerarSenha = async (e) => {
    e.preventDefault();
    if (!formNome.trim()) {
      mostrarAlerta('Informe o nome do paciente.', 'error');
      return;
    }
    setGerando(true);
    try {
      const data = await fetchJSON('/panel/senhas', {
        method: 'POST',
        body: JSON.stringify({
          paciente: formNome.trim(),
          cpf: formCPF.replace(/\D/g, '') || undefined,
          tipo: formTipo,
          prioridade: formPrioridade,
        }),
      });
      setSenhaGerada(data);
      setFormNome('');
      setFormCPF('');
      setFormTipo('normal');
      setFormPrioridade('normal');
      mostrarAlerta(`Senha ${data.numero} gerada com sucesso!`);
      carregarTudo();
    } catch (err) {
      mostrarAlerta(err.message || 'Erro ao gerar senha.', 'error');
    } finally {
      setGerando(false);
    }
  };

  const chamarProxima = async () => {
    if (!guicheSelecionado) {
      mostrarAlerta('Selecione um guichê primeiro.', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchJSON('/panel/chamar-proxima', {
        method: 'POST',
        body: JSON.stringify({ guicheId: guicheSelecionado }),
      });
      const senha = data?.senha || data;
      if (!senha || !senha.numero) {
        mostrarAlerta('Nenhuma senha na fila.', 'error');
        return;
      }
      const guiche = data?.guiche || {};
      setChamadaAtual(flattenChamada({ ...senha, guiche }));
      mostrarAlerta(`Chamando senha ${safeStr(senha.numero)} para ${safeStr(guiche.nome) || 'o guichê'}`);
      carregarTudo();
    } catch (err) {
      mostrarAlerta(err.message || 'Nenhuma senha na fila.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const chamarSenha = async (senhaId) => {
    if (!guicheSelecionado) {
      mostrarAlerta('Selecione um guichê primeiro.', 'error');
      return;
    }
    try {
      const data = await fetchJSON(`/panel/chamar/${senhaId}`, {
        method: 'POST',
        body: JSON.stringify({ guicheId: guicheSelecionado }),
      });
      const senha = data?.senha || data;
      const guiche = data?.guiche || {};
      setChamadaAtual(flattenChamada({ ...senha, guiche }));
      mostrarAlerta(`Chamando senha ${safeStr(senha?.numero)}`);
      carregarTudo();
    } catch (err) {
      mostrarAlerta(err.message || 'Erro ao chamar senha.', 'error');
    }
  };

  const rechamar = async () => {
    if (!chamadaAtual) return;
    try {
      await fetchJSON(`/panel/rechamar/${chamadaAtual.id || chamadaAtual._id}`, { method: 'POST' });
      mostrarAlerta(`Rechamando senha ${chamadaAtual.numero}`);
    } catch (err) {
      mostrarAlerta(err.message || 'Erro ao rechamar.', 'error');
    }
  };

  const iniciarAtendimento = async () => {
    if (!chamadaAtual) return;
    try {
      await fetchJSON(`/panel/iniciar/${chamadaAtual.id || chamadaAtual._id}`, { method: 'POST' });
      mostrarAlerta('Atendimento iniciado.');
      setChamadaAtual(null);
      carregarTudo();
    } catch (err) {
      mostrarAlerta(err.message || 'Erro ao iniciar atendimento.', 'error');
    }
  };

  const marcarAusente = async () => {
    if (!chamadaAtual) return;
    try {
      await fetchJSON(`/panel/ausente/${chamadaAtual.id || chamadaAtual._id}`, { method: 'POST' });
      mostrarAlerta('Paciente marcado como ausente.');
      setChamadaAtual(null);
      carregarTudo();
    } catch (err) {
      mostrarAlerta(err.message || 'Erro ao marcar ausente.', 'error');
    }
  };

  const resetarPainel = async () => {
    try {
      await fetchJSON('/panel/resetar', { method: 'POST' });
      mostrarAlerta('Painel resetado com sucesso.');
      setChamadaAtual(null);
      setSenhaGerada(null);
      setConfirmReset(false);
      carregarTudo();
    } catch (err) {
      mostrarAlerta(err.message || 'Erro ao resetar painel.', 'error');
    }
  };

  const imprimirSenha = () => {
    if (!senhaGerada) return;
    const printWindow = window.open('', '_blank', 'width=320,height=500');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Senha ${senhaGerada.numero}</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 30px 20px; }
        .header { font-size: 14px; color: #666; margin-bottom: 5px; }
        .title { font-size: 18px; font-weight: bold; color: #0054A6; margin-bottom: 20px; }
        .numero { font-size: 72px; font-weight: bold; color: #0054A6; margin: 20px 0; letter-spacing: 2px; }
        .tipo { display: inline-block; padding: 4px 16px; border-radius: 20px; font-size: 14px; font-weight: bold;
                background: ${senhaGerada.tipo === 'preferencial' ? '#FEF3C7' : '#DBEAFE'};
                color: ${senhaGerada.tipo === 'preferencial' ? '#92400E' : '#1E40AF'}; }
        .nome { font-size: 16px; margin-top: 15px; color: #333; }
        .info { font-size: 12px; color: #999; margin-top: 20px; }
        hr { border: 1px dashed #ccc; margin: 20px 0; }
      </style></head><body>
        <div class="header">Sistema Unico de Saude - SUS</div>
        <div class="title">Painel de Chamada</div>
        <hr/>
        <div class="tipo">${senhaGerada.tipo === 'preferencial' ? 'PREFERENCIAL' : 'NORMAL'}</div>
        <div class="numero">${senhaGerada.numero}</div>
        <div class="nome">${senhaGerada.paciente || senhaGerada.nome || ''}</div>
        <hr/>
        <div class="info">${new Date().toLocaleString('pt-BR')}</div>
        <div class="info">Aguarde sua chamada no painel</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 400);
  };

  // ── Guichê display name ──────────────────────────────────────
  const nomeGuiche = (val) => {
    if (!val) return '--';
    if (typeof val === 'string') {
      const g = guiches.find((g) => g.id === val || g.numero === val || g.nome === val);
      return g ? (g.nome || `Guichê ${g.id}`) : val;
    }
    if (typeof val === 'object' && val.nome) return String(val.nome);
    if (typeof val === 'object' && val.id) return `Guichê ${String(val.id)}`;
    return '--';
  };

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Painel de Chamada</h1>
          <p className="text-sm text-muted-foreground">Gerenciamento de senhas e fila de atendimento</p>
        </div>
        <button
          onClick={carregarTudo}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
        >
          <RefreshCw className="size-4" /> Atualizar
        </button>
      </div>

      {/* Toast alert */}
      {alerta && (
        <div className={cn(
          'flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-sm transition-all',
          alerta.tipo === 'error'
            ? 'border-red-200 bg-red-50 text-red-800'
            : 'border-green-200 bg-green-50 text-green-800'
        )}>
          {alerta.tipo === 'error' ? <AlertTriangle className="size-4 shrink-0" /> : <CheckCircle className="size-4 shrink-0" />}
          {alerta.msg}
        </div>
      )}

      {/* ═══════════ 1. STATS BAR ═══════════ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Aguardando',       value: stats.aguardando,       icon: Clock,     bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-200' },
          { label: 'Chamando',         value: stats.chamando,         icon: Volume2,   bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200', pulse: true },
          { label: 'Em Atendimento',   value: stats.em_atendimento,   icon: UserCheck,  bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200' },
          { label: 'Atendidos',        value: stats.atendidos,        icon: CheckCircle,bg: 'bg-gray-50',   text: 'text-gray-500',   border: 'border-gray-200' },
          { label: 'Ausentes',         value: stats.ausentes,         icon: UserX,     bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200' },
          { label: 'Tempo Médio',      value: stats.tempo_medio_espera ? `${stats.tempo_medio_espera} min` : '-- min', icon: Clock, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl border p-4 shadow-sm', s.bg, s.border)}>
            <div className="flex items-center gap-2">
              <s.icon className={cn('size-5', s.text, s.pulse && 'animate-pulse')} />
              <span className={cn('text-xs font-semibold uppercase tracking-wide', s.text)}>{s.label}</span>
            </div>
            <p className={cn('mt-2 text-3xl font-bold', s.text)}>{typeof s.value === 'object' ? '--' : s.value}</p>
          </div>
        ))}
      </div>

      {/* ═══════════ 2-4. MAIN COLUMNS ═══════════ */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">

        {/* ── LEFT: Emissao de Senha (5 cols ~ 40%) ── */}
        <div className="lg:col-span-5 space-y-5">
          <Card
            header={
              <div className="flex items-center gap-2">
                <Ticket className="size-4 text-[#0054A6]" />
                <span>Emissao de Senha</span>
              </div>
            }
          >
            <form onSubmit={gerarSenha} className="space-y-4">
              {/* Nome */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Nome do Paciente *</label>
                <input
                  type="text"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Nome completo do paciente"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#0054A6] focus:outline-none focus:ring-2 focus:ring-[#0054A6]/20"
                />
              </div>

              {/* CPF */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">CPF <span className="text-muted-foreground">(opcional)</span></label>
                <input
                  type="text"
                  value={formCPF}
                  onChange={(e) => setFormCPF(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#0054A6] focus:outline-none focus:ring-2 focus:ring-[#0054A6]/20"
                />
              </div>

              {/* Tipo + Prioridade row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Tipo</label>
                  <div className="relative">
                    <select
                      value={formTipo}
                      onChange={(e) => setFormTipo(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:border-[#0054A6] focus:outline-none focus:ring-2 focus:ring-[#0054A6]/20"
                    >
                      <option value="normal">Normal (N)</option>
                      <option value="preferencial">Preferencial (P)</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Prioridade</label>
                  <div className="relative">
                    <select
                      value={formPrioridade}
                      onChange={(e) => setFormPrioridade(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:border-[#0054A6] focus:outline-none focus:ring-2 focus:ring-[#0054A6]/20"
                    >
                      <option value="normal">Normal</option>
                      <option value="idoso">Idoso (60+)</option>
                      <option value="gestante">Gestante</option>
                      <option value="deficiencia">Pessoa com Deficiencia</option>
                      <option value="lactante">Lactante</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={gerando}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0054A6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003d7a] disabled:opacity-50"
              >
                {gerando ? <RefreshCw className="size-4 animate-spin" /> : <Plus className="size-4" />}
                {gerando ? 'Gerando...' : 'Gerar Senha'}
              </button>
            </form>

            {/* Generated ticket display */}
            {senhaGerada && (
              <div className="mt-5 rounded-xl border-2 border-dashed border-[#0054A6]/30 bg-[#0054A6]/5 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0054A6]">Senha Gerada</p>
                <span className={cn(
                  'mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold',
                  senhaGerada.tipo === 'preferencial' ? 'bg-amber-200 text-amber-900' : 'bg-blue-200 text-blue-900'
                )}>
                  {senhaGerada.tipo === 'preferencial' ? 'PREFERENCIAL' : 'NORMAL'}
                </span>
                <p className="mt-2 text-5xl font-black tracking-wider text-[#0054A6]">{safeStr(senhaGerada.numero)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{safeStr(senhaGerada.paciente || senhaGerada.nome)}</p>
                <button
                  onClick={imprimirSenha}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#0054A6]/30 bg-white px-4 py-2 text-sm font-medium text-[#0054A6] transition hover:bg-[#0054A6]/10"
                >
                  <Printer className="size-4" /> Imprimir Senha
                </button>
              </div>
            )}
          </Card>

          {/* Open TV Panel button */}
          <button
            onClick={() => window.open('/painel/tv', '_blank')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            <Monitor className="size-5 text-[#0054A6]" />
            Abrir Painel TV
          </button>
        </div>

        {/* ── CENTER: Fila de Espera (4 cols ~ 35%) ── */}
        <div className="lg:col-span-4">
          <Card
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-amber-500" />
                  <span>Fila de Espera</span>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">{fila.length}</span>
              </div>
            }
          >
            {/* Guiche selector + call next */}
            <div className="mb-4 space-y-2">
              <div className="relative">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Guiche / Sala</label>
                <select
                  value={guicheSelecionado}
                  onChange={(e) => setGuicheSelecionado(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:border-[#0054A6] focus:outline-none focus:ring-2 focus:ring-[#0054A6]/20"
                >
                  {guiches.map((g) => {
                    const val = g.id || g.numero || g.nome || g;
                    const label = g.nome || `Guiche ${g.numero || g.id || g}`;
                    return <option key={val} value={val}>{label}</option>;
                  })}
                </select>
                <ChevronDown className="pointer-events-none absolute bottom-2.5 right-2.5 size-4 text-muted-foreground" />
              </div>
              <button
                onClick={chamarProxima}
                disabled={loading || fila.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00A651] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#008c44] disabled:opacity-50"
              >
                {loading ? <RefreshCw className="size-4 animate-spin" /> : <Megaphone className="size-4" />}
                Chamar Proxima
              </button>
            </div>

            {/* Queue list */}
            <div className="max-h-[440px] space-y-2 overflow-y-auto pr-1">
              {fila.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  <Users className="mx-auto mb-2 size-8 text-muted-foreground/40" />
                  Nenhuma senha aguardando
                </div>
              )}
              {fila.map((s) => {
                const prioConfig = PRIORIDADE_CONFIG[s.prioridade] || PRIORIDADE_CONFIG.normal;
                const PrioIcon = PRIORIDADE_ICON[s.prioridade] || User;
                return (
                  <div key={s.id || s._id || s.numero} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition hover:border-[#0054A6]/30 hover:shadow-sm">
                    {/* Numero badge */}
                    <div className={cn(
                      'flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
                      s.tipo === 'preferencial' ? 'bg-amber-500' : 'bg-[#0054A6]'
                    )}>
                      {s.numero}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{safeStr(s.paciente || s.nome) || 'Paciente'}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium', prioConfig.color)}>
                          <PrioIcon className="size-3" /> {prioConfig.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          <Clock className="mb-px mr-0.5 inline size-3" />
                          {tempoEspera(s.criadoEm || s.createdAt || s.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Call button */}
                    <button
                      onClick={() => chamarSenha(s.id || s._id)}
                      title="Chamar esta senha"
                      className="shrink-0 rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                    >
                      <Megaphone className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── RIGHT: Chamada Atual & Historico (3 cols ~ 25%) ── */}
        <div className="lg:col-span-3 space-y-5">
          {/* Current call */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <Volume2 className="size-4 text-[#0054A6]" />
                <span>Chamada Atual</span>
              </div>
            }
          >
            {chamadaAtual ? (
              <div className="text-center">
                <span className={cn(
                  'inline-block rounded-full px-3 py-0.5 text-xs font-bold',
                  chamadaAtual.tipo === 'preferencial' ? 'bg-amber-200 text-amber-900' : 'bg-blue-200 text-blue-900'
                )}>
                  {chamadaAtual.tipo === 'preferencial' ? 'PREFERENCIAL' : 'NORMAL'}
                </span>
                <p className="mt-1 text-4xl font-black tracking-wider text-[#0054A6]">{safeStr(chamadaAtual.numero)}</p>
                <p className="mt-1 text-sm font-medium text-foreground">{safeStr(chamadaAtual.paciente || chamadaAtual.nome) || 'Paciente'}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {safeStr(chamadaAtual.guicheNome) || nomeGuiche(chamadaAtual.guicheId || guicheSelecionado)}
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={rechamar}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    <RotateCcw className="size-4" /> Rechamar
                  </button>
                  <button
                    onClick={iniciarAtendimento}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00A651] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#008c44]"
                  >
                    <PlayCircle className="size-4" /> Iniciar Atendimento
                  </button>
                  <button
                    onClick={marcarAusente}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    <XCircle className="size-4" /> Marcar Ausente
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Volume2 className="mx-auto mb-2 size-8 text-muted-foreground/30" />
                Nenhuma senha sendo chamada
              </div>
            )}
          </Card>

          {/* History */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span>Historico</span>
              </div>
            }
          >
            <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {historico.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">Nenhum registro</p>
              )}
              {historico.map((h, i) => (
                <div key={h.id || h._id || i} className="flex items-center gap-2.5 rounded-lg border border-border bg-background p-2.5 text-xs">
                  <div className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white',
                    h.tipo === 'preferencial' ? 'bg-amber-500' : 'bg-[#0054A6]'
                  )}>
                    {h.numero}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{safeStr(h.paciente || h.nome) || 'Paciente'}</p>
                    <p className="text-muted-foreground">
                      {safeStr(h.guicheNome || h.guiche) || '--'} &middot; {horaFormatada(h.chamadoEm || h.updatedAt || h.updated_at)}
                    </p>
                  </div>
                  <StatusBadge status={h.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ═══════════ 5. RESET BUTTON ═══════════ */}
      <div className="flex justify-end">
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="size-4" /> Resetar Painel
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3">
            <AlertTriangle className="size-5 text-red-500" />
            <span className="text-sm font-medium text-red-700">Tem certeza? Todas as senhas do dia serao apagadas.</span>
            <button
              onClick={resetarPainel}
              className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Confirmar Reset
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="rounded-lg border border-red-200 bg-white px-4 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
