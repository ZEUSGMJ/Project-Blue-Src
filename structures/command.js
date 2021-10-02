const fs = require("fs");
const { join } = require("path");

module.exports.run = (client) => {
    const filePath = join(__dirname, "..", `commands`);
    fs.readdirSync(filePath).forEach(dir => {
        const jsfile = fs.readdirSync(`${filePath}/${dir}/`).filter(f => f.endsWith(".js"));
        if(jsfile.length <= 0) {
            console.log(`Couldn't find any js files in ${dir}`);
            return;
        }

        jsfile.forEach((f, i) => {
            const prop = require(`${filePath}/${dir}/${f}`);
            console.log(`${f} loaded.`)
            client.commands.set(prop.help.name, prop)

            if(prop.help.aliases)for (const alias of prop.help.aliases) {
                client.aliases.set(alias, prop)
            }
        })
        console.log(`All ` + jsfile.length + ` commands in ${dir} were loaded correctly`);
    })
}