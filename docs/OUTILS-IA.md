# Outils IA (Gemini) — fonctionnement et configuration

Les outils de rédaction (texte publicitaire, idées marketing, résumé, prompts) appellent
**Gemini côté serveur** via la Cloud Function `runAiTool`. Aucune clé n'existe dans le
navigateur.

## Garde-fous
- Connexion + e-mail confirmé + **Pass actif** (accès calculé à l'instant : un abonnement
  échu ne donne plus accès).
- **Quota quotidien par offre** (compteur `aiUsage/{uid}_{jour}`, réservé avant l'appel et rendu
  en cas d'échec) : valeurs de départ `standard 10`, `premium 200`, `business 300`
  (`aiDailyQuota` dans la configuration serveur ; hypothèses à confirmer — le site annonce
  « outils IA illimités » pour le Premium : 200/jour reste illimité en pratique, mais protège la
  facture).
- Limite de débit : 10 requêtes par minute et par membre.
- Consignes permanentes : aucun fait inventé (les informations manquantes sont mises entre
  crochets), aucune promesse de gain, refus des contenus illicites et des jeux de hasard ; le texte
  du membre est une donnée délimitée (protection contre l'injection d'instructions).
- Les textes saisis ne sont pas conservés ; seul le compteur d'utilisation l'est.

## À configurer
1. Créer une clé API Gemini (Google AI Studio) et la placer dans `functions/.env.<projet>` :
   `GEMINI_API_KEY=...` (fichier non versionné). Pour Secret Manager : créer le secret avec une
   vraie valeur, puis déclarer `defineSecret("GEMINI_API_KEY")` dans `functions/src/handlers/ai.ts`.
2. Modèles : `GEMINI_MODEL` (liste séparée par des virgules, essayée dans l'ordre). Par défaut :
   `gemini-3.8-flash, gemini-3.5-flash, gemini-3.5-flash-lite, gemini-2.5-flash-lite`. Google retire
   régulièrement des modèles ; en cas de 404 le client passe au suivant et mémorise celui qui
   fonctionne. **Je n'ai pas pu lire la page officielle des modèles (accès robot refusé)** : ces
   identifiants viennent de résumés de la page des dépréciations et sont à vérifier sur
   ai.google.dev avant la production.
3. Relancer le script de seed (nouveau champ `aiDailyQuota`) et déployer règles, index, fonctions.
4. Surveiller la facturation Gemini et fixer une alerte de budget dans Google Cloud.

## Hors périmètre
Le chatbot public d'information (`/api/chat`) et le générateur de `server.ts` ne sont pas
déployés par Firebase Hosting : le chatbot répond depuis sa base locale. Les brancher sur Gemini
exigerait une fonction publique protégée contre les abus (Firebase App Check, quota par IP).
