const client = require("../index");
const { MessageEmbed, APIMessage, Message, Guild, WebhookClient } = require('discord.js')
const { getPaletteFromURL } = require('color-thief-node')
const getColors = require('get-image-colors');
const Jimp = require('jimp')
const { Image } = require('image-js')

/**
 * CustomFlags class
 * @class customFlag
 */
class customflag {
	constructor(flagName, flagArgs, validArgs) {
		this.name = flagName // Flag name
		this.args = flagArgs // Flag arguments
		this.validArgs = validArgs // Whether arguments are valid aka not undefined and have a length greater than 0
}}

Message.prototype.quote = async function (content, options) {
    const reference = {
        message_id: (
            !!content && !options ?
                typeof content === 'object' && content.messageID :
                options && options.messageID
        ) || this.id,
        message_channel: this.channel.id
    };

    const { data: parsed, files } = await APIMessage
        .create(this, content, options)
        .resolveData()
        .resolveFiles();

    this.client.api.channels[this.channel.id].messages.post({
        data: { ...parsed, message_reference: reference },
        files
    });
}

module.exports = {

	/**
	 * Send a invalid member embed.
	 * @param {String} channel The Guild channel to send the invalid member embed in.
	 */
	invalidMember: (invalidMember = (channel) => {
		return channel.send(new MessageEmbed().setTitle('<:PB_crossCheckmark:771440385100742706> | Please mention a valid member.').setColor("RED"))
	}),

	/**
	 * Send a invalid channel embed.
	 * @param {String} channel The Guild channel to send the invalid channel embed in.
	 */

	invalidChannel: (invalidChannel = (channel) => {
		return channel.send(new MessageEmbed().setTitle('<:PB_crossCheckmark:771440385100742706> | Please mention a valid channel.').setColor("RED"))
	}),
	
	/**
	 * @param {Object} channel- The guild channel Object.
	 * @param {Object} client - The client object
	 * @param {String} command - The command name
	 * @param {Object} err - The error object.
	 */
	error(message, client, command, err) {

		let { guild, channel, member} = message;
		const err_hook = new WebhookClient("743872376634212402","0TQeiwDa0m-b_NA9SHnsHGV0qOoKDsYBc3Q3M-jjM-OJXRZXHktqpQw5uow6HG5h6nkD");

		console.log(err)

		let Err_Embed = new MessageEmbed()
			.setDescription(`**${member.user.tag}** ran \`${command}\` in **${guild.name}** and an error occured\n\n>>> \`\`\`js\n${err.code}\n${err.message}\n${err.stack}\`\`\``)
			.setColor("RED")
			.setFooter(`Error ID:`, !guild.iconURL() ? null : guild.iconURL({ dynamic: true }))
			.setTimestamp()
		err_hook.send(Err_Embed)

		let embed = new MessageEmbed()
			.setDescription(`<:PB_error:772115933459120138> | **Uh oh**\nLooks like an error occured while trying to run the \`${command}\` command. Do not worry! I have notified the Dev regarding this issue.\n\n>>> If this keeps happening, Report it by joining the [Support server](https://discord.gg/Yb3DjCmk99)`)
			.setColor("RED")
			.setTimestamp()
			.setFooter(`${channel.guild.name}`, !channel.guild.iconURL() ? null : channel.guild.iconURL({ dynamic: true}) )
		return channel.send(embed)
	},

	/**
	 * Send a invalid role embed.
	 * @param {String} channel The Guild channel to send the invalid role embed in.
	 */

	invalidRole: (invalidRole = (channel) => {
		return channel.send(new MessageEmbed().setTitle('<:PB_crossCheckmark:771440385100742706> | Please mention a valid role.').setColor("RED"))
	}),
	
	/**
	 * Send a Invalid Command usage embed.
	 * @param {String} cmd the command to send it's correct usage.
	 * @param {String} channel The Guild channel to send the message in.
	 * @param {String} client The bot Object.
	 */

	invalidCMDUsage: (invalidCMDUsage = (cmd, channel, client) => {
		let command = client.commands.get(cmd)
		
		if (!command) return
		
		let cmdUsage = command.help.usage;

		if (!cmdUsage) return;

		let invalid_usage_embed = new MessageEmbed()
			.setTitle('Invalid Usage')
			.addField(`📝 Correct usage for ${command.help.name} is:`,`\`\`\`md\n${cmdUsage}\`\`\``)
			.setColor('RED')
			.setThumbnail('https://cdn.discordapp.com/emojis/784165498169458778.png?v=1')
		return channel.send(invalid_usage_embed);
	}),
	
	/**
	 * Get missing Permissions of a member.
	 * @param {String} member The Guild member object.
	 * @param {String} perms The required perms to check which perms are missing.
	 */
	missingPerms: (missingPerms = (member, perms) => {
		const missingPerms = member.permissions.missing(perms).map(
			(str) =>
				`\`${str
					.replace(/_/g, ' ')
					.toLowerCase()
					.replace(/\b(\w)/g, (char) => char.toUpperCase())}\``
		);

		return missingPerms.length > 1
			? `${missingPerms.slice(0, -1).join(', ')} ${missingPerms.slice(-1)[0]}`
			: missingPerms[0];
	}),

	/**
	 * Get missing permissions of a channel
	 * @param {String} member The Guild member object.
	 * @param {String} perms The required perms to check which perms are missing.
	 * @param {String} channel The Guild channel Object.
	 */
	TextChannelMissingPerms: (TextChannelMissingPerms = (member, perms, channel) => {
		const ChannelMissingPerms = channel.permissionsFor(member).missing(perms).map(
			(str) => 
				`\`${str
					.replace(/_/g, ' ')
					.toLowerCase()
					.replace(/\b(\w)/g, (char) => char.toUpperCase())}\``
		);

		return ChannelMissingPerms.length > 1 
			? `${ChannelMissingPerms.slice(0, -1).join(', ')} ${ChannelMissingPerms.slice(-1)[0]}`
			: ChannelMissingPerms[0];
	}),

	/**
	 * To show valid flags that can be used for the command.
	 * @param {Array} flag An array of flags.
	 * @param {String} channel The Guild channel Object.
	 */
	invalidFlags: (invalidFlags = (flags, channel) => {
		return channel.send(new MessageEmbed().setTitle('<:PB_crossCheckmark:771440385100742706> | Invalid flags').setDescription(`List of available flags.\n\`\`\`md\n${flags.join(', ')}\`\`\``).setColor('RED'))
	}),

	/**
	 * Format Bytes in bytes, KB, MB, GB, TB, PB, EB, ZB, YB.
	 * @param {Number} bytes The bytes to be formatted.
	 * @param {Number} decimal The no of decimal to rounded of, Defaults to 0 if no parameter is passed.
	 */
	formatBytes: (formatBytes = (bytes, decimal) => {
	
		const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const k = 1024;
		!decimal ? decimal = 0 : decimal;
		const dm = decimal < 0 ? 0 : decimal;
	
		const i = Math.floor(Math.log(bytes) / Math.log(k));
	
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + units[i];
	}),

	/**
	 * Removed "_" and converts to lower case except for the first letter of every word.
	 * @param {String} str The string to be converted.
	 */

	StringReplacer: (StringReplacer = (str) => {
		const ReplacedString = str
			.replace(/_/g, ' ')
			.toLowerCase()
			.replace(/\b(\w)/g, (char) => char.toUpperCase());

		return ReplacedString;
	}),

	/**
	 * Returns a signal strength emote based on the provided number.
	 * @param {Number} num The number to be bassed to get the signal strength emote.
	 */

	SignalStrength: (SignalStrength = (num) => {
		
		let signalpower;
		if (num <= 80) return signalpower = '<:signal1:725747569040425030>';
		if (num > 81 && num <= 150) return signalpower = '<:signal2:725747428799545374>';
		if (num > 150 && num <= 250) return signalpower = '<:signal3:725747428338303018>';
		if (num > 250 && num <= 500) return signalpower = '<:signal4:725747427335733260>';
		if (num > 500) return signalpower = '<:signal5:725747427394715680>';

	}),

	/**
	 * Converts seconds to human readable form.
	 * @param {Number} s The seconds to be passed to convert.
	 * @param {Object} [options] Options to pass whether the retuned format should be short of long.
	 */

	SecondsToString: (SecondsToString = (s, options = {})=>{

		if (!options.hasOwnProperty("short")) Object.assign(options, { short: false })

		s = Math.floor(Number(s));
		days = Math.floor(s / (24*60*60));
		s -= Math.floor(days * (24*60*60));
		hours = Math.floor(s / (60*60));
		s -= Math.floor(hours * (60*60));
		minutes = Math.floor(s / (60));
		s -= Math.floor(minutes * (60));

		if (options.short != true) {
			dDisplay = days > 0 ? days + (days == 1 ? ' day, ' : ' days, ') : '';
			hDisplay = hours > 0 ? hours + (hours == 1 ? ' hour, ' : ' hours, ') : '';
			mDisplay = minutes > 0 ? minutes + (minutes == 1 ? ' minute, ' : ' minutes, ') : '';
			sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
		} else {
			dDisplay = days > 0 ? days + (days == 1 ? ' day, ' : ' days, ') : '';
			hDisplay = hours > 0 ? hours + (hours == 1 ? ' hr, ' : ' hrs, ') : '';
			mDisplay = minutes > 0 ? minutes + (minutes == 1 ? ' min, ' : ' mins, ') : '';
			sDisplay = s > 0 ? s + (s == 1 ? ' second' : 's') : '';
		}

		return dDisplay + hDisplay + mDisplay + sDisplay;
	}),

	/**
	 * Converts milli-seconds to human readable form.
	 * @param {Number} ms The milli-seconds to be passed to convert.
	 * @param {Object} [options] Options to pass whether the retuned format should be short of long.
	 */

	msToString: (msToString = (ms, options = {}) => {

		if (!options.hasOwnProperty("short")) Object.assign(options, { short: false })

		days = Math.floor(ms / 86400000);
		hours = Math.floor(ms / 3600000) % 24;
		minutes = Math.floor(ms / 60000) % 60;
		seconds = Math.floor(ms / 1000) % 60;

		if (options.short != true) {
			dayDisp = days > 0 ? days + (days == 1 ? ' day, ' : ' days, ') : '';
			hrDisp = hours > 0 ? hours + (hours == 1 ? ' hour, ' : ' hours, ') : '';
			minDisp = minutes > 0 ? minutes + (minutes == 1 ? ' minute, ' : ' minutes, ') : '';
			secDisp = seconds > 0 ? seconds + (seconds == 1 ? ' second' : ' seconds') : '';
		} else {
			dayDisp = days > 0 ? days + (days == 1 ? ' day, ' : ' days, ') : '';
			hrDisp = hours > 0 ? hours + (hours == 1 ? ' hr, ' : ' hrs, ') : '';
			minDisp = minutes > 0 ? minutes + (minutes == 1 ? ' min, ' : ' mins, ') : '';
			secDisp = seconds > 0 ? seconds + (seconds == 1 ? ' second' : 's') : '';
		}
		return dayDisp + hrDisp + minDisp + secDisp;
	}),

	/**
	 * Get's join order of the member.
	 * @param {Guild} guild Guild Object.
	 * @param {String} ID Guild member ID
	 * @param {Number} iterationCount The no of members to return.
	 */
	joinPosition: (joinPosition = (guild, ID, iterationCount) => {
	
		if (!guild.members.cache.get(ID)) return null;
	
		let sortArr = guild.members.cache.array().sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
	
		let memberIndex = sortArr.findIndex(m => m.user.id === ID);
		let JPArr = [{
			member: sortArr[memberIndex],
			index: memberIndex
		}];

		for (let i = 1; i < (typeof iterationCount === "number" ? iterationCount + 1 : 6); i++) {
			if (sortArr[memberIndex - i]) JPArr.unshift({
				member: sortArr[memberIndex - i],
				index: memberIndex - i
			});
		}
		for (let j = 1; j < (typeof iterationCount === "number" ? iterationCount + 1 : 6); j++) {
			if (sortArr[memberIndex + j]) JPArr.push({
				member: sortArr[memberIndex + j],
				index: memberIndex + j
			});
		}
	
		return JPArr.map(obj => obj.member.user.tag === guild.members.cache.get(ID).user.tag ? `**${obj.member.user.tag}**` : `\`${obj.member.user.tag}\``).join(' ➜ ')
	}),

	/**
	 * Get's progrees bar.
	 * @param {Number} amount The amount to be passed.
	 * @param {Number} total The total amount.
	 * @param {String} character The character to be used to fill the progres bar.
	 */
	progress: (progress = (amount, total, character) => {
		
		if (typeof character !== 'string') throw new TypeError(`Character must be a typeof String!`)

		if (typeof amount !== 'number' || typeof total !== 'number') throw new TypeError(`Amount/total must be a typeof Number!`)
		
		return (
			`${character}`.repeat(Math.floor((amount / Number(total)) * 20)) +
			"" +
			" ".repeat(20 - Math.floor((amount / Number(total)) * 20))
		  );
	}),

	getMessages: (client.getMessages = async ( numOfMessages, timeToWait, message, customFilter = 0 ) => {
		// Set up the custom filter - if nothing was passed we filter by the message author
		let filter = customFilter != 0 ? customFilter : (m) => m.author.id == message.author.id; // Improved filtering.

		let retValue = 0; // Make a return value object.
		// Collect messages
		await message.channel
			.awaitMessages(filter, {
				max: numOfMessages,
				time: timeToWait,
				errors: ['time'],
			})
			.then((collectedMessages) => {
				//Create an array from the message objects
				retValue = Array.from(collectedMessages.values());
			})
			.catch((e) => {
				throw e;
			}); // Throw the error if any.
		return retValue; // Return the array.
	}),

	regEscape: (regEsacpe= (str) => {
		return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}),
	
	/**
	 * To use custom-flags.
	 * @param {String} str The message content.
	 * @typedef {Object} flagOptions The flags options to be passed.
	 * @property {String} separator - The separator that separates the content
	 * @property {Boolean} allowDuplicates - Whether to allow duplicates or not
	 * @property {Boolean} returnContent - Whether to return the content before used before the flags.
	 * @param {?flagOptions} options
	 * @param {Array|String} flagsToDetect An Array/String of flags.
	 */
	 async separateFlags(str, options = {}, ...flagsToDetect) {
		if (!options.hasOwnProperty('separator'))
			Object.assign(options, { separator: 0 });

		if (!options.hasOwnProperty('allowDuplicates'))
			Object.assign(options, { allowDuplicates: false });

		if (!options.hasOwnProperty('returnContent'))
			Object.assign(options, { returnContent: false });

		return new Promise((resolve, reject) => {
			if (options.separator == 0) reject('Nothing to separate the flags with.');

			// Setting up variables
			// Check to see if we passed all flags we need as an array or individual arguments and makes an appropriate array from it.

			let flags = Array.isArray(flagsToDetect[0])
				? flagsToDetect[0]
				: Array.from(flagsToDetect);

			// Split by '-' to see what we need and remove everything before 1st flag:
			// There will be arguments with spaces inside.
			let args = str.split(options.separator);
			let content = args[0];
			args.splice(0, 1);

			// Decide the datatype we need
			// Duplicates allowed -> Array, if no then set.
			let flagSet = options.allowDuplicates ? [] : new Set();

			try {
				args.forEach(arg => {
					// Flag variables
					let currArgs = arg.split(' '); // For each argument with spaces inside, split it up
					let currentFlag = currArgs[0].toLowerCase();
					currArgs.splice(0, 1); // Delete the flag from the arguments
					let currentFlagArgs = '';

					// If we don't need to search for the specific flag, ignore it.
					if (!flags.includes(currentFlag)) return;
					// Splitting and finding the flag, and the arguments of the flag
					currArgs.forEach(flagArg => {
						if (flagArg != '') currentFlagArgs += `${flagArg} `;
					});
					currentFlagArgs = currentFlagArgs.substr(
						0,
						currentFlagArgs.length - 1
					); // Remove the last space

					// Check if the flag arguments are undefined - if no check if the arguments are actually valid (length > 0) - if yes - set to true
					let validArgs =
						currentFlagArgs == undefined ? false : currentFlagArgs.length > 0;

					if (options.allowDuplicates)
						flagSet.push(
							new customflag(currentFlag, currentFlagArgs, validArgs)
						);
					else
						flagSet.add(
							new customflag(currentFlag, currentFlagArgs, validArgs)
						);
				});

				options.returnContent === true ? resolve([content, flagSet]) : resolve(flagSet)
			} catch (err) {
				console.log(err);
				reject(err);
			}
		});
	},

    /**
	 * Get's progrees bar.
	 * @param {Number} amount The amount to be passed.
	 * @param {Number} total The total amount.
	 * @param {String} character The character to be used to fill the progres bar.
	 */
	progress(amount, total, character) {
		
		return (
			`${character}`.repeat(Math.floor((amount / Number(total)) * 20)) +
			"" +
			" ".repeat(20 - Math.floor((amount / Number(total)) * 20))
		  );
	},

	/**
 	* Checks whether two arrays have equal values irrespective of their order.
 	* @param {Array} arr1 - Array 1
 	* @param {Array} arr2 - Array 2
 	* @return {Boolean} returns true if equal else False.
 	*/

		ArrayisEqual(arr1, arr2) {
		if(arr1.length !== arr2.length){
			return false;
			};
			for(let i = 0; i < arr1.length; i++){
			if(!arr2.includes(arr1[i])){
				return false;
			};
			};
			return true;
	},

	/**
	 * Returns the RG value
	 * @param {Number | String} c 
	 * @returns Hex value
	 */
	hexComponent(H) {
		let hex = H.toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	},

	hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	},

	/**
	 * Returns the Hex component
	 * @param {Number} r - Red value in Int
	 * @param {Number} g - green value in Int
	 * @param {Number} b - Blue value in Int
	 * @returns 
	 */
		
	async rgbHexComponent(r, g, b) {
		let hexComponent = module.exports.hexComponent;
		return "#" + hexComponent(r) + hexComponent(g) + hexComponent(b);
	},

	countDuplicates(original) {
		const uniqueItems = new Set();
		const duplicates = new Set();
		for (const value of original) {
			if (uniqueItems.has(value)) {
			duplicates.add(value);
			uniqueItems.delete(value);
			} else {
			uniqueItems.add(value);
			}
		}
		return duplicates.size;
	},

	/**
	 * 
	 * @param {String} link - Source of the image.
	 * @typedef {Object} paletteOptions 
	 * @property {Boolean} rgbArray - Whether to return in an array;
	 * @param {paletteOptions} paletteOptions - Palette Options.
	 * @returns Buffer or Array
	 */

	/**
	 * 
	 * @param {String} link - Source of the image.
	 * @typedef {Object} paletteOptions 
	 * @property {Boolean} rgbArray - Whether to return in an array;
	 * @property {Number} count - The number of pallete to return
	 * @property {Number} quality - THe quality
	 * @param {paletteOptions} paletteOptions - Palette Options.
	 * @returns Buffer or Array
	 */

	 async colorPalette(link, paletteOptions = {}) {

		if (!paletteOptions.hasOwnProperty('rgbArray')) Object.assign(paletteOptions, {rgbArray: false});

		if (!paletteOptions.hasOwnProperty('count')) Object.assign(paletteOptions, {count: 2})

		if (!paletteOptions.hasOwnProperty('quality')) Object.assign(paletteOptions, {quality: 1})

    	let rgbParams = await getPaletteFromURL(link, paletteOptions.count, paletteOptions.quality)

		if (paletteOptions.rgbArray) {
			let array = [];
			for (let i = 0; i < rgbParams.length; i ++) {
				array.push(rgbHexComponent(rgbParams[i][0] > 255 ? 255 : rgbParams[i][0], rgbParams[i][1] > 255 ? 255 : rgbParams[i][1], rgbParams[i][2] > 255 ? 255 : rgbParams[i][2]))
			}
			return array;
		}

    	const { createCanvas } = require('canvas');
    	const canvas = createCanvas( (100 * rgbParams.length), 350);
    	const ctx = canvas.getContext('2d')
    	function hexComponent(H) {
            let hex = H.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }
			
		function rgbHexComponent(r, g, b) {
        	return "#" + hexComponent(r) + hexComponent(g) + hexComponent(b);
    	}

		ctx.font = "30px Verdana";
	    let goFurther = 0;
        for (let i = 0; i < rgbParams.length; i++) {
        ctx.fillStyle = rgbHexComponent(rgbParams[i][0], rgbParams[i][1], rgbParams[i][2]);
        ctx.fillRect(goFurther, 0, 195, 751);
        let saveStyle = ctx.fillStyle;
        ctx.fillStyle = require("tinycolor2")(saveStyle).isLight() ? "black" : "white";
        ctx.fillText(saveStyle, goFurther + 6.7, 35, 119, 50);
        goFurther += 135;
        }

		return canvas.toBuffer();

    },

	async frequentElement(arr) {
		let mf = 1;
		let m = 0;
		let item;
		for (let i = 0; i < arr.length; i++)
		{
				for (let j = i; j < arr.length; j++)
				{
					if (arr[i] == arr[j]) m++;
					
					if (mf<m) {
						mf=m; 
						item = `${arr[i]}-${mf}`
					}
				}
			m=0;
		}
		return item
	},

	async frequentRgbObj(arr) {
		let mf = 1;
		let m = 0;
		let item;
		for (let i = 0; i < arr.length; i++)
		{
				for (let j = i; j < arr.length; j++)
				{
					if (arr[i].red == arr[j].red && arr[i].green == arr[j].green && arr[i].blue == arr[j].blue) m++;
					if (mf<m) {
						mf=m; 
						item = `${arr[i].red}, ${arr[i].green}, ${arr[i].blue}`
					}
				}
			m=0;
		}

		return [item, mf]
	},
	
	async rgbToHex(r, g, b) {
		return "#" + ((1 << 24) + ((+r) << 16) + ((+g) << 8) + (+b)).toString(16).slice(1);
	},

	roundRect (ctx, x, y, width, height, radius, fill, stroke) {
		if (typeof stroke === 'undefined') {
			stroke = true;
		}

		if (typeof radius === 'undefined') {
			radius = 5;
		}

		if (typeof radius === 'number') {
			radius = {tl: radius, tr: radius, br: radius, bl: radius};
		} else {
			var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
			for (var side in defaultRadius) {
				radius[side] = radius[side] || defaultRadius[side];
			}
		}
		ctx.beginPath();
		ctx.moveTo(x + radius.tl, y);
		ctx.lineTo(x + width - radius.tr, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		ctx.lineTo(x + width, y + height - radius.br);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		ctx.lineTo(x + radius.bl, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		ctx.lineTo(x, y + radius.tl);
		ctx.quadraticCurveTo(x, y, x + radius.tl, y);
		ctx.closePath();

		if (fill) { ctx.fill(); }
		if (stroke) { ctx.stroke(); }
	},
	
	async paintMaskedImage(image, color, greyAlgorithm, maskAlgorithm, paintOrigianl = false, type = 'image/png') {

		let img = await Image.load(image);

		let grey = await img.grey({ algorithm: greyAlgorithm }),
			mask = await grey.mask({ algorithm: maskAlgorithm }), res;

		if(paintOrigianl) res = await img.rgba8().paintMasks(mask, {color: color});
		else res = await grey.rgba8().paintMasks(mask, {color: color})

		return res.toDataURL(type)
	}
};
