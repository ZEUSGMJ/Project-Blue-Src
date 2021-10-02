const { MessageEmbed } = require('discord.js');
const { helpfunc } = require('../general/help')
const { invalidCMDUsage } = require('../../functions/Util')

module.exports.run = async (client, message, args, prefix) => {
	
	if (args.length != 0 && args[0] === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);

	if (!args || args.length === 0) return invalidCMDUsage(this.help.name, message.channel, client)
	
	if (args.join(' ').split('').reverse().join('').length > 1000)
		return message.channel.send(
			new MessageEmbed()
				.setDescription(
					`You've exceeded **${args.length - 1000}** characters! Please try again later.`
				)
				.setColor('RED')
		);
	
	let reversed_str = args.join(' ').split('').reverse().join('');
	const embed = new MessageEmbed()
		.addField(`Reversed Text:`, `\`\`\`${reversed_str}\`\`\``)
		.setTimestamp();
	message.channel.send(embed);
};

module.exports.help = {
	name: 'reverse',
	description: 'Reverses a string',
	aliases: ['rv', 'flip'],
	usage: 'reverse < string >',
	category: 'fun',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 3e3,
};
