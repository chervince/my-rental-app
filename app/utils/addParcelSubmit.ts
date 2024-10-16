// app/utils/addParcelSubmit.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FormData } from '../types/formTypes'

export async function handleAddParcelSubmit(formData: FormData, image: File | null): Promise<{ success: boolean, message: string, imageUrl?: string }> {
  const supabase = createClientComponentClient()

  // Vérification de la session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session) {
    console.error("Erreur de session:", sessionError)
    return { success: false, message: "Votre session a expiré. Veuillez vous reconnecter." }
  }

  // Vérification de l'utilisateur
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error("Erreur d'authentification:", userError)
    return { success: false, message: "Vous devez être connecté pour ajouter une parcelle." }
  }

  // Validation des champs
  if (!formData.titre.trim()) {
    return { success: false, message: "Le titre de la parcelle est obligatoire." }
  }

  // Upload de l'image si elle existe
  let imageUrl = null
  if (image) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('terrain-images')
      .upload(`${Date.now()}-${image.name}`, image)
  
    if (uploadError) {
      console.error('Erreur lors de l\'upload de l\'image:', uploadError)
      return { success: false, message: 'Erreur lors de l\'upload de l\'image' }
    }
  
    const { data: publicUrlData } = supabase.storage
      .from('terrain-images')
      .getPublicUrl(uploadData.path)
  
    imageUrl = publicUrlData.publicUrl
  }

  // Insertion dans la table terrains
  const { data: terrain, error: terrainError } = await supabase
    .from('terrains')
    .insert({
      proprietaire_id: user.id,
      titre: formData.titre.trim(),
      description: formData.description,
      emplacement: formData.emplacement,
      prix_par_jour: parseFloat(formData.prix_par_jour),
      image_mise_en_avant_id: null // Nous gérerons cela séparément
    })
    .select()

  if (terrainError) {
    console.error("Erreur détaillée lors de l'insertion:", terrainError)
    return { success: false, message: 'Erreur lors de l\'ajout du terrain: ' + terrainError.message }
  }

  if (!terrain || terrain.length === 0) {
    return { success: false, message: 'Erreur lors de l\'ajout du terrain: aucune donnée retournée' }
  }

  // Insertion de l'image dans la table 'images' si une image a été uploadée
  if (imageUrl) {
    const { data: imageData, error: imageError } = await supabase
      .from('images')
      .insert({
        terrain_id: terrain[0].id,
        url: imageUrl,
        legende: formData.titre,
      })
      .select()

    if (imageError) {
      console.error("Erreur lors de l'insertion de l'image:", imageError)
      // Ne pas retourner d'erreur ici, car le terrain a déjà été créé
    } else if (imageData && imageData.length > 0) {
      // Mise à jour du terrain avec l'ID de l'image mise en avant
      await supabase
        .from('terrains')
        .update({ image_mise_en_avant_id: imageData[0].id })
        .eq('id', terrain[0].id)
    }
  }

  return { 
    success: true, 
    message: "Parcelle ajoutée avec succès!",
    imageUrl: imageUrl || undefined
  }
}