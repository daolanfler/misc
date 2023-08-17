// 102. 二叉树的层序遍历
// 中等
// 1.8K
// 相关企业
// 给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。

// 示例 1：

// 输入：root = [3,9,20,null,null,15,7]
// 输出：[[3],[9,20],[15,7]]
// 示例 2：

// 输入：root = [1]
// 输出：[[1]]
// 示例 3：

// 输入：root = []
// 输出：[]

// 提示：

// 树中节点数目在范围 [0, 2000] 内
// -1000 <= Node.val <= 1000

export type BinaryNode<T> = {
  left: BinaryNode<T> | null;
  right: BinaryNode<T> | null;
  value: T;
};

function levelOrder(root: BinaryNode<number> | null): number[][] {
  if (!root) return [];
  let queue = [root];
  let result: number[][] = [];

  while (queue.length) {
    const size = queue.length;
    let vals: number[] = [];
    for (let i=0;i<size;++i) {
      const item = queue.shift() as BinaryNode<number>;
      vals.push(item.value);
      item.left && queue.push(item.left)
      item.right && queue.push(item.right)
    }

    result.push(vals);
  }
  return result;
}

it('dummy', () => {
  // 
});
