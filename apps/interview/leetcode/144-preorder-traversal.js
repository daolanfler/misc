/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    if (!root) return [];
    let result = [];
    let stack = [root];

    while (stack.length) {
        const current = stack.pop();
        result.push(current.val);
        // pre-order 是 root => left => right 的顺序，所以 right 要先入栈
        if (current.right) stack.push(current.right);
        if (current.left) stack.push(current.left);
    }
    return result;
};

// https://leetcode-cn.com/problems/binary-tree-preorder-traversal/
