const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const ChangelogSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: nanoid(16)
    },
    Date: String,
    Changes: Array,
})

module.exports = mongoose.model('Changelog', ChangelogSchema)