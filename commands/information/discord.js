const { MessageEmbed } = require('discord.js');
const got = require('got');
const moment = require('moment');
const puppeteer = require('puppeteer');
const { helpfunc } = require('../general/help')

const indicator = {
	none: `\`\`\`None\`\`\``,
	minor: `\`\`\`yaml\nMinor\`\`\``,
	major: `\`\`\`fix\nMajor Outage\`\`\``,
	critical: `\`\`\`diff\n- CRITICAL -\`\`\``,
};

module.exports.run = async (client, message, args, prefix) => {

    if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix)

    let statusEmbed = new MessageEmbed();
    const API_ImageEmbed = new MessageEmbed();

    const msg = await message.channel.send(new MessageEmbed().setDescription('<a:loading:639060628341915658> fetching data please wait (it may take some time for collecting the data and then sending it)...').setColor('#0099ff'));

    const Note_embed = new MessageEmbed()
		.setDescription(`<:IconBlueHint:756519682546073672> **Note:** In case there's an issue where the Embed doesn't load properly or you don't see the image. It can be due to a Major issue at [\`Discord's Status\`](https://status.discord.com)`)
        .setColor('#0099ff');
        
    got('https://srhpyqt94yxb.statuspage.io/api/v2/summary.json').then(async res => { //get the summary of the discord status

        let statusBody = JSON.parse(res.body);
        let StatusDescription = statusBody.status.description;
        let StatusIndicator = statusBody.status.indicator;
        let StatusUpdated_at = moment(statusBody.page.updated_at).utc().format('llll')

        statusEmbed.setTitle('<:Discord:734450524933455922> Discord Status');
        statusEmbed.setURL(`${statusBody.page.url}`)
        statusEmbed.addFields(
            { name: 'Indicator', value: `${indicator[StatusIndicator]}`, inline: true},
            { name: 'Status', value: `\`\`\`${StatusDescription}\`\`\``, inline: true }
            )
        statusEmbed.setColor('#0099ff')
        statusEmbed.setTimestamp()
        statusEmbed.setFooter(`React the embed with 📜 to get more detailed information!`, message.guild.iconURL({dynamic:true}))

        if(statusBody.incidents.length != 0) { //check whether there's any ongoing incident
            let StatusCurrentIssue = statusBody.incidents[0].name;
            let StatusCurrentStatus = statusBody.incidents[0].status;
            let StatusCreatedAt = statusBody.incidents[0].created_at != null ? moment(statusBody.incidents[0].created_at).format('llll') : 'No Data'
            let StatusUpdatedAt = statusBody.incidents[0].updated_at != null ? moment(statusBody.incidents[0].updated_at).format('llll') : 'No Data'
            let StatusUpdate = statusBody.incidents[0].incident_updates[0].body
            statusEmbed.addField(`Current Issue`,`\`\`\`asciidoc\nIssue        :: ${StatusCurrentIssue}\nStatus       :: ${StatusCurrentStatus}\nCreated At   :: ${StatusCreatedAt}\nUpdated At   :: ${StatusUpdatedAt}\nUpdate       :: ${StatusUpdate}\`\`\``)
        }
        await msg.edit({embed: statusEmbed}); //edit the message with the embed
        await msg.react('📜');

        const reactionFilter = (reaction, user) => reaction.emoji.name == `📜` && user.id == message.author.id;

        msg.awaitReactions(reactionFilter, { max:1, time: 15000, errors: ['time']}).then(async reactions => {

            const msg2 = await message.channel.send(new MessageEmbed().setDescription('<a:loading:639060628341915658> Hold on, while i grab some more details....').setColor('#0099ff'));

            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
            const page = await browser.newPage();
            await page.goto('https://discordstatus.com/', {
                waitUntil: 'networkidle0',
                timeout: 0,
            });
            let element = await page.$('#custom-metrics-container > div.metrics-container');

            let img = await element.screenshot({ path: './api.jpg' });
            await browser.close();

            API_ImageEmbed.attachFiles([{ attachment: './api.jpg', name: 'api.jpg' }]);
            API_ImageEmbed.setImage('attachment://api.jpg');
            API_ImageEmbed.setColor('#0099ff')

            msg.reactions.removeAll();

            got('https://srhpyqt94yxb.statuspage.io/api/v2/incidents.json').then(async (res) => {
                let icontent = JSON.parse(res.body);
                let update = moment(icontent.page.updated_at).format('llll');
                let incidents_info = '';
                for (let i = 0; i < 3; i++) {

                    let imonitoring_at, iresolved_at;
                    iname = `${icontent.incidents[i].name}`;
                    iID = `${icontent.incidents[i].id}`;
                    iShortLink = `${icontent.incidents[i].shortlink}`;
                    istatus = `${icontent.incidents[i].status}`;
                    icreated_at = `${icontent.incidents[i].created_at}`;
                    icontent.incidents[i].monitoring_at === null ? imonitoring_at = 'No Data' : (imonitoring_at = `${moment(icontent.incidents[i].monitoring_at).utc().format('llll')}`);
                    iimpact = `${icontent.incidents[i].impact}`;
                    icontent.incidents[i].resolved_at === null ? iresolved_at = 'No Data' : (iresolved_at = `${moment(icontent.incidents[i].resolved_at).utc().format('llll')}`);
                    incidents_status = `${icontent.incidents[i].incident_updates[0].status}`;
                    incident_updates = `${icontent.incidents[i].incident_updates[0].body}`;

                    incidents_info = `Name             :: ${iname}\nStatus           :: ${istatus}\nCreated At       :: ${moment(icreated_at)
                        .utc()
                        .format('llll')}\nMonitoring At    :: ${imonitoring_at}\nResolved At      :: ${iresolved_at}\nImpact           :: ${iimpact}\nIncident Status  :: ${incidents_status}\nIncident Update  :: ${incident_updates}`;
                    statusEmbed.addField(
                        `\u200b`,
                        `[<:ID:727871735097065632>: \`${iID}\`](${iShortLink})\n\`\`\`asciidoc\n${incidents_info}\`\`\``
                    )
                }
                statusEmbed.setFooter(`Last updated at ${update} (UTC)`, message.guild.iconURL({dynamic:true}))

                await msg2.delete().catch(e => {
                    if (e.code !== Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                        console.log(`Failed to delete the message due to`,e)
                    }
                })
                await msg.edit('',{embed: statusEmbed});
                await message.channel.send({embed: API_ImageEmbed});
                await message.channel.send({embed: Note_embed}).then(noteEmbed => noteEmbed.delete({ timeout: 15000})).catch(err =>{
                    if (err.code != Constants.APIErrors.UNKNOWN_MESSAGE) return console.log(`An Error occured while trying to delete the message.`,err)
                });
            })
        }).catch(err => {
            if(!msg.reactions) return;
            msg.reactions.removeAll();
	    console.log(err)
        })

    })
};

module.exports.help = {
	name: 'discord',
	description: 'Shows the current status of Discord and past 3 incidents.',
	usage: 'discord',
	category: 'information',
	aliases: ['discordstatus','discordapi']
};

module.exports.requirements = {
	owneronly: false,
	clientPerms: ['ADD_REACTIONS','EMBED_LINKS','MANAGE_MESSAGES'],
	userPerms: [],
};

module.exports.limits = {
	cooldown: 6e4,
};
