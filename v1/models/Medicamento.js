const mongoose = require('mongoose')

const medicamentoSchema = new mongoose.Schema({
    descricao: String,
    formaFarmaceuticaDosagem: {
        type: String
    },
    criadoPor: String,
    criadoEm: Date,
})

module.exports = mongoose.model('Medicamento', medicamentoSchema)