import { useState, useRef, useEffect, useMemo } from 'react';
import { config } from '../../config/app.config';
import { Bot, Paperclip, Send, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h4 class="font-bold text-sm mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-bold mt-3 mb-1">$1</h3>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/`(.+?)`/g, '<code class="bg-black/10 rounded px-1 text-xs">$1</code>')
    .replace(/⚠️/g, '<span class="text-amber-600">⚠️</span>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant', content: `Olá! Sou o assistente de IA do **PEC (Prontuário Eletrônico do Cidadão)**, sistema de saúde pública do Brasil.

**Minhas habilidades incluem:**
- Apoio à decisão clínica baseada em evidências
- Análise de sintomas e sugestão de diagnósticos diferenciais
- Recomendação de exames laboratoriais e de imagem
- Identificação de alertas de segurança e interações medicamentosas
- Orientações sobre protocolos do Ministério da Saúde e SUS
- Sugestão de medicamentos da RENAME

Como posso ajudar você hoje?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('deepseek');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${config.api.ai}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response.content, mode: data.mode, model: data.response.model }]);
      } else {
        throw new Error(data.error || 'Erro ao processar mensagem');
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Erro: ${error.message}. Verifique se o servidor backend está rodando.`, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat limpo. Como posso ajudar?' }]);
  };

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Bot className="size-6 text-primary" />
          Assistente IA
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-primary">DeepSeek</span>
          </div>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="h-9 rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="deepseek">DeepSeek (Padrão)</option>
            <option value="openai">OpenAI (GPT-4)</option>
            <option value="gemini">Google Gemini</option>
          </select>
          <button onClick={clearChat}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Trash2 className="size-4" /> Limpar
          </button>
        </div>
      </div>

      {/* Chat container */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'rounded-br-md bg-primary text-white'
                  : msg.isError
                    ? 'rounded-bl-md border border-red-200 bg-red-50 text-red-700'
                    : 'rounded-bl-md bg-muted text-foreground'
              )}>
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="prose-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                )}
                {msg.mode && (
                  <p className="mt-2 text-[10px] opacity-60">
                    {msg.mode === 'demo' ? 'Modo Demo' : 'Produção'} &middot; {msg.model}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Processando...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <button className="shrink-0 rounded-lg border border-border p-2.5 text-muted-foreground hover:bg-muted" title="Anexar arquivo">
              <Paperclip className="size-4" />
            </button>
            <textarea
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              className="min-h-[40px] max-h-32 flex-1 resize-none rounded-lg border border-input bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className={cn(
                'shrink-0 rounded-lg p-2.5 transition-colors',
                input.trim() && !loading
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <Send className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Pressione Enter para enviar. O assistente pode auxiliar em decisões clínicas.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
