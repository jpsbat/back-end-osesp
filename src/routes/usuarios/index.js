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

        conn.execute('SELECT * FROM tbUsuario;', function (err, response, fields) {

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

        conn.execute('SELECT * FROM tbUsuario WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'ID fornecido não encontrado!'
                });
            }

            conn.execute(
                `SELECT * FROM tbUsuario WHERE id = ?;`, [req.params.id], function (err, response, fields) {
        
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

router.post('/login', function(req, res) {
    try {
        const { login, senha } = req.body;

        if (!login || !senha) {
            return res.status(400).json({
                msg: 'Preencha todos os campos obrigatórios.'
            });
        }

        conn.execute('SELECT * FROM tbUsuario WHERE login = ? AND senha = ?;', [login, senha], function(err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(401).json({
                    msg: 'Login ou senha incorretos.'
                });
            }

            res.status(200).json({
                msg: 'Login bem sucedido!'
            });
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Erro no login.',
            data: error
        });
    }
});

router.put('/alterar/:id', function (req, res) {

    try {
        const { nome, login, senha, ativo, idperfilusuario } = req.body;

        if (!nome || !login || !senha) {
            return res.status(400).json({
                msg: 'Preencha todos os campos obrigatórios.'
            });
        } if (isNaN(idperfilusuario) || isNaN(ativo)) {
            return res.status(400).json({
                msg: 'Atente que IdPerfilUsuario e Ativo devem ser números inteiros.'
            });
        } if (ativo !== 0 && ativo !== 1) {
            return res.status(400).json({
                msg: 'Ativo deve ser 0 (não) ou 1 (sim)'
            })
        }

        if (!req.params.id) {
            return res.status(400).json({
                msg: 'ID não fornecido na requisição!'
            });
        }

        conn.execute('SELECT * FROM tbUsuario WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'ID fornecido não encontrado!'
                });
            }

            conn.execute('UPDATE tbUsuario SET nome = ?, login = ?, senha = ?, idPerfilUsuario = ?, ativo = ? WHERE id = ?;',
    [req.body.nome, req.body.login, req.body.senha, req.body.idperfilusuario, req.body.ativo, req.params.id],
    function (err, response, fields) {
        if (err) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(404).json({
                    msg: 'ID de permissão fornecido não encontrado!'
                });
            } else {
                throw err;
            }
        }

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

        conn.execute('SELECT * FROM tbUsuario WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'ID fornecido não encontrado!'
                });
            }

            conn.execute('DELETE FROM tbUsuario WHERE id = ?;', [req.params.id], function (err, response, fields) {

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