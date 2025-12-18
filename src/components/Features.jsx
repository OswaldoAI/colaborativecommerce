export function Features() {
    const categories = [
        { title: "Salud", icon: "🏥", desc: "Vitaminas, suplementos y cuidado personal.", color: "var(--color-success)" },
        { title: "Belleza", icon: "✨", desc: "Cosmética natural y dermocosmética.", color: "var(--color-accent)" },
        { title: "Hogar", icon: "🏡", desc: "Productos ecológicos y limpieza.", color: "var(--color-warning)" }
    ];

    return (
        <section style={{ padding: 'var(--spacing-2xl) 0', backgroundColor: 'var(--color-background)' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', fontSize: '2.5rem' }}>
                    Categorías Destacadas
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    {categories.map((cat, index) => (
                        <div key={index} style={{
                            padding: 'var(--spacing-lg)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'white',
                            boxShadow: 'var(--shadow-md)',
                            border: '1px solid var(--color-border)',
                            transition: 'transform var(--transition-base)',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                fontSize: '3rem',
                                marginBottom: 'var(--spacing-md)',
                                backgroundColor: `${cat.color}20`,
                                width: '80px',
                                height: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%'
                            }}>
                                {cat.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>{cat.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>{cat.desc}</p>
                            <div style={{ marginTop: 'var(--spacing-md)', fontWeight: 600, color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Ver productos <span>→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
