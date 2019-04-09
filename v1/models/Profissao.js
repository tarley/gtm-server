const mongoose = require('mongoose')

const profissaoSchema = new mongoose.Schema({
    descricao: String,
})

module.exports = mongoose.model('Profissao', profissaoSchema)