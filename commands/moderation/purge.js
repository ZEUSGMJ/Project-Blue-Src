const Discord = require('discord.js');
const { helpfunc } = require('../general/help')
const { UserResolver } = require('../../functions/Resolver');
const { invalidCMDUsage } = require('../../functions/Util');

module.exports.run = async (client, message, args, prefix) => {

	if (args.length !=0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	if (!args || args.length < 1) return invalidCMDUsage(this.help.name, message.channel, client)
	
	const member = UserResolver(message.guild, args[1])

	let deleteAmount = parseInt(args[0]);

	if (!deleteAmount && !member) return invalidCMDUsage(this.help.name, message.channel, client)

	if (!deleteAmount)
		return message.channel.send(
			new Discord.MessageEmbed()
				.setDescription('Please mention the amount of messages to be deleted.')
				.setColor('RED')
		);
	if (deleteAmount > 99)
		return message.channel.send(
			new Discord.MessageEmbed()
				.setDescription('I can only delete max of `99` messages.')
				.setColor('RED')
		);
	if (deleteAmount < 2)
		return message.channel.send(
			new Discord.MessageEmbed()
				.setDescription('Please provide a value greater than `1`.')
				.setColor('RED')
		);
    
    message.delete();
    
	message.channel.messages.fetch({ limit: 100 }).then(async (messages) => {
		if (member) {
			const filterBy = member ? member.user.id : client.user.id;
			messages = messages
				.filter((m) => m.author.id === filterBy)
				.array()
				.slice(0, deleteAmount);
			try {
				await message.channel.bulkDelete(messages);
			} catch (e) {
				return message.channel.send(
					new Discord.MessageEmbed()
						.setDescription(
							`<:redcross_check:738401051102806109> An Error occured while trying to delete the messages.\n\`\`\`${e}\`\`\``
						)
						.setColor('RED')
				);
			}
			return message.channel
				.send(
					new Discord.MessageEmbed()
						.setDescription(
							`<:bin:727189223718780998> Deleted \`${messages.length}\` messages.`
						)
						.setColor('#0099ff')
				)
				.then((msg) => msg.delete({ timeout: 8e3 }));
		}
		try {
			await message.channel.bulkDelete(deleteAmount, {filterOld:true});
			return message.channel
				.send(
					new Discord.MessageEmbed()
						.setDescription(
							`<:bin:727189223718780998> Deleted \`${deleteAmount}\` messages.`
						)
						.setColor('#0099ff')
				)
				.then((msg) => msg.delete({ timeout: 8e3 })).catch(err => {
					if (err.code != Discord.Constants.APIErrors.UNKNOWN_MESSAGE) console.log(`Error occured while trying to delete a message`,err)
				})
		} catch (e) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(
						`<:redcross_check:738401051102806109> An Error occured while trying to delete the messages.\n\`\`\`${e}\`\`\``
					)
					.setColor('RED')
			);
		}
	});
};

module.exports.help = {
	name: 'purge',
	Description: 'Bulk deletes the specified number of messages',
	aliases: ['clear'],
	usage: `purge < X > [ user ]\nNote:- "X" is the amount of messages to be deleted.`,
	category: 'moderation',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: ['MANAGE_MESSAGES'],
	clientPerms: ['MANAGE_MESSAGES'],
};

module.exports.limits = {
	cooldown: 3e3,
};
