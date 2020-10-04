const logger = require('../../services/logger.service');
const taskService = require('./task.service')

async function getTasks(req, res) {
    try {
        const tasks = await taskService.get();
        res.send(tasks);
    } catch (err) {
        logger.error('Cannot get tasks', err);
        res.status(500).send({ error: 'cannot get tasks' })
    }
}

async function getTask(req, res) {
    try {
        const task = await taskService.getById(req.params.id);
        res.send(task);
    }
    catch (err) {
        logger.error('Cannot get task', err);
        res.status(500).send({ error: 'Cannot get task' })
    }
}

async function updateTask(req, res) {
    try {
        const task = await taskService.update(req.body);
        res.send(task);
    }
    catch (err) {
        logger.error('Cannot update task', err);
        res.status(500).send({ error: 'Cannot update task' });
    }
}

async function deleteTask(req, res) {
    try {
        await taskService.remove(req.params.id)
        res.end()
    } catch (err) {
        logger.error('Cannot delete task', err);
        res.status(500).send({ error: 'Cannot delete task' })
    }
}

async function addTask(req, res) {
    var task = req.body;
    task = await taskService.add(task)
    res.send(task)
}

async function performTask(req, res) {
    const id = req.params.id;
    const task = await taskService.perform(id);
    res.send(task);
}

async function undoTasks(req, res){
    const tasks = await taskService.undoAll();
    res.send(tasks);
}

module.exports = {
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    addTask,
    performTask,
    undoTasks
}