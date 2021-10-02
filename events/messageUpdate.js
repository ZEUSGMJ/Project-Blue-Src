const { messageEvent } = require('./message');
const servers = require('../models/Guild');
const humanize = require('humanize-duration');
const botconfig = require('../config');
const functions = require('../functions/Util');
const { MessageEmbed, Collection } = require('discord.js')

module.exports = async (client, oldMessage, Newmessage, message) => {

  if (!Newmessage.guild || !oldMessage.guild) return;
  if (oldMessage.content == Newmessage.content) return;
  if (Newmessage.author.bot || oldMessage.author.bot) return;
  if (Newmessage.type != 'DEFAULT' || Newmessage.system === true) return;
  if (oldMessage.type != 'DEFAULT'|| oldMessage.system === true || oldMessage.type === 'PINS_ADD') return;

    const cooldowns = messageEvent.cooldowns
    let prefix = messageEvent.prefix
  
    let prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    let botMention = new RegExp(`^<@!?${client.user.id}>$`)
    let embed = new MessageEmbed();
  
    servers.findOne(
      {
        GuildID: Newmessage.guild.id,
      },
      async (err, g) => {
        if (err) throw err;
        if (!g) {
          const newGuild = new servers({
            GuildID: Newmessage.guild.id,
            prefix: botconfig.defaultprefix,
          });
          await newGuild.save().catch((e) => console.log(e));
          Newmessage.content.match(prefixMention) ? prefix = Newmessage.content.match(prefixMention)[0] : prefix = botconfig.defaultprefix;
        } else {
            Newmessage.content.match(prefixMention) ? prefix = Newmessage.content.match(prefixMention)[0] : prefix = g.prefix;
        }
  
        let args;
        let command;
  
        /*if (prefix === botconfig.defaultprefix) {
          args = message.content.split(/ +/g);
          command = args.shift().slice(prefix.length).toLowerCase();
        } else if (prefix === g.prefix) {
          args = message.content.split(/ +/g);
          command = args.shift().slice(prefix.length).toLowerCase();
        } else if ( prefix = prefixMention) {
          args = message.content.split(/ +/g);
          console.log(args)
          console.log(args.shift().slice(prefix.length).toLowerCase())
          command = args.shift().slice(prefix.length).toLowerCase()
        }*/
  
        args = Newmessage.content.slice(prefix.length).trim().split(/ +/g);
        command = args.shift().toLowerCase();
        
        const cmd = client.commands.get(command) || client.aliases.get(command);
  
        if (!Newmessage.channel.permissionsFor(Newmessage.guild.me).toArray().includes('SEND_MESSAGES')) return;
  
        if(botMention.test(Newmessage.content.split(' ')[0]) && Newmessage.content.split(' ').length === 1) {
            Newmessage.delete();
              return Newmessage.channel.send(embed.setDescription(`My prefix for this guild is \`${prefix = prefixMention ? prefix = botconfig.defaultprefix || g.prefix : prefix}\`.\nYou can type \`${prefix = prefixMention ? prefix = botconfig.defaultprefix || g.prefix : prefix}help\` to view the list of commands.`).setFooter(`${Newmessage.guild.name}`,Newmessage.guild.iconURL({dynamic: true})).setColor(`#0099ff`).setTimestamp())
              .then((msg) => msg.delete({timeout: 1e4})).catch(err => {
                if (err.code === Constants.APIErrors.UNKNOWN_MESSAGE) return;
  
                console.log(`An Error occured while trying to delete a message`,err)
              })
        }
  
        if (!cmd || !Newmessage.content.startsWith(prefix)) return;
  
        if (cmd.requirements.ownerOnly && Newmessage.author.id != 438054607571386378) return;
        
        if (cmd.requirements.userPerms && cmd.requirements.userPerms.length != 0 && !Newmessage.channel.permissionsFor(Newmessage.member).has(cmd.requirements.userPerms) && Newmessage.author.id != 438054607571386378) {
          return Newmessage.channel.send(
            embed
              .setTitle('<:List:729711535248900097> Missing Permission(s)')
              .setDescription(`You don't have the following permssions to use this command:\n ${functions.TextChannelMissingPerms(Newmessage.member, cmd.requirements.userPerms, Newmessage.channel)}`)
              .setFooter(`${Newmessage.guild.name}`, Newmessage.guild.iconURL({dynamic: true}))
              .setColor('RED')
              .setTimestamp()
          )
        }
  
        if(cmd.requirements.clientPerms && !Newmessage.channel.permissionsFor(Newmessage.guild.me).has(cmd.requirements.clientPerms)) {
          return Newmessage.channel.send(
            embed 
            .setTitle(`<:List:729711535248900097> Missing Permission(s)`)
            .setDescription( `I need the following permissions to use this command:\n ${functions.TextChannelMissingPerms( Newmessage.guild.me, cmd.requirements.clientPerms, Newmessage.channel)}`)
            .setFooter(`${Newmessage.guild.name}`, Newmessage.guild.iconURL({dynamic: true}))
            .setColor('RED')
            .setTimestamp()
          )
        }
  
        if (cmd.limits) {
  
          if (!cooldowns.has(command)) {
            cooldowns.set(command, new Collection());
          }
          const now = Date.now();
          const timestamps = cooldowns.get(command);
          const cooldownAmt = cmd.limits.cooldown;
  
          if (timestamps.has(Newmessage.author.id)) {
            const expirationTime =
              timestamps.get(Newmessage.author.id) + cooldownAmt;
  
            if (now < expirationTime) {
              const timeLeft = humanize(expirationTime - now, {round: true});
              return await Newmessage.channel.send(
                  embed
                    .setDescription(`Calm down there! Wait for \`${timeLeft}\` before you can use this command!`)
                    .setColor('RED')
              )
              .then( async (msg) => await msg.delete({timeout: expirationTime - now})).catch( err => {
                if (err.code === Constants.APIErrors.UNKNOWN_MESSAGE) return
  
                console.log(`An Error occured while trying to delete my message.`,err)
              })
            }
          }
          timestamps.set(Newmessage.author.id, now);
          
          setTimeout(() => {
            timestamps.delete(Newmessage.author.id);
          }, cooldownAmt);
        }
  
        prefix = prefixMention ? prefix = g.prefix : prefix
        
        try {
          cmd.run(client, Newmessage, args, prefix);
        } catch (err) {
          console.log(`An Error occured while trying to run the ${cmd.help.name} command.`,err)
  
          return Newmessage.channel.send(new MessageEmbed().setDescription(`<:PB_error:772115933459120138> | An error occured while trying to run the ${cmd.help.name} command. if this issue still persists, You can join the support server and report it!\n**Support Server**:[\`click here\`](https://discord.gg/Yb3DjCmk99)`).setColor("RED"))
        }
      }
    );
  };