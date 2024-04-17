import mongoose from 'mongoose'

let connected = false

const connectdDB = async () => {
  mongoose.set('strictQuery', true)

  //if the databadse is already connected, don't connect
  if (connected) {
    console.log('MongoDB is already connected...')
    return
  }

  //Connet to MongoDB

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    connected = true
    console.log('MongoDB connected')
  } catch (error) {
    console.log(error)
  }
}

export default connectdDB
