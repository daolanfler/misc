type FirstOperation = <T>(arr: T[], fn: (item: T) => boolean) => T | undefined;

const first: FirstOperation = (arr, fn) => {
    let result;
    for (const item of arr) {
        if (fn(item)) {
            result = item;
            break;
        }
    }
    return result;
};
