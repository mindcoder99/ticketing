import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import {app} from '../app'
import request from 'supertest'

import jwt from 'jsonwebtoken'
declare global{
    namespace NodeJS{
        interface Global{
            signin(id?:string): string[];
        }
    }
}
jest.mock('../nats-wrapper')

process.env.STRIPE_KEY='sk_test_51HpUsPLPjEPqiltcPfsPKuQh7g7j68890XLGD128WnEf7m9uZG5ML95TAu8zkDXfLu6klyZ8SDQXHJSiBXsd83sX00u7tDQRsT'

let mongo: any
beforeAll(async()=>{
    process.env.JWT_KEY = 'asdfasdf'
     mongo = new MongoMemoryServer()
    const mongoUri=await mongo.getUri()
    await mongoose.connect(mongoUri,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach(async ()=>{
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections){
      await collection.deleteMany({})
  }
})

afterAll(async ()=>{
    await mongo.stop()
    await mongoose.connection.close()
})

// global.signin = ()=>{
//  // build jwt payload {id, email}
//  const payload ={
//      id: '123a123',
//      email: 'test@test.com',
//  }
//  // create JWT
   
//    const token = jwt.sign(payload,process.env.JWT_KEY!)

//  // build session object {jwt: my_jwt}
//     const session = {jwt:token}

//  // turn that session to json

//    const sessionJSON = JSON.stringify(session)
//  // json -> encode as base64
//    const base64 = Buffer.from(sessionJSON).toString('base64')
//  // return a string that the cookie
  
//    return [`express:sess=${base64}`]  // supertest requires things to be in array

// }


global.signin = (id?:string) => {
    // Build a JWT payload.  { id, email }
    const payload = {
      id: id || new mongoose.Types.ObjectId().toHexString(),
      email: 'test@test.com',
    };
  
    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);
  
    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };
  
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
  
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
  
    // return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
  };