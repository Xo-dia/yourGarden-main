
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowRight, UserRound, Mail, Phone } from "lucide-react";

const GardenerDashboard = () => {
  // Simuler des données qui viendraient du backend
  const userInfo = {
    name: "Sophie Martin",
    membership: "Premium",
    joinedDate: "Avril 2023",
    email: "sophie.martin@example.com",
    phone: "+33 6 12 34 56 78",
    address: "12 rue des Jardins, 75011 Paris"
  };
  
  const reservations = [
    { id: 1, gardenName: "Jardin des Lilas", date: "15 juin 2023", status: "active" },
    { id: 2, gardenName: "Potager Urbain", date: "3 mai 2023", status: "pending" }
  ];
  
  const nearbyGardens = [
    { id: 101, name: "Jardin Communautaire", distance: "1.2 km", available: true },
    { id: 102, name: "Les Jardins du Parc", distance: "2.4 km", available: true },
    { id: 103, name: "Potager Collectif", distance: "3.7 km", available: false }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Bienvenue, {userInfo.name}</h1>
            <p className="text-muted-foreground">
              Membre {userInfo.membership} depuis {userInfo.joinedDate}
            </p>
          </div>
          <Button asChild>
            <Link to="/map">Chercher un jardin</Link>
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Mes informations</CardTitle>
              <CardDescription>Détails personnels et coordonnées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Nom</p>
                    <p className="text-sm text-muted-foreground">{userInfo.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{userInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">{userInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Adresse</p>
                    <p className="text-sm text-muted-foreground">{userInfo.address}</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/profile">Modifier mon profil</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Mes réservations</CardTitle>
              <CardDescription>Vos parcelles réservées et en attente</CardDescription>
            </CardHeader>
            <CardContent>
              {reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map(reservation => (
                    <div key={reservation.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{reservation.gardenName}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          Depuis le {reservation.date}
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          reservation.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {reservation.status === "active" ? "Active" : "En attente"}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/my-reservations">Voir toutes mes réservations</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Vous n'avez pas encore de réservation</p>
                  <Button asChild>
                    <Link to="/map">Trouver un jardin</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Jardins près de chez vous</CardTitle>
              <CardDescription>Découvrez les jardins disponibles à proximité</CardDescription>
            </CardHeader>
            <CardContent>
              {nearbyGardens.map(garden => (
                <div key={garden.id} className="border rounded-lg p-4 mb-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{garden.name}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      {garden.distance}
                    </div>
                  </div>
                  <Button asChild size="sm" variant={garden.available ? "default" : "outline"} disabled={!garden.available}>
                    <Link to={`/gardens/${garden.id}`}>
                      {garden.available ? "Réserver" : "Complet"}
                    </Link>
                  </Button>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full">
                <Link to="/map" className="flex items-center justify-center gap-2">
                  Voir la carte complète
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Conseils de jardinage du mois</CardTitle>
            <CardDescription>Astuces et conseils pour votre potager</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Semis de mai</h3>
                <p className="text-sm text-muted-foreground">C'est le moment idéal pour semer les tomates, courgettes et concombres.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Arrosage économe</h3>
                <p className="text-sm text-muted-foreground">Installez un système de goutte-à-goutte pour économiser l'eau pendant l'été.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Compagnonnage</h3>
                <p className="text-sm text-muted-foreground">Plantez du basilic à côté des tomates pour repousser les nuisibles.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GardenerDashboard;
