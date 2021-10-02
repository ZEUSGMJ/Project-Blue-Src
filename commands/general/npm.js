const { helpfunc } = require('./help')
const { invalidCMDUsage } = require('../../functions/Util');
const { MessageEmbed, Constants} = require('discord.js');
const moment = require('moment')
const cheerio = require('cheerio')
const axios = require('axios').default

module.exports.run = async(client, message, args, prefix) => {

    let { channel, member, guild } = message;

    if (!args || args.length === 0) return invalidCMDUsage(this.help.name, channel, client);

    if (args[0].toLowerCase() === 'help') return helpfunc.getCMD(client, message, this.help.name, prefix);

    let query = args.join(' ').replace(' ', '-');
    
    let m = await channel.send(new MessageEmbed().setTitle('<a:PB_loading:778658036688355349> | Please wait while i fetch info about the package...').setColor('#0099ff'))
    
    try {
    let res = await axios.get(`https://registry.npmjs.com/${query}`)

    let result = res.data

    if (res.error === 'not_found' ) return m.edit(new MessageEmbed().setTitle(`<:PB_crossCheckmark:771440385100742706> | Couldn't find any package with that name. Please try again.`).setColor('RED')).then(msg => {
        msg.delete({ timeout: 4e3}).catch(err => {
            if (err.code != Constants.APIErrors.UNKNOWN_MESSAGE) return console.log(`An Error occured while trying to delete the message`.err)
        })
    })

    let packgeImg = `https://nodei.co/npm/${result.name}.png?downloads=true&downloadRank=true&stars=true`;
    let pkgVersion = Object.keys(result.versions)[Object.keys(result.versions).length - 1]
    let package = result.versions[`${pkgVersion}`]
    let keywords;

    let pkgAuthor = result.author != null ? package.author.name : `\u200b`
    let pkgAuthorMail = result.author != undefined ? `(${result.author.email})` : '\u200b'
    let homepage = result.homepage != undefined ? `[\`Homepage\`](${result.homepage})` : '';
    let bugURL = result.bugs != null ? `[\`Bugs\`](${result.bugs.url})` : '';

    let linksArr = [`${homepage}`, `${bugURL}`].filter(l => l != '').join(' | ')
    
    if (!package.keywords) {
        keywords = "None"
    } else {
        keywords = package.keywords.join(', ')
    }

    let maintainersArr = [], isValidsize;
    package.maintainers.forEach(m => maintainersArr.push(`${m.name}`));

    console.log(maintainersArr.length)

    //maintainersArr.length > 10 ? maintainersArr = `${maintainersArr.slice(0, 10)}` : maintainArr = `${maintainersArr}`

    let maintainers = maintainersArr.length > 20 ?`${maintainersArr.slice(0, 20).join(' | ')}${maintainersArr.length > 20 ? ` and **${maintainersArr.length - 20}** more` : ``}` : `${maintainersArr.join(' | ')}`

        let response = await axios.get(`https://www.npmjs.com/package/${result.name}`)

        let cheerioData = response.data
        
        let sizeRegex = new RegExp(/[. 0-9]+(kB|MB|GB)/g)
        
     	let $ = cheerio.load(cheerioData)

    	let weeklyDownloads = $('#top > div.fdbf4038.w-third-l.mt3.w-100.ph3.ph4-m.pv3.pv0-l.order-1-ns.order-0 > div:nth-child(4) > div > div > p').text()

        if(weeklyDownloads === "") weeklyDownloads = $('#top > div.fdbf4038.w-third-l.mt3.w-100.ph3.ph4-m.pv3.pv0-l.order-1-ns.order-0 > div:nth-child(3) > div > div > p').text()
        let size = $('#top > div.fdbf4038.w-third-l.mt3.w-100.ph3.ph4-m.pv3.pv0-l.order-1-ns.order-0 > div:nth-child(7) > p').text()
        isValidsize = sizeRegex.test(size)
                
        if (isValidsize === false) size = $('#top > div.fdbf4038.w-third-l.mt3.w-100.ph3.ph4-m.pv3.pv0-l.order-1-ns.order-0 > div:nth-child(6) > p').text()
        isValidsize = sizeRegex.test(size)
        if (isValidsize === false) size = `\`No Data\``
    
        let files = $('#top > div.fdbf4038.w-third-l.mt3.w-100.ph3.ph4-m.pv3.pv0-l.order-1-ns.order-0 > div:nth-child(8) > p').text()
        let isnum = /^\d+$/.test(files);
        if (isnum === false) files = $('#top > div.fdbf4038.w-third-l.mt3.w-100.ph3.ph4-m.pv3.pv0-l.order-1-ns.order-0 > div:nth-child(7) > p').text()

        if (/^\d+$/.test(files) === false) files = `\`No Data\``

        //console.log(`weekly Downloads = ${weeklyDownloads}`)
        //console.log(`Size = ${size}`)
        //console.log(`Files = ${files}`)

    let npmEmbed = new MessageEmbed()
        .setAuthor(`Package info for ${result.name}`,`https://logodix.com/logo/1974429.png`)
        .setColor('#CC3C34')
        .addField('Name', `[\`${result.name}\`](https://npmjs.com/package/${result.name})`,true)
        .addField('Version',`${pkgVersion}`,true)
        .addField('License',`${!package.license ? `\`None\`` : `${package.license}`}`,true)
        .addField(`Description`, `>>> ${result.description}`)
        .addField('Author', `> ${pkgAuthor} ${pkgAuthorMail}`)
        .addField('Main file',`\`${package.main}\``, true)
        
        if(linksArr) npmEmbed.addField('Links', `${linksArr}`, true)
        if(package._nodeVersion != null || package._npmVersion != null) npmEmbed.addField(`Versions`, `${package._nodeVersion != null ? "**Node Version:**" + ` \`${package._nodeVersion}\`` : '\u200b'}\n${package._npmVersion != null ? "**npm Version:**" + ` \`${package._npmVersion}\`` : '\u200b'}`)
        
        npmEmbed.addField(`Keywords [${!package.keywords ? "0" : `${package.keywords.length}`}]`, `>>> ${keywords}`)
        npmEmbed.addField(`Maintainers [${maintainersArr.length}]`, `> ${maintainers}`)
        npmEmbed.addField('Weekly Downloads', `${weeklyDownloads}`, true)
        npmEmbed.addField('Unpacked Size', `${size}`, true)
        npmEmbed.addField('Files', `${files}`, true)
        npmEmbed.addField('Created On',`${moment(result.time.created).format('LL, LT')}`,true)
        npmEmbed.addField('Modified On',`${moment(result.time.modified).format('LL, LT')}`, true)
        npmEmbed.addField('Install', `\`\`\`md\n> npm i ${result.name}\`\`\``)
        npmEmbed.setImage(packgeImg)
        npmEmbed.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/500px-Npm-logo.svg.png')
        npmEmbed.setFooter(`npm package info requested by ${member.user.username}`, `${guild.iconURL() != null ? guild.iconURL({ dynamic: true}) : member.user.displayAvatarURL({ dynamic: true})}`)
        npmEmbed.setTimestamp()
    m.edit(npmEmbed)
    
    }catch(err) {
        console.log(err)
        console.log(err.response)

        if (err.response) {
        if (err.response.status === 404) return m.edit(new MessageEmbed().setTitle(`<:PB_error:772115933459120138> | Error`).setDescription(`**Couldn't find package with the name ${query.slice(0, 50)}.**`).setColor("RED"))

        if (err.response.status != 404) return m.edit(new MessageEmbed().setTitle(`<:PB_error:772115933459120138> | Error`).setDescription(`**Couldn't find package with the name ${query.slice(0, 50)}.**`).setColor("RED"))
        }
    }
}

module.exports.help = {
    name: 'npm',
    description: 'Gets information about an npm package.',
    usage: 'npm < package-name >',
    category:'general'
}

module.exports.requirements = {
    ownerOnly: false,
    clientPerms: ['EMBED_LINKS'],
    userPerms: []
}

module.exports.limits = {
    cooldown: 12e3
}
