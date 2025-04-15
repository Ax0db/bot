const fs = require('fs');
const path = require('path');

// Chemin vers le fichier wl.json
const whitelistPath = path.join(__dirname, '\\Commandes\\wl.json');

// Charger et parser le contenu de wl.json
const whitelist = JSON.parse(fs.readFileSync(whitelistPath, 'utf-8'));

// Exporter directement la liste
module.exports = whitelist;
