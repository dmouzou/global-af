/**
 * Client minimal de l'API Gemini (REST) — Google AI : generateContent.
 * Les modèles Gemini sont renouvelés et retirés régulièrement : la liste des
 * modèles est configurable (GEMINI_MODEL, séparés par des virgules) et le
 * client passe au suivant si un modèle n'est plus disponible.
 *
 * Variables d'environnement : GEMINI_API_KEY (obligatoire), GEMINI_MODEL
 * (facultatif). Jamais de clé dans le code.
 */
import {DomainError} from "../../domain/errors";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

/** Modèles essayés dans l'ordre (à ajuster selon la page officielle des modèles). */
export const DEFAULT_GEMINI_MODELS = [
  "gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite",
  "gemini-2.5-flash-lite",
];

export interface GeminiOptions {
  apiKey?: string;
  models?: string[];
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export interface GeminiResult {
  text: string;
  model: string;
}

let workingModel: string | null = null;

export class GeminiClient {
  private readonly apiKey: string;
  private readonly models: string[];
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: GeminiOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.GEMINI_API_KEY ?? "";
    const fromEnv = (process.env.GEMINI_MODEL ?? "").split(",")
      .map((m) => m.trim()).filter(Boolean);
    this.models = options.models ??
      (fromEnv.length > 0 ? fromEnv : DEFAULT_GEMINI_MODELS);
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 30000;
  }

  /** @return {boolean} true si une clé API est configurée. */
  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  /**
   * Génère un texte.
   * @param {object} req Consignes système et message utilisateur.
   * @return {Promise<GeminiResult>} Texte et modèle utilisé.
   */
  async generate(req: {system: string; user: string; temperature?: number;
    maxOutputTokens?: number}): Promise<GeminiResult> {
    if (!this.isConfigured()) {
      throw new DomainError("ai_not_configured",
        "L'assistant IA n'est pas encore configuré.");
    }
    // Le dernier modèle qui a fonctionné est réessayé en premier.
    const order = workingModel && this.models.includes(workingModel) ?
      [workingModel, ...this.models.filter((m) => m !== workingModel)] :
      this.models;
    let unavailable = 0;
    for (const model of order) {
      const outcome = await this.callModel(model, req);
      if (outcome === "model_unavailable") {
        unavailable++;
        continue;
      }
      workingModel = model;
      return {text: outcome, model};
    }
    console.error("Gemini : aucun modèle disponible", unavailable, order);
    throw new DomainError("ai_unavailable",
      "L'assistant IA est momentanément indisponible. Réessayez plus tard.");
  }

  private async callModel(model: string, req: {
    system: string; user: string; temperature?: number;
    maxOutputTokens?: number;
  }): Promise<string | "model_unavailable"> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await this.fetchImpl(
        `${API_BASE}/${encodeURIComponent(model)}:generateContent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": this.apiKey,
          },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: {parts: [{text: req.system}]},
            contents: [{role: "user", parts: [{text: req.user}]}],
            generationConfig: {
              temperature: req.temperature ?? 0.7,
              // Marge pour les jetons de réflexion des modèles récents.
              maxOutputTokens: req.maxOutputTokens ?? 2048,
            },
          }),
        });
      if (res.status === 404) return "model_unavailable";
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        // Modèle retiré/inconnu signalé en 400 par certaines versions de l'API.
        if (res.status === 400 && /not found|no longer available|not supported/i
          .test(detail)) return "model_unavailable";
        console.error("Gemini erreur", model, res.status, detail.slice(0, 300));
        throw new DomainError("ai_unavailable",
          "L'assistant IA est momentanément indisponible. Réessayez plus tard.");
      }
      const json = await res.json() as {
        promptFeedback?: {blockReason?: string};
        candidates?: Array<{
          finishReason?: string;
          content?: {parts?: Array<{text?: string; thought?: boolean}>};
        }>;
      };
      if (json.promptFeedback?.blockReason) {
        throw new DomainError("ai_blocked",
          "Cette demande ne peut pas être traitée. Reformulez-la.");
      }
      const cand = json.candidates?.[0];
      const text = (cand?.content?.parts ?? [])
        .filter((p) => !p.thought).map((p) => p.text ?? "").join("").trim();
      if (!text) {
        throw new DomainError(
          cand?.finishReason === "SAFETY" ? "ai_blocked" : "ai_empty",
          cand?.finishReason === "SAFETY" ?
            "Cette demande ne peut pas être traitée. Reformulez-la." :
            "L'assistant n'a pas pu produire de réponse. Réessayez.");
      }
      return text;
    } catch (err) {
      if (err instanceof DomainError) throw err;
      console.error("Gemini appel échoué", model, err);
      throw new DomainError("ai_unavailable",
        "L'assistant IA est momentanément indisponible. Réessayez plus tard.");
    } finally {
      clearTimeout(timer);
    }
  }
}

/** Réinitialise le modèle mémorisé (tests). */
export function resetGeminiModelCache(): void {
  workingModel = null;
}
