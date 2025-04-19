"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.substringBenchmark = substringBenchmark;
const benchmark_1 = require("../utils/benchmark");
const printStyled_1 = require("../utils/printStyled");
// 🔁 Your version: array with includes & splice
function longestSubstringArray(s) {
    let longest = 0;
    let subString = [];
    for (const char of s) {
        const index = subString.indexOf(char);
        if (index !== -1) {
            longest = Math.max(longest, subString.length);
            subString.splice(0, index + 1);
        }
        subString.push(char);
    }
    return Math.max(longest, subString.length);
}
// 🧠 Best version: Map + sliding window
function longestSubstringMap(s) {
    let start = 0;
    let maxLen = 0;
    const seen = new Map();
    for (let end = 0; end < s.length; end++) {
        const char = s[end];
        if (seen.has(char) && seen.get(char) >= start) {
            start = seen.get(char) + 1;
        }
        seen.set(char, end);
        maxLen = Math.max(maxLen, end - start + 1);
    }
    return maxLen;
}
function generateRandomStringData(count) {
    const arr = [];
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < count; i++) {
        let s = '';
        const len = 10 + Math.floor(Math.random() * 291);
        for (let j = 0; j < len; j++) {
            s += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        arr.push(s);
    }
    return arr;
}
/** 🔍 Longest Substring Benchmark */
function substringBenchmark() {
    const TEST_COUNT = 10000;
    const testData = generateRandomStringData(TEST_COUNT);
    // run the raw benchmarks
    const results = [
        (0, benchmark_1.benchmark)('🧩 Array.includes+splice', longestSubstringArray, testData),
        (0, benchmark_1.benchmark)('🧩 Map sliding window', longestSubstringMap, testData),
    ];
    // pretty‑print them
    (0, printStyled_1.printStyled)('SUBSTRING', // ASCII banner text
    'Longest Substring Benchmark', // title
    TEST_COUNT, // how many tests
    'random strings (length 10–300)', // description of data
    results // the BenchmarkResult[] to render
    );
}
