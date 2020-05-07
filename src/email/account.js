const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)



const sendWelcomeEmail =( email,name) => {
    sgMail.send({
        to: email,
        from: 'dev@thecocktailsplace.com',
        subject: 'Test Welcome Mail',
        text: `Welcome to our app, ${name}`,
    }).then(() => {
        console.log('Message sent')
    })
    .catch((error) => {
        console.log(error.response.body)
        // console.log(error.response.body.errors[0].message)
    })
    }



const sendCancellationMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dev@thecocktailsplace.com',
        subject: 'Cancellation On Request',
        text: `${name} your account has now been cancelled on request, pls state the reason you are leaving to help improve our services.`
    }).then(()=> {
        return console.log('Message sent');
    }).catch((e) => console.log(e.response.body))
}




module.exports = {
    sendWelcomeEmail,
    sendCancellationMail
}