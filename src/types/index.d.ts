export type BenchmarkResult = {
    label: string;
    timeMs: number;
    rssMB: number;
    heapTotalMB: number;
    heapUsedMB: number;
    externalMB: number;
};


export type SourceCode = {
    label: string;
    code: string;
};

export type BenchmarkSummary = {
    bannerText: string;
    title: string;
    testCount: number;
    dataDescription: string;
    results: BenchmarkResult[];
    sourceCode: SourceCode[];    // ← new
};