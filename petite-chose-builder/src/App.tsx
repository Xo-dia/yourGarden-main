
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GardenMap from "./pages/GardenMap";
import GardenDetail from "./pages/GardenDetail";
import AddGarden from "./pages/AddGarden";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GardenerDashboard from "./pages/GardenerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/map" element={<GardenMap />} />
          <Route path="/gardens/:id" element={<GardenDetail />} />
          <Route path="/add-garden" element={<AddGarden />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/gardener-dashboard" element={<GardenerDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
