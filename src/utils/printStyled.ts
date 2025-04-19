import chalk from 'chalk';
import figlet from 'figlet';
import Table from 'cli-table3';
import { BenchmarkResult } from './benchmark';

/**
 * Pretty‑prints benchmark results inside a Braille‑Wave bordered frame,
 * embeds a star‑colored name at the top, then logs summary, legend, and table.
 *
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
    const totalWidth = 80;                         // number of braille wave chars
    const name = 'Mohamed Elghandour';
    const starName = chalk.yellowBright.bold(name);

    // 1) Full braille‑wave stripe
    const waves = ['⠁','⠂','⠄','⡀','⢀','⠠','⠐','⠈'];
    const stripe = Array.from({ length: totalWidth }, (_, i) => waves[i % waves.length]).join('');

    // 2) Compute left/right segments so name is centered
    const leftCount  = Math.floor((totalWidth - name.length) / 2);
    const rightCount = totalWidth - name.length - leftCount;
    const leftWave  = stripe.slice(0, leftCount);
    const rightWave = stripe.slice(leftCount + name.length);

    // 3) Top border with embedded star‑colored name
    console.log(chalk.blueBright(`╭${leftWave}${starName}${rightWave}╮`));

    // 4) ASCII Banner + Title
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
        chalk.white('Strings length 10–300')
    );
    console.log(chalk.gray('─'.repeat(totalWidth)));

    // 6) Legend
    console.log(chalk.greenBright(results.map(r => r.label).join('   vs.   ')) + '\n');

    // 7) Table
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
    results.forEach(r => {
        table.push([
            r.label,
            r.timeMs.toFixed(2),
            r.rssMB.toFixed(2),
            r.heapTotalMB.toFixed(2),
            r.heapUsedMB.toFixed(2)
        ]);
    });
    console.log(table.toString());

    // 8) Full‑wave bottom border
    console.log(chalk.blueBright(`╰${stripe}╯`));
    console.log('\n \n')
}
