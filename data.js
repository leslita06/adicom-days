/* ADICOM Days · données partagées (site d'inscription et appli participant)
   Programme, intervenants et participants : contenus d'illustration, en attendant l'annonce officielle. */
var ADC = {
  edition: '11e édition',
  places: 1500,
  tracks: {
    'Scène': '#964C97',
    'IA': '#B6D401',
    'Influence': '#FF8A3D',
    'Business': '#2EC4B6',
    'Atelier': '#4D8BFF',
    'Réseau': '#E84A8A'
  },
  /* [id, jour, début, fin, titre, piste, salle, intervenants (index SPK), description] */
  sessions: [
    ['s1', 1, '08:30', '09:30', 'Accueil, café et retrait des badges', 'Réseau', 'Hall', [], 'Présentez votre billet QR à l\'entrée : contrôle en quelques secondes.'],
    ['s2', 1, '09:30', '10:15', 'Ouverture : dix ans de digital africain, et après ?', 'Scène', 'Grande scène', [0], 'Le mot d\'ouverture et les grandes tendances de l\'année.'],
    ['s3', 1, '10:30', '11:30', 'IA générative : créer plus vite sans perdre sa voix', 'IA', 'Grande scène', [1, 2], 'Ce que l\'IA change dans la production de contenu, cas concrets à l\'appui.'],
    ['s4', 1, '10:30', '11:30', 'Social commerce : vendre sur WhatsApp et TikTok', 'Business', 'Salle Lagune', [3], 'Du message au paiement mobile : les parcours qui convertissent.'],
    ['s5', 1, '11:45', '12:45', 'Panel : les marques face aux créateurs', 'Influence', 'Grande scène', [4, 5, 6], 'Brief, rémunération, mesure : ce que chacun attend vraiment de l\'autre.'],
    ['s6', 1, '12:45', '14:00', 'Déjeuner et rendez-vous d\'affaires', 'Réseau', 'Jardin', [], 'Vos rendez-vous confirmés dans l\'appli sont rappelés 10 minutes avant.'],
    ['s7', 1, '14:00', '17:00', 'Atelier : écrire un brief créatif qui marche', 'Atelier', 'Salle Atelier', [7], 'En petit groupe, de la promesse au livrable, sur un cas réel.'],
    ['s8', 1, '14:15', '15:15', 'Mesurer l\'influence : au-delà des likes', 'Influence', 'Salle Lagune', [5], 'Les indicateurs qui comptent pour un annonceur.'],
    ['s9', 1, '15:30', '16:30', 'Fintech et confiance : parler d\'argent en ligne', 'Business', 'Grande scène', [8, 3], 'Comment les marques financières gagnent la confiance du public digital.'],
    ['s10', 1, '19:00', '22:00', 'Soirée des ADICOM Days Awards', 'Scène', 'Grande scène', [0], 'Remise des prix de la créativité, du talent et de l\'innovation.'],
    ['s11', 2, '09:00', '09:45', 'Keynote : le contenu africain qui s\'exporte', 'Scène', 'Grande scène', [9], 'Séries, musique, humour : ce qui fait voyager une création.'],
    ['s12', 2, '10:00', '11:00', 'Marque employeur : recruter grâce aux réseaux', 'Business', 'Salle Lagune', [10], 'LinkedIn, TikTok, vidéos d\'équipe : ce qui attire les talents.'],
    ['s13', 2, '10:00', '11:00', 'Vidéo courte : les formats qui retiennent', 'IA', 'Grande scène', [2, 11], 'Accroche, rythme, sous-titres : décryptage de formats gagnants.'],
    ['s14', 2, '11:15', '12:15', 'Panel : créateurs, vivre de son contenu', 'Influence', 'Grande scène', [4, 6, 11], 'Revenus, contrats, indépendance : témoignages et conseils.'],
    ['s15', 2, '12:15', '13:30', 'Déjeuner et speed networking', 'Réseau', 'Jardin', [], 'Six rencontres de 8 minutes, proposées selon vos centres d\'intérêt.'],
    ['s16', 2, '13:30', '16:30', 'Atelier : tourner et monter au téléphone', 'Atelier', 'Salle Atelier', [7, 11], 'Prise de vue, son, montage : repartez avec une vidéo prête.'],
    ['s17', 2, '14:00', '15:00', 'Podcast et audio : la nouvelle voix des marques', 'Influence', 'Salle Lagune', [9], 'Lancer, produire et faire écouter un podcast de marque.'],
    ['s18', 2, '15:30', '16:30', 'Clôture : les engagements de la 11e édition', 'Scène', 'Grande scène', [0, 1], 'Ce que l\'écosystème retient, et le rendez-vous suivant.']
  ],
  /* Profils d'illustration : aucun nom, le rôle seulement. */
  speakers: [
    ['Fondateur de l\'événement', 'Organisation ADICOM', 'Scène'],
    ['Directrice de l\'innovation', 'Groupe télécom panafricain', 'IA'],
    ['Réalisateur et créateur IA', 'Studio de contenu, Abidjan', 'IA'],
    ['Fondatrice e-commerce', 'Marque de mode en ligne', 'Business'],
    ['Créatrice de contenu', '1,2 M d\'abonnés, lifestyle', 'Influence'],
    ['Directeur marketing', 'Marque de grande consommation', 'Influence'],
    ['Humoriste et créateur', 'Comédie et sketchs vidéo', 'Influence'],
    ['Directrice de création', 'Agence de communication', 'Atelier'],
    ['Directeur général', 'Fintech de paiement mobile', 'Business'],
    ['Productrice de séries', 'Plateforme de streaming', 'Scène'],
    ['DRH', 'Groupe bancaire régional', 'Business'],
    ['Vidéaste et formateur', 'Contenu court, 600 k abonnés', 'IA']
  ],
  /* Participants d'illustration pour la mise en relation (prénom et initiale). */
  people: [
    ['Aïcha K.', 'Créatrice de contenu', 'Beauté et lifestyle', ['Influence', 'Vidéo'], 96],
    ['Serge D.', 'Responsable marketing', 'Marque de boissons', ['Influence', 'Social commerce'], 92],
    ['Fatou N.', 'Fondatrice', 'Startup de livraison', ['Social commerce', 'Fintech'], 88],
    ['Yannick B.', 'Directeur conseil', 'Agence digitale', ['IA', 'Marque employeur'], 85],
    ['Mariam T.', 'Chargée de communication', 'Banque', ['Fintech', 'Marque employeur'], 83],
    ['Kevin A.', 'Monteur vidéo', 'Indépendant', ['Vidéo', 'IA'], 81],
    ['Grâce O.', 'Community manager', 'Télécom', ['Influence', 'IA'], 78],
    ['Ibrahim S.', 'Product manager', 'Fintech', ['Fintech', 'IA'], 74],
    ['Nadège L.', 'Journaliste', 'Média en ligne', ['Vidéo', 'Influence'], 71],
    ['Christian M.', 'Étudiant en communication', 'École de commerce', ['IA', 'Vidéo'], 66]
  ],
  rooms: {
    'Grande scène': 'Niveau 0, salle principale',
    'Salle Lagune': 'Niveau 1, à gauche de l\'escalier',
    'Salle Atelier': 'Niveau 1, au fond du couloir',
    'Jardin': 'Extérieur, derrière le hall',
    'Hall': 'Entrée principale'
  }
};
