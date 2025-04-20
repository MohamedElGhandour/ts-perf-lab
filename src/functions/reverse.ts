import { benchmark } from '../utils/benchmark';
import {BenchmarkResult, BenchmarkSummary, SourceCode} from "../types";
import {extractFunctionCode} from "../utils/extractFunctionCode";
import path from "path";

function reverseString(x: number): number {
    const isNegative = x < 0;
    const min = -(2 ** 31);
    const max = (2 ** 31) - 1;
    const reversed = parseInt(Math.abs(x).toString().split('').reverse().join(''), 10);
    const result = isNegative ? -reversed : reversed;
    return result < min || result > max ? 0 : result;
}

function reverseMath(x: number): number {
    let result = 0;
    const min = -(2 ** 31);
    const max = (2 ** 31) - 1;

    while (x !== 0) {
        const digit = x % 10;
        x = (x / 10) | 0;

        if (result > max / 10 || (result === max / 10 && digit > 7)) return 0;
        if (result < min / 10 || (result === min / 10 && digit < -8)) return 0;

        result = result * 10 + digit;
    }

    return result;
}

function generateUniqueTestData(count: number): number[] {
    const set = new Set<number>();
    while (set.size < count) {
        const num = Math.floor(Math.random() * (2 ** 31)) * (Math.random() > 0.5 ? 1 : -1);
        set.add(num);
    }
    return Array.from(set);
}

export function reverseBenchmark(): BenchmarkSummary {
    const TEST_COUNT = 100000;
    const uniqueTestData = generateUniqueTestData(TEST_COUNT);

    const fLabel = '🔡 String-based';
    const lLabel = '🔢 Math-based';
    const filename = path.basename(__filename);

    // run the raw benchmarks
    const results: BenchmarkResult[] = [
        benchmark(fLabel, reverseString, uniqueTestData),
        benchmark(lLabel,   reverseMath,   uniqueTestData),
    ];

    // Read this file from disk and extract the two functions (with types!)
    const sourceCode: SourceCode[] = [
        {
            label: fLabel,
            code: extractFunctionCode(filename, 'reverseString')
        },
        {
            label: lLabel,
            code: extractFunctionCode(filename, 'reverseMath')
        },
    ];

    return {
        bannerText:   'REVERSE',
        title:    'Reverse Integer Benchmark',
        testCount:   TEST_COUNT,
        dataDescription:    'unique integers',
        results,
        sourceCode
    };
}