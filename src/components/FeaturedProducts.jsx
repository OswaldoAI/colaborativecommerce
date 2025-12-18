import { ShoppingCart, Heart } from 'lucide-react';

export function FeaturedProducts() {
    const products = [
        { id: 1, name: "Proteína Whey Gold Standard", price: "240.900", oldPrice: "280.000", discount: "-14%" },
        { id: 2, name: "Vitamina C 1000mg x 100 Tabs", price: "45.900", oldPrice: "65.000", discount: "-30%" },
        { id: 3, name: "Crema Hidratante Facial", price: "78.500", oldPrice: null, discount: null },
        { id: 4, name: "Kit Limpieza Ecológica", price: "32.000", oldPrice: "40.000", discount: "-20%" },
        { id: 5, name: "Omega 3 Aceite de Pescado", price: "55.000", oldPrice: null, discount: null },
    ];

    return (
        <section style={{ padding: 'var(--spacing-2xl) 0' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Productos Destacados</h2>
                    <a href="#" style={{ fontWeight: 600, color: 'var(--color-primary-dark)', textDecoration: 'underline' }}>Ver todos</a>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 'var(--spacing-md)'
                }}>
                    {products.map((product) => (
                        <div key={product.id} style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--spacing-md)',
                            border: '1px solid var(--color-border)',
                            position: 'relative',
                            transition: 'box-shadow 0.2s'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                        >
                            {/* Discount Badge */}
                            {product.discount && (
                                <span style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    backgroundColor: 'var(--color-accent)',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '2px 6px',
                                    borderRadius: 'var(--radius-sm)',
                                    zIndex: 1
                                }}>
                                    {product.discount}
                                </span>
                            )}

                            {/* Wishlist */}
                            <button style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#ccc'
                            }}>
                                <Heart size={20} />
                            </button>

                            {/* Image Placeholder */}
                            <div style={{
                                height: '180px',
                                backgroundColor: '#f9f9f9',
                                marginBottom: 'var(--spacing-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ddd'
                            }}>
                                Producto Img
                            </div>

                            {/* Info */}
                            <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: 'var(--spacing-xs)', lineHeight: 1.3, flex: 1 }}>
                                    {product.name}
                                </h3>

                                <div style={{ marginTop: 'auto' }}>
                                    {product.oldPrice && (
                                        <div style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                            €{product.oldPrice}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                                        €{product.price}
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button className="btn btn-primary" style={{
                                width: '100%',
                                marginTop: 'var(--spacing-md)',
                                fontWeight: 700,
                                borderRadius: 'var(--radius-full)'
                            }}>
                                Agregar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
