
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const GardenDetail = () => {
  const { id } = useParams();
  
  // Dans une vraie application, vous feriez un appel API pour récupérer les détails du jardin
  const garden = {
    id: 1,
    name: "Jardin des Fleurs",
    address: "15 Rue des Jardins",
    city: "Paris",
    postalCode: "75011",
    description: "Un magnifique jardin partagé situé au cœur de Paris. Cet espace dispose de 10 parcelles individuelles et d'un espace commun pour les herbes aromatiques. Le jardin est équipé d'un système d'irrigation automatique et d'un cabanon pour ranger les outils. Une communauté active de jardiniers passionnés vous attend !",
    images: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae",
      "https://images.unsplash.com/photo-1581591524425-c7e0978865fc",
      "https://images.unsplash.com/photo-1484759288640-783b22c95d54",
    ],
    availablePlots: 5,
    totalPlots: 10,
    plotSize: "4m²",
    price: "15€/mois",
    features: ["Irrigation", "Cabanon", "Composteur", "Récupération d'eau de pluie"],
    owner: {
      name: "Marie Dupont",
      joinedDate: "Avril 2022"
    }
  };
  
  const [selectedImage, setSelectedImage] = React.useState(garden.images[0]);
  
  const handleReservePlot = () => {
    toast({
      title: "Demande envoyée !",
      description: "Votre demande de réservation a été envoyée au propriétaire."
    });
  };

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Garden Header */}
        <div className="py-6">
          <h1 className="text-3xl font-bold">{garden.name}</h1>
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{garden.address}, {garden.postalCode} {garden.city}</span>
          </div>
        </div>
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 h-80 md:h-96 rounded-lg overflow-hidden">
            <img 
              src={selectedImage} 
              alt={garden.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex md:flex-col gap-2">
            {garden.images.map((image, index) => (
              <div 
                key={index} 
                className={`h-24 rounded-lg overflow-hidden cursor-pointer ${selectedImage === image ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image} 
                  alt={`${garden.name} ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Garden Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">À propos de ce jardin</h2>
              <p className="text-foreground/80 whitespace-pre-line">{garden.description}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Équipements et services</h3>
              <ul className="grid grid-cols-2 gap-2 mt-2">
                {garden.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="h-2 w-2 bg-primary rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-semibold">{garden.price}</p>
                    <p className="text-sm text-muted-foreground">par parcelle</p>
                  </div>
                  
                  <div className="flex justify-between py-2 border-t border-b">
                    <span>Parcelles disponibles:</span>
                    <span className="font-medium">{garden.availablePlots} / {garden.totalPlots}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span>Taille d'une parcelle:</span>
                    <span className="font-medium">{garden.plotSize}</span>
                  </div>
                  
                  <Button className="w-full" onClick={handleReservePlot}>
                    Réserver une parcelle
                  </Button>
                  
                  <div className="text-sm text-center text-muted-foreground">
                    La réservation est sous réserve d'acceptation par le propriétaire
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">À propos du propriétaire</h3>
              <div className="flex items-start gap-3 mb-2">
                <div className="h-12 w-12 bg-muted rounded-full"></div>
                <div>
                  <p className="font-medium">{garden.owner.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Membre depuis {garden.owner.joinedDate}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Contacter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenDetail;
