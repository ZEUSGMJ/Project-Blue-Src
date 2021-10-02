const { MessageEmbed } = require('discord.js');
const humanize = require('humanize-duration');
const { stripIndents } = require('common-tags');
const Discord = require('discord.js');

module.exports.run = async (client, message, args, prefix) => {

	const Bot_Category = client.categories.filter(c => c != 'developer').map(c => `${c[0].toUpperCase()}`+`${c.slice(1).toLowerCase()}`).join(', ')
	const CMD_Array = client.commands.filter(c => c.help.category != 'developer').map(c => c.help.name);
	let RandomCMD1 = Math.floor( Math.random() * CMD_Array.length )
	let RandomCMD2 = Math.floor( Math.random() * CMD_Array.length )

	const Err_Embed = new MessageEmbed()
		.setTitle(`<:PB_crossCheckmark:771440385100742706> | Uh oh, I couldn't find any commands or categories with the name \`${!args[0] ? "" : args[0].slice(0,10)}\``)
		.setDescription(`Looks like you've entered a command or category that doesn't exist!. You can try running \`${prefix}help\` to get the list of commands.`)
		.addFields(
			{name: `📝 Correct usage`, value:`\`${prefix}help [command name / category]\``},
			{name: `📖 Example`, value: `\`${prefix}help ${CMD_Array[RandomCMD1]}\`\n\`${prefix}help ${CMD_Array[RandomCMD2]}\``},
			{name: `<:PB_lists:768763332932272139> Available categories`,value:`\`\`\`yaml\n${Bot_Category}\`\`\``}
		)
		.setFooter(`${message.guild.name}`, message.guild.iconURL({dynamic:true}))
		.setColor('#0099ff')
		.setTimestamp()

	if ( args[0] && client.commands.has(`${args[0].toLowerCase()}`)) {
		return getCMD(client, message, args[0], prefix, Err_Embed);
	} else if ( args[0] && client.categories.includes(`${args[0].toLowerCase()}`)) {
		return getCategoryCMD(client, message, args[0], prefix);
	} else if (!args[0]) {
		return getAll(client, message, prefix);
	} else {
		return message.channel.send(Err_Embed);
	}
};
 
function getCategoryCMD(client, message, input, prefix) {
	
		const category_Commands = client.commands
					.filter((cmd) => cmd.help.category === input.toLowerCase())
					.map((cmd) => `- ${cmd.help.name}`)
					.join('\n');
		
		const CategoryEmbed = new MessageEmbed()
					.setTitle(`<:PB_Command:768767760662528002> Commands under ${input[0].toUpperCase() + input.slice(1).toLowerCase()}`)
					.setDescription(`\`\`\`yaml\n${category_Commands}\`\`\`\n You can do \`${prefix}help [command name / category]\` to get to know more about a command`)
					.setColor('#0099ff')
					.setFooter(`[] = Optional | <> = required`, message.guild.iconURL({dynamic:true}))
					.setTimestamp()
		
		return message.channel.send(CategoryEmbed);
};

function getAll(client, message, prefix) {

	const commands = (category) => {
		return client.commands
			.filter((cmd) => cmd.help.category === category)
			.map((cmd) =>
				cmd.help.category == 'developer' ? false : `- ${cmd.help.name}`
			)
			.join(' ');
	};

	const info = client.categories
		.map(
			(cat) =>
				stripIndents`**>> \`${
					cat[0].toUpperCase() + cat.slice(1)
				}\`** \n\`\`\`yaml\n${commands(cat)}\`\`\``
		)
		.reduce((string, category) => string + '\n' + category);

	const embed = new MessageEmbed()
		.setAuthor(
			`${client.user.username} commands`,
			`${client.user.displayAvatarURL()}`
		)
		.setThumbnail(`${client.user.displayAvatarURL()}`)
		.setColor('#0099ff')
		.setDescription(
			`The prefix for this Guild is **\`${prefix}\`**\nYou can type \`${prefix}help <command name>\` to get to know more about a command.\n\n${info}`
		)
		.setFooter(
			`${message.guild.name}`,
			message.guild.iconURL({ format: 'png', dynamic: true })
		)
		.setTimestamp();
	return message.channel.send(embed);
};

function getCMD(client, message, input, prefix, ErrorEmbed) {

	const cmd =
		client.commands.get(input.toLowerCase()) ||
		client.commands.get(client.aliases.get(input.toLowerCase()));

	let info = `❌No information found for command **\`${input.toLowerCase()}\`**\nTry using \`${prefix}help\` to get a list of commands.`;

	if (!cmd) {
		const erembed = new Discord.MessageEmbed();
		return message.channel.send(
			erembed
				.setTitle('⚠️ERROR⚠️')
				.setColor('RED')
				.setDescription(`${info}`)
				.setTimestamp()
		);
	}

	if (cmd.help.category == 'developer' && message.author.id != 438054607571386378) { 
		return message.channel.send({embed: ErrorEmbed});
	}

	if (cmd.help.name) 
		info = `> Command Name     :: ${cmd.help.name}`;	

	if (cmd.help.category) 
		info += `\n> Category         :: ${cmd.help.category[0].toUpperCase() + cmd.help.category.slice(1)}`;
	
	if (cmd.help.description) 
		info += `\n> Description      :: ${cmd.help.description}`;
					
	if (cmd.help.aliases) 
		info += `\n> Aliases          :: ${cmd.help.aliases.map((a) => `${a}`).join(', ')}`;

	if (cmd.limits.cooldown) 
		info += `\n> Cooldown         :: ${humanize(cmd.limits.cooldown,{round:true})}`;	
	
	if (cmd.requirements.userPerms.length != 0)
		info += `\n> User Permissions :: ${cmd.requirements.userPerms.map(
			(p) =>`${p.replace(/_/g, ' ')
					  .toLowerCase()
					  .replace(/\b(\w)/g, (char) => char.toUpperCase())}`
		).join(', ')}`;
	
	if (cmd.requirements.clientPerms.length != 0)
		info += `\n> Bot Permissions  :: ${cmd.requirements.clientPerms.map(
			(c) => `${c.replace(/_/g, ' ')
					   .toLowerCase()
					   .replace(/\b(\w)/g, (char) => char.toUpperCase())}`
		).join(', ')}`;

	if (cmd.help.usage) info += `\n> Usage            :: ${prefix}${cmd.help.usage}`;

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setAuthor(
			`Information on ${
				cmd.help.name[0].toUpperCase() + cmd.help.name.slice(1)
			} command`,
			'https://cdn.discordapp.com/emojis/773780212822573066.png?v=1'
		)
		.setDescription(`\`\`\`asciidoc\n${info.replace('{client.username}', `${client.user.username}`)}\`\`\``)
		.setFooter(
			`Syntax: <> = required | [] = optional`,
			message.author.displayAvatarURL({ dynamic: true })
		)
		.setTimestamp();
	message.channel.send(embed);
}

module.exports.helpfunc = {
 getAll,
 getCategoryCMD,
 getCMD,
}

module.exports.help = {
	name: 'help',
	aliases: ['commands'],
	category: 'general',
	description: 'Returns all commands, or one specific command info',
	usage: 'help [ category name | command name ]',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 3e3
}
