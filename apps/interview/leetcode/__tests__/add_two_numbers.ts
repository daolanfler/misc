// 2. 两数相加
// 中等
// 9.9K
// 相关企业
// 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

// 请你将两个数相加，并以相同形式返回一个表示和的链表。

// 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

// 示例 1：

// 输入：l1 = [2,4,3], l2 = [5,6,4]
// 输出：[7,0,8]
// 解释：342 + 465 = 807.
// 示例 2：

// 输入：l1 = [0], l2 = [0]
// 输出：[0]
// 示例 3：

// 输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
// 输出：[8,9,9,9,0,0,0,1]

// 提示：

// 每个链表中的节点数在范围 [1, 100] 内
// 0 <= Node.val <= 9
// 题目数据保证列表表示的数字不含前导零

class ListNode<T> {
  val: T;
  next: ListNode<T> | null;

  constructor(val: T) {
    this.val = val;
    this.next = null;
  }
}

function addTwoNumbers(
  l1: ListNode<number> | null,
  l2: ListNode<number> | null
): ListNode<number> | null {
  const head = new ListNode(0);
  let carry = 0;
  let curr = head;

  while (l1 || l2) {
    const a = l1 ? l1.val : 0;
    const b = l2 ? l2.val : 0;
    const sum = a + b + carry;
    carry = Math.floor(sum / 10);
    curr.next = new ListNode(sum % 10);
    curr = curr.next;
    l1 = l1 && l1.next;
    l2 = l2 && l2.next;
  }
  if (carry) {
    curr.next = new ListNode(carry);
  }
  return head.next;
}

function buildListNode(nums: number[]): ListNode<number> | null {
  if (!nums.length) return null;
  const head = new ListNode(nums[0]);
  let prev = head;
  for (let i = 1; i < nums.length; i++) {
    prev.next = new ListNode(nums[i]);
    prev = prev.next;
  }
  return head;
}

it('case 1: ', () => {
  const res = addTwoNumbers(buildListNode([2, 4, 3]), buildListNode([5, 6, 4]));

  expect(res).toEqual(buildListNode([7, 0, 8]));
});

it('case 2: ', () => {
  const res = addTwoNumbers(buildListNode([0]), buildListNode([0]));

  expect(res).toEqual(buildListNode([0]));
});

it('case 2: ', () => {
  const res = addTwoNumbers(
    buildListNode([9, 9, 9, 9, 9, 9, 9]),
    buildListNode([9, 9, 9, 9])
  );

  expect(res).toEqual(buildListNode([8, 9, 9, 9, 0, 0, 0, 1]));
});
