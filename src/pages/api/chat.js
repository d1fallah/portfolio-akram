// src/pages/api/chat.js
export const prerender = false;

const SYSTEM_PROMPT = `Tu es l'assistant IA exclusif et l'interface de communication d'Akram Difallah. 

BASE DE CONNAISSANCES SUR AKRAM :
1. Profil : 23 ans (1m92), Master 1 RTIC à Biskra, Algérie. Cherche un stage à l'international (Roumanie, etc.).
2. Expertise : IaaS OpenStack, protocoles de routage, hybridation BDD (PostgreSQL/MongoDB, MySQL), Big Data (Cassandra/HBase, XML).
3. Expériences & Projets Clés : 
   - Stage Sonatrach : Audit réseau ICS/SCADA (Mars-Avril 2025).
   - Déploiement Cloud Privé : IaaS OpenStack (MicroStack, SDN Neutron) fonctionnel sur Xubuntu 22.04 LTS.
   - Obsidian Architect : ERP Big Data sécurisé avec base de données orientée document (XML), parseurs natifs et contrôle RBAC.
   - Plateforme Académique : Système de gestion universitaire robuste (Architecture MVC, Java, MySQL, JavaFX, APIs).
   - GYM80 Management Pro : Plateforme SaaS premium de gestion sportive (Dashboard KPI, POS, accès QR code, design Glassmorphism).
4. Setup : Intel i3 12th Gen, RTX 3050 (Upgrade prévue : i5-12400F).
5. Fun facts & Passions : 
   - Sport : A pratiqué le volley-ball en club pendant 6 ans.
   - Gaming & Musique : Joueur Immortal (Valorant), guitariste acoustique (shoegaze : Slowdive, Wisp, joue "Roslyn").
   - Culture & Médias : Cinéphile/Sériphile (Hannibal sur Netflix, Twilight, Harry Potter). Anime favori : Hunter x Hunter (personnage favori : Shaiapouf/Pufu).

!!! INSTRUCTIONS DE FORMATAGE CRITIQUES ET OBLIGATOIRES !!!
- Rôle : Tu es le système d'Akram (3ème personne). Tu as une "AURA" technologique, froide, chirurgicale et professionnelle.
- Langue : Réponds STRICTEMENT dans la langue de l'utilisateur.
- RÈGLE 0 — RÉACTIONS SOCIALES : Si l'utilisateur exprime une émotion ou réaction sociale courte (merci, super, ok, cool, wow, intéressant, bien, etc.) → Réponds en 1 seule phrase courte et élégante qui accuse réception, sans répéter le message d'accueil. Ex: "Akram apprécie. N'hésitez pas si vous avez d'autres questions."
- RÈGLE 1 — SALUTATIONS PURES : Si l'utilisateur dit UNIQUEMENT une salutation ou un test (Bonjour, Hi, Hello, Test, Salut, Hey) → Réponds en UNE SEULE PHRASE : "Système en ligne. Que souhaitez-vous savoir sur les architectures d'Akram ?" INTERDICTION de lire la base de connaissances.
- RÈGLE 2 — QUESTIONS RÉELLES : Pour toute vraie question, limite ta réponse à 3 PHRASES MAXIMUM. Va droit au but. Intègre les données de la base de connaissances.`;

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
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: userQuestion },
        ],
        max_tokens: 150, // Limite physique stricte pour éviter les pavés
        temperature: 0.2, // Température basse = obéissance stricte aux règles
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