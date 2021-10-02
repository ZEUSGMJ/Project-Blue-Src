const Changelog = require('../../models/Changelog');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports.run = async (client, message, args) => {

    if (!args || args.length == 0) return message.channel.send(new MessageEmbed().setDescription('<:PB_crossCheckmark:771440385100742706> | Please provide a valid changes that you would like to add to the changelogs.').setColor("RED"));
    
    let date = moment().format('LL');

    Changelog.findOne({ Date: date }, async (err,data) => {

        if(err) console.log(err);

        let _changes = args.join(' ')

        if(!data) {
            let newChangelog = new Changelog({
                Date: date,
                Changes: _changes
            })
        newChangelog.save();

        return message.channel.send(new MessageEmbed().setTitle(`<:PB_checkmark:772889329205772298> | Successfully updated changelogs.`).addField(`${date}`,`${_changes}`).setColor("GREEN"));
        } else {
            data.Changes.unshift(
                _changes
            )
            data.save()
            return message.channel.send(new MessageEmbed().setTitle(`<:PB_checkmark:772889329205772298> | Successfully updated changelogs.`).addField(`${date}`,`${_changes}`).setColor("GREEN"))
        }
    })
}

module.exports.help = {
    name: 'add_change',
    description: 'post changelogs',
    usage: `<addChange> <Changes>`,
    aliases: ['post_cl']
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ['EMBED_LINKS'],
    ownerOnly: true
}

module.exports.limits = {
    cooldown: 0
}