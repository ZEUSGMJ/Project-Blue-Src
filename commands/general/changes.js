const Changelog = require('../../models/Changelog');
const { MessageEmbed, Constants } = require('discord.js');
const { separateFlags } = require('../../functions/Util')
const { helpfunc } = require('../general/help')

module.exports.run = async (client, message, args, prefix) => {

    if (args.length == 0 || !args || args[0] == 'help') {
        return helpfunc.getCMD(client, message, this.help.name, prefix);
    }

    let flags = ['edit','remove', 'view','recent']
    let flagSet = await separateFlags(message.content, {separator:'--',allowDuplicates: false}, flags)

    for (let flag of flagSet) {

        if (!flag.name) return console.log(`No Flags`)

        switch(flag.name) {
            case "edit":
                if (flag.validArgs != true && message.author.id != 438054607571386378) return;

                if (!flag.args || flag.args.length === 0) return message.channel.send(new MessageEmbed().setDescription(`<:PB_crossCheckmark:771440385100742706> | Invalid Usage.\n\nCorrect usage:\`${prefix}changes [edit] <changelog ID> <change #> <Edited change>\``).setColor("RED"))

                let args = flag.args.trim().split(' ');
                let change_id = args.shift();
                let change_Index = args.shift();
                let edited_changes = args.join(' ');
                
                //console.log(`${args.join(' ')} | ${change_id} | ${change_Index} | ${edited_changes}`)

                Changelog.findOne({ _id: change_id }, async (err, res) => {
                    if (err) console.log(err)

                    if(!res) {
                        return console.log(`No Data found for ${change_id}`)
                    }
                    else {
                    //console.log(res.Changes.length)

                    if(!change_Index) return message.channel.send(new MessageEmbed().setDescription(`<:PB_crossCheckmark:771440385100742706> | Please mention the index of the change that you want to remove.`).setColor("RED"))

                    if(!edited_changes) return message.channel.send(new MessageEmbed().setDescription(`<:PB_crossCheckmark:771440385100742706> | Please provide a text/change that you want to edit.`).setColor("RED"))

                    if (change_Index < res.Changes.length != true) {
                        return message.channel.send(new MessageEmbed().setDescription(`<:PB_crossCheckmark:771440385100742706> | Couldn't find any changes with that index`).setColor("RED"))
                    }

                    res.Changes.splice(change_Index, 1, `${edited_changes}`)

                    await res.save().catch((err) => {
                        console.log(err)
                    })
                    return message.channel.send(new MessageEmbed().setTitle(`<:PB_checkmark:772889329205772298> | Successfully edited the change`).addField(`Updated Change`,`${edited_changes}`).setColor("GREEN"))
                }
            })                
                break;           
            case "remove":
                if (flag.validArgs != true && message.author.id != 438054607571386378) return;

                if (!flag.args || flag.args.length === 0) return message.channel.send(new MessageEmbed().setDescription(`<:PB_crossCheckmark:771440385100742706> | Invalid Usage.\n\nCorrect usage:\`${prefix}changes [remove] <changelog ID> <change #>\``).setColor("RED"))

                let remove_args = flag.args.trim().split(' ');
                let changeLog_id = remove_args.shift();
                let remove_index = remove_args.shift();

                Changelog.findOne({ _id: changeLog_id }, async(err, res) => {
                    if (err) console.log(err)

                    if(!res) {
                        return console.log(`No data found for ${changeLog_id}`);
                    } else {
                        if (!remove_index) return message.channel.send(new MessageEmbed().setDescription(`<:PB_crossCheckmark:771440385100742706> | Please mention the index of the change that you want to remove.`).setColor("RED"))

                        res.Changes.splice(remove_index, 1)

                        await res.save().catch((err) => {
                            console.log(err)
                        })

                        return message.channel.send(new MessageEmbed().setTitle(`<:PB_checkmark:772889329205772298> | Successfully deleted t`))
                    }
                })

                break;
            case "view":
                let sorted_data = (await Changelog.find({}, async (err) => {
                    if(err) console.log(err)
                })).reverse()

                let i, j, temparray, chunk = 5, data_array_chunks = []

                for (i = 0, j = sorted_data.length; i < j; i += chunk) {
                    data_array_chunks.push(temparray = sorted_data.slice(i, i + chunk).map(cl => `${message.author.id != 438054607571386378 && message.guild.id != 762309429600583690 || message.guild.id != 575319896263491614 ? `**Date: ${cl.Date}**` : `**Date: ${cl.Date}** | \`${cl._id}\``}\n${cl.Changes.map(c => `<:arrowR:730414051213049897> ${c}`).join('\n')}`).join('\n\n'));
                  }
            
                let pages = data_array_chunks, page = 1;
            
                let changelog_embed = new MessageEmbed()
                  .setAuthor(`${client.user.username}'s Changelogs`, client.user.displayAvatarURL({ dynamic: true}))
                  .setDescription(pages[page - 1])
                  .setColor('#0099ff')
                  .setTimestamp()
                  .setFooter(`${message.guild.name} | Page ${page}/${pages.length}`, message.guild.iconURL() ? `${message.guild.iconURL({ dynamic: true})}` : message.member.user.displayAvatarURL({ dynamic: true}))
            
                let msg = await message.channel.send(changelog_embed);
            
                //console.log(pages.length)
            
                if(pages.length <= 1) return;
                
                const reactions = ['⏪','◀️','▶️','⏩','🗑️'];
            
                for(let emote of reactions) await msg.react(emote);
            
                const filter = (reaction, user) => {
                    return reactions.includes(reaction.emoji.name) && user.id === message.author.id
                };
            
                const reactionCollector = msg.createReactionCollector(
                    filter, { time: 120000 },
                );
            
                reactionCollector.on('collect', async (reaction, user) => {
                    if (reaction.emoji.name === '⏪') {
                        if (page === 1) return reaction.users.remove(user.id)
                        page = 1;
                        changelog_embed.setDescription(pages[page - 1])
                        changelog_embed.setFooter(`${message.guild.name} | Page ${page}/${pages.length}`, message.guild.iconURL() ? `${message.guild.iconURL({ dynamic: true})}` : message.member.user.displayAvatarURL({ dynamic: true}))
                        msg.edit(changelog_embed)
                        reaction.users.remove(user.id)
                    } else if (reaction.emoji.name === '◀️') {
                        if (page === 1) return reaction.users.remove(user.id)
                        page --
                        changelog_embed.setDescription(pages[page - 1])
                        changelog_embed.setFooter(`${message.guild.name} | Page ${page}/${pages.length}`, message.guild.iconURL() ? `${message.guild.iconURL({ dynamic: true})}` : message.member.user.displayAvatarURL({ dynamic: true}))
                        msg.edit(changelog_embed)
                        reaction.users.remove(user.id)
                    } else if (reaction.emoji.name === '▶️') {
                        if ( page === pages.length) return reaction.users.remove(user.id)
                        page++
                        changelog_embed.setDescription(pages[page - 1])
                        changelog_embed.setFooter(`${message.guild.name} | Page ${page}/${pages.length}`, message.guild.iconURL() ? `${message.guild.iconURL({ dynamic: true})}` : message.member.user.displayAvatarURL({ dynamic: true}))
                        msg.edit(changelog_embed)
                        reaction.users.remove(user.id)
                    } else if (reaction.emoji.name === '⏩') {
                        if ( page === pages.length ) return reaction.users.remove(user.id)
                        page = pages.length;
                        changelog_embed.setDescription(pages[page - 1])
                        changelog_embed.setFooter(`${message.guild.name} | Page ${page}/${pages.length}`, message.guild.iconURL() ? `${message.guild.iconURL({ dynamic: true})}` : message.member.user.displayAvatarURL({ dynamic: true}))
                        msg.edit(changelog_embed)
                        reaction.users.remove(user.id)
                    } else if ( reaction.emoji.name === '🗑️') {
                        reactionCollector.stop()
                        msg.delete().catch(err => {
                            if (err.code !== Constants.APIErrors.UNKNOWN_MESSAGE) {
                                console.log(`Failed to delete the message due to`,err)
                            }
                        })
                        
                    }
                })
                /*reactionCollector.on('end', () => {
                    if(!msg) return;
                    msg.reactions.removeAll()
                    msg.edit(new MessageEmbed().setTitle(`⏲️ | Time out. You can do \`${prefix}changes\` to view it again`).setColor("RED")).then(m => {
                        m.delete({timeout: 3e3}).catch(err => {
                            if (err.code !== Constants.APIErrors.UNKNOWN_MESSAGE) {
                                console.log(`Failed to delete the message due to`,err)
                            }
                        })
                    })
                })*/
                break;
            case "recent":
                let recent_changes = (await Changelog.find({}, async (err) => {
                    if(err) console.log(err)
                })).reverse().slice(0, 3);

                recent_changes = recent_changes.map(cl => `${message.author.id != 438054607571386378 && message.guild.id != 762309429600583690 || message.guild.id != 575319896263491614 ? `**Date: ${cl.Date}**` : `**Date: ${cl.Date}** | \`${cl._id}\``}\n${cl.Changes.map(c => `<:arrowR:730414051213049897> ${c}`).join('\n')}`).join('\n\n')

                let recentChangesEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setDescription(`${recent_changes}`)
                    .setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true}) || message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()

                message.channel.send(recentChangesEmbed)
                break;
            default:
                break;
        }
    }
}

module.exports.help = {
    name: 'changes',
    description: `View changelogs of {client.username}`,
    aliases: ['cl','changelogs'],
    category: 'general',
    usage: `changes [ --view | --recent ]`
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ['EMBED_LINKS','ADD_REACTIONS'],
    ownerOnly: false
}

module.exports.limits = {
    cooldown: 3e3
}
