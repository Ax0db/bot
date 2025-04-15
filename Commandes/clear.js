const discord = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'clear un channel',
    permission : discord.PermissionFlagsBits.ManageMessages,
    dm : false,
    category : "Modération",
    options : [
        {
            type : 'number',
            name : 'nombre',
            description : 'le nombre de messages a supprimer',
            required : true,
            autocomplete : false,
        },
       {
            type : 'channel',
            name : 'salon',
            description : 'le salon a clear',
            required : false,
            autocomplete : false,

       },
       
    ],
    async run(bot, message, args) {
        let channel = args.getChannel("salon");
        if (!channel) channel = message.channel;
        if (channel.id !== message.channel.id && message.guild.channels.cache.get(channel.id)) return message.reply('le salon n\'est pas sur le serveur');

        let number = args.getNumber("nombre");  
        if(parseInt(number) <= 0 || parseInt(number) >= 100) return message.reply('le nombre de messages a supprimer est invalide, choisissez un nombre entre 1 et 100');

        await message.deferReply()

        try {

            let messages = await channel.bulkDelete(parseInt(number));

            await message.followUp({content : `${messages.size} messages ont été supprimés dans le salon ${channel}`, ephemeral : true});


        } catch (err) {

            let message = [...await channel.message.fetch().filter( msg  => !msg.interaction && (Date.now() - msg.createdAt) >= 1209600000).values()];
            if(message.length >=0) return message.followUp(`aucun message a supprimer dans le salon ${channel} ces 14 derniers jours`);
            await channel.bulkDelete(messages);

            await message.followUp({content : `Je n' ai pu supprimer que ${messages.size} dans le salon ${channel} car le reste datait de plus de 14jours`, ephemeral : true});

        }
    }
};
