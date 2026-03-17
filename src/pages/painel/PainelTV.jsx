import { useState, useEffect, useRef, useCallback } from 'react';
import {
  HeartPulse,
  ArrowRight,
  Clock,
  Users,
  Star,
  Volume2,
  Megaphone,
  Shield,
  Ticket,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ── Health tips for the scrolling marquee ──────────────────────────────
const DICAS_SAUDE = [
  'Mantenha sua caderneta de vacinacao em dia',
  'Em caso de emergencia ligue 192 - SAMU',
  'Beba pelo menos 2 litros de agua por dia',
  'Lave as maos frequentemente com agua e sabao',
  'Acompanhe suas consultas de rotina regularmente',
  'Pratique atividade fisica pelo menos 30 minutos por dia',
  'Evite a automedicacao - consulte sempre um profissional de saude',
  'Mantenha o cartao do SUS sempre atualizado',
  'A vacinacao e a melhor forma de prevencao contra doencas',
  'Cuide da sua saude mental - procure ajuda quando precisar',
  'Gestantes: faca o pre-natal completo com pelo menos 6 consultas',
  'Hipertensos e diabeticos: nao abandone o tratamento',
];

// ── Simulated data ─────────────────────────────────────────────────────
const MOCK_CHAMADAS = [
  { id: 1, numero: 'P001', paciente: 'Maria da Conceicao Silva', tipo: 'preferencial', prioridade: 'idoso', guiche: { nome: 'Consultorio 01' }, profissional: 'Dr. Carlos Oliveira' },
  { id: 2, numero: 'N003', paciente: 'Jose Carlos Oliveira', tipo: 'normal', prioridade: 'normal', guiche: { nome: 'Guiche 01 - Recepcao' }, profissional: 'Joana Ferreira' },
  { id: 3, numero: 'P004', paciente: 'Ana Beatriz Souza', tipo: 'preferencial', prioridade: 'gestante', guiche: { nome: 'Consultorio 02' }, profissional: 'Dra. Ana Santos' },
  { id: 4, numero: 'N007', paciente: 'Roberto Santos Nascimento', tipo: 'normal', prioridade: 'normal', guiche: { nome: 'Sala de Vacina' }, profissional: 'Enf. Maria Souza' },
  { id: 5, numero: 'P006', paciente: 'Francisca Alves Mendes', tipo: 'preferencial', prioridade: 'idoso', guiche: { nome: 'Consultorio 03' }, profissional: 'Dr. Paulo Lima' },
  { id: 6, numero: 'N009', paciente: 'Pedro Henrique Costa', tipo: 'normal', prioridade: 'normal', guiche: { nome: 'Sala de Triagem' }, profissional: 'Enf. Ana Paula' },
  { id: 7, numero: 'P008', paciente: 'Luiza Fernanda Rocha', tipo: 'preferencial', prioridade: 'deficiente', guiche: { nome: 'Sala de Coleta' }, profissional: 'Tec. Roberto Alves' },
  { id: 8, numero: 'N011', paciente: 'Antonio Pereira Lima', tipo: 'normal', prioridade: 'normal', guiche: { nome: 'Guiche 02 - Farmacia' }, profissional: 'Farm. Juliana Rocha' },
  { id: 9, numero: 'P010', paciente: 'Carla Mendes Ferreira', tipo: 'preferencial', prioridade: 'lactante', guiche: { nome: 'Consultorio 01' }, profissional: 'Dr. Carlos Oliveira' },
  { id: 10, numero: 'N013', paciente: 'Eduardo Carvalho Santos', tipo: 'normal', prioridade: 'normal', guiche: { nome: 'Sala de Curativo' }, profissional: 'Enf. Patricia Gomes' },
];

const MOCK_AGUARDANDO = [
  { numero: 'P012', tipo: 'preferencial', prioridade: 'idoso' },
  { numero: 'N014', tipo: 'normal', prioridade: 'normal' },
  { numero: 'N015', tipo: 'normal', prioridade: 'normal' },
];

// ── Days/months in Portuguese ──────────────────────────────────────────
const DIAS_SEMANA = [
  'Domingo', 'Segunda-feira', 'Terca-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sabado',
];
const MESES = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function formatDateTime(date) {
  const dia = DIAS_SEMANA[date.getDay()];
  const d = String(date.getDate()).padStart(2, '0');
  const mes = MESES[date.getMonth()];
  const ano = date.getFullYear();
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${dia}, ${d} de ${mes} de ${ano} - ${h}:${m}:${s}`;
}

function spellNumber(str) {
  const digitWords = {
    '0': 'zero', '1': 'um', '2': 'dois', '3': 'tres',
    '4': 'quatro', '5': 'cinco', '6': 'seis', '7': 'sete',
    '8': 'oito', '9': 'nove',
  };
  return str.split('').map((ch) => digitWords[ch] || ch).join(' ');
}

function buildSpeechText(chamada) {
  if (!chamada) return null;
  const tipoLabel = chamada.tipo === 'preferencial' ? 'Preferencial' : 'Normal';
  const numero = spellNumber(chamada.numero.replace(/[^0-9]/g, ''));
  const guiche = chamada.guiche?.nome || '';
  const guicheDigits = guiche.replace(/[^0-9]/g, '');
  const guicheSpelled = guicheDigits ? spellNumber(guicheDigits) : '';
  const guicheBase = guiche.replace(/[0-9]/g, '').trim();
  return `Atencao! Senha ${tipoLabel} ${numero}, dirija-se ao ${guicheBase} ${guicheSpelled}`;
}

function formatTime(iso) {
  if (!iso) return '--:--';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function timeAgo(minutes) {
  const d = new Date(Date.now() - minutes * 60000);
  return formatTime(d.toISOString());
}

// ── CSS animations ─────────────────────────────────────────────────────
const STYLE_ID = 'painel-tv-styles';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes painel-pulse-border {
      0%, 100% { border-color: #00A651; box-shadow: 0 0 15px rgba(0,166,81,0.25); }
      50% { border-color: #4DC47D; box-shadow: 0 0 30px rgba(0,166,81,0.5); }
    }
    @keyframes painel-slide-in {
      0% { opacity: 0; transform: translateX(60px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes painel-nova-chamada {
      0% { opacity: 1; transform: scale(1); }
      10% { transform: scale(1.03); }
      20% { transform: scale(1); }
      100% { opacity: 0; }
    }
    @keyframes painel-marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    @keyframes painel-number-glow {
      0%, 100% { text-shadow: 0 0 15px rgba(0,166,81,0.3); }
      50% { text-shadow: 0 0 30px rgba(0,166,81,0.6), 0 0 60px rgba(0,166,81,0.2); }
    }
    @keyframes painel-waiting-pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    @keyframes painel-badge-flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    .painel-pulse-border { animation: painel-pulse-border 2s ease-in-out infinite; }
    .painel-slide-in { animation: painel-slide-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
    .painel-nova-chamada { animation: painel-nova-chamada 5s ease-in-out forwards; }
    .painel-marquee { animation: painel-marquee 45s linear infinite; }
    .painel-number-glow { animation: painel-number-glow 2s ease-in-out infinite; }
    .painel-waiting-pulse { animation: painel-waiting-pulse 2s ease-in-out infinite; }
    .painel-badge-flash { animation: painel-badge-flash 1.5s ease-in-out infinite; }
  `;
  document.head.appendChild(style);
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function PainelTV() {
  const [chamadaAtual, setChamadaAtual] = useState(null);
  const [ultimasChamadas, setUltimasChamadas] = useState([]);
  const [aguardando, setAguardando] = useState({ total: 0, proximas: [] });
  const [dateTime, setDateTime] = useState(new Date());
  const [novaChamada, setNovaChamada] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const [usandoSimulacao, setUsandoSimulacao] = useState(false);

  const lastCallRef = useRef(null);
  const mockIndexRef = useRef(0);
  const apiFailCountRef = useRef(0);

  useEffect(() => { injectStyles(); }, []);
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Speech synthesis ────────────────────────────────────────────────
  const speak = useCallback((text) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.rate = 0.85;
    utter.pitch = 1;
    utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find((v) => v.lang.startsWith('pt'));
    if (ptVoice) utter.voice = ptVoice;
    window.speechSynthesis.speak(utter);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  // ── Trigger new call animation + speech ─────────────────────────────
  const triggerNovaChamada = useCallback((current) => {
    const currentId = current ? `${current.numero}-${current.guiche?.nome}` : null;
    if (current && currentId !== lastCallRef.current) {
      setNovaChamada(true);
      setSlideKey((k) => k + 1);
      setTimeout(() => setNovaChamada(false), 5000);
      const speechText = buildSpeechText(current);
      speak(speechText);
      setTimeout(() => speak(speechText), 4000);
    }
    lastCallRef.current = currentId;
  }, [speak]);

  // ── Simulate next call ──────────────────────────────────────────────
  const simularChamada = useCallback(() => {
    const idx = mockIndexRef.current % MOCK_CHAMADAS.length;
    const current = MOCK_CHAMADAS[idx];
    mockIndexRef.current++;

    // Build history from previous calls
    const histStart = Math.max(0, idx - 4);
    const hist = [];
    for (let i = idx - 1; i >= histStart && i >= 0; i--) {
      const m = MOCK_CHAMADAS[i % MOCK_CHAMADAS.length];
      hist.push({
        numero: m.numero,
        paciente: m.paciente,
        guicheNome: m.guiche.nome,
        tipo: m.tipo,
        chamadoEm: new Date(Date.now() - (idx - i) * 8 * 60000).toISOString(),
      });
    }

    setChamadaAtual(current);
    setUltimasChamadas(hist);
    setAguardando({
      total: Math.floor(Math.random() * 8) + 3,
      proximas: MOCK_AGUARDANDO,
    });
    triggerNovaChamada(current);
  }, [triggerNovaChamada]);

  // ── Fetch from API or fallback to simulation ────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/panel/senha-atual`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      apiFailCountRef.current = 0;

      if (usandoSimulacao) setUsandoSimulacao(false);

      const current = data.chamadaAtual || null;
      setChamadaAtual(current);
      setUltimasChamadas(data.ultimasChamadas || []);
      setAguardando(data.aguardando || { total: 0, proximas: [] });
      triggerNovaChamada(current);
    } catch {
      apiFailCountRef.current++;
      // After 2 fails, switch to simulation
      if (apiFailCountRef.current >= 2) {
        if (!usandoSimulacao) setUsandoSimulacao(true);
      }
    }
  }, [triggerNovaChamada, usandoSimulacao]);

  // ── Polling: API every 3s, simulation every 8s ──────────────────────
  useEffect(() => {
    fetchData();
    const apiInterval = setInterval(fetchData, 3000);
    return () => clearInterval(apiInterval);
  }, [fetchData]);

  useEffect(() => {
    if (!usandoSimulacao) return;
    simularChamada(); // immediate first call
    const simInterval = setInterval(simularChamada, 8000);
    return () => clearInterval(simInterval);
  }, [usandoSimulacao, simularChamada]);

  const firstName = (name) => (name ? name.split(' ').slice(0, 2).join(' ') : '');

  // ════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col select-none"
      style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #0f1f3d 40%, #0a1628 100%)',
        fontFamily: "'Inter', 'Roboto', system-ui, sans-serif",
      }}
    >
      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ═══════════ TOP BAR ═══════════ */}
      <header
        className="relative z-10 flex h-16 shrink-0 items-center justify-between px-6"
        style={{ background: 'linear-gradient(90deg, rgba(0,84,166,0.3) 0%, rgba(0,166,81,0.15) 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-700 p-2">
            <HeartPulse className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">PEC - Prontuario Eletronico</h1>
            <p className="text-[10px] font-medium text-green-400/70">e-SUS Atencao Primaria</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Megaphone className="text-amber-400" size={22} />
          <h2 className="text-lg font-extrabold uppercase tracking-widest text-white">
            Painel de Chamada
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="text-blue-300" size={18} />
          <p className="text-sm font-semibold tabular-nums text-white">
            {formatDateTime(dateTime)}
          </p>
          {usandoSimulacao && (
            <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              DEMO
            </span>
          )}
        </div>
      </header>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className="relative z-10 flex min-h-0 flex-1 gap-4 px-6 py-4">

        {/* ── LEFT: CURRENT CALL (65%) ─────────────────────────────── */}
        <section className="flex w-[65%] flex-col gap-3">
          {/* "NOVA CHAMADA" flash banner */}
          {novaChamada && (
            <div className="painel-nova-chamada flex shrink-0 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 py-2">
              <Volume2 className="text-white" size={24} />
              <span className="text-xl font-black uppercase tracking-[0.2em] text-white">
                Nova Chamada
              </span>
              <Volume2 className="text-white" size={24} />
            </div>
          )}

          {chamadaAtual ? (
            <div
              key={slideKey}
              className="painel-slide-in painel-pulse-border flex min-h-0 flex-1 flex-col items-center justify-center rounded-2xl border-[3px] border-green-500 px-6 py-4"
              style={{
                background: 'linear-gradient(145deg, rgba(15,31,61,0.95) 0%, rgba(10,22,40,0.98) 100%)',
              }}
            >
              {/* Preferencial badge */}
              {chamadaAtual.tipo === 'preferencial' && (
                <div className="painel-badge-flash mb-2 flex items-center gap-2 rounded-full bg-amber-500/90 px-4 py-1">
                  <Star className="text-amber-900" size={16} fill="currentColor" />
                  <span className="text-sm font-extrabold uppercase tracking-widest text-amber-900">
                    Preferencial
                  </span>
                </div>
              )}

              {/* Label */}
              <p className="mb-1 text-sm font-semibold uppercase tracking-[0.3em] text-blue-300/60">
                Senha Atual
              </p>

              {/* Ticket number */}
              <div className="painel-number-glow mb-2 flex items-center gap-3">
                <Ticket className="text-green-400" size={40} />
                <span className="font-black leading-none text-white" style={{ fontSize: 'clamp(60px, 10vw, 120px)' }}>
                  {chamadaAtual.numero}
                </span>
              </div>

              {/* Patient name */}
              <p className="mb-3 text-center font-bold text-white/90" style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}>
                {chamadaAtual.paciente}
              </p>

              {/* Destination */}
              <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/5 px-6 py-3">
                <ArrowRight className="text-green-400" size={32} strokeWidth={3} />
                <span className="font-extrabold text-green-400" style={{ fontSize: 'clamp(20px, 2.5vw, 34px)' }}>
                  {chamadaAtual.guiche?.nome || 'Consultorio'}
                </span>
              </div>

              {/* Professional */}
              {chamadaAtual.profissional && (
                <div className="flex items-center gap-2 text-blue-200/60">
                  <Stethoscope size={20} />
                  <span className="text-lg font-medium">{chamadaAtual.profissional}</span>
                </div>
              )}
            </div>
          ) : (
            <div
              className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-blue-500/20"
              style={{ background: 'linear-gradient(145deg, rgba(15,31,61,0.6) 0%, rgba(10,22,40,0.8) 100%)' }}
            >
              <div className="painel-waiting-pulse flex flex-col items-center gap-4">
                <div className="rounded-full bg-blue-500/10 p-6">
                  <Clock className="text-blue-400/60" size={56} />
                </div>
                <p className="text-center text-2xl font-bold text-blue-300/60">
                  Aguardando proximo paciente...
                </p>
                <p className="text-sm text-blue-400/40">O painel sera atualizado automaticamente</p>
              </div>
            </div>
          )}
        </section>

        {/* ── RIGHT: HISTORY + WAITING (35%) ───────────────────────── */}
        <aside className="flex w-[35%] flex-col gap-4">
          {/* Ultimas Chamadas */}
          <div
            className="flex min-h-0 flex-1 flex-col rounded-xl border border-white/5 p-4"
            style={{ background: 'linear-gradient(180deg, rgba(15,31,61,0.8) 0%, rgba(10,22,40,0.9) 100%)' }}
          >
            <div className="mb-3 flex shrink-0 items-center gap-2 border-b border-white/10 pb-2">
              <Clock className="text-blue-400" size={18} />
              <h3 className="text-base font-bold uppercase tracking-wider text-blue-300">
                Ultimas Chamadas
              </h3>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-auto">
              {ultimasChamadas.length > 0 ? (
                ultimasChamadas.slice(0, 5).map((item, idx) => (
                  <div
                    key={`${item.numero}-${idx}`}
                    className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 ${
                      idx === 0
                        ? 'border border-green-500/30 bg-green-500/10'
                        : idx % 2 === 0
                          ? 'bg-white/[0.03]'
                          : 'bg-white/[0.06]'
                    }`}
                  >
                    <span
                      className={`min-w-[56px] text-center text-lg font-black ${
                        idx === 0 ? 'text-green-400' : 'text-white/80'
                      }`}
                    >
                      {item.numero}
                    </span>
                    {item.tipo === 'preferencial' && (
                      <Star className="shrink-0 text-amber-400" size={14} fill="currentColor" />
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm text-white/60">
                      {firstName(item.paciente)}
                    </span>
                    <span className="shrink-0 text-xs text-blue-300/50">
                      {item.guicheNome || item.guiche?.nome || '--'}
                    </span>
                    <span className="shrink-0 tabular-nums text-xs text-white/40">
                      {formatTime(item.chamadoEm)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-sm text-white/20">Nenhuma chamada anterior</p>
                </div>
              )}
            </div>
          </div>

          {/* Aguardando */}
          <div
            className="flex shrink-0 flex-col rounded-xl border border-white/5 p-4"
            style={{ background: 'linear-gradient(180deg, rgba(15,31,61,0.8) 0%, rgba(10,22,40,0.9) 100%)' }}
          >
            <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
              <Users className="text-amber-400" size={18} />
              <h3 className="text-base font-bold uppercase tracking-wider text-amber-300">
                Aguardando
              </h3>
            </div>

            {/* Queue count */}
            <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-amber-500/10 py-2">
              <Users className="text-amber-400" size={22} />
              <span className="text-2xl font-extrabold text-amber-300">{aguardando.total}</span>
              <span className="text-sm font-medium text-amber-300/70">
                {aguardando.total === 1 ? 'paciente na fila' : 'pacientes na fila'}
              </span>
            </div>

            {/* Next 3 waiting */}
            <div className="flex flex-col gap-1.5">
              {aguardando.proximas && aguardando.proximas.length > 0 ? (
                aguardando.proximas.slice(0, 3).map((item, idx) => (
                  <div
                    key={`wait-${item.numero}-${idx}`}
                    className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="text-white/30" size={16} />
                      <span className="text-lg font-bold text-white/70">{item.numero}</span>
                    </div>
                    {item.tipo === 'preferencial' ? (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                        PREFERENCIAL
                      </span>
                    ) : (
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400/60">
                        Normal
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="py-2 text-center text-xs text-white/20">Fila vazia</p>
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* ═══════════ BOTTOM BAR ═══════════ */}
      <footer
        className="relative z-10 shrink-0 border-t border-white/10"
        style={{ background: 'linear-gradient(90deg, rgba(0,84,166,0.25) 0%, rgba(0,166,81,0.1) 100%)' }}
      >
        {/* Scrolling marquee */}
        <div className="overflow-hidden py-2">
          <div className="painel-marquee flex whitespace-nowrap">
            {DICAS_SAUDE.map((dica, idx) => (
              <span key={idx} className="mx-10 flex items-center gap-2 text-sm text-blue-200/70">
                <Shield className="inline shrink-0 text-green-400/60" size={14} />
                {dica}
              </span>
            ))}
          </div>
        </div>

        {/* Institution bar */}
        <div className="flex items-center justify-center gap-4 border-t border-white/5 py-2">
          <HeartPulse className="text-green-500/60" size={16} />
          <span className="text-xs font-medium tracking-wider text-white/40">
            Unidade Basica de Saude - Sistema Unico de Saude (SUS)
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[10px] text-white/30">
            Ministerio da Saude - Governo Federal
          </span>
        </div>
      </footer>
    </div>
  );
}
