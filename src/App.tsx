import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import QuickAddModal from "@/components/QuickAddModal";
import DashboardPage from "./pages/DashboardPage";
import TripsPage from "./pages/TripsPage";
import ClientsPage from "./pages/ClientsPage";
import PaymentsPage from "./pages/PaymentsPage";
import DocumentsPage from "./pages/DocumentsPage";
import TastePage from "./pages/TastePage";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import ImportPage from "./pages/ImportPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useAuth();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-display text-xl text-muted-foreground">Maison Camy</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<AuthPage />} />
      </Routes>
    );
  }

  return (
    <>
      <AppLayout onQuickAdd={() => setQuickAddOpen(true)}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/taste" element={<TastePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
      <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
