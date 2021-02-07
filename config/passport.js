const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //vai pegar o jwt de onde estiver, no caso veio do Header Bearer Token
    }

    const strategy = new Strategy(params, (payload,done) => {
        app.db('users') //acessando a tabela users
            .where({ id: payload.id }) //consulta para pegar o usuario pelo id
            .first() //pegando o primeiro usuario
            .then(user => { //se de forma bem sucedida obteve o usuario, vai cair nessa funcao com o usuario ja carregado
                if(user) {
                    done(null, { id: user.id, email: user.email }) // primeiro parametro é o erro, e o segundo é o usuario obtido
                }
                else { //usuario nao obtido
                    done(null, false) //resultado sera falso, significa que o usuario nao foi autenticado
                }
            })
            .catch(err => done(err, false)) //catch caso ocorra um erro na chamada ao banco de dados pelo .then()
    })
    
    passport.use(strategy)

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', { session: false }),
    }
}