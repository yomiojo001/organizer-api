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

 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})


const Task = require('./models/task');
const User = require('./models/user')

const main = async() => {

    // const task = await Task.findById('5ea1a11115272001f42ac765')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner);

    // const user = await User.findById('5ea1a01f2da4323454799291')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks);
    

    
}

main()