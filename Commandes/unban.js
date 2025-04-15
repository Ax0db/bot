const discord = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'unban un utilisateur',
    permission : discord.PermissionFlagsBits.BanMembers,
    dm : false,
    category : "Modération",
    options : [
        {
            type : "user",
            name : "membre",
            description : "L' utilisateur' à débannir",
            required : true,
            autocomplete : false,
        }, {
            type : "string",
            name : "raison",
            description : "La raison du deban",
            required : false,
            autocomplete : false,
        }
    ],
    async run(bot, message, args) {

        try {

            let user = args.getUser("utilisateur");
            if (!user) return message.reply('l\' utilisateur n\'existe pas');

            let reason = args.getString("raison");
            if (!reason) reason = "Aucune raison";

            if (!(await message.guild.bans.fetch()).get(user.id)) return message.reply('ce membre n\'es pas banni');

            const pingEmbed = {
                color: 0xFFFFFF,
                title: `Unban`,
                description: `${user.tag} a été déban du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``,
                footer: {
                    text: 'Assistant de ziouk.',
                },
            };

            try{await user.send(`tu as été débanni du serveur ${message.guild}`)} catch (err) {}

            await message.channel.send({ embeds: [pingEmbed], ephemeral: false});

            await message.guild.members.unban(user, reason);

        } catch (err) {

            return message.reply('pas de membre '); 
        }
    }
};
