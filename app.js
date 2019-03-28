const express = require('express');
const rotasV1Usuarios = require('./v1/routes/UsuarioRoute');

const app = express();

/*
 * Configura o body parser
 */
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

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


const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.redirect(`http://${req.headers['host']}/api-docs`);
});

const server = app.listen(port, () => {
    console.log('Express server listening on port ' + server.address().port);
})