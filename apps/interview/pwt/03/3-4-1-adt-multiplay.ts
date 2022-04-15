// ADT stands for Algegraic Data Type

type A = "a1" | "a2";
type B = "b1" | "b2" | 'b3';

// 乘积类型
type Multiply = [A, B]; // 2 x 3 = 6 种可能的值
const test1: Multiply = ["a1", "b1"];
const test2: Multiply = ["a2", "b1"];
const test3: Multiply = ["a1", "b2"];
const test4: Multiply = ["a2", "b2"];

// 和类型
type Sum = A | B 
const test5: Sum = 'a1'; // 2 + 2 = 4 
