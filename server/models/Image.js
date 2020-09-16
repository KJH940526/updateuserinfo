const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = mongoose.Schema({
    writer: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },

    filePath : {
        type: String,
    },

}, { timestamps: true })


const Image = mongoose.model('Image', imageSchema);

module.exports = { Image } 