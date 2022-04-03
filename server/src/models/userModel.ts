import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { createTokens } from '../helpers/auth';
const { Schema } = mongoose;

export interface IUser {
  _id: mongoose.ObjectId
  email: string
  firstName: string
  lastName: string
  totalGames: number
  totalWins: number
  password: string
  authCount: number
}

// methods are part of document
export interface IUserDocument extends IUser, Document {
  generateAuthTokens: () => Promise<{ refreshToken: string , accessToken: string }>
}

// statics are part of model
export interface IUserModel extends mongoose.Model<IUserDocument> {
  findByCredentials: (email: string, password: string) => Promise<IUserDocument>;
}

const userSchema: mongoose.Schema<IUserDocument> = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value: string){
        if(!validator.isEmail(value)){
             throw new Error('Email is invalid')
          }
     }
 },
  firstName: String,
  lastName: String,
  totalGames: { type: Schema.Types.Number, default: 0 },
  totalWins: { type: Schema.Types.Number, default: 0 },
  authCount: { type: Schema.Types.Number, default: 0 },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    validate(value: string) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "Password"')
      }
    }
  }
});

// Encrypt user password when saved
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

// Get login token
userSchema.methods.generateAuthTokens = async function (): Promise<{ refreshToken: string , accessToken: string }> {
  const user = this as IUserDocument
  const tokens = createTokens(user)
  // user.tokens = user.tokens.concat({ token })
  // await user.save()
  return tokens
}

// Find user account
userSchema.statics.findByCredentials = async function (email: string, password: string): Promise<IUserDocument> {
  const user = await User.findOne({ email })
  if(!user) {
      throw new Error('Unable to Signin')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) {
       throw new Error('Unable to Signin')
  }
  return user
}

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema)

