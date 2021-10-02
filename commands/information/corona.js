const { MessageEmbed } = require('discord.js');
const got = require('got');
const moment = require('moment');
const { helpfunc } = require('../general/help')

module.exports.run = async (client, message, args, prefix) => {
	
	if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

	if (!args[0]) {
		const embed = new MessageEmbed();
		const msg = await message.channel.send(
			embed
				.setDescription(`<a:loading:639060628341915658> fetching data....`)
				.setColor('#0099ff')
		);
	got('https://corona.lmao.ninja/v2/all').then((res) => {
		let content = JSON.parse(res.body);
		let updated = moment(content.updated).format('LTS | LL');
			const embed = new MessageEmbed()
				.setTitle('COVID-19 Global Statistics')
				.setThumbnail('https://media.discordapp.net/attachments/686714343320322048/737288714987765901/2Q.png')
				.addFields(
					    {
							name: `Affected Countries`,
							value: `**\`\`\`xl\n${numberWithSpaces(content.affectedCountries.toString())}\`\`\`**`,
							inline: true,
						},
						{
							name: `Current Data as of today:`,
							value: `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
						},
						{
							name: `Cases`,
							value: `**\`\`\`xl\n${numberWithSpaces(content.todayCases.toString())}\`\`\`**`,
							inline: true,
						},
						{
							name: `Deaths`,
							value: `**\`\`\`xl\n${numberWithSpaces(content.todayDeaths.toString())} | ${getPercentage(content.todayCases.toString(), content.todayDeaths.toString())}%\`\`\`**`,
							inline: true,
						},
						{
							name: `Recovered`,
							value: `**\`\`\`xl\n${numberWithSpaces(content.todayRecovered.toString())} | ${getPercentage(content.todayCases.toString(), content.todayRecovered.toString())}%\`\`\`**`,
							inline: true,
						},
						{
							name: `Current Statistic`,
							value: `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
						},
						{
							name: `Cases`,
							value: `**\`\`\`xl\n${numberWithSpaces(content.cases.toString())}\`\`\`**`,
							inline: true,
						},
						{
							name: `Deaths`,
							value: `**\`\`\`xl\n${numberWithSpaces(content.deaths.toString())} | ${getPercentage(content.cases.toString(), content.deaths.toString())}%\`\`\`**`,
							inline: true,
						},
						{
							name: `Recovered`,
							value: `**\`\`\`xl\n${numberWithSpaces(content.recovered.toString())} | ${getPercentage(content.cases.toString(), content.recovered.toString())}%\`\`\`**`,
							inline: true,
						},
						{
							name: `Active Cases`,
							value: `**\`\`\`xl\n${numberWithSpaces(content.active.toString())} | ${getPercentage(content.cases.toString(), content.active.toString())}%\`\`\`**`,
							inline: true,
						},
						{
							name: `Critical Cases`,
							value: `**\`\`\`xl\n${numberWithSpaces(content.critical.toString())} | ${getPercentage(content.cases.toString(), content.critical.toString())}%\`\`\`**`,
							inline: true,
						},
						{
							name: `Tests`,
							value: `**\`\`\`xl\n${numberWithSpaces(content.tests.toString())}\`\`\`**`,
							inline: true,
						}
					)
					.addField(`Updated At`, `**\`\`\`ml\n${updated}\`\`\`**`, true)
					.setFooter(
						`${message.guild.name}`,
						message.guild.iconURL({ dynamic: true })
					)
					.setTimestamp()
					.setColor(`#0099ff`);
				msg.edit('', embed);
			});
		} else {
			let fembed = new MessageEmbed();
			try {
				got(
					`https://disease.sh/v3/covid-19/countries/${args[0].toLowerCase()}?yesterday=false&allowNull=true`
				)
					.then(async (res) => {
						const msg = await message.channel.send(
							fembed
								.setDescription(
									`<a:loading:639060628341915658> fetching data....`
								)
								.setColor('#0099ff')
						);
						let content = JSON.parse(res.body);
						let updated = moment(content.updated).format('LTS | LL');
						const cembed = new MessageEmbed()
							.setTitle(`COVID-19 Stats for ${content.country}`)
							.setThumbnail(`${content.countryInfo.flag}`)
							.addFields(
								{
									name: `Continent`,
									value: `${content.continent}`,
									inline: true,
								},
								{
									name: `Current Data as of today:`,
									value: `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
								},
								{
									name: `Cases`,
									value: `**\`\`\`xl\n${content.todayCases != null ? numberWithSpaces(content.todayCases.toString()) : `'NO DATA FOUND'`}\`\`\`**`,
									inline: true,
								},
								{
									name: `Deaths`,
									value: `**\`\`\`xl\n${content.todayDeaths != null ? `${numberWithSpaces(content.todayDeaths.toString())} | ${getPercentage(content.todayCases.toString(), content.todayDeaths.toString())}%` :`'NO DATA FOUND'`}\`\`\`**`,
									inline: true,
								},
								{
									name: `Recovered`,
									value: `**\`\`\`xl\n${content.todayRecovered != null ? `${numberWithSpaces(content.todayRecovered.toString())} | ${getPercentage(content.todayCases.toString(), content.todayRecovered.toString())}%` : `'NO DATA FOUND'`}\`\`\`**`,
									inline: true,
								},
								{
									name: `Current Statistic`,
									value: `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
								},
								{
									name: `Cases`,
									value: `**\`\`\`xl\n${content.cases != null ? `${numberWithSpaces(content.cases.toString())}` : `'NO DATA FOUND'`}\`\`\`**`,
									inline: true,
								},
								{
									name: `Deaths`,
									value: `**\`\`\`xl\n${content.deaths != null ? `${numberWithSpaces(content.deaths.toString())} | ${getPercentage(content.cases.toString(), content.deaths.toString())}%` : `'NO DATA FOUND'`}\`\`\`**`,
									inline: true,
								},
								{
									name: `Recovered`,
									value: `**\`\`\`xl\n${content.recovered != null ? `${numberWithSpaces(content.recovered.toString())} | ${getPercentage(content.cases.toString(), content.recovered.toString())}%` : `'NO DATA FOUND'`}\`\`\`**`,
									inline: true,
								},
								{
									name: `Active Cases`,
									value: `**\`\`\`xl\n${content.active != null ? `${numberWithSpaces(content.active.toString())} | ${getPercentage(content.cases.toString(), content.active.toString())}%` : `'NO DATA FOUND'`}\`\`\`**`,
									inline: true,
								},
								{
									name: `Critical Cases`,
									value: `**\`\`\`xl\n${content.critical != null ? `${numberWithSpaces(content.critical.toString())} | ${getPercentage(content.cases.toString(), content.critical.toString())}%` : `'NO DATA FOUND'`}\`\`\`**`,
									inline: true,
								},
								{
									name: `Tests`,
									value: `**\`\`\`xl\n${content.tests != null	? `${numberWithSpaces(content.tests.toString())}` : `'NO DATA FOUND'`}\`\`\`**`,
									inline: true,
								}
							)
							.addField(`Updated At`, `**\`\`\`ml\n${updated}\`\`\`**`, true)
							.setFooter(
								`${message.guild.name}`,
								message.guild.iconURL({ dynamic: true })
							)
							.setTimestamp()
							.setColor(`#0099ff`);
						msg.edit('', cembed);
					})
					.catch((err) => {
						console.log(err);
						let errembed = new MessageEmbed();
						return message.channel.send(
							errembed
								.setDescription(
									`An Error occured. Please make sure you've given a valid country name.`
								)
								.setColor('RED')
						);
					});
			} catch (error) {
				console.log(error);
				const errorembed = new MessageEmbed();
				message.channel.send(
					errorembed
						.setDescription(`An erro occured!\n\`${error}\``)
						.setColor('RED')
				);
			}
		}
};

function getPercentage(origin, part, fixed = 2) {
    return (parseInt(part) * 100 / parseInt(origin)).toFixed(fixed);
}

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

	module.exports.help = {
		name: 'corona',
		description: `Gives info about COVID-19`,
		aliases: ['covid', 'covid19'],
		usage: `corona [ country ]`,
		category: 'information',
	};

	module.exports.requirements = {
		ownerOnly: false,
		userPerms: [],
		clientPerms: [],
	};

	module.exports.limits = {
		cooldown: 5e3,
	};
