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
    infos_generales: {
      superficie: string
      type_terrain: string[]
      type_sol: string[]
      environnement: string[]
      vues: string[]
    }
    accessibilite: {
      types_acces: string[]
      parking: {
        type: string
        details: string
      }
      chemin_acces: string[]
      distance_route_principale: string
    }
    equipements: {
      eau: {
        disponible: boolean
        type: string
      }
      electricite: {
        disponible: boolean
        caracteristiques: string[]
      }
      toilettes: {
        disponible: boolean
        type: string[]
      }
      douches: {
        disponible: boolean
        type: string[]
      }
      cuisine: string[]
      abri: string[]
      mobilier_exterieur: string[]
      feu_camp: {
        autorise: boolean
        bois_fourni: boolean
      }
      internet: {
        wifi: boolean
        reseau_mobile: boolean
      }
      gestion_dechets: string[]
    }
  }