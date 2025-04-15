const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'jetaime', // Nom de la commande
    description: 'Envoie un message spécial',
    permission: PermissionFlagsBits.ManageChannels, // Permet de limiter l'accès à ceux qui ont la permission de gérer les salons
    dm: false, // Indique que cette commande ne peut pas être utilisée en DM
    category: 'loisir', // Catégorie de la commande
    options: [], // Aucune option nécessaire pour cette commande
    async run(bot, interaction) {
        const userId = interaction.user.id; 
        // Vérification des permissions
        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
        }
        
        // Envoi du message "je t'aime amira lpb du monde"
        await interaction.reply({ content: "je t'aime lahna t'es mon monde", ephemeral: false });
    }
};
