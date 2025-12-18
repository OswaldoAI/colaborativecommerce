import { useState, useEffect } from 'react';

export function AdminProductForm({ product, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        purchasePrice: 0,
        profitMargin: 0,
        hasTax: true,
        categoryId: '',
        stock: 0,
        image: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [calculatedPrice, setCalculatedPrice] = useState(0);

    useEffect(() => {
        // Fetch Categories
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));

        if (product) {
            setFormData({
                name: product.name,
                description: product.description || '',
                purchasePrice: product.purchasePrice,
                profitMargin: product.profitMargin,
                hasTax: product.hasTax,
                categoryId: product.categoryId || '',
                stock: product.stock,
                image: product.image || ''
            });
        }
    }, [product]);

    useEffect(() => {
        // Calculate PVP
        const base = Number(formData.purchasePrice) * (1 + Number(formData.profitMargin) / 100);
        const tax = formData.hasTax ? 1.21 : 1;
        setCalculatedPrice(base * tax);
    }, [formData.purchasePrice, formData.profitMargin, formData.hasTax]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setImageFile(files[0]);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('purchasePrice', Number(formData.purchasePrice));
        data.append('profitMargin', Number(formData.profitMargin));
        data.append('hasTax', formData.hasTax);
        data.append('categoryId', Number(formData.categoryId));
        data.append('stock', Number(formData.stock));

        if (imageFile) {
            data.append('image', imageFile);
        } else if (formData.image) {
            data.append('image', formData.image);
        }

        const url = product
            ? `/api/products/${product.id}`
            : '/api/products';
        const method = product ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                body: data // FormData handles Content-Type automatically
            });
            if (res.ok) {
                onSave();
                onClose();
            } else {
                const errData = await res.json();
                alert('Error guardando producto: ' + (errData.message || 'Error desconocido'));
            }
        } catch (error) {
            console.error(error);
            alert('Error guardando producto');
        }
    };

    // Flatten helper
    const flattenCategories = (cats, level = 0) => {
        let flat = [];
        cats.forEach(cat => {
            flat.push({ ...cat, level });
            if (cat.children) {
                flat = flat.concat(flattenCategories(cat.children, level + 1));
            }
        });
        return flat;
    };

    const flatCategories = flattenCategories(categories);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
        }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>{product ? 'Editar Producto' : 'Crear Producto'}</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nombre del Producto</label>
                        <input name="name" placeholder="Ej: Ponny Malta 330ml" value={formData.name} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Descripción</label>
                        <textarea name="description" placeholder="Detalles del producto..." value={formData.description} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Categoría</label>
                        <select name="categoryId" value={formData.categoryId} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <option value="">Seleccionar Categoría</option>
                            {flatCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {'\u00A0'.repeat(cat.level * 4) + cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Precio Compra</label>
                            <input type="number" name="purchasePrice" step="0.01" value={formData.purchasePrice} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>% Margen</label>
                            <input type="number" name="profitMargin" step="0.1" value={formData.profitMargin} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                        <input type="checkbox" id="hasTax" name="hasTax" checked={formData.hasTax} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                        <label htmlFor="hasTax" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>Aplicar IVA (21%)</label>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Precio de Venta Sugerido (PVP)</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>${(calculatedPrice || 0).toFixed(2)}</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Imagen del Producto</label>
                        <input type="file" name="image" accept="image/*" onChange={handleChange} style={{ padding: '10px', border: '2px dashed #ddd', borderRadius: '6px' }} />
                        {formData.image && !imageFile && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Imagen actual: {formData.image.split('/').pop()}</div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Stock Disponible</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', fontWeight: 700 }}>Guardar Producto</button>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
