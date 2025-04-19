"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseBenchmark = reverseBenchmark;
// index.ts
const benchmark_1 = require("../utils/benchmark");
const printStyled_1 = require("../utils/printStyled");
function reverseString(x) {
    const isNegative = x < 0;
    const min = -(2 ** 31);
    const max = (2 ** 31) - 1;
    const reversed = parseInt(Math.abs(x).toString().split('').reverse().join(''), 10);
    const result = isNegative ? -reversed : reversed;
    return result < min || result > max ? 0 : result;
}
function reverseMath(x) {
    let result = 0;
    const min = -(2 ** 31);
    const max = (2 ** 31) - 1;
    while (x !== 0) {
        const digit = x % 10;
        x = (x / 10) | 0;
        if (result > max / 10 || (result === max / 10 && digit > 7))
            return 0;
        if (result < min / 10 || (result === min / 10 && digit < -8))
            return 0;
        result = result * 10 + digit;
    }
    return result;
}
function generateUniqueTestData(count) {
    const set = new Set();
    while (set.size < count) {
        const num = Math.floor(Math.random() * (2 ** 31)) * (Math.random() > 0.5 ? 1 : -1);
        set.add(num);
    }
    return Array.from(set);
}
function reverseBenchmark() {
    const TEST_COUNT = 100000;
    const uniqueTestData = generateUniqueTestData(TEST_COUNT);
    // run the raw benchmarks
    const results = [
        (0, benchmark_1.benchmark)('🔡 String-based', reverseString, uniqueTestData),
        (0, benchmark_1.benchmark)('🔢 Math-based', reverseMath, uniqueTestData),
    ];
    // pretty‑print them
    (0, printStyled_1.printStyled)('REVERSE', // ASCII banner text
    'Reverse Integer Benchmark', // title
    TEST_COUNT, // how many tests
    'unique integers', // description of data
    results // the BenchmarkResult[] to render
    );
}
