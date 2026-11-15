// @java: DemVong.java
// Count the basic steps of six loop shapes, for n = 16 and n = 32, and compare with the formula.
// #region vong
function a_linear(n: number): number { let c = 0; for (let i = 0; i < n; i++) c++; return c; }                       // n
function b_nested(n: number): number { let c = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c++; return c; } // n^2
function c_triangle(n: number): number { let c = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) c++; return c; } // n(n-1)/2
function d_halving(n: number): number { let c = 0; for (let i = n; i > 1; i = Math.floor(i / 2)) c++; return c; }    // log2 n
function e_nlogn(n: number): number { let c = 0; for (let i = 0; i < n; i++) for (let j = 1; j < n; j *= 2) c++; return c; } // n log2 n
function f_twoLoops(n: number, m: number): number { let c = 0; for (let i = 0; i < n; i++) c++; for (let j = 0; j < m; j++) c++; return c; } // n + m
// #endregion
// #region dequy
let calls = 0;
function fib(n: number): number { calls++; return n < 2 ? n : fib(n - 1) + fib(n - 2); }   // ~1.6^n calls
// #endregion
for (const n of [16, 32]) {
  console.log(`n=${n}: linear=${a_linear(n)} nested=${b_nested(n)} triangle=${c_triangle(n)} halving=${d_halving(n)} nlogn=${e_nlogn(n)} twoLoops(n,n)=${f_twoLoops(n, n)}`);
}
for (const n of [10, 20, 30]) { calls = 0; const v = fib(n); console.log(`fib(${n})=${v} calls=${calls}`); }
