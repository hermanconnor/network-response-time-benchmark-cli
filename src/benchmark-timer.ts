import { BenchmarkResult } from './types';
import { toMilliseconds } from './utils/to-milliseconds';

export class BenchmarkTimer {
  private requestStart: bigint = 0n;
  private dnsLookupStart: bigint = 0n;
  private dnsLookupEnd: bigint = 0n;
  private tcpConnectionStart: bigint = 0n;
  private tcpConnectionEnd: bigint = 0n;
  private tlsHandshakeStart: bigint = 0n;
  private tlsHandshakeEnd: bigint = 0n;
  private firstByteTime: bigint = 0n;
  private responseEnd: bigint = 0n;

  constructor() {
    this.requestStart = process.hrtime.bigint();
  }

  onLookup() {
    this.dnsLookupStart = process.hrtime.bigint();
  }

  onConnect() {
    // DNS lookup is considered done by the time 'connect' fires
    this.dnsLookupEnd = process.hrtime.bigint();
    this.tcpConnectionStart = process.hrtime.bigint();
  }

  onSecureConnect() {
    // TCP connection is done by the time 'secureConnect' fires
    this.tcpConnectionEnd = process.hrtime.bigint();
    this.tlsHandshakeStart = process.hrtime.bigint();
    this.tlsHandshakeEnd = process.hrtime.bigint(); // TLS handshake completed
  }

  onSocket() {
    // For HTTP, 'socket' event indicates connection is established/reused.
    // This fires after 'connect' if a new socket is established.
    this.tcpConnectionEnd = process.hrtime.bigint();
  }

  onFirstByteReceived() {
    this.firstByteTime = process.hrtime.bigint();
  }

  onResponseEnd() {
    this.responseEnd = process.hrtime.bigint();
  }

  getResults(isHttps: boolean): BenchmarkResult {
    const dnsTime = toMilliseconds(this.dnsLookupEnd - this.dnsLookupStart);
    const tcpTime = toMilliseconds(
      this.tcpConnectionEnd - this.tcpConnectionStart,
    );
    const tlsTime = isHttps
      ? toMilliseconds(this.tlsHandshakeEnd - this.tlsHandshakeStart)
      : 0;
    const ttfb = toMilliseconds(this.firstByteTime - this.requestStart);
    const totalTime = toMilliseconds(this.responseEnd - this.requestStart);

    return {
      dnsLookup: dnsTime,
      tcpConnection: tcpTime,
      tlsHandshake: tlsTime,
      timeToFirstByte: ttfb,
      totalTime,
    };
  }
}
