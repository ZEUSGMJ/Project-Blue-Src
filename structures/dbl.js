
module.exports.run = async (client, dblApi) => {
    
    setInterval(() => {
        console.log(`Posting stats to top.gg`)        
        dblApi.postStats({
            serverCount: client.guilds.cache.size
        })
    }, 1800000);

    dblApi.on('posted', () => {
        console.log(`Posted stats succesfully to top.gg!`)
    })

    dblApi.on('error', (err) => {
        console.log(`Welp, looks like an error occured when trying to post the stats to top.gg.`,err)
    })
}