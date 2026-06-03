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
