const got = require('got');
const { MessageEmbed } = require('discord.js');
let embed = new MessageEmbed();
const { helpfunc } = require('../general/help')
const { separateFlags, invalidCMDUsage } = require('../../functions/Util')

let meme = ['dankmemes', 'memes', 'ihadastroke','2meirl4meirl','me_irl', 'woooosh']
let programming = ['badcode','softwaregore', 'programmerHumour','programminghorror']

let top_type = ['&t=month','&t=week','&t=day','&t=hour']
let sort_type = ['hot','top']

module.exports.run = async (client, message, args, prefix) => {

  let { content, channel, member, guild } = message;

  if (args.length != 0 && args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);

  if (!args || args.length === 0 ) return invalidCMDUsage(this.help.name, channel, client)
  
  let flags = ['random', 'programming']
  let flagSet = await separateFlags(content, {separator: '--', allowDuplicates: false}, flags)
  let permalink, memeurl, memeImage, memeTitle, memeUpvotes, memeDownvotes, memeNumComments, top, subreddit;
  
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  for (let flag of flagSet) {
    switch(flag.name) {
      case "random":

        let random = meme[Math.floor(Math.random() * meme.length)]
        let random_sort = sort_type[Math.floor(Math.random() * sort_type.length)]
  
        random_sort === 'top' ? top = top_type[Math.floor(Math.random() * top_type.length)] : top = ""
      
        //Get subbreddit
        let res = await got(`https://reddit.com/r/${random}/random/.json?sort=${random_sort}${top}`);
      
        let randomContent = JSON.parse(res.body)
        //console.log(randomContent[0].media.reddit_video ? `${randomContent[0].media.reddit_video.fallback_url}` : `None`)

        if (randomContent[0].data.media) {
  
          console.log(randomContent[0].data.media.reddit_video ? `${randomContent[0].data.media.reddit_video.fallback_url}` : `None`)
        }
        permalink = randomContent[0].data.children[0].data.permalink;
        memeurl = `https://reddit.com${permalink}`;
        memeImage = randomContent[0].data.children[0].data.url;
        memeTitle = randomContent[0].data.children[0].data.title;
        memeUpvotes = randomContent[0].data.children[0].data.ups;
        memeDownvotes = randomContent[0].data.children[0].data.downs;
        memeNumComments = randomContent[0].data.children[0].data.num_comments;
        subreddit = randomContent[0].data.children[0].data.subreddit_name_prefixed
  
        embed.setAuthor(`${memeTitle}`, member.user.displayAvatarURL({ dynamic: true}), memeurl)
        embed.setColor(randomColor)
        embed.setImage(memeImage)
        embed.setTimestamp()
        embed.setFooter(`👍 ${memeUpvotes} | 👎 ${memeDownvotes} | 💬 ${memeNumComments} | Posted at ${subreddit}`, guild.iconURL() != null ? `${guild.iconURL({ dynamic: true})}` : null )
  
        channel.send(embed)
        break;

      case "programming":

        let random_programming = programming[Math.floor(Math.random() * programming.length)]
        let programming_sort = sort_type[Math.floor(Math.random() * sort_type.length)]
  
        programming_sort === 'top' ? top = top_type[Math.floor(Math.random() * top_type.length)] : top = ""
      
      //Get subbreddit
        let result = await got(`https://reddit.com/r/${random_programming}/random/.json?sort=${programming_sort}${top}`);
      
        let programmingMeme_conent = JSON.parse(result.body)
        permalink = programmingMeme_conent[0].data.children[0].data.permalink;
        memeurl = `https://reddit.com${permalink}`;
        memeImage = programmingMeme_conent[0].data.children[0].data.url;
        memeTitle = programmingMeme_conent[0].data.children[0].data.title;
        memeUpvotes = programmingMeme_conent[0].data.children[0].data.ups;
        memeDownvotes = programmingMeme_conent[0].data.children[0].data.downs;
        memeNumComments = programmingMeme_conent[0].data.children[0].data.num_comments;
        subreddit = programmingMeme_conent[0].data.children[0].data.subreddit_name_prefixed
  
        embed.setAuthor(`${memeTitle}`, member.user.displayAvatarURL({ dynamic: true}), memeurl)
        embed.setColor(randomColor)
        embed.setImage(memeImage)
        embed.setTimestamp()
        embed.setFooter(`👍 ${memeUpvotes} | 👎 ${memeDownvotes} | 💬 ${memeNumComments} | Posted at ${subreddit}`, guild.iconURL() != null ? `${guild.iconURL({ dynamic: true})}` : null )
  
        channel.send(embed)
        break;
      default:
        break;
    }
  }
};

module.exports.help = {
  name: 'meme',
  description: `get's a random meme from sub-reddits.`,
  aliases: [],
  usage: `meme < --random | --programming >`,
  category: 'fun',
	disabled: false
};

module.exports.requirements = {
  ownerOnly: false,
  userPerms: [],
  clientPerms: ['EMBED_LINKS'],
};

module.exports.limits = {
  cooldown: 2e3,
};
