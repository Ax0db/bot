const discord = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'createrole',
    description: 'Crée un rôle avec des permissions spécifiques',
    permission: 'ManageRoles',
    dm: false,
    category: 'administration',
    options: [
        {
            type: 'STRING',
            name: 'nom',
            description: 'Le nom du rôle à créer',
            required: true,
        },
        {
            type: 'STRING',
            name: 'type',
            description: 'Le type de permissions du rôle',
            required: true,
            choices: [
                { name: 'Admin', value: 'admin' },
                { name: 'Staff', value: 'staff' },
                { name: 'Haut-Staff', value: 'haut-staff' },
                { name: 'Image', value: 'image' }
            ],
        },
        {
            type: 'STRING',
            name: 'couleur',
            description: 'La couleur du rôle (hexadécimal, ex: #ff0000)',
            required: false,
        },
        {
            type: 'INTEGER',
            name: 'position',
            description: 'La position hiérarchique du rôle',
            required: false,
        },
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id; 
        const roleName = interaction.options.getString('nom');
        const roleType = interaction.options.getString('type');
        const roleColor = interaction.options.getString('couleur') || null;
        const rolePosition = interaction.options.getInteger('position') || null;
        const guild = interaction.guild;

        // Vérification des permissions et whitelist
        if (!interaction.member.permissions.has('ManageRoles') && !wl.includes(userId)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        let permissions;

        switch (roleType) {
            case 'admin':
                permissions = ['Administrator'];
                break;
            case 'staff':
                permissions = ['MuteMembers', 'DeafenMembers'];
                break;
            case 'haut-staff':
                permissions = ['KickMembers', 'MuteMembers', 'DeafenMembers'];
                break;
            case 'image':
                permissions = ['AttachFiles', 'EmbedLinks'];
                break;
            default:
                return interaction.reply({ content: 'Type de rôle invalide.', ephemeral: true });
        }

        try {
            const roleData = {
                name: roleName,
                permissions: permissions,
                color: roleColor,
                reason: `Rôle créé par ${interaction.user.tag}`,
            };

            if (rolePosition !== null) {
                roleData.position = rolePosition;
            }

            const role = await guild.roles.create(roleData);

            const replyMessage = `Le rôle **${roleName}** a été créé avec succès.\n` +
                `Couleur: ${roleColor || 'Défaut'}\n` +
                `Position: ${rolePosition !== null ? rolePosition.toString() : 'Défaut'}`;

            await interaction.reply({ content: replyMessage, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue lors de la création du rôle.', ephemeral: true });
        }
    }
};
