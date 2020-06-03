const express = require('express');
require('./db/mongoose');
const TaskRouter = require('./routers/task')
const UserRouter = require('./routers/user')


const app = express();
const port = process.env.PORT;


// app.use((req, res, next) => {
//         res.status(503).send('Maintenance mode!!!')
// })

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

 
module.exports = app
