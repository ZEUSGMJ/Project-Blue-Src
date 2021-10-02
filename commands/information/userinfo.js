const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { StringReplacer, invalidMember, joinPosition} = require("../../functions/Util")
const { helpfunc } = require('../general/help')
const { UserResolver } = require('../../functions/Resolver')

const device_Status = {
	mobileonline: '<:MobileOnline:727871726351941693>',
	mobileidle: '<:Mobileidle:728627482516783205>',
	mobilednd: '<:MobileDnD:728627481690767392>',
	webonline: '<:WebOnline:728627500556615761>',
	webidle: '<:webIdle:728627496462843976>',
	webdnd: '<:webDND:728627489814872074>',
	desktoponline: '<:Onlineicon:729271293714890844>',
	desktopidle: '<:IdleIcon:729271293026893857>',
	desktopdnd: '<:DNDicon:729271292863315978>'
}

const badges = {
	DISCORD_EMPLOYEE: '<:Discord_Staff:727871724032360540> **➜** Discord Staff',
	DISCORD_PARTNER: '<:Discord_Partner:727871724376293486> **➜** Discord Partner',
	PARTNERED_SERVER_OWNER: `<:PartneredBadge:754350009000001586> **➜** Partnered Server Onwer`,
	HYPESQUAD_EVENTS: '<:HypeSquad_Events:728960501924757617> **➜** HypeSquad Events',
	BUGHUNTER_LEVEL_1: '<:BugHunter_Level1:727871716084285460> **➜** Bughunter Level-1',
	HOUSE_BRAVERY: '<:Badge_Bravery:788383200384385064> **➜** House of Bravery',
	HOUSE_BRILLIANCE: '<:Badge_Brillance:788383208764080169> **➜** House of Brilliance',
	HOUSE_BALANCE: '<:Badge_Balance:788383198459068436>  **➜** House of Balance',
	EARLY_SUPPORTER: '<:EarlySupporterBadge:727871724183486525> **➜** Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: '<:system1:727871736581718056><:system2:727871736007360613> **➜** System',
	BUGHUNTER_LEVEL_2: '<:BugHunter_Level2:727871726289027114> **➜** Bughunter Level-2',
	VERIFIED_BOT: '<:VerBot1:728961429083914292><:VerBot2:728961428878524488> **➜** Verified Bot',
	VERIFIED_DEVELOPER: '<:VerifiedBotDeveloper:727871728130326609> **➜** Verified Bot Developer',
	EARLY_VERIFIED_DEVELOPER: '<:VerifiedBotDeveloper:727871728130326609> **➜** Early Verified Bot Developer',
};

let nitroDiscrim = ['6969','1234','0690']

module.exports.run = async (client, message, args) => {

	let {guild, channel} = message;

	if (args.length != 0 && args[0] === 'help' ) {
		return helpfunc.getCMD(client, message, this.help.name, prefix)
	}

	let member;
	
	!args[0] ? member = message.member : member = UserResolver(message.guild, args[0]);

	if (!member) return invalidMember(channel);

	let accountAge = moment(member.user.createdTimestamp).fromNow() || moment(member.createdTimestamp).fromNow(), joinedAge = moment(member.joinedAt).fromNow()
	
	let created = `${moment(member.user.createdAt).format('LLLL')}\n(${accountAge[0] + ' ' +accountAge[2].toLocaleUpperCase() +	accountAge.slice(3)})`;
	let joined_At = `${moment(member.joinedAt).format('LLLL')}\n(${joinedAge[0] + ' ' +joinedAge[2].toLocaleUpperCase() +	joinedAge.slice(3)})`;

	let color = member.displayHexColor || null;
	let perms = member.permissions.toArray().map( (perm) =>	`\n✔️ ${StringReplacer(perm)}`).join(' ');

	perms.includes('Administrator') ? (perms = '⚙️ Administrator') : perms;
	
	if (member.id === message.guild.owner.id) perms = `👑 Server Owner`;
	
	let membadge = (await member.user.fetchFlags()).toArray()
		.filter(f => !["DISCORD_PARTNER", "VERIFIED_DEVELOPER"].includes(f))
		.map((badge) => `${badges[badge]}`)

	let roles = member.roles.cache
		.filter((r) => r.id !== message.guild.id)
		.sort( (a,b) => b.position - a.position)
		.map((r) => r)

	roles.length > 25 ? roles = roles.slice(0, 25) + ` ${roles.length - roles.slice(0, 25).length} more...` : roles = roles
	!roles ? roles = `\`None\`` : roles

	let joinPos = [...message.guild.members.cache.values()].sort((a, b) => (a.joinedAt < b.joinedAt) ? -1 : ((a.joinedAt > b.joinedAt) ? 1 : 0))
														   .filter(m => !m.bot)
														   .findIndex(m => m.id === member.id) + 1
	
	let joinOrder = joinPosition(guild, member.id, 1)

	if (!member.user.avatar ? false : member.user.avatar.startsWith('a_') || member.user.discriminator.startsWith('000') || member.user.discriminator.endsWith('000') || nitroDiscrim.includes(member.user.discriminator) || member.premiumSince != null) membadge.push('<:NitroBadge:753010489612566709> **➜** Discord Nitro')

	if (member.presence.activities.length != 0) {

		let customStatus = member.presence.activities.find( ({ type }) => type === 'CUSTOM_STATUS')

		if (customStatus != undefined && customStatus.emoji != undefined)  {
			if (customStatus.emoji.animated === true || /^\d+$/.test(customStatus.emoji.id) != false) !membadge.includes('<:NitroBadge:753010489612566709> **➜** Discord Nitro') ? membadge.push('<:NitroBadge:753010489612566709> **➜** Discord Nitro') : membadge
		}
	}

	let bot;
	member.user.bot ? (bot = `<:Bot:729611594467901450> \`Bot\``) : (bot = `<:user:725744110262288384> \`Discord User\``);

	let memberStatus = 'No custom status';
	let userActivity = '';
	let pState = [];
	let pDetail = [];
	if (member.presence.activities.length === 0 || (member.presence.activities.length === 1 && member.presence.activities[0].type === 'CUSTOM_STATUS'))	userActivity = `No Activity Detected`;

	for (i = 0; i < member.presence.activities.length; i++) {
		if (member.presence.activities[i].type === 'CUSTOM_STATUS') {
			memberStatus = `${member.presence.activities[i].state === null ? `No custom status message.` : member.presence.activities[i].state}`;
		}
	}

	for (i = 0; i < member.presence.activities.length; i++) {
		if (member.presence.activities[i].type != 'CUSTOM_STATUS') {
			pName = `${member.presence.activities[i].name}`;
			pType = `${member.presence.activities[i].type.toLowerCase()}`;
			pDetail =
				member.presence.activities[i].details == 'null'
					? '\u200b'
					: `${member.presence.activities[i].details}`;
			pState =
				member.presence.activities[i].state == 'null'
					? '\u200b'
					: `${member.presence.activities[i].state}`;
			if (pState == 'null') pState = '';
			if (pDetail == 'null') pDetail = '';
			userActivity += `${member.user.username} is ${pType}:\nName: ${pName}\n\t  ${pDetail}\n\t  ${pState}\n`;
		}
	}

	!member.nickname ? nick = `No Nickname` : nick = `${member.nickname}`
	
	let devices = [];

	let boostAge = getBoost(member.premiumSinceTimestamp)

	if (member.presence.clientStatus === null || Object.keys(member.presence.clientStatus).length === 0 && member.presence.clientStatus.constructor === Object) {
		devices.push('<:Offlineicon:729271292745875557>');
	} else {
		for ( const [device, status] of Object.entries(member.presence.clientStatus) ) {
			let entries = device+status
			devices.push(device_Status[entries])
		}
	}

	const embed = new MessageEmbed()
		.setAuthor(`${member.user.username}'s Info`, member.user.displayAvatarURL({dynamic: true}), member.user.displayAvatarURL({dynamic: true, size: 1024}))
		.setDescription(`${member.toString()}`)
		.setColor(color)
		.setTimestamp()
		.setThumbnail(member.user.displayAvatarURL() != null ? member.user.displayAvatarURL({ dynamic: true}) : null)
		.addField('User <:ID:727871735097065632>',`\`\`\`ml\n${member.id}\`\`\``, true)
		.addField('<:usertag:727906766180057188> Tag', `\`\`\`ml\n${member.user.tag}\`\`\``, true)
		.addField(`Nickname`, `${member.nickname ? `\`\`\`ml\n${member.nickname}\`\`\`` : `\`\`\`ml\nNo Nickname\`\`\``}`)
		.addField('Avatar Link',`[\`Click here\`](${member.user.displayAvatarURL({ dynamic: true, size: 1024})})`, true)
		.addField(`User Type`,`${bot}`, true)
		.addField('<:presence:729725319501840454> Presence',`${devices.join('')}`, true)
		.addField(`<a:Boost:731098670082162709> Boosting since:`,`${boostAge}`, true)
		.addField('Join Position',`\n**#${joinPos}/#${guild.members.cache.size}**\n${joinOrder}`)
		.addField('Badges',`${membadge != '' ? membadge.join('\n') : `\`No Badges\``}`)
		.addField(`Roles [${member.roles.cache.filter(r => r.id != guild.id).size}]`,`${roles}`)
		.addField('<:memberjoin:729313450320461854> Joined At',`\`\`\`ml\n${joined_At}\`\`\``, true)
		.addField('<:Created:729727257521815583> Created At', `\`\`\`ml\n${created}\`\`\``,true)
		.addField(`<:CustomStatus:729710985392423033> Custom Status`, `\`\`\`yaml\n${memberStatus}\`\`\``)
		.addField('<:List:729711535248900097> Permissions',`\`\`\`yaml\n${perms}\`\`\``)
		.addField('<:IconController:729710985094365254> Activity',`\`\`\`yaml\n${userActivity.trim()}\`\`\``)
		.setFooter(`${guild.name}`, guild.iconURL() != null ? guild.iconURL({dynamic: true}) : message.member.user.displayAvatarURL({dynamic:true}))

	console.log(embed.fields[9])
	channel.send(embed)
};

module.exports.help = {
	name: 'userinfo',
	description: `Get's detailed information about the mentioned user.`,
	category: 'information',
	aliases: ['uinfo','ui'],
	usage: `userinfo < ID / @user >`,
	disabled: false
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 5e3,
};

function getBoost(timestamp) {

	let DaysBoosted;

	if(!timestamp) return '`Not Boosting`'

	DaysBoosted = moment.duration(Date.now() - timestamp).asDays().toFixed(4)

	if (DaysBoosted < 60.8334) return `<:Boosting1:730362986044325939> ${moment(timestamp).format('LT, LL')}`

	if (DaysBoosted > 60.8334 && DaysBoosted < 91.25) return `<:Boosting2:730362995380715531> ${moment(timestamp).format('LT, LL')}`

	if (DaysBoosted > 91.25 && DaysBoosted < 182.5) return `<:Boosting3:730362996613840937> ${moment(timestamp).format('LT, LL')}`
	
	if (DaysBoosted > 182.5 && DaysBoosted < 273.75) return `<:Boosting6:730362997821800459>  ${moment(timestamp).format('LT, LL')}`

	if (DaysBoosted > 273.75 && DaysBoosted < 365) return `<:Boosting9:730362998652141659>  ${moment(timestamp).format('LT, LL')}`

	if (DaysBoosted > 365 && DaysBoosted < 456.25) return `<:Boosting12:730363008663945246> ${moment(timestamp).format('LT, LL')}`

	if (DaysBoosted > 456.25 && DaysBoosted < 547.501) return `<:Boosting15:730363008894632016> ${moment(timestamp).format('LT, LL')}`

	if (DaysBoosted > 547.501 && DaysBoosted < 730.001) return `<:Boosting18:730363008404029451> ${moment(timestamp).format('LT, LL')}`

	if (DaysBoosted >  730.001) return `<:Boosting24:730363008810745856> ${moment(timestamp).format('LT, LL')}`	
}
