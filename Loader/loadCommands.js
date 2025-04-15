
const fs = require('fs');
const { Collection } = require('discord.js');

module.exports = async bot => {
    // Initialisation des collections par catégories
    bot.categories = new Collection();
    
    fs.readdirSync('./Commandes').filter(f => f.endsWith('.js')).forEach(async file => {
        try {
            let command = require(`../Commandes/${file}`);
            
            // Vérification des propriétés essentielles
            if (!command.name || typeof command.name !== 'string') {
                throw new TypeError(`La commande ${file.slice(0, file.length - 3)} n'a pas de nom.`);
            }
            
            // Ajout de la commande à la collection
            bot.commands.set(command.name, command);
            
            // Gestion des alias
            if (command.aliases && Array.isArray(command.aliases)) {
                command.aliases.forEach(alias => bot.aliases.set(alias, command.name));
            }
            
            // Gestion des catégories
            if (command.category) {
                if (!bot.categories.has(command.category)) {
                    bot.categories.set(command.category, []);
                }
                bot.categories.get(command.category).push(command.name);
            }
            
            console.log(`Commande ${file} chargée avec succès!`);
        } catch (error) {
            console.error(`Erreur lors du chargement de la commande ${file}:`, error);
        }
    });
};
