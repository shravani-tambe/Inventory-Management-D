import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { categoryApi } from '../../api/productApi';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const EMPTY = { name: '', description: '' };

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getAll();
      setCategories(res.data.data);
      setFiltered(res.data.data);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(categories.filter(c =>
      c.name.toLowerCase().includes(term) || (c.description || '').toLowerCase().includes(term)
    ));
  }, [search, categories]);

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (c) => { setEditTarget(c); setForm({ name: c.name, description: c.description || '' }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await categoryApi.update(editTarget.id, form);
        toast.success('Category updated');
      } else {
        await categoryApi.create(form);
        toast.success('Category created');
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
      await categoryApi.delete(deleteTarget.id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally { setDeleting(false); }
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb',
    borderRadius: '8px', fontSize: '14px', outline: 'none',
  };
  const btnPrimary = {
    padding: '9px 18px', background: '#2563eb', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
  };
  const btnLight = {
    padding: '9px 18px', background: '#fff', color: '#374151',
    border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
  };

  return (
    <div>
      <PageHeader title="Categories" subtitle="Manage product categories"
        actionLabel="Add Category" onAction={openCreate} />

      {/* Search */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, maxWidth: '280px' }} />
          <span style={{ fontSize: '13px', color: '#9ca3af', marginLeft: 'auto' }}>{filtered.length} categories</span>
        </div>

        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState message="No categories found" actionLabel={!search ? "Add Category" : undefined} onAction={!search ? openCreate : undefined} />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['#', 'Category Name', 'Description', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((cat, i) => (
                <tr key={cat.id} style={{ borderTop: '1px solid #f3f4f6' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '13px 20px', fontSize: '13px', color: '#9ca3af' }}>{i + 1}</td>
                  <td style={{ padding: '13px 20px', fontSize: '13px', fontWeight: '500', color: '#111827' }}>{cat.name}</td>
                  <td style={{ padding: '13px 20px', fontSize: '13px', color: '#6b7280' }}>{cat.description || '—'}</td>
                  <td style={{ padding: '13px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(cat)} style={{ ...btnLight, padding: '5px 12px', fontSize: '12px' }}>Edit</button>
                      <button onClick={() => setDeleteTarget(cat)} style={{ ...btnLight, padding: '5px 12px', fontSize: '12px', color: '#dc2626', borderColor: '#fecaca' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '20px', color: '#111827' }}>
              {editTarget ? 'Edit Category' : 'Add Category'}
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>
                Category Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Electronics" />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Description</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description..." />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowModal(false)} style={btnLight} disabled={saving}>Cancel</button>
              <button onClick={handleSave} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                {saving ? 'Saving...' : editTarget ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
};

export default CategoriesPage;