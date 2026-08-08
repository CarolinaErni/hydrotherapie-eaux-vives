# Vidéos sources

Ce répertoire contient les vidéos originales utilisées pour produire les variantes destinées au site.

## Choix des chemins

- `assets/videos/source/` contient les fichiers sources. Hugo ne les copie pas tels quels dans le site généré.
- `static/videos/` contient uniquement les variantes prêtes à être publiées. Hugo les copie telles quelles dans `public/videos/`.
- `resources/` n’est pas utilisé pour les sources, car Hugo réserve ce répertoire aux ressources générées et mises en cache.

Cette séparation évite de publier les fichiers originaux, souvent plus lourds, tout en permettant de régénérer les variantes optimisées.

## Génération des variantes

Depuis la racine du dépôt :

```bash
./scripts/maintenance/refactor_video.sh warm
./scripts/maintenance/refactor_video.sh web
```

Le mode `warm` applique le traitement colorimétrique. Le mode `web` produit une vidéo allégée, sans audio et adaptée à la lecture progressive sur le Web.
