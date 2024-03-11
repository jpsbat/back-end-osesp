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

router.put('/alterar/:idusuario/:idmenu', function (req, res) {

    try {

        if (!req.params.idusuario) {
            if (!req.params.idmenu) {
                return res.status(400).json({
                    msg: 'ID não fornecido na requisição!'
                });
            }
        }

        conn.execute('SELECT * FROM tbPermissao WHERE idUsuario = ? AND idMenu = ?;', [req.params.idusuario, req.params.idmenu], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'ID fornecido não encontrado!'
                });
            }

            conn.execute('UPDATE tbPermissao SET idUsuario = ?, idMenu = ? WHERE idUsuario = ? AND idMenu = ?;',
            [req.body.idusuario, req.body.idmenu, req.body.idusuario, req.body.idmenu],
            function (err, response, fields) {

                if (err) throw err;
        
                res.status(200).json({
                    msg: 'Atualizado com sucesso!',
                    data: response
                });
            });
        });
        
    } catch (error) {
        
        res.status(500).json({
            msg: 'Erro ao atualizar!',
            data: error
        });
    }
});

router.delete('/excluir/:idusuario/:idmenu', function (req, res) {

    try {

        if (!req.params.idusuario) {
            if (!req.params.idmenu) {
                return res.status(400).json({
                    msg: 'ID não fornecido na requisição!'
                });
            }
        }

        conn.execute('SELECT * FROM tbPermissao WHERE idUsuario = ? AND idMenu = ?;', [req.params.idusuario, req.params.idmenu], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'ID fornecido não encontrado!'
                });
            }

            conn.execute('DELETE FROM tbPermissao WHERE idUsuario = ? AND idMenu = ?;', [req.params.idusuario, req.params.idmenu], function (err, response, fields) {

                if (err) throw err;
        
                res.status(200).json({
                    msg: 'Excluído com sucesso!',
                    data: response
                });
            });
        });
        
    } catch (error) {
        
        res.status(500).json({
            msg: 'Erro ao excluir!',
            data: error
        });
    }
});

module.exports = router;