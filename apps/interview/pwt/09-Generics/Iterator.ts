export class BinaryTreeNode<T> {
  left: BinaryTreeNode<T>;
  right: BinaryTreeNode<T>;
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

class LinkedListNode<T> implements Iterable<T> {
  value: T;
  next: LinkedListNode<T>;

  constructor(value: T) {
    this.value = value;
  }
  [Symbol.iterator](): Iterator<T> {
    return linkedListGenerator(this);
  }
}

class LinkedListIterator<T> implements Iterator<T>, Iterable<T> {
  private head: LinkedListNode<T>;
  private current: LinkedListNode<T>;

  constructor(head: LinkedListNode<T>) {
    this.head = head;
    this.current = head;
  }

  next(): IteratorResult<T> {
    if (!this.current) {
      return { value: undefined, done: true };
    }
    const result = this.current.value;
    this.current = this.current.next;
    return {
      value: result,
      done: false,
    };
  }

  [Symbol.iterator](): Iterator<T> {
    return this;
  }
}

const head: LinkedListNode<string> = new LinkedListNode("hello");
head.next = new LinkedListNode("world");
head.next.next = new LinkedListNode("!!!");

const linkedIter = new LinkedListIterator(head);

for (const node of linkedIter) {
  console.log(node);
}

// 生成器实现
function* linkedListGenerator<T>(head: LinkedListNode<T>): IterableIterator<T> {
  let current: LinkedListNode<T> | undefined = head;

  while (current) {
    yield current.value;
    current = current.next;
  }
}

const linkedIter2 = linkedListGenerator(head);
for (const str of linkedIter2) {
  console.log(str);
}

// 生成器实现 二叉树中序遍历迭代器
export function* binaryTreeGen<T>(root: BinaryTreeNode<T>): IterableIterator<T> {
  if (root.left !== undefined) {
    for (const value of binaryTreeGen(root.left)) {
      yield value;
    }
  }
  yield root.value;

  if (root.right !== undefined) {
    for (const value of binaryTreeGen(root.right)) {
      yield value;
    }
  }
}

const root = new BinaryTreeNode(5);
root.left = new BinaryTreeNode(3);
root.right = new BinaryTreeNode(6);
root.left.left = new BinaryTreeNode(2);
root.left.right = new BinaryTreeNode(4);
root.left.left.left = new BinaryTreeNode(1);

for (const num of binaryTreeGen(root)) {
  console.log(num);
}
// 1 2 3 4 5 6
