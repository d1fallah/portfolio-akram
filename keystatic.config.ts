// keystatic.config.ts
import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  singletons: {
    hero: singleton({
      label: 'Accueil (Hero)',
      path: 'src/content/sections/hero',
      schema: {
        titre: fields.text({ label: 'Titre principal (ex: Bonjour, je suis Akram)' }),
        sousTitre: fields.text({ label: 'Sous-titre (Métier)' }),
        description: fields.text({ label: 'Texte de présentation', multiline: true }),
      },
    }),
    contact: singleton({
      label: 'Section Contact',
      path: 'src/content/sections/contact',
      schema: {
        titre: fields.text({ label: 'Titre de l\'appel à l\'action' }),
        description: fields.text({ label: 'Texte d\'accompagnement', multiline: true }),
        email: fields.text({ label: 'Votre Email' }),
        github: fields.text({ label: 'Lien GitHub' }),
        linkedin: fields.text({ label: 'Lien LinkedIn' }),
      },
    }),
  },
  collections: {
    projets: collection({
      label: 'Projets',
      slugField: 'titre',
      path: 'src/content/projets/*',
      format: { contentField: 'contenu' },
      schema: {
        titre: fields.slug({ name: { label: 'Titre' } }),
        categorie: fields.text({ label: 'Catégorie' }),
        description_courte: fields.text({ label: 'Description Courte' }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Technologies' }),
        ordre: fields.integer({ label: 'Ordre', defaultValue: 1 }),
        screenshots: fields.array(
          fields.image({
            label: 'Screenshot',
            directory: 'public/images/projets',
            publicPath: '/images/projets/',
          }),
          {
            label: 'Screenshots de l\'application',
            description: 'Ajoutez autant de captures d\'écran que vous voulez',
            itemLabel: (props) => props.value ? 'Image' : 'Nouvelle image',
          }
        ),
        contenu: fields.document({ label: 'Détails', formatting: true, images: true }),
      },
    }),
    parcours: collection({
      label: 'Expériences (Parcours)',
      slugField: 'titre',
      path: 'src/content/parcours/*',
      schema: {
        titre: fields.slug({ name: { label: 'Poste/Diplôme' } }),
        date: fields.text({ label: 'Période (ex: 2025 - 2026)' }),
        description: fields.text({ label: 'Description des tâches', multiline: true }),
        ordre: fields.integer({ label: 'Ordre (1 = plus récent)', defaultValue: 1 }),
      },
    }),
  },
});