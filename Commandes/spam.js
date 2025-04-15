const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'spam',
    description: 'Envoie un même message en boucle',
    permission: PermissionFlagsBits.ManageChannels,
    dm: false,
    category: 'unTOS',
    options: [
        {
            type: 'STRING',
            name: 'message',
            description: 'Définit le message à spammer.',
            required: true,
        },
        {
            type: 'NUMBER',
            name: 'messages',
            description: 'Définit le nombre de messages à envoyer.',
            required: true,
        },
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id; 

        if (!wl.includes(userId)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
        }
        try {

            const message = interaction.options.getString('message');
            const numberOfMessages = interaction.options.getNumber('messages');

            if (numberOfMessages <= 0) {
                return interaction.reply('Le nombre de messages doit être supérieur à 0.');
            }

            await interaction.reply(`Je vais envoyer le message en boucle ${numberOfMessages} fois.`);

            for (let i = 0; i < numberOfMessages; i++) {

                await interaction.channel.send(message);
            }


            await interaction.followUp(`Le message a été envoyé ${numberOfMessages} fois.`);

        } catch (error) {
            console.error(error);

            await interaction.followUp('Une erreur s\'est produite lors de l\'envoi des messages.');
        }
    }
};
