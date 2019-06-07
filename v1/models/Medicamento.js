const mongoose = require('mongoose')

const medicamentoSchema = new mongoose.Schema({
    descricao: {
        type: String,
        unique: true
    },
    formaFarmaceuticaDosagem: String
    
})

module.exports = mongoose.model('Medicamento', medicamentoSchema)