import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import { analyticsApi } from '../../api/analyticsApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatters';

const StatCard = ({ label, value, color = '#111827', bg = '#fff' }) => (
  <div style={{
    background: bg,
    borderRadius: '12px',
    padding: '20px 24px',
    border: '1px solid #e5e7eb',
    flex: 1,
    minWidth: '140px',
  }}>
    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </p>
    <p style={{ fontSize: '28px', fontWeight: '700', color }}>{value ?? '—'}</p>
  </div>
);

const ReportsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsApi.getAnalytics();
        setData(response.data.data ? response.data.data : response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (!data || !data.monthly_orders) return;
    const header = "Month,Order Count\n";
    const rows = data.monthly_orders.map(row => `${row.month},${row.count}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(header + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    link.setAttribute("download", `inventory-report-${month}-${year}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <MainLayout>
        <PageHeader title="Reports" subtitle="Inventory analytics and summaries" />
        <LoadingSpinner message="Loading reports..." />
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout>
        <PageHeader title="Reports" subtitle="Inventory analytics and summaries" />
        <EmptyState message="Failed to load analytics data" />
      </MainLayout>
    );
  }

  const monthlyOrders = data.monthly_orders || [];
  const maxOrderCount = monthlyOrders.length > 0 
    ? Math.max(...monthlyOrders.map(o => o.count), 1) 
    : 1;

  const totalOrders = monthlyOrders.reduce((sum, item) => sum + item.count, 0);

  return (
    <MainLayout>
      <PageHeader 
        title="Reports" 
        subtitle="Inventory analytics and summaries"
      />

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <StatCard label="Total Products" value={data.total_products} color="#2563eb" />
        <StatCard label="Low Stock Count" value={data.low_stock_count} color="#d97706" />
        <StatCard label="Inventory Valuation" value={formatCurrency(data.inventory_valuation)} />
        <StatCard label="Total Orders (6 Mo)" value={totalOrders} color="#059669" />
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Monthly Orders Trend</h3>
          <button 
            onClick={handleExportCSV}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: '500',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              background: '#fff',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ↓ Export CSV
          </button>
        </div>

        {monthlyOrders.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center' }}>No order data available.</p>
        ) : (
          <div style={{ position: 'relative', height: '220px', width: '100%' }}>
            <svg viewBox={`0 0 ${monthlyOrders.length * 100} 100`} preserveAspectRatio="none" style={{ width: '100%', height: 'calc(100% - 30px)', overflow: 'visible' }}>
              <polyline 
                points={monthlyOrders.map((item, idx) => {
                  const x = (idx * 100) + 50;
                  const y = 100 - ((item.count / maxOrderCount) * 90); // 90 to leave padding top
                  return `${x},${y}`;
                }).join(' ')}
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {monthlyOrders.map((item, idx) => {
                const x = (idx * 100) + 50;
                const y = 100 - ((item.count / maxOrderCount) * 90);
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5" fill="#fff" stroke="#2563eb" strokeWidth="2" />
                    <text x={x} y={y - 15} fontSize="14" fill="#6b7280" textAnchor="middle">{item.count}</text>
                  </g>
                );
              })}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
              {monthlyOrders.map((item, idx) => (
                <span key={idx} style={{ fontSize: '11px', color: '#6b7280', flex: 1, textAlign: 'center' }}>{item.month}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
