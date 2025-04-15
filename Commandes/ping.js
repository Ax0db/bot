const discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Ping du bot',
    permission : 'aucune',
    dm : true,
    category : "information",
    async run(bot, message) {
        let botU = bot.user.username;
        let Embed = new discord.EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle(`Ping de ${botU}`)
            .setThumbnail(bot.user.displayAvatarURL({dynamic : true}))
            .setDescription(`Voici le ping renvoyé par le bot : \`${bot.ws.ping}ms\``)
            .setTimestamp()
            .setFooter({text: 'Assistant de ziouk.', iconURL: bot.user.displayAvatarURL({dynamic : true})});
        await message.channel.send({ embeds: [Embed], ephemeral: true });
    }
};