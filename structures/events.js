const { readdirSync } = require('fs');
const { join } = require("path");
const filePath = join(__dirname, "..", "events");
const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports.run = (client) => {
    const eventFiles = readdirSync(filePath);
    for (const eventFile of eventFiles) {
        const event = require(`${filePath}/${eventFile}`);
        const eventName = eventFile.split(".").shift();
        client.on(eventName, event.bind(null, client));
    }
    console.log(`Loaded ${eventFiles.length} events!`);
    
    process.on('unhandledRejection',error =>{
        console.log(error);
        let embed = new MessageEmbed()
        const hook = new WebhookClient("743872376634212402","0TQeiwDa0m-b_NA9SHnsHGV0qOoKDsYBc3Q3M-jjM-OJXRZXHktqpQw5uow6HG5h6nkD");
        hook.send(embed.setTitle(`<:PB_error:772115933459120138> Error.`).setDescription(`\`\`\`js\n${error.code ? error.code : ""}\n${error.message}\n${error.stack}\`\`\``).setColor('RED').setTimestamp());
    });
}
