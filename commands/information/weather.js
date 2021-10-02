const weather = require('weather-js');
const Discord = require('discord.js');
const { getMessages, invalidCMDUsage } = require('../../functions/Util');
const { helpfunc } = require('../general/help')

module.exports.run = async (client, message, args, prefix) => {
	let embed = new Discord.MessageEmbed();

	if (!args || args.length === 0) return invalidCMDUsage(this.help.name, message.channel, client)

	if(args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	weather.find({ search: args.join(' '), degreeType: 'C' }, async function (
		err,
		result
	) {
		if (err) console.log(err)

		if (result.length === 0) {
			return message.channel.send(
				embed
					.setTitle('❌INVALID❌')
					.setDescription('Please enter a valid city.')
					.setColor('RED')
					.setFooter(`${message.guild.name}`, message.guild.iconURL())
			);
		}

		let current = result[0].current;
		let location = result[0].location;
		embed.setAuthor(`${location.name}`);
		embed.setThumbnail(`${current.imageUrl}`);
		embed.setColor('#0099ff');
		embed.addField(
			`Weather for ${current.observationpoint}`,
			`\`\`\`yaml\nCurrently the weather at ${location.name} seems ${current.skytext}. More info related to the weather is given below -\`\`\``
		);
		embed.addFields(
			{
				name: `Temperature`,
				value: `**\`\`\`ml\n${current.temperature} °${location.degreetype}\`\`\`**`,
				inline: true,
			},
			{
				name: `Feelslike`,
				value: `**\`\`\`ml\n${current.feelslike} °${location.degreetype}\`\`\`**`,
				inline: true,
			},
			{
				name: `Humidity`,
				value: `**\`\`\`ml\n${current.humidity} %\`\`\`**`,
				inline: true,
			},
			{
				name: 'Windspeed',
				value: `**\`\`\`ml\n${current.windspeed}\`\`\`**`,
				inline: true,
			},
			{
				name: `Day & Date`,
				value: `**\`\`\`ml\n${current.day} - ${current.date}\`\`\`**`,
			}
		);
		embed.addField(
			`\u200b`,
			`If you want to know the upcoming forecast, Reply with \`yes\` within **15** seconds, else you can continue`
		);
		embed.setFooter(
			`${message.guild.name}`,
			message.guild.iconURL({ dynamic: true })
		);
		embed.setTimestamp();

		let bot_response = message.channel.send(embed);

		let arr_1 = await getMessages(1, 15000, message).catch((e) => {
			return (
				message.channel.send(
					new Discord.MessageEmbed()
						.setTitle('⏲️ Timeout')
						.setDescription('There was no reply from your side.')
						.setColor('RED')
						.setFooter(
							`${message.guild.name}`,
							message.guild.iconURL({ dynamic: true })
						)
				).then(msg => msg.delete({ timeout: 3e3 }))
			);
		});

		let response_1 = arr_1[0];
		if (!response_1) return;

		if (response_1.content == 'yes' || response_1.content == 'y') {
			let embed1 = new Discord.MessageEmbed();
			let futureForecast = '';
			for (let i = 1; i < result[0].forecast.length; i++) {
				low = result[0].forecast[i].low;
				high = result[0].forecast[i].high;
				skytext = result[0].forecast[i].skytextday;
				fdate = result[0].forecast[i].date;
				fday = result[0].forecast[i].day;
				precip = result[0].forecast[i].precip;
				futureForecast = `Lowest Temperature:   ${low}\nHighest Temperatur:   ${high}\nSky:                  ${skytext}\nPrecipitation:        ${precip}`;
				embed1.addField(`${fday} | ${fdate}`,`\`\`\`yaml\n${futureForecast}\`\`\``)
			}
			return message.channel.send(
				embed1
					.setTitle(`Upcoming Forecasts for ${location.name}`)
					//.setDescription(`\`\`\`yaml\n${futureForecast}\`\`\``)
					.setColor('#0099ff')
					.setFooter(
						`${message.guild.name}`,
						message.guild.iconURL({ dynamic: true })
					)
			);
		}
	});
};

module.exports.help = {
	name: 'weather',
	description: "Give's weather information of a city.",
	category: 'information',
	usage: 'weather < a-valid-city-name >',
	disabled: false
};

module.exports.requirements = {
	ownerOnly: false,
	clientPerms: [],
	userPerms: [],
};

module.exports.limits = {
	cooldown: 5e3,
};
