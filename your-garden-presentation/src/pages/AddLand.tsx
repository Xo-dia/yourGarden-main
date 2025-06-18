
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { land } from "@/services/LandService";
import { Land } from "@/models/land";
import { useAuth } from "@/context/AuthContext";

const landFormSchema = z.object({
  cadastral_reference: z.coerce.number().min(3, "Le numéro cadastral est requis"),
  land_name: z.string().min(3, "Le nom du jardin doit comporter au moins 3 caractères"),
  land_adresse: z.string().min(5, "Veuillez entrer une adresse valide"),
  city: z.string().min(2, "Veuillez entrer une ville valide"),
  postalCode: z.string().min(5, "Veuillez entrer un code postal valide"),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
  totalPlots: z.coerce.number().min(1, "Doit être au moins 1"),
  plotSize: z.string().min(2, "Veuillez préciser la taille des parcelles"),
  price: z.string().min(1, "Veuillez préciser le prix mensuel"),
});

type LandForm = z.infer<typeof landFormSchema>;

const AddGarden = () => {
  const { user, logout } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LandForm>({
    resolver: zodResolver(landFormSchema),
    defaultValues: {
      cadastral_reference: 100,
      land_name: "",
      land_adresse: "",
      city: "",
      postalCode: "",
      description: "",
      totalPlots: 1,
      plotSize: "",
      price: "",
    },
  });

  const onSubmit = async (data: LandForm) => {
      console.log('avant atry')
    setIsSubmitting(true);

    const payload: Land = {
      cadastral_reference: String(data.cadastral_reference), // si attendu en string
      land_name: data.land_name,
      land_adresse: `${data.land_adresse}, ${data.city} ${data.postalCode}`,
      postalCode: "93600",
      city: "Paris",
      nb_gardens: data.totalPlots,
      imageId: 0, // ou récupéré dynamiquement
      description: data.description,
      user_id: 1, // récupère dynamiquement l'ID du user connecté
      id: 0, // souvent ignoré lors de l'insertion
      plotSize: "15",
      price: "15"
    };

    try {
      console.log('avant appel land')
      const response = await land(payload); // appel du bon service
      toast({
        title: "Jardin ajouté avec succès !",
        description: "Votre jardin a été publié.",
      }); // format sonner
      form.reset();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "erreur inconnu"; 
      toast({
        title: "Erreur",
        description: message || "Erreur lors de l’ajout du jardin.",
      }); // format sonner
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-bold">Proposer mon jardin</h1>
          <p className="mt-2 text-muted-foreground">
            Partagez votre terrain avec des jardiniers passionnés et contribuez à une communauté verte
          </p>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Informations générales</h2>
                
                <FormField
                  control={form.control}
                  name="land_name"
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
                    name="land_adresse"
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
              
              <div className="pt-4 border-t">
                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? "Publication en cours..." : "Publier mon jardin"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddGarden;
