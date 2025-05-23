import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';
import { TLSSocket } from 'node:tls';
import { performance } from 'perf_hooks';
import { BenchmarkResult } from './types';

interface Timings {
  start: number;
  dnsLookup?: number;
  tcpConnection?: number;
  tlsHandshake?: number;
  firstByte?: number;
  end?: number;
}

export async function runBenchmark(
  urlStr: string,
): Promise<BenchmarkResult | null> {
  const url = new URL(urlStr);
  const isHttps = url.protocol === 'https:';
  const transport = isHttps ? https : http;

  return new Promise((resolve) => {
    const timings: Timings = {
      start: performance.now(),
    };

    const req = transport.request(
      {
        method: 'GET',
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
      },
      (res) => {
        res.once('readable', () => {
          timings.firstByte = performance.now();
        });

        res.on('end', () => {
          timings.end = performance.now();

          const result: BenchmarkResult = {
            dnsLookup: (timings.dnsLookup ?? timings.start) - timings.start,
            tcpConnection:
              (timings.tcpConnection ?? timings.start) -
              (timings.dnsLookup ?? timings.start),
            tlsHandshake: isHttps
              ? (timings.tlsHandshake ?? timings.start) -
                (timings.tcpConnection ?? timings.start)
              : 0,
            timeToFirstByte:
              (timings.firstByte ?? timings.end ?? timings.start) -
              (isHttps
                ? timings.tlsHandshake ?? timings.tcpConnection ?? timings.start
                : timings.tcpConnection ?? timings.start),
            totalTime: (timings.end ?? performance.now()) - timings.start,
          };

          resolve(result);
        });

        res.resume();
      },
    );

    req.on('socket', (socket) => {
      socket.once('lookup', () => {
        timings.dnsLookup = performance.now();
      });

      socket.once('connect', () => {
        timings.tcpConnection = performance.now();
      });

      if (isHttps && socket instanceof TLSSocket) {
        socket.once('secureConnect', () => {
          timings.tlsHandshake = performance.now();
        });
      }
    });

    req.on('error', (err) => {
      console.error(`Request error: ${err.message}`);
      resolve(null);
    });

    req.end();
  });
}
