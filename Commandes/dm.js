const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js'); 
module.exports = {
    name: 'dm',
    description: 'Envoyer un MP à un utilisateur via son ID',
    permission: PermissionFlagsBits.BanMembers,
    dm: false,
    category: 'Modération',
    options: [
        {
            type: 'STRING',
            name: 'membre',
            description: "L'utilisateur à MP (ID)",
            required: true,
            autocomplete: false,
        },
        {
            type: 'STRING',
            name: 'message',
            description: "Le message à envoyer",
            required: true,
            autocomplete: false,
        }
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id; 
        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
        }

        try {
            const userId = interaction.options.getString('membre');
            const messageContent = interaction.options.getString('message');
            const user = await bot.users.fetch(userId);
            if (!user) {
                return interaction.reply({ content: "L'utilisateur avec cet ID n'existe pas.", ephemeral: false });
            }
            try {
                await user.send(messageContent);
                await interaction.reply({ content: `Le MP a été envoyé avec succès à ${user.tag}.`, ephemeral: false });
            } catch (err) {
                await interaction.reply({ content: `Impossible d'envoyer un message à ${user.tag}.`, ephemeral: false });
            }

        } catch (err) {
            console.error(err);
            interaction.reply({ content: "Une erreur s'est produite lors de l'envoi du MP.", ephemeral: true });
        }
    },
};

