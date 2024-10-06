// app/utils/addParcelSubmit.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FormData } from '../types/formTypes'

export async function handleAddParcelSubmit(formData: FormData): Promise<string> {
  const supabase = createClientComponentClient()

  // Vérification de la session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session) {
    console.error("Erreur de session:", sessionError)
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.")
  }
  console.log("Session vérifiée avec succès")

  // Vérification de l'utilisateur
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error("Erreur d'authentification:", userError)
    throw new Error("Vous devez être connecté pour ajouter une parcelle.")
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
    throw new Error("Une erreur s'est produite lors de la vérification de votre compte.")
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
      throw new Error("Impossible de créer votre compte utilisateur.")
    }
  }

  if (!utilisateurFinal) {
    throw new Error("Impossible de vérifier ou de créer le compte utilisateur.")
  }

  console.log("Utilisateur vérifié dans la base de données:", utilisateurFinal.id)

  // Validation des champs
  if (!formData.titre.trim()) {
    throw new Error("Le titre de la parcelle est obligatoire.")
  }

  // Validation de la latitude et longitude
  const latitude = parseFloat(formData.latitude)
  const longitude = parseFloat(formData.longitude)

  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    throw new Error(`La latitude doit être un nombre entre -90 et 90. Valeur actuelle: ${formData.latitude}`)
  }

  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    throw new Error(`La longitude doit être un nombre entre -180 et 180. Valeur actuelle: ${formData.longitude}`)
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
      infos_generales: formData.infos_generales,
      accessibilite: formData.accessibilite,
      equipements: formData.equipements
    })
    .select()

  if (terrainError) {
    console.error("Erreur détaillée lors de l'insertion:", terrainError)
    throw new Error('Erreur lors de l\'ajout du terrain: ' + terrainError.message)
  }

  if (!terrain || terrain.length === 0) {
    throw new Error('Erreur lors de l\'ajout du terrain: aucune donnée retournée')
  }

  return "Parcelle ajoutée avec succès!"
}