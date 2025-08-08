import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight } from "lucide-react";

const API_URL = 'http://localhost:8080';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    toast({
      title: "Erreur",
      description: "Les mots de passe ne correspondent pas.",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  const dataToSend = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    password: formData.password
  };

  try {
    const response = await fetch(`${API_URL}/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      toast({ title: "Inscription réussie !" });
      navigate("/login");
    } else {
      const error = await response.json();
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive"
      });
    }
  } catch (err) {
    console.error(err);
    toast({
      title: "Erreur",
      description: "Impossible de contacter le serveur.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Créer un compte</h1>

        <Card>
          <CardHeader>
            <CardTitle>Inscrivez-vous</CardTitle>
            <CardDescription>
              Créez votre compte pour rejoindre notre communauté de jardinage partagé.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gap-2"
              >
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </form>

          <CardContent className="pt-0">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

