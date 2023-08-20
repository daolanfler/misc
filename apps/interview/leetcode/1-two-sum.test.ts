// 1. 两数之和
// 提示
// 简单
// 17.5K
// 相关企业
// 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

// 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

// 你可以按任意顺序返回答案。

 

// 示例 1：

// 输入：nums = [2,7,11,15], target = 9
// 输出：[0,1]
// 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
// 示例 2：

// 输入：nums = [3,2,4], target = 6
// 输出：[1,2]
// 示例 3：

// 输入：nums = [3,3], target = 6
// 输出：[0,1]
 

// 提示：

// 2 <= nums.length <= 104
// -109 <= nums[i] <= 109
// -109 <= target <= 109
// 只会存在一个有效答案
 

// 进阶：你可以想出一个时间复杂度小于 O(n2) 的算法吗？

function twoSum(nums: number[], target: number): number[] {

    const map = new Map<number, number>();

    for (let i = 0; i < nums.length; ++i) {
        if (map.get(target - nums[i]) !== undefined) {
            return [map.get(target - nums[i]) as number, i];
        }
        map.set(nums[i], i);

    }
    return [];
}

it("case 1: ", () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect([[0, 1], [1, 0]]).toContainEqual(twoSum([2, 7, 11, 15], 9));
});

it("case 2: ", () => {
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
});

it("case 2: ", () => {
    expect(twoSum([3, 3], 6)).toEqual([0, 1]);
});