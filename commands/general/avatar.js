const { UserResolver } = require('../../functions/Resolver')
const { MessageEmbed } = require('discord.js');
const { separateFlags } = require('../../functions/Util');
const { helpfunc } = require('./help')

module.exports.run = async (client, message, args, prefix) => {
	
	if (args.length !=0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)
	
	let flags = ['--server'];
		
		if (args[0] && args[0].includes(flags)) {
			let guild_icon = new MessageEmbed()
				.setAuthor(`${message.guild.name}`,`${message.guild.iconURL({ format: 'png', dynamic: true, size: 1024})}`)
				.setTitle(`Avatar URL`)
				.setURL(`${message.guild.iconURL({format: 'png', dynamic: true, size: 1024 })}}`)
				.setImage(`${message.guild.iconURL({ format: 'png', dynamic: true, size: 2048,})}`)
				.setColor(`${message.guild.roles.highest.hexColor}` || `#7c7d7c`);
			return message.channel.send(guild_icon);  
		} else {
            let member = UserResolver(message.guild, args[0]);
            if(!member) member = message.member;
            let userAvatar = new MessageEmbed()
                .setAuthor(`${member.user.username}`, `${member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}`)
                .setTitle('Avatar URL')
                .setURL(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
                .setImage(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 }))
                .setColor(member.displayHexColor || `#7c7d7c`)
            return message.channel.send(userAvatar)
		}
};

module.exports.help = {
	name: 'avatar',
	description: `Shows the avatar of an user.`,
	aliases: ['av', 'pfp', 'icon'],
	usage: 'avatar [ @user/user id | --server ]',
	category: 'general',
};

module.exports.requirements = {
	ownerOnly: false,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 3e3,
};
