import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DB_NAME}`)
        console.log(`\n MongoDB connected DB Host: ${connectionInstance.connect.host}`)
    } catch (err) {
        console.log("MongoDB connection failed", err)
        process.exit(1)  
    }
}

export default connectDB