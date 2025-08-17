import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { addLand } from "@/services/LandService";
import { Land } from "@/models/land";
import { useAuth } from "@/context/AuthContext";

const landFormSchema = z.object({
  cadastral_reference: z.string().min(5, "La référence cadastrale doit comporter au moins 5 caractères"),
  name: z.string().min(3, "Le nom du terrain doit comporter au moins 3 caractères"),
  address: z.string().min(5, "Veuillez entrer une adresse valide"),
  number_of_gardens: z.coerce.number().min(1, "Le nombre de jardins doit être au moins 1"),
  image_url: z.string().optional(),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
  complet: z.boolean().optional(), 
});

type LandForm = z.infer<typeof landFormSchema>;

const AddLand = () => {
  console.log("AddLand component is loading with terrainFormSchema");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
    const { user } = useAuth();
  
  const form = useForm<LandForm>({
    resolver: zodResolver(landFormSchema),
    defaultValues: {
      cadastral_reference: "",
      name: "",
      address: "",
      number_of_gardens: 1,
      image_url: "",
      description: "",
    },
  });
  
  const onSubmit = async (data: LandForm) => {
    setIsSubmitting(true);
    
    try {
      const payload : Land = {
        cadastral_reference: data.cadastral_reference,
        land_name: data.name,
        land_adresse: data.address,
        nb_gardens: data.number_of_gardens,
        // ima: data.image_url || null,
        description: data.description,
        postalCode: "",
        city: "",
        imageId: 0,
        user_id: user.id,
        id: 0,
        plotSize: "",
        price: ""
      }
      // Call the addLand service with the payload and token
    const land: Land = await addLand(payload);      // const { data: { user } } = await supabase.auth.getUser();
            toast({
        title: "Terrain créé avec succès !",
        description: "Vous pouvez maintenant ajouter des jardins à votre terrain.",
      });

      // suppose que l’API renvoie l’objet avec un id
      navigate(`/manage-lands/${land.id}`);
      // if (!user) {
      //   toast({
      //     title: "Erreur d'authentification",
      //     description: "Vous devez être connecté pour créer un terrain.",
      //     variant: "destructive",
      //   });
      //   return;
      // }

      // const { data: land, error } = await supabase
      //   .from('lands')
      //   .insert({
      //     cadastral_reference: data.cadastral_reference,
      //     name: data.name,
      //     address: data.address,
      //     number_of_gardens: data.number_of_gardens,
      //     image_url: data.image_url || null,
      //     description: data.description,
      //     owner_id: user.id,
      //   })
      //   .select()
      //   .single();

      // if (error) {
      //   console.error('Error creating land:', error);
      //   toast({
      //     title: "Erreur lors de la création",
      //     description: error.message,
      //     variant: "destructive",
      //   });
      //   return;
      // }

      toast({
        title: "Terrain créé avec succès !",
        description: "Vous pouvez maintenant ajouter des jardins à votre terrain.",
      });

      // Rediriger vers la page de gestion des jardins
      navigate(`/manage-lands/${land.id}`);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-bold">Créer un terrain</h1>
          <p className="mt-2 text-muted-foreground">
            Ajoutez votre terrain pour pouvoir y créer des jardins partagés
          </p>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Informations du terrain</h2>
                
                <FormField
                  control={form.control}
                  name="cadastral_reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Référence cadastrale</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 123456789" {...field} />
                      </FormControl>
                      <FormDescription>
                        Référence unique du terrain selon le cadastre
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du terrain</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Terrain des Fleurs" {...field} />
                      </FormControl>
                      <FormDescription>
                        Choisissez un nom attrayant pour votre terrain
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse complète</FormLabel>
                      <FormControl>
                        <Input placeholder="15 rue des Jardins, 75011 Paris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="number_of_gardens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de jardins</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="ex: 5" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nombre maximum de jardins que vous souhaitez créer sur ce terrain
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image du terrain (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemple.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL d'une image représentant votre terrain
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez votre terrain, son environnement, ses caractéristiques..." 
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
              
              <div className="pt-4 border-t">
                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? "Création en cours..." : "Créer le terrain"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddLand;
