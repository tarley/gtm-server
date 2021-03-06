const express = require('express');
const rotasV1Usuarios = require('./v1/routes/UsuarioRoute');
const rotasV1Pacientes = require('./v1/routes/PacienteRoute');
const rotasV1Atendimentos = require('./v1/routes/AtendimentoRoute');
const rotasV1Instituicao = require('./v1/routes/InstituicaoRoute');
const rotasV1Medicamento = require('./v1/routes/MedicamentoRoute');
const app = express();

var morgan = require('morgan')
app.use(
    morgan(
        ':date[iso] :method | URL: :url | Status: :status | TamanhoRes: :res[content-length] | TamanhoReq: :req[content-length] | Tempo: :response-time ms',
    ),
);

require("dotenv-safe").config();

/*
 *
 */
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, options);

/*
 * Configura o body parser
 */
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

/*
 * Configura a pasta public
 */
const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Configura o Swagger
 */
const swagger = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json');

app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocs));


/*
 * Configura as rotas de usuário
 */
app.use('/api/v1/usuarios/', rotasV1Usuarios.default);

/*
 * Configura rotas de paciente
 */
 app.use('/api/v1/pacientes', rotasV1Pacientes.default);

/*
 * Configura rotas de atendimentos
 */
app.use('/api/v1/atendimentos/', rotasV1Atendimentos.default);

/*
 * Configura rotas de instituição
 */
app.use('/api/v1/instituicao/', rotasV1Instituicao.default);

/*
 * Configura rotas de medicamento
 */
app.use('/api/v1/medicamento/', rotasV1Medicamento.default);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.redirect(`http://${req.headers['host']}/api-docs`);
});

const server = app.listen(port, () => {
    console.log('Express server listening on port ' + server.address().port);
})