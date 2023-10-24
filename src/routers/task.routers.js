import {Router} from 'express'
import {getTask,createTask,deleteTask,getTasks,putTask} from '../controllers/task.controolers.js'

import {authRequired} from '../middlewares/validateTokens.js'

const router = Router()

router.get("/tasks", authRequired, getTasks)

router.get("/tasks/:id", authRequired, getTask)

router.post("/tasks", authRequired, createTask)

router.delete("/tasks/:id", authRequired, deleteTask)


router.put("/tasks/:id", authRequired, putTask)

export default router