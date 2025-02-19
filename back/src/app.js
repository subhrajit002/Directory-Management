import express, { json } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors());

app.use(express.json())
app.use(cookieParser())


import authRouter from "./routes/auth.routes.js"
import businessRouter from "./routes/bussiness.routes.js"

app.use("/api/auth", authRouter)
app.use("/api/business", businessRouter)

export { app }