const { MessageEmbed } = require('discord.js');
const figlet = require('figlet');
const { promisify } = require('util');
const { invalidCMDUsage } = require('../../functions/Util');
const { helpfunc } = require('../general/help');
const figletAsync = promisify(figlet);

module.exports.run = async (client, message, args, prefix) => {
	
	if (args.length != 0 && args[0] === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);

	let astext = args.join(' ');
	
	if (!astext || astext.length > 18) return invalidCMDUsage(this.help.name, message.channel, client)

	let asciitext = await figletAsync(astext);
	message.channel.send('```' + asciitext + '```');
};

module.exports.help = {
	name: 'ascii',
	description: 'converts a text into Ascii!!',
	category: 'fun',
	aliases: ['as', 'asciify'],
	usage: 'ascii < text >',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 5e3,
};
