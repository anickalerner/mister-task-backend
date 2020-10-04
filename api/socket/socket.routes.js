
module.exports = {
    connectSockets,
    getIO
}
var gIO;
function connectSockets(io) {
    gIO = io;
    io.on('connection', socket => {

        socket.on('chat topic', topic => {
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic;
        })
        socket.on('task done', msg => {
            console.log(msg)
            // io.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            io.emit('chat addMsg', msg)
        })
    })
}

function getIO(){
    return gIO;
}