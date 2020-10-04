
module.exports = {
    connectSockets,
    getIO
}
var gIO;
function connectSockets(io) {
    gIO = io;
    io.on('connection', socket => {
        
        socket.on('task done', msg => {
            console.log(msg)
        })
    })
}

function getIO(){
    return gIO;
}