import mongoose from 'mongoose'
import {Password} from '../services/password'

// An interface that describe properties that creates a new user

interface  UserAttrs{
    email: string,
    password: string
}

// an interface that describes properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
 build(attrs: UserAttrs): UserDoc
}

// an interface that describes the properotes of user documents 
interface UserDoc extends mongoose.Document {
  email: string,
  password: string
  //createdAt: 
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true
    }
}, {
  toJSON: {
    transform(doc,ret){
      ret.id = ret._id
      delete ret._id,
      delete ret.password, 
      delete ret.__v
    }
  }
}
)

userSchema.pre('save', async function(done){ //use function instead of ==> to make use of "this" refering to document not the class
  if (this.isModified('password')){  // re hash the password only if the password is changed
        const hashed = await Password.toHash(this.get('password'))
        this.set('password' ,hashed)
  }
  done() //al the ansyc work is done
})


userSchema.statics.build =  (attrs: UserAttrs)=>{
   return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User',userSchema)


export {User}