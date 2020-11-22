import express from "express";
import 'express-async-errors'
import { json } from "body-parser";

import cookieSession from 'cookie-session'

import {currentUserRouter} from './routes/current-user'
import {signinRouter} from './routes/signin'
import {signupRouter} from './routes/signup'
import {signoutRouter} from './routes/signout'

import {errorHandler} from '@myshtickets/common'
import {NotFoundError} from '@myshtickets/common'
const app = express();
app.set('trust proxy',true) // because the traffic is proxied from ingress nginx, express will by default say its not trusting it 
app.use(json());
app.use(
  cookieSession({
    signed: false,
    //secure: true  // requires ssl connection
    secure: process.env.NODE_ENV !== 'test'
  })
)

app.use(currentUserRouter) 
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)
app.all('*', ()=>{throw new NotFoundError()})

app.use(errorHandler)

export {app}