const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

const passwordsFilePath = path.join(__dirname, 'passwords.json');
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

module.exports = {
    name: 'clearmdp',
    description: 'Vide le fichier contenant les mots de passe',
    async run(bot, interaction) {
        const whitelist = loadWhitelist();
        const creatorId = '1186741081791004833'; 
        const isWhitelisted = interaction.user.id === creatorId || whitelist.includes(interaction.user.id);

        if (!isWhitelisted) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission d\'exécuter cette commande.', ephemeral: true });
        }

        try {
            fs.writeFileSync(passwordsFilePath, JSON.stringify({}, null, 2));
            await interaction.reply({ content: 'Le fichier contenant les mots de passe a été vidé avec succès.', ephemeral: true });
        } catch (error) {
            console.error('Erreur lors de la suppression du fichier des mots de passe:', error);
            await interaction.reply({ content: 'Une erreur est survenue lors de la tentative de vider le fichier des mots de passe.', ephemeral: true });
        }
    },
};
