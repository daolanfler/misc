# Type Challenge

- Pick

```ts
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key];
};
```

- Merge

```ts
type Merge<F, S> = {
  [key in keyof (F & S)]: key extends keyof S
    ? S[key]
    : key extends keyof F
    ? F[key]
    : never;
};
```
