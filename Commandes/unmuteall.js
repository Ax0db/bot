const discord = require('discord.js');
const wl = require('../whitelist.js'); 


module.exports = {
    name: 'unmuteall',
    description: 'Unmute tous les membres muets',
    permission: discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: 'Modération',

    async run(bot, message, args) {
        const userId = interaction.user.id; 
        if (!wl.includes(userId) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: false });
        }
        try {
            const guild = message.guild;
            const members = await guild.members.fetch();

            let unmutedCount = 0;e
            for (const [memberId, member] of members) {
                if (member.isCommunicationDisabled()) {
                    await member.timeout(null); 
                    console.log(`Unmuted: ${member.user.tag}`);
                    unmutedCount++;
                }
            }

            await message.reply(`${unmutedCount} membres ont été unmute.`);

        } catch (error) {
            console.error('Erreur lors de l\'unmute de tous les membres:', error);
            await message.reply('Une erreur est survenue lors de l\'exécution de la commande.');
        }
    }
};
