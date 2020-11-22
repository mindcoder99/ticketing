import express from "express";
import 'express-async-errors'
import { json } from "body-parser";

import cookieSession from 'cookie-session'
 
import {errorHandler} from '@myshtickets/common'
import {NotFoundError, currentUser} from '@myshtickets/common'

import {createTicketRouter} from './routes/new'
import {showTicketRouter} from './routes/show'
import {indexTicketRouter} from './routes/index'
import {updateTicketRouter} from './routes/update'

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
 
app.use(currentUser)

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)


app.all('*', ()=>{throw new NotFoundError()})

app.use(errorHandler)

export {app}