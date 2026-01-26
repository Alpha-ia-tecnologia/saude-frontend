import { useState } from 'react';

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
        <div className="fade-in">
            <h1 style={{ marginBottom: '0.5rem' }}>Cadastro de Pacientes</h1>
            <p style={{ color: 'var(--sus-gray)', marginBottom: '2rem' }}>
                Preencha os dados do paciente para realizar o cadastro
            </p>

            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <h5 style={{ marginBottom: '1rem', color: 'var(--sus-blue)' }}>
                            <i className="fas fa-user"></i> Dados Pessoais
                        </h5>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="form-label">Nome Completo *</label>
                                <input type="text" name="nome" className="form-control" value={formData.nome} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="form-label">CPF *</label>
                                <input type="text" name="cpf" className="form-control" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" required />
                            </div>
                            <div>
                                <label className="form-label">Data de Nascimento *</label>
                                <input type="date" name="dataNascimento" className="form-control" value={formData.dataNascimento} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="form-label">Sexo *</label>
                                <select name="sexo" className="form-control" value={formData.sexo} onChange={handleChange} required>
                                    <option value="">Selecione</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Cartão SUS (CNS)</label>
                                <input type="text" name="cns" className="form-control" value={formData.cns} onChange={handleChange} />
                            </div>
                        </div>

                        <h5 style={{ marginBottom: '1rem', color: 'var(--sus-blue)' }}>
                            <i className="fas fa-phone"></i> Contato
                        </h5>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="form-label">Telefone</label>
                                <input type="tel" name="telefone" className="form-control" value={formData.telefone} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="form-label">E-mail</label>
                                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                            </div>
                        </div>

                        <h5 style={{ marginBottom: '1rem', color: 'var(--sus-blue)' }}>
                            <i className="fas fa-map-marker-alt"></i> Endereço
                        </h5>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="form-label">CEP</label>
                                <input type="text" name="cep" className="form-control" value={formData.cep} onChange={handleChange} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Endereço</label>
                                <input type="text" name="endereco" className="form-control" value={formData.endereco} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="form-label">Número</label>
                                <input type="text" name="numero" className="form-control" value={formData.numero} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="form-label">Bairro</label>
                                <input type="text" name="bairro" className="form-control" value={formData.bairro} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="form-label">Cidade</label>
                                <input type="text" name="cidade" className="form-control" value={formData.cidade} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="form-label">UF</label>
                                <select name="uf" className="form-control" value={formData.uf} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="SP">São Paulo</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="MG">Minas Gerais</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-save"></i> Salvar Cadastro
                            </button>
                            <button type="button" className="btn btn-outline-primary">
                                <i className="fas fa-times"></i> Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;
