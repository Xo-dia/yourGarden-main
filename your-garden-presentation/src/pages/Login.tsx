
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     setIsLoading(true);
    
//     // Simulation de connexion
//     setTimeout(() => {
//       console.log("Connexion:", { email, password });
      
//       // En production, cette logique serait basée sur les données de l'utilisateur
//       // récupérées depuis le backend après authentification
//       const userRole = email.includes("proprietaire") ? "owner" : "gardener";
      
//       toast({
//         title: "Connexion réussie",
//         description: `Vous êtes connecté en tant que ${userRole === "owner" ? "propriétaire" : "jardinier"}`,
//       });
      
//       // Redirection vers la page appropriée selon le rôle
//       navigate(userRole === "owner" ? "/owner-dashboard" : "/gardener-dashboard");
      
//       setIsLoading(false);
//     }, 1000);
//   };

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const userData = await login({email, password}); // appel au backend

      toast({
        title: "Connexion réussie",
      });

      navigate("/post-login");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "erreur inconnu"; 
      toast({
        title: "Erreur de connexion",
        description: message || "Identifiants incorrects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Connexion</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Bienvenue sur JardinPartage</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte pour accéder à votre espace
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
              
              <div className="text-center w-full">
                <p className="text-sm text-muted-foreground">
                  Pas encore de compte ?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    S'inscrire
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
