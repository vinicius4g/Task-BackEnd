const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    //hash gerado sempre é diferente, porem é possivel saber se dois hashs foram gerados pela mesma origem
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }
    
    //funcao que ira salvar usuario no banco de dados
    const save = (req, res) => {
        obterHash(req.body.password, hash => {
            const password = hash

            app.db('users')
                .insert({ name: req.body.name, email: req.body.email, password})
                .then(_ => res.status(204).send()) //sucesso
                .catch(err => res.status(400).json(err)) //erro 
        })  
    }
    
    return { save }
}


