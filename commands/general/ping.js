const Discord = require('discord.js');
const mongoose = require('mongoose');
const { SignalStrength } = require('../../functions/Util')
const { helpfunc } = require('./help')

module.exports.run = async (client, message, args, prefix) => {

	if (args.length !=0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	message.channel
		.send('<a:loading:639060628341915658>Pinging...')
		.then(async (msg) => {
			
			let dbPing;
			startTime = Date.now();
			await mongoose.connection.db.admin().ping();
			dbPing = Date.now() - startTime;
			
			let embed = new Discord.MessageEmbed()
			//.setDescription(`${SignalStrength(Math.round(client.ws.ping))} **Bot:**\n<:Bot:729611594467901450> \`${Math.round(client.ws.ping)}\`ms \n${SignalStrength(msg.createdTimestamp - message.createdTimestamp)} **Latency:**\n<:PB_message_latency:772404774942801940> \`${msg.createdTimestamp - message.createdTimestamp}\` ms\n${SignalStrength(dbPing)} **MongoDB:**\n<:PB_DB_ping:772407212639387682> \`${dbPing}\` ms`)
			.addFields(
				{name:`<:Bot:729611594467901450> Bot:`,value:`${SignalStrength(Math.round(client.ws.ping))} \`${Math.round(client.ws.ping)}\`ms`,inline:false},
				{name:`<:PB_stopwatch:772416184712429598> Latency:`,value:`${SignalStrength(msg.createdTimestamp - message.createdTimestamp)} \`${msg.createdTimestamp - message.createdTimestamp}\` ms`,inline:false},
				{name:`<:PB_DB_ping:772407212639387682> MongoDB`, value:`${SignalStrength(dbPing)} \`${dbPing}\` ms`,inline:false}
			)
				.setColor('#0099ff');
			msg.edit(' ', embed).catch(err => console.log(err))
		});
};

module.exports.help = {
	name: 'ping',
	description: `Checks the ping of the bot!`,
	aliases: ['pong'],
	usage: `ping`,
	category: 'general',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 4e3,
};
