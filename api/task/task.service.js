
const dbService = require('../../services/db.service')
const externalService = require('../../services/external.service');
const queueService = require('../../services/queue.service')
const socketService = require('../socket/socket.routes');
const ObjectId = require('mongodb').ObjectId;

//setTimeout(()=>{setInterval(runTask, 2000)}, 2000);
runTask()

async function query(criteria = {}) {
    const collection = await dbService.getCollection('task')
    try {
        const tasks = await collection.find(criteria).toArray();
        return tasks;
    } catch (err) {
        console.log('ERROR: cannot find tasks');
        throw err;
    }
}

async function get() {
    const collection = await dbService.getCollection('task')
    try {
        return collection.find().toArray();
    }
    catch (err) {
        console.log('Couldn\'t get tasks');
        throw err;
    }
}

async function getById(id) {
    const collection = await dbService.getCollection('task')
    try {
        return collection.findOne({ "_id": ObjectId(id) });
    } catch (err) {
        console.log(`ERROR: while finding task ${id}, ${err}`);
        throw err;
    }
}

async function update(task) {
    const collection = await dbService.getCollection('task');
    const id = task._id;
    delete task._id;
    try {
        await collection.updateOne(
            { "_id": ObjectId(id) },
            { $set: task },
            {
                "upsert": false
            });
        return task;
    }
    catch (err) {
        console.log(`ERROR: cannot update task ${id}`);
        throw err;
    }
}

async function remove(taskId) {
    const collection = await dbService.getCollection('task')
    try {
        await collection.deleteOne({ "_id": ObjectId(taskId) });
    } catch (err) {
        console.log(`ERROR: cannot remove task ${taskId}`);
        throw err;
    }
}


async function add(task) {
    const collection = await dbService.getCollection('task');
    const addedTask = { ...task, createdAt: Date.now(), done: false };
    try {
        await collection.insertOne(addedTask);
        return addedTask;
    } catch (err) {
        console.log(`ERROR: cannot insert task`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    return criteria;
}

async function perform(id) {
    var task = null;
    try {
        task = await getById(id);
        await externalService.execute();
        task.done = true;
        task.doneAt = Date.now();
        console.log('after external:', task);


    } catch (error) { // update task for error 
        console.log('error');
        task.lastTriedAt = Date.now();
        task.done = false;
    } finally { // more updates for task 
        console.log('finally');
        task.triesCount = task.triesCount ? task.triesCount + 1 : 1;
        update(task);
        socketService.getIO().emit('task done', task._id);
        return task;
    }

}
async function runTask() {
    const tasks = await query({ done: false });
    if (tasks.length === 0) return;
    const queue = queueService.createQueue();
    tasks.map(task => queue.enqueue(task));
    console.log(queue.printQueue());
    const taskToRun = queue.dequeue();
    console.log('task to run:', taskToRun.title);
    perform(taskToRun._id);
}


async function undoAll() {
    try {
        const tasks = await query({ done: true });
        tasks.map(async (task) =>
            await update({ ...task, done: false })
        )
    }
    catch (err) {
        console.log(`ERROR: cannot undo tasks, `, err)
        throw err;
    }
}

module.exports = {
    get,
    getById,
    update,
    query,
    remove,
    add,
    perform,
    undoAll
}


