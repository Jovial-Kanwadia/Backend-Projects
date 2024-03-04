import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DB_NAME}`)
        console.log(`\nMongoDB connected DB Host: ${connectionInstance.connect.host}`)
        console.log(`Database Name: ${process.env.DB_NAME}`)
    } catch (err) {
        console.log("MongoDB connection failed", err)
        process.exit(1)  
    }
}

export default connectDB