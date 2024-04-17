import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, 'Email Already exists'],
      required: [true, 'Email is Required'],
    },
    username: {
      type: String,
      required: [true, 'Ussername is required'],
    },
    image: {
      type: String,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
  },
  {
    timestamps: true,
  }
)

const User = models.User || model('User', UserSchema)

export default User
