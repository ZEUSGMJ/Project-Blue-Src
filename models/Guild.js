const mongoose = require('mongoose');

const GuildSchema = mongoose.Schema({
    GuildID: String,
    prefix: String,
})

module.exports = mongoose.model('Guild', GuildSchema);