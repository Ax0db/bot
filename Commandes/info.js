const discord = require('discord.js');

module.exports = {
    name: 'info',
    description: 'Renvoie les informations d\'un utilisateur',
    permission: discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: 'osint????',
    options: [
        {
            type: 'USER',
            name: 'utilisateur',
            description: 'L\'utilisateur dont vous souhaitez obtenir des informations',
            required: false,
        },
    ],

    async run(bot, interaction) {
        const targetUser = interaction.options.getUser('utilisateur') || interaction.user;
        const member = interaction.guild.members.cache.get(targetUser.id);

        if (!member) {
            return interaction.reply({ content: 'Utilisateur non trouvé dans ce serveur.', ephemeral: true });
        }
        const presence = member.presence ? member.presence.activities[0] : null;
        const permissions = member.permissions.toArray().map(perm => `\`${perm}\``).join(', ');
        const badges = targetUser.flags ? targetUser.flags.toArray().map(flag => `\`${flag}\``).join(', ') : 'Aucun';

        // Infos supplémentaires
        const boosting = member.premiumSince ? `Depuis le ${member.premiumSince.toDateString()}` : 'Non';
        const isBanned = await interaction.guild.bans.fetch(targetUser.id).then(() => 'Oui').catch(() => 'Non');
        const daysSinceLastActivity = member.lastMessage ? Math.floor((Date.now() - member.lastMessage.createdTimestamp) / (1000 * 60 * 60 * 24)) : 'Aucun';
        const lastMessage = member.lastMessage ? member.lastMessage.content : 'Aucun';
        const serverCreationDate = interaction.guild.createdAt.toDateString();
        const userJoinedDate = member.joinedAt.toDateString();
        const userStatus = member.presence ? member.presence.status : 'Hors-ligne';
        const customEmojisUsed = member.user.avatar ? 'Possède un avatar personnalisé' : 'Aucun avatar personnalisé';
        const avatarURL = targetUser.avatarURL();
        const isNitro = avatarURL && avatarURL.endsWith('.gif') ? 'Oui' : 'Non';

        let embed = new discord.EmbedBuilder()
            .setColor('#0099ff') 
            .setTitle(`Informations sur ${targetUser.tag}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .setDescription(`Voici les informations détaillées pour ${targetUser.tag}`)
            .addFields(
                { name: '🆔 Nom', value: targetUser.tag || 'Aucun', inline: true },
                { name: 'ID', value: targetUser.id || 'Aucun', inline: true },
                { name: '🤖 Bot', value: targetUser.bot ? 'Oui' : 'Non', inline: true },
                { name: '📅 Créé le', value: targetUser.createdAt ? targetUser.createdAt.toDateString() : 'Inconnu', inline: true },
                { name: '🔗 A rejoint le serveur', value: userJoinedDate || 'Inconnu', inline: true },
                { name: '🏠 Serveur créé le', value: serverCreationDate || 'Inconnu', inline: true },
                { name: '🟢 Statut', value: userStatus || 'Inconnu', inline: true },
                { name: '🎭 Rôles', value: member.roles.cache.size > 0 ? member.roles.cache.map(role => role.name).join(', ') : 'Aucun rôle', inline: true },
                { name: '🚫 Bannissement', value: isBanned || 'Inconnu', inline: true },
                { name: '🚀 Boost serveur', value: boosting || 'Inconnu', inline: true },
                { name: '🔄 Activité actuelle', value: presence ? `${presence.name} (${presence.type})` : 'Aucune', inline: true },
                { name: '🔑 Permissions', value: permissions || 'Aucune permission spéciale', inline: true },
                { name: '🎨 Nitro', value: isNitro, inline: true },
                { name: '🏅 Badges', value: badges || 'Aucun', inline: true },
                { name: '💬 Dernière activité', value: lastMessage || 'Aucune', inline: true },
                { name: '📆 Jours depuis la dernière connexion', value: daysSinceLastActivity || 'Inconnu', inline: true },
                { name: '🔄 Emojis personnalisés', value: customEmojisUsed || 'Aucun', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Informations fournies par votre bot.', iconURL: bot.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [embed] });
    }
};
