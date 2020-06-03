const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase} = require('./fixtures/db')


beforeEach(setupDatabase)

test('Should user create account', async () => {
    const response = await request(app).post('/users').send({
        name: 'Steve',
        email: 'chris@tray.nm',
        password: 'cascade0987!'
    }).expect(201)

    // Assert that the database  was changed
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
})

test('Should user login', async () => {
   const response =  await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})


test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'qser@ad.ds',
        password: 'ddadd123$566d'
    }).expect(400)
})


test('Should get user profile', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get users profile if not authenticated', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()

})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar', async() => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update user fields', async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({name: 'Andre'})
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Andre')
})

test('Should update valid user fields', async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({location: 'turkey'})
    .expect(400)
})