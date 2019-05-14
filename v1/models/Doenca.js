const mongoose = require('mongoose')

const doencaSchema = new mongoose.Schema({
    descricao: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('Doenca', doencaSchema)