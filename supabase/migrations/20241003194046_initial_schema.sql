-- Création des types enum
CREATE TYPE type_utilisateur AS ENUM ('locataire', 'proprietaire');
CREATE TYPE statut_reservation AS ENUM ('en_attente', 'confirmee', 'annulee');
CREATE TYPE methode_paiement AS ENUM ('carte_bancaire', 'virement', 'especes');
CREATE TYPE statut_paiement AS ENUM ('en_attente', 'complete', 'rembourse', 'echoue');
CREATE TYPE categorie_equipement AS ENUM ('base', 'confort', 'luxe', 'activite');

-- Table des utilisateurs
CREATE TABLE utilisateurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    nom_complet TEXT NOT NULL,
    type_utilisateur type_utilisateur NOT NULL,
    telephone TEXT,
    photo_profil TEXT,
    est_verifie BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    stripe_customer_id TEXT,
    CONSTRAINT email_valide CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Table des politiques d'annulation
CREATE TABLE politiques_annulation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    description TEXT,
    periode_annulation_gratuite INTEGER,
    pourcentage_frais_annulation DECIMAL(5,2),
    conditions_specifiques JSONB,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- Table des terrains
CREATE TABLE terrains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proprietaire_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    politique_annulation_id UUID REFERENCES politiques_annulation(id),
    titre TEXT NOT NULL,
    description TEXT,
    emplacement TEXT NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    prix_par_jour DECIMAL(10,2) NOT NULL,
    date_disponibilite_debut DATE,
    date_disponibilite_fin DATE,
    capacite_max INTEGER,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT coordonnees_valides CHECK (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180)
);

-- Table des détails des terrains
CREATE TABLE details_terrains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    terrain_id UUID UNIQUE REFERENCES terrains(id) ON DELETE CASCADE,
    infos_generales JSONB,
    accessibilite JSONB,
    equipements JSONB,
    activites JSONB,
    regles JSONB,
    securite JSONB,
    caracteristiques_accessibilite JSONB,
    services_supplementaires JSONB,
    durabilite JSONB,
    langues JSONB,
    infos_complementaires JSONB,
    mesures_covid JSONB,
    options_reservation JSONB,
    date_mise_a_jour TIMESTAMPTZ DEFAULT NOW()
);

-- Table des réservations
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    terrain_id UUID REFERENCES terrains(id) ON DELETE CASCADE,
    locataire_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut statut_reservation DEFAULT 'en_attente',
    nombre_invites INTEGER,
    demandes_speciales TEXT,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_annulation TIMESTAMPTZ,
    CONSTRAINT dates_valides CHECK (date_fin > date_debut)
);

-- Table des avis (modifiée)
CREATE TABLE avis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    note INTEGER NOT NULL,
    commentaire TEXT,
    categories_notation JSONB,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT note_valide CHECK (note BETWEEN 1 AND 5)
);

-- Fonction pour vérifier si la réservation est terminée
CREATE OR REPLACE FUNCTION verifier_reservation_terminee()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM reservations r
        WHERE r.id = NEW.reservation_id AND r.date_fin < CURRENT_DATE
    ) THEN
        RAISE EXCEPTION 'La réservation doit être terminée pour laisser un avis';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour vérifier la condition avant l'insertion d'un avis
CREATE TRIGGER verifier_avis_reservation_terminee
BEFORE INSERT ON avis
FOR EACH ROW
EXECUTE FUNCTION verifier_reservation_terminee();

-- Table des images
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    terrain_id UUID REFERENCES terrains(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    legende TEXT,
    ordre_affichage INTEGER,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- Table des équipements
CREATE TABLE equipements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    description TEXT,
    icone TEXT,
    categorie categorie_equipement
);

-- Table de liaison terrains-équipements
CREATE TABLE terrains_equipements (
    terrain_id UUID REFERENCES terrains(id) ON DELETE CASCADE,
    equipement_id UUID REFERENCES equipements(id) ON DELETE CASCADE,
    PRIMARY KEY (terrain_id, equipement_id)
);

-- Table des paiements
CREATE TABLE paiements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    montant DECIMAL(10,2) NOT NULL,
    statut statut_paiement DEFAULT 'en_attente',
    methode_paiement methode_paiement,
    details_paiement JSONB,
    date_paiement TIMESTAMPTZ,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    stripe_payment_intent_id TEXT
);

-- Table des messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expediteur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    destinataire_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    terrain_id UUID REFERENCES terrains(id) ON DELETE SET NULL,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    contenu TEXT NOT NULL,
    est_lu BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- Table des notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    contenu TEXT NOT NULL,
    type TEXT NOT NULL,
    est_lu BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_terrains_proprietaire ON terrains(proprietaire_id);
CREATE INDEX idx_reservations_terrain ON reservations(terrain_id);
CREATE INDEX idx_reservations_locataire ON reservations(locataire_id);
CREATE INDEX idx_messages_expediteur ON messages(expediteur_id);
CREATE INDEX idx_messages_destinataire ON messages(destinataire_id);
CREATE INDEX idx_notifications_utilisateur ON notifications(utilisateur_id);

-- Exemple de structure JSON pour details_terrains
COMMENT ON COLUMN details_terrains.infos_generales IS
$comment$
{
  "superficie": "500-1000",
  "type_terrain": ["plat", "legerement_vallonne"],
  "type_sol": ["herbe", "sable"],
  "environnement": ["foret", "montagne"],
  "vues": ["vue_montagne", "vue_foret"]
}
$comment$;

COMMENT ON COLUMN details_terrains.accessibilite IS
$comment$
{
  "types_acces": ["voiture", "camping_car", "velo"],
  "parking": {
    "type": "sur_place",
    "details": "Parking pour 5 véhicules"
  },
  "chemin_acces": ["route_goudronnee", "chemin_gravier"],
  "distance_route_principale": "<500m"
}
$comment$;

COMMENT ON COLUMN details_terrains.equipements IS
$comment$
{
  "eau": {
    "disponible": true,
    "type": "potable"
  },
  "electricite": {
    "disponible": true,
    "caracteristiques": ["prises", "recharge_appareils"]
  },
  "toilettes": {
    "disponible": true,
    "type": ["a_chasse", "seches"]
  },
  "douches": {
    "disponible": true,
    "type": ["chaude", "froide"]
  },
  "cuisine": ["barbecue", "espace_feu_camp", "ustensiles"],
  "abri": ["espace_couvert", "pergola"],
  "mobilier_exterieur": ["tables", "chaises", "hamacs"],
  "feu_camp": {
    "autorise": true,
    "bois_fourni": true
  },
  "internet": {
    "wifi": true,
    "reseau_mobile": true
  },
  "gestion_dechets": ["poubelles", "recyclage", "compostage"]
}
$comment$;