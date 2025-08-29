import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getLand, updateLand } from "@/services/LandService";
import { getGardensByLand, updateGarden } from "@/services/gardenService"; // updateGarden: bulk PUT (array)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Land } from "@/models/land";
import type { Garden } from "@/models/garden";

// ---------- Schemas ----------
const landFormSchema = z.object({
  cadastral_reference: z.string().min(5, "La référence cadastrale doit comporter au moins 5 caractères"),
  name: z.string().min(3, "Le nom du terrain doit comporter au moins 3 caractères"),
  address: z.string().min(5, "Veuillez entrer une adresse valide"),
  number_of_gardens: z.coerce.number().min(1, "Le nombre de jardins doit être au moins 1"),
  image_url: z.string().optional(),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
});

const gardenFormSchema = z.object({
  garden_name: z.string().min(3, "Le nom du jardin doit comporter au moins 3 caractères"),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
  plotSize: z.string().min(2, "Veuillez préciser la taille des parcelles"),
  price: z.string().min(1, "Veuillez préciser le prix mensuel"),
});

const gardensFormSchema = z.object({
  gardens: z.array(gardenFormSchema).min(1),
});

type LandForm = z.infer<typeof landFormSchema>;
type GardenForm = z.infer<typeof gardenFormSchema>;
type GardensForm = z.infer<typeof gardensFormSchema>;

// util parse "4m²" / "25€/mois"
const toInt = (s: string) => {
  const m = s.match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
};

const EditLand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("land");

  // --------- States ---------
  const [isLandSubmitting, setIsLandSubmitting] = useState(false);
  const [isLandLoading, setIsLandLoading] = useState(true);
  const [currentLand, setCurrentLand] = useState<Land | null>(null);

  const [isGardensSubmitting, setIsGardensSubmitting] = useState(false);
  const [isGardensLoading, setIsGardensLoading] = useState(true);
  const [currentGardenIndex, setCurrentGardenIndex] = useState(0);
  const [existingGardens, setExistingGardens] = useState<Garden[]>([]);

  // --------- Forms ----------
  const landForm = useForm<LandForm>({
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

  const gardensForm = useForm<GardensForm>({
    resolver: zodResolver(gardensFormSchema),
    defaultValues: { gardens: [] },
    shouldUnregister: false, // ✅ conserve les champs quand ils sont cachés
  });

  const { fields, replace } = useFieldArray({
    control: gardensForm.control,
    name: "gardens",
  });

  // ---------- Load Land ----------
  useEffect(() => {
    let mounted = true;
    const loadLandData = async () => {
      if (!id) return;
      try {
        const land = await getLand(Number(id));
        if (!mounted) return;
        setCurrentLand(land);
        landForm.reset({
          cadastral_reference: land.cadastral_reference ?? "",
          name: land.land_name ?? "",
          address: land.land_adresse ?? "",
          number_of_gardens: land.nb_gardens ?? 1,
          image_url: (land as any).image_url ?? (land as any).imageURL ?? "",
          description: land.description ?? "",
        });
      } catch {
        toast({ title: "Erreur", description: "Impossible de charger le terrain.", variant: "destructive" });
      } finally {
        if (mounted) setIsLandLoading(false);
      }
    };
    loadLandData();
    return () => {
      mounted = false;
    };
  }, [id, landForm]);

  // ---------- Load Gardens ----------
  useEffect(() => {
    let mounted = true;
    const loadGardensData = async () => {
      if (!id) return;
      try {
        const gardens = await getGardensByLand(id);
        if (!mounted) return;

        setExistingGardens(gardens);

        if (gardens.length > 0) {
          const gardensData: GardenForm[] = gardens.map((g) => ({
            garden_name: g.garden_name,
            description: g.description,
            plotSize: `${g.surface}m²`,
            price: `${g.price}€/mois`,
          }));
          replace(gardensData);      // ✅ hydrate correctement le fieldArray
          setCurrentGardenIndex(0);  // revient au premier
        } else {
          replace([]);               // ✅ vide proprement (UI sera seedée plus bas)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des jardins:", error);
        toast({ title: "Erreur", description: "Impossible de charger les jardins existants.", variant: "destructive" });
        replace([]);                 // garde l’UI utilisable
      } finally {
        if (mounted) setIsGardensLoading(false);
      }
    };

    if (currentLand) loadGardensData();
    return () => {
      mounted = false;
    };
  }, [id, currentLand, replace]);

  // ---------- Seed automatique si pas de jardins à afficher ----------
  useEffect(() => {
    if (!isGardensLoading && fields.length === 0) {
      const n = Math.max(1, currentLand?.nb_gardens ?? 1);
      const defaults: GardenForm[] = Array.from({ length: n }).map((_, i) => ({
        garden_name: `Jardin ${i + 1}`,
        description: "Un beau jardin avec des parcelles disponibles pour les jardiniers passionnés.",
        plotSize: "4m²",
        price: "25€/mois",
      }));
      replace(defaults);
      setCurrentGardenIndex(0);
    }
  }, [isGardensLoading, fields.length, currentLand, replace]);

  // ---------- Submit Land ----------
  const onLandSubmit = async (data: LandForm) => {
    if (!id) return;
    setIsLandSubmitting(true);
    try {
      const dto: Partial<Land> = {
        cadastral_reference: data.cadastral_reference,
        land_name: data.name,
        land_adresse: data.address,
        nb_gardens: data.number_of_gardens,
        description: data.description,
      };

      await updateLand(Number(id), dto);
      toast({ title: "Terrain modifié avec succès !", description: "Les modifications du terrain ont été enregistrées." });

      const updatedLand = await getLand(Number(id));
      setCurrentLand(updatedLand);
    } catch (error: any) {
      console.error("Error updating land:", error);
      toast({
        title: "Erreur",
        description: error?.message ?? `Erreur ${error?.status}: La mise à jour du terrain a échoué.`,
        variant: "destructive",
      });
    } finally {
      setIsLandSubmitting(false);
    }
  };

  // ---------- Submit Gardens (BULK PUT /gardens) ----------
  const onGardensSubmit = async (_: GardensForm) => {
    if (!id) return;
    setIsGardensSubmitting(true);
    try {
      // valeurs fraîches du formulaire
      const values = gardensForm.getValues("gardens");

      // construit un tableau de DTO aligné avec existingGardens (pour récupérer les IDs si existants)
      const dtoArray = values.map((g, i) => ({
        id: existingGardens[i]?.id, // undefined si nouveau; backend peut upsert ou ignorer
        garden_name: g.garden_name,
        surface: toInt(g.plotSize),
        price: toInt(g.price),
        description: g.description,
        land_id: Number(id),
        // imageURL: ... // ajoute si ton backend le veut
      }));

      await updateGarden(dtoArray); // ⬅️ un seul appel bulk

      toast({
        title: "Jardins modifiés avec succès !",
        description: "Les modifications des jardins ont été enregistrées.",
      });

      const updatedGardens = await getGardensByLand(id);
      setExistingGardens(updatedGardens);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erreur",
        description: error?.message ?? "Une erreur inattendue s'est produite lors de la modification des jardins.",
        variant: "destructive",
      });
    } finally {
      setIsGardensSubmitting(false);
    }
  };

  // ---------- Navigation ----------
  const totalGardens = fields.length;
  const currentGardenValues = gardensForm.watch(`gardens.${currentGardenIndex}`);
  const isCurrentGardenValid = useMemo(() => {
    return gardenFormSchema.safeParse(currentGardenValues).success;
  }, [currentGardenValues]);

  const validateCurrentAndNext = async () => {
    const base = `gardens.${currentGardenIndex}` as const;
    const ok = await gardensForm.trigger(
      [`${base}.garden_name`, `${base}.description`, `${base}.plotSize`, `${base}.price`] as any,
      { shouldFocus: true } as any
    );
    if (ok) setCurrentGardenIndex((i) => Math.min(i + 1, totalGardens - 1));
  };

  if (isLandLoading || isGardensLoading) {
    return (
      <div className="min-h-screen pt-16 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Button variant="outline" onClick={() => navigate("/owner-dashboard")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold">Gérer mon terrain</h1>
          <p className="mt-2 text-muted-foreground">Modifiez les informations de votre terrain et gérez vos jardins</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="land">Informations du terrain</TabsTrigger>
            <TabsTrigger value="gardens">Modifier les jardins ({totalGardens})</TabsTrigger>
          </TabsList>

          {/* Onglet Terrain */}
          <TabsContent value="land" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Modifier le terrain</CardTitle>
                <CardDescription>Modifiez les informations de base de votre terrain</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...landForm}>
                  <form onSubmit={landForm.handleSubmit(onLandSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={landForm.control}
                        name="cadastral_reference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Référence cadastrale</FormLabel>
                            <FormControl>
                              <Input placeholder="ex: 123456789" {...field} />
                            </FormControl>
                            <FormDescription>Référence unique du terrain selon le cadastre</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={landForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom du terrain</FormLabel>
                            <FormControl>
                              <Input placeholder="ex: Terrain des Fleurs" {...field} />
                            </FormControl>
                            <FormDescription>Choisissez un nom attrayant pour votre terrain</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={landForm.control}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={landForm.control}
                        name="number_of_gardens"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de jardins</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" placeholder="ex: 5" {...field} />
                            </FormControl>
                            <FormDescription>Nombre maximum de jardins sur ce terrain</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={landForm.control}
                        name="image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image du terrain (optionnel)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://exemple.com/image.jpg" {...field} />
                            </FormControl>
                            <FormDescription>URL d'une image représentant votre terrain</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={landForm.control}
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
                          <FormDescription>Soyez précis pour attirer des jardiniers intéressés</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 border-t">
                      <Button type="submit" disabled={isLandSubmitting}>
                        {isLandSubmitting ? "Sauvegarde en cours..." : "Sauvegarder le terrain"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Jardins */}
          <TabsContent value="gardens" className="mt-6">
            {totalGardens === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Aucun jardin trouvé</CardTitle>
                  <CardDescription>Ce terrain ne possède pas encore de jardins.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Vous devez d'abord créer des jardins via la page d'ajout de jardins.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Modifier les jardins</CardTitle>
                  <CardDescription>
                    Jardin {currentGardenIndex + 1} / {totalGardens}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...gardensForm}>
                    <form
                      onSubmit={gardensForm.handleSubmit(
                        onGardensSubmit,
                        (errors) => {
                          console.log("[gardens] validation FAILED", errors);
                          toast({
                            title: "Formulaire jardins incomplet",
                            description: "Vérifie les champs (nom, description, taille, prix).",
                            variant: "destructive",
                          });
                        }
                      )}
                      className="space-y-6"
                    >
                      {/* On rend TOUS les items, seuls ceux de l'index courant sont visibles */}
                      {fields.map((f, i) => (
                        <div key={f.id} className={i === currentGardenIndex ? "border rounded-lg p-4" : "hidden"}>
                          <h3 className="text-lg font-semibold mb-4">Jardin {i + 1}</h3>

                          {/* Informations générales */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Informations générales</h4>

                            <FormField
                              control={gardensForm.control}
                              name={`gardens.${i}.garden_name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nom du jardin</FormLabel>
                                  <FormControl>
                                    <Input placeholder="ex: Jardin des Fleurs" {...field} />
                                  </FormControl>
                                  <FormDescription>Choisissez un nom attrayant pour votre jardin.</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={gardensForm.control}
                              name={`gardens.${i}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Décrivez votre jardin, son environnement, ses caractéristiques..."
                                      className="min-h-[8rem]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>Soyez précis pour attirer des jardiniers intéressés.</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Informations des parcelles */}
                          <div className="space-y-4 pt-4 border-t">
                            <h4 className="text-lg font-semibold">Informations des parcelles</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={gardensForm.control}
                                name={`gardens.${i}.plotSize`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Taille d&apos;une parcelle</FormLabel>
                                    <FormControl>
                                      <Input placeholder="ex: 4m²" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={gardensForm.control}
                                name={`gardens.${i}.price`}
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
                        </div>
                      ))}

                      {/* Navigation et actions */}
                      <div className="pt-4 border-t flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentGardenIndex((i) => Math.max(0, i - 1))}
                            disabled={currentGardenIndex === 0}
                          >
                            Précédent
                          </Button>
                          {currentGardenIndex < totalGardens - 1 && (
                            <Button type="button" onClick={validateCurrentAndNext}>
                              Suivant
                            </Button>
                          )}
                        </div>

                        <Button type="submit" className="sm:ml-auto" disabled={isGardensSubmitting}>
                          {isGardensSubmitting ? "Modification en cours..." : "Modifier les jardins"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EditLand;
