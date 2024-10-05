//utils/userManagement.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function ensureUserInCustomTable() {
  const supabase = createClientComponentClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error("Erreur d'authentification:", userError)
    throw new Error("Vous devez être connecté.")
  }

  const { data: existingUser, error: existingUserError } = await supabase
    .from('utilisateurs')
    .select('id')
    .eq('id', user.id)
    .single()

  if (existingUserError && existingUserError.code !== 'PGRST116') {
    console.error("Erreur lors de la vérification de l'utilisateur:", existingUserError)
    throw new Error("Une erreur s'est produite lors de la vérification de votre compte.")
  }

  if (!existingUser) {
    const { error: insertError } = await supabase
      .from('utilisateurs')
      .insert([
        { id: user.id, email: user.email }
      ])

    if (insertError) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", insertError)
      throw new Error("Impossible de créer votre compte utilisateur.")
    }

    console.log("Nouvel utilisateur ajouté à la table personnalisée")
  } else {
    console.log("L'utilisateur existe déjà dans la table personnalisée")
  }
}