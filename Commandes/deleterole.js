const discord = require('discord.js');
const wl = require('../whitelist.js');

module.exports = {
    name: 'deleterole',
    description: 'Supprime un rôle en utilisant son ID',
    permission: 'ManageRoles',
    dm: false,
    category: 'administration',
    options: [
        {
            type: 'STRING',
            name: 'roleid',
            description: 'L\'ID du rôle à supprimer',
            required: true,
        },
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id;
        const roleId = interaction.options.getString('roleid');
        const guild = interaction.guild;

        // Vérification des permissions et whitelist
        if (!interaction.member.permissions.has('ManageRoles') && !wl.includes(userId)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        // Récupérer le rôle à partir de son ID
        const role = guild.roles.cache.get(roleId);

        if (!role) {
            return interaction.reply({ content: `Aucun rôle trouvé avec l'ID **${roleId}**.`, ephemeral: false });
        }

        // Vérifier si le bot a la permission de gérer des rôles
        if (!guild.members.me.permissions.has(discord.PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'Le bot n\'a pas la permission de gérer les rôles.', ephemeral: false });
        }

        // Vérifier si le rôle est inférieur au rôle du bot dans la hiérarchie
        if (role.position >= guild.members.me.roles.highest.position) {
            return interaction.reply({ content: 'Le rôle à supprimer est égal ou supérieur au rôle du bot dans la hiérarchie. Impossible de le supprimer.', ephemeral: false });
        }

        try {
            // Supprimer le rôle
            await role.delete(`Rôle supprimé par ${interaction.user.tag}`);
            await interaction.reply({ content: `Le rôle **${role.name}** a été supprimé avec succès.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue lors de la suppression du rôle.', ephemeral: false });
        }
    }
};