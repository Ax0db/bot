const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

const wlFilePath = path.join(__dirname, 'wl.json');

const creatorId = '1186741081791004833'

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


function saveWhitelist(whitelist) {
    fs.writeFileSync(wlFilePath, JSON.stringify(whitelist, null, 2));
}

module.exports = {
    name: 'wl',
    description: 'Ajoute ou retire un membre de la whitelist',
    options: [
        {
            type: 'STRING',
            name: 'action',
            description: 'L\'action à effectuer (add ou remove)',
            required: true,
            choices: [
                { name: 'Ajouter', value: 'add' },
                { name: 'Retirer', value: 'remove' },
            ],
        },
        {
            type: 'USER',
            name: 'membre',
            description: 'Le membre à ajouter ou retirer de la whitelist',
            required: true,
        },
    ],
    async run(bot, interaction) {
        const action = interaction.options.getString('action');
        const member = interaction.options.getUser('membre');
        const memberId = member.id;

        const whitelist = loadWhitelist();
        const isWhitelisted = interaction.user.id === creatorId || whitelist.includes(interaction.user.id);

        if (!isWhitelisted) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission d\'exécuter cette commande.', ephemeral: true });
        }

        if (action === 'add') {
            if (whitelist.includes(memberId)) {
                return interaction.reply({ content: 'Le membre est déjà dans la whitelist.', ephemeral: true });
            }
            whitelist.push(memberId);
            saveWhitelist(whitelist);
            await interaction.reply({ content: `Membre <@${memberId}> ajouté à la whitelist.`, ephemeral: true });
        } else if (action === 'remove') {
            if (!whitelist.includes(memberId)) {
                return interaction.reply({ content: 'Le membre n\'est pas dans la whitelist.', ephemeral: true });
            }
            const index = whitelist.indexOf(memberId);
            whitelist.splice(index, 1);
            saveWhitelist(whitelist);
            await interaction.reply({ content: `Membre <@${memberId}> retiré de la whitelist.`, ephemeral: true });
        }
    },
};
