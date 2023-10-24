import Task from '../models/task.model.js'


export const getTasks = async (req,res)=>{
    const task = await Task.find({
        user: req.user.id
    }).populate("user")
    res.json(task)
}

export const createTask = async (req,res)=>{
    const {title,description,date} = req.body
    const newTask = new Task ({
        title,
        description,
        date,
        user: req.user.id
    })
    const taskSaved = await newTask.save()
    res.json(taskSaved)
}


export const getTask = async (req,res)=>{
    const task = await Task.findById(req.params.id)
    if(!task){return res.json({message: "no se enocontro la task buscada"})}
    res.json(task)
}

export const deleteTask = async (req,res)=>{
    const task = await Task.findByIdAndDelete(req.params.id)
    if(!task){return res.json({message: "no se enocontro la task buscada"})}
    res.json(task)
}


export const putTask = async (req,res)=>{
    const task = await Task.findByIdAndDelete(req.params.id, req.body, {
        new: true
    })
    if(!task){return res.json({message: "no se enocontro la task buscada"})}
    res.json(task)
}