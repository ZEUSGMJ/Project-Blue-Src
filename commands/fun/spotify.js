const { MessageEmbed, MessageAttachment } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { invalidMember, error, frequentElement, frequentRgbObj, rgbToHex, roundRect, separateFlags, paintMaskedImage } = require('../../functions/Util');
const { UserResolver } = require('../../functions/Resolver');
const moment = require('moment')
const Color = require('color')
const tinycolor = require('tinycolor2');
const chalk = require('chalk');
const getColors = require('get-image-colors')
const jimp = require('jimp')

registerFont('./assets/font/NotoSansSC-Regular.otf', {
	family: 'Noto'
});

registerFont('./assets/font/Arial Unicode MS.ttf', {
	family: 'sans serif'
})

module.exports.run = async (client, message, args, prefix) => {
	let { member, channel, guild, content } = message,
		targetMember = member;
		args = args.join(' ')
		let trackCoverURL, flags = ['style', 's'], [text, flagSet] = await separateFlags(args, { separator:'--', allowDuplicates: false, returnContent: true }, flags), style = 1;

	text = text.trim().split(/ +/g).filter(t =>  t!= '')

	if (text && text.length > 0) targetMember = UserResolver(guild, text[0]);

	if (!targetMember)
		return invalidMember(channel, client)

	let spotify = targetMember.presence.activities.find(
		({ type, name }) => type === 'LISTENING' && name === 'Spotify'
	);

	if (!spotify)
		return channel.send(
			new MessageEmbed()
				.setColor('RED')
				.setAuthor(
					`${targetMember.user.tag}`,
					`https://cdn.discordapp.com/emojis/728926431291375668.png?v=1`
				)
				.setDescription(`> ${this.help.errorResponse}`)
				.setTimestamp()
		);

	for (let flag of flagSet) {
		switch (flag.name) {
			case 'style':		
			case 's':

				if (flag.validArgs != true) return channel.send(new MessageEmbed().setTitle(`<:PB_warn:784165498169458778> | Invalid Input`).setDescription(this.help.flagErrResponse.no_input).setColor('RED'))

				let flagArgs = flag.args.split(' ');
					style = flagArgs[0]

				if (style < 1 || style > 2) return channel.send(new MessageEmbed().setTitle(`<:PB_warn:784165498169458778> | Invalid Input`).setDescription(this.help.flagErrResponse.range_err).setColor('RED'))
				break;
			default:
				break;
		}
	}

	if (!spotify.assets.largeImage || !spotify.assets || !spotify.syncID) {
		trackCoverURL = targetMember.user.displayAvatarURL({ format: 'jpg',	size: 1024 });
	} else if (spotify.assets.largeImage != null) {
		spotify.assets.largeImage.startsWith('spotify:') ? 
			trackCoverURL = `https://i.scdn.co/image/${spotify.assets.largeImage.slice(8)}` : 
			trackCoverURL = `https://i.scdn.co/image/${spotify.assets.largeText.slice(8)}`;
	}
	channel.startTyping();

	console.log(style)

	//Canvas
	try {
		let strt = process.hrtime(),
			trackCover = await loadImage(trackCoverURL),
			canvas = createCanvas(100, 80),
			ctx = canvas.getContext('2d'),
			Colors = [],
			reply = '',
			colors;
		
		const options = {
			count: 1,
			type: 'image/png'
			};

		for (let i = 0; i < trackCover.width && i < 540; i += 40) {

			ctx.drawImage(trackCover, i, 15, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
			colors = await getColors(canvas.toBuffer(), options)
			Colors.push(colors[0].hex())

			ctx.drawImage(trackCover, 0, i, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
			colors = await getColors(canvas.toBuffer(), options)
			Colors.push(colors[0].hex())

			ctx.drawImage(trackCover, 0, i, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
			colors = await getColors(canvas.toBuffer(), options)
			Colors.push(colors[0].hex())

			ctx.drawImage(trackCover, i, 320, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
			colors = await getColors(canvas.toBuffer(), options)
			Colors.push(colors[0].hex())

		}

		const freq = await frequentElement(Colors),
			count = freq.split('-')[1];
		let bg = Color(freq.split('-')[0]);

		if (count <= 4) {

			console.log('Count is <= 4...')
			let canvas;
			!spotify.syncID ? canvas = createCanvas(trackCover.width, trackCover.height / 2) : canvas = createCanvas(640, 240)
			let ctx = canvas.getContext('2d'),
				arr = [],
				rgb = [],
				_rgb = {};

			if (spotify.syncID) {
				ctx.drawImage(trackCover, 0, 0 , canvas.width, canvas.height / 2, 0 , 0, canvas.width, canvas.height / 2)
				ctx.drawImage(trackCover, 0, 480, canvas.width, canvas.height / 2, 0 , 120, canvas.width, canvas.height / 2)
			} else {
				ctx.drawImage(trackCover, 0, 0 , canvas.width, canvas.height / 2, 0 , 0, canvas.width, canvas.height / 2)
				ctx.drawImage(trackCover, 0, canvas.height - 60, canvas.width, canvas.height / 2, 0 , 120, canvas.width, canvas.height / 2)
			}

			let jimpImg = await jimp.read(canvas.toBuffer())
			jimpImg.blur(10)
			let img_blr = await jimpImg.getBufferAsync('image/png');

			ctx.clearRect(0, 0, canvas.width, canvas.height)
			let blurImg = await loadImage(img_blr)
			ctx.drawImage(blurImg, 0, 0);

			for (let i = 0; i < canvas.width; i+= 16) {
				for (let j = 0; j < canvas.height; j += 16) {
					arr.push( ctx.getImageData(i, j, 59, 15).data.slice(0, 25) )
				}
			}

			for (let i = 0; i < arr.length; i++) {
			rgb.push( _rgb = { red: arr[i][0], green: arr[i][1], blue: arr[i][2] } )
			}

			let [res, c] = await frequentRgbObj(rgb);
			let rgbColor = res.trim().split(', ');
			let hex = await rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2])
			bg = Color(hex);
		}

		canvas = createCanvas(trackCover.width, trackCover.height)
		ctx = canvas.getContext('2d')
		ctx.drawImage(trackCover, 0, 0, canvas.width, canvas.height)

		let fontColors = await (await getColors(canvas.toBuffer(), {count: 30, type: 'image/png'})).map(c => c.hex())
		fontColors = fontColors.concat(Colors)

		fontColors = fontColors.filter((c, index) => {
			return fontColors.indexOf(c) === index;
		});

		ctx.clearRect(0,0, canvas.width, canvas.height)

		canvas = createCanvas(640, 240)
		ctx = canvas.getContext('2d')
		ctx.drawImage(trackCover, 400, 240, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
		let textColor = tinycolor.mostReadable(bg.hex(), fontColors,{includeFallbackColors: true, level: 'AA', size: 'large'}).toHexString();

		if (!textColor) textColor = bg.negate().hex()

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		let trackName = spotify.details,
			Artist = spotify.state.replace(/;/g, ','),
			albumName = spotify.assets.largeText.startsWith('spotify:') ? spotify.assets.largeImage : spotify.assets.largeText;

		let startTime = moment.utc(Date.now() - spotify.timestamps.start).format('mm:ss'),
			endTime = moment.utc(Date.now() - spotify.timestamps.start + new Date(spotify.timestamps.end).getTime() - Date.now()).format('mm:ss'),
			elapsed = Date.now() - spotify.timestamps.start,
			total = spotify.timestamps.end - spotify.timestamps.start,
			username = targetMember.user.username,
			startF = Math.round((elapsed / total) * 1320);

		if (style == 1) {
			canvas = createCanvas(1420, 450);
			ctx = canvas.getContext('2d');
			let logo = await loadImage('./assets/Spotify_Icon_Black.png','spotify.png');

			ctx.save()
			roundRect(ctx, 0, 0, canvas.width, canvas.height, 50, false, false)
			ctx.clip()
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(trackCover, 980, 0, 450, canvas.height);
			gradient = ctx.createLinearGradient(0, 0, 1400, 0)
			gradient.addColorStop(0.75, bg.rgb().string())
			gradient.addColorStop(0.80, bg.fade(0.05).rgb().string())
			gradient.addColorStop(1, bg.fade(1).rgb().string())
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			//To slice if the text goes above the mentioned width.
			while (ctx.measureText(trackName.trim()).width > 115)
				trackName = `${trackName.slice(0, -4)}...`;
			while (ctx.measureText(`${Artist.trim()}`).width > 160)
				Artist = `${Artist.slice(0, -4)}...`;
			while (ctx.measureText(`${albumName.trim()}`).width > 200)
				albumName = `${albumName.slice(0, -4)}...`;
			while (ctx.measureText(`• ${username.trim()}`).width > 130)
				username = `${username.slice(0, -4)}...`;		

			ctx.fillStyle = textColor;
			ctx.font = '600 76px Arial Unicode MS';
			ctx.fillText(`${trackName.trim()}`, 45, 185);

			ctx.fillStyle = tinycolor(textColor).isDark() ?  tinycolor(textColor).lighten(5).toRgbString() : tinycolor(textColor).darken(5).toRgbString()
			ctx.font = '60px Arial Unicode MS';
			ctx.fillText(Artist, 45, 265);

			ctx.font = '600 36px Arial Unicode MS';
			ctx.fillStyle = textColor
			if (startTime > endTime) ctx.fillText(endTime, 45, 395);
			else ctx.fillText(startTime, 45, 400);
			ctx.fillText(endTime, 1275, 400);

			ctx.font = '42px Arial Unicode MS';
			ctx.fillText(`• ${albumName}`, 110, 90);

			// Progress Bar
			let progressStyle = tinycolor(textColor).setAlpha(0.65).toRgbString()
			ctx.fillStyle = progressStyle
			ctx.save()
			roundRect(ctx, 45, 330, 1320, 10, 6, true, false);
			ctx.clip()

			ctx.fillStyle = textColor
			roundRect(ctx, 45, 330, startF, 10, 6, true, false);
			ctx.restore()

			ctx.translate(45, 335)
			ctx.beginPath();
			ctx.fillStyle = textColor
			if(startF > 1320) ctx.arc(1320, 0, 14, 0, 2 * Math.PI);
			else ctx.arc(startF, 0, 14, 0, 2 * Math.PI);
			ctx.fill()
			ctx.restore();

			let member_avatar = await loadImage(targetMember.user.displayAvatarURL({ format: 'png', size: 128 }));
			ctx.beginPath()
			ctx.strokeStyle = 'transparent'
			ctx.arc(70, 75, 25, 0 * Math.PI, 2 * Math.PI)
			ctx.stroke()
			ctx.clip()

			ctx.globalCompositeOperation = 'xor'
			ctx.drawImage(logo, 42, 46, 56, 56)
			
			ctx.globalCompositeOperation = 'destination-over'
			ctx.drawImage(member_avatar, 44, 48, 52, 52);
			
			ctx.restore()

		} else if(style == 2) {

			bg = Color(bg).hex()
			let scananble,
				barColor = tinycolor(bg).isDark() ? 'white' : 'black',
				startPos = Math.round((elapsed / total) * 1440),
				greyAlgo;

			canvas = createCanvas(990, 250)
			ctx = canvas.getContext('2d')

			if (spotify.syncID) scananble = await loadImage(`https://scannables.scdn.co/uri/plain/png/${bg.slice(1)}/${barColor}/990/spotify:track:${spotify.syncID}`)

			ctx.drawImage(scananble, 0, 0, 990, 250)

			barColor == 'white' ? greyAlgo = 'lightness' : greyAlgo = 'black'
			let maskedImg = await paintMaskedImage(canvas.toBuffer(), textColor, greyAlgo, 'mean', true),
				scannable_buff = await loadImage(maskedImg);

			ctx.clearRect(0, 0, canvas.width, canvas.height)
			
			let logo = await loadImage('./assets/Spotify_Icon_Black.png','spotify.png')
			// let member_avatar = await loadImage(targetMember.user.displayAvatarURL({ format: 'png', size: 512 }));

			canvas = createCanvas(logo.width, logo.height)
			ctx = canvas.getContext('2d')
			ctx.drawImage(logo, 0, 0)

			let maskedLogo = await paintMaskedImage(canvas.toBuffer(), textColor, greyAlgo, 'li', true),
				logo_buff = await loadImage(maskedLogo)

			canvas = createCanvas(1440, 500)
			ctx = canvas.getContext('2d')

			ctx.fillStyle = bg;
			ctx.save()
			roundRect(ctx, 0, 0, canvas.width, canvas.height, {
				tl: 25,
				tr: 25 
			}, true, false)
			ctx.clip()

			// Draw the scannable code
			//if(spotify.syncID) ctx.drawImage(scannable_buff, 450, 175, 990, 250)
			if(spotify.syncID) ctx.drawImage(scannable_buff, 200, 0, 790, 253, 630, 210, 790, 253)

			ctx.fillStyle = textColor;
			roundRect(ctx, 22.5, 22.5, 405, 405, 25, true, false)
			ctx.save()
			roundRect(ctx, 25, 25, 400, 400, 25, false, false)
			ctx.clip()
			ctx.shadowBlur = 0;
			ctx.drawImage(trackCover, 25, 25, 400, 400)
			ctx.restore()

			ctx.shadowBlur = 0;

			while (ctx.measureText(trackName.trim()).width > 145)
				trackName = `${trackName.slice(0, -4)}...`;
			while (ctx.measureText(`${Artist.trim()}`).width > 180)
				Artist = `${Artist.slice(0, -4)}...`;
			while (ctx.measureText(`${albumName.trim()}`).width > 190)
				albumName = `${albumName.slice(0, -4)}...`;
			while (ctx.measureText(`• ${username.trim()}`).width > 130)
				username = `${username.slice(0, -4)}...`;

			ctx.fillStyle = textColor;
			ctx.font = '700 64px Arial Unicode MS';
			ctx.fillText(`${trackName.trim()}`, 475, 95);

			ctx.fillStyle = tinycolor(textColor).isDark() ?  tinycolor(textColor).lighten(5).toRgbString() : tinycolor(textColor).darken(5).toRgbString()
			ctx.font = '52px Arial Unicode MS';
			ctx.fillText(Artist, 475, 155);
			
			ctx.font = '700 52px Arial Unicode MS';
			if (albumName != null) ctx.fillText(`${albumName.trim()}`, 475, 220);

			ctx.font = '600 30px Arial Unicode MS';
			ctx.fillText(startTime, 25, 475)
			ctx.fillText(endTime, 1335, 475)

			let progressStyle = tinycolor(textColor).setAlpha(0.35).toRgbString()
			ctx.fillStyle = progressStyle
			ctx.fillRect(0, 485, canvas.width, 15)

			ctx.fillStyle = textColor
			roundRect(ctx, 0, 485, startPos, 15, {
				tr: 9,
				br: 9,
			}, true, false);

			ctx.drawImage(logo_buff, 475, 260, 150, 150)

			ctx.restore()

			reply = `> **${targetMember.user.tag}** is listening to:-`;
			
		}

		let difference = process.hrtime(strt);
		let millis = `${difference[0] > 0 ? difference[0] : ''}${
			difference[1] / 1e6
		}ms`;

		console.log(chalk.cyan(`Time took: `) + chalk.bold.red(`${millis}`))
		const Spotify = new MessageAttachment(canvas.toBuffer(), `${targetMember.user.username}-Spotify.png`)
		await channel.send(reply,Spotify)
		channel.stopTyping(true)
	} catch(err) {
		await channel.stopTyping(true)
		error(message, client, this.help.name, err)
	}
};

module.exports.help = {
	name: 'spotify',
	description:
		'Sends an image showing the song that a member is currently listening.',
	usage: 'spotify [ member ] [--s | --style] < 1 | 2 >',
	nsfw: false,
	errorResponse: `No Spotify activity detected. Maybe you/the mentioned member is offline or not listening to any songs.`,
	category: 'fun',
	aliases: ['sp'],
	flagErrResponse: {
		range_err: '> Choose a style between **`1`** & **`2`**.',
		no_input: '> Please provide a style/design number between **`1`** & **`2`**.'
	}
};

module.exports.requirements = {
	ownerOnly: false,
	clientPerms: ['ATTACH_FILES'],
	userPerms: []
};

module.exports.limits = {
	cooldown: 4e3
};
