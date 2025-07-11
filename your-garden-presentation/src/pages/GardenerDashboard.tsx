import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowRight, UserRound, Mail, Phone, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

const GardenerDashboard = () => {
  // Simuler des données qui viendraient du backend
  const users = [
    {
      name: "Sophie Martin",
      membership: "Premium",
      joinedDate: "Avril 2023",
      email: "sophie.martin@example.com",
      phone: "+33 6 12 34 56 78",
      address: "12 rue des Jardins, 75011 Paris",
      reservations: [
        { id: 1, gardenName: "Jardin des Lilas", date: "15 juin 2023", status: "active" },
        { id: 2, gardenName: "Potager Urbain", date: "3 mai 2023", status: "pending" }
      ]
    },
    {
      name: "Thomas Dubois",
      membership: "Standard",
      joinedDate: "Janvier 2024",
      email: "thomas.dubois@example.com",
      phone: "+33 7 65 43 21 09",
      address: "45 avenue des Fleurs, 75020 Paris",
      reservations: [
        { id: 3, gardenName: "Potager Collectif", date: "10 avril 2024", status: "active" }
      ]
    },
    {
      name: "Camille Legrand",
      membership: "Premium",
      joinedDate: "Mars 2024",
      email: "camille.legrand@example.com",
      phone: "+33 6 98 76 54 32",
      address: "8 rue des Maraîchers, 75019 Paris",
      reservations: [
        { id: 4, gardenName: "Jardin Communautaire", date: "2 mai 2024", status: "active" },
        { id: 5, gardenName: "Jardin des Lilas", date: "20 mai 2024", status: "pending" },
        { id: 6, gardenName: "Les Jardins du Parc", date: "1 juin 2024", status: "pending" }
      ]
    }
  ];

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const userInfo = users[currentUserIndex];

  const nextUser = () => {
    setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length);
  };

  const prevUser = () => {
    setCurrentUserIndex((prevIndex) => (prevIndex - 1 + users.length) % users.length);
  };
  
  const nearbyGardens = [
    { id: 101, name: "Jardin Communautaire", distance: "1.2 km", available: true },
    { id: 102, name: "Les Jardins du Parc", distance: "2.4 km", available: true },
    { id: 103, name: "Potager Collectif", distance: "3.7 km", available: false }
  ];

  return (
    <div className="min-h-screen">
      {/* Header avec titre JardinPartage */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">JardinPartage</span>
            </Link>
          </div>
        </div>
      </header>

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
                <div className="flex items-center gap-3 mb-2">
                  <Button variant="outline" size="icon" onClick={prevUser} className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentUserIndex + 1} sur {users.length}
                  </span>
                  <Button variant="outline" size="icon" onClick={nextUser} className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <h1 className="text-3xl font-bold">Bienvenue, {userInfo.name}</h1>
                <p className="text-muted-foreground">
                  Membre {userInfo.membership} depuis {userInfo.joinedDate}
                </p>
              </div>
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
                {userInfo.reservations.length > 0 ? (
                  <div className="space-y-4">
                    {userInfo.reservations.map(reservation => (
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
    </div>
  );
};

export default GardenerDashboard;