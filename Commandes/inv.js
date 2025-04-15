const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'inv',
    description: 'Envoyer une invitation à un utilisateur via son ID',
    permission: PermissionFlagsBits.BanMembers,
    dm: false,
    category: 'Modération',
    options: [
        {
            type: 'STRING',
            name: 'membre',
            description: "L'utilisateur à inviter (ID)",
            required: true,
            autocomplete: false,
        },
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id; 

        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
        }
        try {
            const userId = interaction.options.getString('membre');

            const user = await bot.users.fetch(userId);
            if (!user) return interaction.reply("L'utilisateur avec cet ID n'existe pas.");

            const invite = await interaction.guild.invites.create(interaction.channelId, {
                maxUses: 1,
                unique: true,
                reason: `Invitation envoyée à ${user.tag} par ${interaction.user.tag}`
            });

            try {
                await user.send(`Bonjour ${user.username}, vous êtes invité à rejoindre le serveur ${interaction.guild.name} : ${invite.url}`);
                await interaction.reply({ content: `L'invitation a été envoyée avec succès à ${user.tag}.`, ephemeral: false });
            } catch (err) {
                await interaction.reply({ content: `Impossible d'envoyer un message à ${user.tag}.`, ephemeral: false });
            }

        } catch (err) {
            console.error(err);
            interaction.reply("Une erreur s'est produite lors de l'envoi de l'invitation.");
        }
    },
};
