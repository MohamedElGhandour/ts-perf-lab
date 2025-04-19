"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printStyled = printStyled;
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const cli_table3_1 = __importDefault(require("cli-table3"));
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
function printStyled(bannerText, title, testCount, dataDescription, results) {
    const totalWidth = 80; // number of braille wave chars
    const name = 'Mohamed Elghandour';
    const starName = chalk_1.default.yellowBright.bold(name);
    // 1) Full braille‑wave stripe
    const waves = ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'];
    const stripe = Array.from({ length: totalWidth }, (_, i) => waves[i % waves.length]).join('');
    // 2) Compute left/right segments so name is centered
    const leftCount = Math.floor((totalWidth - name.length) / 2);
    const rightCount = totalWidth - name.length - leftCount;
    const leftWave = stripe.slice(0, leftCount);
    const rightWave = stripe.slice(leftCount + name.length);
    // 3) Top border with embedded star‑colored name
    console.log(chalk_1.default.blueBright(`╭${leftWave}${starName}${rightWave}╮`));
    // 4) ASCII Banner + Title
    console.log(chalk_1.default.cyanBright(figlet_1.default.textSync(bannerText, { horizontalLayout: 'full' })));
    console.log(chalk_1.default.magentaBright(`🏁 ${title}\n`));
    // 5) Summary
    console.log(chalk_1.default.bgBlack.whiteBright(`🚀 Running ${testCount.toLocaleString()} tests on ${dataDescription}`));
    console.log(chalk_1.default.hex('#FFD700')('🗓 Time:') + ' ' +
        chalk_1.default.white(new Date().toLocaleString()) +
        '  ' +
        chalk_1.default.hex('#FFD700')('🔀 Input:') + ' ' +
        chalk_1.default.white('Strings length 10–300'));
    console.log(chalk_1.default.gray('─'.repeat(totalWidth)));
    // 6) Legend
    console.log(chalk_1.default.greenBright(results.map(r => r.label).join('   vs.   ')) + '\n');
    // 7) Table
    const table = new cli_table3_1.default({
        head: [
            chalk_1.default.bold.yellow('Label'),
            chalk_1.default.bold.yellow('Time (ms)'),
            chalk_1.default.bold.yellow('RSS (MB)'),
            chalk_1.default.bold.yellow('Heap Total (MB)'),
            chalk_1.default.bold.yellow('Heap Used (MB)')
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
    console.log(chalk_1.default.blueBright(`╰${stripe}╯`));
    console.log('\n \n');
}
