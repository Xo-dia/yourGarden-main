import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { createGarden } from "@/services/gardenService";

const gardenSchema = z.object({
  garden_name: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
  surface: z.coerce.number().min(1, "Surface minimale: 1 m²"),
  price: z.coerce.number().min(0, "Le prix doit être positif"),
  description: z.string().min(10, "La description doit comporter au moins 10 caractères"),
  imageURL: z.string().optional(),
});

const formSchema = z.object({
  gardens: z.array(gardenSchema).min(1),
});

type FormValues = z.infer<typeof formSchema>;

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const AddGardens = () => {
  const navigate = useNavigate();
  const { landId } = useParams<{ landId: string }>();
  const query = useQuery();
  const countFromQuery = Number(query.get("count") ?? "1");
  const gardensCount = Number.isFinite(countFromQuery) && countFromQuery > 0 ? Math.floor(countFromQuery) : 1;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gardens: Array.from({ length: gardensCount }).map(() => ({
        garden_name: "",
        surface: 1,
        price: 0,
        description: "",
        imageURL: "",
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "gardens",
  });

  // Track current step values and compute validity synchronously
  const currentValues = form.watch(`gardens.${currentIndex}`);
  const isCurrentValid = useMemo(() => {
    return gardenSchema.safeParse(currentValues).success;
  }, [currentValues]);
  const allValues = form.watch("gardens");
  const allValid = useMemo(() => {
    if (!Array.isArray(allValues)) return false;
    if (allValues.length === 0) return false;
    return allValues.every((g) => gardenSchema.safeParse(g).success);
  }, [allValues]);

  useEffect(() => {
    if (!landId) {
      toast({
        title: "Terrain manquant",
        description: "Identifiant du terrain introuvable.",
        variant: "destructive",
      });
      navigate("/owner-dashboard");
    }
  }, [landId, navigate]);

  const onSubmit = async (values: FormValues) => {
    if (!landId) return;
    setIsSubmitting(true);
    try {
      for (const g of values.gardens) {
        await createGarden({
          garden_name: g.garden_name,
          surface: Number(g.surface),
          price: Number(g.price),
          description: g.description,
          imageURL: g.imageURL || undefined,
          land_id: landId,
        });
      }

      toast({
        title: "Jardins créés",
        description: `${values.gardens.length} jardin(s) ajoutés avec succès.`,
      });
      navigate(`/owner-dashboard`);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message ?? "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = fields.length;

  const validateCurrentAndNext = async () => {
    const base = `gardens.${currentIndex}` as const;
    const ok = await form.trigger([
      `${base}.name`,
      `${base}.surface`,
      `${base}.price`,
      `${base}.description`,
      `${base}.imageURL`,
    ] as any, { shouldFocus: true } as any);
    if (ok) {
      setCurrentIndex((i) => Math.min(i + 1, total - 1));
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-bold">Ajouter des jardins</h1>
          <p className="mt-2 text-muted-foreground">
            Renseignez les informations pour chacun des jardins à créer.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations des jardins</CardTitle>
            <CardDescription>
              Jardin {currentIndex + 1} / {total}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8">
                  {fields.length > 0 && (
                    <div className="border rounded-lg p-4" key={`step-${currentIndex}`}>
                      <h3 className="text-lg font-semibold mb-4">Jardin {currentIndex + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`gardens.${currentIndex}.garden_name` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="ex: Jardin A" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`gardens.${currentIndex}.surface` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Surface (m²)</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" step="1" placeholder="ex: 10" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`gardens.${currentIndex}.price` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prix (€/mois)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" min="0" placeholder="ex: 15.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`gardens.${currentIndex}.imageURL` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image (optionnel)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://exemple.com/image.jpg" {...field} />
                              </FormControl>
                              <FormDescription>URL d'une image du jardin</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name={`gardens.${currentIndex}.description` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Décrivez ce jardin..." className="min-h-24" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                      disabled={currentIndex === 0}
                    >
                      Précédent
                    </Button>
                    {currentIndex < total - 1 && (
                      <Button type="button" onClick={validateCurrentAndNext}>
                        Suivant
                      </Button>
                    )}
                  </div>

                  {currentIndex === total - 1 && (
                    <Button
                      type="submit"
                      className="sm:ml-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Création en cours..." : "Valider"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddGardens;


