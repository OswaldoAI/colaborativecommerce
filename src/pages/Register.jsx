import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phone: '',
        municipality: '',
        province: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CLIENTE' // Default, user can pick if we expose it or based on context
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    surname: formData.surname,
                    phone: formData.phone,
                    municipality: formData.municipality,
                    province: formData.province,
                    role: formData.role
                })
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login', { state: { message: 'Registro exitoso. Por favor inicia sesión.' } });
            } else {
                setError(data.message || 'Error al registrarse');
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f6f6', padding: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Crear Cuenta</h2>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                    {/* Role Selection (Optional visibility) */}
                    <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Quiero registrarme como:</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="CLIENTE">Cliente (Comprar productos)</option>
                            <option value="PROMOTOR">Promotor (Recomendar y ganar)</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', margin: '0 0 1rem 0', color: '#888' }}>
                        <button type="button" style={{
                            width: '100%', padding: '0.75rem', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontWeight: 500
                        }}>
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" />
                            Registrarse con Google (Próximamente)
                        </button>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Nombre *</label>
                        <input name="name" required value={formData.name} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Apellido *</label>
                        <input name="surname" required value={formData.surname} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Correo Electrónico *</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Teléfono *</label>
                        <input name="phone" required value={formData.phone} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Municipio *</label>
                        <input name="municipality" required value={formData.municipality} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Provincia *</label>
                        <input name="province" required value={formData.province} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Contraseña *</label>
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Confirmar Contraseña *</label>
                        <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '1rem', backgroundColor: '#FFD700', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer'
                        }}>
                            {loading ? 'Registrando...' : 'Crear Cuenta'}
                        </button>
                    </div>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#007BFF', fontWeight: 600 }}>Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd'
};
