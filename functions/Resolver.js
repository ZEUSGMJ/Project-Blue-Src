const { regEscape } = require('./Util')

module.exports = {
    
    RoleResolver: (roleResolver = (guild, role) => {
        let mention = new RegExp('<@&([0-9]+)>', 'g').exec(role);
    
        if (mention && mention.length > 1) {
            return guild.roles.cache.get(mention[1]);
        }
        if (role.match(/^([0-9]+)$/)) {
            let roleIdSearch = guild.roles.cache.get(role);
            if (roleIdSearch) return roleIdSearch;
        }
    
        let exactNameSearch = guild.roles.cache.find(
            (r) => r.name.toLowerCase() === role.toLowerCase()
        );
        if (exactNameSearch) return exactNameSearch;
    
        let roleNameSearch = guild.roles.cache.find((r) => r.name === role);
        if (roleNameSearch) return roleNameSearch;
    
        return null;
    }),

    UserResolver: (userResolver = (guild, user, exact) => {

        if (!user) return null;
        
		// check if it's a mention
        let mentionId = new RegExp('<@!?([0-9]+)>', 'g').exec(user);
        
		if (mentionId && mentionId.length > 1) {
			return guild.members.cache.find(u => u.user.id === mentionId[1]);
		}

		// check if it's username#1337
		if (user.indexOf('#') > -1) {
			let [name, discrim] = user.split('#'),
				nameDiscrimSearch = guild.members.cache.find(u => u.user.username === name && u.user.discriminator === discrim);
			if (nameDiscrimSearch) return nameDiscrimSearch;
		}

		// check if it's an id
		if (user.match(/^([0-9]+)$/)) {
			let userIdSearch = guild.members.cache.find(u => u.user.id === user);
			if (userIdSearch) return userIdSearch;
		}

		let exactNameSearch = guild.members.cache.find(u => u.user.username === user);
		if (exactNameSearch) return exactNameSearch;

		if (!exact) {
			const escapedUser = regEscape(user);
			// username match
			let userNameSearch = guild.members.cache.find(u => u.user.username.match(new RegExp(`^${escapedUser}.*`, 'i')));
			if (userNameSearch) return userNameSearch;
		}

		return null;
	}),

    ChannelResolver: (channelResolver = (guild, channel) => {

		let mention = new RegExp('<#([0-9]+)', 'g').exec(channel);
		if (mention && mention.length > 1) {
			return guild.channels.cache.get(mention[1]);
		}

		if (channel.match(/^([0-9]+)$/)) {
			let channelIdSearch = guild.channels.cache.get(channel);
			if (channelIdSearch) return channelIdSearch;
		}

		let channelNameSearch = guild.channels.cache.find(c => c.name === channel);
		if (channelNameSearch) return channelNameSearch;

        return null;
    })
}