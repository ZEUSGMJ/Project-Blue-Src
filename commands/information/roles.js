const { helpfunc } = require('../general/help')

module.exports.run = async (client, message, args, prefix) => {

	if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	const maxRoleLength = message.guild.roles.cache
		.sort((a, b) => b.position - a.position)
		.filter((r) => r.id != message.guild.id)
		.map((r) => r.name)
		.reduce((r, e) => (r.length < e.length ? e : r), '').length;
	const roles = message.guild.roles.cache
		.sort((a, b) => b.position - a.position)
		.filter((r) => r.id != message.guild.id)
		.map(
			(r) =>
				`${r.name}` +
				`${r.members.size
					.toString()
					.padStart(maxRoleLength - r.name.length + 10)} Members`
		)
		.join(`\n`);
	message.channel.send(`'${message.guild.roles.cache.size} Roles'\n\n${roles}`, {split: true, code:"py"});
};

module.exports.help = {
	name: 'roles',
	description:
		'Shows a list of roles along with the number of members who have the role',
	category: `information`,
	usage: 'role',
};

module.exports.requirements = {
	ownerOnly: false,
	clientPerms: [],
	userPerms: [],
};

module.exports.limits = {
	cooldown: 5e3,
};
