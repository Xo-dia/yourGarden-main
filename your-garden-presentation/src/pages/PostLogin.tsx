import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, User, Home } from "lucide-react";

const PostLogin = () => {
  // Jardins disponibles pour démonstration
  const availableGardens = [
    {
      id: 1,
      name: "Jardin des Fleurs",
      location: "Paris 11e",
      description: "Un bel espace ensoleillé avec 5 parcelles disponibles",
      distance: "1.2 km",
      available: 5,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae"
    },
    {
      id: 2,
      name: "Potager Urbain",
      location: "Paris 15e",
      description: "Jardin communautaire avec espace pour 8 jardiniers",
      distance: "2.5 km",
      available: 3,
      image: "https://images.unsplash.com/photo-1532509774891-141d37f25ae9"
    },
    {
      id: 3,
      name: "Oasis Verte",
      location: "Montreuil",
      description: "Grand terrain avec récupération d'eau de pluie et composteur",
      distance: "4.8 km",
      available: 7,
      image: "https://images.unsplash.com/photo-1585513527490-e35e0a0cd31a"
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Bienvenue sur JardinPartage</h1>
          <p className="text-muted-foreground mb-6">
            Découvrez les jardins disponibles et choisissez votre rôle
          </p>
          
          {/* Boutons de navigation vers les différents rôles */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button asChild size="lg" className="px-8">
              <Link to="/gardener-dashboard" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Espace Jardinier
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link to="/owner-dashboard" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Espace Propriétaire
              </Link>
            </Button>
          </div>
        </div>

        {/* Jardins disponibles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Jardins disponibles</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableGardens.map((garden) => (
              <Card key={garden.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={garden.image} 
                    alt={garden.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{garden.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{garden.distance}</span>
                    </div>
                  </div>
                  <CardDescription className="font-medium">{garden.location}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">{garden.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-2">
                  <span className="text-sm font-medium">
                    {garden.available} parcelle{garden.available > 1 ? 's' : ''} disponible{garden.available > 1 ? 's' : ''}
                  </span>
                  <Button asChild size="sm">
                    <Link to={`/gardens/${garden.id}`}>Voir détails</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostLogin;