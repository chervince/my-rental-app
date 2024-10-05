//app/utils/createUser.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function createUser(userId: string, email: string) {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase
    .from('utilisateurs')
    .insert([
      { id: userId, email: email }
    ])
    .select()

  if (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error)
    throw error
  }

  return data
}