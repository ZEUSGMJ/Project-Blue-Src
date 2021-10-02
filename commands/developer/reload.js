const Discord = require("discord.js");

module.exports.run = async (client,message,args) => {
    let embed = new Discord.MessageEmbed()
    if(!args[0]) return message.channel.send(embed.setDescription('Please provide the category of the command').setColor("#0099ff").setTimestamp());
    if(!args[1]) return message.channel.send(embed.setDescription('Please provide a command to reload!').setColor("#0099ff").setTimestamp())

    const commandName = args[1].toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

    if(!command) return message.channel.send(embed.setDescription(`I couldn't find \`${args[1]}\`. Please try again!`).setColor("RED").setTimestamp());
    delete require.cache[require.resolve(`../${args[0]}/${commandName}.js`)];

    try {
        const newCommand = require(`../${args[0]}/${commandName}.js`);
        client.commands.set(newCommand.help.name, newCommand);
    }
    catch(err) {
        //console.log(err);
        return message.channel.send(embed.setDescription(`There was an error while trying to reload ${commandName}`).addField('Error',`\`${err.message}\``).setColor("RED").setTimestamp())
    }
    message.channel.send(embed.setTitle(`<:reload:734052258534260736> Reloaded!`).setDescription(`Command \`${commandName}\` has been reloaded!`).setColor("GREEN").setTimestamp().setFooter(`Reloaded by ${message.author.tag}`,message.author.displayAvatarURL({format:"png",dynamic:true})));
}

module.exports.help = {
    name: 'reload',
    description: 'reloads a command',
    category: 'developer',
    aliases: ['re']
}

module.exports.requirements = {
    ownerOnly: true,
    clientPerms: [],
    userPerms: []
}