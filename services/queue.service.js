module.exports = {createQueue};
function createQueue() {
    const queue = [];
    return {
        enqueue(task) {
            var contain = false;
            for (var i = 0; i < queue.length; i++) {
                if ((queue[i].importance < task.importance) || (queue[i].importance === task.importance && queue[i].triesCount > task.triesCount)) {
                    queue.splice(i, 0, task);
                    contain = true;
                    break;
                }
            }

            if (!contain) {
                queue.push(task);
            } 
        },
        dequeue() {
            if (this.isEmpty())
                return "Underflow";
            return queue.shift(); 
        },
        front() {
            if (this.isEmpty())
                return "No elements in Queue";
            return queue[0];
        },
        rear() {
            if (this.isEmpty())
                return "No elements in Queue";
            return queue[queue.length - 1];
        },
        get length() {
            return queue.length;
        },
        isEmpty() {
            return queue.length === 0;
        },
        printQueue() {
            var str = "";
            console.log('queue length:', queue.length);
            for (var i = 0; i < queue.length; i++)
                str += queue[i].title + " ";
            return str;
        } 
    }
}
