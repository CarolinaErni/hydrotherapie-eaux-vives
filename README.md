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

CI / Déploiement (résumé)
- Le workflow GitHub Actions `.github/workflows/deploy.yml` :
	- installe Hugo (extended) 0.149.1
	- met en cache certains répertoires pour accélérer les builds
	- construit le site avec `hugo --gc --minify`
	- lance un contrôle de liens via `lychee` sur le répertoire `public/`
	- publie `public/` sur la branche `gh-pages`

Conseils et dépannage
- Si le workflow échoue pour une dépendance ou la version de Hugo, mettez à jour `hugo-version` dans le workflow ou utilisez la version localement pour reproduire.
- Si vous modifiez `public/` localement, ne le commitez pas — `public/` est dans `.gitignore` et la branche `gh-pages` est produite automatiquement par l’action.

Commandes utiles
```bash
# vérifier la version Hugo locale (doit être similaire à CI)
hugo version

# build local de production (réplique CI)
hugo --gc --minify

# lancer serveur et vérifier le rendu
hugo server -D --disableFastRender
```
# HYDROTHÉRAPIE EAUX-VIVES

## Maquette

-   https://carolinaerni.github.io/hydrotherapie-eaux-vives/

## Site final

-   https://hydrotherapie-eaux-vives.ch
