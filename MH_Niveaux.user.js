// ==UserScript==
// @name        MH_Niveaux
// @description Estimation des niveaux des monstres sur la page de vue
// @version     0.6
// @author      Raphaël (troll 98777)
// @namespace   https://github.com/mtbugzilla/
// @downloadURL https://github.com/mtbugzilla/mh-niveaux/raw/master/MH_Niveaux.user.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant       none
// @include     http://games.mountyhall.com/mountyhall/MH_Play/Play_vue.php
// @include     https://games.mountyhall.com/mountyhall/MH_Play/Play_vue.php
// ==/UserScript==
//
// Ce programme est libre, vous pouvez le redistribuer et/ou le modifier selon
// les termes de la Licence Publique Générale GNU Affero publiée par la Free
// Software Foundation (version 3 ou bien toute autre version ultérieure choisie
// par vous).  Ce programme est distribué sans aucune garantie.  Pour plus de
// détails, reportez-vous au fichier LICENSE (ou autres copies de l'AGPL v3).
//
// Pour exécuter des "userscripts" tels que celu-ci, votre navigateur doit
// avoir une extension telle que GreaseMonkey, TamperMonkey ou autres.  Pour
// les instructions d'installation, voir le fichier README.md disponible ici :
//   https://github.com/mtbugzilla/mh-niveaux

// Pour utiliser une copie locale de jQuery
this.$ = this.jQuery = jQuery.noConflict(true);

// Debug
console.log("MH_Niveaux - version 0.6 avec jQuery " + $.fn.jquery + ".");
var t0 = new Date();

// Familles de monstres
var FAM_ERROR  = 0;
var FAM_ANIMAL = 1 << 0;
var FAM_DEMON  = 1 << 1;
var FAM_HUMAN  = 1 << 2;
var FAM_INSECT = 1 << 3;
var FAM_MONSTR = 1 << 4;
var FAM_UNDEAD = 1 << 5;
var FAM_ALL    = ( FAM_ANIMAL | FAM_DEMON | FAM_HUMAN | FAM_INSECT | FAM_MONSTR | FAM_UNDEAD );

// Templates (préfixes et suffixes, avec deuxième passe pour les templates qui ont un conflit possible avec des noms de monstres)
// Format : [ ajout au nom, bonus niveau, familles possibles ]
var templates_monstres_pre = [
  [ "Alpha", 11, FAM_INSECT ],
  [ "Archiatre", 2, FAM_DEMON ],
  [ "Barbare", 1, FAM_HUMAN ],
  [ "Championne", 4, FAM_HUMAN ],
  [ "Champion", 4, FAM_HUMAN ],
  [ "Grande Frondeuse", 4, FAM_HUMAN ],
  [ "Grand Frondeur", 4, FAM_HUMAN ],
  [ "Frondeuse", 2, FAM_HUMAN ],
  [ "Frondeur", 2, FAM_HUMAN ],
  [ "Gardienne", 20, FAM_ALL ],
  [ "Gardien", 20, FAM_ALL ],
  [ "Grosse", 0, FAM_ALL ],
  [ "Gros", 0, FAM_ALL ],
  [ "Guerrière", 1, FAM_HUMAN ],
  [ "Guerrier", 1, FAM_HUMAN ],
  [ "Héros", 5, FAM_HUMAN ],
  [ "Maîtresse", 8, FAM_UNDEAD ],
  [ "Maître", 8, FAM_UNDEAD ],
  [ "Paysanne", -1, FAM_HUMAN ],
  [ "Paysan", -1, FAM_HUMAN ],
  [ "Petite", -1, FAM_ALL ],
  [ "Petit", -1, FAM_ALL ],
  [ "Princesse", 8, FAM_DEMON ],
  [ "Prince", 8, FAM_DEMON ],
  [ "Reine", 11, FAM_INSECT ],
  [ "Scout", 2, FAM_HUMAN ],
  [ "Shaman", 0, FAM_HUMAN ],
  [ "Sorcier", 0, FAM_HUMAN ],
  [ "Voleuse", 2, FAM_HUMAN ],
  [ "Voleur", 2, FAM_HUMAN ]
];
var templates_monstres_pre2 = [
  [ "Sorcière", 0, FAM_HUMAN ],
];

var templates_monstres_post = [
  [ "Affamée", 0, FAM_INSECT ],
  [ "Affamé", 0, FAM_INSECT ],
  [ "Agressive", 1, FAM_HUMAN ],
  [ "Agressif", 1, FAM_HUMAN ],
  [ "Alchimiste", 0, FAM_HUMAN ],
  [ "Archaïque", -1, FAM_UNDEAD ],
  [ "Attentionnée", 2, FAM_ANIMAL ],
  [ "Attentionné", 2, FAM_ANIMAL ],
  [ "Berserkere", 2, FAM_HUMAN ],
  [ "Berserker", 2, FAM_HUMAN ],
  [ "Cogneuse", 2, FAM_ALL ],
  [ "Cogneur", 2, FAM_ALL ],
  [ "Colossale", 7, FAM_MONSTR ], // 6?
  [ "Colossal", 7, FAM_MONSTR ], // 6?
  [ "Coriace", 1, FAM_ALL ],
  [ "Corrompue", 1, FAM_ALL ],
  [ "Corrompu", 1, FAM_ALL ],
  [ "Cracheuse", 2, FAM_MONSTR ],
  [ "Cracheur", 2, FAM_MONSTR ],
  [ "de Premier Cercle", -1, FAM_DEMON ],
  [ "de Second Cercle", 0, FAM_DEMON ],
  [ "de Troisième Cercle", 2, FAM_DEMON ],
  [ "de Quatrième Cercle", 4, FAM_DEMON ],
  [ "de Cinquième Cercle", 5, FAM_DEMON ],
  [ "des Abysses", 3, FAM_DEMON ],
  [ "Effrayée", -1, FAM_HUMAN ],
  [ "Effrayé", -1, FAM_HUMAN ],
  [ "Enflammée", 0, FAM_INSECT ],
  [ "Enflammé", 0, FAM_INSECT ],
  [ "Enragée", 3, FAM_ANIMAL ],
  [ "Enragé", 3, FAM_ANIMAL ],
  [ "Esculape", 2, FAM_MONSTR ],
  [ "Ethérée", 3, FAM_DEMON ],
  [ "Ethéré", 3, FAM_DEMON ],
  [ "Fanatique", 2, FAM_HUMAN | FAM_DEMON ],
  [ "Fouisseuse", 0, FAM_ANIMAL | FAM_INSECT | FAM_MONSTR ],
  [ "Fouisseur", 0, FAM_ANIMAL | FAM_INSECT | FAM_MONSTR ],
  [ "Folle", 1, FAM_HUMAN ],
  [ "Fou", 1, FAM_HUMAN ],
  [ "Frénétique", 3, FAM_MONSTR ],
  [ "Fustigatrice", 2, FAM_MONSTR ],
  [ "Fustigateur", 2, FAM_MONSTR ],
  [ "Gargantuesque", 3, FAM_MONSTR ],
  [ "Gigantesque", 1, FAM_ANIMAL | FAM_INSECT | FAM_MONSTR ],
  [ "Guérisseuse", 2, FAM_HUMAN ],
  [ "Guérisseur", 2, FAM_HUMAN ],
  [ "Homochrome", 0, FAM_ANIMAL | FAM_INSECT ],
  [ "Homomorphe", 0, FAM_MONSTR ],
  [ "Implacable", 3, FAM_UNDEAD ],
  [ "Invocatrice", 5, FAM_DEMON ],
  [ "Invocateur", 5, FAM_DEMON ],
  [ "Lobotomisatrice", 2, FAM_INSECT ],
  [ "Lobotomisateur", 2, FAM_INSECT ],
  [ "Malade", -1, FAM_ALL ],
  [ "Médicastre", 2, FAM_UNDEAD ],
  [ "Mentat", 2, FAM_UNDEAD ],
  [ "Morticole", 2, FAM_INSECT ],
  [ "Mutante", 2, FAM_HUMAN ],
  [ "Mutant", 2, FAM_HUMAN ],
  [ "Nécromante", 5, FAM_UNDEAD ],
  [ "Ouvrière", 0, FAM_INSECT ],
  [ "Ouvrier", 0, FAM_INSECT ],
  [ "Parasitus", 2, FAM_MONSTR ],
  [ "Planquée", 0, FAM_HUMAN ],
  [ "Planqué", 0, FAM_HUMAN ],
  [ "Psychophage", 2, FAM_UNDEAD ],
  [ "Ronfleuse", 2, FAM_ALL ],
  [ "Ronfleur", 2, FAM_ALL ],
  [ "Soldat", 2, FAM_INSECT ],
  [ "Spectrale", 0, FAM_UNDEAD ],
  [ "Spectral", 0, FAM_UNDEAD ],
  [ "Stridente", 3, FAM_INSECT ],
  [ "Strident", 3, FAM_INSECT ],
  [ "Traqueuse", 1, FAM_MONSTR ],
  [ "Traqueur", 1, FAM_MONSTR ],
  [ "Vorace", 1, FAM_ANIMAL ]
];
var templates_monstres_post2 = [
  [ "Nécromant", 5, FAM_UNDEAD ],
];

// Noms des monstres avec leurs niveaux de base
// Format : [ Code MH si connu, nom du monstre, niveau de base, famille ]
var niveaux_monstres = [
  [ 161, "Abishaii Bleu", 19, FAM_DEMON ],
  [ 94, "Abishaii Noir", 10, FAM_DEMON ],
  [ 96, "Abishaii Rouge", 23, FAM_DEMON ],
  [ 95, "Abishaii Vert", 15, FAM_DEMON ],
  [ 103, "Ame-en-peine", 8, FAM_UNDEAD ],
  [ 18, "Amibe Géante", 9, FAM_MONSTR ],
  [ 18, "Amibe", 8, FAM_MONSTR ],
  [ 45, "Anaconda des Catacombes", 8, FAM_MONSTR ],
  [ 75, "Ankheg", 10, FAM_INSECT ],
  [ 203, "Anoploure Purpurin", 36, FAM_INSECT ],
  [ -1, "Aragnarok du Chaos", 16, FAM_INSECT ],
  [ 15, "Araignée Géante", 2, FAM_INSECT ],
  [ 15, "Araignée", 1, FAM_INSECT ],
  [ 221, "Ashashin", 35, FAM_HUMAN ],
  [ -1, "Balrog", 50, FAM_DEMON ],
  [ 104, "Banshee", 16, FAM_UNDEAD ],
  [ 146, "Barghest", 36, FAM_DEMON ],
  [ 76, "Basilisk", 11, FAM_MONSTR ],
  [ 139, "Behemoth", 34, FAM_DEMON ],
  [ 77, "Behir", 14, FAM_MONSTR ],
  [ -1, "Beholder", 50, FAM_MONSTR ],
  [ 158, "Boggart", 3, FAM_HUMAN ],
  [ 164, "Bondin", 9, FAM_MONSTR ],
  [ 215, "Bouj'Dla Placide", 37, FAM_MONSTR ],
  [ 214, "Bouj'Dla", 19, FAM_MONSTR ],
  [ 112, "Bulette", 19, FAM_MONSTR ],
  [ 40, "Caillouteux", 1, FAM_HUMAN ],
  [ 204, "Capitan", 35, FAM_UNDEAD ],
  [ 135, "Carnosaure", 25, FAM_MONSTR ],
  [ 118, "Champi-Glouton", 3, FAM_HUMAN ],
  [ 137, "Chauve-Souris Géante", 4, FAM_ANIMAL ],
  [ 137, "Chauve-Souris", 3, FAM_ANIMAL ],
  [ 207, "Cheval à Dents de Sabre", 23, FAM_ANIMAL ],
  [ -1, "Chevalier du Chaos", 20, FAM_DEMON ],
  [ 80, "Chimère", 13, FAM_MONSTR ],
  [ 192, "Chonchon", 24, FAM_MONSTR ],
  [ 206, "Coccicruelle", 22, FAM_INSECT ],
  [ 81, "Cockatrice", 5, FAM_MONSTR ],
  [ 209, "Crasc Maexus", 29, FAM_MONSTR ],
  [ 190, "Crasc Médius", 19, FAM_MONSTR ],
  [ 265, "Crasc parasitus", 14, FAM_MONSTR ],
  [ 189, "Crasc", 10, FAM_MONSTR ],
  [ 42, "Croquemitaine", 6, FAM_UNDEAD ],
  [ 141, "Cube Gélatineux", 32, FAM_MONSTR ],
  [ 225, "Daemonite", 27, FAM_DEMON ],
  [ -1, "Diablotin", 5, FAM_DEMON ],
  [ 140, "Djinn", 29, FAM_MONSTR ],
  [ 167, "Ectoplasme", 18, FAM_UNDEAD ],
  [ 142, "Effrit", 27, FAM_MONSTR ],
  [ 60, "Elémentaire d'Air", 23, FAM_DEMON ],
  [ 57, "Elémentaire de Feu", 21, FAM_DEMON ],
  [ 58, "Elémentaire de Terre", 21, FAM_DEMON ],
  [ 59, "Elémentaire d'Eau", 17, FAM_DEMON ],
  [ 134, "Elémentaire du Chaos", 26, FAM_DEMON ],
  [ -1, "Elémentaire Magmatique", -1, FAM_DEMON ],
  [ 82, "Erinyes", 7, FAM_DEMON ],
  [ 109, "Esprit-Follet", 16, FAM_MONSTR ],
  [ -1, "Essaim Cratérien", 30, FAM_INSECT ],
  [ 197, "Essaim Sanguinaire", 25, FAM_INSECT ],
  [ 54, "Ettin", 8, FAM_HUMAN ],
  [ -1, "Familier", 3, FAM_HUMAN ],
  [ 68, "Fantôme", 24, FAM_UNDEAD ],
  [ 70, "Feu Follet", 20, FAM_MONSTR ],
  [ 210, "Flagelleur Mental", 33, FAM_HUMAN ],
  [ 199, "Foudroyeur", 38, FAM_INSECT ],
  [ 219, "Fumeux", 22, FAM_DEMON ],
  [ 113, "Fungus Violet", 4, FAM_MONSTR ],
  [ 84, "Fungus Géant", 9, FAM_MONSTR ],
  [ 84, "Fungus", 8, FAM_MONSTR ],
  [ 200, "Furgolin", 10, FAM_HUMAN ],
  [ 85, "Gargouille", 3, FAM_MONSTR ],
  [ 61, "Géant de Pierre", 13, FAM_HUMAN ],
  [ 114, "Géant des Gouffres", 22, FAM_HUMAN ],
  [ -1, "Geck'oo Majestueux", 40, FAM_ANIMAL ],
  [ 230, "Geck'oo", 15, FAM_ANIMAL ],
  [ 191, "Glouton", 20, FAM_ANIMAL ],
  [ 86, "Gnoll", 5, FAM_HUMAN ],
  [ 138, "Gnu Sauvage", 1, FAM_ANIMAL ],
  [ -1, "Gobelin Magique", 1, FAM_HUMAN ],
  [ 1, "Goblin", 4, FAM_HUMAN ],
  [ 79, "Goblours", 4, FAM_HUMAN ],
  [ -1, "Golem de cuir", 1, FAM_HUMAN ],
  [ -1, "Golem de mithril", 1, FAM_HUMAN ],
  [ -1, "Golem de métal", 1, FAM_HUMAN ],
  [ -1, "Golem de papier", 1, FAM_HUMAN ],
  [ 98, "Golem d'Argile", 15, FAM_HUMAN ],
  [ 97, "Golem de Chair", 8, FAM_HUMAN ],
  [ 100, "Golem de Fer", 31, FAM_HUMAN ],
  [ 99, "Golem de Pierre", 23, FAM_HUMAN ],
  [ 111, "Gorgone", 11, FAM_MONSTR ],
  [ 19, "Goule", 4, FAM_UNDEAD ],
  [ -1, "Gowap Apprivoisé", -1, FAM_ANIMAL ],
  [ -1, "Gowap Sauvage", -1, FAM_ANIMAL ],
  [ -1, "Gowap", -1, FAM_ANIMAL ],
  [ 101, "Gremlins", 3, FAM_HUMAN ],
  [ 169, "Gritche", 39, FAM_DEMON ],
  [ 106, "Grouilleux", 4, FAM_MONSTR ],
  [ 144, "Grylle", 31, FAM_MONSTR ],
  [ 14, "Harpie", 4, FAM_MONSTR ],
  [ 165, "Hellrot", 18, FAM_DEMON ],
  [ 71, "Homme-Lézard", 4, FAM_HUMAN ],
  [ 131, "Hurleur", 8, FAM_HUMAN ],
  [ -1, "Hydre", 50, FAM_MONSTR ],
  [ 198, "Incube", 13, FAM_DEMON ],
  [ 87, "Kobold", 2, FAM_HUMAN ],
  [ 223, "Labeilleux", 26, FAM_INSECT ],
  [ -1, "Lapin Blanc", -1, FAM_ANIMAL ],
  [ 16, "Lézard Géant", 5, FAM_MONSTR ],
  [ 16, "Lézard", 4, FAM_MONSTR ],
  [ -1, "Liche", 50, FAM_UNDEAD ],
  [ 125, "Limace Géante", 10, FAM_INSECT ],
  [ 125, "Limace", 10, FAM_INSECT ],
  [ 46, "Loup-Garou", 8, FAM_HUMAN ],
  [ 126, "Lutin", 2, FAM_HUMAN ],
  [ 173, "Mante Fulcreuse", 30, FAM_INSECT ],
  [ 89, "Manticore", 9, FAM_MONSTR ],
  [ 120, "Marilith", 33, FAM_DEMON ],
  [ 88, "Méduse", 6, FAM_HUMAN ],
  [ 202, "Mégacéphale", 38, FAM_HUMAN ],
  [ 63, "Mille-Pattes Géant", 14, FAM_INSECT ],
  [ 63, "Mille-Pattes", 13, FAM_INSECT ],
  [ 117, "Mimique", 6, FAM_MONSTR ],
  [ 44, "Minotaure", 7, FAM_HUMAN ],
  [ 259, "Mohrg", 35, FAM_UNDEAD ],
  [ 102, "Molosse Satanique", 8, FAM_DEMON ],
  [ 2, "Momie", 4, FAM_UNDEAD ],
  [ 105, "Monstre Rouilleur", 3, FAM_MONSTR ],
  [ 194, "Mouch'oo Majestueux Sauvage", 33, FAM_MONSTR ],
  [ 193, "Mouch'oo Sauvage", 14, FAM_MONSTR ],
  [ 64, "Naga", 10, FAM_MONSTR ],
  [ 147, "Nécrochore", 37, FAM_UNDEAD ],
  [ -1, "Archi-Nécromant", 44, FAM_UNDEAD ], // Nécromant Nécromant
  [ 227, "Nécromant", 39, FAM_UNDEAD ],
  [ 56, "Nécrophage", 8, FAM_UNDEAD ],
  [ 43, "Nuage d'Insectes", 7, FAM_INSECT ],
  [ 166, "Nuée de Vermine", 13, FAM_INSECT ],
  [ 17, "Ogre", 7, FAM_HUMAN ],
  [ 66, "Ombre de Roches", 13, FAM_MONSTR ],
  [ 128, "Ombre", 2, FAM_UNDEAD ],
  [ 3, "Orque", 3, FAM_HUMAN ],
  [ 67, "Ours-Garou", 18, FAM_HUMAN ],
  [ 119, "Palefroi Infernal", 29, FAM_DEMON ],
  [ 108, "Phoenix", 32, FAM_MONSTR ], // Variable : 32, 34, 36
  [ -1, "Pititabeille", 0, FAM_INSECT ],
  [ 8, "Plante Carnivore", 4, FAM_MONSTR ],
  [ -1, "Pseudo-Dragon", 5, FAM_DEMON ],
  [ -1, "Raquettou", -1, FAM_HUMAN ],
  [ 115, "Rat-Garou", 3, FAM_HUMAN ],
  [ 9, "Rat Géant", 2, FAM_ANIMAL ],
  [ 9, "Rat", 1, FAM_ANIMAL ],
  [ 41, "Rocketeux", 5, FAM_HUMAN ],
  [ 130, "Sagouin", 3, FAM_ANIMAL ],
  [ 12, "Scarabée Géant", 4, FAM_INSECT ],
  [ 12, "Scarabée", 3, FAM_INSECT ],
  [ 62, "Scorpion Géant", 10, FAM_INSECT ],
  [ 62, "Scorpion", 9, FAM_INSECT ],
  [ 48, "Shai", 28, FAM_DEMON ],
  [ 133, "Slaad", 5, FAM_MONSTR ],
  [ -1, "Archi-Sorcière", 17, FAM_HUMAN ], // Sorcière Sorcière
  [ 132, "Sorcière", 17, FAM_HUMAN ],
  [ 90, "Spectre", 14, FAM_UNDEAD ],
  [ 201, "Sphinx", 30, FAM_HUMAN ],
  [ 6, "Squelette", 1, FAM_UNDEAD ],
  [ 127, "Strige", 2, FAM_INSECT ],
  [ 10, "Succube", 13, FAM_DEMON ],
  [ 129, "Tertre Errant", 20, FAM_MONSTR ],
  [ 121, "Thri-kreen", 10, FAM_INSECT ],
  [ 116, "Tigre-Garou", 12, FAM_HUMAN ],
  [ 122, "Titan", 26, FAM_HUMAN ],
  [ 168, "Trancheur", 35, FAM_MONSTR ],
  [ 196, "Tubercule Tueur", 14, FAM_ANIMAL ],
  [ 107, "Tutoki", 4, FAM_MONSTR ],
  [ 69, "Vampire", 29, FAM_UNDEAD ],
  [ 47, "Ver Carnivore Géant", 12, FAM_MONSTR ],
  [ 47, "Ver Carnivore", 11, FAM_MONSTR ],
  [ -1, "Veskan du Chaos", 14, FAM_HUMAN ],
  [ 145, "Vouivre", 33, FAM_MONSTR ],
  [ 136, "Worg", 5, FAM_MONSTR ],
  [ 72, "Xorn", 14, FAM_DEMON ],
  [ 123, "Yéti", 8, FAM_HUMAN ],
  [ 124, "Yuan-ti", 15, FAM_HUMAN ],
  [ 7, "Zombie", 2, FAM_UNDEAD ]
];

// Ages des monstres
// TODO: créer deux tableaux séparés en fonction du genre du monstre, pour éviter d'utiliser des expressions rationnelles
var monstres_ages = [
  [ "Bébé", "Enfançon", "Jeune", "Adulte", "Mature", "Chef de harde", "Ancien|Ancienne", "Ancêtre" ],
  [ "Initiale?", "Novice", "Mineure?", "Favori|Favorite", "Majeure?", "Supérieure?", "Suprême", "Ultime" ],
  [ "Nouveau|Nouvelle", "Jeune", "Adulte", "Vétérane?", "Briscarde?", "Doyen|Doyenne", "Légendaire", "Mythique" ],
  [ "Larve", "Immature", "Juvénile", "Imago", "Développée?", "Mûre?", "Accomplie?", "Achevée?" ],
  [ "Nouveau|Nouvelle", "Jeune", "Adulte", "Vétérane?", "Briscarde?", "Doyen|Doyenne", "Légendaire", "Mythique" ],
  [ "Naissante?", "Récente?", "Ancien|Ancienne", "Vénérable", "Séculaire", "Antique", "Ancestrale?", "Antédiluvien|Antédiluvienne" ]
];

// Trouver dans quelles colonnes sont le nom et le numéro des monstres
var col_nom = -1;
var col_num = -1;
$("#VueMONSTRE thead tr th").each(function(index){
  var text = $(this).text();
  if (text.match(/Nom/)) {
    col_nom = index;
  } else if (text.match(/Réf./)) {
    col_num = index;
  }
});
if (col_nom < 0) {
  console.log("Colonne 'Nom' non trouvée.");
  col_nom = 3;
}
if (col_num < 0) {
  console.log("Colonne 'Num' non trouvée.");
  col_num = 2;
}

// Debug
console.log("MH_Niveaux - colonnes " + col_nom + " et " + col_num + ".");

// Extra debug
console.log("Test 1:", $("#VueMonstre thead").length);
console.log("Test 2:", $("#VueMonstre thead tr").length);
console.log("Test 3:", $("#VueMonstre thead tr th").length);
console.log("Test 4:", $("#VueMonstre tbody").length);
console.log("Test 5:", $("#VueMonstre tbody tr").length);
console.log("Test 6:", $("#VueMonstre tbody tr td").length);

var monstres_vus = 0;
var monstres_ok = 0;

// Parcours du tableau pour l'estimation des niveaux des monstres
$("#VueMONSTRE tbody tr").each(function(index){
  var nom = $(this).children().eq(col_nom).text();
  var num = $(this).children().eq(col_num).text();
  var match = nom.match(/^(.+) \[(.+)\]/);
  monstres_vus++;

  if (match) {
    var nom_base = match[1];
    var nom_age = match[2];
    var niv_template = 0;
    var rescan;
    // TODO: Remplacer les expressions rationnelles par de simples comparaisons en début et fin de liste
    do {
      rescan = false;
      // Recherche de templates (suffixes)
      templates_monstres_post.forEach(function(templ, idx) {
        var match2 = nom_base.match(new RegExp('^\s*(.*) ' + templ[0] + '\s*$'));
        if (match2 && match2[1]) {
          //console.log("TEMPLATE POST: ", templ[0]);
          nom_base = match2[1];
          niv_template += templ[1];
          rescan = true;
        }
      });
      if (rescan) { continue; }
      // Recherche de templates (préfixes)
      templates_monstres_pre.forEach(function(templ, idx) {
        var match2 = nom_base.match(new RegExp('^\s*' + templ[0] + ' (.*)\s*$'));
        if (match2 && match2[1]) {
          //console.log("TEMPLATE PRE: ", templ[0]);
          nom_base = match2[1];
          niv_template += templ[1];
          rescan = true;
        }
      });
      if (rescan) { continue; }
      // Recherche de templates (suffixes 2)
      templates_monstres_post2.forEach(function(templ, idx) {
        var match2 = nom_base.match(new RegExp('^\s*(.*) ' + templ[0] + '\s*$'));
        if (match2 && match2[1]) {
          //console.log("TEMPLATE POST: ", templ[0]);
          nom_base = match2[1];
          niv_template += templ[1];
          rescan = true;
        }
      });
      if (rescan) { continue; }
      // Recherche de templates (préfixes 2)
      templates_monstres_pre2.forEach(function(templ, idx) {
        var match2 = nom_base.match(new RegExp('^\s*' + templ[0] + ' (.*)\s*$'));
        if (match2 && match2[1]) {
          //console.log("TEMPLATE PRE: ", templ[0]);
          nom_base = match2[1];
          niv_template += templ[1];
          rescan = true;
        }
      });
    } while (rescan);
    //console.log("Monstre : '" + nom_base + "' [" + nom_age + "] " + niv_template);
    // Recherche du nom exact
    var monst_match = niveaux_monstres.find(function(monst, idx) {
      //console.log("TEST '" + nom_base + "' =? '" + monst[1] + "'");
      return (nom_base === monst[1]);
    });
    if (monst_match) {
      var fam = -1;
      if (monst_match[3] === FAM_ANIMAL) {
        fam = 0;
      } else if (monst_match[3] === FAM_DEMON) {
        fam = 1;
      } else if (monst_match[3] === FAM_HUMAN) {
        fam = 2;
      } else if (monst_match[3] === FAM_INSECT) {
        fam = 3;
      } else if (monst_match[3] === FAM_MONSTR) {
        fam = 4;
      } else if (monst_match[3] === FAM_UNDEAD) {
        fam = 5;
      }
      var niv_age = 0;
      if (fam >= 0) {
        niv_age = -1;
        monstres_ages[fam].find(function(age, idx) {
          if (nom_age.match(new RegExp('^' + age + "$"))) {
            niv_age = idx;
            return true;
          }
          return false;
        });
        if (niv_age < 0) {
          console.log("Age inconnu : [" + nom_age + "] pour le monstre '" + nom_base + "'");
          fam = -1;
        }
      } else {
        console.log("Famille inconnue pour le monstre '" + nom_base + "'");
      }
      if (fam >= 0) {
        monstres_ok++;
        if (monst_match[2] >= 0) {
          var niveau = monst_match[2] + niv_template + niv_age;
          if (num < 4000000) {
            $(this).children().eq(col_nom).prepend("(&lt;" + niveau + ") "); // Ancien monstre
          } else if (niveau >= 44) {
            $(this).children().eq(col_nom).prepend("<b>(" + niveau + ")</b> "); // Mission 44+
            $(this).children().eq(col_nom).append(" [44+]");
          } else {
            $(this).children().eq(col_nom).prepend("(" + niveau + ") "); // Normal
          }
        } else {
          $(this).children().eq(col_nom).prepend("(0) "); // Gowaps
        }
      } else {
        $(this).children().eq(col_nom).prepend("(??!) "); // Erreur famille ou âge
      }
    } else if (nom_base.match(/^Zombi de /) || nom_base.match(/^Nâ-Hàniym-Hééé$/)) {
      monstres_ok++;
      $(this).children().eq(col_nom).prepend("(zz) "); // Zombies
    } else {
      console.log("Monstre inconnu : '" + nom_base + "' (" + match[1] + ")");
      $(this).children().eq(col_nom).prepend("(??) "); // Inconnu
    }
  }
});

// Debug
console.log("MH_Niveaux - " + monstres_ok + "/" + monstres_vus + " monstres.");
var t1 = new Date();
console.log("MH_Niveaux - durée : " + (t1.getTime() - t0.getTime()) + "ms.");
