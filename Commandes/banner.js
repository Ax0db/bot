const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const discord = require('discord.js');


module.exports = {
    name: 'banner',
    description: 'Affiche la bannière de l\'utilisateur',
    permission: discord.PermissionFlagsBits.ModerateMembers, 
    dm: false,
    category: 'osint????', 
    options: [
        {
            type: 'USER',
            name: 'utilisateur',
            description: 'L\'utilisateur dont vous souhaitez afficher la bannière',
            required: false,
        },
    ],

    async run(bot, interaction) {
        const user = interaction.options.getUser('utilisateur') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        if (!member.user.banner) {
            return await interaction.reply({
                content: `${user.tag} n'a pas de bannière.`,
                ephemeral: false,
            });
        }
        const bannerUrl = member.user.bannerURL({ dynamic: true, size: 1024 });
        const embed = new EmbedBuilder()
            .setTitle(`${user.tag}'s Banner`)
            .setImage(bannerUrl)
            .setColor('#0099ff');
        await interaction.reply({ embeds: [embed] });
    },
};
