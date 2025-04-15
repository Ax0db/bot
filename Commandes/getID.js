const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'getid', // Nom de la commande
    description: 'Obtiens l\'ID d\'un membre mentionné.',
    permission: PermissionFlagsBits.SendMessages, // Permet d'envoyer des messages, ici accessible à tout le monde
    dm: false, // Indique que cette commande ne peut pas être utilisée en DM
    category: 'utilitaire', // Catégorie de la commande
    options: [
        {
            name: 'membre',
            description: 'Le membre dont vous voulez obtenir l\'ID',
            type: 'USER',
            required: true
        }
    ], // Options pour définir le membre
    async run(bot, interaction) {
        // Récupérer l'utilisateur mentionné
        const member = interaction.options.getUser('membre');
        
        // Répondre avec l'ID de l'utilisateur mentionné
        await interaction.reply({ content: `L'ID de ${member.tag} est ${member.id}.`, ephemeral: true });
    }
};
