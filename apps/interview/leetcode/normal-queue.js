// 普通队列的实现
class MyQueue {
    constructor() {
        this.head = 0;
        this.tail = -1;
        this.data = [];
    }
    enQueue(x) {
        this.data.push(x);
        this.tail++;
        return true;
    }
    deQueue() {
        if (this.isEmpty) {
            return false;
        }
        this.head++;
    }
    get front() {
        return this.isEmpty ? undefined : this.data[this.head];
    }
    get isEmpty() {
        return this.head >= this.data.length;
    }
    get rear() {
        return this.isEmpty ? undefined : this.data[this.tail];
    }
}

let q = new MyQueue();
q.enQueue(5);
q.enQueue(3);
console.log(q.front, q.rear);

q.deQueue();
console.log(q.front, q.rear);

q.deQueue();
console.log(q.front, q.rear);
