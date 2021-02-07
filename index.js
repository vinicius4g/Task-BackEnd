const express = require('express')
const app = express()

//esse db sera o knex que esta exportado dentro de config/db (knex vai acessar o banco de dados)
const db = require('./config/db')

//ira ajudar a carregar todos os modulos
const consign = require('consign')

//sempre que ele for carregar um modulo ele passa app como parametro, pra todos os modulos que for carregar a partir do consign
consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js') //espera que middleware retornado seja uma funcao, pode passa arquivos ou pastas
    .then('./api') //ira cadastrar toda a parte da api que esta sendo carregado dentro de pasta api, dentro da api posso utilizar todas as funcoes ou metodos contidos nele
    .then('./config/routes.js') //acessar as rotas
    .into(app) //passa o app como parametro


//toda vez que fizer app.db consegue ter acesso ao knex, pra fazer insercoes, alteracoes, exclusoes
app.db = db


app.listen(3000, () => {
    console.log('Backend Executando...')
})