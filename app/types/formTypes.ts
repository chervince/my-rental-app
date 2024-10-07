// app/types/formTypes.ts

export type FormData = {
  titre: string
  description: string
  emplacement: string
  latitude: string
  longitude: string
  prix_par_jour: string
  date_disponibilite_debut: string
  date_disponibilite_fin: string
  capacite_max: string
}

export type Terrain = {
  id: string
  titre: string
  description?: string // Rendu optionnel
  emplacement: string
  latitude: number
  longitude: number
  prix_par_jour: number
  date_disponibilite_debut: string
  date_disponibilite_fin: string
  capacite_max: number
  proprietaire_id: string
  politique_annulation_id?: string | null // Rendu optionnel
  date_creation: string
  image_mise_en_avant_id?: string | null // Rendu optionnel
  images?: Image[]
  image_mise_en_avant?: Image | null
}

export type Image = {
  id: string
  terrain_id: string | null
  url: string
  legende: string | null
  ordre_affichage: number | null
  date_creation: string
}