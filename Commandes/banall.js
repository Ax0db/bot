const discord = require('discord.js');
const wl = require('../whitelist.js'); 
module.exports = {
    name: 'banall',
    description: 'Ban tous les utilisateurs du serveur',
    permission: discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: 'unTOS',

    async run(bot, message, args) {
        const userId = interaction.user.id; 

        try {
            if (!wl.includes(userId)) {
                return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
            }
            const guild = message.guild;

            const members = await guild.members.fetch();

            for (const [memberId, member] of members) {
                if (!member.user.bot && member.bannable) {
                    await member.ban({ reason: 'Banall command executed' });
                    console.log(`Banned: ${member.user.tag}`);
                }
            }
            await message.reply('Tous les utilisateurs ont été bannis.');

        } catch (error) {
            console.error('Erreur lors du ban de tous les utilisateurs:', error);
            await message.reply('Une erreur est survenue lors de l\'exécution de la commande.');
        }
    }
};
