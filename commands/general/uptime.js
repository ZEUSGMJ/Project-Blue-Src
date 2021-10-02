const { MessageEmbed } = require('discord.js')
const { msToString, SecondsToString, invalidCMDUsage } = require('../../functions/Util')
const { helpfunc } = require('../general/help')

module.exports.run = async (client, message, args) => {
	
	if (args.length != 0 && args[0].toLowerCase() === 'help') {
		return helpfunc.getCMD(client, message, this.help.name, prefix)
	}

	let embed = new MessageEmbed()
		.setAuthor(`${client.user.username}'s uptime`,'https://cdn.discordapp.com/emojis/786620886517022753.png?v=1')
		.setDescription(
			`\`\`\`asciidoc\n∎ Bot Uptime        :: ${msToString(client.uptime,{short: true})}\n∎ Process Uptime    :: ${SecondsToString(require('process').uptime(),{short:true})}\n∎ System Uptime     :: ${SecondsToString(require('os').uptime(),{short:true})}\`\`\``
		)
		.setColor('#0099ff')
		.setTimestamp()
		.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
	message.channel.send(embed);
};

module.exports.help = {
	name: 'uptime',
	description: `Shows how long the bot/System was online.`,
	category: 'general',
	Usage: `< uptime`,
	disabled: false
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 3e3,
};
