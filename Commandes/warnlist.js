const discord = require('discord.js');

module.exports = {
    name: 'warnlist',
    description: "affiche les warns d'un membre",
    permission : discord.PermissionFlagsBits.ManageMessages,
    dm : false,
    category : "Modération",
    options : [
        {
            type : "user",
            name : "membre",
            description : "le membre dont on veut afficher les warns",
            required : true,
            autocomplete : false,
        },
    ],
    async run(bot, message, args, db) {

        let user = args.getUser('membre');
        if (!user) return message.reply('pas de membre trouvé');
        let member  = message.guild.members.cache.get(user.id);
        if (!member) return message.reply('pas de membre trouvé');

        db.query(`SELECT * FROM warns WHERE guild = '${message.guild.id}' AND user = '${user.id}'`, async (err, req) => {

            if (req.length < 1) return message.reply('aucun warn trouvé');
            await req.sort((a,b) => parseInt(b.date) - parseInt(a.date))

            let embed = new discord.EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle(`Warns de ${member.user.username}`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true}))
            .setTimestamp()
            .setFooter ({text :'Assistant de ziouk.'})

            for(let i = 0; i < req.length; i++) {

                embed.addFields([{name : `Warn n°${i+1}`, value : `> **Auteur** : ${(await bot.users.fetch(req[i].author)).tag}\n > **ID** : \`${req[i].warn}\`\n > **Raison** : \`${req[i].reason}\`\n > **Date** : <t:${Math.floor(parseInt(req[i].date / 1000))}:F>`}])
            }

            await message.reply({ embeds: [embed] });
        });
    },     
};