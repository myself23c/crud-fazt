import express from 'express'
import morgan from 'morgan'
import router from './routers/auth.routers.js'
import taskRoutes from './routers/task.routers.js'
import cookieParser from 'cookie-parser'


const app = express()


app.use(cookieParser())
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use("/api", router)
app.use("/api", taskRoutes )

export default app

