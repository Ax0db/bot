const discord = require('discord.js');
const intents = new discord.IntentsBitField(3276799);
const bot = new discord.Client({intents});
const loadCommands = require('./Loader/loadCommands');
const loadEvents = require('./Loader/loadEvents');
const config = require('./config.js');
const fs = require('fs');

// Collection pour stocker les commandes
bot.commands = new discord.Collection();
bot.aliases = new discord.Collection(); // Alias de commandes
bot.config = config;

// Système pour stocker les messages supprimés pour la commande snipe
bot.snipedMessages = new Map();

// Fonctions utilitaires
bot.functions = {
    createId: require('./Fonctions/createId'),
    calculXp: require('./Fonctions/calculXp'),
};

// Chargement des commandes et événements
loadCommands(bot);
loadEvents(bot);

// Gestion des erreurs non interceptées
process.on('unhandledRejection', error => {
    console.error('Erreur non gérée:', error);
});

// Connexion du bot
bot.login(config.token)
    .then(() => console.log('Bot connecté!'))
    .catch(err => console.error('Erreur de connexion:', err));
