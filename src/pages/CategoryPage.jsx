import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';

export function CategoryPage() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('Categoría');

    useEffect(() => {
        setLoading(true);
        // Fetch products by category
        fetch(`http://localhost:3001/api/products?categoryId=${id}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                // Try to derive category name from first product or fetch separately. 
                // For now, if we have products, we use the category name from the first one if included.
                if (data.length > 0 && data[0].category) {
                    setCategoryName(data[0].category.name);
                } else {
                    // Fallback to fetching category details if needed, or just Generic.
                    // Let's do a quick fetch for category name if list is empty or for accuracy.
                    fetch(`http://localhost:3001/api/categories`)
                        .then(r => r.json())
                        .then(cats => {
                            const findCat = (list) => {
                                for (let c of list) {
                                    if (c.id === Number(id)) return c;
                                    if (c.children) {
                                        const found = findCat(c.children);
                                        if (found) return found;
                                    }
                                }
                                return null;
                            }
                            const cat = findCat(cats);
                            if (cat) setCategoryName(cat.name);
                        });
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    // Helper to process image URLs (especially Google Drive)
    const getImageUrl = (url) => {
        if (!url) return '';
        let cleanUrl = url.trim();

        // Handle Google Drive links
        if (cleanUrl.includes('drive.google.com')) {
            // More robust regex to capture ID even without trailing slash
            const idMatch = cleanUrl.match(/\/d\/([-a-zA-Z0-9_]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
            }
        }
        return cleanUrl;
    };

    return (
        <section style={{ padding: 'var(--spacing-2xl) 0' }}>
            <div className="container">
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{categoryName}</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>{products.length} productos encontrados</p>
                </div>

                {loading ? (
                    <div>Cargando productos...</div>
                ) : products.length === 0 ? (
                    <div>No hay productos en esta categoría.</div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: 'var(--spacing-md)'
                    }}>
                        {products.map((product) => {
                            const imageUrl = getImageUrl(product.image);
                            return (
                                <div key={product.id} style={{
                                    backgroundColor: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 'var(--spacing-md)',
                                    border: '1px solid var(--color-border)',
                                    position: 'relative',
                                    transition: 'box-shadow 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
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

                                    {/* Image Placeholder */}
                                    <div style={{
                                        height: '180px',
                                        backgroundColor: '#f9f9f9',
                                        marginBottom: 'var(--spacing-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ddd',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={product.name}
                                                title={`Fuente: ${product.image}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'white' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    // Verify next sibling exists before modifying
                                                    if (e.target.nextSibling) {
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }
                                                    console.warn('Failed to load image:', imageUrl);
                                                }}
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : null}

                                        {/* Fallback Element */}
                                        <div style={{
                                            display: imageUrl ? 'none' : 'flex',
                                            width: '100%', height: '100%',
                                            alignItems: 'center', justifyContent: 'center',
                                            flexDirection: 'column', color: '#ccc',
                                            position: 'absolute', top: 0, left: 0 // Absolute validation
                                        }}>
                                            <ShoppingCart size={40} />
                                            <span style={{ fontSize: '0.8rem', marginTop: '5px' }}>Sin Imagen</span>
                                            {product.image && (
                                                <a
                                                    href={product.image}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ fontSize: '0.7rem', marginTop: '5px', color: '#007bff', textDecoration: 'underline', zIndex: 10 }}
                                                >
                                                    Ver enlace original
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: 'var(--spacing-xs)', lineHeight: 1.3 }}>
                                            {product.name}
                                        </h3>

                                        <div style={{ marginTop: 'auto' }}>
                                            {product.oldPrice && (
                                                <div style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                                    ${Number(product.oldPrice).toFixed(2)}
                                                </div>
                                            )}
                                            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                                                ${Number(product.price).toFixed(2)}
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
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
