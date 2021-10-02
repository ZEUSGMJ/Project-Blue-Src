const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const { separateFlags } = require("../../functions/Util")

module.exports.run = async(client, message, args, prefix) => {

    let flags = ['dbots.co','topgg']
    let flagSet = await separateFlags(message.content,{separator:'--', allowDuplicates: false}, flags)

    for (let flag of flagSet) {
        switch (flag.name) {
            case "dbots.co":

                let stats = {
                   serverCount: `${client.guilds.cache.size}`,
                    shardCount: 0
                }
        try {
            fetch(`https://api.discordbots.co/v1/public/bot/${client.user.id}/stats`,{
                method: 'POST',
                headers:{
                    'Content-Type': "application/json",
                    'Authorization': '04b73e4696e030107e061a9f0f4acb4c998569953745da39f5ada2ad8e8e7cf1b8a92000cf41cd91'
                },
                body: JSON.stringify(stats)
            })
            .then(res => res.json())
            .then(json => {
            //console.log(json)
            if(json.error === false) return message.channel.send(new MessageEmbed().setTitle(`Posted Stats!`).setDescription(`\`\`\`yaml\n${json.response}\`\`\``).setThumbnail('https://cdn.discordapp.com/emojis/772889329205772298.png?v=1').setColor('GREEN').setFooter(`${message.guild.name}`, message.guild.iconURL() ? message.guild.iconURL({ dynamic: true}) : message.author.displayAvatarURL({dynamic:true})));

            return message.channel.send(new MessageEmbed().setTitle(`An Error occured while trying to post the stats`).setDescription(`\`\`\`yaml\n${json.response}\`\`\``).setThumbnail('https://cdn.discordapp.com/emojis/772115933459120138.png?v=1').setColor('RED').setFooter(`${message.guild.name}`, message.guild.iconURL() ? message.guild.iconURL({ dynamic: true}) : message.author.displayAvatarURL({dynamic:true})));
            })
        }catch (err) {
            console.log(`An Error occured while trying to post the stats to the DiscordBot.co API`,err);
            return message.channel.send(new MessageEmbed().setTitle('<:PB_warn:784165498169458778> An Error occured while trykng to post the stats to the API').addField('<:PB_error:772115933459120138> | Error',`\`\`\`js\nError Name: ${err.name}\nMessage: ${err.message}\`\`\``).setColor('RED').setFooter(`${message.guild.name}`, message.guild.iconURL() ? message.guild.iconURL({ dynamic: true}) : message.author.displayAvatarURL({dynamic:true})))
        }               
            break;
        
            case "topgg":
            try {
                await client.dblApi.postStats({
                    serverCount: client.guilds.cache.size
                })

                return message.channel.send(new MessageEmbed().setTitle(`<:PB_checkmark:772889329205772298> | Posted stats to top.gg`).setThumbnail('https://cdn.discordapp.com/emojis/772889329205772298.png?v=1').setDescription(`The bot's stats has been posted to top.gg!`).setColor('GREEN').setFooter(`${message.guild.name}`, message.guild.iconURL() ? message.guild.iconURL({ dynamic: true}) : message.author.displayAvatarURL({dynamic:true})).setTimestamp())
            }catch (err) {
                
                return message.channel.send(new MessageEmbed().setTitle(`<:PB_checkmark:772889329205772298> | Posted stats to top.gg`).setThumbnail('https://cdn.discordapp.com/emojis/772115933459120138.png?v=1').setDescription(`An Error occured while trying to post the stats to top.gg!\n\`\`\`js\n${err}\`\`\``).setColor('RED').setFooter(`${message.guild.name}`, message.guild.iconURL() ? message.guild.iconURL({ dynamic: true}) : message.author.displayAvatarURL({dynamic:true})).setTimestamp())

            }
                break;
        }
    }

}

module.exports.help = {
    name: 'post',
    description: 'Post stats to the botlists.',
    usage: 'post'
}

module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: true
}

module.exports.limits = {
    cooldown: 5e3
}