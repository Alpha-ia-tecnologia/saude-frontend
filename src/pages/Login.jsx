import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, User, Lock, LogIn, Loader2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary-light p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 size-96 rounded-full bg-white/20" />
          <div className="absolute -bottom-32 -right-32 size-[500px] rounded-full bg-white/10" />
          <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />
        </div>

        <div className="relative z-10 max-w-lg text-center text-white">
          <div className="mb-8 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <HeartPulse className="size-10" />
            </div>
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight">PEC</h1>
          <p className="mb-2 text-xl font-light text-white/90">Prontuário Eletrônico do Cidadão</p>
          <p className="text-sm text-white/60">
            Sistema integrado de gestão de saúde pública com inteligência artificial
          </p>
          <div className="mt-12 flex justify-center gap-8 text-sm text-white/50">
            <div className="text-center">
              <p className="text-2xl font-semibold text-white/80">150k+</p>
              <p>Pacientes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-white/80">500+</p>
              <p>Unidades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-white/80">99.9%</p>
              <p>Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex w-full items-center justify-center bg-background px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mb-4 inline-flex size-14 items-center justify-center rounded-xl bg-primary">
              <HeartPulse className="size-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">PEC</h1>
            <p className="text-sm text-muted-foreground">Prontuário Eletrônico do Cidadão</p>
          </div>

          <div className="mb-8 hidden lg:block">
            <h2 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  required
                  className="h-11 w-full rounded-lg border border-input bg-white pl-10 pr-4 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="h-11 w-full rounded-lg border border-input bg-white pl-10 pr-4 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-white shadow-sm transition-all',
                'hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40',
                'disabled:cursor-not-allowed disabled:opacity-60'
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <Info className="size-4" />
              Credenciais de demonstração
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="inline-block w-24 rounded bg-muted px-2 py-0.5 text-xs font-mono">admin</span>
                <span className="text-xs text-muted-foreground/60">/</span>
                <span className="text-xs font-mono">admin123</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-24 rounded bg-muted px-2 py-0.5 text-xs font-mono">medico</span>
                <span className="text-xs text-muted-foreground/60">/</span>
                <span className="text-xs font-mono">medico123</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-24 rounded bg-muted px-2 py-0.5 text-xs font-mono">enfermeiro</span>
                <span className="text-xs text-muted-foreground/60">/</span>
                <span className="text-xs font-mono">enfermeiro123</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
