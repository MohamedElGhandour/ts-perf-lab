import express, { Request, Response } from 'express';
import path from 'path';
import mustacheExpress from 'mustache-express';
import { substringBenchmark } from './functions/subString';
import { reverseBenchmark } from './functions/reverse';
import { fairPairsBenchmark } from './functions/fairPair';
import {BenchmarkSummary, BenchmarkResult, SourceCode} from './types';

const app = express();
const PORT = process.env.PORT || 3000;

// configure Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Map of available benchmark functions
const benchmarks: Record<string, () => BenchmarkSummary> = {
  substring: () => substringBenchmark(),
  reverse:   () => reverseBenchmark(),
  fairPairs: () => fairPairsBenchmark(),
};

// render the main page with function list
app.get('/', (_req: Request, res: Response) => {
  const functions = Object.keys(benchmarks).map(name => ({ id: name, label: name.charAt(0).toUpperCase() + name.slice(1) }));
  res.render('index', { functions });
});

 // Run a benchmark and render results page via path‐param
app.get('/benchmark/:func', (req: Request, res: Response): any => {
  const name = req.params.func;
  const runner = benchmarks[name];
  if (!runner) {
    return res.status(404).send(`Unknown function: ${name}`);
  }

  try {
    const summary: BenchmarkSummary = runner();

    // pick extremes
    const fastest   = summary.results.reduce((a, b) => a.timeMs <= b.timeMs ? a : b);
    const slowest   = summary.results.reduce((a, b) => a.timeMs >= b.timeMs ? a : b);
    const leastMem  = summary.results.reduce((a, b) => a.heapUsedMB <= b.heapUsedMB ? a : b);
    const mostMem   = summary.results.reduce((a, b) => a.heapUsedMB >= b.heapUsedMB ? a : b);

    const timePct = ((slowest.timeMs - fastest.timeMs) / slowest.timeMs * 100).toFixed(2);
    const memPct  = ((mostMem.heapUsedMB - leastMem.heapUsedMB) / mostMem.heapUsedMB * 100).toFixed(2);

    res.render('results', {
      bannerText:      summary.bannerText,
      title:           summary.title,
      testCount:       summary.testCount,
      dataDescription: summary.dataDescription,
      results: summary.results.map((r: BenchmarkResult) => ({
        label:       r.label,
        timeMs:      r.timeMs.toFixed(2),
        rssMB:       r.rssMB.toFixed(2),
        heapTotalMB: r.heapTotalMB.toFixed(2),
        heapUsedMB:  r.heapUsedMB.toFixed(2),
      })),
      fastest,
      slowest,
      leastMem,
      mostMem,
      timePct,
      memPct,
      timeNow: new Date().toLocaleString(),
      // source code snippets
      sourceCode: summary.sourceCode,
    });
  } catch (err) {
    res.status(500).send(err instanceof Error ? err.message : String(err));
  }
});

// 404 handler — must come *after* all other routes:
app.use((req: Request, res: Response) => {
  res.status(404).render('notFound');
});

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));

