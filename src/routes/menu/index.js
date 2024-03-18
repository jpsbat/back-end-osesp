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

        conn.execute('SELECT * FROM tbMenu;', function (err, response, fields) {

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

        conn.execute('SELECT * FROM tbMenu WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'ID fornecido não encontrado!'
                });
            }

            conn.execute(
                `SELECT * FROM tbMenu WHERE id = ?;`, [req.params.id], function (err, response, fields) {
        
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

router.post('/cadastrar', async function (req, res) {
    try {
        const { descricao, link, idpai, ordem, ativo } = req.body;

        if (isNaN(ordem) || isNaN(ativo)) {
            return res.status(400).json({
                msg: 'Ordem deve ser um número inteiro.'
            });
        }

        if (!descricao || !link || !ativo) {
            return res.status(400).json({
                msg: 'Preencha todos os campos.'
            });
        }

        if (ativo !== 0 && ativo !== 1) {
            return res.status(400).json({
                msg: 'Ativo deve ser 0 (não) ou 1 (sim)'
            });
        }

        const idpaiExists = await checkIfIdPaiExists(idpai);
        if (!idpaiExists) {
            return res.status(404).json({
                msg: 'Este ID Pai não existe.'
            });
        }

        conn.beginTransaction(function (err) {
            if (err) {
                throw err;
            }

            conn.execute('INSERT INTO tbMenu (descricao, link, idPai, ordem, ativo) VALUES (?, ?, ?, ?, ?);',
                [descricao, link, idpai, ordem, ativo],
                function (err, result) {
                    if (err) {
                        conn.rollback(function () {
                            throw err;
                        });
                    }

                    conn.commit(function (err) {
                        if (err) {
                            conn.rollback(function () {
                                throw err;
                            });
                        }

                        res.status(200).json({
                            msg: 'Cadastrado com sucesso!',
                            data: result
                        });
                    });
                });
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Erro ao cadastrar!',
            data: error
        });
    }
});

function checkIfIdPaiExists(idpai) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT COUNT(*) AS count FROM tbMenu WHERE id = ?', [idpai], function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result[0].count > 0);
            }
        });
    });
}


router.put('/alterar/:id', function (req, res) {

    try {

        if (!req.params.id) {
            return res.status(400).json({
                msg: 'ID não fornecido na requisição!'
            });
        }
        
        const { descricao, link, idpai, ordem, ativo } = req.body

        if (!descricao || !link || !idpai || !ordem || !ativo) {
            return res.status(400).json({
                msg: 'Preencha todos os campos.'
            });
        }


        conn.execute('SELECT * FROM tbMenu WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'ID fornecido não encontrado!'
                });
            }

            conn.execute('UPDATE tbMenu SET descricao = ?, link = ?, idPai = ?, ordem = ?, ativo = ? WHERE id = ?;',
            [req.body.descricao, req.body.link, req.body.idpai, req.body.ordem, req.body.ativo, req.params.id],
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

        conn.execute('SELECT * FROM tbMenu WHERE id = ?;', [req.params.id], function (err, response, fields) {
            if (err) throw err;

            if (response.length === 0) {
                return res.status(404).json({
                    msg: 'ID fornecido não encontrado!'
                });
            }

            conn.execute('DELETE FROM tbMenu WHERE id = ?;', [req.params.id], function (err, response, fields) {

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