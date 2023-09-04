// 1162. 地图分析
// 提示
// 中等
// 346
// 相关企业
// 你现在手里有一份大小为 n x n 的 网格 grid，上面的每个 单元格 都用 0 和 1 标记好了。其中 0 代表海洋，1 代表陆地。

// 请你找出一个海洋单元格，这个海洋单元格到离它最近的陆地单元格的距离是最大的，并返回该距离。如果网格上只有陆地或者海洋，请返回 -1。

// 我们这里说的距离是「曼哈顿距离」（ Manhattan Distance）：(x0, y0) 和 (x1, y1) 这两个单元格之间的距离是 |x0 - x1| + |y0 - y1| 。

// 示例 1：

// 输入：grid = [[1,0,1],[0,0,0],[1,0,1]]
// 输出：2
// 解释：
// 海洋单元格 (1, 1) 和所有陆地单元格之间的距离都达到最大，最大距离为 2。
// 示例 2：

// 输入：grid = [[1,0,0],[0,0,0],[0,0,0]]
// 输出：4
// 解释：
// 海洋单元格 (2, 2) 和所有陆地单元格之间的距离都达到最大，最大距离为 4。

// 提示：

// n == grid.length
// n == grid[i].length
// 1 <= n <= 100
// grid[i][j] 不是 0 就是 1

function maxDistance(grid: number[][]): number {
    const queue: [number, number][] = []; // row, col

    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[0].length; ++j) {
            if (grid[i][j] === 1) {
                queue.push([i, j]);
            }
        }
    }

    if (queue.length === 0 || queue.length === grid.length * grid[0].length) {
        return -1;
    }

    const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ];

    let distance = -1;
    while (queue.length) {
        distance++;
        const size = queue.length;
        for (let i = 0; i < size; ++i) {
            const p = queue.shift() as [number, number];

            for (let dir of dirs) {
                const [dy, dx] = dir;
                const ny = p[0] + dy;
                const nx = p[1] + dx;

                if (
                    ny < 0 ||
                    ny >= grid.length ||
                    nx < 0 ||
                    nx >= grid[0].length
                )
                    continue;
                if (grid[ny][nx] == 0) {
                    grid[ny][nx] = 2;
                    queue.push([ny, nx]);
                }
            }
        }
    }

    return distance;
}

it('case 1', () => {
    expect(
        maxDistance([
            [1, 0, 1],
            [0, 0, 0],
            [1, 0, 1],
        ])
    ).toBe(2);
});
