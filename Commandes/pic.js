const discord = require('discord.js');

module.exports = {
    name: 'pic',
    description: 'Affiche la photo de profil de l\'utilisateur',
    permission: discord.PermissionFlagsBits.ModerateMembers, 
    dm: false,
    category: 'osint????', 
    options: [
        {
            type: 'USER',
            name: 'utilisateur',
            description: 'L\'utilisateur dont vous souhaitez afficher la photo de profil',
            required: false,
        },
    ],

    async run(bot, interaction) {
       
        const user = interaction.options.getUser('utilisateur') || interaction.user;

        const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });
        const embed = new discord.EmbedBuilder()
            .setTitle(`${user.tag}'s Profile Picture`)
            .setImage(avatarUrl)
            .setColor('#0099ff');
        await interaction.reply({ embeds: [embed] });
    },
};
