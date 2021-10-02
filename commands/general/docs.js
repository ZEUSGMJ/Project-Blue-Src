const { helpfunc } = require('./help')
const fetch = require('node-fetch')
const { invalidCMDUsage } = require('../../functions/Util')
const { MessageEmbed, Constants } = require('discord.js')

module.exports.run = async(client, message, args, prefix) => {
    if (!args || args.length === 0) return invalidCMDUsage(this.help.name, message.channel, client);

    if (args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);

    let m = await message.channel.send(new MessageEmbed().setTitle('<a:PB_loading:778658036688355349> | Fetching data please wait').setColor('#0099ff'))

    let query = args.join(' ')
    
    let v = 'stable'

    const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=${v}&q=${encodeURIComponent(query)}`)
    
    let embed = await res.json()

    if(!embed) return m.edit('',new MessageEmbed().setAuthor(`No Results`,'https://discord.js.org/favicon.ico').setDescription(`**Your search argument \`${query.length > 10 ? query.slice(0,10) : query}\` didn't give any results. Try again later**`).setColor('RED').setTimestamp().setThumbnail('https://cdn.discordapp.com/emojis/771440385100742706.png?v=1')).then(msg => msg.delete({ timeout: 5e3})).catch(err =>{
        if (err.code != Constants.APIErrors.UNKNOWN_MESSAGE) return console.log(`An Error occured while trying to delete the message`,err)
    })
    
    return m.edit('',{embed: embed});
}

module.exports.help = {
    name: 'docs',
    description: 'Searches the Discord.Js docs and sends it in a nice embed.',
    alisases: ['djs','djsdocs'],
    usage: 'docs < query >',
    category:'general'
}

module.exports.requirements = {
    ownerOnly: false,
    clientPerms: ['EMBED_LINKS'],
    userPerms: []
}

module.exports.limits = {
    cooldown: 5e3
}
