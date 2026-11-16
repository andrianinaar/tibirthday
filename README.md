# Pour Tsiky — Swiss Editorial × Lavender Romance

Un cadeau d’anniversaire statique (HTML, CSS, JavaScript), adapté en priorité au téléphone Redmi Note 14.

## Contenu

- Ouverture animée pour les 17 ans de Tsiky Iloniaina (17 novembre 2026)
- Compteur chronologique depuis le 17 novembre 2009 à minuit UTC+3 (heure exacte de naissance inconnue)
- 17 petits messages à lire librement
- Galerie de 3 photos (deux portraits de Tsiky et une photo de couple sur la plage)
- Gâteau interactif à 17 bougies, souhait et confettis
- Lettre finale avec prière et deux versets bibliques
- Musique lancée au toucher du bouton « Ouvre ta surprise », puis contrôlable avec le bouton Pause/Musique dans le bandeau supérieur (si le navigateur le permet)

**Aucun compte à rebours ni verrouillage.** Toute la surprise est accessible dès la publication.

## Photos définitives intégrées

Les trois photographies transmises ont été harmonisées (recadrage 4:5 et colorimétrie lavande/rose très légère) :

- `tsiky-portrait-01.jpg` — portrait de Tsiky en couverture et première image de la galerie
- `couple-plage.jpeg` — souvenir à deux, deuxième image de la galerie
- `tsiky-portrait-02.jpg` — autre portrait de Tsiky à la plage, troisième image de la galerie

Pour un meilleur rendu sur mobile, garder ces noms et ce rapport d’image si un remplacement ultérieur est nécessaire.

La signature « son amour — andrianinaar » est présente sur le site.

## Animations

- Apparition progressive des titres et sections lorsqu'ils entrent dans le champ de vision pendant le défilement
- Défilement animé des photos selon le sens du geste ou de la flèche
- Transition séquencée des textes sur les 17 cartes
- Réduction automatique des animations si le téléphone demande un affichage réduit

## Publier sur un dépôt GitHub Pages

Le nom du dépôt peut être `tibirthday` sous le compte `andrianinaar`. Si un ancien dépôt porte encore ce nom, il doit être remplacé ou utilisé après nettoyage.

1. Créer un dépôt GitHub propre ou sélectionner le dépôt existant, puis vérifier la branche et le dossier servant de source à GitHub Pages dans **Settings → Pages** (par exemple `main` / `(root)`).
2. Sauvegarder les fichiers actuels si nécessaire, surtout les éventuels fichiers de domaine `CNAME`, de workflow ou d'autres fonctionnalités propres au dépôt.
3. Sur la branche publiée, remplacer `index.html`, `style.css`, `script.js` ; envoyer `.nojekyll`, `README.md`, et tout le dossier `assets/`, en respectant les sous-dossiers.
4. Supprimer les anciens fichiers et dossiers inutilisés, **uniquement après avoir vérifié leur rôle** ; un envoi de nouveaux fichiers n'efface pas automatiquement les anciens.
5. Sur GitHub Pages, la publication se fait à partir des fichiers extraits : **ne pas envoyer le ZIP comme unique fichier**.
6. Vérifier l'adresse du site dans **Settings → Pages**. L'adresse par défaut du dépôt, sous réserve que Pages soit activé et qu'aucun domaine personnalisé ne soit configuré, est `https://andrianinaar.github.io/tibirthday/`.
7. Tester la musique au premier toucher, la pause, les cartes, les photos, les bougies et la lettre sur le Redmi Note 14 avant d’envoyer le lien.

Aucun build ni hébergement payant supplémentaire n'est requis. Sans accès d'écriture GitHub, la mise à jour du dépôt doit être faite par le propriétaire ou via une connexion autorisée.

## Confidentialité et caractère temporaire

GitHub Pages publie le site sur internet : toutes les photos et le contenu restent techniquement publics tant que le site est en ligne. L’indication `noindex` dans le HTML demande aux moteurs de recherche de ne pas indexer le site, mais **n’assure aucune confidentialité**. Pour supprimer le site public après l’anniversaire, passe par l’option **Unpublish site** dans GitHub Pages (et gère le dépôt et les fichiers publiés si tu veux aussi les retirer de GitHub).

**Attention :** si tu envoies le lien avant minuit, la surprise sera déjà entièrement visible. Envoie-le plutôt au moment où tu souhaites qu’elle la découvre.

## Tester localement

Ouvre `index.html` dans Chrome. Tu peux aussi utiliser un serveur local pour reproduire le chargement en ligne, sans rien publier. Le site n’a besoin ni de Node ni de paquet npm.


## Étape 13 — Épilogue « Merci Seigneur pour sa vie »

Un chapitre final de bénédiction a été ajouté après la lettre, avec
un message pour Tsiky et la signature « ton amour, andrianinaar ».
Il s'anime délicatement lorsque l'on y arrive, ou reste statique
si le téléphone demande une réduction des animations.
