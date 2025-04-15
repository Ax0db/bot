const discord = require('discord.js')
const loadSlashCommands = require('../Loader/loadSlashCommands')
const loadDatabase = require('../Loader/loadDatabase')

module.exports = async bot => {

    bot.db = await loadDatabase()   
    bot.db.connect(function() {

        console.log('Connecté a la base de donnée avec succès');
    });
    await loadSlashCommands(bot)

    console.log(`${bot.user.tag} est bien en ligne!`);
}