import { performance } from 'perf_hooks';
import { BenchmarkResult } from '../types';

/**
 * Benchmarks a function over a given list of inputs,
 * returning a single summary result.
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
    const toMB = (b: number) => b / 1024 / 1024;

    return {
        label,
        timeMs: parseFloat((end - start).toFixed(4)),
        rssMB: parseFloat((toMB(memAfter.rss - memBefore.rss)).toFixed(2)),
        heapTotalMB: parseFloat((toMB(memAfter.heapTotal - memBefore.heapTotal)).toFixed(2)),
        heapUsedMB: parseFloat((toMB(memAfter.heapUsed - memBefore.heapUsed)).toFixed(2)),
        externalMB: parseFloat((toMB(memAfter.external - memBefore.external)).toFixed(2)),
    };
}
