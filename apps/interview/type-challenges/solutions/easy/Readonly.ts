// https://github.com/type-challenges/type-challenges/blob/master/questions/7-easy-readonly/README.md

type MyReadonly<T> = {
  readonly [k in keyof T]: T[k]
}
