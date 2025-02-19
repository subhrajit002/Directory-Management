import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"

const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`monog db connected: ${connection.connection.host} `)
    } catch (error) {
        console.log("database not connected", error)
        process.exit(1)
    }
}

export { dbConnect }