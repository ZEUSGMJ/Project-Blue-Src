const { MessageEmbed } = require('discord.js');
const { helpfunc } = require('../general/help')

const coinr = ['Tails', 'Heads'];
module.exports.run = async (client, message, args, prefix) => {

	if (args.length != 0 && args[0] === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);

	const msg = await message.channel.send(
		'<a:coinflip:734057639792869547> Tossing the coin...'
	);
	
	let response = coinr[Math.floor(Math.random() * coinr.length)];
	
	const embed = new MessageEmbed()
		.setDescription(
			`<a:coinflip:734057639792869547> ┃ The coin landed on **${response}**`
		)
		.setColor('#0099ff');
	msg.edit('', embed);
};

module.exports.help = {
	name: 'coinflip',
	description: 'A coin flip command to check whether you get heads/tails',
	aliases: ['cf', 'coin'],
	category: 'fun',
	usage: 'coinflip',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 3e3,
};
