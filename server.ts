import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1); // derrière Cloud Run / un proxy : IP réelle du client

// En-têtes de sécurité (section 26). La CSP est désactivée en développement
// car Vite injecte des scripts ; elle sera définie avec le déploiement final.
app.use(helmet({ contentSecurityPolicy: false }));

// Corps de requête borné : évite l'envoi de gros historiques (coût Gemini).
app.use(express.json({ limit: '16kb' }));

// Limitation de débit des routes IA : les endpoints sont publics et
// chaque appel consomme le quota Gemini.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes. Réessayez dans une minute.' },
});
app.use('/api/', aiLimiter);

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1000;

// Valide et normalise un historique de conversation envoyé par le client :
// nombre et taille bornés, rôles restreints à user/assistant.
function sanitizeMessages(raw: unknown): { role: 'user' | 'assistant'; content: string }[] | null {
  if (!Array.isArray(raw)) return null;
  const out: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || typeof m.content !== 'string') return null;
    const content = m.content.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!content) return null;
    out.push({ role: m.role === 'user' ? 'user' : 'assistant', content });
  }
  return out;
}

// Initialize Gemini API client on server-side as mandated by gemini-api skill
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const GLOBAL_AF_SYSTEM_INSTRUCTION = `Tu es le Chatbot Informationnel officiel et expert de la plateforme GLOBAL-AF en Côte d'Ivoire et Afrique de l'Ouest.
Ta mission est d'informer avec précision, clarté et professionnalisme sur l'ensemble du fonctionnement, des opportunités et des règles de GLOBAL-AF.

DONNÉES CLÉS ET RÈGLES DE LA PLATEFORME :
1. MICRO-JOBS & MISSIONS RÉMUNÉRÉES :
   - Missions concrètes et vérifiées : sondages d'opinion, tests d'applications locales ivoiriennes, revues de contenu, micro-tâches professionnelles.
   - Rémunération nette et prévisible créditée sur le solde dès complétion sans tirage au sort.

2. PAIEMENTS & RETRAITS MOBILE MONEY :
   - Opérateurs partenaires intégrés : Wave (1% de frais), Orange Money, MTN MoMo, Moov Africa Côte d'Ivoire.
   - Retraits possibles dès 2 000 FCFA de solde disponible.
   - Opérations instantanées et auditées.

3. RÈGLES DE RÉMUNÉRATION DES PARRAINS :
   - Niveau 1 (Parrainage direct) : 15% de commission nette sur chaque vente réelle de packs ou formations.
   - Niveau 2 (Parrainage indirect) : 5% de commission nette sur les achats réalisés par les filleuls de votre niveau 1.
   - Zéro commission sur la simple inscription : l'inscription est 100% gratuite et sans obligation d'achat.
   - Plafonnement strict à 2 niveaux maximum.

4. DÉLAI DE RÉTRACTATION :
   - Délai légal et garanti de 7 jours (calendaires) pour toute souscription payante.
   - Remboursement intégral garanti par Mobile Money sous 48h en un clic depuis l'espace membre.

5. ÉTHIQUE & SÉCURITÉ :
   - Zéro jeu de hasard, zéro promesse de gains passifs ou irréalistes.
   - Palier gratuit pérenne et réellement utile.
   - Conformité ARTCI et respect strict des données personnelles en Côte d'Ivoire.

6. DIGITAL ACADEMY & OUTILS :
   - Formations pratiques certifiantes (WhatsApp Business, Prospection locale, Outils IA, E-commerce).
   - Outils de productivité (générateur de devis, export VCF qualifié).

Rédige des réponses structurées, courtoises et concises en français. Sois précis sur les chiffres (retrait dès 2 000 FCFA, 15% N1, 5% N2, 7 jours de rétractation).`;

// Unified Chat & Information API Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, messages: rawMessages } = req.body ?? {};
    const messages = rawMessages === undefined ? undefined : sanitizeMessages(rawMessages);
    if (rawMessages !== undefined && messages === null) {
      return res.status(400).json({ error: 'Historique de conversation invalide.' });
    }
    const single = typeof message === 'string' ? message.trim().slice(0, MAX_MESSAGE_LENGTH) : '';
    const query = single || (messages && messages[messages.length - 1]?.content);

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Un message valide est requis.' });
    }

    if (!ai) {
      return res.json({
        answer: "GLOBAL-AF est une plateforme d'opportunités numériques en Côte d'Ivoire. Vous pouvez y réaliser des micro-jobs rémunérés, accéder à des formations pratiques et profiter d'un programme de parrainage éthique (15% au Niveau 1 et 5% au Niveau 2 sur ventes réelles). Les retraits sont instantanés dès 2 000 FCFA via Wave (1%), Orange Money, MTN MoMo et Moov Africa, avec un droit de rétractation garanti de 7 jours.",
        source: 'local_fallback',
      });
    }

    // Build contents for multi-turn if available
    let contents: any = query;
    if (messages && messages.length > 0) {
      contents = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: GLOBAL_AF_SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    res.status(500).json({
      error: 'Erreur lors de la réponse du chatbot.',
      fallback: "GLOBAL-AF vous permet de gagner de l'argent grâce à des micro-jobs vérifiés et au parrainage (15% niveau 1, 5% niveau 2 sur ventes réelles). Retraits dès 2 000 FCFA sur Wave, Orange, MTN et Moov. Droit de rétractation garanti de 7 jours.",
    });
  }
});

// FAQ Endpoint for GLOBAL-AF (backward compatibility)
app.post('/api/faq', async (req, res) => {
  try {
    const rawQuestion = req.body?.question;
    const question = typeof rawQuestion === 'string' ? rawQuestion.trim().slice(0, MAX_MESSAGE_LENGTH) : '';
    if (!question) {
      return res.status(400).json({ error: 'Une question valide est requise.' });
    }

    if (!ai) {
      return res.json({
        answer: "GLOBAL-AF est la plateforme d'opportunités numériques en Côte d'Ivoire : micro-jobs rémunérés, formations professionnelles et affiliation éthique (15% N1, 5% N2). Retraits dès 2 000 FCFA via Wave, Orange Money, MTN MoMo et Moov Africa, avec droit de rétractation de 7 jours.",
        source: 'local_fallback',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: question,
      config: {
        systemInstruction: GLOBAL_AF_SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Error generating FAQ with Gemini:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération de la réponse.',
      fallback: "GLOBAL-AF permet de participer à des micro-jobs rémunérés, d'accéder à des cours certifiants et de retirer ses gains dès 2 000 FCFA via Wave, Orange Money, MTN MoMo et Moov Money en Côte d'Ivoire, avec une garantie totale de transparence et droit de rétractation de 7 jours.",
    });
  }
});

const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`GLOBAL-AF server running on port ${port}`);
  });
}

startServer();
