import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div className="login-container">
            <div className="login-card">
                <h1>
                    <i className="fas fa-heartbeat" style={{ color: 'var(--sus-green)' }}></i>
                    {' '}PEC
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--sus-gray)', marginBottom: '1.5rem' }}>
                    Prontuário Eletrônico do Cidadão
                </p>

                {error && (
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Usuário</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Digite seu usuário"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Entrando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sign-in-alt"></i> Entrar
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                    <strong>Usuários de demonstração:</strong>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', color: 'var(--sus-gray)' }}>
                        <li>admin / admin123</li>
                        <li>medico / medico123</li>
                        <li>enfermeiro / enfermeiro123</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Login;
