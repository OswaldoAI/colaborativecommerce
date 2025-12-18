import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);

        if (result.success) {
            // Check role to redirect appropriately
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') {
                navigate('/admin');
            } else {
                navigate(from);
            }
        } else {
            setError(result.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f6f6f6'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Iniciar Sesión</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {/* Google Auth Button Placeholder */}
                <button style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                    fontWeight: 500
                }}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" />
                    Continuar con Google
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', color: '#888' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                    <span style={{ padding: '0 10px', fontSize: '0.85rem' }}>O con tu correo</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#FFD700',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}>
                        Ingresar
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    ¿No tienes cuenta? <Link to="/register" style={{ color: '#007BFF', fontWeight: 600 }}>Regístrate</Link>
                </p>
            </div>
        </div>
    );
}
