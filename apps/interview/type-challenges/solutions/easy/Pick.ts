// https://github.com/type-challenges/type-challenges/blob/master/questions/4-easy-pick/README.md

type MyPick<T, K extends keyof T> = {
  [key in K]: T[key]
}