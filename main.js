const discord = require('discord.js')
const intents = new discord.IntentsBitField(3276799)
const bot =  new discord.Client({intents})
const loadCommands = require('./Loader/loadCommands')
const loadEvents = require('./Loader/loadEvents')
const config = require('./config.js')

bot.commands = new discord.Collection()
bot.functions = {
    createId : require('./Fonctions/createId'),
    calculXp : require('./Fonctions/calculXp'),
}


bot.login(config.token)
loadCommands(bot)
loadEvents(bot)



