const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({origin: "*"}));

const menu = require('./routes/menu');
app.use('/routes/menu', menu);

const permissao = require('./routes/permissao');
app.use('/routes/permissao', permissao);

const perfilusuario = require('./routes/perfilusuario');
app.use('/routes/perfilusuario', perfilusuario);

const usuarios = require('./routes/usuarios');
app.use('/routes/usuarios', usuarios);

module.exports = app;