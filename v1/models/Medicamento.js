const mongoose = require('mongoose')

const medicamentoSchema = new mongoose.Schema({
    _id: String,
    descricao: String,
})

module.exports = mongoose.model('Medicamento', medicamentoSchema)