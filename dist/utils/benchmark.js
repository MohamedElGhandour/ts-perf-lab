"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.benchmark = benchmark;
// utils/benchmark.ts
const perf_hooks_1 = require("perf_hooks");
/**
 * Benchmarks a function over a given list of inputs and measures execution time and memory usage.
 *
 * @template T - The input type for the function being benchmarked.
 * @param {string} label - A descriptive label for the benchmark.
 * @param {(x: T) => unknown} fn - The function to benchmark. It will be called once for each input.
 * @param {T[]} inputs - An array of inputs to test the function against.
 * @returns {BenchmarkResult} An object containing timing and memory usage metrics.
 */
function benchmark(label, fn, inputs) {
    const memBefore = process.memoryUsage();
    const start = perf_hooks_1.performance.now();
    for (const input of inputs) {
        fn(input);
    }
    const end = perf_hooks_1.performance.now();
    const memAfter = process.memoryUsage();
    const toMB = (bytes) => parseFloat((bytes / 1024 / 1024).toFixed(2));
    return {
        label,
        timeMs: parseFloat((end - start).toFixed(4)),
        rssMB: toMB(memAfter.rss - memBefore.rss),
        heapTotalMB: toMB(memAfter.heapTotal - memBefore.heapTotal),
        heapUsedMB: toMB(memAfter.heapUsed - memBefore.heapUsed),
        externalMB: toMB(memAfter.external - memBefore.external),
    };
}
