let mongoose = require('mongoose')

let usuarioSchema = new mongoose.Schema({
  nome: String
})

module.exports = mongoose.model('Usuario', usuarioSchema)