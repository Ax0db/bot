const discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'unmute',
    description: 'unmute un membre',
    permission : discord.PermissionFlagsBits.ModerateMembers,
    dm : false,
    category : "Modération",
    options : [
        {   type : "user",
            name : "membre",
            description : "le membre à unmute",
            required : true,
            autocomplete : false,
        },
        {   type : "string",
            name : "raison",
            description : "raison du unmute",
            required : false,
            autocomplete : false,
        }
    ],
    async run(bot, message, args) {
    
        let user = args.getUser("membre");
        if (!user) return message.reply('pas de membre trouvé');
        let member  = message.guild.members.cache.get(user.id);
        if (!member) return message.reply('pas de membre trouvé');

        let reason = args.getString("raison");
        if (!reason) reason = "Aucune raison";  

        if (!member.moderatable) return message.reply('je neux peux pas unmute ce membre');
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <=0) return message.reply('Vous ne pouvez pas unmute ce membre');
        if (!member.isCommunicationDisabled()) return message.reply('Ce membre est deja unmute');

        const pingEmbed = {
            color: 0xFFFFFF,
            title: `Unmute`,
            description: `${user.tag} a été unmute du serveur ${message.guild.name} par ${message.user.tag}pour la raison : \`${reason}\``,
            footer: {
                text: 'Assistant de ziouk.',
            },
        };

        try {await user.send(`vous avez été unmute de ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}`)} catch (err) {}

        await message.channel.send({ embeds: [pingEmbed], ephemeral: false});
        
        await member.timeout(null, reason);
    },
}