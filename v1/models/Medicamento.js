const mongoose = require('mongoose')

const medicamentoSchema = new mongoose.Schema({
    descricao: String,
})

module.exports = mongoose.model('Medicamento', medicamentoSchema)