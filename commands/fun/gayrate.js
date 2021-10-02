const { helpfunc } = require('../general/help');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, prefix) => {

    if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

    let response, { channel, guild, member } = message;
    let AuthorResponse = ['You are', 'Man, not gonna lie, you are', 'You ain\'t gonna believe it, but you are', 'Turns out, You are', 'See See, I\'be been telling you that you are']
    let argsResponse = ['{args} is', 'Man, not gonna lie, {args} is', 'You ain\'t gonna believe it, but {args} is ', 'Okay, so i did some research on {args} and turns out, They are','Listen, I know it may be hard to believe for some, but {args} is','Psst, the government doesn\'t want you to know this, but I\'ve heard that {args} is']

    let gayrate = Math.floor(Math.random() * 100)

    if (args.length === 0) response = `${AuthorResponse[Math.floor(Math.random() * AuthorResponse.length)]} **${gayrate}%** gay.`;

    if (args.length != 0) {
        response = `${argsResponse[Math.floor(Math.random() * argsResponse.length)].replace('{args}', args.join(' '))} **${gayrate}%** gay..`
    }

    let embed = new MessageEmbed()
        .setTitle('Gay% calculator')
        .setDescription(`${response}`)
        .setColor('RANDOM')
        .setTimestamp()
        .setFooter(`${guild.name}`, guild.iconURL() ? guild.iconURL({ dynamic: true}) : member.user.displayAvatarURL({dynamic: true}))
    channel.send(embed)
}

module.exports.help = {
    name: 'gayrate',
    description: 'Shows how gay you/mentioned member is',
    usage: 'gayrate [ user ]',
    aliases: ['howgay'],
    category: 'fun'
}

module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: false
}

module.exports.limits = {
    cooldown: 2e3
}