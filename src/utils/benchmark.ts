// utils/benchmark.ts
import { performance } from 'perf_hooks';

export type BenchmarkResult = {
    label: string;
    timeMs: number;
    rssMB: number;
    heapTotalMB: number;
    heapUsedMB: number;
    externalMB: number;
};

/**
 * Benchmarks a function over a given list of inputs and measures execution time and memory usage.
 *
 * @template T - The input type for the function being benchmarked.
 * @param {string} label - A descriptive label for the benchmark.
 * @param {(x: T) => unknown} fn - The function to benchmark. It will be called once for each input.
 * @param {T[]} inputs - An array of inputs to test the function against.
 * @returns {BenchmarkResult} An object containing timing and memory usage metrics.
 */
export function benchmark<T>(
    label: string,
    fn: (x: T) => unknown,
    inputs: T[]
): BenchmarkResult {
    const memBefore = process.memoryUsage();
    const start = performance.now();
    for (const input of inputs) {
        fn(input);
    }
    const end = performance.now();
    const memAfter = process.memoryUsage();

    const toMB = (bytes: number) => parseFloat((bytes / 1024 / 1024).toFixed(2));
    return {
        label,
        timeMs: parseFloat((end - start).toFixed(4)),
        rssMB: toMB(memAfter.rss - memBefore.rss),
        heapTotalMB: toMB(memAfter.heapTotal - memBefore.heapTotal),
        heapUsedMB: toMB(memAfter.heapUsed - memBefore.heapUsed),
        externalMB: toMB(memAfter.external - memBefore.external),
    };
}
