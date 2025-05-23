import { URL } from 'node:url';
import { BenchmarkTimer } from './benchmark-timer';
import { BenchmarkResult } from './types';
import { prepareRequest, attachTimingListeners } from './utils/request-helpers';

export async function runSingleBenchmark(
  url: string,
): Promise<BenchmarkResult | null> {
  const parsedUrl = new URL(url);
  const isHttps = parsedUrl.protocol === 'https:';

  return new Promise((resolve, reject) => {
    const timer = new BenchmarkTimer();
    const { requestModule, options } = prepareRequest(parsedUrl, isHttps);

    const req = requestModule.request(options, (res) => {
      attachTimingListeners(req, res, timer, isHttps);

      res.on('end', () => {
        resolve(timer.getResults(isHttps));
      });
    });

    req.on('error', (err) => {
      console.error(`Request error for ${url}:`, err.message);
      reject(err);
    });

    req.end();
  });
}
