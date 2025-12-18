import { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, ChevronDown, MapPin, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BurgerMenu } from './BurgerMenu';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const { user, logout } = useAuth();
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    useEffect(() => {
        fetch('http://localhost:3001/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <header style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: 'var(--shadow-sm)'
        }}>
            {/* Top Bar (Optional Utility) */}
            <div style={{ backgroundColor: 'rgba(0,0,0,0.05)', fontSize: '0.75rem', padding: '4px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Envíos gratis por compras superiores a €100.000</span>
                    <span>Centro de Ayuda</span>
                </div>
            </div>

            {/* Main Bar */}
            <div className="container" style={{ padding: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>

                    {/* Logo & Mobile Menu */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <div className="mobile-toggle" style={{ display: 'none' }}>
                            <BurgerMenu />
                        </div>
                        {/* Desktop Menu Trigger (Left side) */}
                        <div className="desktop-menu-trigger" style={{ marginRight: '10px' }}>
                            <BurgerMenu />
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-1px', color: 'var(--color-secondary)' }}>
                            HealthStore<span style={{ color: 'var(--color-surface)', fontSize: '2rem', lineHeight: 0 }}>.</span>
                        </div>
                    </div>

                    {/* Search Bar (Prominent) - Hidden on Admin */}
                    {!isAdmin && (
                        <div style={{ flex: 1, position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                            <div style={{ display: 'flex' }}>
                                <input
                                    type="text"
                                    placeholder="Buscar products..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: 'var(--radius-full) 0 0 var(--radius-full)',
                                        border: '1px solid transparent',
                                        outline: 'none',
                                        fontSize: '0.9rem',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                />
                                <button style={{
                                    backgroundColor: 'var(--color-secondary)',
                                    color: 'var(--color-primary)',
                                    padding: '0 1.25rem',
                                    borderRadius: '0 var(--radius-full) var(--radius-full) 0',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Search size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Spacer if search is hidden to keep alignment or just auto margin */}
                    {isAdmin && <div style={{ flex: 1 }}></div>}

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', marginLeft: isAdmin ? 'auto' : 0 }}>

                        {/* Register Link (Show only if not logged in) */}
                        {!user && (
                            <Link to="/register" style={{
                                textDecoration: 'none',
                                color: 'var(--color-text)',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}>
                                Registrarse
                            </Link>
                        )}

                        {/* Account */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', position: 'relative' }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <User size={24} color="var(--color-secondary)" />
                            <div style={{ display: 'none', flexDirection: 'column', lineHeight: 1.1 }} className="hide-mobile">
                                <span style={{ fontSize: '0.75rem' }}>{user ? `Hola, ${user.name || 'Usuario'}` : 'Bienvenido'}</span>
                                <span style={{ fontWeight: 600 }}>{user ? 'Mi Cuenta' : 'Iniciar Sesión'}</span>
                            </div>
                            <ChevronDown size={14} className="hide-mobile" />

                            {/* User Dropdown */}
                            {isMenuOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    borderRadius: '4px',
                                    padding: '10px',
                                    marginTop: '10px',
                                    minWidth: '150px',
                                    zIndex: 1001
                                }}>
                                    {user ? (
                                        <>
                                            <div style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                                {user.role === 'ADMIN' || user.role === 'SUPERADMIN' ? (
                                                    <Link to="/admin" style={{ textDecoration: 'none', color: '#333', display: 'block', marginBottom: '5px' }}>Panel Admin</Link>
                                                ) : null}
                                                <button onClick={logout} style={{ background: 'none', border: 'none', color: '#d9534f', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <Link to="/login" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Ingresar</Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart - Hidden on Admin */}
                        {!isAdmin && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', position: 'relative' }}>
                                <ShoppingCart size={24} color="var(--color-secondary)" />
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    backgroundColor: 'var(--color-accent)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    fontSize: '0.7rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>0</span>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Navigation (Categories) - Optional: Hide on Admin too? User request didn't specify, but usually admin doesn't need shop nav. Leaving for now as request was specific to Header components. */}
            <nav style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                <div className="container" style={{
                    display: 'flex',
                    gap: 'var(--spacing-xl)',
                    padding: '0.75rem var(--spacing-md)',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, cursor: 'pointer', color: 'var(--color-secondary)' }}>
                        <Menu size={18} />
                        <span>Todo el sitio</span>
                    </div>

                    {/* Dynamic Categories */}
                    {categories.map((cat) => (
                        <Link key={cat.id} to={`/category/${cat.id}`} style={{ color: 'var(--color-text-muted)', fontWeight: 500, textDecoration: 'none' }}>
                            {cat.name}
                        </Link>
                    ))}
                    <Link to="#" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>Ofertas</Link>
                </div>
            </nav>

            <style>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
        </header >
    );
}
