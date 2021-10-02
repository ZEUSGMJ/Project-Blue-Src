const { MessageEmbed } = require('discord.js');
const { helpfunc } = require('../general/help')
const { invalidCMDUsage } = require('../../functions/Util')

module.exports.run = async (client, message, args, prefix) => {

	if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	if (!args || args.length === 0) return invalidCMDUsage(this.help.name, message.channel, client);

	let answers = [
		'As I see it, yes',
		'Ask again later',
		'Better not tell you now',
		'Cannot predict now',
		'Concentrate and ask again',
		'Don’t count on it',
		'It is certain',
		'It is decidedly so',
		'Most likely',
		'My reply is no',
		'My sources say no',
		'Outlook not so good',
		'Outlook good',
		'Reply hazy, try again',
		'Signs point to yes',
		'Very doubtful',
		'Without a doubt',
		'Yes',
		'Yes – definitely',
		'You may rely on it',
	];
    
	let embed = new MessageEmbed();
	let result = Math.floor(Math.random() * answers.length);
	let question = args.join(' ');
    
	message.channel.send(
		embed
			.setDescription(
				`<:8Ball:729610720978665523> ┃ ${answers[result]}, **${message.author.username}**`
			)
			.setColor('#0099ff')
	);
};

module.exports.help = {
	name: '8ball',
	description: 'A simple 8ball command that answers your questions.',
	aliases: ['8b'],
	usage: '8ball < your question here >',
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
