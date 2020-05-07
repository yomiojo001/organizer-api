const express = require('express');
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer');
const sharp = require('sharp');
const {sendWelcomeEmail} = require('../email/account')
const {sendCancellationMail} = require('../email/account')
const router = new express.Router()



router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try{
        const user = await User.findOne({_id})
        res.send(user);
        if(!user){
          return  res.status(404).send()
        }
    }catch(e){
        res.status(500).send(e)
    }

})


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthenticationToken()
        res.status(201).send({ user, token })
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) =>{
    try{
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthenticationToken()
    
    res.send({user, token})

    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()

    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = []

        await req.user.save()

        res.send()

    }catch(e){
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isUpdateValidate = updates.every((update) => allowedUpdates.includes(update))

    if(!isUpdateValidate){
        res.status(400).send({error:'Invalid Update!'})
    }


    try{
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        
        const user = await req.user
        
        updates.forEach((update) => user[update] = req.body[update])

        await user.save()
        
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) =>{

    try{
        await req.user.remove()
        sendCancellationMail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be an image'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250 }).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    try{
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router