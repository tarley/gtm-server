const mongoose = require('mongoose')

const instituicaoSchema = new mongoose.Schema({
    descricao: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('Instituicao', instituicaoSchema)