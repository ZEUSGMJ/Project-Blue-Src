const Discord = require('discord.js');
const { helpfunc } = require('../general/help')
const { invalidCMDUsage } = require('../../functions/Util')

module.exports.run = async (client, message, args, prefix) => {
	let mention;

	if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	if (args.length < 1 || !args) return invalidCMDUsage(this.help.name, message.channel, client)

	if (args[0].includes('here') || args[0].includes('everyone')) {
		mention = `@${args[0]}`;

		if (args.length < 2 || !args)
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(
						`<:redcross_check:738401051102806109> I can't send an empty announcement. Please give a message.`
					)
					.setColor('RED')
			);

		const target_channel = message.guild.channels.cache.find(
			(c) => c.id == Number(args[1].replace(/[^\w\s]/gi, ''))
		);

		if (!target_channel)
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(
						`<:redcross_check:738401051102806109> Don't think that's the correct channel. Please make sure you've mentioned the correct channel`
					)
					.setColor('RED')
			);

		const announce_message = args.slice(2).join(' ');
		if (!announce_message)
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(
						`<:redcross_check:738401051102806109> I can't send an empty announcement. Please give a message.`
					)
					.setColor('RED')
			);

		return target_channel.send(
			`${mention}`,
			new Discord.MessageEmbed()
				.setDescription(`${announce_message}`)
				.setColor('RANDOM')
				.setTimestamp()
		);
	} else if (
		args[0].includes(message.mentions.roles.first()) ||
		message.guild.roles.cache.find(
			(r) => r.id == Number(args[0].replace(/[^\w\s]/gi, ''))
		) ||
		message.guild.roles.cache.find((r) => r.name == args[0])
	) {
		if (!args[1])
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(
						`<:redcross_check:738401051102806109> Please mention the channel you want the announcement to be made in.`
					)
					.setColor('RED')
			);

		const role_ID = roleResolver(message.guild, args[0]);
		if (!role_ID)
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(`Couldn't find that role!`)
					.setColor('RED')
			);

		if (args.length < 2 || !args)
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(
						`<:redcross_check:738401051102806109> I can't send an empty announcement. Please give a message.`
					)
					.setColor('RED')
			);

		const target_channel = message.guild.channels.cache.find(
			(c) => c.id == Number(args[1].replace(/[^\w\s]/gi, ''))
		);

		if (!target_channel)
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(
						`<:redcross_check:738401051102806109> Don't think that's the correct channel. Please make sure you've mentioned the correct channel`
					)
					.setColor('RED')
			);

		if (!args[2] || args.length < 1)
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(
						`<:redcross_check:738401051102806109> I can't send an empty announcement. Please give a message.`
					)
					.setColor('RED')
			);

		const announce_message = args.slice(2).join(' ');

		return target_channel.send(
			`${role_ID}`,
			new Discord.MessageEmbed()
				.setDescription(`${announce_message}`)
				.setColor('RANDOM')
				.setTimestamp()
		);
	} else if (
		args[0].includes(
			message.mentions.channels.first() ||
				message.guild.channels.cache.find(
					(c) => c.id == Number(args[0].replace(/[^\w\s]/gi, ''))
				)
		) ||
		args[0].match(/[0-9]+/)
	) {
		const target_channel = message.guild.channels.cache.find(
			(c) => c.id == Number(args[0].replace(/[^\w\s]/gi, ''))
		);
		if (!target_channel)
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(
						`<:redcross_check:738401051102806109> Don't think that's the correct channel. Please make sure you've mentioned the correct channel`
					)
					.setColor('RED')
			);

		const announce_message = args.slice(1).join(' ');
		return target_channel.send(
			new Discord.MessageEmbed()
				.setDescription(`${announce_message}`)
				.setColor('RANDOM')
				.setTimestamp()
		);
	} else {
		return message.channel.send(
			new Discord.MessageEmbed()
				.setDescription(`Couldn't send the announcement. Please try again`)
				.setColor('RED')
		);
	}
};

const roleResolver = (guild, role) => {
	let mention = new RegExp('<@&([0-9]+)>', 'g').exec(role);

	if (mention && mention.length > 1) {
		return guild.roles.cache.get(mention[1]);
	}
	if (role.match(/^([0-9]+)$/)) {
		let roleIdSearch = guild.roles.cache.get(role);
		if (roleIdSearch) return roleIdSearch;
	}

	let exactNameSearch = guild.roles.cache.find(
		(r) => r.name.toLowerCase() === role.toLowerCase()
	);
	if (exactNameSearch) return exactNameSearch;

	let roleNameSearch = guild.roles.cache.find((r) => r.name === role);
	if (roleNameSearch) return roleNameSearch;

	return null;
};

module.exports.help = {
	name: 'announce',
	description: 'make an announce to a channel',
	aliases: ['ann'],
	usage: `announce [here/everyone] <channel ID> <message>`,
	category: 'moderation',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: ['MANAGE_GUILD'],
	clientPerms: ['MANAGE_MESSAGES','MENTION_EVERYONE'],
};

module.exports.limits = {
	rateLimit: 0,
	cooldown: 0,
};
