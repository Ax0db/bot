const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

const passwordsFilePath = path.join(__dirname, 'passwords.json');

function loadPasswords() {
    if (fs.existsSync(passwordsFilePath)) {
        return JSON.parse(fs.readFileSync(passwordsFilePath, 'utf8'));
    } else {
        return {};
    }
}

module.exports = {
    name: 'getmdp',
    description: 'Récupère un mot de passe après vérification du code utilisateur',
    options: [
        {
            type: 'STRING',
            name: 'code',
            description: 'Le code utilisateur pour accéder aux mots de passe',
            required: true,
        },
        {
            type: 'STRING',
            name: 'site',
            description: 'Le site pour lequel récupérer le mot de passe',
            required: true,
        },
    ],
    async run(bot, interaction) {
        const code = interaction.options.getString('code');
        const site = interaction.options.getString('site');

        const passwords = loadPasswords();

        // Vérification si le mot de passe existe pour le site et le code utilisateur fourni
        const key = `${site}_${code}`;
        if (!passwords[key]) {
            return interaction.reply({ content: `Aucun mot de passe trouvé pour le site **${site}** avec le code fourni.`, ephemeral: true });
        }

        const { identifiant, password } = passwords[key];

        await interaction.reply({
            content: `**Site**: ${site}\n**Identifiant**: ${identifiant}\n**Mot de passe**: ${password}`,
            ephemeral: true 
        });
    },
};
