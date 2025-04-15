const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'snipe', // Nom de la commande
    description: 'Affiche le dernier message supprimé dans ce canal.',
    permission: PermissionFlagsBits.ManageMessages, // Limite l'accès à ceux qui ont la permission de gérer les messages
    dm: false, // Indique que cette commande ne peut pas être utilisée en DM
    category: 'modération', // Catégorie de la commande
    options: [], // Aucune option nécessaire pour cette commande
    async run(bot, interaction) {
        const userId = interaction.user.id; 
        // Vérification des permissions
        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        // Récupérer le dernier message supprimé pour ce canal
        const snipedMessage = bot.snipedMessages.get(interaction.channel.id);

        // Vérifier s'il y a un message supprimé
        if (!snipedMessage) {
            return interaction.reply({ content: "Aucun message supprimé n'a été trouvé.", ephemeral: true });
        }

        const { content, author, timestamp } = snipedMessage;
        const time = `<t:${Math.floor(timestamp / 1000)}:R>`; // Formatage de l'horodatage pour Discord

        // Créer un embed pour le message "snipe"
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Couleur de l'embed
            .setTitle('Dernier message supprimé')
            .addFields(
                { name: 'Auteur', value: author, inline: true },
                { name: 'Contenu', value: content || 'Aucun contenu', inline: true },
                { name: 'Supprimé', value: time, inline: true }
            )
            .setTimestamp() // Ajoute l'horodatage actuel
            .setFooter({ text: 'Commande Snipe', iconURL: bot.user.displayAvatarURL() }); // Pied de page de l'embed

        // Envoi de l'embed "snipe"
        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};
