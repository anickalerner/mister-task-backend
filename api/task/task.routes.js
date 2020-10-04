const express = require('express')
//const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const { addTask, getTasks, getTask, updateTask, deleteTask, performTask, undoTasks} = require('./task.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/:id', getTask)
router.get('/', getTasks)
router.post('/', addTask)
router.put('/:id/start', performTask)
router.put('/undo', undoTasks)
router.put('/', updateTask)
router.delete('/:id', deleteTask)

// router.post('/',  requireAuth, addTask)
// router.delete('/:id',  requireAuth, deleteTask)

module.exports = router