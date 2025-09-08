# hydrotherapie-eaux-vives (Hugo)

Ce dépôt contient une conversion minimale du site statique vers Hugo. Le site se construit avec `hugo` et est déployé automatiquement sur la branche `gh-pages` via GitHub Actions.

Étapes recommandées localement :

```bash
# installer Hugo (macOS)
brew install hugo

# copier les assets dans static/
./scripts/bootstrap_to_hugo.sh

# lancer le serveur de dev
hugo server -D
```

Pour déployer sur GitHub Pages :
- Pousser la branche `hugo` sur le dépôt `NicHub/hydrotherapie-eaux-vives-hugo`.
- Le workflow `.github/workflows/deploy.yml` générera `public/` et poussera sur `gh-pages`.

# HYDROTHÉRAPIE EAUX-VIVES

## Maquette

-   https://carolinaerni.github.io/hydrotherapie-eaux-vives/

## Site final

-   https://hydrotherapie-eaux-vives.ch
