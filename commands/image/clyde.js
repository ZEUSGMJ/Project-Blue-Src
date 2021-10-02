const got = require('got');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { invalidCMDUsage } = require('../../functions/Util')
const { helpfunc } = require('../general/help')

module.exports.run = async (client, message, args, prefix) => {

	if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);

	if (!args || args.length === 0) return invalidCMDUsage(this.help.name, message.channel, client);

	let text = args.join(' ').length > 54 ? args.join(' ').slice(0, 54) : args.join(' ')

	let query = encodeURI(text)

	try {
		got(
			`https://nekobot.xyz/api/imagegen?type=clyde&text=${query}`
		).then((res) => {
			let content = JSON.parse(res.body);
			if (content.success === false)
				return message.channel.send(
					new MessageEmbed()
						.setDescription(
							`Uh oh. Seems like an error occured when trying to process the image\n\`Error Code: ${content.status}\``
						)
						.setColor('RED')
				);

			let img = content.message;
			let attachment = new MessageAttachment(img, 'clyde.png');
			message.channel.send(attachment);
		});
	} catch (e) {
		message.channel.send(
			new MessageEmbed()
				.setDescription(`An error occured.\n\`Error: ${e}\``)
				.setColor('RED')
		);
	}
};

module.exports.help = {
	name: 'clyde',
	description: 'Sends an image of clyde saying your message',
	usage: 'clyde < text >',
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
