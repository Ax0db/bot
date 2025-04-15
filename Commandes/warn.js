const discord = require('discord.js');

module.exports = {
    name: 'warn',
    description: 'warn un membre',
    permission : discord.PermissionFlagsBits.ManageMessages,
    dm : false,
    category : "Modération",
    options : [
        {   type : "user",
            name : "membre",
            description : "le membre à warn",
            required : true,
            autocomplete : false,
        },
        {   type : "string",
            name : "raison",
            description : "raison du warn",
            required : false,
            autocomplete : false,
        }
    ],
    async run(bot, message, args, db) {
       
        let user = args.getUser("membre");
        if(!user) return message.reply('pas de membre trouvé');
        let member  = message.guild.members.cache.get(user.id);
        if (!member) return message.reply('pas de membre trouvé');

        let reason = args.getString("raison");
        if (!reason) reason = "Aucune raison fournie";

        if (message.user.id === user.id) return message.reply('Vous ne pouvez pas vous warn');
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply('Vous ne pouvez pas warn le propriétaire du serveur');
        if ( message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply('Vous ne pouvez pas warn ce membre');
        if ( (await message.guild.members.fetchMe()).roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply('Je ne peux pas warn ce membre');

        try {await user.send(`tu as été warn du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)} catch (err) {}

        await message.reply (` Vous avez warn ${user.tag} pour la raison \`${reason}\` avec succès! ` )

        let ID = await bot.functions.createId('WARN');

        db.query(`INSERT INTO warns (guild, user, author, warn, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)

        //https://currentmillis.com pour convertir les ms en date réelle



    }
};