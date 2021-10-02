const { Client, Collection, Intents } = require('discord.js');
const fs = require("fs");
const mongoose = require('mongoose')
const topGG = require('@top-gg/sdk')

require('dotenv').config()

const client = new Client({
	disableEveryone: true,
	ws: {
		intents: Intents.ALL,
		properties: {
			$browser: 'Discord Android'
		}
	},
});

client.commands = new Collection();
client.aliases = new Collection();
client.snipes = new Map();
client.utils = require('./functions/Util')

client.categories = fs.readdirSync("./commands/").filter((f) => !f.includes('developer'));

const commands = require('./structures/command');
commands.run(client);

const events = require('./structures/events');
events.run(client);

const message = require('./events/message')

const db = require('./structures/mongoose');
db.run(mongoose);

const dblApi = new topGG.Api(process.env.TOP_GG_TOKEN);
client.dbl = dblApi;

const dbl = require('./structures/dbl')
dbl.run(client, dblApi);

client.login(process.env.PB_TOKEN);