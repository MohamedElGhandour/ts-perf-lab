import chalk from 'chalk';
import figlet from 'figlet';
import Table from 'cli-table3';
import {BenchmarkResult} from "../types";

/**
 * Pretty‑prints benchmark results inside a Braille‑Wave bordered frame,
 * embeds a star‑colored name at the top, then logs summary, legend, table, and comparison summary with colored winners and losers and percentages.
 *
 * @deprecated This function is no longer used.
 * @param bannerText      Text for the big ASCII banner (e.g. your suite name)
 * @param title           Short title printed under the banner
 * @param testCount       Number of tests run (for the summary line)
 * @param dataDescription Description of the data being tested
 * @param results         Array of BenchmarkResult to tabulate
 * @returns               void (all output is logged to the console)
 */
export function printStyled(
    bannerText: string,
    title: string,
    testCount: number,
    dataDescription: string,
    results: BenchmarkResult[]
) {
    const totalWidth = 80;
    const name = 'Mohamed Elghandour';
    const starName = chalk.yellowBright.bold(name);

    // 1) Full braille‑wave stripe
    const waves = ['⠁','⠂','⠄','⡀','⢀','⠠','⠐','⠈'];
    const stripe = Array.from({ length: totalWidth }, (_, i) => waves[i % waves.length]).join('');

    // 2) Center the name
    const leftCount  = Math.floor((totalWidth - name.length) / 2);
    const rightCount = totalWidth - name.length - leftCount;
    const leftWave   = stripe.slice(0, leftCount);
    const rightWave  = stripe.slice(leftCount + name.length);

    // 3) Top border
    console.log(chalk.blueBright(`╭${leftWave}${starName}${rightWave}╮`));

    // 4) Banner + Title
    console.log(chalk.cyanBright(figlet.textSync(bannerText, { horizontalLayout: 'full' })));
    console.log(chalk.magentaBright(`🏁 ${title}\n`));

    // 5) Summary
    console.log(
        chalk.bgBlack.whiteBright(`🚀 Running ${testCount.toLocaleString()} tests on ${dataDescription}`)
    );
    console.log(
        chalk.hex('#FFD700')('🗓 Time:') + ' ' +
        chalk.white(new Date().toLocaleString()) +
        '  ' +
        chalk.hex('#FFD700')('🔀 Input:') + ' ' +
        chalk.white(dataDescription)
    );
    console.log(chalk.gray('─'.repeat(totalWidth)));

    // 6) Legend
    console.log(chalk.greenBright(results.map(r => r.label).join('   vs.   ')) + '\n');

    // 7) Main Table of Results
    const table = new Table({
        head: [
            chalk.bold.yellow('Label'),
            chalk.bold.yellow('Time (ms)'),
            chalk.bold.yellow('RSS (MB)'),
            chalk.bold.yellow('Heap Total (MB)'),
            chalk.bold.yellow('Heap Used (MB)')
        ],
        colWidths: [32, 17, 14, 18, 18],
        colAligns: ['left', 'right', 'right', 'right', 'right'],
        style: { head: ['yellow'], border: ['gray'] },
        chars: {
            top: '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
            bottom: '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
            left: '│', 'left-mid': '├', mid: '─', 'mid-mid': '┼',
            right: '│', 'right-mid': '┤', middle: '│'
        }
    });
    results.forEach(r => table.push([
        r.label,
        r.timeMs.toFixed(2),
        r.rssMB.toFixed(2),
        r.heapTotalMB.toFixed(2),
        r.heapUsedMB.toFixed(2)
    ]));
    console.log(table.toString());

    // 8) Comparison Summary: show both winner and loser with larger name fields, colors, and percentages
    const fastest = results.reduce((a, b) => a.timeMs <= b.timeMs ? a : b);
    const slowest = results.reduce((a, b) => a.timeMs >= b.timeMs ? a : b);
    const leastMemory = results.reduce((a, b) => a.heapUsedMB <= b.heapUsedMB ? a : b);
    const highestMemory = results.reduce((a, b) => a.heapUsedMB >= b.heapUsedMB ? a : b);

    const timePct = ((slowest.timeMs - fastest.timeMs) / slowest.timeMs) * 100;
    const memPct = ((highestMemory.heapUsedMB - leastMemory.heapUsedMB) / highestMemory.heapUsedMB) * 100;

    const compareTable = new Table({
        head: [
            chalk.bold.yellow('Metric'),
            chalk.bold.yellow('Winner'),
            chalk.bold.yellow('Value'),
            chalk.bold.yellow('Loser'),
            chalk.bold.yellow('Value'),
            chalk.bold.yellow('Improvement')
        ],
        // Increase widths for Winner and Loser name fields
        colWidths: [14, 32, 14, 32, 14, 16],
        colAligns: ['left', 'left', 'right', 'left', 'right', 'right'],
        style: { head: ['yellow'], border: ['gray'] },
        chars: table.options.chars
    });

    compareTable.push([
        'Time',
        chalk.greenBright(fastest.label),
        chalk.greenBright(`${fastest.timeMs.toFixed(2)} ms`),
        chalk.redBright(slowest.label),
        chalk.redBright(`${slowest.timeMs.toFixed(2)} ms`),
        chalk.greenBright(`${timePct.toFixed(2)}% faster`)
    ]);
    compareTable.push([
        'Memory',
        chalk.greenBright(leastMemory.label),
        chalk.greenBright(`${leastMemory.heapUsedMB.toFixed(2)} MB`),
        chalk.redBright(highestMemory.label),
        chalk.redBright(`${highestMemory.heapUsedMB.toFixed(2)} MB`),
        chalk.greenBright(`${memPct.toFixed(2)}% less`)
    ]);

    console.log('\n' + compareTable.toString() + '\n');

    // 9) Bottom border
    console.log(chalk.blueBright(`╰${stripe}╯`));
    console.log('\n\n');
}