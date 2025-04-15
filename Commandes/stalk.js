const { PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const wlFilePath = path.join(__dirname, 'wl.json');

function loadWhitelist() {
    if (fs.existsSync(wlFilePath)) {
        const data = fs.readFileSync(wlFilePath, 'utf8');
        if (data.trim().length === 0) {
            return [];
        }
        return JSON.parse(data);
    } else {
        return [];
    }
}

const creatorId = '1022996880302551071'; // Remplacez par l'ID du propriétaire du bot

module.exports = {
    name: 'stalk',
    description: 'Définit l\'utilisateur à surveiller et celui à notifier.',
    permission: PermissionFlagsBits.ManageMessages, // Limite l'accès à ceux qui ont la permission de gérer les messages
    dm: false, // Indique que cette commande ne peut pas être utilisée en DM
    category: 'modération', // Catégorie de la commande
    options: [
        {
            name: 'utilisateur_surveille',
            description: 'L\'ID de l\'utilisateur à surveiller',
            type: 'STRING',
            required: true
        },
        {
            name: 'utilisateur_notifie',
            description: 'L\'ID de l\'utilisateur à notifier',
            type: 'STRING',
            required: true
        }
    ], // Options pour définir les utilisateurs
    async run(bot, interaction) {
        // Vérification des permissions
        if ( interaction.user.id !== creatorId) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        // Récupérer les options fournies
        const utilisateurSurveille = interaction.options.getString('utilisateur_surveille');
        const utilisateurNotifie = interaction.options.getString('utilisateur_notifie');

        // Enregistrer les utilisateurs dans le bot
        bot.stalkData = {
            userIdToWatch: utilisateurSurveille,
            notifyUserId: utilisateurNotifie
        };

        // Répondre à l'interaction
        await interaction.reply({ content: `Utilisateur à surveiller : ${utilisateurSurveille}\nUtilisateur à notifier : ${utilisateurNotifie}`, ephemeral: false });
    }
};
