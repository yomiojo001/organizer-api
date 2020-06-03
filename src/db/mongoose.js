const mongoose = require('mongoose');

mongoose.connect( process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: false, useCreateIndex: true, useFindAndModify: false})

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value){
//             if(!validator.isEmail(value)) {
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     password:{
//         type: String,
//         required: true,
//         trim: true,
//         validate(value){
//             if(!validator.isLength(value, {min:6})){
//                 throw new Error ('Password must be greater than 6 characters!');
//             }else if(value.toLowercase().includes("password")){
//                 throw new Error("You can't include password in the text field!")
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value){
//             if(value < 0){
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     }
// })

// const me = new User (
//     {
//         name: 'Joecole',
//         email: 'cheack@qwerty.io',
//         password: "eweq",
//         age: 43
//     }
// )

// me.save().then((result) => {
//     console.log(result);
// } ).catch((error) => {console.log("Error", error)}
// )


// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     completed:{
//         type: Boolean,
//         default: false
//     }
// })



