
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const GardenMap = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Recherche en cours",
        description: `Recherche de jardins près de "${searchQuery}"`,
      });
    }
  };

  // Jardin fictifs pour démonstration
  const gardens = [
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
    <div className="min-h-screen pt-16">
      {/* Map Placeholder - would be replaced with actual map integration */}
      <div className="h-[50vh] bg-secondary/20 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <p className="text-lg font-medium text-gray-500">
            Carte interactive des jardins
            <br />
            <span className="text-sm">(Google Maps API à intégrer ici)</span>
          </p>
        </div>
        
        {/* Search overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Rechercher par ville, code postal..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-0 top-0 h-full rounded-l-none"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Garden Listings */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Jardins disponibles</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gardens.map((garden) => (
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
                  <a href={`/gardens/${garden.id}`}>Voir détails</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GardenMap;
