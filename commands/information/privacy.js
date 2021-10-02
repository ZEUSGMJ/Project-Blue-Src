const {MessageEmbed} = require('discord.js');
const { helpfunc } = require('../general/help')

module.exports.run = async (client, message, args, prefix) => {

	if (args.length !=0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	const { owner } = await client.fetchApplication();
	let ownername = owner.username;
	let discrim = owner.discriminator;
	const embed = new MessageEmbed()
		.setAuthor(
			`${client.user.tag} Privacy Policy🔒`,
			client.user.displayAvatarURL()
		)
		.setColor('#0099ff')
		.addFields(
			{
				name: '<:Arrow_R:727463369115828295> What data do we collect?',
				value: `\`\`\`yaml\nThe following data are collected:\n- Guild/Server ID\`\`\``,
			},
			{
				name: '<:Arrow_R:727463369115828295> Why and how do we use the data?',
				value: `\`\`\`yaml\nThe Server/Guild ID is collected so as to save prefixes for each guild with their ID, So that the bot can respond to in the guild even if the prefix for that guild was changed.\`\`\``,
			},
			{
				name: '<:Arrow_R:727463369115828295> How can you contact us?',
				value: `\`\`\`yaml\nYou can Direct message me on discord. My username is - ${ownername}#${discrim}\`\`\``,
			}
		)
		.setTimestamp()
		.setFooter(
			`${message.guild.name}`,
			message.guild.iconURL({ dynamic: true })
		);
	message.channel.send(embed);
};

module.exports.help = {
	name: 'privacy',
	decription: 'Shows the Privacy Policy of the bot',
	usage: 'privacy',
	aliases: ['privacy-policy', 'botpolicy'],
	category: 'information',
};

module.exports.requirements = {
	ownerOnly: false,
	clientPerms: [],
	userPerms: [],
};

module.exports.limits = {
	cooldown: 3e3,
};
