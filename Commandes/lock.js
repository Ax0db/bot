const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'lock',
    description: 'Empêche les membres de parler dans ce salon.',
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
                SendMessages: false
            });

            return interaction.reply({ content: `Le salon ${channel.name} a été verrouillé avec succès.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: `Une erreur s'est produite lors du verrouillage du salon.`, ephemeral: true });
        }
    }
};
