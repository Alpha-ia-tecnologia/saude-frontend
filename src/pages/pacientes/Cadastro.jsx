import { useState } from 'react';
import { User, Phone, MapPin, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Cadastro() {
  const [formData, setFormData] = useState({
    nome: '', cpf: '', dataNascimento: '', sexo: '',
    cns: '', telefone: '', email: '', cep: '',
    endereco: '', numero: '', bairro: '', cidade: '', uf: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Paciente cadastrado com sucesso! (Demonstração)');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cadastro de Pacientes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha os dados do paciente para realizar o cadastro
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados Pessoais */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <User className="size-4" />
              Dados Pessoais
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-foreground">Nome Completo *</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">CPF *</label>
                <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" required
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Data de Nascimento *</label>
                <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Sexo *</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange} required
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Cartão SUS (CNS)</label>
                <input type="text" name="cns" value={formData.cns} onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <Phone className="size-4" />
              Contato
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Telefone</label>
                <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <MapPin className="size-4" />
              Endereço
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">CEP</label>
                <input type="text" name="cep" value={formData.cep} onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-foreground">Endereço</label>
                <input type="text" name="endereco" value={formData.endereco} onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Número</label>
                <input type="text" name="numero" value={formData.numero} onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Bairro</label>
                <input type="text" name="bairro" value={formData.bairro} onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Cidade</label>
                <input type="text" name="cidade" value={formData.cidade} onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">UF</label>
                <select name="uf" value={formData.uf} onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Selecione</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 border-t border-border pt-6">
            <button type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark">
              <Save className="size-4" />
              Salvar Cadastro
            </button>
            <button type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted">
              <X className="size-4" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;
