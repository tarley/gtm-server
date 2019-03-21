const usuarioRepository = require('../repositories/UsuarioRepository');
const Usuario = require('../models/Usuario');

class UsuarioController {

    inserir(req, res) {
        try {
            const usuario = new Usuario({
                nome: 'ADA.LOVELACE@GMAIL.COM'
            })

            usuario.save()
            .then(doc => {
              console.log(doc)
            })
            .catch(err => {
              console.error(err)
            })

            console.log("teste");
            usuarioRepository
            res.send("Teste test 123");
        } catch(err) {
            res.send("Error: " + err.message);
        }
    }
}

module.exports = new UsuarioController();