const mongoose = require('mongoose')

const atendimentoSchema = new mongoose.Schema({
        idUsuario: String,
        idInstituicao: String,
        idPaciente: String,
        nomePaciente: String,
        dataAtendimento: Date,
        quadroGeral: String,
        experienciaSubjetiva: String, 
        finalizado: {
            type: Boolean,
            default: false
        },
        doencas: [{
            nome: String,
            descricao: String,
            dataResultado: Date,
            planoCuidado: {
                objetivoTerapeutico: String,
                condutas: {
                    medicamento: String,
                    conduta: String,
                },
                scf: String,
                observacaoScf: String,
                outrasCondutas: String
            },
            farmacoterapias: [{
                medicamento: String,
                posologiaRelatada: String,
                posologiaPrescrita: String,
                efetividade: String,
                tempoUso: String,
                seguranca: String,
                dificuldadeUso: String,
                conduta: String,
                prm: {
                    prm : String,
                    causa: String,
                    resolvido: String
                }
            }],
        }],
})

module.exports = mongoose.model('Atendimento', atendimentoSchema)