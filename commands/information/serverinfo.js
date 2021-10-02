const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { StringReplacer } = require('../../functions/Util');
const { helpfunc } = require('../general/help')
const { progress } = require('../../functions/Util')

const Guild_Region = {
    brazil: ':flag_br: **`Brazil`**',
    europe: ':flag_eu: **`Europe`**',
    hongkong: ':flag_hk: **`Hong Kong`**',
    india: ':flag_in: **`India`**',
    japan: ':flag_jp: **`Japan`**',
    russia: ':flag_ru: **`Russia`**',
    singapore: ':flag_sg: **`Singapore`**',
    southafrica: ':flag_za: **`South-Africa`**',
    sydney: ':flag_au: **`Sydney`**',
    'us-central': ':flag_us: **`US-Central`**',
    'us-east': ':flag_us: **`US-East`**',
    'us-south': ':flag_us: **`US-South`**',
    'us-west': ':flag_us: **`US-West`**',
}

const boostTier = {
    0: '<:ServerBoostLevel0:731087774773674034> **`NONE`**',
    1: '<:ServerBoostLevel1:731087774983258133> **`Tier 1`**',
    2: '<:ServerBoostLevel2:731087777382268959> **`Tier 2`**',
    3: '<:ServerBoostLevel3:731087777688584222> **`Tier 3`**',
  };

module.exports.run = async (client, message, args, prefix) => {

	if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

    let { guild, author, channel } = message
    let str = ''

    guild.memberCount != guild.members.cache.size ? await guild.members.fetch({ withPresence: true }) : false

    if (guild.verified) str = '<:Verified:798511275734073364>'
    if (guild.partnered) ste = '<:Partnered:798511275788599336>'

    let owner = await guild.members.fetch(guild.ownerID)

    let roles;

    guild.roles.cache.filter( r => r.id !== guild.id).size === 0 ? roles = 'None' : roles = `${guild.roles.cache.sort((a, b) => b.position - a.position).first(15).filter((r) => r.id !== guild.id).map((r) => r.toString())}${guild.roles.cache.sort((a, b) => b.position - a.position).filter((r) => r.id !== guild.id).size > 15 ? `...${guild.roles.cache.sort((a, b) => b.position - a.position).filter((r) => r.id !== guild.id).size - 15} more` : ''}`;
    
    let rolecount = guild.roles.cache.filter( (r) => r !=+ guild.id ).size;

    let voice_channel_count = guild.channels.cache.filter( (channel) => channel.type === 'voice' ).size
    let text_channels_count = guild.channels.cache.filter( (channel) => channel.type === 'text' ).size
    let category_channels_count = guild.channels.cache.filter( (channel) => channel.type === 'category' ).size

    let animated_emotes , non_animated_emotes;

    let boostersCount = guild.premiumSubscriptionCount;

    boostersCount > 30 ? boostersCount = 30 : boostersCount;
    let boostProgress = `[${progress(boostersCount, 30, '=')}]`
    
    guild.emojis.cache.filter(e => e.animated).size === 0 ? animated_emotes = `None` : animated_emotes = `${guild.emojis.cache.filter(e => e.animated).first(8).map(e => e.toString()).join(' | ')}${guild.emojis.cache.filter(e => e.animated).size > 8 ? `...${guild.emojis.cache.filter(e => e.animated).size - 8} more` : ''}`
    guild.emojis.cache.filter(e => !e.animated).size === 0 ? non_animated_emotes = `None` : non_animated_emotes = `${guild.emojis.cache.filter(e => !e.animated).first(8).map(e => e.toString()).join(' | ')}${guild.emojis.cache.filter(e => !e.animated).size > 8 ? ` ...${guild.emojis.cache.filter(e => !e.animated).size - 8} more` : ''}`

    let serverInfo_embed = new MessageEmbed()
        .setTitle(`${str}${guild.name}'s Server Information`)
        .setColor(guild.roles.highest.hexColor === '#000000' ? '#221f2e' : guild.roles.highest.hexColor)
        .setThumbnail(guild.iconURL() != null ? guild.iconURL({ dynamic: true, size: 1024 }) : null)
        .setFooter(`${author.tag}`, author.displayAvatarURL({ dynamic: true }))
        .addField(`Name`, `${guild.name} \`[${guild.id}]\``)
        .addField(`Owner`, `[${owner.user.tag}](${owner.user.displayAvatarURL({ dynamic:true, size: 1024 })}) \`[${guild.owner.user.id}]\``)
        .addField(`Created At`,`${moment(guild.createdAt).format('LLLL')}`, true)
        .addField(`Server Region`, `${Guild_Region[guild.region]}`, true)
        .addField(`Verification Level`,`${guild.verificationLevel.replace(/_/g,' ').toLowerCase().replace(/\b(\w)/g, (char) => char.toUpperCase())}`)

        if (guild.vanityURL) serverInfo_embed.addField(`Vanity URL`, `https://discord.gg/${guild.vanityURLCode}`)

        serverInfo_embed.addField(`Server Boost info`,`>>> **Boost Level**: ${boostTier[guild.premiumTier]}\n**Boosters**: ${guild.premiumSubscriptionCount}\n**Progress**:\n\`\`\`${boostProgress}\`\`\``, true)
        serverInfo_embed.addField(`Channels Info`,`>>> **AFK Channel**: ${guild.afkChannel ? `${guild.afkChannel.toString()} \`[${guild.afkChannel.name}]\`` : '\`None\`'}\n **AFK Timeout**: ${guild.afkTimeout / 60 === 60 ? '1 Hour' : `${guild.afkTimeout /60} min`}\n**Voice Channels**: ${voice_channel_count}\n**Text Channels**: ${text_channels_count}\n**Categories**: ${category_channels_count}\n${guild.rulesChannel ? `**Rules Channel**: ${guild.rulesChannel.toString()} \`[#${guild.rulesChannel.name}]\`` : ``}\n${guild.publicUpdatesChannel ? `**Public Updates Channel**: ${guild.publicUpdatesChannel.toString()} \`[#${guild.publicUpdatesChannel.name}]\`` : ``}`)
        serverInfo_embed.addField(`Member Info`,`>>> **Member Count**: ${guild.memberCount}\n**Members**: ${guild.members.cache.filter(m => !m.user.bot).size}\n**Bots**: ${guild.members.cache.filter(m => m.user.bot).size}\n**Member Status**: <:Onlineicon:729271293714890844> \`${guild.members.cache.filter(m => m.presence.status === 'online').size}\` | <:DNDicon:729271292863315978> \`${guild.members.cache.filter(m => m.presence.status === 'dnd').size}\` | <:IdleIcon:729271293026893857> \`${guild.members.cache.filter( m => m.presence.status === 'idle').size}\` | <:Offlineicon:729271292745875557> \`${guild.members.cache.filter(m => m.presence.status === 'offline').size}\` | <:streaming:726393396444266547> \`${guild.members.cache.filter(m => m.presence.activities.find( ({ type }) => type === 'STREAMING')).size}\`\n**Maximum Members**: ${guild.maximumMembers}`)
        serverInfo_embed.addField(`Roles [${rolecount}]`,`${roles}`)
        serverInfo_embed.addField(`Emotes [${guild.emojis.cache.size}]`,`>>> **Non-Animated**:\n${non_animated_emotes}\n**Animated Emotes**:\n${animated_emotes}`)

    if (guild.description != null) serverInfo_embed.setDescription(guild.description)

    if (guild.features.length != 0) serverInfo_embed.addField('Server Features',`${guild.features.map(f => f.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, (char) => char.toUpperCase())).join(', ')}`)

    if (guild.bannerURL != null) serverInfo_embed.setImage(guild.bannerURL({ size: 2048, format:'jpg' }))

    channel.send(serverInfo_embed)
}

module.exports.help = {
	name: 'serverinfo',
	description: 'Gives information about the guild/server.',
	aliases: ['server', 'sinfo','si'],
	category: 'information',
	usage: '<serverinfo>',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 5e3,
};
