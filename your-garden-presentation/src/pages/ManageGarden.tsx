import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Square, Euro, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Garden {
  id: string;
  name: string;
  size: string;
  price: number;
  description: string | null;
  photo_url: string | null;
  terrain: {
    address: string;
    name: string;
  };
}

const ManageGarden = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMyGardens();
  }, []);

  const loadMyGardens = async () => {
    try {
      // Pour l'instant, simulation avec des données fictives
      // Dans une vraie implémentation, il faudrait ajouter un champ renter_id à la table gardens
      // ou créer une table de relation garden_rentals
      

      // Simulation de jardins loués par l'utilisateur actuel
      // TODO: Modifier la base de données pour ajouter la relation locataire-jardin
      const mockGardens: Garden[] = [
        {
          id: "1",
          name: "Potager du Soleil",
          size: "25m²",
          price: 45,
          description: "Jardin ensoleillé avec point d'eau",
          photo_url: null,
          terrain: {
            address: "123 Rue des Jardins, Paris 15ème",
            name: "Terrain des Lilas"
          }
        },
        {
          id: "2", 
          name: "Carré des Herbes",
          size: "15m²",
          price: 32,
          description: "Parfait pour les herbes aromatiques",
          photo_url: null,
          terrain: {
            address: "45 Avenue Verte, Boulogne",
            name: "Les Jardins Partagés"
          }
        }
      ];

      setGardens(mockGardens);
    } catch (error) {
      console.error("Erreur lors du chargement des jardins:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos jardins",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStopRenting = async (gardenId: string, gardenName: string) => {
    try {
      // TODO: Implémenter la logique pour arrêter la location
      // Cela nécessitera une modification de la base de données
      
      setGardens(gardens.filter(garden => garden.id !== gardenId));
      
      toast({
        title: "Location terminée",
        description: `Vous avez arrêté de louer "${gardenName}"`,
      });
    } catch (error) {
      console.error("Erreur lors de l'arrêt de la location:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'arrêter la location",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes Jardins</h1>
        <p className="text-muted-foreground">
          Gérez vos locations de jardins
        </p>
      </div>

      {gardens.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Square className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun jardin loué</h3>
            <p className="text-muted-foreground text-center mb-4">
              Vous ne louez actuellement aucun jardin.
            </p>
            <Button onClick={() => window.location.href = "/map"}>
              Trouver un jardin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gardens.map((garden) => (
            <Card key={garden.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{garden.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {garden.terrain.name}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    {garden.price}€/mois
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{garden.terrain.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <span>Taille: {garden.size}</span>
                </div>

                {garden.description && (
                  <p className="text-sm text-muted-foreground">
                    {garden.description}
                  </p>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `/gardens/${garden.id}`}
                    className="flex-1"
                  >
                    Voir détails
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Arrêter
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Arrêter la location</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir arrêter de louer "{garden.name}" ? 
                          Cette action ne peut pas être annulée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleStopRenting(garden.id, garden.name)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Confirmer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageGarden;