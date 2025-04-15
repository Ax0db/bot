const discord = require('discord.js');
const canvas = require("discord-canvas");

module.exports = {
    name: 'rank',
    description: "Affiche l'expérience d'un membre",
    permission: 'aucune',
    dm: false,
    category: "Expérience",
    options: [
        {
            type: "user",
            name: "membre",
            description: "XP de l'utilisateur",
            required: false,
            autocomplete: false,
        },
    ],

    async run(bot, message, args, db) {
        let utilisateur;

    if (args.getUser("membre")) {
        utilisateur = args.getUser("membre");
        if (!utilisateur || !message.guild.members.cache.get(utilisateur?.id)) return message.reply("L'utilisateur spécifié n'existe pas.");
    } else {
        return message.reply("Veuillez spécifier un utilisateur.");
    }
    if (!utilisateur) {
        return message.reply("Impossible de trouver l'utilisateur spécifié.");
    }
    const guildId = message.guild ? message.guild.id : 'DM';

        db.query(`SELECT * FROM xp WHERE guild = '${message.guild ? message.guild.id : 'DM'}' AND user = '${utilisateur.id}'`, async (err, resultat) => {
            if (resultat.length < 1) return message.reply("Ce membre n'a pas d'XP.");

            await message.deferReply();

            db.query(`SELECT * FROM xp WHERE guild = '${message.guild.id}'`, async (err, tous) => {
                tous = tous.sort((a, b) => (calculXp(parseInt(b.level))) - (calculXp(parseInt(a.level))));
                const xp = parseInt(resultat[0].xp);
                const level = parseInt(resultat[0].level);
                const rang = tous.findIndex(r => r.user === utilisateur.id) + 1;
                const besoin = calculXp(level + 1);

                const carte = await new canvas.Card()
                    .setBackground("https://lofi-landing.nyc3.cdn.digitaloceanspaces.com/craft-your-productive-environment/slideshow/bedroom-view/night.jpg")
                    .setBot(bot)
                    .setColorFont("#ffffff")
                    .setRank(rang)
                    .setUser(utilisateur)
                    .setColorProgressBar("#000000")
                    .setGuild(message.guild)
                    .setXp(xp)
                    .setLevel(level)
                    .setXpNeed(besoin)
                    .toCard();

                await message.followUp({ files: [new discord.AttachmentBuilder(carte.toBuffer(), "rank.png" )]});
            });
        });
    }
};

function calculXp(level) {
    return Math.floor(1000 * Math.pow(level, 1.5));
}