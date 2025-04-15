const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'unlock',
    description: 'Permet aux membres de parler à nouveau dans ce salon.',
    permission: PermissionFlagsBits.ManageChannels,
    dm: false,
    category: 'Modération',
    async run(bot, interaction) {
        const userId = interaction.user.id; 
        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        const channel = interaction.channel;

        try {
            await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
                SendMessages: true
            });

            return interaction.reply({ content: `Le salon ${channel.name} a été déverrouillé avec succès.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: `Une erreur s'est produite lors du déverrouillage du salon.`, ephemeral: true });
        }
    }
};
