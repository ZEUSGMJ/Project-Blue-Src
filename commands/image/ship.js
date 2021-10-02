const got = require('got');
const { MessageEmbed } = require('discord.js');
const { helpfunc } = require('../general/help')
const { invalidCMDUsage, invalidMember } = require('../../functions/Util')
const { UserResolver } = require('../../functions/Resolver')

module.exports.run = async (client, message, args, prefix) => {
	
	if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	if (!args || args.length === 0) return invalidCMDUsage(this.help.name, message.channel, client)

	const target_user1 = UserResolver(message.guild, args[0])
	const target_user2 = UserResolver(message.guild, args[1])

	if (!target_user1 || !target_user2) return invalidMember(message.channel)

	try {
		got(
			`https://nekobot.xyz/api/imagegen?type=ship&user1=${target_user1.user.displayAvatarURL(
				{ format: 'png' }
			)}&user2=${target_user2.user.displayAvatarURL({ format: 'png' })}`
		).then((res) => {
			const content = JSON.parse(res.body);
			if (content.success === false)
				return message.channel.send(
					new MessageEmbed()
						.setDescription(
							`An error occured.\n\`\`\`yaml\nERROR: ${content.message}\nError Code: ${content.status}\`\`\``
						)
						.setColor('RED')
				);

			let img = content.message;
			const embed = new MessageEmbed()
				.setImage(img)
				.setColor('RANDOM')
				.setTimestamp();
			message.channel.send(embed);
		});
	} catch (e) {
		return message.channel.send(
			new MessageEmbed()
				.setDescription(`An Error occured.\n\`\`\`yaml\nError: ${e}\`\`\``)
				.setColor('RED')
		);
	}
};

module.exports.help = {
	name: 'ship',
	description: 'Ship two server members :wink:',
	usage: `ship < @member1 > < @member2 >`,
	category: 'image',
};

module.exports.requirements = {
	ownerOnly: false,
	clientPerms: ['ATTACH_FILES'],
	userPerms: [],
};

module.exports.limits = {
	cooldown: 5e3,
};
