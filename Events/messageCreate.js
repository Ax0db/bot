const discord = require('discord.js');
const { PermissionFlagsBits } = require('discord.js');
const wl = require('../whitelist.js');

module.exports = async (bot, message) => {
    // Ignorer les messages des bots et les DM (sauf si la commande le permet)
    if (message.author.bot) return;
    
    // Système d'XP
    if (message.guild) {
        try {
            updateXP(bot, message);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'XP:', error);
        }
    }
    
    // Vérifier si le message commence par le préfixe
    const prefix = bot.config.prefix;
    if (!message.content.startsWith(prefix)) return;
    
    // Extraire les arguments et le nom de la commande
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    
    // Rechercher la commande ou l'alias
    const command = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));
    if (!command) return;
    
    // Vérifier si la commande peut être utilisée en DM
    if (!command.dm && message.channel.type === discord.ChannelType.DM) {
        return message.reply("Cette commande ne peut pas être utilisée en messages privés.");
    }
    
    // Vérifier les permissions
    if (command.permission !== 'aucune') {
        // Vérifier les permissions de l'utilisateur ou la whitelist
        const userId = message.author.id;
        const hasPermission = wl.includes(userId) || message.member.permissions.has(command.permission);
        
        if (!hasPermission) {
            return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }
    }
    
    // Créer un objet similaire aux options des slash commands pour compatibilité
    const options = {
        getUser: (name) => {
            const user = message.mentions.users.first() || bot.users.cache.get(args[0]);
            return user;
        },
        getMember: (name) => {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            return member;
        },
        getRole: (name) => {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
            return role;
        },
        getString: (name) => {
            const argIndex = command.options?.findIndex(opt => opt.name === name);
            return argIndex !== undefined && args[argIndex] ? args.slice(argIndex).join(' ') : null;
        },
        getNumber: (name) => {
            const argIndex = command.options?.findIndex(opt => opt.name === name);
            return argIndex !== undefined && args[argIndex] ? Number(args[argIndex]) : null;
        },
        getChannel: (name) => {
            return message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
        }
    };
    
    // Exécuter la commande
    try {
        await command.run(bot, message, { options }, bot.db);
    } catch (error) {
        console.error(`Erreur lors de l'exécution de la commande ${command.name}:`, error);
        message.reply("Une erreur s'est produite lors de l'exécution de cette commande.");
    }
};

// Fonction pour mettre à jour l'XP
async function updateXP(bot, message) {
    let db = bot.db;
    
    db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`, async (err, req) => {
        if (err) {
            console.error('Erreur SQL dans le système d\'XP:', err);
            return;
        }
        
        if (req.length < 1) {
            db.query(`INSERT INTO xp (guild, user, xp, level) VALUES ('${message.guildId}', '${message.author.id}', '0', '0')`);
        } else {
            let level = parseInt(req[0].level);
            let xp = parseInt(req[0].xp);
            
            if ((level + 1) * 1000 <= xp) {
                db.query(`UPDATE xp SET xp = '${xp - ((level + 1) * 1000)}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`);
                db.query(`UPDATE xp SET level = '${level + 1}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`);
                
                await message.channel.send(`${message.author} est passé au niveau **${level + 1}**, félicitations !`);
            } else {
                let xptogive = Math.floor(Math.random() * 25) + 1;
                db.query(`UPDATE xp SET xp = '${xp + xptogive}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`);
            }
        }
    });
}
