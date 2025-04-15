const { PermissionFlagsBits, ChannelType } = require('discord.js');
const wl = require('../whitelist.js'); 

module.exports = {
    name: 'raid',
    description: 'Crée un ou plusieurs canaux publics et envoie un message dans chacun d\'eux.',
    permission: PermissionFlagsBits.ManageChannels,
    dm: false,
    category: 'unTOS',
    options: [
        {
            type: 'STRING',
            name: 'type',
            description: 'Définit si la commande crée un ou plusieurs canaux.',
            required: true,
            choices: [
                { name: 'Unique', value: 'unique' },
                { name: 'Multiple', value: 'multiple' }
            ]
        },
        {
            type: 'STRING',
            name: 'message',
            description: 'Définit le message à spammer.',
            required: true,
        },
        {
            type: 'NUMBER',
            name: 'messages',
            description: 'Définit le nombre de messages à envoyer dans chaque canal.',
            required: true,
        },
       
        {
            type: 'STRING',
            name: 'nom',
            description: 'Définit le nom ou le modèle de noms des canaux (utilisé uniquement si le type est "multiple").',
            required: false,
        },
        {
            type: 'NUMBER',
            name: 'nombre',
            description: 'Définit le nombre de canaux à créer (uniquement si le type est "multiple").',
            required: false,
        },
       
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id; 
        if (!wl.includes(userId)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
        }
        try {

            await interaction.reply({ content: 'Commande reçue, je travaille dessus...', ephemeral: true });

            const type = interaction.options.getString('type');
            const nombre = interaction.options.getNumber('nombre');
            const nom = interaction.options.getString('nom');
            const message = interaction.options.getString('message');
            const messages = interaction.options.getNumber('messages');

            if (messages < 1 || messages > 100) {
                return interaction.editReply('Le nombre de messages doit être compris entre 1 et 100.');
            }

            if (type === 'unique') {
                const newChannel = await interaction.guild.channels.create({
                    name: 'canal-unique',
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            allow: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                });

                for (let i = 0; i < messages; i++) {
                    await newChannel.send(message);
                }

                return interaction.editReply(`Un canal public a été créé et le message a été envoyé ${messages} fois.`);
            } else if (type === 'multiple') {
                if (!nombre || nombre < 1 || nombre > 100) {
                    return interaction.editReply('Le nombre de canaux doit être compris entre 1 et 100.');
                }

                if (!nom) {
                    return interaction.editReply('Vous devez fournir un modèle de nom pour les canaux.');
                }

                for (let i = 0; i < nombre; i++) {
                    const newChannel = await interaction.guild.channels.create({
                        name: `${nom}-${i + 1}`,
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                allow: [PermissionFlagsBits.ViewChannel],
                            },
                        ],
                    });

                    for (let j = 0; j < messages; j++) {
                        await newChannel.send(message);
                    }
                }

                return interaction.editReply(`Créé ${nombre} canaux publics avec le modèle de nom "${nom}" et envoyé le message ${messages} fois dans chacun.`);
            } else {
                return interaction.editReply('Type de canal invalide. Veuillez choisir "unique" ou "multiple".');
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply('Une erreur s\'est produite en essayant de créer les canaux et d\'envoyer le message.');
        }
    }
};
