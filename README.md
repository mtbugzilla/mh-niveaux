# MH-Niveaux

Estimation des niveaux des monstres sur la page de vue de
[MountyHall](http://www.mountyhall.com/).

> _Note for English-speaking readers: this script is for the
> French-speaking game [MountyHall](http://www.mountyhall.com/), so
> everything here is documented in French._

## Description

Le but de ce script est de fournir une estimation rapide des niveaux
des monstres visibles en se basant uniquement sur leur nom et sans
devoir faire appel à des outils ou bases de données externes.

## Limitations

Ce programme n'a pas la prétention d'être parfait.  Il ne pourrait pas
l'être car le niveau de certains monstres tels que les Phoenix ou les
Elémentaires Magmatiques ne peut pas être deviné en se basant
uniquement sur leur nom.  Des outils externes seront donc toujours
utiles pour partager les informations de Connaissance des Monstres.

Ce programme ne tient pas compte des "anciens" monstres dont le
numéro est inférieur à 4000000.  Il y en a de moins en moins dans le
hall et il ne me semble pas utile d'alourdir le code en ajoutannt des
cas particuliers pour les différences entre anciens et nouveaux monstres.

## Installation

Il faut d'abord avoir une extension pour "userscripts", qui dépend de votre navigateur :
* Pour Firefox, [GreaseMonkey](https://addons.mozilla.org/fr/firefox/addon/greasemonkey/).
* Pour Chrome, [TamperMonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=fr).
* Pour Opera, [TamperMonkey](https://addons.opera.com/en/extensions/details/tampermonkey-beta/) ou [ViolentMonkey](https://addons.opera.com/en/extensions/details/violent-monkey/).

D'autres extensions ou add-ons compatibles avec GreaseMonkey sont
probablement disponibles pour ces navigateurs ou d'autres.  Le
site
[GreasyFork](https://greasyfork.org/fr/help/installing-user-scripts)
donne quelques instructions d'installation.

Une fois que l'extension appropriée sera installée et active, il
devrait être suffisant de cliquer sur [le script MH-Niveaux](https://github.com/mtbugzilla/mh-niveaux/raw/master/MH_Niveaux.user.js)
pour lancer l'installation automatique.

## Motivation

J'ai commencé à écrire ce script lorsque notre groupe de chasse a eu
une troisième mission dont l'étape demandait de tuer des monstres de
niveau 44 ou plus.  Ces monstres sont rares et c'est déjà pénible d'en
trouver un, mais lorsqu'on doit en tuer 9 pour une seule mission, cela
devient vraiment difficile de les trouver.  Pour un Tom ayant une vue
portant à plus de 50 cases et incluant des milliers de monstres, il
faut énormément de temps trouver dans cette liste ceux dont le niveau
semble adéquat.  Ce script permet de faire un tri rapide dans la vue
avant de confirmer le niveau des monstres par CdM ou outils externes.

## Droits d'auteur

Ce programme est libre, vous pouvez le redistribuer et/ou le modifier
selon les termes de la Licence Publique Générale GNU Affero publiée
par la Free Software Foundation (version 3 ou bien toute autre version
ultérieure choisie par vous).  Ce programme est distribué **sans
aucune garantie**.  Pour plus de détails, reportez-vous au fichier
LICENSE ou à d'autres copies de l'AGPL v3 telle que distribuée par la
Free Software Foundation.

J'ai choisi l'AGPL v3 car il me semble que cette license est celle
qui garantit le mieux que le code restera libre. Si vous voulez
inclure des parties de ce code dans un autre programme mais qu'il est
totalement impossible pour vous d'utiliser l'AGPL v3 ou ultérieure,
contactez-moi et nous pourrons trouver une solution.

## Remerciements

Les informations concernant le niveaux des monstres proviennent
principalement des sources suivantes :
* [Liste des monstres sur Mountypédia](http://mountypedia.mountyhall.com/Mountyhall/ListeMonstres) (partiellement obsolète).
* [Bestiaire niveau des monstres](http://www.mountyhall.com/Forum/display_topic_threads.php?ForumID=17&TopicID=154621) (forum MountyHall) incluant de nombreuses corrections de la liste Mountypédia.
* [Liste publique des monstres](http://ftp.mountyhall.com/Public_Monstres.txt) sur le serveur FTP MountyHall.
* Vérifications par CdM pour certains monstres ou templates.
