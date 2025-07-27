// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "@/hooks/use-toast";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { supabase } from "@/integrations/supabase/client";
// import { Plus, ArrowLeft, Trash2 } from "lucide-react";

// const gardenFormSchema = z.object({
//   name: z.string().min(3, "Le nom du jardin doit comporter au moins 3 caractères"),
//   size: z.string().min(2, "Veuillez préciser la taille du jardin"),
//   price: z.coerce.number().min(0, "Le prix doit être positif"),
//   description: z.string().min(10, "La description doit comporter au moins 10 caractères"),
//   photo_url: z.string().optional(),
// });

// type GardenForm = z.infer<typeof gardenFormSchema>;

// interface Land {
//   id: string;
//   name: string;
//   number_of_gardens: number;
//   cadastral_reference: string;
//   address: string;
// }

// interface Garden {
//   id: string;
//   name: string;
//   size: string;
//   price: number;
//   description: string;
//   photo_url?: string;
// }

// const ManageLands = () => {
//   const { landId } = useParams<{ landId: string }>();
//   const navigate = useNavigate();
//   const [land, setLand] = useState<Land | null>(null);
//   const [gardens, setGardens] = useState<Garden[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showForm, setShowForm] = useState(false);

//   const form = useForm<GardenForm>({
//     resolver: zodResolver(gardenFormSchema),
//     defaultValues: {
//       name: "",
//       size: "",
//       price: 0,
//       description: "",
//       photo_url: "",
//     },
//   });

//   useEffect(() => {
//     if (landId) {
//       loadLandAndGardens();
//     }
//   }, [landId]);

//   const loadLandAndGardens = async () => {
//     try {
//       // Charger les informations du terrain
//       const { data: landData, error: landError } = await supabase
//         .from('lands')
//         .select('*')
//         .eq('id', landId)
//         .single();

//       if (landError) {
//         console.error('Error loading land:', landError);
//         toast({
//           title: "Erreur",
//           description: "Impossible de charger les informations du terrain.",
//           variant: "destructive",
//         });
//         return;
//       }

//       setLand(landData);

//       // Charger les jardins existants
//       const { data: gardensData, error: gardensError } = await supabase
//         .from<Garden>('gardens')
//         .select('*')
//         .eq('land_id', landId);

//       if (gardensError) {
//         console.error('Error loading gardens:', gardensError);
//         toast({
//           title: "Erreur",
//           description: "Impossible de charger la liste des jardins.",
//           variant: "destructive",
//         });
//         return;
//       }

//       setGardens((gardensData as Garden[]) || []);
//     } catch (error) {
//       console.error('Error:', error);
//       toast({
//         title: "Erreur",
//         description: "Une erreur inattendue s'est produite.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onSubmit = async (data: GardenForm) => {
//     if (!landId) return;

//     setIsSubmitting(true);

//     try {
//       const { error } = await supabase
//         .from('gardens')
//         .insert({
//           land: landId,
//           name: data.name,
//           size: data.size,
//           price: data.price,
//           description: data.description,
//           photo_url: data.photo_url || null,
//         });

//       if (error) {
//         console.error('Error creating garden:', error);
//         toast({
//           title: "Erreur lors de la création",
//           description: error.message,
//           variant: "destructive",
//         });
//         return;
//       }

//       toast({
//         title: "Jardin créé avec succès !",
//         description: "Le jardin a été ajouté à votre terrain.",
//       });

//       form.reset();
//       setShowForm(false);
//       loadLandAndGardens();
//     } catch (error) {
//       console.error('Error:', error);
//       toast({
//         title: "Erreur",
//         description: "Une erreur inattendue s'est produite.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const deleteGarden = async (gardenId: string) => {
//     try {
//       const { error } = await supabase
//         .from('gardens')
//         .delete()
//         .eq('id', gardenId);

//       if (error) {
//         console.error('Error deleting garden:', error);
//         toast({
//           title: "Erreur lors de la suppression",
//           description: error.message,
//           variant: "destructive",
//         });
//         return;
//       }

//       toast({
//         title: "Jardin supprimé",
//         description: "Le jardin a été supprimé avec succès.",
//       });

//       loadLandAndGardens();
//     } catch (error) {
//       console.error('Error:', error);
//       toast({
//         title: "Erreur",
//         description: "Une erreur inattendue s'est produite.",
//         variant: "destructive",
//       });
//     }
//   };

//   const canAddMoreGardens = land ? gardens.length < land.number_of_gardens : false;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen pt-16 pb-12 flex items-center justify-center">
//         <p>Chargement...</p>
//       </div>
//     );
//   }

//   if (!land) {
//     return (
//       <div className="min-h-screen pt-16 pb-12 flex items-center justify-center">
//         <p>Terrain non trouvé.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-16 pb-12">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="py-6">
//           <div className="flex items-center gap-4 mb-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate('/owner-dashboard')}
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Retour
//             </Button>
//           </div>
          
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold">{land.name}</h1>
//             <p className="text-muted-foreground">{land.address}</p>
//             <p className="text-sm text-muted-foreground">
//               Référence cadastrale: {land.cadastral_reference}
//             </p>
//           </div>

//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-4">
//               <Badge variant="secondary">
//                 {gardens.length}/{land.number_of_gardens} jardins créés
//               </Badge>
//               {!canAddMoreGardens && gardens.length > 0 && (
//                 <Badge variant="destructive">
//                   Limite atteinte
//                 </Badge>
//               )}
//             </div>
            
//             {canAddMoreGardens && (
//               <Button onClick={() => setShowForm(true)}>
//                 <Plus className="w-4 h-4 mr-2" />
//                 Ajouter un jardin
//               </Button>
//             )}
//           </div>

//           {showForm && canAddMoreGardens && (
//             <Card className="mb-8">
//               <CardHeader>
//                 <CardTitle>Nouveau jardin</CardTitle>
//                 <CardDescription>
//                   Créez un nouveau jardin sur votre terrain
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Form {...form}>
//                   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="name"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Nom du jardin</FormLabel>
//                             <FormControl>
//                               <Input placeholder="ex: Jardin A" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
                      
//                       <FormField
//                         control={form.control}
//                         name="size"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Taille du jardin</FormLabel>
//                             <FormControl>
//                               <Input placeholder="ex: 4m²" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="price"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Prix (€/mois)</FormLabel>
//                             <FormControl>
//                               <Input type="number" step="0.01" placeholder="ex: 15.00" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
                      
//                       <FormField
//                         control={form.control}
//                         name="photo_url"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Photo du jardin (optionnel)</FormLabel>
//                             <FormControl>
//                               <Input placeholder="https://exemple.com/photo.jpg" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     <FormField
//                       control={form.control}
//                       name="description"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Description du jardin</FormLabel>
//                           <FormControl>
//                             <Textarea 
//                               placeholder="Décrivez les caractéristiques de ce jardin..." 
//                               className="min-h-24"
//                               {...field} 
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <div className="flex gap-2">
//                       <Button type="submit" disabled={isSubmitting}>
//                         {isSubmitting ? "Ajout en cours..." : "Ajouter le jardin"}
//                       </Button>
//                       <Button 
//                         type="button" 
//                         variant="outline" 
//                         onClick={() => setShowForm(false)}
//                       >
//                         Annuler
//                       </Button>
//                     </div>
//                   </form>
//                 </Form>
//               </CardContent>
//             </Card>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {gardens.map((garden) => (
//               <Card key={garden.id}>
//                 <CardHeader className="pb-3">
//                   <div className="flex justify-between items-start">
//                     <CardTitle className="text-lg">{garden.name}</CardTitle>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => deleteGarden(garden.id)}
//                       className="text-destructive hover:text-destructive"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2 text-sm">
//                     <p><strong>Taille:</strong> {garden.size}</p>
//                     <p><strong>Prix:</strong> {garden.price}€/mois</p>
//                     <p className="text-muted-foreground">{garden.description}</p>
//                     {garden.photo_url && (
//                       <img 
//                         src={garden.photo_url} 
//                         alt={garden.name}
//                         className="w-full h-32 object-cover rounded mt-2"
//                       />
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {gardens.length === 0 && (
//             <div className="text-center py-12">
//               <p className="text-muted-foreground mb-4">
//                 Aucun jardin créé pour ce terrain.
//               </p>
//               {canAddMoreGardens && (
//                 <Button onClick={() => setShowForm(true)}>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Créer votre premier jardin
//                 </Button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageLands;