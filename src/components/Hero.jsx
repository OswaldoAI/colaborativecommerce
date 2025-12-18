export function Hero() {
    return (
        <section>
            <div className="container" style={{ marginTop: 'var(--spacing-md)' }}>
                {/* Main Promo Banner */}
                <div style={{
                    height: '400px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#FFDA00', // Yellow background backup
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-secondary)'
                }}>
                    {/* Background Gradient/Image */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(90deg, #FDE100 30%, #FFF5A0 100%)',
                        zIndex: 1
                    }}></div>

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 2, padding: '0 var(--spacing-2xl)', maxWidth: '600px' }}>
                        <span style={{
                            backgroundColor: 'white',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            display: 'inline-block',
                            marginBottom: 'var(--spacing-md)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            ¡OFERTAS EXCLUSIVAS!
                        </span>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, marginBottom: 'var(--spacing-md)' }}>
                            TODO PARA<br />TU BIENESTAR
                        </h2>
                        <p style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-lg)', fontWeight: 500 }}>
                            Descubre los mejores precios en salud, belleza y cuidado del hogar.
                        </p>
                        <button className="btn btn-secondary" style={{
                            backgroundColor: 'var(--color-secondary)',
                            color: 'white',
                            padding: '1rem 2.5rem',
                            fontSize: '1.1rem',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            Ver Ofertas
                        </button>
                    </div>

                    {/* Decorative Element / Product Image Placeholder */}
                    <div style={{ position: 'absolute', right: '5%', bottom: '0', height: '90%', zIndex: 2 }}>
                        {/* Could place a transparent PNG here */}
                        {/* <img src="..." /> */}
                    </div>
                </div>

                {/* Secondary Banners (Row of 3) - Typical for Retail */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--spacing-md)',
                    marginTop: 'var(--spacing-md)'
                }}>
                    {['Cuidado de la Piel', 'Vitaminas Importadas', 'Limpieza Eco'].map((title, i) => (
                        <div key={i} style={{
                            height: '180px',
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--spacing-lg)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer'
                        }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--spacing-xs)' }}>{title}</h3>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Ver más →</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
