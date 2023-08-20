function extend<
    First extends Record<string, unknown>,
    Second extends Record<string, unknown>
>(first: First, second: Second): First & Second {
    const result: unknown = {};
    for (const prop in first) {
        if (Object.prototype.hasOwnProperty.call(first, prop)) {
            (<First>result)[prop] = first[prop];
        }
    }

    for (const prop in second) {
        if (Object.prototype.hasOwnProperty.call(second, prop)) {
            (<Second>result)[prop] = second[prop];
        }
    }

    return <First & Second>result;
}
