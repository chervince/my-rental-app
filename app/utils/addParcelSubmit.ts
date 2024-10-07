// app/utils/addParcelSubmit.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FormData } from '../types/formTypes'

export async function handleAddParcelSubmit(formData: FormData, image: File | null): Promise<{ success: boolean; message: string; imageUrl?: string }> {
  const supabase = createClientComponentClient()

  // Vérification de la session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session) {
    console.error("Erreur de session:", sessionError)
    return { success: false, message: "Votre session a expiré. Veuillez vous reconnecter." }
  }
  console.log("Session vérifiée avec succès")

  // Vérification de l'utilisateur
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error("Erreur d'authentification:", userError)
    return { success: false, message: "Vous devez être connecté pour ajouter une parcelle." }
  }
  console.log("Utilisateur authentifié:", user.id)

  // Vérification de l'existence de l'utilisateur dans la base de données
  const { data: utilisateur, error: utilisateurError } = await supabase
    .from('utilisateurs')
    .select('id')
    .eq('id', user.id)
    .single()

  if (utilisateurError && utilisateurError.code !== 'PGRST116') {
    console.error("Erreur lors de la vérification de l'utilisateur:", utilisateurError)
    return { success: false, message: "Une erreur s'est produite lors de la vérification de votre compte." }
  }

  let utilisateurFinal = utilisateur

  if (!utilisateurFinal) {
    console.log("Utilisateur non trouvé, création d'un nouvel utilisateur")
    try {
      const { data, error } = await supabase
        .from('utilisateurs')
        .insert([
          { id: user.id, email: user.email }
        ])
        .select()
      if (error) throw error
      utilisateurFinal = data[0]
      console.log("Nouvel utilisateur créé:", utilisateurFinal)
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error)
      return { success: false, message: "Impossible de créer votre compte utilisateur." }
    }
  }

  if (!utilisateurFinal) {
    return { success: false, message: "Impossible de vérifier ou de créer le compte utilisateur." }
  }

  console.log("Utilisateur vérifié dans la base de données:", utilisateurFinal.id)

  // Validation des champs
  if (!formData.titre.trim()) {
    return { success: false, message: "Le titre de la parcelle est obligatoire." }
  }

  // Validation de la latitude et longitude
  const latitude = parseFloat(formData.latitude)
  const longitude = parseFloat(formData.longitude)

  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    return { success: false, message: `La latitude doit être un nombre entre -90 et 90. Valeur actuelle: ${formData.latitude}` }
  }

  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    return { success: false, message: `La longitude doit être un nombre entre -180 et 180. Valeur actuelle: ${formData.longitude}` }
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
  
    // Obtenir l'URL publique de l'image
    const { data: publicUrlData } = supabase.storage
      .from('terrain-images')
      .getPublicUrl(uploadData.path)
  
    imageUrl = publicUrlData.publicUrl
  
    console.log('URL publique de l\'image:', imageUrl) // Pour le débogage
  }

  // Insertion de l'image dans la table 'images'
  let imageId = null
  if (imageUrl) {
    const { data: imageData, error: imageError } = await supabase
      .from('images')
      .insert({
        url: imageUrl,
        legende: formData.titre,
      })
      .select()

    if (imageError) {
      console.error("Erreur lors de l'insertion de l'image:", imageError)
      return { success: false, message: "Erreur lors de l'enregistrement des données de l'image." }
    }

    imageId = imageData[0].id
  }

  // Insertion dans la table terrains
  const { data: terrain, error: terrainError } = await supabase
    .from('terrains')
    .insert({
      proprietaire_id: utilisateurFinal.id,
      titre: formData.titre.trim(),
      description: formData.description,
      emplacement: formData.emplacement,
      latitude: latitude,
      longitude: longitude,
      prix_par_jour: parseFloat(formData.prix_par_jour),
      date_disponibilite_debut: formData.date_disponibilite_debut,
      date_disponibilite_fin: formData.date_disponibilite_fin,
      capacite_max: parseInt(formData.capacite_max),
      image_mise_en_avant_id: imageId
    })
    .select()

  if (terrainError) {
    console.error("Erreur détaillée lors de l'insertion:", terrainError)
    return { success: false, message: 'Erreur lors de l\'ajout du terrain: ' + terrainError.message }
  }

  if (!terrain || terrain.length === 0) {
    return { success: false, message: 'Erreur lors de l\'ajout du terrain: aucune donnée retournée' }
  }

  // Mise à jour du terrain_id dans la table images
  if (imageId) {
    const { error: updateError } = await supabase
      .from('images')
      .update({ terrain_id: terrain[0].id })
      .eq('id', imageId)

    if (updateError) {
      console.error("Erreur lors de la mise à jour du terrain_id de l'image:", updateError)
      // Ne pas retourner une erreur ici, car le terrain a déjà été créé
    }
  }

  return { 
    success: true, 
    message: "Parcelle ajoutée avec succès!",
    imageUrl: imageUrl || undefined
  }
}