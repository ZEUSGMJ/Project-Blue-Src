const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { helpfunc } = require('../general/help')

module.exports.run = async (client, message, args, prefix) => {
	
	if (args.length != 0 && args[0] === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);

	let dog = await fetch('https://dog.ceo/api/breeds/image/random')
		.then((res) => res.json())
		.then((json) => json.message);

	let embed = new MessageEmbed()
		.setTitle(':dog: woof!')
		.setColor(`#0099ff`)
		.setImage(dog)
		.setFooter(
			`Requested by ${message.member.user.tag}`,
			message.author.displayAvatarURL()
		)
		.setTimestamp();
	message.channel.send(embed);
};

module.exports.help = {
	name: 'dog',
	description: `A simple dog command that gets a random image of a dog.`,
	aliases: ['woof', 'bark'],
	usage: `dog`,
	category: 'fun',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 5e3,
};
