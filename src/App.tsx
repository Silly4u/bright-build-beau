import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Services from "./pages/Services.tsx";
import Contact from "./pages/Contact.tsx";
import News from "./pages/News.tsx";
import Workspace from "./pages/Workspace.tsx";
import EconomicCalendar from "./pages/EconomicCalendar.tsx";
import Dictionary from "./pages/Dictionary.tsx";
import DictionaryDetail from "./pages/DictionaryDetail.tsx";
import NewsDetail from "./pages/NewsDetail.tsx";
import Stocks from "./pages/Stocks.tsx";
import StockNewsDetail from "./pages/StockNewsDetail.tsx";
import AnalysisDetail from "./pages/AnalysisDetail.tsx";
import Auth from "./pages/Auth.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import ChartSnapshot from "./pages/ChartSnapshot.tsx";
import Academy from "./pages/Academy.tsx";
import Kol from "./pages/Kol.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

// Redirect cũ → /workspace, giữ nguyên query string
const RedirectToWorkspace: React.FC<{ defaultTab: 'overview' | 'chart' }> = ({ defaultTab }) => {
  const loc = useLocation();
  const sp = new URLSearchParams(loc.search);
  if (!sp.get('tab')) sp.set('tab', defaultTab);
  return <Navigate to={`/workspace?${sp.toString()}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/homepage" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/tin-tuc" element={<News />} />
            <Route path="/tin-tuc/:id" element={<NewsDetail />} />
            <Route path="/co-phieu" element={<Stocks />} />
            <Route path="/co-phieu/tin/:id" element={<StockNewsDetail />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/phan-tich" element={<RedirectToWorkspace defaultTab="overview" />} />
            <Route path="/phan-tich/:symbol" element={<AnalysisDetail />} />
            <Route path="/indicators" element={<RedirectToWorkspace defaultTab="chart" />} />
            <Route path="/chi-bao" element={<RedirectToWorkspace defaultTab="chart" />} />
            <Route path="/lich-kinh-te" element={<EconomicCalendar />} />
            <Route path="/tu-dien" element={<Dictionary />} />
            <Route path="/tu-dien/:slug" element={<DictionaryDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/chart-snapshot" element={<ChartSnapshot />} />
            <Route path="/hoc-vien" element={<Academy />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/kol" element={<Kol />} />
            <Route path="/hop-tac-kol" element={<Kol />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
