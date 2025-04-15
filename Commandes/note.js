const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js'); 
module.exports = {
    name: 'note',
    description: 'Note un message de 0 à 10',
    permission: PermissionFlagsBits.ManageChannels,
    dm: false,
    category: 'loisir',
    options: [
        {
            type: 'STRING',
            name: 'message',
            description: 'Définit le message à noter',
            required: true,
        },
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id; 
        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }
        const messageContent = interaction.options.getString('message')
        const rating = Math.floor(Math.random() * 11);
        await interaction.reply({ content: `je note ** ${messageContent}**  ${rating}/10`, ephemeral: false });
    }
};
