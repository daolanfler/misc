/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
  if (!root) return [];
  let result = [];
  let currentLevel = [root];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let values = [];
    let nextLevel = [];
    for (let i = 0; i < currentLevel.length; i++) {
      let node = currentLevel[i];
      values.push(node.val);
      node.left && nextLevel.push(node.left);
      node.right && nextLevel.push(node.right);
    }
    result.push(values);
    if (nextLevel.length === 0) {
      return result;
    }
    currentLevel = nextLevel;
  }
};

// https://leetcode-cn.com/problems/binary-tree-level-order-traversal/
