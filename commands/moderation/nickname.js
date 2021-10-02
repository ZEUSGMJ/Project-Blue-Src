const { helpfunc } = require('../general/help')
const { UserResolver } = require('../../functions/Resolver')
const { invalidCMDUsage, separateFlags, invalidMember,invalidFlags } = require('../../functions/Util')
const { MessageEmbed } = require('discord.js')

module.exports.run = async (client, message, args, prefix) => {

    let {channel, content, guild, member} = message

    if(args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);

    let flags = ['set', 'remove']
    let flagSet = await separateFlags(content, {separator: '--',allowDuplicates: false}, flags)

    if (!args || args.length === 0) return invalidCMDUsage(this.help.name, channel, client)

    for (let flag of flagSet) {
        switch(flag.name) {
            case "set":

                if (flag.validArgs != true) return invalidCMDUsage(this.help.name, channel, client)
                
                let flagSetArgs = flag.args.split(/ +/g, 1);
                let target_member = UserResolver(guild, flagSetArgs.toString())

                if (!target_member) return invalidMember(channel);

                let perms = checkPerms(member, target_member)

                if (perms != null) return channel.send(new MessageEmbed().setTitle(`<:PB_crossCheckmark:771440385100742706> | ${perms}`).setColor('RED'))

                let nick = flag.args.slice(flagSetArgs.toString().length).trim()

                if (nick.length > 32) return channel.send(new MessageEmbed().setTitle(`<:PB_crossCheckmark:771440385100742706> | Nickname must be 32 or fewer in length.`).setDescription(`You have exceeded ${nick.length - 32} characters.`).setColor('RED'))
                
                await target_member.setNickname(nick, `Nickname changed by ${member.user.username}`)

                channel.send(new MessageEmbed().setTitle('<:PB_checkmark:772889329205772298> | Success').setDescription(`Changed ${target_member.user.username}'s nickname to **${nick}** `).setColor("GREEN"))

                break;
            
            case "remove":

                let flagRemoveArgs = flag.args.split(/ +/g, 1);
                let target_member_remove = UserResolver(guild, flagRemoveArgs.toString())

                if (!target_member_remove) return invalidMember(channel);

                let perm = checkPerms(member, target_member_remove)

                if (perm != null) return channel.send(new MessageEmbed().setTitle(`<:PB_crossCheckmark:771440385100742706> | ${perms}`).setColor('RED'))

                await target_member_remove.setNickname(null, `Nickname was removed by ${member.user.username}`)

                channel.send(new MessageEmbed().setTitle('<:PB_checkmark:772889329205772298> | Success').setDescription(`Removed ${target_member_remove.user.username}'s nickname.`).setColor("GREEN"))
                break;

            default:
                if (!flag.name)  invalidFlags(flags, channel)
                break;
        }
    }

}

function checkPerms(author, targer_member) {

    if (targer_member.manageable != true) return `I cannot change the nickname for ${targer_member.user.username} since they are higher in role position than me.`;

    if (author.roles.highest.rawPosition < targer_member.roles.highest.rawPosition) return `I cannot change the nickname for ${targer_member.user.username} since they have a role/roles higher than you.`

    if (author.roles.highest.id == targer_member.roles.highest.id) return `I cannot change the nickname for ${targer_member.user.username} since they have the same role as you.`

    return null
    
}

module.exports.help = {
    name: 'nickname',
    description: 'Sets/removes the nickname of the mentioned member',
    usage: 'nick < --set | --remove > < user > < nickname >',
    category: 'moderation'
}

module.exports.requirements = {
    clientPerms: ['MANAGE_NICKNAMES'],
    userPerms: ['MANAGE_NICKNAMES'],
    ownerOnly: false
}

module.exports.limits = {
    cooldown: 8e3
}