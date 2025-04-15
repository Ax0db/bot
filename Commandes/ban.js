const discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'ban un utilisateur',
    permission : discord.PermissionFlagsBits.BanMembers,
    dm : false,
    category : "Modération",
    options : [
        {
            type : "user",
            name : "membre",
            description : "Le membre à bannir",
            required : true,
            autocomplete : false,
        }, {
            type : "string",
            name : "raison",
            description : "La raison du ban",
            required : false,
            autocomplete : false,
        }
    ],
    async run(bot, message, args) {

        try {
        
            let user = await bot.users.fetch(args._hoistedOptions[0].value);
            if (!user) return message.reply('le membre n\'existe pas');
            let member  = message.guild.members.cache.get(user.id);

            let reason = args.getString("raison");
            if (!reason) reason = "Aucune raison fournie"

            if (message.user.id === user.id) return message.reply('Vous ne pouvez pas vous bannir');
            if ((await message.guild.fetchOwner()).id === user.id) return message.reply('Vous ne pouvez pas bannir le propriétaire du serveur');
            if (member && !member.bannable) return message.reply('Je ne peux pas bannir ce membre');
            if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply('Vous ne pouvez pas bannir ce membre');
            if ((await message.guild.bans.fetch()).get(user.id)) return message.reply('ce membre a déjà été banni');

            const pingEmbed = {
                color: 0xFFFFFF,
                title: `Ban`,
                description: `${user.tag} a été ban du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``,
                footer: {
                    text: 'Assistant de ziouk.',
                },
            };
            
            try {await user.send(`tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)} catch (err) {}

            await message.channel.send({ embeds: [pingEmbed], ephemeral: false});

            await message.guild.bans.create(user.id, { reason: reason });
            

        } catch (err) {
            return message.reply('pas de membre a bannir'); 
        }   
    }
};
