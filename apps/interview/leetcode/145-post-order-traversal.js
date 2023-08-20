/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * left => right => root
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function (root) {
    if (!root) return [];

    let result = [];
    let stack = [root];

    while (stack.length) {
        const current = stack.pop();
        result.unshift(current.val);

        if (current.left) stack.push(current.left);
        if (current.right) stack.push(current.right);
    }
    return result;
};

// https://leetcode-cn.com/problems/binary-tree-postorder-traversal/
