const express = require('express');
const usuarios = require('./v1/routes/UsuarioRote');


const app = express();
app.use('/usuarios', usuarios.default);


const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World'));

const server = app.listen(port, () => {
    console.log('Express server listening on port ' + server.address().port);
})