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
// var inorderTraversal = function(root) {
//     let result = []
//     let stack = []

//     while (root || stack.length) {
//         if (root) {
//             stack.push(root)
//             root = root.left
//         } else {
//             root = stack.pop()
//             result.push(root.val)
//             root = root.right
//         }
//     }

//     return result
// }

// in-order 是 left => root => right 的顺序
const inorderTraversal = root => {
  let result = [];
  if (!root) return result;
  let stack = [root];
  let current = root.left;

  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    let lastLeft = stack.pop();
    result.push(lastLeft.val);
    current = lastLeft.right;
  }
  return result;
};


// https://leetcode-cn.com/problems/binary-tree-inorder-traversal/
