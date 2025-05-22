import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';
import { TLSSocket } from 'node:tls';
import { BenchmarkTimer } from '../benchmark-timer';

export function prepareRequest(
  parsedUrl: URL,
  isHttps: boolean,
): {
  requestModule: typeof http | typeof https;
  options: http.RequestOptions | https.RequestOptions;
} {
  const requestModule = isHttps ? https : http;

  const options: http.RequestOptions | https.RequestOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port ? parseInt(parsedUrl.port) : isHttps ? 443 : 80,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'GET',
  };

  return { requestModule, options };
}

export function attachTimingListeners(
  req: http.ClientRequest,
  res: http.IncomingMessage,
  timer: BenchmarkTimer,
  isHttps: boolean,
): void {
  req.on('socket', (socket) => {
    timer.onSocket();

    if (socket.connecting) {
      socket.once('lookup', () => timer.onLookup());
      socket.once('connect', () => timer.onConnect());

      // if (isHttps) {
      //   socket.once('secureConnect', () => timer.onSecureConnect());
      // }

      if (isHttps && socket instanceof TLSSocket) {
        socket.once('secureConnect', () => timer.onSecureConnect());
      }
    }
  });

  req.on('response', () => {
    timer.onFirstByteReceived();
  });

  res.on('data', () => {
    // Data received - can be used for a different TTFB definition if needed
  });

  res.on('end', () => {
    timer.onResponseEnd();
  });
}
