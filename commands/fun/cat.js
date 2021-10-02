const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const request = require('request');
const { helpfunc } = require('../general/help');

module.exports.run = async (client, message, args, prefix) => {
	
	if (args.length != 0 && args[0] === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);

	request('http://edgecats.net/random', async function (error, response, body) {
		if (!error && response.statusCode == 200) {
			let emb = new MessageEmbed()
				.setTitle(':cat:Meoww')
				.setImage(body)
				.setColor(`#0099ff`)
				.setFooter(
					`Requested by ${message.member.user.tag}`,
					message.author.displayAvatarURL()
				)
				.setTimestamp();

			message.channel.send(emb);
		}
		if (error && response.statusCode == 200) {
			let cat = await fetch('https://aws.random.cat/meow')
				.then((res) => res.json())
				.then((json) => json.file);

			let embed = new MessageEmbed()
				.setTitle(':cat:Meoww')
				.setColor(`#0099ff`)
				.setImage(cat)
				.setFooter(
					`Requested by ${message.member.user.tag}`,
					message.author.displayAvatarURL()
				)
				.setTimestamp();

			message.channel.send(embed);
		}
	});
};

module.exports.help = {
	name: 'cat',
	description: `A simple cat command that gets a random image of an cat!`,
	aliases: ['meow', 'kitty'],
	usage: `cat`,
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
