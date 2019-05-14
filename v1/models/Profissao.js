const mongoose = require('mongoose')

const profissaoSchema = new mongoose.Schema({
    descricao: {
        type: String,
        unique: true

    }
})

module.exports = mongoose.model('Profissao', profissaoSchema)