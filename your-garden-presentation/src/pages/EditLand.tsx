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
import { getLand, updateLand } from "@/services/LandService";
import type { Land } from "@/models/land";

const landFormSchema = z.object({
  cadastral_reference: z.string().min(5, "La référence cadastrale doit comporter au moins 5 caractères"),
  name: z.string().min(3, "Le nom du terrain doit comporter au moins 3 caractères"),
  address: z.string().min(5, "Veuillez entrer une adresse valide"),
  number_of_gardens: z.coerce.number().min(1, "Le nombre de jardins doit être au moins 1"),
  image_url: z.string().optional(),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
});

type LandForm = z.infer<typeof landFormSchema>;

const EditLand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLand, setCurrentLand] = useState<Land | null>(null);
  
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

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      try {
        const land = await getLand(Number(id));
        if (!mounted) return;
        setCurrentLand(land);
        form.reset({
          cadastral_reference: land.cadastral_reference ?? "",
          name: land.land_name ?? "",
          address: land.land_adresse ?? "",
          number_of_gardens: land.nb_gardens ?? 1,
          image_url: (land as any).image_url ?? (land as any).imageURL ?? "",
          description: land.description ?? "",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le terrain.",
          variant: "destructive",
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id, form]);
  
  const onSubmit = async (data: LandForm) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const dto: Partial<Land> = {
        cadastral_reference: data.cadastral_reference,
        land_name: data.name,
        land_adresse: data.address,
        nb_gardens: data.number_of_gardens,
        description: data.description,
      };
      await updateLand(Number(id), dto);
      toast({
        title: "Terrain modifié avec succès !",
        description: "Les modifications ont été enregistrées.",
      });
      navigate(`/manage-lands/${id}`);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "La mise à jour du terrain a échoué.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                        Nombre maximum de jardins sur ce terrain
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

export default EditLand;