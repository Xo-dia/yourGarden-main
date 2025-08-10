import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, MapPin, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "@/components/ui/use-toast";

const OwnerDashboard = () => {
  // Simuler des données qui viendraient du backend
  const userInfo = {
    name: "Pierre Durand",
    membership: "Premium",
    joinedDate: "Mars 2023"
  };
  
  const myGardens = [
    { 
      id: 1, 
      name: "Mon Potager Urbain", 
      address: "12 rue des Fleurs, 75001 Paris",
      status: "active",
      parcels: 5,
      occupiedParcels: 3,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae"
    },
    { 
      id: 2, 
      name: "Jardin Partagé", 
      address: "45 avenue des Arbres, 75015 Paris",
      status: "pending",
      parcels: 8,
      occupiedParcels: 0,
      image: "https://images.unsplash.com/photo-1621955964441-c173e01c6654"
    }
  ];
  
  const gardenRequests = [
    { id: 101, gardenerName: "Marie Dupont", gardenName: "Mon Potager Urbain", date: "10 mai 2023" },
    { id: 102, gardenerName: "Jean Martin", gardenName: "Mon Potager Urbain", date: "12 mai 2023" }
  ];

  const handleDeleteGarden = (gardenId: number, gardenName: string) => {
    // Simulation de suppression
    toast({
      title: "Jardin supprimé",
      description: `Le jardin "${gardenName}" a été supprimé avec succès.`,
    });
  };

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline">
                <Link to="/post-login" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Bienvenue, {userInfo.name}</h1>
                <p className="text-muted-foreground">
                  Membre {userInfo.membership} depuis {userInfo.joinedDate}
                </p>
              </div>
            </div>
            <Button asChild>
              <Link to="/add-land">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un terrain
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Mes terrains</CardTitle>
                <CardDescription>Gérez vos espaces de jardinage</CardDescription>
              </CardHeader>
              <CardContent>
                {myGardens.length > 0 ? (
                  <div className="space-y-6">
                    {myGardens.map(garden => (
                      <div key={garden.id} className="border rounded-lg overflow-hidden">
                        <AspectRatio ratio={16/9}>
                          <img 
                            src={garden.image} 
                            alt={garden.name} 
                            className="object-cover w-full h-full" 
                          />
                        </AspectRatio>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{garden.name}</h3>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              garden.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {garden.status === "active" ? "Actif" : "En attente"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="mr-1 h-4 w-4" />
                            {garden.address}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <Users className="mr-1 h-4 w-4" />
                            {garden.occupiedParcels} parcelles occupées sur {garden.parcels}
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/manage-lands/${garden.id}`} className="flex items-center justify-center gap-1">
                                <Users className="h-4 w-4" />
                                Gérer
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/edit-land/${garden.id}`} className="flex items-center justify-center gap-1">
                                <Edit className="h-4 w-4" />
                                Modifier
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteGarden(garden.id, garden.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Vous n'avez pas encore de terrain</p>
                    <Button asChild>
                      <Link to="/add-land">Ajouter un terrain</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Demandes de réservation</CardTitle>
                <CardDescription>Gérez les demandes des jardiniers</CardDescription>
              </CardHeader>
              <CardContent>
                {gardenRequests.length > 0 ? (
                  <div className="space-y-4">
                    {gardenRequests.map(request => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="font-medium mb-1">{request.gardenerName}</div>
                        <div className="text-sm text-muted-foreground mb-3">
                          Demande pour {request.gardenName} le {request.date}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">Refuser</Button>
                          <Button size="sm" className="flex-1">Accepter</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune demande de réservation en attente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistiques et revenus</CardTitle>
              <CardDescription>Aperçu de vos jardins et des revenus générés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {myGardens.reduce((acc, garden) => acc + garden.parcels, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Parcelles totales</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {myGardens.reduce((acc, garden) => acc + garden.occupiedParcels, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Parcelles occupées</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {myGardens.filter(garden => garden.status === "active").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Jardins actifs</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {myGardens.reduce((acc, garden) => acc + garden.occupiedParcels * 25, 0)}€
                  </div>
                  <div className="text-sm text-muted-foreground">Revenus mensuels</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
