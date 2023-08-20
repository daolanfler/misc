// 144. 二叉树的前序遍历
// 简单
// 1.1K
// 相关企业
// 给你二叉树的根节点 root ，返回它节点值的 前序 遍历。

// 示例 1：

// 输入：root = [1,null,2,3]
// 输出：[1,2,3]
// 示例 2：

// 输入：root = []
// 输出：[]
// 示例 3：

// 输入：root = [1]
// 输出：[1]
// 示例 4：

// 输入：root = [1,2]
// 输出：[1,2]
// 示例 5：

// 输入：root = [1,null,2]
// 输出：[1,2]

// 提示：

// 树中节点数目在范围 [0, 100] 内
// -100 <= Node.val <= 100

// 进阶：递归算法很简单，你可以通过迭代算法完成吗？

// https://leetcode.cn/problems/binary-tree-preorder-traversal/

interface TreeNode<T> {
    val: T;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;
}

function preorder_iterate(root: TreeNode<number> | null) {
    if (!root) return [];
    const result: number[] = [];
    const stack: TreeNode<number>[] = [root];

    while (stack.length) {
        root = stack.pop() as TreeNode<number>;
        result.push(root.val);
        if (root.right) stack.push(root.right);
        if (root.left) stack.push(root.left);
    }
    return result;
}
