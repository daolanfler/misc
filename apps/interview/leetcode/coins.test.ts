// 当面对硬币找零问题时，动态规划（Dynamic Programming，DP）也是一个有效的方法。你可以使用一个数组来记录从1元到目标金额n的每个金额所需要的最少硬币数量。

// 以下是使用动态规划解决硬币找零问题的示例代码，同样以Python为例：

// ```python
// def min_coins_dp(n, coins):
//     dp = [float('inf')] * (n + 1)
//     dp[0] = 0

//     for i in range(1, n + 1):
//         for coin in coins:
//             if i >= coin:
//                 dp[i] = min(dp[i], dp[i - coin] + 1)

//     return dp[n]

// n = int(input("请输入要组成的金额："))
// coins = [1, 2, 5]  # 可用的硬币面值
// result = min_coins_dp(n, coins)
// print(f"需要最少{result}枚硬币来组成{n}元。")
// ```

// 这个代码片段中，`dp[i]`表示组成金额i所需要的最少硬币数量。通过遍历每个金额和每个硬币面值，我们可以计算出最少硬币数量。最终，`dp[n]`就是我们需要的结果，即组成目标金额n所需要的最少硬币数量。

// 使用动态规划，你可以更灵活地解决各种硬币找零问题，包括不同面值的硬币组合以及更复杂的情况。

function dp(n: number) {
    const coins = new Set([1, 4, 5, 11]);
    const prev = new Array(n + 1).fill(Infinity);
    prev[0] = 0;

    for (let i = 1; i <= n; ++i) {
        for (const coin of coins) {
            if (i >= coin) {
                prev[i] = Math.min(prev[i], prev[i - coin] + 1);
            }
        }
    }
    return prev[n];
}

it('12 should be 3: ', () => {
    expect(dp(12)).toBe(2);
});

it('10 should be 2: ', () => {
    expect(dp(10)).toBe(2);
});

it('11 should be 3: ', () => {
    expect(dp(11)).toBe(1);
});
