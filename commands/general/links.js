const { MessageEmbed } = require('discord.js')
const { helpfunc } = require('./help')

module.exports.run = (client, message, args, prefix) => {

    let { channel, member, guild } = message

    if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

    let embed = new MessageEmbed()
    .setAuthor(`${client.user.username}'s links`, client.user.displayAvatarURL({ dynamic: true}))
    .setDescription(`Hey **${member.user.username}**, Here's a list of links related to **${client.user.username}**`)
    .addField('<:PB_Invite:788501749807579146> Invite', '[`Click here`](https://discord.com/oauth2/authorize?client_id=724213925767544893&scope=bot&permissions=134741056)', true)
    .addField('<:github:860151911965130794> Github','[`Click here`](https://github.com/ZEUSGMJ/Project-Blue/)', true)
    .setColor("#0099ff")
    .setTimestamp()
    .setFooter(`${guild.name}`, guild.iconURL() ? guild.iconURL({dynamic: true}) : member.user.displayAvatarURL({ dynamic: true}))
    channel.send(embed);
}

module.exports.help = {
    name: 'links',
    description: 'Sends a list of links about the bot',
    usage: 'links',
    category: 'general',
    aliases: ['invite','vote']
}

module.exports.requirements = {
    clientPerms: ['EMBED_LINKS'],
    userPerms: [],
    ownerOnly: false
}

module.exports.limits = {
    cooldown: 2e3
}