import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import PurchaseOrderListPage from './pages/purchase-orders/PurchaseOrderListPage';
import PurchaseOrderDetailPage from './pages/purchase-orders/PurchaseOrderDetailPage';
import PurchaseOrderFormPage from './pages/purchase-orders/PurchaseOrderFormPage';
import SalesOrderListPage from './pages/sales-orders/SalesOrderListPage';
import SalesOrderDetailPage from './pages/sales-orders/SalesOrderDetailPage';
import SalesOrderFormPage from './pages/sales-orders/SalesOrderFormPage';

// Module 1 pages
import ProductsPage from './pages/products/ProductsPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontSize: '13px', borderRadius: '8px' },
        }}
      />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />

          {/* Purchase Orders — Module 3 */}
          <Route path="/purchase-orders" element={<PurchaseOrderListPage />} />
          <Route path="/purchase-orders/new" element={<PurchaseOrderFormPage />} />
          <Route path="/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />

          {/* Sales Orders — Module 3 */}
          <Route path="/sales-orders" element={<SalesOrderListPage />} />
          <Route path="/sales-orders/new" element={<SalesOrderFormPage />} />
          <Route path="/sales-orders/:id" element={<SalesOrderDetailPage />} />

          {/* Module 1 — Products */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;