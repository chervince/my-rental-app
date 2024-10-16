// app/types/formTypes.ts

export type FormData = {
  titre: string;
  description: string;
  emplacement: string;
  prix_par_jour: string;
}

export type Image = {
  id: string
  terrain_id: string | null
  url: string
  legende: string | null
  ordre_affichage: number | null
  date_creation: string
}