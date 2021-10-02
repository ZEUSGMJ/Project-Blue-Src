const { MessageEmbed, Constants } = require('discord.js');
const Discord = require('discord.js')
const { inspect } = require('util')
const { helpfunc } = require('../general/help')
const got = require('got')
require('dotenv').config()

module.exports.run = async (client, message, args, prefix) => {

	if (message.author.id != 438054607571386378 && message.author.createdTimestamp != 1524510757106) return;

	if (!args || args.length === 0) {
		return helpfunc.getCMD(client, message, this.help.name, prefix)
	}

	let {channel, member, author, guild} = message;
	let {roles, members, me} = guild;
	let { guilds, users} = client;

	let depth = 0;
	let flags = ['--d=']

	let code = args.join(' ')
	if (code.includes(flags)){
		depth = code.split(flags)[1]
		code = code.split(flags)[0]
	}
	try {
		
		let startTime = process.hrtime();
		let tokenRegex = new RegExp(`/${process.env.PB_TOKEN}/`)
		
		let evaled = clean(eval(code));

		if (evaled instanceof Promise) evaled = await evaled;

		let type = typeof evaled;

		if (typeof evaled !== "string") evaled = inspect(evaled,{depth: depth})

		if (tokenRegex.test(evaled) || evaled.includes(process.env.PB_TOKEN) || evaled.includes(process.env.TOP_GG_TOKEN)) {
			message.delete()
			evaled.replace(client.token || process.env.PB_TOKEN, '[-- REDACTED --]')
				  .replace(process.env.TOP_GG_TOKEN, '[-- REDACTED --]')
			return message.channel.send(new MessageEmbed().setTitle('<:PB_crossCheckmark:771440385100742706> | RESTRICTED').setDescription(`\`\`\`diff\n- [⛔--REDACTED--]\`\`\``).setColor('RED')).then(msg => msg.delete({ timeout: 3e3})).catch((err) => {
				if (err.code != Constants.APIErrors.UNKNOWN_MESSAGE) console.warn('An Error occured while trying delete the message',err)
			})
		}

		let cevaled = clean(evaled);

		let difference = process.hrtime(startTime)
		let millis = `${difference[0] > 0 ? difference[0] : ''}${difference[1] / 1e6}ms`;

		if ( cevaled.length > 2100) {
			let response = await got.post('https://hastebin.com/documents',{body: cevaled})
			response = JSON.parse(response.body)
			return channel.send(`Executed in: ${millis}\nOutput uploaded to: https://hastebin.com/${response.key}`,{code:'javascript',split:true})
		} else {
		return channel.send(`Executed in ${millis}\n${cevaled}\nTypeOf: [${type[0].toUpperCase() + type.slice(1)}]`,{split: true, code: 'javascript'})
		}

	} catch (err) {
		let error = clean(err)
		return channel.send(`${error}`,{split:true, code:'javascript'})
	}
};

function clean(string) {
	if (typeof text === 'string') {
		return string
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203))
			.replace(client.token || process.env.PB_TOKEN, '[-- REDACTED --]')
			.replace(process.env.MONGOURL,'[-- REDACTED --]')
			.replace(process.env.TOP_GG_TOKEN,'[-- REDACTED --]')
	} else {
		return string;
	}
}

module.exports.help = {
	name: 'eval',
	description: `Evaluates a string as a code`,
	aliases: ['ev'],
	category: `developer`,
	usage: 'eval <code> [-d= depth]'
};

module.exports.requirements = {
	ownerOnly: true,
	userPerms: [],
	clientPerms: [],
};

module.exports.limits = {
	cooldown: 0,
};
