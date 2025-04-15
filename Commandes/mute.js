const discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'mute',
    description: 'mute un membre',
    permission : discord.PermissionFlagsBits.ModerateMembers,
    dm : false,
    category : "Modération",
    options : [
        {   type : "user",
            name : "membre",
            description : "le membre à mute",
            required : true,
            autocomplete : false,
        },
        {   type : "string",
            name : "durée",
            description : "durée du mute",
            required : true,
            autocomplete : false,
        },
        {   type : "string",
            name : "raison",
            description : "raison du mute",
            required : false,
            autocomplete : false,
        }
    ],
    async run(bot, message, args) {
        let user =  args.getUser("membre");
        if (!user) return message.reply('pas de membre trouvé');
        let member  = message.guild.members.cache.get(user.id);
        if (!member) return message.reply('pas de membre trouvé');

        let time = args.getString("durée");
        if (!time) return message.reply('pas de durée');
        if(isNaN(ms(time))) return message.reply('durée invalide');
        if(ms(time) > 2419200000) return message.reply('durée maximale = 28j');

        let reason = args.getString("raison");
        if (!reason) reason = 'pas de raison fournie';  
        
        if (message.user.id === user.id) return message.reply('vous ne pouvez pas vous automute');
        if (message.guild.fetchOwner().id === user.id) return message.reply('vous ne pouvez pas mute le propriétaire du serveur');
        if (!member.moderatable) return message.reply('je neux peux pas mute ce membre');
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply('Vous ne pouvez pas mute ce membre');
        if (member.isCommunicationDisabled()) return message.reply('Ce membre est deja mute');
        const pingEmbed = {
            color: 0xFFFFFF,
            title: `Mute`,
            description: `${user.tag} a été mute du serveur ${message.guild.name} par ${message.user.tag} pendant ${time} pour la raison : \`${reason}\``,
            footer: {
                text: 'Assistant de ziouk.',
            },
        };
        
        try {await user.send(`tu as été mute du serveur ${message.guild.name} par ${message.user.tag} pendant ${time} pour la raison : \`${reason}\``)} catch (err) {}

        await message.channel.send({ embeds: [pingEmbed], ephemeral: false });

        await member.timeout(ms(time), reason);

    }
};