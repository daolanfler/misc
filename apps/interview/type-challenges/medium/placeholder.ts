// todo 

// - Merge
type Merge<F, S> = {
  [key in keyof (F & S)]: key extends keyof S
    ? S[key]
    : key extends keyof F
    ? F[key]
    : never;
};
