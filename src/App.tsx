import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import ControlTower from "./pages/ControlTower";
import Orders from "./pages/Orders";
import RoutePlanning from "./pages/RoutePlanning";
import Finance from "./pages/Finance";
import Assets from "./pages/Assets";
import Fleet from "./pages/Fleet";
import Drivers from "./pages/Drivers";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<ControlTower />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/routes" element={<RoutePlanning />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;