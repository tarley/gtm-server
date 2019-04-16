const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: {
    type: String,
    unique: true
  },
  senha: String,
  perfil: String
})

module.exports = mongoose.model('Usuario', usuarioSchema)