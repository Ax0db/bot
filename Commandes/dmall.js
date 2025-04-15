const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'dmall',
    description: 'Envoyer un message personnalisé à tous les utilisateurs du serveur',
    permission: PermissionFlagsBits.Administrator,
    dm: false,
    category: 'Modération', 
    options: [
        {
            type: 'STRING',
            name: 'message',
            description: 'Le message personnalisé à envoyer à tous les membres',
            required: true,
        }
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id; 

        // Vérification des permissions et whitelist
        if ( !wl.includes(userId)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const customMessage = interaction.options.getString('message');

            const members = await interaction.guild.members.fetch();
            let successCount = 0;
            let failCount = 0;

            for (const member of members.values()) {
                if (member.user.bot) continue; 

                try {
                    await member.send(customMessage);
                    successCount++;
                } catch (err) {
                    console.error(`Impossible d'envoyer un message à ${member.user.tag}.`);
                    failCount++;
                }
            }

            await interaction.editReply({ content: `Messages envoyés avec succès à ${successCount} membres. Échec pour ${failCount} membres.` });

        } catch (err) {
            console.error(err);
            await interaction.editReply("Une erreur s'est produite lors de l'envoi des messages.");
        }
    },
};
