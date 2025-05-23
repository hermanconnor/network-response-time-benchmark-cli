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
): Promise<BenchmarkResult | null> {}
