const {MessageEmbed, version: djs} = require('discord.js');
const os = require('os');
const si = require('systeminformation');
const {version: db} = require('mongoose');
const { SecondsToString, msToString, formatBytes } = require('../../functions/Util');
const { helpfunc } = require('../general/help')
const process = require('process');

module.exports.run = async (client, message, args) => {

	if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	let loading_message = await message.channel.send(new MessageEmbed().setTitle(`<a:PB_loading:778658036688355349> Please wait while i fetch ${client.user.username}'s stats...`).setColor('#0099ff'))
	//Get info about CPU
	let cpu = await si.cpu();
	let cpuSpeed = await si.cpuCurrentSpeed()
	let load = await si.currentLoad()

	let cpuname = os.cpus()[0].model;
	let cpuCores = cpu.cores;
	let cpuPhyCores = cpu.physicalCores;
	let cpuSpeedMax = cpuSpeed.max;
	let cpuSpeedMin = cpuSpeed.min;
	let avgCpuSpeed = cpuSpeed.avg;
	let cpuLoad = load.currentLoad;

	//console.log(load)

	// Get info about OS and other things
	let arch = os.arch();
	let platform = os.platform();

	let version = await si.versions('npm, node, pm2, git')
	let versions_Array = [], temp_Arr = [];
	
	for (let v in version) {
		temp_Arr.push(v)
	}

	for (let version_name in version) {
		version[version_name] == "" ? false : versions_Array.push(`${version_name.padEnd(18)}:: ${version[version_name]}`)
	}

	versions_Array = versions_Array.join('\n')
	let node_version = process.version;

	let ramused = formatBytes(process.memoryUsage().heapUsed, 2)
	let totalmemory = formatBytes(os.totalmem(), 2)
	let RAMmem = await si.mem()

	let used = formatBytes(RAMmem.used, 2)
	let free = formatBytes(RAMmem.free, 2)

	const stats_embed = new MessageEmbed()
		.setAuthor(`${client.user.username}'s Stats`,`https://cdn.discordapp.com/emojis/778670870922788895.png?v=256`)
		.addFields(
			{ name: `<:PB_cpu:772117322462265346> CPU Info`, value:`\`\`\`asciidoc\nModel :: ${cpuname}\nSpeed :: Max ${cpuSpeedMax} GHz\n         Min ${cpuSpeedMin} GHz\n         Avg ${avgCpuSpeed} GHz\nCores :: #Count ${cpuCores}\n         Physical cores: ${cpuPhyCores}\nUsage :: ${cpuLoad.toFixed(2)} %\`\`\``,inline:false},
			{ name: `<:PB_system:772123679026970671> System / <:PB_ram:772119237586059275> RAM Info`,value:`\`\`\`asciidoc\n= System info =\nArchitecture      :: ${arch}\nPlatform          :: ${platform}\nRelease           :: ${os.release()}\nVersion           :: ${os.version()}\nSystem Uptime     :: ${SecondsToString(os.uptime())}\n\n= RAM Info =\n  └ Usage (Node)  :: ${ramused} / ${totalmemory}\n  └ Used (system) :: ${used}\n  └ Free          :: ${free}\`\`\``,inline:false},
			{ name: `<:PB_version:772440491219877890> Versions`, value:`\`\`\`asciidoc\nDiscord.js        :: ${djs}\nMongoose          :: ${db}\n${versions_Array}\`\`\``},
			{ name: `<:Bot:729611594467901450> Project Blue Info`, value: `\`\`\`asciidoc\nGuilds (cached) :: ${client.guilds.cache.size}\nUsers (cached)  :: ${client.users.cache.size}\nEmojis (cached) :: ${client.emojis.cache.size}\nCommands        :: ${client.commands.size}\nBot Uptime      :: ${msToString(client.uptime)}\nProcess Uptime  :: ${SecondsToString(process.uptime())}\`\`\``}
		)
		.setColor('#0099ff')
		.setFooter(
			`Requested by ${message.author.username}`,
			`${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`
		)
		.setTimestamp();
	
	loading_message.edit('',stats_embed);
};

function niceBytes(x){
	
	const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	let l = 0, n = parseInt(x, 10) || 0;
  
	while(n >= 1024 && ++l){
		n = n/1024;
	}
	return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

module.exports.help = {
	name: 'stats',
	description: 'Get statistics from the bot.',
	aliases: ['botstats'],
	category: 'information',
	usage: 'stats',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
};

module.exports.limits = {
	cooldown: 5e3,
};
