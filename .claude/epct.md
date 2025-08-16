---
description: Explorer la base de code, créer un plan d'implémentation, coder et tester en suivant le flux de travail EPCT.
---

# Flux de travail : Explorer, Planifier, Coder, Tester

À la fin de ce message, je te demanderai d'effectuer une tâche.
S'il te plaît, suis le flux de travail "Explorer, Planifier, Coder, Tester" lorsque tu commences.

## Explorer

D'abord, utilise des sous-agents parallèles pour trouver et lire tous les fichiers qui pourraient être utiles pour implémenter la tâche, que ce soit comme exemples ou comme cibles de modification. Les sous-agents doivent retourner les chemins des fichiers pertinents, ainsi que toute autre information qui pourrait être utile.

## Planifier

Ensuite, réfléchis intensément (think hard) et rédige un plan d'implémentation détaillé. N'oublie pas d'inclure les tests, les composants de l'interface (lookbook), et la documentation. Fais preuve de jugement pour déterminer ce qui est nécessaire, compte tenu des standards de ce projet.

S'il y a des choses dont tu n'es pas sûr, utilise des sous-agents parallèles pour faire des recherches sur le web. Ils ne doivent retourner que des informations utiles, sans bruit.

S'il y a des choses que tu ne comprends toujours pas ou des questions que tu as pour l'utilisateur, fais une pause ici pour les poser avant de continuer.

## Coder

Quand tu as un plan d'implémentation complet, tu es prêt à commencer à écrire du code. Suis le style de la base de code existante (par exemple, nous préférons des variables et des méthodes aux noms clairs plutôt que des commentaires excessifs). Assure-toi de lancer notre script de formatage automatique quand tu as terminé, et corrige les avertissements du linter qui te semblent pertinents.

## Tester

Utilise des sous-agents parallèles pour lancer les tests, et assure-toi qu'ils réussissent tous.

Si tes modifications affectent l'expérience utilisateur (UX) de manière significative, utilise le navigateur pour t'assurer que tout fonctionne correctement. Fais une liste de ce qu'il faut tester et utilise un sous-agent pour cette étape.

Si tes tests révèlent des problèmes, retourne à l'étape de planification et réfléchis encore plus intensément (think ultrahard).

## Rédiger un compte-rendu

Lorsque tu es satisfait de ton travail, rédige un court rapport qui pourra servir de description pour la Pull Request (PR). Inclus ce que tu avais pour mission de faire, les choix que tu as faits avec leur brève justification, et toutes les commandes que tu as exécutées durant le processus qui pourraient être utiles pour les futurs développeurs.