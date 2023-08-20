// 145. 二叉树的后序遍历
// 简单
// 1.1K
// 相关企业
// 给你一棵二叉树的根节点 root ，返回其节点值的 后序遍历 。

 

// 示例 1：


// 输入：root = [1,null,2,3]
// 输出：[3,2,1]
// 示例 2：

// 输入：root = []
// 输出：[]
// 示例 3：

// 输入：root = [1]
// 输出：[1]
 

// 提示：

// 树中节点的数目在范围 [0, 100] 内
// -100 <= Node.val <= 100
 

// 进阶：递归算法很简单，你可以通过迭代算法完成吗？

// https://leetcode.cn/problems/binary-tree-postorder-traversal/

interface TreeNode<T> {
    val: T;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;
}

function post_order_iterate(root: TreeNode<number> | null): number[] {
    if (!root) return [];

    const stack = [root];
    const result: number[] = [];

    while (stack.length) {
        const root = stack.pop() as TreeNode<number>;
        result.unshift(root.val);
        if (root.left) stack.push(root.left);
        if (root.right) stack.push(root.right);
    }
    return result;
}