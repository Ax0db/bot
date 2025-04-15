const { PermissionFlagsBits, ChannelType } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'nuke',
    description: 'recrée le salon',
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
            const channel = interaction.channel;
            const channelName = channel.name;
            const channelPosition = channel.position;
            const channelType = channel.type;
            const channelParent = channel.parent;
            const channelPermissions = channel.permissionOverwrites.cache.map(overwrite => ({
                id: overwrite.id,
                allow: overwrite.allow.toArray(),
                deny: overwrite.deny.toArray(),
            }));

            await channel.delete();

            const newChannel = await channel.guild.channels.create({
                name: channelName,
                type: channelType === ChannelType.GuildText ? ChannelType.GuildText : ChannelType.GuildVoice,
                parent: channelParent,
                position: channelPosition,
                permissionOverwrites: channelPermissions,
            });

            

        } catch (error) {
            console.error(error);
            await interaction.reply('Une erreur s\'est produite lors de la tentative de nuke du salon.');
        }
    }
};
