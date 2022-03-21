// https://github.com/type-challenges/type-challenges/blob/master/questions/11-easy-tuple-to-object/README.md

type TupleToObject<T extends readonly any[]> = {
  [k in T[number]]: k
}