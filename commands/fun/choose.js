const { helpfunc } = require('../general/help')
const { MessageEmbed, Constants } = require('discord.js')
const { invalidCMDUsage } = require('../../functions/Util')

module.exports.run = async (client, message, args, prefix) => {

    if (!args || args.length === 0) return invalidCMDUsage(this.help.name, message.channel, client);

    if (args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);

    let choices = args.join(' ').trim().split('|')

    if (choices.length > 6) return message.channel.send(new MessageEmbed().setAuthor('Excessive choices!', 'https://cdn.discordapp.com/emojis/784165498169458778.png?v=1').setDescription(`**I can only take maximum of 6 choices. Please try again**`).setColor('RED')).then(msg => msg.delete({timeout:4e3})).catch(err => {
            if (err.code != Constants.APIErrors.UNKNOWN_MESSAGE) return console.log(`An Error occured while trying to delete the message`, err)
    })

    choice = choices.filter(c => /\S/.test(c.trim()))
    
    if (choice.some(c => c.length > 30) === true) {
        return message.channel.send(new MessageEmbed().setAuthor('Excessive characters in one or more choices!', 'https://cdn.discordapp.com/emojis/784165498169458778.png?v=1').setDescription(`**Looks like some/one of the choice that you have given exceeds the character limit. Make sure that the options are within 20 characters.**`).setColor('RED')).then(msg => msg.delete({timeout:4e3})).catch(err => {
            if (err.code != Constants.APIErrors.UNKNOWN_MESSAGE) return console.log(`An Error occured while trying to delete the message`, err)
    })
    }
    
    let result = choice[Math.floor(Math.random() * choice.length)].trim()

    const embed = new MessageEmbed()
        .setAuthor(`${message.member.displayName}, I choose`, message.member.user.displayAvatarURL({ dyanmic: true}) || null)
        .setColor('#0099ff')
        .setDescription(`You have given:\n${choice.join(', ')}, I choose:\n**${result}**`)
        .setTimestamp()
    message.channel.send(embed);
}

module.exports.help = {
    name: 'choose',
    description: 'Let the bot choose a random choice from a list of options given by you.',
    aliases: ['choices'],
    usage: 'choose < option 1 | option 2 | option 3 >\nNote: "|" is used to separate your choices!',
    category: 'fun',
    disabled: false
}

module.exports.requirements = {
    ownerOnly: false,
    clientPerms: [],
    userPerms: []
}

module.exports.limits = {
    cooldown: 2e3
}