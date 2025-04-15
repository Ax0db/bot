const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js'); 


module.exports = {
    name: 'massrole',
    description: 'Ajoute un rôle à tous les utilisateurs du serveur.',
    permission: PermissionFlagsBits.ManageRoles,
    dm: false,
    category: 'Modération',
    options: [
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

        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
        }

        const role = interaction.options.getRole('role');

        if (!role) {
            return interaction.reply({ content: "Rôle introuvable.", ephemeral: false });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: "Je n'ai pas la permission de gérer les rôles.", ephemeral: false });
        }

        if (interaction.guild.members.me.roles.highest.position <= role.position) {
            return interaction.reply({ content: "Je ne peux pas gérer ce rôle car il est plus élevé que mon rôle.", ephemeral: false });
        }

        await interaction.reply({ content: `Ajout du rôle ${role.name} à tous les membres...`, ephemeral: false });

        const members = await interaction.guild.members.fetch();

        let addedCount = 0;
        let failedCount = 0;

        for (const member of members.values()) {
            if (!member.roles.cache.has(role.id)) {
                try {
                    await member.roles.add(role);
                    addedCount++;
                } catch (error) {
                    console.error(`Erreur lors de l'ajout du rôle à ${member.user.tag}:`, error);
                    failedCount++;
                }
            }
        }

        return interaction.followUp({ 
            content: `Le rôle ${role.name} a été ajouté à ${addedCount} membre(s). ${failedCount} membre(s) n'ont pas pu recevoir le rôle.`, 
            ephemeral: false 
        });
    }
};
