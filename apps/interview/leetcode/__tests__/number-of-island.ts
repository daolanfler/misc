// https://www.geeksforgeeks.org/find-the-number-of-islands-using-dfs/

function isSafe(
    M: number[][],
    row: number,
    col: number,
    visited: boolean[][]
): boolean {
    if (row < 0 || row >= M.length) {
        return false;
    }
    if (col < 0 || row >= M[0].length) {
        return false;
    }

    if (visited[row][col]) {
        return false;
    }

    return M[row][col] === 1;
}

const rowNbr = [-1, -1, -1, 0, 0, 1, 1, 1];
const colNbr = [-1, 0, 1, -1, 1, -1, 0, 1];

function dfs(M: number[][], row: number, col: number, visited: boolean[][]) {
    visited[row][col] = true;

    for (let i = 0; i < 8; ++i) {
        if (isSafe(M, row + rowNbr[i], col + colNbr[i], visited)) {
            dfs(M, row + rowNbr[i], col + colNbr[i], visited);
        }
    }
}

function countIslands(M: number[][]): number {
    let count = 0;

    const visited: boolean[][] = [];
    for (let i = 0; i < M.length; ++i) {
        visited.push(new Array(M[0].length).fill(false));
    }

    for (let i = 0; i < M.length; ++i) {
        for (let j = 0; j < M[0].length; ++j) {
            if (M[i][j] === 1 && !visited[i][j]) {
                dfs(M, i, j, visited);
                count++;
            }
        }
    }

    return count;
}

it('works', () => {
    const M = [
        [1, 1, 0, 0, 0],
        [0, 1, 0, 0, 1],
        [1, 0, 0, 1, 1],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 1, 1],
    ];
    expect(countIslands(M)).toBe(4);
});
