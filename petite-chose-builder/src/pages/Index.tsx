
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Trouvez un jardin",
      description: "Parcourez la carte interactive pour trouver un jardin partagé près de chez vous."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Rejoignez une communauté",
      description: "Partagez vos connaissances et rencontrez d'autres passionnés de jardinage."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2')] bg-cover bg-center h-[70vh]"
        >
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center px-4 sm:px-6 lg:px-8 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Cultivez ensemble, partagez la récolte
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Rejoignez la communauté des jardins partagés et contribuez à un avenir plus vert et plus solidaire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-base px-8">
                  <Link to="/map">Trouver un jardin</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8 bg-white/10 text-white border-white/30 hover:bg-white/20">
                  <Link to="/signup">Proposer mon terrain</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card hover:shadow-lg transition-shadow border-muted">
                <CardHeader>
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Qui êtes-vous ?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Je suis jardinier</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Je cherche un espace pour cultiver mes fruits et légumes.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" />Parcourez la carte des jardins</li>
                  <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" />Réservez une parcelle</li>
                  <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" />Rejoignez une communauté</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/map">Voir les jardins disponibles</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Je suis propriétaire</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Je souhaite partager mon terrain pour qu'il soit cultivé.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" />Publiez votre annonce</li>
                  <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" />Rencontrez des jardiniers</li>
                  <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" />Partagez votre espace</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/signup">Proposer mon terrain</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à vous lancer ?</h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            Rejoignez notre communauté et commencez l'aventure du jardinage partagé dès aujourd'hui !
          </p>
          <Button asChild size="lg" variant="outline" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
            <Link to="/signup">S'inscrire gratuitement</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
