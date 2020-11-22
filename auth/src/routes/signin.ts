import express,{Request,Response} from 'express';
import {body} from 'express-validator'
import {validateRequest} from '@myshtickets/common'

import jwt from 'jsonwebtoken'
import {User} from '../models/user'

import {BadRequestError} from '@myshtickets/common'

import {Password} from '../services/password'
const router = express.Router();

router.post('/api/users/signin',[
  body('email')
  .isEmail()
  .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password not provided')
], validateRequest, async (req:Request,res:Response)=>{
 
   const {email, password} = req.body
   const existingUser = await User.findOne({email})
   if (!existingUser){
      throw new BadRequestError('Invalid creditionals')
   }
   
   const passwordMatch = await Password.compare(existingUser.password, password)
   if (!passwordMatch){
      throw new BadRequestError('Invalid creditionals')
   }
 
   // generate jwt 
      const userJwt  = jwt.sign({
        id: existingUser.id,
        email: existingUser.email},
        process.env.JWT_KEY! // ! will tell TS that we know the var is defined
      )

    // store on sessioexistingU obj (goes to cookie)
      req.session = {jwt:userJwt}

      res.status(200).send(existingUser)


 });

export {router as signinRouter};