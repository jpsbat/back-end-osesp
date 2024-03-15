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

router.post('/login', (req, res) => {
    const { login, senha } = req.body;
    
    if (!login || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
  
    const query = 'SELECT * FROM tbUsuario WHERE login = ? AND senha = ?';
    conn.query(query, [login, senha], (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length === 0) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }
      res.status(200).json({ message: 'Login bem-sucedido' });
    });
});

router.post('/login', function (req, res) {
    try {
        const { login, senha } = req.body;

        if (!login || !senha) {
            return res.status(400).json({ msg: 'Campos obrigatórios não preenchidos' });
        }

        conn.execute('SELECT * FROM tbUsuario WHERE login = ? AND senha = ?;', [login, senha], function (err, response, fields) {
            if (err) {
                return res.status(500).json({ msg: 'Erro ao tentar fazer login', error: err });
            }

            if (response.length === 0) {
                return res.status(401).json({ msg: 'Email ou senha incorretos' });
            }

            res.status(200).json({ msg: 'Login bem-sucedido', data: response[0] });
        });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao tentar fazer login', error: error });
    }
});

router.put('/alterar/:id', function (req, res) {

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

            conn.execute('UPDATE tbUsuario SET nome = ?, login = ?, senha = ?, idPermissaoAcesso = ?, ativo = ? WHERE id = ?;',
            [req.body.nome, req.body.login, req.body.senha, req.body.idperfilusuario, req.body.ativo, req.params.id],
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