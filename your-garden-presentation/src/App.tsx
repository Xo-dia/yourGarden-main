import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import GardenMap from "./pages/GardenMap";
import GardenDetail from "./pages/GardenDetail";
import EditGarden from "./pages/EditGarden";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostLogin from "./pages/PostLogin";
import GardenerDashboard from "./pages/GardenerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import AddLand from "./pages/AddLand";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const hiddenNavbarPaths = ['/gardener-dashboard', '/owner-dashboard', '/post-login'];
  const shouldHideNavbar = hiddenNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/map" element={<GardenMap />} />
        <Route path="/gardens/:id" element={<GardenDetail />} />
        <Route path="/add-land/" element={<AddLand />} />
        <Route path="/edit-garden/:id" element={<EditGarden />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post-login" element={<PostLogin />} />
        <Route path="/gardener-dashboard" element={<GardenerDashboard />} />
        <Route path="/owner-dashboard/" element={<OwnerDashboard />} />
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
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
