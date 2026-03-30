import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout onQuickAdd={() => setQuickAddOpen(true)}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/taste" element={<TastePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
          <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
