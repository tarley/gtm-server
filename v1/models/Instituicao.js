const mongoose = require('mongoose')

const instituicaoSchema = new mongoose.Schema({
    descricao: {
        type: String,
        unique: true
    },
    criadoPor: String,
    criadoEm: Date,
})

module.exports = mongoose.model('Instituicao', instituicaoSchema)