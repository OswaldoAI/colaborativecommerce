import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, Trash2, Edit, Plus, X } from 'lucide-react';
import { AdminProductList } from '../../components/admin/AdminProductList';

export function AdminDashboard() {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', surname: '', email: '', phone: '', municipality: '', province: '', role: 'CLIENTE', password: ''
    });
    const [editingId, setEditingId] = useState(null);

    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setError('');
            } else {
                const errData = await response.json().catch(() => ({}));
                setError(`Error ${response.status}: ${errData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Error de conexión al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setUsers(users.filter(u => u.id !== id));
            } else {
                alert('Error al eliminar');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = editingId
            ? `/api/users/${editingId}`
            : '/api/users';

        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchUsers();
                setShowModal(false);
                resetForm();
            } else {
                const err = await response.json();
                alert('Error: ' + err.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const startEdit = (user) => {
        setFormData({
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            municipality: user.municipality,
            province: user.province,
            role: user.role,
            password: '' // Keep empty unless changing
        });
        setEditingId(user.id);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ name: '', surname: '', email: '', phone: '', municipality: '', province: '', role: 'CLIENTE', password: '' });
        setEditingId(null);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', backgroundColor: '#333', color: 'white', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ marginBottom: '2rem', color: '#FFD700' }}>Admin Panel</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    <a href="#" onClick={() => setActiveTab('dashboard')} style={{ color: activeTab === 'dashboard' ? '#FFD700' : 'white', textDecoration: 'none' }}>Dashboard</a>
                    <a href="#" onClick={() => setActiveTab('users')} style={{ color: activeTab === 'users' ? '#FFD700' : 'white', textDecoration: 'none' }}>Usuarios</a>
                    <a href="#" onClick={() => setActiveTab('products')} style={{ color: activeTab === 'products' ? '#FFD700' : 'white', textDecoration: 'none' }}>Catálogo</a>
                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Configuración</a>
                </nav>
                <button onClick={logout} style={{ marginTop: 'auto', background: 'none', border: '1px solid #555', color: 'white', padding: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}>
                    Cerrar Sesión
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f4f4f4', overflowY: 'auto' }}>
                {activeTab === 'users' ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h1 style={{ margin: 0 }}>Gestión de Usuarios</h1>
                            <button
                                onClick={() => { resetForm(); setShowModal(true); }}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                <Plus size={18} /> Nuevo Usuario
                            </button>
                        </div>

                        {error && (
                            <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                {error}
                            </div>
                        )}

                        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead style={{ backgroundColor: '#f9fafb' }}>
                                    <tr style={{ textAlign: 'left' }}>
                                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Nombre</th>
                                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Email</th>
                                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Teléfono</th>
                                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Ubicación</th>
                                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Rol</th>
                                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Cargando...</td></tr>
                                    ) : users.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '12px 16px' }}>{u.name} {u.surname}</td>
                                            <td style={{ padding: '12px 16px' }}>{u.email}</td>
                                            <td style={{ padding: '12px 16px' }}>{u.phone}</td>
                                            <td style={{ padding: '12px 16px' }}>{u.municipality}, {u.province}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{
                                                    backgroundColor: u.role === 'SUPERADMIN' ? '#e0e7ff' : '#ecfccb',
                                                    color: u.role === 'SUPERADMIN' ? '#3730a3' : '#3f6212',
                                                    padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600
                                                }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => startEdit(u)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4b5563' }}><Edit size={18} /></button>
                                                    <button onClick={() => handleDelete(u.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : activeTab === 'products' ? (
                    <AdminProductList />
                ) : (
                    <h1>Dashboard General (En construcción)</h1>
                )}
            </div>

            {/* Modal */}
            {
                showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
                    }}>
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ margin: 0 }}>{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Nombre</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Apellido</label>
                                    <input required value={formData.surname} onChange={e => setFormData({ ...formData, surname: e.target.value })} style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Teléfono</label>
                                    <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Rol</label>
                                    <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={inputStyle}>
                                        {['ADMIN', 'VENDEDOR', 'PROMOTOR', 'GESTOR', 'LOGISTICA', 'SUPERVISOR', 'CLIENTE'].map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Municipio</label>
                                    <input required value={formData.municipality} onChange={e => setFormData({ ...formData, municipality: e.target.value })} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Provincia</label>
                                    <input required value={formData.province} onChange={e => setFormData({ ...formData, province: e.target.value })} style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Contraseña {editingId && '(Dejar vacío para no cambiar)'}</label>
                                    <input type="password" required={!editingId} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={inputStyle} />
                                </div>

                                <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1rem', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '4px',
    border: '1px solid #ddd'
};
