const { Router } = require("express");
const mysql = require('mysql2');

const router = Router();

const conn = mysql.createConnection({
    host: 'localhost',
    database: 'dbOsespBilheteria',
    user: 'root',
    password: '123456'
});

router.get('/listar', function (req, res) {

    try {

        conn.execute('SELECT * FROM tbPermissao;', function (err, response, fields) {

            if (err) throw err;
    
            res.status(200).json({
                msg: 'Sucesso na listagem!',
                data: response
            });
        });
        
    } catch (error) {
        
        res.status(200).json({
            msg: 'Erro ao listar.',
            data: error
        });
    }
});

router.post('/cadastrar', function (req, res) {

    try {

        conn.execute('INSERT INTO tbPermissao (idUsuario, idMenu) values (?, ?);',
        [req.body.idusuario, req.body.idmenu],
        function (err, response, fields) {

            if (err) throw err;
    
            res.status(200).json({
                msg: 'Cadastrado com sucesso!',
                data: response
            });
        });
        
    } catch (error) {
        
        res.status(500).json({
            msg: 'Erro ao cadastrar!',
            data: error
        });
    }
});

module.exports = router;