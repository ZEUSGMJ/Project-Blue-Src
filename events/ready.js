const { defaultprefix } = require('../config');
const figlet = require('figlet')

module.exports = async (client) => {
	let activities = [
		`Commands getting executed | ${defaultprefix}help`,
		`Over ${client.guilds.cache.size} Guilds | ${defaultprefix}help`,
		`Over ${client.users.cache.size} Users | ${defaultprefix}help`,
		`for ${defaultprefix}help`,
	];
	var ts = new Date();
	console.log(`--------------------------------------------`);
	console.log(ts.toLocaleString() + ` Logged in as ${client.user.tag}!`);
	console.log(
		`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
	);
	console.log(`This is ${client.user.tag} and i am online!`);

	figlet.text('Project Blue',{
	font: 'Speed',
	horizontalLayout: 'default',
	verticalLayout: 'default',
	width: 80,
	whiteSpaceBreak: true
	}, function(err, data) {
		if (err) {
			console.log(`Error occured while trying to build an ascii-font`, err)
		}
		console.log(data)
	})

	let random = 0;
	setInterval(() => {
		client.user.setActivity(`${activities[random]}`, { type: 'WATCHING' });
		random += 1;
		if (random === 4) random = 0;
	}, 3e4);
};
