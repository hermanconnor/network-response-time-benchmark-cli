import { Command } from 'commander';
import chalk from 'chalk';
import { runBenchmark } from './benchmark';
import { BenchmarkResult } from './types';

const program = new Command();

program
  .name('network-response-time-benchmark-cli')
  .description('Simple CLI tool to benchmark website response times')
  .argument('<url>', 'URL to benchmark (e.g. https://example.com)')
  .option('-r, --repeat <number>', 'Number of times to repeat', '1')
  .option('-t, --timeout <number>', 'Timeout in milliseconds', '10000')
  .parse(process.argv);

const options = program.opts();
const url = program.args[0];

let repeat = parseInt(options.repeat, 10);
if (Number.isNaN(repeat) || repeat <= 0) {
  repeat = 1;
}

let timeout = parseInt(options.timeout, 10);
if (Number.isNaN(timeout) || timeout <= 0) {
  timeout = 10000;
}

if (!url) {
  console.error(chalk.red('Missing URL argument.'));
  console.log(
    `\nUsage: ${chalk.cyan('web-bench')} <url> ${chalk.gray(
      '[--repeat <number>] [--timeout <ms>]',
    )}`,
  );

  process.exit(1);
}

async function main() {
  console.log(`${chalk.cyanBright('Benchmarking')} ${chalk.green(url)}...`);
  console.log(`${chalk.dim('Repeating')} ${chalk.yellow(repeat)} time(s)\n`);
  // console.log(`${chalk.dim('Timeout')} ${chalk.yellow(timeout)} ms\n`);

  const results: BenchmarkResult[] = [];

  for (let i = 0; i < repeat; i++) {
    process.stdout.write(`${chalk.gray(`Run ${i + 1}/${repeat}`)}: `);
    const result = await runBenchmark(url, timeout);

    if (result) {
      results.push(result);
      process.stdout.write(`${chalk.green(result.totalTime.toFixed(2))} ms\n`);
    } else {
      process.stdout.write(chalk.red('Failed\n'));
    }

    if (i < repeat - 1) {
      await new Promise((res) => setTimeout(res, 100));
    }
  }

  if (results.length === 0) {
    console.log(chalk.red('\nNo successful runs.'));
    return;
  }

  const average = (key: keyof BenchmarkResult) => {
    const avg = results.reduce((sum, r) => sum + r[key], 0) / results.length;

    return avg.toFixed(2);
  };

  console.log('\n' + chalk.bold('--- Average Results ---'));
  console.log(
    `${chalk.blue('DNS Lookup:')}        ${chalk.magenta(
      average('dnsLookup'),
    )} ms`,
  );
  console.log(
    `${chalk.blue('TCP Connection:')}    ${chalk.magenta(
      average('tcpConnection'),
    )} ms`,
  );
  if (results.some((r) => r.tlsHandshake > 0)) {
    console.log(
      `${chalk.blue('TLS Handshake:')}     ${chalk.magenta(
        average('tlsHandshake'),
      )} ms`,
    );
  }
  console.log(
    `${chalk.blue('Time to First Byte:')} ${chalk.magenta(
      average('timeToFirstByte'),
    )} ms`,
  );
  console.log(
    `${chalk.blue('Total Time:')}         ${chalk.magenta(
      average('totalTime'),
    )} ms`,
  );
}

main().catch((error) => {
  console.error(chalk.red('An unexpected error occurred:'), error);
  process.exit(1);
});
