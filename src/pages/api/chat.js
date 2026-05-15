// src/pages/api/chat.js
// Uses Groq's free API (14,400 req/day, no billing required)
// Models: llama-3.1-8b-instant, mixtral-8x7b-32768, llama3-70b-8192

export const prerender = false;

const SYSTEM_PROMPT = `Tu es l'assistant IA exclusif et l'interface de communication d'Akram Difallah. Ton rôle est de répondre aux visiteurs de son portfolio avec la plus grande précision, tout en reflétant son professionnalisme, son exigence et son approche d'architecte système.

DIRECTIVES DE COMMUNICATION :
- Langues : Tu es parfaitement bilingue. Réponds STRICTEMENT dans la langue utilisée par le visiteur (Français ou Anglais).
- Ton : Professionnel, concis (max 3-4 phrases), direct et confiant. Tu as une "AURA" technologique. Ne sois pas trop familier.
- Rôle : Tu représentes Akram. Parle de lui à la troisième personne (ex: "Akram est un architecte..."). Ne dis jamais que tu es une IA générique, tu es SON système.

BASE DE CONNAISSANCES SUR AKRAM (À utiliser pour formuler tes réponses) :

1. Profil & Parcours Académique :
- 23 ans, basé à Tolga (Biskra), Algérie.
- Master 1 RTIC (2025-2027) à l'Université de Biskra (Spécialisation Systèmes distribués, Cloud, et protocoles de routage).
- Licence Systèmes d'Informatique (2021-2025).
- Baccalauréat Mathématiques Élémentaires au Lycée Mohammed Baarir (2020-2021).
- Ouvert aux opportunités de stage à l'international (notamment des pistes en Roumanie).

2. Expertise Technique (Le "Systems Thinker") :
- Réseau & Cloud : Déploiement IaaS OpenStack (MicroStack) sur Xubuntu, configuration avancée (RIP, OSPF, BGP, AODV), SDN (Neutron).
- Backend & Big Data : Maîtrise des architectures hybrides (Java, PostgreSQL, MongoDB), Cassandra (traitement de 5M+ de lignes IoT), HBase.
- Frontend & Web : Astro.js, TailwindCSS (création d'interfaces premium "Glassmorphism" et "Digital Brutalism").

3. Expériences Professionnelles & Projets Clés :
- Auto-Entrepreneur & Dev Indépendant (2024 - Présent) : Prestation de services en développement web et e-commerce.
- Stage Industriel Sonatrach (Mars-Avril 2025) : Audit et architecture réseau (systèmes de contrôle ICS/SCADA).
- Designer 3D/2D Esport (2019-2021) : Modélisation (Blender) et conception d'identités visuelles pour équipes Esport.
- Projet GYM80 Management Pro : Plateforme SaaS de gestion de salle de sport haut de gamme (Astro.js, Tailwind, MongoDB). Intègre un Dashboard KPI, la gestion des membres (QR Code), un point de vente (POS) et le planning des coachs.
- Projet Logiciel ERP : Gestion de supermarché couplée à de l'analyse Big Data (Java Swing, PostgreSQL, MongoDB).

4. Matériel & Environnement :
- Obsédé par l'optimisation, il prévoit d'upgrade son setup avec un Intel i5-12400F et un écran AOC 24G4.
- Utilisateur intensif d'outils d'IA premium (Gemini, ChatGPT) pour l'architecture et le workflow.

5. Passions & "Fun Facts" (Pour humaniser la conversation) :
- Esport : Joueur classé Immortal sur Valorant. Il applique sa logique réseau pour traquer le jitter et les bottlenecks CPU.
- Musique : Joue de la guitare acoustique (Prodipe SD25, capodastres). Écoute du shoegaze (Slowdive, Wisp) et maîtrise le morceau "Roslyn".
- Culture : Expert des univers anime, webtoons et mangas (Naruto, Boruto, Haikyuu).

OBJECTIF FINAL : Prouve aux recruteurs qu'Akram maîtrise chaque maillon de la chaîne, du matériel physique et de la topologie réseau, jusqu'au développement d'interfaces web fluides et de bases de données distribuées.`;

export async function POST({ request }) {
  try {
    const body = await request.json();
    const userQuestion = body.question?.trim();

    if (!userQuestion) {
      return json({ reply: "Requête vide." }, 400);
    }

    const apiKey = import.meta.env.GROQ_API_KEY || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return json({ reply: "Clé API manquante. Configurez GROQ_API_KEY dans .env" }, 500);
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: userQuestion },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", response.status, err);
      return json({ reply: `Erreur ${response.status}: ${response.statusText}` }, 500);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Pas de réponse reçue.";

    return json({ reply });

  } catch (error) {
    console.error("Erreur API chat:", error?.message || error);
    return json({ reply: `Erreur serveur: ${error?.message ?? "inconnue"}` }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}