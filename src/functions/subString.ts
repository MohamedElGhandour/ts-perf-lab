import { benchmark } from '../utils/benchmark';
import {BenchmarkResult, BenchmarkSummary, SourceCode} from "../types";
import {extractFunctionCode} from "../utils/extractFunctionCode";
import path from "path";

// 🔁 Your version: array with includes & splice
function longestSubstringArray(s: string): number {
    let longest = 0;
    let subString: string[] = [];
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
function longestSubstringMap(s: string): number {
    let start = 0;
    let maxLen = 0;
    const seen = new Map<string, number>();

    for (let end = 0; end < s.length; end++) {
        const char = s[end];
        if (seen.has(char) && seen.get(char)! >= start) {
            start = seen.get(char)! + 1;
        }
        seen.set(char, end);
        maxLen = Math.max(maxLen, end - start + 1);
    }
    return maxLen;
}

function generateRandomStringData(count: number): string[] {
    const arr: string[] = [];
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
export function substringBenchmark(): BenchmarkSummary {
    const TEST_COUNT = 10000;
    const testData = generateRandomStringData(TEST_COUNT);

    const fLabel = '📋 Array.includes+splice';
    const lLabel = '🧩 Map sliding window';
    const filename = path.basename(__filename);

    // run the raw benchmarks
    const results: BenchmarkResult[] = [
        benchmark(fLabel, longestSubstringArray, testData),
        benchmark(lLabel,   longestSubstringMap,   testData),
    ];

    // Read this file from disk and extract the two functions (with types!)
    const sourceCode: SourceCode[] = [
        {
            label:fLabel,
            code: extractFunctionCode(filename, 'longestSubstringArray')
        },
        {
            label: lLabel,
            code: extractFunctionCode(filename, 'longestSubstringMap')
        },
    ];



    return {
        bannerText: 'SUBSTRING',
        title: 'Longest Substring Benchmark',
        testCount: TEST_COUNT,
        dataDescription: 'random strings (length 10–300)',
        results,
        sourceCode
    };
}
