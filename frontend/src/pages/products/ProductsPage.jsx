import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { productApi, categoryApi, supplierApi } from '../../api/productApi';
import { formatCurrency } from '../../utils/formatters';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const EMPTY = { name: '', sku: '', price: '', description: '', reorder_level: 0, category_id: '', supplier_id: '' };

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterSup, setFilterSup] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([categoryApi.getAll(), supplierApi.getAll()]).then(([c, s]) => {
      setCategories(c.data.data);
      setSuppliers(s.data.data);
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (filterCat) params.category_id = filterCat;
      if (filterSup) params.supplier_id = filterSup;
      const res = await productApi.getAll(params);
      setProducts(res.data.data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [search, filterCat, filterSup]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditTarget(p);
    setForm({ name: p.name, sku: p.sku, price: p.price, description: p.description || '', reorder_level: p.reorder_level, category_id: p.category_id, supplier_id: p.supplier_id });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.sku.trim() || !form.price || !form.category_id || !form.supplier_id) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), reorder_level: parseInt(form.reorder_level) || 0, category_id: parseInt(form.category_id), supplier_id: parseInt(form.supplier_id) };
      if (editTarget) {
        await productApi.update(editTarget.id, payload);
        toast.success('Product updated');
      } else {
        await productApi.create(payload);
        toast.success('Product created');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productApi.delete(deleteTarget.id);
      toast.success('Product deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally { setDeleting(false); }
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' };
  const selectStyle = { ...inputStyle, background: '#fff' };
  const btnPrimary = { padding: '9px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' };
  const btnLight = { padding: '9px 18px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' };

  return (
    <div>
      <PageHeader title="Products" subtitle="Manage your product catalogue" actionLabel="Add Product" onAction={openCreate} />

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input placeholder="Search products or SKU..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: '240px' }} />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...selectStyle, maxWidth: '160px' }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterSup} onChange={e => setFilterSup(e.target.value)} style={{ ...selectStyle, maxWidth: '160px' }}>
            <option value="">All Suppliers</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <span style={{ fontSize: '13px', color: '#9ca3af', marginLeft: 'auto' }}>{products.length} products</span>
        </div>

        {loading ? <LoadingSpinner /> : products.length === 0 ? (
          <EmptyState message="No products found" actionLabel={!search && !filterCat && !filterSup ? "Add Product" : undefined} onAction={openCreate} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['#', 'Product Name', 'SKU', 'Category', 'Supplier', 'Price', 'Reorder Lvl', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} style={{ borderTop: '1px solid #f3f4f6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#9ca3af' }}>{i + 1}</td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: '500', color: '#111827' }}>{p.name}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '12px', fontFamily: 'monospace', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px' }}>{p.sku}</span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#374151' }}>{p.category_name || '—'}</td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#374151' }}>{p.supplier_name || '—'}</td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#374151', whiteSpace: 'nowrap' }}>{formatCurrency(p.price)}</td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: p.reorder_level > 0 ? '#d97706' : '#9ca3af' }}>{p.reorder_level}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(p)} style={{ ...btnLight, padding: '5px 12px', fontSize: '12px' }}>Edit</button>
                        <button onClick={() => setDeleteTarget(p)} style={{ ...btnLight, padding: '5px 12px', fontSize: '12px', color: '#dc2626', borderColor: '#fecaca' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '20px', color: '#111827' }}>
              {editTarget ? 'Edit Product' : 'Add Product'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              {[
                { key: 'name', label: 'Product Name', required: true, span: true, placeholder: 'e.g. Wireless Keyboard' },
                { key: 'sku', label: 'SKU', required: true, placeholder: 'e.g. WK-001' },
                { key: 'price', label: 'Price (₹)', required: true, type: 'number', placeholder: '0.00' },
                { key: 'reorder_level', label: 'Reorder Level', type: 'number', placeholder: '0' },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: f.span ? '1/-1' : undefined, marginBottom: '14px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>
                    {f.label}{f.required && <span style={{ color: '#dc2626' }}> *</span>}
                  </label>
                  <input style={inputStyle} type={f.type || 'text'} value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} />
                </div>
              ))}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>Category <span style={{ color: '#dc2626' }}>*</span></label>
                <select style={selectStyle} value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>Supplier <span style={{ color: '#dc2626' }}>*</span></label>
                <select style={selectStyle} value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value })}>
                  <option value="">Select supplier...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/-1', marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>Description</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description..." />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowModal(false)} style={btnLight} disabled={saving}>Cancel</button>
              <button onClick={handleSave} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                {saving ? 'Saving...' : editTarget ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete Product"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
};

export default ProductsPage;