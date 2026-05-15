import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const projetsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdoc,yaml,yml,json}", base: "./src/content/projets" }),
  schema: z.object({
    titre: z.string(),
    categorie: z.string(),
    description_courte: z.string(),
    tags: z.array(z.string()),
    ordre: z.number(),
    screenshots: z.array(z.string()).optional().default([]),
  }),
});

const parcoursCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdoc,yaml,yml,json}", base: "./src/content/parcours" }),
  schema: z.object({
    titre: z.string(),
    date: z.string(),
    description: z.string(),
    ordre: z.number(),
  }),
});

const sectionsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdoc,yaml,yml,json}", base: "./src/content/sections" }),
  schema: z.object({
    titre: z.string().optional(),
    sousTitre: z.string().optional(),
    description: z.string().optional(),
    email: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
  }),
});

export const collections = {
  'projets': projetsCollection,
  'parcours': parcoursCollection,
  'sections': sectionsCollection,
};
