import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import GardenMap from "./pages/GardenMap";
import GardenDetail from "./pages/GardenDetail";
import AddLand from "./pages/AddLand";
import EditLand from "./pages/EditLand";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostLogin from "./pages/PostLogin";
import GardenerDashboard from "./pages/GardenerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ManageLands from "./pages/ManageLands";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const hiddenNavbarPaths = ['/gardener-dashboard', '/owner-dashboard', '/post-login'];
  const shouldHideNavbar = hiddenNavbarPaths.includes(location.pathname) || location.pathname.startsWith('/manage-lands/');

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/map" element={<GardenMap />} />
        <Route path="/gardens/:id" element={<GardenDetail />} />
        <Route path="/add-land" element={<AddLand />} />
        <Route path="/edit-land/:id" element={<EditLand />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post-login" element={<PostLogin />} />
        <Route path="/gardener-dashboard" element={<GardenerDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/manage-lands/:terrainId" element={<ManageLands />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
