import request from 'supertest'
import {app} from '../../app'

it('returns a 201 on successful signup', async()=>{
    return request(app)
      .post('/api/users/signup')
      .send({
          email:'test@test.com',
          password: 'password'
      })
      .expect(201)
})

it('returns a 400 with an invalid email', async()=>{
    return request(app)
      .post('/api/users/signup')
      .send({
          email:'test1test.com',
          password: 'password'
      })
      .expect(400)
})

it('returns a 400 with an invalid password', async()=>{
    return request(app)
      .post('/api/users/signup')
      .send({
          email:'test1@test.com',
          password: ''
      })
      .expect(400)
})



it('returns a 400 with an invalid email and password', async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test1test.com',
        password: '1231231'
    })
    .expect(400)

    await request(app)
      .post('/api/users/signup')
      .send({
          email:'test1@test.com',
          password: 'sdf'
      })
      .expect(400)
})

it('it disallows duplicate emails', async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password: 'password'
    })
    .expect(201)

    await request(app)
      .post('/api/users/signup')
      .send({
          email:'test@test.com',
          password: 'password'
      })
      .expect(400)
})

it('sets a coockie after successful signup',async ()=>{
    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password: 'password'
    })
    .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
})

