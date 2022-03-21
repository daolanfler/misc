/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  const couple = {};
  for (let i = 0; i < nums.length; i++) {
    if (couple[nums[i]] !== undefined) {
      return [i, couple[nums[i]]];
    }
    couple[target - nums[i]] = i;
  }
};
