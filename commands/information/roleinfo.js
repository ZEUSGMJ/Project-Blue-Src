const { MessageEmbed } = require('discord.js');
const { StringReplacer, invalidRole, invalidCMDUsage } = require('../../functions/Util');
const { helpfunc } = require('../general/help')
const moment = require('moment');
const { RoleResolver } = require('../../functions/Resolver')

const Mod_perms = [
	'KICK_MEMBERS',
	'BAN_MEMBERS',
	'MANAGE_GUILD',
	'VIEW_AUDIT_LOG',
	'MANAGE_ROLES',
	'ADMINISTRATOR',
];

module.exports.run = (client, message, args, prefix) => {

	let { channel, guild, member } = message
	
	if (!args || args.length < 1) return invalidCMDUsage(this.help.name, channel, client)

	if (args.length != 0 && args[0].toLowerCase() === 'help')  return helpfunc.getCMD(client, message, this.help.name, prefix)

	const target_role =	RoleResolver(guild, args.join(' '))

	if (!target_role) return invalidRole(channel)

	const embed_color = target_role.hexColor;
	let role_permissions = target_role.permissions
		.toArray()
		.map((perm) => `\n✔️ ${StringReplacer(perm)}`)
		.join(' ');
	
	if(role_permissions.length === 0) role_permissions = '❌ No Permissions';

	let target_roleMembers = target_role.members.size;
	let fromTop_position = message.guild.roles.highest.rawPosition - target_role.rawPosition;

	fromTop_position == 0 ? fromTop_position = 'Highest Role in the server' : fromTop_position

	let members_target_role = target_role.members.first(15).map(m => m.toString()).join(',')

	target_roleMembers > 15  ? members_target_role += `**\`...${target_roleMembers - 15} more\`**` : members_target_role;
	
	target_role.id == guild.id ? members_target_role = `\`It's an everyone role. So of-course everyone comes under it\`` : members_target_role;

	role_permissions.includes('Administrator') ? (role_permissions = '⚙️ Administrator') : role_permissions;

	const role_embed = new MessageEmbed()
		.setDescription(`Role info for ${target_role.toString()}`)
		.setColor(`${embed_color}`)
		.addFields(
			{
				name: '<:ID:727871735097065632> Role ID',
				value: `\`\`\`yaml\n${target_role.id}\`\`\``,
				inline: true,
			},
			{
				name: '📛 Role name',
				value: `\`\`\`yaml\n${target_role.name}\`\`\``,
				inline: true,
			},
			{
				name: `Role members dispayed separately?`,
				value: `${
					target_role.hoist
						? "```yaml\nYes```"
						: '```yaml\nNo```'
				}`,
			},
			{
				name: `<:hashkey:763720935643283468> Members with this role`,
				value: `\`\`\`yaml\n${target_roleMembers}\`\`\``,
				inline: true,
			},
			{
				name: `<:MentionAt:763798103852974131> Mentionable?`,
				value: `${
					target_role.mentionable ? '**```yaml\nYes```**' : '**```yaml\nNo```**'
				}`,
				inline:true
			},
			{
				name: `<:Position:763722295813865522> Position:`,
				value: `**\`\`\`yaml\nFrom Bottom: ${target_role.rawPosition} | From Top: ${fromTop_position}\`\`\`**`,
			},
			{
				name: `<:setting:763795544517640252> Managed by an External Service?`,
				value: `${
					target_role.managed ? '**```yaml\nYes```**' : '**```yaml\nNo```**'
				}`,
				inline:true,
			},
			{
				name: `<:RoleCreated:744911736875778089> Role created-At`,
				value: `**\`\`\`ml\n${moment(target_roleMembers.createdAt).format('LT | LL')}\`\`\`**`,
				inline:true,
			},
		)
		.setTimestamp()
		.setFooter(
			`${guild.name}`,
			guild.iconURL() != null ? guild.iconURL({ dynamic:true }) : member.user.displayAvatarURL({dynamic:true})
		);
	if (member.permissions.any(Mod_perms)) {
		role_embed.addField(
			'<:List:729711535248900097> Role permissions',
			`\`\`\`yaml\n${role_permissions}\`\`\``
		);
	}
	role_embed.addFields(
		{
			name: `<:guildMembers:730668536523128895> Members with this (${target_roleMembers})`,
			value: `${members_target_role}`
		}
	)
	channel.send(role_embed);
};

module.exports.help = {
	name: 'roleinfo',
	description: 'Gives information about a mentioned role',
	aliases: ['rinfo','ri'],
	usage: 'roleinfo < @role | roleID >',
	category: 'information',
	disabled: false
};

module.exports.help = {
	name: 'roleinfo',
	description: 'Gives information about a mentioned role',
	aliases: ['rinfo'],
	usage: 'roleinfo < @role / roleID >',
	category: 'information',
};

module.exports.requirements = {
	ownerOnly: false,
	clientPerms: [],
	userPerms: [],
};

module.exports.limits = {
	cooldown: 5e3,
};
