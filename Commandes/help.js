const discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'commandes du bot',
    permission : 'aucune',
    dm : true,
    category : "information",
    options : [
        {
            type : "string",
            name : "commande",
            description : "commmandes du bot",
            required : false,
            autocomplete : true,
        }
    ],

    async run(bot, message, args) {
        
        let command;
        if (args.getString("commande")) {
            command = bot.commands.get(args.getString("commande"));
            if(!command) return message.reply('la commande n\'existe pas');
        }

        if (!command) {

            let categories = [];
            bot.commands.forEach(command => {
                if (!categories.includes(command.category)) categories.push(command.category);
            });

            let Embed = new discord.EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle('Commandes du bot')
            .setThumbnail(bot.user.displayAvatarURL({dynamic : true}))
            .setDescription(`Commandes disponibles : \`${bot.commands.size}\`\nCatégories disponibles : \`${categories.length}\``)
            .setTimestamp()
            .setFooter({text: 'Assistant de ziouk.', iconURL: bot.user.displayAvatarURL({dynamic : true})});

            await categories.sort().forEach(async cat => {

                let commands = bot.commands.filter(cmd => cmd.category === cat);
                Embed.addFields({name: `${cat}`, value: `${commands.map( cmd => `\`${cmd.name}\`: ${cmd.description}`).join("\n")}`});
            });

            await message.reply({embeds: [Embed]});
        } else {

            let Embed = new discord.EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle(`Commande ${command.name}`)
            .setThumbnail(bot.user.displayAvatarURL({dynamic : true}))
            .setDescription(`Nom : \`${command.name}\`\nDescription : \`${command.description}\`\nPermission requise : \`${typeof command.permission !== 'bigint'? command.permission : new discord.PermissionsBitField(command.permission).toArray(false)}\`\nCommande en DM : \`${command.dm ? "oui" : "non"}\`\nCatégorie : \`${command.category}\``)
            .setTimestamp()
            .setFooter({text: 'Assistant de ziouk.', iconURL: bot.user.displayAvatarURL({dynamic : true})});

            await message.reply({embeds: [Embed]});

        }
    }
};


