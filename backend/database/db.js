import mongoose from "mongoose"

const connectDB = async ()=>{
    try {
        let data = mongoose.connect(process.env.MONGO_URL)
        console.log("DATABASE CONNECTED")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB