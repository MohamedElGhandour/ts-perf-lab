import { benchmark } from '../utils/benchmark';
import {BenchmarkResult, BenchmarkSummary, SourceCode} from "../types";
import {extractFunctionCode} from "../utils/extractFunctionCode";
import path from "path";

// === Your original O(n^2) version ===
function countFairPairsNested(nums: number[], lower: number, upper: number): number {
    let pairs = 0;
    const n = nums.length;

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const sum = nums[i] + nums[j];
            if (sum >= lower && sum <= upper) {
                pairs++;
            }
        }
    }

    return pairs;
}

// === Optimized O(n log n) version ===
function countFairPairsOptimized(nums: number[], lower: number, upper: number): number {
    nums.sort((a, b) => a - b);
    let count = 0;
    const n = nums.length;

    for (let i = 0; i < n; i++) {
        const targetLow = lower - nums[i];
        const targetHigh = upper - nums[i];

        const left = lowerBound(nums, targetLow, i + 1, n);
        const right = upperBound(nums, targetHigh, i + 1, n);

        count += Math.max(0, right - left);
    }

    function lowerBound(arr: number[], value: number, lo: number, hi: number): number {
        while (lo < hi) {
            const mid = lo + ((hi - lo) >> 1);
            if (arr[mid] < value) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    function upperBound(arr: number[], value: number, lo: number, hi: number): number {
        while (lo < hi) {
            const mid = lo + ((hi - lo) >> 1);
            if (arr[mid] <= value) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    return count;
}

// === Test-data generators ===
function generateRandomTests(count: number): Array<{ nums: number[]; lower: number; upper: number }> {
    const tests = [];
    for (let t = 0; t < count; t++) {
        const len = Math.floor(Math.random() * 100) + 1;
        const nums = Array.from({ length: len }, () => Math.floor(Math.random() * 2000) - 1000);
        const lower = Math.floor(Math.random() * 2000) - 1000;
        const upper = lower + Math.floor(Math.random() * 1000);
        tests.push({ nums, lower, upper });
    }
    return tests;
}

function generateBigTests(count: number): Array<{ nums: number[]; lower: number; upper: number }> {
    const pattern = [-1e9, 90, 90, -1e9, 90, -1e9, 90, 90, -1e9];
    const tests = [];
    for (let t = 0; t < count; t++) {
        const nums = Array.from({ length: 10_000 }, (_, i) => pattern[i % pattern.length]);
        // full-range bounds to include all pattern sums
        tests.push({ nums, lower: -2e9, upper: 2e9 });
    }
    return tests;
}

export function fairPairsBenchmark(): BenchmarkSummary {
    const simpleTests = generateRandomTests(100);
    const bigTests    = generateBigTests(10);
    const allTests    = [...simpleTests, ...bigTests];
    // benchmark util expects a single-arg fn, so pack args into a tuple:
    const inputs: [number[], number, number][] = allTests.map(t => [t.nums, t.lower, t.upper]);

    const fLabel = '🔥 Optimized O(n log n)';
    const lLabel = '🅾️ Nested O(n²)';
    const filename = path.basename(__filename);

    const results: BenchmarkResult[] = [
        benchmark(
            fLabel,
            ([nums, lower, upper]) => countFairPairsOptimized(nums, lower, upper),
            inputs
        ),
        benchmark(
            lLabel,
            ([nums, lower, upper]) => countFairPairsNested(nums, lower, upper),
            inputs
        ),
    ];

    // Read this file from disk and extract the two functions (with types!)
    const sourceCode: SourceCode[] = [
        {
            label:fLabel,
            code: extractFunctionCode(filename, 'countFairPairsOptimized')
        },
        {
            label: lLabel,
            code: extractFunctionCode(filename, 'countFairPairsNested')
        },
    ];

    return {
        bannerText: 'FAIR PAIRS',
        title: 'Count Fair Pairs Benchmark',
        testCount: inputs.length,
        dataDescription: '100 random + 10 large (100 000 elems) tests',
        results,
        sourceCode
    };
}
