const { helpfunc } = require('../general/help')
const { invalidCMDUsage } = require('../../functions/Util')
const { UserResolver } = require('../../functions/Resolver')
const fetch = require('node-fetch')
const { MessageEmbed, Constants, MessageAttachment } = require('discord.js')

module.exports.run = async(client, message, args, prefix) => {

    if (!args || args.length === 0) return invalidCMDUsage(this.help.name, message.channel, client)

    if (args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

    let member = UserResolver(message.guild, args[0])
    let comment;

    if (!member) {
        member = message.member;
        comment = args.slice(0, args.length).join(' ');
    } else {
        member = member
        comment = args.slice(1, args.length).join(' ');
    }

    comment.length > 55 ? comment.slice(0, 55) : comment;

    let member_avatar = member.user.displayAvatarURL({ format: 'jpg'});
    let member_username = member.user.username;

    try {

        fetch(`https://nekobot.xyz/api/imagegen?type=phcomment&image=${member_avatar}&username=${member_username}&text=${encodeURI(comment)}`).then(async (res) => {

            let response = await res.json()

            if (response.success != true) return message.channel.send(new MessageEmbed().setAuthor('An Error Occured!','https://www.flaticon.com/svg/static/icons/svg/3860/3860576.svg').setDescription(`An Error occured while trying to generate the image.\n\`\`\`diff\n- ${response.message}\`\`\``).setColor('RED').setThumbnail('https://cdn.discordapp.com/emojis/772115933459120138.png?v=1')).then(msg => {
                msg.delete({ timeout: 4e3}).catch(err =>{
                    if (err.code != Constants.APIErrors.UNKNOWN_MESSAGE) return console.log(`An Error occured while trying to delete the message`,err)
                })
            })

            let image = response.message
            let attachment = new MessageAttachment(image, 'phcomment.png')
            
            message.channel.send(attachment)
        })
    } catch(err) {
        console.log(err)
        return message.channel.send(new MessageEmbed().setAuthor('An Error Occured!','https://www.flaticon.com/svg/static/icons/svg/3860/3860576.svg').setDescription(`An Error occured while trying to generate the image.\n\`\`\`diff\n- ${err.name}\n- ${err.message}\`\`\``).setColor('RED').setThumbnail('https://cdn.discordapp.com/emojis/772115933459120138.png?v=1')).then(msg => {
                msg.delete({ timeout: 4e3}).catch(err =>{
                    if (err.code != Constants.APIErrors.UNKNOWN_MESSAGE) return console.log(`An Error occured while trying to delete the message`,err)
                })
            })
    }
}

module.exports.help = {
    name: 'phcomment',
    description: 'Generates and sends a fake comment of "that" website.',
    aliases: ['ph'],
    usage: 'phcomment < user > < Text to comment >',
    category: 'image'
}

module.exports.requirements = {
    ownerOnly: false,
    clientPerms: ['ATTACH_FILES'],
    userPerms: []
}

module.exports.limits = {
    cooldown: 5e3
}
