// 94. 二叉树的中序遍历
// 简单
// 1.9K
// 相关企业
// 给定一个二叉树的根节点 root ，返回 它的 中序 遍历 。

// 示例 1：

// 输入：root = [1,null,2,3]
// 输出：[1,3,2]
// 示例 2：

// 输入：root = []
// 输出：[]
// 示例 3：

// 输入：root = [1]
// 输出：[1]

// 提示：

// 树中节点数目在范围 [0, 100] 内
// -100 <= Node.val <= 100

// 进阶: 递归算法很简单，你可以通过迭代算法完成吗？

interface TreeNode<T> {
    val: T;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;
}

function dfs(root: TreeNode<number> | null, path: number[] = []) {
    if (!root) return path;

    dfs(root.left);
    path.push(root.val);
    dfs(root.right);
    return path;
}

function inorderTraversal(root: TreeNode<number> | null): number[] {
    let result: number[] = [];
    let stack: TreeNode<number>[] = [];

    while (root || stack.length) {
        if (root) {
            stack.push(root);
            root = root.left;
        } else {
            const item = stack.pop() as TreeNode<number>;
            result.push(item.val);
            root = item.right;
        }
    }
    return result;
}
