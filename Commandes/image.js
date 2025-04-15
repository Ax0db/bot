const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'image',
    description: 'envoie une image du thème précisé',
    permission: PermissionFlagsBits.ManageChannels,
    dm: false,
    category: 'loisir',
    options: [
        {
            type: 'STRING',
            name: 'message',
            description: "Le thème de l'image à générer",
            required: true,
        },
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id; 

        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        const theme = interaction.options.getString('message');

        try {
            const imageUrl = `https://source.unsplash.com/600x400/?${encodeURIComponent(theme)}`;

            const rating = Math.floor(Math.random() * 11);

            const embed = {
                image: {
                    url: imageUrl,
                },
                color: 0x0099ff,
            };

            await interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Une erreur s'est produite lors de la génération de l'image.", ephemeral: true });
        }
    },
};
