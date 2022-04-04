export const isString = (val) => typeof val === "string";
export const isObject = (val) => typeof val === "object" && val !== null;
export const isArray = (val) => Array.isArray(val);

export function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
// [2,3,1,-1]

export function getSequence(nums) {
  // https://juejin.cn/post/6937243374453784613
  // 前驱节点，存放当前插入或新增项的前一项在 nums 中的索引
  // 贪心确保了结果长度的准确
  // 插入或新增的时候，永远比前一项的值大，保证了结果的准确
  const prevIndex = nums.slice();
  const result = [0];
  let i, last, start, end, middle;

  const len = nums.length;
  for (i = 0; i < len; i++) {
    const current = nums[i];
    if (current !== 0) {
      last = result[result.length - 1];
      if (nums[last] < current) {
        prevIndex[i] = last;
        result.push(i);
        continue;
      }
      // 当前项小于最后一项，二分法查找
      start = 0;
      end = result.length - 1;
      while (start < end) {
        middle = ((start + end) / 2) | 0;
        if (nums[result[middle]] < current) {
          start = middle + 1;
        } else {
          end = middle;
        }
      }
      // 替换 result 中第一个比 current 大的项
      if (current < nums[result[start]]) {
        if (start > 0) {
          prevIndex[i] = result[start - 1];
        }
        result[start] = i;
      }
    }
  }

  let pivot = result.length;
  let prev = result[pivot - 1];
  while (pivot-- > 0) {
    // 根据前驱节点一个个向前查找
    result[pivot] = prev;
    prev = prevIndex[result[pivot]];
  }
  return result;
}
