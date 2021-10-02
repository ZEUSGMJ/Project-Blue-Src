const Discord = require('discord.js');
const moment = require('moment');
const { StringReplacer } = require('../functions/Util');

module.exports = async (client, guild) => {
	let { me, roles } = guild;
	const embed = new Discord.MessageEmbed()
		.setAuthor(guild.name)
		.setColor('GREEN')
		.setDescription(
			`I've Joined \`${guild.name}\`.\nMembers:\`${
				guild.members.cache.filter(m => !m.user.bot).size
			}\`\nBots:\`${
				guild.members.cache.filter(m => m.user.bot).size
			}\`\nRegion: ${guild.region}`
		)
		.addField('Guild ID', `\`\`\`ml\n${guild.id}\`\`\``, true)
		.addField(
			`joined at`,
			`\`\`\`ml\n${moment(guild.joinedAt).format('LL LTS')}\`\`\``,
			true
		)
		.addField(
			`Owner`,
			`\`\`\`ml\n${guild.owner.user.username} | ${guild.owner.id}\`\`\``
		)
		.addField(
			`Permissions`,
			`\`\`\`ml\n${me.permissions
				.toArray()
				.map(perm => `\n✔️ ${StringReplacer(perm)}`)
				.join(' ')}\`\`\``
		)
		.addField(
			`Roles`,
			`${roles.cache
				.sort((a, b) => b.position - a.position)
				.first(15)
				.map(r => `${r.name}`)
				.join(' **|** ')}`
		)
		.setTimestamp();

	if (guild.banner) embed.setImage(guild.bannerURL({ size: 1024 }));

	!guild.iconURL()
		? embed.setAuthor(`${guild.name}`)
		: embed.setAuthor(`${guild.name}`, guild.iconURL({ dynamic: true }));

	if (guild.iconURL()) embed.setThumbnail(guild.iconURL({ dynamic: true }));

	client.channels.cache.get('729385034548510721').send({ embed: embed });
};
