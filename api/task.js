const moment = require('moment')

module.exports = app => {
    const getTasks = (req, res) => {
        const date = req.query.date ? req.query.date
            : moment().endOf('day').toDate()

            app.db('tasks')
                .where( { userId: req.user.id }) //o passport coloca o usario dentro da requisao a partir do token
                .where('estimateAt', '<=', date)
                .orderBy('estimateAt')
                .then(tasks => res.json(tasks)) //vai gerar uma resposta pra requisao que foi recebida na getTasks
                .catch(err => res.status(400).json(err)) //envia mensagem de erro caso ocorra
    }

    const save = (req, res) => {
        if (!req.body.desc.trim()) {
            return res.status(400).send('Descrição é um campo obrigatório')
        }

        req.body.userId = req.user.id //recuperando o id do usuario (token)

        app.db('tasks') //acessando a tabela tasks
            .insert(req.body)
            .then(_ => res.status(204).send()) //sucesso
            .catch(err => res.status(400).json(err)) //erro 
    }

    const remove = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id }) //pegando o id da task pelo params que vem na url, e o id do usuario que esta logado no momento
            .del() //delete
            .then(rowsDeleted => { //pegar quantidade de linhas que foram deletas, no caso so ira excluir uma linha, pois  cada task possui um id unico, excluindo uma por vez
                if(rowsDeleted > 0) {
                    res.status(204).send()
                }
                else {
                    const msg = `Não foi encontrada a task com id ${req.params.id}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err)) //erro, caso naode certo o acesso ao .then()
    }

    //funcao alternar o estado da propriedade doneAt, sera acessada da funcao toggleTask
    const updateTaskDoneAt = (req, res, doneAt) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id})
            .update({ doneAt })
            .then(_ => res.status(204).send())//sucesso
            .catch(err => res.status(400).json(err)) //erro 
    }
     
    const toggleTask = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {
                if(!task) {
                    const msg = `Task com id ${req.params.id} não encontrada`
                    res.status(400).send(msg)
                }

                const doneAt = task.doneAt ? null : new Date()
                updateTaskDoneAt(req, res, doneAt)
            })
            .catch(err => res.status(400).json(err))
    }

    return { getTasks, save, remove, toggleTask }

}