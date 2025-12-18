import { useState, useEffect } from 'react';
import { Menu, X, Settings, ChevronRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BurgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Error loading mobile menu categories:', err));
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                onClick={toggleMenu}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-secondary)'
                }}
                aria-label="Abrir menú"
            >
                <Menu size={28} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={toggleMenu}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1001
                    }}
                />
            )}

            {/* Drawer */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: isOpen ? 0 : '-300px',
                width: '300px',
                height: '100%',
                backgroundColor: 'white',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1002,
                transition: 'left 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header Drawer */}
                <div style={{
                    padding: 'var(--spacing-md)',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'var(--color-primary)'
                }}>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Menú</span>
                    <button onClick={toggleMenu} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Categories List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-md)' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', textTransform: 'uppercase', letterSpacing: '1px' }}>Categorías</h3>
                    <ul style={{ listStyle: 'none' }}>
                        {categories.map((cat) => (
                            <li key={cat.id} style={{ marginBottom: 'var(--spacing-sm)' }}>
                                <Link
                                    to={`/category/${cat.id}`}
                                    onClick={toggleMenu}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px',
                                        borderRadius: 'var(--radius-sm)',
                                        textDecoration: 'none',
                                        color: 'var(--color-text)',
                                        backgroundColor: '#f8fafc'
                                    }}
                                >
                                    {cat.name}
                                    <ChevronRight size={16} color="var(--color-text-muted)" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer (Config & Auth) */}
                <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)', backgroundColor: '#f9f9f9' }}>
                    <Link to="/login" onClick={toggleMenu} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        textDecoration: 'none',
                        color: 'var(--color-text)',
                        marginBottom: 'var(--spacing-sm)',
                        padding: '10px',
                        fontWeight: 600
                    }}>
                        <Settings size={20} />
                        Configuración
                    </Link>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', paddingLeft: '10px' }}>
                        Acceso solo administradores
                    </div>
                </div>
            </div>
        </>
    );
}
