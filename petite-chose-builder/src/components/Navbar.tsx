
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  // Pour simuler un utilisateur connecté, à remplacer par la logique d'authentification réelle
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userRole, setUserRole] = React.useState<"gardener" | "owner" | null>(null);

  // Fonction de simulation de déconnexion
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Carte des jardins", href: "/map" },
    { name: "Comment ça marche", href: "/how-it-works" },
    { name: "À propos", href: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">JardinPartage</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <nav className="hidden md:flex items-center space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? "text-primary font-semibold"
                          : "text-foreground/80 hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden md:flex items-center space-x-2">
                {isLoggedIn ? (
                  <>
                    <Button asChild variant="outline">
                      <Link to={userRole === "owner" ? "/owner-dashboard" : "/gardener-dashboard"}>
                        Mon espace
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" onClick={handleLogout}>
                      <Link to="/">Déconnexion</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link to="/login">Connexion</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/signup">Inscription</Link>
                    </Button>
                  </>
                )}
              </div>
            </>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <div className="flex md:hidden">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobile && mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-b">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-primary font-semibold bg-primary/5"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 pb-2 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link 
                      to={userRole === "owner" ? "/owner-dashboard" : "/gardener-dashboard"} 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mon espace
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full" onClick={handleLogout}>
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                      Déconnexion
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Connexion</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Inscription</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
