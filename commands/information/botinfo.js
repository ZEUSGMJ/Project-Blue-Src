const {MessageEmbed} = require('discord.js');
const { version: djs } = require('discord.js');
const moment = require('moment');
const { version, description } = require('../../package.json');
const mongoose = require("mongoose");
const Changelogs = require('../../models/Changelog');
const { helpfunc } = require('../general/help')
const { msToString } = require('../../functions/Util')

module.exports.run = async (client, message, args, prefix) => {
	
	if (args.length !=0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);	

	let changes = (await Changelogs.find({}, async (err) => {
        if(err) console.log(err)
	})).reverse()

	let recent_changes = changes.slice(0,2).map(c => `# ${c.Date}\n${c.Changes.map(cl => `> ${cl}`).join('\n')}`).join('\n\n')

	let uptime = msToString(client.uptime, {short:true})
	let intervals = ['d ', 'h ', 'm ', 's'];
	let days = Math.floor(client.uptime / 86400000);
	let hours = Math.floor(client.uptime / 3600000) % 24;
	let minutes = Math.floor(client.uptime / 60000) % 60;
	let seconds = Math.floor(client.uptime / 1000) % 60;
	let times = [`${days}`, `${hours}`, `${minutes}`, `${seconds}`];
	for (let i = 0; i < 4; i++) {
		if (times[i] != 0) uptime += `${times[i]}${intervals[i]}`;
	}
	const { owner } = await client.fetchApplication();
	let ownername = owner.username;
	let ownerDiscrim = owner.discriminator;
	let bot_createdAt = moment(client.user.createdAt).format('LL')

	let m = await message.channel.send({ embed: {
		title:`<a:PB_loading:778658036688355349> Fetching ${client.user.username}'s info..`,
		color:"#0099ff"
	}});

	let dbPing;
	startTime = Date.now();
	await mongoose.connection.db.admin().ping();
	dbPing = Date.now() - startTime;
	const embed = new MessageEmbed()
		.setAuthor(	`${client.user.username}'s Info`,`${client.user.displayAvatarURL()}`)
		.addFields(
			{ name:`<:PB_lists:768763332932272139> Description`, value:`\`\`\`css\n${description.replace('{prefix}', prefix)}\`\`\``, inline:true},
			{ name: `<:Bot:729611594467901450> Bot Info`, value:`\`\`\`css\nBot Version      : ${version}\nBot Developer    : ${ownername}#${ownerDiscrim}\nLibrary          : Discord.js\n      └ Version  : ${djs}\nBot Uptime       : ${uptime}\nCreated On       : ${bot_createdAt} | ${moment(client.user.createdAt).fromNow()}\n${client.user.username}'s Status\n      └ Bot Ping : ${Math.round(client.ws.ping)} ms\n      └ Latency  : ${m.createdTimestamp - message.createdTimestamp} ms\n      └ MongoDB  : ${dbPing} ms\nPrefix           : ${prefix} or @${client.user.username}\`\`\``},
			{ name: '<:PB_Notes:774304844092669982> Recent Changes',value:`\`\`\`md\n${recent_changes}\`\`\``, inline:true},
			{ name: `\u202b`, value:`<:Created:729727257521815583> **Invite**: [\`Click here\`](https://discord.com/oauth2/authorize?client_id=724213925767544893&scope=bot&permissions=2080898303)\n<:PB_Support:775865213785604116> **Support Server**: [\`Click here\`](https://discord.gg/Yb3DjCmk99)\n<:GithubLogo:752998764477939813> **Github**: [\`Project-Blue\`](https://github.com/ZEUSGMJ/Project-Blue)`}
		)
		.attachFiles([{ attachment: './assets/ProjectBlue.jpg', name: 'ProjectBlue.jpg' }])
    	.setImage('attachment://ProjectBlue.jpg')
		.setFooter(
			`Requested by ${message.author.username}`,
			`${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`
		)
		.setColor('#0099ff')
		.setTimestamp();
	await message.channel.send(embed);
	await m.delete();
};
module.exports.help = {
	name: 'botinfo',
	description: `Gets the bot info.`,
	aliases: ['botinfo', 'binfo', 'info'],
	usage: `botinfo`,
	category: 'information',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 5e3,
};
