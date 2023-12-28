import express from 'express'
import morgan from 'morgan'
import router from './routers/auth.routers.js'
import taskRoutes from './routers/task.routers.js'
import cookieParser from 'cookie-parser'
import cors from "cors"


const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
    
}))
app.use(cookieParser())
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use("/api", router)
app.use("/api", taskRoutes )

export default app

