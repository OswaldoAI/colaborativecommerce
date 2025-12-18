import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { AdminProductForm } from './AdminProductForm';

export function AdminProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar producto?')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await fetch('/api/products/bulk', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            alert(data.message);
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Error uploading file');
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>Catálogo de Productos</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="btn btn-accent" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Upload size={18} />
                        {uploading ? 'Subiendo...' : 'Importar CSV'}
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleBulkUpload}
                            style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                        />
                    </div>
                    <button
                        onClick={() => { setEditingProduct(null); setShowModal(true); }}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <Plus size={18} /> Nuevo Producto
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Producto</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Categoría</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Precio Compra</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Margen</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>PVP</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Stock</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>Cargando...</td></tr>
                        ) : products.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '12px 16px' }}>{p.name}</td>
                                <td style={{ padding: '12px 16px' }}>{p.category ? (p.category.parent ? `${p.category.parent.name} / ${p.category.name}` : p.category.name) : '-'}</td>
                                <td style={{ padding: '12px 16px' }}>${Number(p.purchasePrice).toFixed(2)}</td>
                                <td style={{ padding: '12px 16px' }}>{p.profitMargin}%</td>
                                <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>${Number(p.price).toFixed(2)}</td>
                                <td style={{ padding: '12px 16px' }}>{p.stock}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => { setEditingProduct(p); setShowModal(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4b5563' }}><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(p.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <AdminProductForm
                    product={editingProduct}
                    onClose={() => setShowModal(false)}
                    onSave={fetchProducts}
                />
            )}
        </div>
    );
}
