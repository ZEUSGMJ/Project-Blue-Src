const botconfig = require('../../config');
const { MessageEmbed, Constants } = require('discord.js');
const servers = require('../../models/Guild');
const { helpfunc } = require('../general/help')

module.exports.run = async (client, message, args, prefix) => {

	if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	let embed = new MessageEmbed();
	
	if (!args[0] || args.length === 0) {
		servers.findOne(
			{
				GuildID: message.guild.id,
			},
			async (err, g) => {
				if (err) console.log(err);
				if (!g) {
					const newServer = new servers({
						GuildID: message.guild.id,
						prefix: botconfig.defaultprefix,
					});
					await newServer.save().catch((e) => console.log(e));
					return message.channel.send(
						embed
							.setTitle('Prefix')
							.setDescription(
								`The current prefix for this guild is \`${botconfig.prefix}\``
							)
							.setColor('#0099ff')
							.setFooter(
								`${message.guild.name}`,
								message.guild.iconURL({ dynamic: true })
							)
							.setTimestamp()
					);
				} else {
					return message.channel.send(
						embed
							.setTitle('Prefix')
							.setDescription(
								`The current prefix for this guild is \`${g.prefix}\``
							)
							.setColor('#0099ff')
							.setFooter(
								`${message.guild.name}`,
								message.guild.iconURL({ dynamic: true })
							)
							.setTimestamp()
					);
				}
			}
		);
		return;
	}
	
	if (!args[0]) return;

	const newPrefix = args[0];

	if (args[0].length > 6) return message.channel.send(new MessageEmbed().setTitle(`<:PB_crossCheckmark:771440385100742706> | Excessive characters. Prefix must be less than 6 characters.`).setColor("RED")).then(msg => {
		msg.delete({ timeout: 4e3}).catch(err => {
			if (err.code != Constants.APIErrors.UNKNOWN_MESSAGE) return console.log(`An error occured while trying to delete the message.`,err)
		})
	})

	const msg = await message.channel.send(
		'<a:loading:639060628341915658> Please wait while the prefix is being updated...'
	);
	servers.findOne(
		{
			GuildID: message.guild.id,
		},
		async (err, g) => {
			if (err) console.log(err);
			if (!g) {
				const newServer = new servers({
					GuildID: message.guild.id,
					prefix: newPrefix,
				});
				await newServer.save().catch((e) => console.log(e));
			} else {
				g.prefix = newPrefix;
				await g.save().catch((e) => console.log(e));
			}
			const uembed = new MessageEmbed()
				.setAuthor(`✅ Success`, message.guild.iconURL({ dynamic: true }))
				.setColor('GREEN')
				.addField(
					'Prefix updated',
					`\`\`\`fix\nPrefix set to = ${newPrefix}\`\`\``
				)
				.setTimestamp()
				.setFooter(`${message.guild.name}`);
			return msg.edit('', uembed);
		}
	);
};

module.exports.help = {
	name: 'prefix',
	description: `Change the prefix of the bot for this server.`,
	category: 'moderation',
	Usage: '<prefix...>',
	aliases: ['setprefix'],
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: ['MANAGE_GUILD'],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 5e3,
};
