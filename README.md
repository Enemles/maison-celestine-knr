# Maison Célestine — Page produit Shopify

Intégration d'une page produit Shopify (marque cosmétique premium *Maison Célestine*) à partir d'une maquette Figma, au pixel près, réalisée dans le cadre du test technique KNR.

## Stack technique

- **Base** : thème [Skeleton](https://github.com/Shopify/skeleton-theme) (thème par défaut du CLI Shopify).
- **Templating** : Liquid — template produit dédié `product.knr.*`, une section par bloc préfixée `knr-`.
- **Styles** : SCSS (Dart Sass) compilé vers `assets/`, **scopé par section** (aucun style global qui déborde).
- **JavaScript** : vanilla, non-bloquant (`defer`).
- **Données** : 100 % dynamiques (objets Liquid produit, métachamps / métaobjets, blog, menus) — rien n'est codé en dur.

## Prérequis

- Node ≥ 22 · pnpm ≥ 10 · Shopify CLI ≥ 3.94

## Développement

```bash
pnpm install     # dépendances de build (sass, concurrently)
pnpm dev         # compile + watch le SCSS et lance « shopify theme dev » en parallèle
```

Autres scripts :

- `pnpm build` — CSS minifié (production)
- `pnpm lint` — Theme Check (linter Shopify)

## Organisation

```
src/styles/            Sources SCSS (_tokens, _mixins + un fichier par section knr-*)
assets/                CSS compilé + JS + polices
sections/knr-*.liquid  Sections de la page produit
snippets/              Fragments réutilisables
templates/             Templates (dont le template produit dédié)
```

Le SCSS est compilé localement vers `assets/`. Les sources (`src/`) sont versionnées mais exclues de l'upload Shopify via `.shopifyignore`.

## Design system

Tout part de `src/styles/_tokens.scss` (couleurs extraites de la maquette) et `_mixins.scss` (échelle typographique). Une seule règle de cohérence : `letter-spacing -2 %` sur tous les styles, sauf les titres de section (`-4 %`). Les valeurs (tailles, line-heights, couleurs) sont relevées au pixel depuis Figma — aucune approximation.

## Bloc produit — section OS 2.0 entièrement à blocs

`sections/knr-product.liquid` n'est pas un bloc monolithique : **toute la colonne d'informations est composée de blocs réordonnables** depuis l'éditeur de thème (fil d'Ariane, badges, titre + note, indices, accroche, sélecteur de taille, prix, bouton d'achat, réassurance, accordéons, produits complémentaires). Le marchand peut masquer / réordonner / dupliquer chaque élément sans toucher au code. Un `preset` fournit l'agencement par défaut.

Layout : galerie full-bleed (image hero plein écran + visuels suivants) et **carte d'infos en overlay flottant** (`position: absolute`) par-dessus la galerie, fidèle à la maquette.

## Modèle de données (100 % dynamique)

Rien n'est codé en dur — chaque contenu vient d'une source Shopify native :

| Contenu | Source |
| --- | --- |
| Titre, prix, prix barré, variantes, description, images | objets `product` / `variant` |
| Badges, note, indices Yuka/INCI, accroche, contenus des accordéons | métachamps `product.metafields.custom.*` (définitions créées + épinglées dans l'admin) |
| Fil d'Ariane (2ᵉ niveau) + produits « Complétez votre rituel » | collection du produit + app native **Search & Discovery** (`shopify--discovery--product_recommendation.complementary_products`) |
| Messages de réassurance, délai de livraison | réglages de bloc (éditables dans le customizer) |

## Interactions (vanilla JS, `assets/knr-product.js`, `defer`)

Un seul fichier, non-bloquant, sans dépendance :

- **Variantes** — mise à jour live du prix / prix barré / prix unitaire / CTA / disponibilité (sans rechargement).
- **Réassurance** — slider de texte auto avec puces de pagination.
- **Accordéons** — ouverture/fermeture animée en **CSS pur** (`grid-template-rows: 0fr → 1fr`), le JS ne fait que basculer une classe ; un seul ouvert à la fois, `aria-expanded` géré.
- **Galerie** — lightbox plein écran (image entière cliquable, navigation clavier ←/→/Échap).
- **Produits complémentaires** — swiper (swipe tactile natif + drag souris avec `setPointerCapture`).

## Performance

- **Images responsive** : `srcset` multi-largeurs + `sizes` adaptés (un mobile ne télécharge jamais l'image desktop).
- **LCP** : image hero en `loading="eager"` + `fetchpriority="high"`.
- **CLS** : ratios d'images réservés (`aspect-ratio`), zéro saut de mise en page.
- CSS scopé par section, JS différé, police en `display=swap`.

## SEO

Données structurées **JSON-LD** injectées dans la page produit (`Product` + `Offer` par variante + `AggregateRating` + `BreadcrumbList`) → éligibilité aux *rich results* Google (prix, étoiles, disponibilité, fil d'Ariane). Vérifiable via le [Rich Results Test](https://search.google.com/test/rich-results).

## Accessibilité

HTML sémantique, contrôles natifs (`<button>`), `aria-expanded` sur les accordéons, `aria-label` sur les icônes, états `:focus-visible`, textes alternatifs dynamiques.
