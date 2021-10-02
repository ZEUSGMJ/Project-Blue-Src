const { MessageEmbed, Constants } = require('discord.js')
const { exec } = require('child_process')

module.exports.run = async (client, message, args) => {

    if (!args || args.length == 0) return message.channel.send(new MessageEmbed().setDescription('<:PB_crossCheckmark:771440385100742706> | Please provide a command to execute in the console').setColor('RED')).then(
        msg => msg.delete({ timeout: 3e3}).catch(err =>{
            if (err.code === Constants.APIErrors.UNKNOWN_MESSAGE) return

            console.log(`An Error occured while trying to delete the message`,err)
        })
    )

    try {
        exec(args.join(' '), (STDERR, STDOUT) => {
           let response = STDERR || STDOUT;
            let input = args.join(' ');
       
           message.channel.send(`**Input:**\n\`\`\`js\n${input}\`\`\`\n**Output:**\`\`\`js\n${response}\`\`\``,{ split: true });
        })
    }catch (err) {
        console.log('An Error occured while trying to run the exec command!',err)

        return message.channel.send(new MessageEmbed().setTitle(`<:PB_error:772115933459120138> | An Error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"))
    }
}

module.exports.help = {
    name: 'exec',
    description: 'Executes a command in the console',
    usage: '<exec> <command>',
    category: 'developer',
    aliases: ['console']
}

module.exports.requirements = {
    clientPerms:  [],
    userPerms: [],
    ownerOnly: true
}

module.exports.limits = {
    cooldown: 5e3
}