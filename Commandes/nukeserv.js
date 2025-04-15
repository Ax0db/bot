const { PermissionFlagsBits, ChannelType } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'nukeserv',
    description: 'Supprime tous les salons du serveur sauf celui où la commande est utilisée.',
    permission: PermissionFlagsBits.ManageChannels,
    dm: false,
    category: 'Gestion serveur',
    options: [],

    async run(bot, interaction) {
        
        const userId = interaction.user.id; 
        if (!wl.includes(userId)) { 
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
        }
        try {
            
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
                return interaction.reply('Je n\'ai pas la permission de gérer les salons.');
            }
            const commandChannel = interaction.channel;

            await interaction.reply('Je suis en train de supprimer tous les salons ...');

            const channels = interaction.guild.channels.cache;

            for (const [id, channel] of channels) {
                if (channel.id !== commandChannel.id) {
                    try {
                        await channel.delete();
                    } catch (error) {
                        console.error(`Erreur lors de la suppression du salon ${channel.name}: ${error.message}`);
                    }
                }
            }

            await interaction.followUp('Tous les salons ont été supprimés.');

        } catch (error) {
            console.error(error);
            await interaction.followUp('Une erreur s\'est produite lors de la suppression des salons.');
        }
    }
};
