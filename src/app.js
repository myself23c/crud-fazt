import express from 'express'
import morgan from 'morgan'
import router from './routers/auth.routers.js'
import taskRoutes from './routers/task.routers.js'
import cookieParser from 'cookie-parser'
import cors from "cors"
import fileRoutes from './routers/file.routers.js'
import startCrawling from './routers/crawlerPlaywright.routers.js'
import crawlerDB from './routers/crawlerDB.routers.js'
import twitterCrawler from "./routers/twitterCrawler.routers.js"
import bodyParser from 'body-parser'
import redditCrawler from "./routers/redditCrawler.routers.js"
import videoStreaming from "./routers/videoStreaming.routers.js"
import musicStreaming from "./routers/musicStreaming.routers.js"


const app = express()

app.use(cors({
    origin: "*",
    credentials: true
    
}))

app.use(bodyParser.json());
app.use(cookieParser())
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use("/api", router)
app.use("/api", taskRoutes)
app.use('/api', fileRoutes)
app.use('/api', startCrawling)
app.use('/api', crawlerDB)
app.use('/api', twitterCrawler)
app.use('/api', redditCrawler)
app.use('/api', videoStreaming)
app.use('/api', musicStreaming);

export default app

