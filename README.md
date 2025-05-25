# ⚡️ Network Response Time Benchmark CLI

A simple, colorful Node.js CLI tool to benchmark website response times — including DNS lookup, TCP connection, TLS handshake, time to first byte, and total time.

## 🚀 Features

- 🔍 Measure DNS lookup, TCP connection, and TLS handshake times
- ⏱ Track time to first byte and total response time
- 🔁 Repeat requests to get an average
- 🔧 Configurable timeout
- 🎨 Stylish terminal output with colors (via Chalk)
- 📦 Lightweight and dependency-friendly

## 📦 Installation

To get started, clone this repository and install the dependencies:

```bash
git clone https://github.com/your-username/network-response-time-benchmark-cli.git
cd network-response-time-benchmark-cli
npm install
```

## 🚀 Usage

You can run the tool using `tsx` for development convenience or by compiling it to JavaScript first.

### Basic Usage

```bash
npx tsx src/index.ts <url> [--repeat <n>]
```

Or, compile to JavaScript:

```bash
npx tsc
node dist/index.js <url> [--repeat <n>]
```

### 📌 Examples

Benchmark a site once (default):

```bash
npx tsx src/index.ts https://www.google.com
```

#### 📊 Example Output:

```bash
Benchmarking https://www.google.com...
Repeating 1 time(s)

Run 1/1: 357.53 ms

--- Average Results ---
DNS Lookup:        88.76 ms
TCP Connection:    40.01 ms
TLS Handshake:     73.88 ms
Time to First Byte: 86.58 ms
Total Time:         357.53 ms
```

Repeat 5 times:

```bash
npx tsx src/index.ts https://www.google.com --repeat 5
```

#### 📊 Example Output:

```bash
Benchmarking https://www.google.com...
Repeating 5 time(s)

Run 1: 123 ms
Run 2: 117 ms
Run 3: 120 ms
Run 4: 119 ms
Run 5: 121 ms

--- Average Results ---
DNS Lookup:     13.20 ms
TCP Connection: 30.60 ms
TLS Handshake:  24.20 ms
TTFB:           85.00 ms
Total Time:     120.00 ms
```

Set a timeout of 5 seconds:

```bash
npx tsx src/index.ts https://www.google.com --timeout 5000
```

## ⚙️ Options

| Option          | Description                        | Default    |
| --------------- | ---------------------------------- | ---------- |
| `<url>`         | Target website to benchmark        | _Required_ |
| `--repeat, -r`  | Number of times to repeat the test | `1`        |
| `--timeout, -t` | Timeout in milliseconds            | `10000`    |

### 📚 Built With

- TypeScript
- Uses built-in Node.js modules: `http`, `https`, `tls`, `perf_hooks`
- CLI powered by [Commander.js](https://github.com/tj/commander.js)
- Colors via [Chalk](https://github.com/chalk/chalk)

### 🧩 Potential Features

- Export results to JSON/CSV
- Terminal charts 📈
- Compare two URLs side by side
- Alert if performance drops below threshold

## 📄 License

MIT License
