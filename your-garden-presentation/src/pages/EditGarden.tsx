import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const gardenFormSchema = z.object({
  name: z.string().min(3, "Le nom du jardin doit comporter au moins 3 caractères"),
  address: z.string().min(5, "Veuillez entrer une adresse valide"),
  city: z.string().min(2, "Veuillez entrer une ville valide"),
  postalCode: z.string().min(5, "Veuillez entrer un code postal valide"),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
  totalPlots: z.coerce.number().min(1, "Doit être au moins 1"),
  plotSize: z.string().min(2, "Veuillez préciser la taille des parcelles"),
  price: z.string().min(1, "Veuillez préciser le prix mensuel"),
});

type GardenForm = z.infer<typeof gardenFormSchema>;

const EditGarden = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<GardenForm>({
    resolver: zodResolver(gardenFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      postalCode: "",
      description: "",
      totalPlots: 1,
      plotSize: "",
      price: "",
    },
  });

  // Simuler le chargement des données du terrain
  useEffect(() => {
    const loadGardenData = () => {
      // Simulation des données existantes
      const gardenData = {
        name: "Mon Potager Urbain",
        address: "12 rue des Fleurs",
        city: "Paris",
        postalCode: "75001",
        description: "Un beau potager urbain avec 5 parcelles disponibles pour les jardiniers passionnés.",
        totalPlots: 5,
        plotSize: "4m²",
        price: "25€/mois",
      };
      
      form.reset(gardenData);
      setIsLoading(false);
    };

    setTimeout(loadGardenData, 1000);
  }, [id, form]);
  
  const onSubmit = (data: GardenForm) => {
    setIsSubmitting(true);
    
    // Simulation d'un appel API
    setTimeout(() => {
      console.log("Terrain modifié:", data);
      toast({
        title: "Terrain modifié avec succès !",
        description: "Les modifications ont été enregistrées.",
      });
      setIsSubmitting(false);
      navigate("/owner-dashboard");
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des données du terrain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Button variant="outline" onClick={() => navigate("/owner-dashboard")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold">Modifier mon terrain</h1>
          <p className="mt-2 text-muted-foreground">
            Modifiez les informations de votre terrain
          </p>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Informations générales</h2>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du jardin</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Jardin des Fleurs" {...field} />
                      </FormControl>
                      <FormDescription>
                        Choisissez un nom attrayant pour votre jardin
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="15 rue des Jardins" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal</FormLabel>
                          <FormControl>
                            <Input placeholder="75011" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Paris" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez votre jardin, son environnement, ses caractéristiques..." 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Soyez précis pour attirer des jardiniers intéressés
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-xl font-semibold">Informations des parcelles</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="totalPlots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de parcelles</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="plotSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taille d'une parcelle</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: 4m²" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix mensuel</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: 15€/mois" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Modification en cours..." : "Enregistrer les modifications"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/owner-dashboard")}>
                  Annuler
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditGarden;