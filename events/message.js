const botconfig = require('../config');
const {MessageEmbed, Collection} = require('discord.js');
const servers = require('../models/Guild');
const humanize = require('humanize-duration');
const cooldowns = new Collection();
const functions = require('../functions/Util');
let prefix;

module.exports = (client, message) => {

  if (!message.guild) return;
  if (message.author.bot) return;

  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  const botMention = new RegExp(`^<@!?${client.user.id}>$`);
  let embed = new MessageEmbed();

  servers.findOne(
    {
      GuildID: message.guild.id,
    },
    async (err, g) => {
      if (err) throw err;
      if (!g) {
        const newGuild = new servers({
          GuildID: message.guild.id,
          prefix: botconfig.defaultprefix,
        });
        await newGuild.save().catch((e) => console.log(e));
        message.content.match(prefixMention) ? prefix = message.content.match(prefixMention)[0] : prefix = botconfig.defaultprefix;
      } else {
        message.content.match(prefixMention) ? prefix = message.content.match(prefixMention)[0] : prefix = g.prefix;
      }

      let args;
      let command;

      args = message.content.slice(prefix.length).trim().split(/ +/g);
      command = args.shift().toLowerCase();

      if (message.guild.memberCount > message.guild.members.cache.size) message.guild.members.fetch({
        withPresence: true
      })

      const cmd = client.commands.get(command) || client.aliases.get(command);
      let embed = new MessageEmbed();

      if(botMention.test(message.content.split(' ')[0]) && message.content.split(' ').length === 1) {
        message.delete();
            return message.channel.send(embed.setDescription(`My prefix for this guild is \`${prefix = prefixMention ? prefix = prefix : prefix}\`.\nYou can type \`${prefix = prefixMention ? prefix = botconfig.defaultprefix || g.prefix : prefix}help\` to view the list of commands.`).setFooter(`${message.guild.name}`,message.guild.iconURL({dynamic: true})).setColor(`#0099ff`).setTimestamp())
            .then((msg) => msg.delete({timeout: 1e4}));
      }

      if (!cmd || !message.content.startsWith(prefix)) return;

      if (!message.channel.permissionsFor(message.guild.me).toArray().includes('SEND_MESSAGES')) return;

      if (cmd.requirements.ownerOnly && message.author.id != 438054607571386378) return;
      
      if (cmd.requirements.userPerms && cmd.requirements.userPerms.length != 0 && !message.channel.permissionsFor(message.member).has(cmd.requirements.userPerms) && message.author.id != 438054607571386378) {
        return message.channel.send(
          embed
            .setTitle('📝 Missing Permission(s)')
            .setDescription(`You don't have the following permssions to use this command:\n ${functions.TextChannelMissingPerms(message.member, cmd.requirements.userPerms, message.channel)}`)
            .setFooter(`${message.guild.name}`, message.guild.iconURL({dynamic: true}))
            .setColor('RED')
            .setTimestamp()
        )
      }

      if(cmd.requirements.clientPerms && !message.channel.permissionsFor(message.guild.me).has(cmd.requirements.clientPerms)) {
        return message.channel.send(
          embed 
          .setTitle(`📝 Missing Permission(s)`)
          .setDescription( `I need the following permissions to use this command:\n ${functions.TextChannelMissingPerms( message.guild.me, cmd.requirements.clientPerms, message.channel)}`)
          .setFooter(`${message.guild.name}`, message.guild.iconURL({dynamic: true}))
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

        if (timestamps.has(message.author.id)) {
          const expirationTime =
            timestamps.get(message.author.id) + cooldownAmt;

          if (now < expirationTime) {
            const timeLeft = humanize(expirationTime - now, {round: true});
            return await message.channel.send(
                embed
                  .setDescription(`Calm down there! Wait for \`${timeLeft}\` before you can use this command!`)
                  .setColor('RED')
            )
            .then( async (msg) => await msg.delete({timeout: expirationTime - now}));
          }
        }
	    timestamps.set(message.author.id, now);
		
        setTimeout(() => {
          timestamps.delete(message.author.id);
        }, cooldownAmt);
      }
      prefix = prefixMention ? prefix = g.prefix : prefix

      try {
        cmd.run(client, message, args, prefix);
        if (message.author.id != 438054607571386378) console.log(`${message.author.id} | ${message.author.username} ran ${cmd.help.name} in ${message.guild.name} (${message.guild.id}) in channel ${message.channel.name} (${message.channel.id}) `)
      } catch (err) {
        console.log(`An Error occured while trying to run the ${cmd.help.name} command.`,err)

        return message.channel.send(new MessageEmbed().setDescription(`<:PB_error:772115933459120138> | An error occured while trying to run the ${cmd.help.name} command. if this issue still persists, You can join the support server and report it!\N**Support Server**:[\`click here\`](https://discord.gg/Yb3DjCmk99)`).setColor("RED"))
      }
    }
  );
};

module.exports.messageEvent = {
  cooldowns,
  prefix
}