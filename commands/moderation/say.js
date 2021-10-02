const Discord = require('discord.js');
const High_perms = ['ADMINISTRATOR','MANAGE_GUILD']
const { ChannelResolver } = require('../../functions/Resolver')
const { helpfunc } = require('../general/help')
const { invalidCMDUsage, invalidChannel } = require('../../functions/Util')

module.exports.run = async (client, message, args, prefix) => {
	
	if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	if (!args || args.length === 0) return invalidCMDUsage(this.help.name, channel, client)

	const target_channel = ChannelResolver(message.guild, args[0]) || message.channel

	if (!target_channel) return invalidChannel(message.channel)

	if (target_channel === message.channel) {
		message.delete();
		let say_Message = args.join(' ');

		if (!message.member.permissions.has(High_perms)) {
			say_Message = say_Message.replace('@everyone','`everyone`')
						.replace('@here','`here`')
		}
		return message.channel.send(say_Message);
	} else {
		message.react('721348887864147978');
		let say_Message = args.slice(1).join(' ');

		if (!message.member.permissions.has(High_perms)) {
			say_Message = say_Message.replace('@everyone','`everyone`')
					   .replace('@here','`here`')
	   }
		if(!say_Message) return message.channel.send(new Discord.MessageEmbed().setDescription('Please give a message to be sent.').setColor("RED"));

		return target_channel.send(say_Message);
	}
};

module.exports.help = {
	name: 'say',
	description: 'A say command that makes the bot send a message.\nNote:- Any member with Admin / Manage server permissions can `@here/@everyone`',
	usage: `say < message >\` or \`say < #channel > < message >`,
	category: 'moderation',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: ['MANAGE_MESSAGES'],
	clientPerms: ['MANAGE_MESSAGES'],
};

module.exports.limits = {
	rateLimit: 0,
	cooldown: 0,
};
