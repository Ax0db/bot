const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'say',
    description: 'Envoie un message',
    permission: PermissionFlagsBits.ManageChannels,
    dm: false,
    category: 'loisir',
    options: [
        {
            type: 'STRING',
            name: 'message',
            description: 'Définit le message à envoyer',
            required: true,
        },
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id; 

        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        const messageContent = interaction.options.getString('message');
        await interaction.reply({ content: messageContent, ephemeral: false });
    }
};
