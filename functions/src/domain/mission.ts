import {DomainError} from "./errors";
import {assertPositiveInt} from "./money";
import {AccessPlan} from "./subscription";

/**
 * Micro-jobs et missions (cahier des charges, sections 10 et 11).
 * Workflow : Brouillon → Publication → Participation → Soumission →
 * Vérification → Validation ou refus → Récompense.
 * Les récompenses sont fixes et publiées à l'avance (section 15 : jamais de
 * hasard). Tous les montants sont des entiers (XOF).
 */

export const MISSION_CATEGORIES = [
  "survey", "app_test", "social_visit", "content_review",
  "partner_campaign", "quiz_challenge",
] as const;
export type MissionCategory = typeof MISSION_CATEGORIES[number];

export const MISSION_STATUSES =
  ["draft", "published", "paused", "archived"] as const;
export type MissionStatus = typeof MISSION_STATUSES[number];

export const VERIFICATION_TYPES = ["automatic", "manual", "hybrid"] as const;
export type VerificationType = typeof VERIFICATION_TYPES[number];

export const MEMBER_LEVELS =
  ["Starter", "Bronze", "Silver", "Gold", "Platinum"] as const;
export type MemberLevel = typeof MEMBER_LEVELS[number];

export const PROOF_TYPES = ["url", "text", "screenshot"] as const;
export type ProofType = typeof PROOF_TYPES[number];

export type SubmissionStatus = "pending" | "approved" | "rejected";

export const TARGET_PLATFORMS =
  ["Web", "YouTube", "TikTok", "PlayStore", "Autre"] as const;
export type TargetPlatform = typeof TARGET_PLATFORMS[number];

/** Garde-fous de saisie (valeurs de sécurité, pas des règles commerciales). */
export const MIN_REWARD = 100;
export const MAX_REWARD = 1_000_000;
export const MAX_QUOTA = 1_000_000;

export interface MissionInput {
  title: string;
  category: MissionCategory;
  description: string;
  instructions: string[];
  rewardAmount: number;
  quotaMax: number;
  requiredLevel: MemberLevel;
  countries: string[];
  isPremiumOnly: boolean;
  startDate: string;
  endDate: string;
  targetPlatform?: TargetPlatform;
  targetUrl?: string;
  verificationType: VerificationType;
  /** Code de fin à saisir (obligatoire en vérification automatique/hybride). */
  completionCode?: string;
  status: MissionStatus;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CODE_RE = /^[A-Za-z0-9-]{8,40}$/;

/** @return {boolean} true si la chaîne est une date AAAA-MM-JJ réelle. */
export function isIsoDate(s: unknown): s is string {
  if (typeof s !== "string" || !DATE_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function oneOf<T extends string>(list: readonly T[], v: unknown,
  label: string): T {
  if (typeof v !== "string" || !(list as readonly string[]).includes(v)) {
    throw new DomainError("invalid_mission", `${label} invalide.`);
  }
  return v as T;
}

function text(v: unknown, label: string, min: number, max: number): string {
  if (typeof v !== "string") {
    throw new DomainError("invalid_mission", `${label} requis.`);
  }
  const t = v.trim();
  if (t.length < min || t.length > max) {
    throw new DomainError("invalid_mission",
      `${label} : entre ${min} et ${max} caractères.`);
  }
  return t;
}

/**
 * Valide et normalise une mission saisie par le back-office.
 * @param {unknown} raw Données brutes.
 * @return {MissionInput} Mission normalisée.
 */
export function validateMissionInput(raw: unknown): MissionInput {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new DomainError("invalid_mission", "Mission invalide.");
  }
  const r = raw as Record<string, unknown>;
  const title = text(r.title, "Titre", 5, 120);
  const description = text(r.description, "Description", 10, 1000);
  const category = oneOf(MISSION_CATEGORIES, r.category, "Catégorie");
  const verificationType =
    oneOf(VERIFICATION_TYPES, r.verificationType, "Vérification");
  const requiredLevel = oneOf(MEMBER_LEVELS, r.requiredLevel, "Niveau");
  const status = oneOf(MISSION_STATUSES, r.status, "Statut");

  if (!Array.isArray(r.instructions) || r.instructions.length < 1 ||
    r.instructions.length > 10) {
    throw new DomainError("invalid_mission",
      "Entre 1 et 10 consignes sont requises.");
  }
  const instructions = r.instructions.map((i, idx) =>
    text(i, `Consigne ${idx + 1}`, 3, 300));

  const rewardAmount = assertPositiveInt(r.rewardAmount, "montant");
  if (rewardAmount < MIN_REWARD || rewardAmount > MAX_REWARD) {
    throw new DomainError("invalid_mission",
      `Récompense : entre ${MIN_REWARD} et ${MAX_REWARD}.`);
  }
  const quotaMax = assertPositiveInt(r.quotaMax, "quota");
  if (quotaMax > MAX_QUOTA) {
    throw new DomainError("invalid_mission", "Quota trop élevé.");
  }

  if (!Array.isArray(r.countries) || r.countries.length < 1 ||
    r.countries.length > 50 ||
    !r.countries.every((c) => typeof c === "string" &&
      /^[A-Z]{2}$/.test(c))) {
    throw new DomainError("invalid_mission",
      "Pays invalides (codes ISO à deux lettres majuscules).");
  }
  const countries = [...new Set(r.countries as string[])];

  if (!isIsoDate(r.startDate) || !isIsoDate(r.endDate)) {
    throw new DomainError("invalid_mission",
      "Dates invalides (AAAA-MM-JJ).");
  }
  if (r.endDate < r.startDate) {
    throw new DomainError("invalid_mission",
      "La date de fin précède la date de début.");
  }

  let targetUrl: string | undefined;
  if (r.targetUrl !== undefined && r.targetUrl !== null &&
    r.targetUrl !== "") {
    targetUrl = text(r.targetUrl, "Lien", 8, 500);
    let u: URL;
    try {
      u = new URL(targetUrl);
    } catch {
      throw new DomainError("invalid_mission", "Lien invalide.");
    }
    if (u.protocol !== "https:") {
      throw new DomainError("invalid_mission",
        "Le lien doit commencer par https://.");
    }
  }
  let targetPlatform: TargetPlatform | undefined;
  if (r.targetPlatform !== undefined && r.targetPlatform !== null &&
    r.targetPlatform !== "") {
    targetPlatform = oneOf(TARGET_PLATFORMS, r.targetPlatform, "Plateforme");
  }

  let completionCode: string | undefined;
  if (verificationType !== "manual") {
    if (typeof r.completionCode !== "string" ||
      !CODE_RE.test(r.completionCode.trim())) {
      throw new DomainError("invalid_mission",
        "Un code de fin (8 à 40 caractères : lettres, chiffres, tirets) " +
        "est obligatoire en vérification automatique ou hybride.");
    }
    completionCode = r.completionCode.trim();
  }

  return {
    title, category, description, instructions, rewardAmount, quotaMax,
    requiredLevel, countries, isPremiumOnly: r.isPremiumOnly === true,
    startDate: r.startDate, endDate: r.endDate, targetPlatform, targetUrl,
    verificationType, completionCode, status,
  };
}

/** Rang d'un niveau (Starter = 0). */
export function levelRank(level: string): number {
  const i = (MEMBER_LEVELS as readonly string[]).indexOf(level);
  return i < 0 ? 0 : i;
}

export interface MissionForEligibility {
  status: MissionStatus;
  startDate: string;
  endDate: string;
  countries: string[];
  requiredLevel: string;
  isPremiumOnly: boolean;
  quotaMax: number;
  quotaCurrent: number;
}

export interface MemberForEligibility {
  status: string;
  country: string;
  level: string;
  isActivated: boolean;
  plan: AccessPlan;
}

/**
 * Un membre peut-il participer maintenant ? Lève une erreur métier claire
 * sinon. Les missions exigent un Pass actif (décision produit du propriétaire).
 * @param {MissionForEligibility} m Mission.
 * @param {MemberForEligibility} u Membre (accès déjà résolu).
 * @param {Date} now Instant courant.
 */
export function assertEligible(m: MissionForEligibility,
  u: MemberForEligibility, now: Date): void {
  if (u.status !== "active") {
    throw new DomainError("account_not_active",
      "Votre compte ne permet pas de participer pour le moment.");
  }
  if (!u.isActivated) {
    throw new DomainError("activation_required",
      "Les missions nécessitent un Pass actif. Activez ou renouvelez " +
      "votre Pass depuis votre espace.");
  }
  if (m.status !== "published") {
    throw new DomainError("mission_unavailable",
      "Cette mission n'est pas ouverte.");
  }
  const today = now.toISOString().slice(0, 10);
  if (today < m.startDate) {
    throw new DomainError("mission_not_started",
      "Cette mission n'a pas encore commencé.");
  }
  if (today > m.endDate) {
    throw new DomainError("mission_ended", "Cette mission est terminée.");
  }
  if (!m.countries.includes(u.country.toUpperCase())) {
    throw new DomainError("country_not_eligible",
      "Cette mission n'est pas ouverte dans votre pays.");
  }
  if (levelRank(u.level) < levelRank(m.requiredLevel)) {
    throw new DomainError("level_too_low",
      `Cette mission demande le niveau ${m.requiredLevel}.`);
  }
  if (m.isPremiumOnly && u.plan !== "premium" && u.plan !== "business") {
    throw new DomainError("premium_required",
      "Cette mission est réservée aux abonnés Premium et Business.");
  }
  if (m.quotaCurrent >= m.quotaMax) {
    throw new DomainError("quota_reached",
      "Le quota de participants est atteint.");
  }
}

/**
 * Contrôle et normalise une preuve.
 * @param {string} type Type de preuve.
 * @param {string} content Contenu (lien https, texte, ou chemin de stockage).
 * @param {string} uid Membre (une capture doit être dans son dossier).
 * @return {object} Preuve normalisée.
 */
export function validateProof(type: unknown, content: unknown, uid: string):
  {type: ProofType; content: string} {
  const t = oneOf(PROOF_TYPES, type, "Type de preuve");
  if (typeof content !== "string") {
    throw new DomainError("invalid_proof", "Preuve requise.");
  }
  const c = content.trim();
  if (t === "text") {
    if (c.length < 3 || c.length > 2000) {
      throw new DomainError("invalid_proof",
        "Le texte doit faire entre 3 et 2000 caractères.");
    }
  } else if (t === "url") {
    let u: URL;
    try {
      u = new URL(c);
    } catch {
      throw new DomainError("invalid_proof", "Lien invalide.");
    }
    if (u.protocol !== "https:" || c.length > 500) {
      throw new DomainError("invalid_proof",
        "Le lien doit commencer par https:// (500 caractères maximum).");
    }
  } else {
    const prefix = `proofs/${uid}/`;
    if (!c.startsWith(prefix) || c.length > 300 ||
      c.slice(prefix.length).includes("/") || c.includes("..")) {
      throw new DomainError("invalid_proof", "Capture d'écran invalide.");
    }
  }
  return {type: t, content: c};
}

/**
 * Décision de vérification à la soumission.
 * - manuel : toujours en attente de revue ;
 * - automatique : validé seulement si le code de fin est exact (sinon l'envoi
 *   est refusé sans consommer de participation) ;
 * - hybride : validé si le code est exact, sinon en attente de revue.
 * @param {VerificationType} type Mode de vérification.
 * @param {string|undefined} expectedCode Code attendu (côté serveur).
 * @param {string} proof Preuve soumise (texte).
 * @return {SubmissionStatus} "approved" ou "pending".
 */
export function decideOnSubmit(type: VerificationType,
  expectedCode: string | undefined, proof: string): SubmissionStatus {
  if (type === "manual") return "pending";
  const ok = !!expectedCode && proof.trim().toLowerCase() ===
    expectedCode.toLowerCase();
  if (ok) return "approved";
  if (type === "hybrid") return "pending";
  throw new DomainError("wrong_completion_code",
    "Le code de fin est incorrect.");
}

const TRANSITIONS: Record<SubmissionStatus, SubmissionStatus[]> = {
  pending: ["approved", "rejected"],
  approved: [],
  rejected: [],
};

/** Une revue ne peut s'appliquer qu'à une soumission en attente. */
export function assertSubmissionTransition(from: SubmissionStatus,
  to: SubmissionStatus): void {
  if (!TRANSITIONS[from]?.includes(to)) {
    throw new DomainError("invalid_transition",
      "Cette participation a déjà été traitée.");
  }
}

/** Identifiant déterministe : une seule participation par membre et mission. */
export function submissionId(missionId: string, uid: string): string {
  return `${missionId}_${uid}`;
}

/** Rôles autorisés à gérer les missions / relire les preuves. */
export function canManageMissions(role: string): boolean {
  return ["content_manager", "admin", "super_admin"].includes(role);
}
export function canReviewSubmissions(role: string): boolean {
  return ["moderator", "content_manager", "admin", "super_admin"]
    .includes(role);
}
