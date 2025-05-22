export interface BenchmarkResult {
  dnsLookup: number;
  tcpConnection: number;
  tlsHandshake: number;
  timeToFirstByte: number;
  totalTime: number;
}
