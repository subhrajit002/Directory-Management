import { app } from "./app.js";
import dotenv from "dotenv";
import { dbConnect } from "./db/db_connect.js";

dotenv.config({
    path: "./.env"
})

dbConnect()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running ar port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("server is not running", error)
    })
