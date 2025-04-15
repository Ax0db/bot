const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Chemin du fichier JSON pour stocker les mots de passe
const passwordsFilePath = path.join(__dirname, 'passwords.json');

// Fonction pour générer un mot de passe aléatoire
function generateRandomPassword(length = 12) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
}

// Fonction pour générer un code utilisateur unique
function generateUserCode() {
    return crypto.randomBytes(6).toString('hex'); // Génère un code hexadécimal de 12 caractères
}

// Charger les mots de passe existants
function loadPasswords() {
    if (fs.existsSync(passwordsFilePath)) {
        const data = fs.readFileSync(passwordsFilePath, 'utf8');
        if (data.trim().length === 0) {
            return {};
        }
        return JSON.parse(data);
    } else {
        return {};
    }
}

// Sauvegarder les mots de passe dans le fichier JSON
function savePasswords(passwords) {
    fs.writeFileSync(passwordsFilePath, JSON.stringify(passwords, null, 2));
}

module.exports = {
    name: 'mdp',
    description: 'Génère un mot de passe aléatoire et le stocke avec les informations fournies',
    options: [
        {
            type: 'STRING',
            name: 'site',
            description: 'Le nom du site ou du service',
            required: true,
        },
        {
            type: 'STRING',
            name: 'identifiant',
            description: 'L\'identifiant pour le site ou le service',
            required: true,
        },
        {
            type: 'INTEGER',
            name: 'length',
            description: 'La longueur du mot de passe (par défaut 12)',
            required: false,
        },
    ],
    async run(bot, interaction) {
        const site = interaction.options.getString('site');
        const identifiant = interaction.options.getString('identifiant');
        const length = interaction.options.getInteger('length') || 12;

        const password = generateRandomPassword(length);
        const userCode = generateUserCode(); // Génère un code utilisateur unique

        const passwords = loadPasswords();
        passwords[`${site}_${userCode}`] = { // Associe le site avec le code utilisateur unique
            identifiant: identifiant,
            password: password,
        };

        savePasswords(passwords);

        try {
            // Essayer d'envoyer un DM à l'utilisateur
            await interaction.user.send(`Votre code utilisateur pour le site **${site}** est : \`${userCode}\`. Veuillez le conserver pour accéder à ce mot de passe.`);
            await interaction.reply({ content: 'Mot de passe généré et code envoyé en DM.', ephemeral: true });
        } catch (error) {
            // Si l'envoi de DM échoue, afficher le code dans un message éphémère
            await interaction.reply({
                content: `Mot de passe généré pour **${site}** avec l'identifiant **${identifiant}**. Le mot de passe a été stocké en toute sécurité.\nVotre code utilisateur est: \`${userCode}\`. Veuillez le conserver pour accéder à ce mot de passe.`,
                ephemeral: true
            });
        }
    },
};
