/**
 * Identité de l'éditeur, injectée dans les pages légales.
 * À COMPLÉTER avec les informations réelles de la société (aucune valeur n'est
 * inventée : un champ vide s'affiche « [à renseigner] » dans les pages).
 */
export const LEGAL_ENTITY: Record<string, string> = {
  name: '',            // Raison sociale
  legalForm: '',       // Forme juridique (SARL, SAS, ...)
  capital: '',         // Capital social
  rccm: '',            // N° RCCM
  address: '',         // Adresse postale complète du siège
  email: 'contact@global-af.ci', // Adresse déjà affichée dans le pied de page
  phone: '',
  director: '',        // Directeur de la publication
  dpoEmail: '',        // Correspondant à la protection des données personnelles
  artciRef: '',        // N° de déclaration / d'autorisation ARTCI du traitement
  dataLocation: '',    // Lieu d'hébergement de la base de données (région Firebase)
  jurisdiction: '',    // Tribunal compétent
  retentionAccount: '',    // Conservation des données du compte après clôture
  retentionAccounting: '', // Conservation des pièces comptables et financières
  retentionLogs: '',       // Conservation des journaux de sécurité
};

/**
 * Passer à `true` UNIQUEMENT après validation des textes par un conseil
 * juridique : cela retire le bandeau « version provisoire ».
 */
export const LEGAL_REVIEWED = false;

/** Date de la version des textes (à mettre à jour à chaque modification). */
export const LEGAL_VERSION_DATE = '30 octobre 2026';
