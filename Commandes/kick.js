const discord = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'kick un utilisateur',
    permission : discord.PermissionFlagsBits.KickMembers,
    dm : false,
    category : "Modération",
    options : [
        {
            type : "user",
            name : "membre",
            description : "Le membre à kick",
            required : true,
            autocomplete : false,
        }, {
            type : "string",
            name : "raison",
            description : "La raison du kick",
            required : false,
            autocomplete : false,
        }
    ],
    async run(bot, message, args) {

       
        
        let user =  args.getUser("membre");
        if (!user) return message.reply('pas de membre trouvé');
        let member  = message.guild.members.cache.get(user.id);
        if (!member) return message.reply('pas de membre trouvé');
        let reason = args.getString("raison")
        if (!reason) reason = "Aucune raison fournie"

        if (message.user.id === user.id) return message.reply('Vous ne pouvez pas vous kick');
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply('Vous ne pouvez pas kick le propriétaire du serveur');
        if (member && !member.kickable) return message.reply('Je ne peux pas kick ce membre');
        if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply('Vous ne pouvez pas kick ce membre');

        const pingEmbed = {
            color: 0xFFFFFF,
            title: `Kick`,
            description: `${user.tag} a été kick du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``,
            footer: {
                text: 'Assistant de ziouk.',
            },
        };

        try {await user.send(`tu as été kick du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)} catch (err) {}
        await message.channel.send({ embeds: [pingEmbed], ephemeral: false});
        await member.kick(reason);

        
    }
};
