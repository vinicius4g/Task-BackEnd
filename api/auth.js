const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs') //sera usado para comparar a senha que ira chegar do usario com a presente no banco de dados

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Dados incompletos')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).send()
                }

                const payload = { id: user.id } //payload vai ser o valor que sera armazenado dentro do token
                res.json({
                    name: user.name,
                    email: user.email,
                    token: jwt.encode(payload, authSecret),
                })
            })
        }
        else {
            res.status(400).send('Usuário não cadastrado!')
        }
    }

    return { signin }
}