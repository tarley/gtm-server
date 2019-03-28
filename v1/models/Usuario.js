const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  perfil: String
})

module.exports = mongoose.model('Usuario', usuarioSchema)