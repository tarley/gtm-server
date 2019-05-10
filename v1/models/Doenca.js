const mongoose = require('mongoose')

const doencaSchema = new mongoose.Schema({
    descricao: String,
})

module.exports = mongoose.model('Doenca', doencaSchema)