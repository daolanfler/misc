// https://github.com/type-challenges/type-challenges/blob/master/questions/18-easy-tuple-length/README.md 

// 这里需要加上 reaonly 
type Length<T extends any> = T extends readonly any[] ? T['length'] : never

// docs for The ReadonlyArray Type https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type