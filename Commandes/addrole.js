const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'addrole',
    description: 'Ajoute un rôle à un utilisateur.',
    permission: PermissionFlagsBits.ManageRoles,
    dm: false,
    category: 'Modération',
    options: [
        {
            type: 'USER',
            name: 'membre',
            description: 'Membre à qui ajouter le rôle',
            required: true,
            autocomplete: false,
        },
        {
            type: 'ROLE',
            name: 'role',
            description: 'Rôle à ajouter',
            required: true,
            autocomplete: false,
        }
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id; 
        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
        }
        try {
            const member = interaction.options.getMember('membre');
            const role = interaction.options.getRole('role');

            if (!member) {
                return interaction.reply("Membre introuvable.");
            }
            if (!role) {
                return interaction.reply("Rôle introuvable.");
            }

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
                return interaction.reply("Je n'ai pas la permission de gérer les rôles.");
            }

            if (interaction.guild.members.me.roles.highest.position <= role.position) {
                return interaction.reply("Je ne peux pas gérer ce rôle car il est plus élevé que mon rôle.");
            }

            if (member.roles.cache.has(role.id)) {
                return interaction.reply(`Ce membre a déjà le rôle ${role.name}.`);
            }
            await member.roles.add(role);

            return interaction.reply(`Le rôle ${role.name} a été ajouté à ${member.user.tag}.`);

        } catch (error) {
            console.error(error);
            return interaction.reply("Une erreur s'est produite en essayant d'ajouter le rôle.");
        }
    }
};
