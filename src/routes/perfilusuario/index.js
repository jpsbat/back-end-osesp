const { Router } = require("express");
const mysql = require('mysql2');

const router = Router();

const conn = mysql.createConnection({
    host: 'localhost',
    database: 'dbOsespBilheteria',
    user: 'root',
    password: ''
});

router.get('/listar', function (req, res) {

    try {

        conn.execute('SELECT * FROM tbPerfilUsuario;', function (err, response, fields) {

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

router.get('/:id', function (req, res) {

    try {

        if (!req.params.id) {
            return res.status(400).json({
                msg: 'ID não fornecido.'
            });
        }

        conn.execute('SELECT * FROM tbPerfilUsuario WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'ID fornecido não encontrado!'
                });
            }

            conn.execute(
                `SELECT * FROM tbPerfilUsuario WHERE id = ?;`, [req.params.id], function (err, response, fields) {
        
                if (err) throw err;

                res.status(200).json({
                    msg: 'Sucesso na consulta!',
                    data: response[0]
                });
            });
        });
        
    } catch (error) {
        
        res.status(200).json({
            msg: 'Erro na consulta!',
            data: error
        });
    }
});

router.post('/cadastrar', function (req, res) {

    try {

        const { descricao, administrador } = req.body;

        if (!descricao || isNaN(administrador)) {
            return res.status(400).json({
                msg: 'Preencha todos os campos.'
            });
        } if (administrador !== 0 && administrador !== 1) {
            return res.status(400).json({
                msg: 'O administrador deve ser 0 (não) ou 1 (sim)'
            })
        }

        conn.execute('INSERT INTO tbPerfilUsuario (descricao, administrador) values (?, ?);',
        [req.body.descricao, req.body.administrador],
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

router.patch('/alterar/:id', function (req, res) {

    try {

        conn.execute('SELECT * FROM tbPerfilUsuario WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'ID fornecido não encontrado!'
                });
            }

            const { descricao, administrador } = req.body;

            if (!descricao || isNaN(administrador)) {
                return res.status(400).json({
                    msg: 'Preencha todos os campos.'
                });
            } if (administrador !== 0 && administrador !== 1) {
                return res.status(400).json({
                    msg: 'O administrador deve ser 0 (não) ou 1 (sim)'
                })
            }

            conn.execute('UPDATE tbPerfilUsuario SET descricao = ?, administrador = ? WHERE id = ?;',
            [req.body.descricao, req.body.administrador, req.params.id],
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

router.delete('/excluir/:id', function (req, res) {

    try {

        if (!req.params.id) {
            return res.status(400).json({
                msg: 'ID não fornecido na requisição!'
            });
        }

        conn.execute('SELECT * FROM tbPerfilUsuario WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'ID fornecido não encontrado!'
                });
            }

            conn.execute('DELETE FROM tbPerfilUsuario WHERE id = ?;', [req.params.id], function (err, response, fields) {

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