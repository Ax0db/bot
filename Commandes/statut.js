const { PermissionFlagsBits, ActivityType } = require('discord.js');
const wl = require('../whitelist.js'); 


module.exports = {
    name: 'statut',
    description: 'Changer le statut du bot',
    permission: PermissionFlagsBits.Administrator,
    dm: false,
    category: 'Modération',
    options: [
        {
            type: 'STRING',
            name: 'type',
            description: 'Type de statut (STREAMING, LISTENING, WATCHING, PLAYING)',
            required: true,
            choices: [
                { name: 'STREAMING', value: 'STREAMING' },
                { name: 'LISTENING', value: 'LISTENING' },
                { name: 'WATCHING', value: 'WATCHING' },
                { name: 'PLAYING', value: 'PLAYING' },
            ],
        },
        {
            type: 'STRING',
            name: 'message',
            description: 'Le message du statut',
            required: true,
        },
        {
            type: 'STRING',
            name: 'url',
            description: 'URL de streaming (uniquement si le type est STREAMING)',
            required: false,
        },
    ],

    async run(bot, interaction) {
        const userId = interaction.user.id; 
        try {

            if (!wl.includes(userId)) {
                return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
            }

            const type = interaction.options.getString('type');
            const message = interaction.options.getString('message');
            const url = interaction.options.getString('url') || undefined;

            let activityType;
            switch (type) {
                case 'STREAMING':
                    activityType = ActivityType.Streaming;
                    break;
                case 'LISTENING':
                    activityType = ActivityType.Listening;
                    break;
                case 'WATCHING':
                    activityType = ActivityType.Watching;
                    break;
                case 'PLAYING':
                    activityType = ActivityType.Playing;
                    break;
                default:
                    return interaction.reply({ content: 'Type de statut invalide.', ephemeral: true });
            }

            // Set the bot's presence
            bot.user.setPresence({
                activities: [{
                    name: message,
                    type: activityType,
                    url: activityType === ActivityType.Streaming ? url : undefined
                }],
                status: 'online'
            });

            console.log(`Statut du bot mis à jour : ${type} ${message}`);

            interaction.reply({ content: `Le statut du bot a été mis à jour avec succès: **${type} ${message}**`, ephemeral: true });
        } catch (err) {
            console.error('Erreur lors de la mise à jour du statut:', err);
            interaction.reply("Une erreur s'est produite lors de la mise à jour du statut.");
        }
    },
};
