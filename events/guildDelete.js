const Discord = require('discord.js');
const moment = require('moment');
const servers = require('../models/Guild');

module.exports = async (client, guild) => {

	if (!guild || guild.deleted) return;
	
	const embed = new Discord.MessageEmbed()
		.setAuthor(guild.name)
		.setColor('RED')
		.setDescription(
			`I've been either kicked or left \`${guild.name}\`.\nMembers:\`${
				guild.members.cache.filter(m => !m.user.bot).size
			}\`\nBots:\`${guild.members.cache.filter(m => m.user.bot).size}\``
		)
		.addField('Guild ID', `\`\`\`ml\n${guild.id}\`\`\``, true)
		.addField(
			`joined at`,
			`\`\`\`ml\n${moment(guild.joinedAt).format('LL LTS')}\`\`\``,
			true
		)
		.setTimestamp();

	!guild.iconURL()
		? embed.setAuthor(`${guild.name}`)
		: embed.setAuthor(`${guild.name}`, guild.iconURL({ dynamic: true }));

	if (guild.iconURL()) embed.setThumbnail(guild.iconURL({ dynamic: true }));

	client.channels.cache.get('729385034548510721').send({ embed: embed });

	servers.findOneAndDelete({ GuildID: guild.id }, async (err, f) => {
		if (err) console.log(err);
	});
};
