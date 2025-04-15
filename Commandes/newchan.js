const { PermissionFlagsBits, ChannelType } = require('discord.js');
const wl = require('../whitelist.js'); 
module.exports = {
    name: 'newchan',
    description: 'Crée un canal.',
    permission: PermissionFlagsBits.ManageChannels, 
    dm: false,
    category: 'Gestion serveur',
    options: [
        {
            type: 'STRING',
            name: 'nom',
            description: 'Nom du canal',
            required: true,
            autocomplete: false,
        },
        {
            type: 'STRING',
            name: 'confidentialité',
            description: 'Défini le canal comme étant "privé" ou "public"',
            required: true,
            autocomplete: false,
            choices: [
                { name: 'Public', value: 'public' },
                { name: 'Privé', value: 'privé' }
            ]
        }
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id; 
        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
        }
        try {
            const channelName = interaction.options.getString('nom');
            const confidentialité = interaction.options.getString('confidentialité');

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
                return interaction.reply('Je n\'ai pas la permission de gérer les canaux.');
            }

            let permissionOverwrites;

            if (confidentialité === 'privé') {
                permissionOverwrites = [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.member.id,
                        allow: [PermissionFlagsBits.ViewChannel], 
                    },
                ];
            } else {
                // Canal public
                permissionOverwrites = [
                    {
                        id: interaction.guild.id,
                        allow: [PermissionFlagsBits.ViewChannel], 
                    },
                ];
            }

            await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText, 
                permissionOverwrites: permissionOverwrites,
            });

            return interaction.reply(`Le canal ${confidentialité === 'privé' ? 'privé' : 'public'} ${channelName} a été créé avec succès.`);
        } catch (error) {
            console.error(error);
            return interaction.reply('Une erreur s\'est produite en essayant de créer le canal.');
        }
    }
};
