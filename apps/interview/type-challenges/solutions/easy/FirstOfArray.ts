// https://github.com/type-challenges/type-challenges/blob/master/questions/14-easy-first/README.md 

type First<T extends any[]> = T extends [infer E, ...any[]] ? E : never
