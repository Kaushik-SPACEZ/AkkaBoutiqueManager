  import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Billing from "@/pages/Billing";
import Inventory from "@/pages/Inventory";
import BarcodePrint from "@/pages/Barcode";
import GSTReports from "@/pages/GSTReports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Reports from "@/pages/Reports";
import SalesReport from "@/pages/reports/SalesReport";
import PurchaseReport from "@/pages/reports/PurchaseReport";
import StockReport from "@/pages/reports/StockReport";
import AccountantExport from "@/pages/reports/AccountantExport";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/barcode" element={<BarcodePrint />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/sales" element={<SalesReport />} />
          <Route path="/reports/purchases" element={<PurchaseReport />} />
          <Route path="/reports/stock" element={<StockReport />} />
          <Route path="/reports/accountant" element={<AccountantExport />} />
          <Route path="/gst" element={<GSTReports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
