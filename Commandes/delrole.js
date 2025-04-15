const discord = require('discord.js');
const wl = require('../whitelist.js'); 


module.exports = {
    name: 'delrole',
    description: 'Supprime un rôle d\'un utilisateur.',
    permission: discord.PermissionFlagsBits.ManageRoles,
    dm: false,
    category: "Modération",
    options: [
        {
            type: 'USER',
            name: 'membre',
            description: 'Membre à qui supprimer le rôle',
            required: true,
            autocomplete: false,
        }, 
        {
            type: 'ROLE',
            name: 'role',
            description: 'Rôle à supprimer',
            required: true,
            autocomplete: false,
        }
    ],
    async run(bot, message, args) {
        const userId = interaction.user.id; 
        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
        }
        try {
            const member = args.get('membre').member;
            const role = args.get('role').role;

            if (!member) {
                return message.reply("Membre introuvable.");
            }
            if (!role) {
                return message.reply("Rôle introuvable.");
            }
            if (!member.roles.cache.has(role.id)) {
                return message.reply(`Ce membre n'a pas le rôle ${role.name}.`);
            }
            await member.roles.remove(role);

            return message.reply(`Le rôle ${role.name} a été retiré à ${member.user.tag}.`);
        } catch (error) {
            console.error(error);
            return message.reply("Une erreur s'est produite en essayant de supprimer le rôle.");
        }
    }
};
