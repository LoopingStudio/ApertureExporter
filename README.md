# Aperture Exporter

**Aperture Exporter** est un plugin Figma conçu pour automatiser l'extraction des Design Tokens. Il fait le pont entre vos **Primitives** (valeurs brutes) et vos **Tokens Sémantiques**, en gérant intelligemment les thèmes multi-marques (Light/Dark mode) grâce à une interface de mapping visuelle.

![Aperture Logo](https://img.shields.io/badge/Aperture-Design_System-7B61FF) ![TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-blue) ![Figma](https://img.shields.io/badge/Platform-Figma-black)

## Fonctionnalités

* **Mapping Intelligent** : Détecte automatiquement les liens entre vos collections de Primitives et vos Tokens Sémantiques.
* **Multi-Marques** : Gérez plusieurs marques (ex: Legacy, NewBrand) avec leurs propres modes Light et Dark.
* **Interface Visuelle** : UI moderne pour configurer le mapping "Source → Cible" avant l'export.
* **JSON Structuré** : Génère un fichier JSON propre, imbriqué (Nested), prêt pour l'intégration (compatible Style Dictionary).
* **Filtrage** : Ignore automatiquement les variables privées (commençant par `_`, `#`) ou les utilitaires.

---

## Installation & Développement

Ce projet utilise **TypeScript** et **esbuild** pour une compilation ultra-rapide et un code modulaire.

### Prérequis

* Node.js (v16 ou supérieur)
* NPM
* L'application Figma Desktop

### 1. Installation des dépendances

À la racine du projet, lancez :

```bash
npm install
```

---

### 2. Compilation (Build)
Pour construire le fichier final `dist/code.js` utilisé par Figma :

```bash
npm run build
```

Pour lancer le mode "Watch" (recompilation automatique à chaque sauvegarde pendant le dev) :

```bash
npm run watch
```

---

### 3. Installation dans Figma
1. Ouvrez **Figma**.
1. Allez dans **Menu > Plugins > Development > Import plugin from manifest...**
1. Sélectionnez le fichier `manifest.json` situé à la racine de ce projet.
---
## Architecture du Projet
Le code est séparé en plusieurs modules pour faciliter la maintenance et l'évolution.

```plaintext
ApertureExporter/
├── dist/             # Fichier compilé (généré automatiquement)
├── src/
│   ├── code.ts       # Contrôleur principal (Communication Figma <-> UI)
│   ├── ui.html       # Interface Utilisateur (HTML/CSS/JS)
│   └── core/         # Cœur logique (Indépendant de l'API Figma UI)
│       ├── export.ts   # Construction de l'arbre JSON récursif
│       ├── resolve.ts  # Résolution des Alias et Modes (Light/Dark)
│       └── utils.ts    # Helpers (Conversion Hex, Nettoyage noms)
├── manifest.json     # Configuration du plugin Figma
├── package.json      # Scripts et dépendances
└── tsconfig.json     # Configuration TypeScript
```

---

## Utilisation
1. Ouvrez votre fichier **Design System** dans Figma (celui contenant vos variables).

1. Lancez le plugin : **Plugins > Development > Aperture Exporter**.

1. **Mapping Global** :

    - Sélectionnez votre collection Source (ex: `_Primitives`).

    - Sélectionnez votre collection Cible (ex: `01. Modes` / Sémantique).

1. **Configuration des Marques** :

    - Le plugin pré-remplit les marques en lisant les colonnes (Modes) de vos Primitives.

    - Vérifiez que chaque colonne (Light/Dark) pointe vers la bonne Primitive.

1. Cliquez sur **Exporter le JSON**.

---

## Structure du JSON exporté
Le fichier généré suit une structure hiérarchique basée sur les noms de vos variables (ex: `Colors/Border/Primary`).

```json
[
  {
    "name": "Colors",
    "type": "group",
    "children": [
      {
        "name": "Border",
        "type": "group",
        "children": [
          {
            "name": "primary",
            "type": "token",
            "modes": {
              "Legacy": {
                "light": "#E5E5E5",
                "dark": "#333333"
              },
              "NewBrand": {
                "light": "#7B61FF",
                "dark": "#4801A0"
              }
            }
          }
        ]
      }
    ]
  }
]
```

## Règles de Nommage
Pour que le plugin fonctionne de manière optimale :
- **Primitives** : Doivent contenir les valeurs Hex brutes.
- **Tokens Sémantiques** : Doivent être des Alias pointant vers les Primitives.
- **Exclusions** : Les variables commençant par _, # ou contenant Utility sont automatiquement exclues de l'export.
- **Noms Numériques** : Un token nommé Gray/50 sera transformé en Gray-50 pour éviter les clés purement numériques.

---
**Développé avec ❤️ pour le Design System Aperture.**