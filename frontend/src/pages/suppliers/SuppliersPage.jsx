import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supplierApi } from '../../api/productApi';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const EMPTY = { name: '', contact_person: '', email: '', phone: '', address: '' };

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
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
      const res = await supplierApi.getAll();
      setSuppliers(res.data.data);
      setFiltered(res.data.data);
    } catch { toast.error('Failed to load suppliers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(suppliers.filter(s =>
      s.name.toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term) ||
      (s.contact_person || '').toLowerCase().includes(term)
    ));
  }, [search, suppliers]);

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (s) => {
    setEditTarget(s);
    setForm({ name: s.name, contact_person: s.contact_person || '', email: s.email, phone: s.phone || '', address: s.address || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Supplier name is required'); return; }
    if (!form.email.trim()) { toast.error('Email is required'); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await supplierApi.update(editTarget.id, form);
        toast.success('Supplier updated');
      } else {
        await supplierApi.create(form);
        toast.success('Supplier created');
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
      await supplierApi.delete(deleteTarget.id);
      toast.success('Supplier deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally { setDeleting(false); }
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' };
  const btnPrimary = { padding: '9px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' };
  const btnLight = { padding: '9px 18px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' };
  const field = (key, label, required, props = {}) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>
        {label}{required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      <input style={inputStyle} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} {...props} />
    </div>
  );

  return (
    <div>
      <PageHeader title="Suppliers" subtitle="Manage your suppliers" actionLabel="Add Supplier" onAction={openCreate} />

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, maxWidth: '280px' }} />
          <span style={{ fontSize: '13px', color: '#9ca3af', marginLeft: 'auto' }}>{filtered.length} suppliers</span>
        </div>

        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState message="No suppliers found" actionLabel={!search ? "Add Supplier" : undefined} onAction={!search ? openCreate : undefined} />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['#', 'Supplier Name', 'Contact Person', 'Email', 'Phone', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderTop: '1px solid #f3f4f6' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#9ca3af' }}>{i + 1}</td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: '500', color: '#111827' }}>{s.name}</td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#374151' }}>{s.contact_person || '—'}</td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#374151' }}>{s.email}</td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#374151' }}>{s.phone || '—'}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(s)} style={{ ...btnLight, padding: '5px 12px', fontSize: '12px' }}>Edit</button>
                      <button onClick={() => setDeleteTarget(s)} style={{ ...btnLight, padding: '5px 12px', fontSize: '12px', color: '#dc2626', borderColor: '#fecaca' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '20px', color: '#111827' }}>
              {editTarget ? 'Edit Supplier' : 'Add Supplier'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div style={{ gridColumn: '1/-1' }}>{field('name', 'Supplier Name', true, { placeholder: 'e.g. TechWorld Pvt Ltd' })}</div>
              {field('contact_person', 'Contact Person', false, { placeholder: 'e.g. Rahul Sharma' })}
              {field('email', 'Email Address', true, { type: 'email', placeholder: 'supplier@example.com' })}
              {field('phone', 'Phone Number', false, { placeholder: '+91 9876543210' })}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>Address</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }} value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Full address..." />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button onClick={() => setShowModal(false)} style={btnLight} disabled={saving}>Cancel</button>
              <button onClick={handleSave} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                {saving ? 'Saving...' : editTarget ? 'Save Changes' : 'Create Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete Supplier"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
};

export default SuppliersPage;